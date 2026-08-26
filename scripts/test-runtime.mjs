import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { launchBrowser, openRuntime, REPO_ROOT, startStaticServer } from "./runtime-harness.mjs";

const server = await startStaticServer();
const browser = await launchBrowser();
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const browserErrors = [];
page.on("pageerror", (error) => browserErrors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") browserErrors.push(message.text());
});

const results = [];
const record = (name, details = {}) => results.push({ name, status: "PASS", ...details });

async function visibleStateInspection() {
  return page.evaluate(() => {
    const isRendered = (element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      if (style.display === "contents") {
        return [...element.children].some((child) => {
          const childStyle = getComputedStyle(child);
          const childRect = child.getBoundingClientRect();
          return childStyle.visibility !== "hidden" && Number(childStyle.opacity) > .01 && childRect.width > .5 && childRect.height > .5;
        });
      }
      return style.visibility !== "hidden" && Number(style.opacity) > .01 && rect.width > .5 && rect.height > .5;
    };
    const allPersistent = [...document.querySelectorAll("[data-persistent-id]")].filter(isRendered).map((element) => element.dataset.persistentId);
    const primaries = [...document.querySelectorAll('[data-runtime-primary="true"]')].filter(isRendered).map((element) => element.dataset.motionId || element.dataset.geometryId || element.dataset.persistentId);
    const visibleStateful = [...document.querySelectorAll('.stateful[data-runtime-visible="true"]')].filter(isRendered).length;
    return {
      runtime: window.__LIENZO_RUNTIME__.getState(),
      allPersistent,
      primaries,
      visibleStateful,
      duplicatePersistent: allPersistent.filter((id, index) => allPersistent.indexOf(id) !== index)
    };
  });
}

try {
  for (const viewport of [{ width: 1600, height: 900 }, { width: 390, height: 844 }, { width: 390, height: 219 }]) {
    await page.setViewportSize(viewport);
    for (const variant of ["baseline_faithful", "enhanced_immersive"]) {
      for (const slide of ["slide-02", "slide-04"]) {
        await openRuntime(page, server.baseUrl, { variant, slide, motionScale: .05 });
        const config = await page.evaluate(() => window.__LIENZO_RUNTIME__.getSceneConfig());
        for (const hold of config.holds) {
          await page.evaluate((holdId) => window.__LIENZO_RUNTIME__.setHold(holdId), hold.holdId);
          const inspection = await visibleStateInspection();
          assert.equal(inspection.runtime.holdId, hold.holdId);
          assert.ok(inspection.visibleStateful > 0, `${variant}/${slide}/${hold.holdId} is empty`);
          assert.equal(inspection.duplicatePersistent.length, 0, `${variant}/${slide}/${hold.holdId} duplicates persistent objects`);
          assert.equal(inspection.primaries.length, 1, `${variant}/${slide}/${hold.holdId} must expose exactly one protagonist`);
        }
        record("stable-hold-state", { viewport, variant, slide, holds: config.holds.length });
      }
    }
  }

  await page.setViewportSize({ width: 1600, height: 900 });
  await openRuntime(page, server.baseUrl, { variant: "enhanced_immersive", slide: "slide-02", motionScale: .05 });
  const initial = await page.evaluate(() => window.__LIENZO_RUNTIME__.getState().holdId);
  await page.waitForTimeout(180);
  assert.equal((await page.evaluate(() => window.__LIENZO_RUNTIME__.getState().holdId)), initial, "runtime must not autoplay");
  record("presenter-paced-no-autoplay");

  await page.evaluate(() => window.__LIENZO_RUNTIME__.next());
  await page.waitForFunction(() => !window.__LIENZO_RUNTIME__.getState().isTransitioning);
  assert.equal((await page.evaluate(() => window.__LIENZO_RUNTIME__.getState().holdId)), "s2-e2");
  await page.evaluate(() => window.__LIENZO_RUNTIME__.previous());
  await page.waitForFunction(() => !window.__LIENZO_RUNTIME__.getState().isTransitioning);
  assert.equal((await page.evaluate(() => window.__LIENZO_RUNTIME__.getState().holdId)), "s2-e1");
  record("forward-and-reverse");

  await page.evaluate(() => window.__LIENZO_RUNTIME__.setHold("s2-e5"));
  await page.evaluate(() => window.__LIENZO_RUNTIME__.reset());
  assert.equal((await page.evaluate(() => window.__LIENZO_RUNTIME__.getState().holdId)), "s2-e1");
  record("reset-idempotent");

  await page.evaluate(() => {
    window.__LIENZO_RUNTIME__.setHold("s2-e1");
    void window.__LIENZO_RUNTIME__.next();
    window.setTimeout(() => void window.__LIENZO_RUNTIME__.next(), 4);
  });
  await page.waitForFunction(() => !window.__LIENZO_RUNTIME__.getState().isTransitioning && window.__LIENZO_RUNTIME__.getState().holdId === "s2-e3", null, { timeout: 3000 });
  record("interrupted-forward-settles-to-semantic-target");

  await page.evaluate(() => {
    window.__LIENZO_RUNTIME__.setHold("s2-e1");
    void window.__LIENZO_RUNTIME__.next();
    window.setTimeout(() => void window.__LIENZO_RUNTIME__.previous(), 4);
  });
  await page.waitForFunction(() => !window.__LIENZO_RUNTIME__.getState().isTransitioning && window.__LIENZO_RUNTIME__.getState().holdId === "s2-e1", null, { timeout: 3000 });
  record("interrupted-reverse-settles-to-semantic-target");

  await openRuntime(page, server.baseUrl, { variant: "enhanced_immersive", slide: "slide-04", reducedMotion: true, motionScale: 1 });
  const reducedStart = Date.now();
  await page.evaluate(() => window.__LIENZO_RUNTIME__.next());
  const reducedElapsed = Date.now() - reducedStart;
  assert.equal((await page.evaluate(() => window.__LIENZO_RUNTIME__.getState().holdId)), "s4-e2");
  assert.ok(reducedElapsed < 180, `reduced motion took ${reducedElapsed}ms`);
  record("reduced-motion-semantic-equivalence", { elapsedMs: reducedElapsed });

  await openRuntime(page, server.baseUrl, { variant: "enhanced_immersive", slide: "slide-04", motionScale: .05 });
  const beats = await page.evaluate(() => window.__LIENZO_RUNTIME__.getSceneConfig().beats);
  for (const beat of beats) {
    for (const progress of [0, .5, 1]) {
      const sample = await page.evaluate(({ beatId, progressValue }) => {
        window.__LIENZO_RUNTIME__.sampleBeat(beatId, progressValue);
        const transformed = [...document.querySelectorAll("[data-visible-holds]")].filter((element) => element.style.transform && element.style.transform !== "none").length;
        return { state: window.__LIENZO_RUNTIME__.getState(), transformed };
      }, { beatId: beat.beatId, progressValue: progress });
      assert.equal(sample.state.activeBeat.beatId, beat.beatId);
      if (progress === .5) assert.ok(sample.transformed > 0, `${beat.beatId} lacks meaningful spatial motion`);
    }
    await page.evaluate(() => window.__LIENZO_RUNTIME__.clearSample());
  }
  record("deterministic-beat-sampling", { beats: beats.length, samples: beats.length * 3 });

  const content = await page.textContent("#scene");
  for (const essential of ["Descuento de flujos", "4 €", "104 €", "Precio hoy", "(1+r"] ) {
    assert.ok(content.includes(essential), `essential content missing: ${essential}`);
  }
  record("essential-content-preserved");

  assert.deepEqual(browserErrors, [], `browser errors: ${browserErrors.join(" | ")}`);
  record("browser-console-clean");
} finally {
  await browser.close();
  await server.close();
}

const report = {
  schema_version: "1.0.0",
  generated_at: new Date().toISOString(),
  status: "PASS",
  assertions: results.length,
  results
};
await mkdir(join(REPO_ROOT, "evidence"), { recursive: true });
await writeFile(join(REPO_ROOT, "evidence/runtime-tests.json"), `${JSON.stringify(report, null, 2)}\n`);
process.stdout.write(`Runtime tests PASS · ${results.length} assertion groups\n`);
