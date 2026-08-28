import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import sharp, { type OverlayOptions } from "sharp";

const root = process.cwd();
const source = path.join(root, "evidence", "screenshots");
const output = path.join(root, "evidence", "contact-sheets");
const files = (await readdir(source)).filter((file) => /\.(png|webp)$/i.test(file)).sort();
if (files.length === 0) throw new Error(`No screenshots found in ${source}`);

const width = 760;
const imageHeight = 428;
const captionHeight = 44;
const gap = 20;
const columns = 2;
const rows = Math.ceil(files.length / columns);
const canvasWidth = width * columns + gap * (columns + 1);
const canvasHeight = rows * (imageHeight + captionHeight) + gap * (rows + 1);
const composites: OverlayOptions[] = [];

for (const [index, file] of files.entries()) {
  const left = gap + (index % columns) * (width + gap);
  const top = gap + Math.floor(index / columns) * (imageHeight + captionHeight + gap);
  const image = await sharp(path.join(source, file)).resize(width, imageHeight, { fit: "contain", background: "#021322" }).webp({ quality: 88 }).toBuffer();
  const safe = file.replace(/[<&>]/g, "");
  const caption = Buffer.from(`<svg width="${width}" height="${captionHeight}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#071d31"/><text x="14" y="28" fill="#a7b5be" font-family="Arial,sans-serif" font-size="16">${safe}</text></svg>`);
  composites.push({ input: image, left, top }, { input: caption, left, top: top + imageHeight });
}

await mkdir(output, { recursive: true });
await sharp({ create: { width: canvasWidth, height: canvasHeight, channels: 4, background: "#021322" } })
  .composite(composites)
  .webp({ quality: 88 })
  .toFile(path.join(output, "fixed-income-foundations.webp"));
console.log(`CONTACT SHEET PASS — ${files.length} screenshots`);
