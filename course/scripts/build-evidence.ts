import { gzipSync } from "node:zlib";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const assets = path.join(dist, "_astro");
const enforce = process.argv.includes("--enforce");

async function filesBelow(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => entry.isDirectory() ? filesBelow(path.join(directory, entry.name)) : [path.join(directory, entry.name)]));
  return nested.flat();
}

const files = (await filesBelow(assets)).filter((file) => file.endsWith(".js"));
const chunks = await Promise.all(files.map(async (file) => {
  const bytes = await readFile(file);
  return { file: path.relative(dist, file), rawBytes: bytes.byteLength, gzipBytes: gzipSync(bytes).byteLength };
}));
chunks.sort((a, b) => b.gzipBytes - a.gzipBytes);

const chunkByName = new Map(chunks.map((chunk) => [path.basename(chunk.file), chunk]));
const importGraph = new Map<string, string[]>();
for (const chunk of chunks) {
  const source = await readFile(path.join(dist, chunk.file), "utf8");
  const imports = [...source.matchAll(/(?:from\s*|import\s*)["']\.\/([^"']+\.js)["']/g)].map((match) => match[1]!).filter((name) => chunkByName.has(name));
  importGraph.set(path.basename(chunk.file), imports);
}

function staticClosure(entryNames: string[]): typeof chunks {
  const queue = [...entryNames];
  const names = new Set<string>();
  while (queue.length) {
    const current = queue.pop();
    if (!current || names.has(current)) continue;
    names.add(current);
    queue.push(...(importGraph.get(current) ?? []));
  }
  return [...names].map((name) => chunkByName.get(name)).filter((chunk): chunk is (typeof chunks)[number] => Boolean(chunk));
}

const htmlFiles = (await filesBelow(dist)).filter((file) => file.endsWith(".html"));
const pageInitial = await Promise.all(htmlFiles.map(async (file) => {
  const html = await readFile(file, "utf8");
  const entries = [...html.matchAll(/(?:src|href|component-url|renderer-url)="[^"]*\/([^/"?]+\.js)"/g)].map((match) => match[1]!).filter((name) => chunkByName.has(name));
  const initial = staticClosure(entries);
  return { page: path.relative(dist, file), files: initial.map((item) => item.file), gzipBytes: initial.reduce((sum, chunk) => sum + chunk.gzipBytes, 0) };
}));
pageInitial.sort((a, b) => b.gzipBytes - a.gzipBytes);
const initial = pageInitial[0] ?? { page: "none", files: [], gzipBytes: 0 };
const allInitialFiles = new Set(pageInitial.flatMap((page) => page.files));
const largestLessonChunk = chunks.find((chunk) => !allInitialFiles.has(chunk.file)) ?? chunks[0];
const budgets = { initialGzipBytes: 180 * 1024, additionalLessonGzipBytes: 160 * 1024 };
const pass = initial.gzipBytes < budgets.initialGzipBytes && (largestLessonChunk?.gzipBytes ?? 0) < budgets.additionalLessonGzipBytes;
const report = {
  generatedAt: new Date().toISOString(),
  initial,
  pages: pageInitial,
  largestLessonChunk,
  budgets,
  pass,
  note: "LCP and CLS require the browser performance gate; this report enforces static transfer budgets only.",
  chunks
};

await mkdir(path.join(root, "evidence"), { recursive: true });
await writeFile(path.join(root, "evidence", "build-evidence.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(`PERFORMANCE STATIC ${pass ? "PASS" : "FAIL"} — initial ${(initial.gzipBytes / 1024).toFixed(1)} KiB gzip; largest async ${(largestLessonChunk?.gzipBytes ?? 0) / 1024 < 0.1 ? "0.0" : ((largestLessonChunk?.gzipBytes ?? 0) / 1024).toFixed(1)} KiB gzip`);
if (enforce && !pass) process.exitCode = 1;
