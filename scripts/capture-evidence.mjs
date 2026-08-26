import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { mkdir, readFile, rename, rm, unlink, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { promisify } from "node:util";
import { launchBrowser, openRuntime, REPO_ROOT, startStaticServer } from "./runtime-harness.mjs";

const runFile = promisify(execFile);
const evidenceRoot = join(REPO_ROOT, "evidence");
const finalCaptureRoot = join(evidenceRoot, "captures");
const finalComparisonRoot = join(evidenceRoot, "comparisons");
const stagingRoot = join(evidenceRoot, `.capture-staging-${process.pid}`);
const captureRoot = join(stagingRoot, "captures");
const comparisonRoot = join(stagingRoot, "comparisons");
await rm(stagingRoot, { recursive: true, force: true });
await mkdir(captureRoot, { recursive: true });
await mkdir(comparisonRoot, { recursive: true });

const server = await startStaticServer();
const records = [];
const browserErrors = [];

const sceneMeta = {
  "slide-02": {
    referenceId: "bonds-slide-02-reference",
    reference: join(REPO_ROOT, "projects/bonds/references/02-bond-anatomy.webp"),
    baselineFinal: "s2-b3",
    enhancedFinal: "s2-e5"
  },
  "slide-04": {
    referenceId: "bonds-slide-04-reference",
    reference: join(REPO_ROOT, "projects/bonds/references/04-discounting-example.webp"),
    baselineFinal: "s4-b4",
    enhancedFinal: "s4-e6"
  }
};

function slug(value) {
  return value.replace(/[^a-zA-Z0-9_-]+/g, "-").toLowerCase();
}

async function hash(path) {
  return `sha256:${createHash("sha256").update(await readFile(path)).digest("hex")}`;
}

async function verifyImage(path) {
  if (path.endsWith(".png")) await runFile("identify", [path]);
}

async function recordArtifact({ path, sceneId, variant, holdId = null, beatId = null, state, viewportId }) {
  await verifyImage(path);
  const canonicalPath = path.startsWith(captureRoot)
    ? join(finalCaptureRoot, relative(captureRoot, path))
    : path.startsWith(comparisonRoot)
      ? join(finalComparisonRoot, relative(comparisonRoot, path))
      : path;
  records.push({
    evidence_id: `ev-${String(records.length + 1).padStart(3, "0")}-${slug(sceneId)}-${slug(state)}`,
    scene_id: sceneId,
    variant,
    hold_id: holdId,
    beat_id: beatId,
    state,
    viewport_id: viewportId,
    path: relative(REPO_ROOT, canonicalPath),
    content_hash: await hash(path)
  });
}

async function screenshot(page, targetPath, metadata) {
  await mkdir(join(targetPath, ".."), { recursive: true });
  await writeFile(targetPath, await page.screenshot());
  await recordArtifact({ path: targetPath, ...metadata });
}

async function useBrowser(viewport, deviceScaleFactor, callback) {
  const browser = await launchBrowser();
  const page = await browser.newPage({ viewport, deviceScaleFactor });
  page.on("pageerror", (error) => browserErrors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") browserErrors.push(message.text()); });
  try {
    await callback(page);
  } finally {
    await browser.close();
  }
}

let promoted = false;
try {
  for (const [sceneId, meta] of Object.entries(sceneMeta)) {
    const originalTarget = join(captureRoot, "original", `${sceneId}-desktop.png`);
    const originalTemporary = `/tmp/lienzo-v3-${sceneId}-original-${process.pid}.png`;
    await mkdir(join(captureRoot, "original"), { recursive: true });
    await runFile("convert", [meta.reference, "-filter", "Lanczos", "-resize", "1600x900!", originalTemporary]);
    await verifyImage(originalTemporary);
    await writeFile(originalTarget, await readFile(originalTemporary));
    await unlink(originalTemporary);
    await recordArtifact({ path: originalTarget, sceneId, variant: "original", state: "original", viewportId: "desktop-1600x900" });
  }

  await useBrowser({ width: 1600, height: 900 }, 1, async (page) => {
    for (const [sceneId, meta] of Object.entries(sceneMeta)) {
      for (const [variant, finalHold] of [["baseline_faithful", meta.baselineFinal], ["enhanced_immersive", meta.enhancedFinal]]) {
        await openRuntime(page, server.baseUrl, { variant, slide: sceneId, hold: finalHold });
        await screenshot(page, join(captureRoot, variant, "desktop-1600x900", `${sceneId}-${finalHold}.png`), { sceneId, variant, holdId: finalHold, state: "hold", viewportId: "desktop-1600x900" });
      }

      await openRuntime(page, server.baseUrl, { variant: "enhanced_immersive", slide: sceneId });
      const config = await page.evaluate(() => window.__LIENZO_RUNTIME__.getSceneConfig());
      for (const hold of config.holds) {
        await page.evaluate((holdId) => window.__LIENZO_RUNTIME__.setHold(holdId), hold.holdId);
        if (hold.holdId === meta.enhancedFinal) continue;
        await screenshot(page, join(captureRoot, "enhanced_immersive", "desktop-1600x900", `${sceneId}-${hold.holdId}.png`), { sceneId, variant: "enhanced_immersive", holdId: hold.holdId, state: "hold", viewportId: "desktop-1600x900" });
      }
      for (const beat of config.beats) {
        await page.evaluate((beatId) => window.__LIENZO_RUNTIME__.sampleBeat(beatId, .5), beat.beatId);
        await screenshot(page, join(captureRoot, "enhanced_immersive", "desktop-1600x900", `${sceneId}-${beat.beatId}-mid.png`), { sceneId, variant: "enhanced_immersive", beatId: beat.beatId, state: "max_change", viewportId: "desktop-1600x900" });
      }
    }

    await openRuntime(page, server.baseUrl, { variant: "enhanced_immersive", slide: "slide-02", hold: "s2-e5", motionScale: .05 });
    await page.evaluate(() => window.__LIENZO_RUNTIME__.previous());
    await page.waitForFunction(() => !window.__LIENZO_RUNTIME__.getState().isTransitioning);
    await screenshot(page, join(captureRoot, "behavior", "slide-02-reverse.png"), { sceneId: "slide-02", variant: "enhanced_immersive", holdId: "s2-e4", beatId: "S2-EN-04", state: "reverse", viewportId: "desktop-1600x900" });
    await page.evaluate(() => { window.__LIENZO_RUNTIME__.setHold("s2-e5"); window.__LIENZO_RUNTIME__.reset(); });
    await screenshot(page, join(captureRoot, "behavior", "slide-02-reset.png"), { sceneId: "slide-02", variant: "enhanced_immersive", holdId: "s2-e1", state: "reset", viewportId: "desktop-1600x900" });
  });

  await useBrowser({ width: 390, height: 844 }, 1, async (page) => {
    for (const [sceneId, meta] of Object.entries(sceneMeta)) {
      for (const [variant, finalHold] of [["baseline_faithful", meta.baselineFinal], ["enhanced_immersive", meta.enhancedFinal]]) {
        await openRuntime(page, server.baseUrl, { variant, slide: sceneId, hold: finalHold });
        await screenshot(page, join(captureRoot, variant, "mobile-presenter-390x844", `${sceneId}-${finalHold}.png`), { sceneId, variant, holdId: finalHold, state: "mobile_presenter", viewportId: "mobile-presenter-390x844" });
      }
      await openRuntime(page, server.baseUrl, { variant: "enhanced_immersive", slide: sceneId });
      const config = await page.evaluate(() => window.__LIENZO_RUNTIME__.getSceneConfig());
      for (const hold of config.holds) {
        if (hold.holdId === meta.enhancedFinal) continue;
        await page.evaluate((holdId) => window.__LIENZO_RUNTIME__.setHold(holdId), hold.holdId);
        await screenshot(page, join(captureRoot, "enhanced_immersive", "mobile-presenter-390x844", `${sceneId}-${hold.holdId}.png`), { sceneId, variant: "enhanced_immersive", holdId: hold.holdId, state: "mobile_presenter", viewportId: "mobile-presenter-390x844" });
      }
    }
    await openRuntime(page, server.baseUrl, { variant: "enhanced_immersive", slide: "slide-04", reducedMotion: true });
    await page.evaluate(() => window.__LIENZO_RUNTIME__.next());
    await screenshot(page, join(captureRoot, "behavior", "slide-04-reduced-motion.png"), { sceneId: "slide-04", variant: "enhanced_immersive", holdId: "s4-e2", beatId: "S4-EN-01", state: "reduced_motion", viewportId: "mobile-presenter-390x844" });
  });

  await useBrowser({ width: 390, height: 219 }, 2, async (page) => {
    for (const [sceneId, meta] of Object.entries(sceneMeta)) {
      for (const [variant, finalHold] of [["baseline_faithful", meta.baselineFinal], ["enhanced_immersive", meta.enhancedFinal]]) {
        await openRuntime(page, server.baseUrl, { variant, slide: sceneId, hold: finalHold });
        await screenshot(page, join(captureRoot, variant, "mobile-downsample-390x219@2x", `${sceneId}-${finalHold}.png`), { sceneId, variant, holdId: finalHold, state: "mobile_downsample", viewportId: "mobile-downsample-390x219@2x" });
      }
    }
  });

  for (const [sceneId, meta] of Object.entries(sceneMeta)) {
    const inputs = [
      { label: "ORIGINAL ESTÁTICA", path: join(captureRoot, "original", `${sceneId}-desktop.png`) },
      { label: "RUNTIME BASELINE", path: join(captureRoot, "baseline_faithful", "desktop-1600x900", `${sceneId}-${meta.baselineFinal}.png`) },
      { label: "ENHANCED IMMERSIVE", path: join(captureRoot, "enhanced_immersive", "desktop-1600x900", `${sceneId}-${meta.enhancedFinal}.png`) }
    ];
    const panels = [];
    for (const [index, input] of inputs.entries()) {
      const panel = `/tmp/lienzo-v3-${sceneId}-panel-${index}-${process.pid}.png`;
      await runFile("convert", [input.path, "-filter", "Lanczos", "-resize", "720x405!", "-background", "#061322", "-gravity", "north", "-splice", "0x48", "-fill", "#e8f3f5", "-pointsize", "24", "-font", "DejaVu-Sans-Bold", "-annotate", "+0+11", input.label, panel]);
      panels.push(panel);
    }
    const comparisonTarget = join(comparisonRoot, `${sceneId}-original-baseline-enhanced.png`);
    const comparisonTemporary = `/tmp/lienzo-v3-${sceneId}-comparison-${process.pid}.png`;
    await runFile("montage", [...panels, "-tile", "3x1", "-geometry", "+10+0", "-background", "#020914", comparisonTemporary]);
    await verifyImage(comparisonTemporary);
    await writeFile(comparisonTarget, await readFile(comparisonTemporary));
    await unlink(comparisonTemporary);
    await Promise.all(panels.map((panel) => unlink(panel)));
    await recordArtifact({ path: comparisonTarget, sceneId, variant: "enhanced_immersive", holdId: meta.enhancedFinal, state: "comparison", viewportId: "desktop-1600x900" });
  }

  if (browserErrors.length) throw new Error(`Browser errors during evidence capture: ${browserErrors.join(" | ")}`);
  await rm(finalCaptureRoot, { recursive: true, force: true });
  await rm(finalComparisonRoot, { recursive: true, force: true });
  await rename(captureRoot, finalCaptureRoot);
  await rename(comparisonRoot, finalComparisonRoot);
  promoted = true;
} finally {
  await server.close();
  await rm(stagingRoot, { recursive: true, force: true });
}

if (!promoted) throw new Error("Evidence staging was not promoted");

const index = {
  schema_version: "1.0.0",
  generated_at: new Date().toISOString(),
  runtime: "Lienzo V3 Bonds vertical slice",
  records
};
await writeFile(join(evidenceRoot, "evidence-index.json"), `${JSON.stringify(index, null, 2)}\n`);
process.stdout.write(`Evidence captured · ${records.length} artifacts\n`);
