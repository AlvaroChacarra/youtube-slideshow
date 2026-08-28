import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { course } from "../contracts/lessons";

type ManifestEntry = {
  id: string;
  source_commit: string;
  spec_path: string;
  spec_sha256: string;
  reference_path: string;
  reference_sha256: string;
  used_by: string[];
  essential_claims: string[];
  visual_essence: string[];
  allowed_deltas: string[];
  integrity_status: "verified" | "known-source-defect";
};

const repoRoot = resolve(import.meta.dirname, "../..");
const manifest = JSON.parse(readFileSync(resolve(import.meta.dirname, "../contracts/source-manifest.json"), "utf8")) as { entries: ManifestEntry[] };
const expectedIds = course.sourceIds;
const errors: string[] = [];
const warnings: string[] = [];

function sha256(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function webpStructure(path: string): { validHeader: boolean; declaredBytes: number; actualBytes: number } {
  const bytes = readFileSync(path);
  const validHeader = bytes.length >= 12 && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
  return { validHeader, declaredBytes: validHeader ? bytes.readUInt32LE(4) + 8 : 0, actualBytes: bytes.length };
}

if (manifest.entries.length !== 17) errors.push(`expected 17 entries, found ${manifest.entries.length}`);
if (new Set(manifest.entries.map((entry) => entry.id)).size !== manifest.entries.length) errors.push("source IDs must be unique");
if (JSON.stringify(manifest.entries.map((entry) => entry.id)) !== JSON.stringify(expectedIds)) errors.push("source IDs or order differ from the course contract");

for (const entry of manifest.entries) {
  const spec = resolve(repoRoot, entry.spec_path);
  const reference = resolve(repoRoot, entry.reference_path);
  if (!existsSync(spec)) errors.push(`${entry.id}: missing spec`);
  if (!existsSync(reference)) errors.push(`${entry.id}: missing reference`);
  if (existsSync(spec) && sha256(spec) !== entry.spec_sha256) errors.push(`${entry.id}: spec hash drift`);
  if (existsSync(reference) && sha256(reference) !== entry.reference_sha256) errors.push(`${entry.id}: reference hash drift`);
  if (!entry.used_by.length) errors.push(`${entry.id}: no consumer`);
  if (!entry.essential_claims.length || !entry.visual_essence.length) errors.push(`${entry.id}: editorial mapping incomplete`);
  if (existsSync(reference)) {
    const structure = webpStructure(reference);
    const structurallyValid = structure.validHeader && structure.declaredBytes === structure.actualBytes;
    if (!structurallyValid && entry.integrity_status === "verified") errors.push(`${entry.id}: invalid WebP structure (${structure.actualBytes}/${structure.declaredBytes})`);
    if (entry.integrity_status === "known-source-defect") {
      if (!entry.allowed_deltas.length) errors.push(`${entry.id}: known defect lacks explicit allowed delta`);
      warnings.push(`${entry.id}: canonical visual source requires restoration`);
    }
  }
}

const knownIds = new Set(manifest.entries.map((entry) => entry.id));
for (const lesson of course.lessons) {
  for (const scene of lesson.scenes) {
    if (!scene.sourceRefs.length) errors.push(`${scene.id}: scene has no source`);
    for (const sourceRef of scene.sourceRefs) if (!knownIds.has(sourceRef)) errors.push(`${scene.id}: unknown source ${sourceRef}`);
  }
}

if (warnings.length) console.warn(warnings.map((warning) => `WARN ${warning}`).join("\n"));
if (errors.length) {
  console.error(errors.map((error) => `FAIL ${error}`).join("\n"));
  process.exit(1);
}
console.log(`BOND-CHECK-01 PASS — ${manifest.entries.length}/17 sources mapped; ${warnings.length} canonical asset defects tracked`);
