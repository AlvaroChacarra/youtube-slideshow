import { build } from "esbuild";
import { readFile, writeFile } from "node:fs/promises";
import { resolve, basename } from "node:path";
import { deliveries } from "../src/delivery/decks.mjs";

const escapeHtml = (text) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
for (const delivery of deliveries) {
  const define = {
    "process.env.NODE_ENV": '"production"',
    "import.meta.env.BASE_URL": '"./"',
  };
  for (const [key, asset] of Object.entries(delivery.assets)) {
    define[`import.meta.env.${key}`] = JSON.stringify(
      `data:${asset.mime};base64,${(await readFile(asset.path)).toString("base64")}`,
    );
  }
  const result = await build({
    entryPoints: [delivery.entry],
    bundle: true,
    write: false,
    format: "iife",
    minify: true,
    jsx: "automatic",
    define,
  });
  const index = await readFile(delivery.page, "utf8");
  // Astro may inline a deck's small stylesheet while linking the shared one.
  // Preserve both kinds in document order so standalone output has identical CSS.
  const styles = [
    ...index.matchAll(
      /<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>|<style\b[^>]*>([\s\S]*?)<\/style>/g,
    ),
  ];
  if (!styles.length) throw new Error(`Missing stylesheet for ${delivery.id}.`);
  let css = "";
  for (const style of styles)
    css += style[1]
      ? await readFile(resolve("dist/_astro", basename(style[1])), "utf8")
      : style[2];
  const urls = [
    ...new Set(
      [...css.matchAll(/url\(([^)]+)\)/g)].map((m) =>
        m[1].replace(/^["']|["']$/g, ""),
      ),
    ),
  ];
  for (const url of urls) {
    if (url.startsWith("data:")) continue;
    const name = basename(url),
      bytes = await readFile(resolve("dist/_astro", name));
    const mime = name.endsWith(".woff2")
      ? "font/woff2"
      : name.endsWith(".woff")
        ? "font/woff"
        : "font/ttf";
    css = css
      .split(url)
      .join(`data:${mime};base64,${bytes.toString("base64")}`);
  }
  const js = result.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#041426"><title>${escapeHtml(delivery.title)}</title><style>${css}</style></head><body><div id="app"></div><noscript>Activa JavaScript para recorrer esta presentación.</noscript><script>${js}</script></body></html>`;
  await writeFile(`dist/${delivery.file}`, html);
  console.log(
    `${delivery.file}: ${(Buffer.byteLength(html) / 1024 / 1024).toFixed(2)} MB, all assets embedded.`,
  );
}
