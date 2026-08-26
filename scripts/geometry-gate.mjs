import { createHash } from "node:crypto";
import { readFile, mkdir, rm, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { launchBrowser, openRuntime, REPO_ROOT, startStaticServer } from "./runtime-harness.mjs";

const requestedVariant = process.argv.includes("--variant") ? process.argv[process.argv.indexOf("--variant") + 1] : "enhanced_immersive";
const allowFail = process.argv.includes("--allow-fail");
if (!["baseline_faithful", "enhanced_immersive"].includes(requestedVariant)) {
  throw new Error(`Unsupported variant: ${requestedVariant}`);
}

const visualContract = JSON.parse(await readFile(join(REPO_ROOT, "projects/bonds/contracts/visual-contract.json"), "utf8"));
const viewports = visualContract.geometry_constraints.viewports.map((viewport) => ({
  id: viewport.viewport_id,
  width: viewport.width_px,
  height: viewport.height_px,
  safeInset: viewport.safe_inset_px,
  minimumGap: viewport.minimum_gap_px,
  minimumText: viewport.minimum_text_px,
  maxPrimaryCount: viewport.max_primary_count
}));

const ownerByType = {
  TEXT_TEXT_OVERLAP: "frontend-producer-lienzo",
  TEXT_OBJECT_OVERLAP: "frontend-producer-lienzo",
  CLIPPING: "frontend-producer-lienzo",
  OVERFLOW: "frontend-producer-lienzo",
  MIN_FONT: "visual-director-lienzo + frontend-producer-lienzo",
  CONNECTOR_LABEL_COLLISION: "frontend-producer-lienzo",
  PERSISTENT_DUPLICATE: "motion-director-lienzo + frontend-producer-lienzo",
  EMPTY_STATE: "motion-director-lienzo",
  PROTAGONIST_COMPETITION: "visual-director-lienzo",
  MOTION_DISCONTINUITY: "motion-director-lienzo + frontend-producer-lienzo"
};

const recommendationByType = {
  TEXT_TEXT_OVERLAP: "Reflow labels or increase the owning region gap.",
  TEXT_OBJECT_OVERLAP: "Move the callout or reserve an explicit non-content corridor.",
  CLIPPING: "Move or reflow the element inside the viewport safe area.",
  OVERFLOW: "Remove accidental scroll and constrain the owning layout region.",
  MIN_FONT: "Reduce density or allocate more area; never shrink material text below the viewport floor.",
  CONNECTOR_LABEL_COLLISION: "Reroute or shorten the connector outside foreign label bounds.",
  PERSISTENT_DUPLICATE: "Keep one DOM owner for the persistent identity throughout the beat.",
  EMPTY_STATE: "Restore a visible protagonist and explanatory evidence for the sample.",
  PROTAGONIST_COMPETITION: "Declare and visually privilege exactly one protagonist.",
  MOTION_DISCONTINUITY: "Preserve the persistent node and interpolate its geometry within safe bounds."
};

const server = await startStaticServer();
const browser = await launchBrowser();
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const browserErrors = [];
page.on("pageerror", (error) => browserErrors.push(error.message));
page.on("console", (message) => { if (message.type() === "error") browserErrors.push(message.text()); });

const outputRoot = join(REPO_ROOT, "evidence/geometry", requestedVariant);
await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });
const runs = [];
const allViolations = [];
const screenshots = [];

function slug(value) {
  return String(value).replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").toLowerCase();
}

async function sha256(path) {
  return `sha256:${createHash("sha256").update(await readFile(path)).digest("hex")}`;
}

async function inspectState(viewport) {
  return page.evaluate((policy) => {
    const epsilon = .75;
    const fontTolerance = .9;
    const viewportRect = { left: 0, top: 0, right: innerWidth, bottom: innerHeight, width: innerWidth, height: innerHeight };
    const safeRect = { left: policy.safeInset, top: policy.safeInset, right: innerWidth - policy.safeInset, bottom: innerHeight - policy.safeInset };

    const inheritedOpacity = (element) => {
      let opacity = 1;
      for (let node = element; node && node.nodeType === Node.ELEMENT_NODE; node = node.parentElement) {
        opacity *= Number(getComputedStyle(node).opacity || 1);
      }
      return opacity;
    };
    const isRendered = (element) => {
      const style = getComputedStyle(element);
      if (style.display === "none" || style.visibility === "hidden" || inheritedOpacity(element) <= .035) return false;
      if (style.display === "contents") return [...element.children].some(isRendered);
      const rect = element.getBoundingClientRect();
      return rect.width > .5 && rect.height > .5;
    };
    const rectOf = (element) => {
      const style = getComputedStyle(element);
      if (style.display === "contents") {
        const boxes = [...element.children].filter(isRendered).map((child) => child.getBoundingClientRect());
        if (!boxes.length) return { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 };
        const left = Math.min(...boxes.map((box) => box.left));
        const top = Math.min(...boxes.map((box) => box.top));
        const right = Math.max(...boxes.map((box) => box.right));
        const bottom = Math.max(...boxes.map((box) => box.bottom));
        return { left, top, right, bottom, width: right - left, height: bottom - top };
      }
      const rect = element.getBoundingClientRect();
      return { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height };
    };
    const textRectOf = (element) => {
      if (element instanceof SVGElement) return rectOf(element);
      const range = document.createRange();
      range.selectNodeContents(element);
      const rect = range.getBoundingClientRect();
      return rect.width > .25 && rect.height > .25
        ? { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height }
        : rectOf(element);
    };
    const textFragmentsOf = (element) => {
      if (element instanceof SVGElement) return [rectOf(element)];
      const range = document.createRange();
      range.selectNodeContents(element);
      const fragments = [...range.getClientRects()].filter((rect) => rect.width > .25 && rect.height > .25).map((rect) => ({ left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height }));
      return fragments.length ? fragments : [textRectOf(element)];
    };
    const intersects = (a, b) => {
      const width = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const height = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      return { width, height, area: Math.max(0, width) * Math.max(0, height) };
    };
    const inside = (rect, bounds, tolerance = epsilon) => rect.left >= bounds.left - tolerance && rect.top >= bounds.top - tolerance && rect.right <= bounds.right + tolerance && rect.bottom <= bounds.bottom + tolerance;
    const idOf = (element, prefix, index) => element.dataset.textId || element.dataset.geometryId || element.dataset.persistentId || element.dataset.connector || element.id || `${prefix}-${index}`;
    const effectiveScale = (element) => {
      if (element instanceof SVGGraphicsElement) {
        const matrix = element.getScreenCTM();
        if (!matrix) return 1;
        return Math.min(Math.hypot(matrix.a, matrix.b), Math.hypot(matrix.c, matrix.d));
      }
      let scale = 1;
      for (let node = element; node && node !== document.documentElement; node = node.parentElement) {
        const transform = getComputedStyle(node).transform;
        if (transform && transform !== "none") {
          const matrix = new DOMMatrixReadOnly(transform);
          scale *= Math.min(Math.hypot(matrix.a, matrix.b), Math.hypot(matrix.c, matrix.d));
        }
      }
      return scale;
    };
    const minimumEffectiveFont = (element) => {
      const candidates = [];
      const visit = [element, ...element.querySelectorAll("*")];
      for (const candidate of visit) {
        if (["SUB", "SUP"].includes(candidate.tagName)) continue;
        const hasOwnText = [...candidate.childNodes].some((node) => node.nodeType === Node.TEXT_NODE && (node.textContent || "").trim());
        if (!hasOwnText) continue;
        candidates.push(Number.parseFloat(getComputedStyle(candidate).fontSize) * effectiveScale(candidate));
      }
      return candidates.length ? Math.min(...candidates) : Number.parseFloat(getComputedStyle(element).fontSize) * effectiveScale(element);
    };

    const violations = [];
    const add = (type, ids, measurement, threshold) => {
      const key = `${type}:${[...ids].sort().join("|")}:${JSON.stringify(measurement)}`;
      if (violations.some((item) => item.key === key)) return;
      violations.push({ key, type, ids, measurement, threshold });
    };

    const explicitText = [...document.querySelectorAll("[data-text-id]")];
    const fallbackSvgText = explicitText.length ? [] : [...document.querySelectorAll("svg text")];
    const textElements = [...explicitText, ...fallbackSvgText].filter(isRendered).map((element, index) => {
      return {
        element,
        id: idOf(element, "text", index),
        rect: textRectOf(element),
        fragments: textFragmentsOf(element),
        tier: element.dataset.textTier || "material",
        fontSize: minimumEffectiveFont(element),
        text: (element.textContent || "").trim().replace(/\s+/g, " ")
      };
    }).filter((item) => item.text.length > 0);

    const geometryElements = [...document.querySelectorAll("[data-geometry-id]")].filter(isRendered).map((element, index) => ({
      element,
      id: idOf(element, "geometry", index),
      rect: rectOf(element),
      role: element.dataset.geometryRole || "object"
    }));

    for (const text of textElements) {
      const minimum = text.tier === "metadata" ? Math.min(9.5, policy.minimumText) : policy.minimumText;
      if (text.fontSize + fontTolerance < minimum) {
        add("MIN_FONT", [text.id], { effective_px: Number(text.fontSize.toFixed(2)), tier: text.tier }, { minimum_px: minimum, tolerance_px: fontTolerance });
      }
      if (text.tier !== "metadata" && text.fragments.some((fragment) => !inside(fragment, safeRect))) {
        add("CLIPPING", [text.id], { rect: text.rect, safe_rect: safeRect }, "material text inside safe area");
      } else if (text.fragments.some((fragment) => !inside(fragment, viewportRect))) {
        add("CLIPPING", [text.id], { rect: text.rect, viewport: viewportRect }, "visible text inside viewport");
      }
      const element = text.element;
      const owningRegion = element.closest("[data-geometry-id]");
      if (owningRegion && owningRegion !== element && ["hidden", "clip"].includes(getComputedStyle(owningRegion).overflow)) {
        const ownerRect = rectOf(owningRegion);
        if (text.fragments.some((fragment) => !inside(fragment, ownerRect, 1.5))) {
          add("CLIPPING", [text.id, owningRegion.dataset.geometryId], { text_rect: text.rect, owner_rect: ownerRect }, "text remains inside its clipped owning region");
        }
      }
      const heightTolerance = Math.max(4, Number.parseFloat(getComputedStyle(element).fontSize) * .25);
      if (!(element instanceof SVGElement) && element.clientWidth > 0 && (element.scrollWidth > element.clientWidth + 2 || element.scrollHeight > element.clientHeight + heightTolerance)) {
        add("CLIPPING", [text.id], { client: [element.clientWidth, element.clientHeight], scroll: [element.scrollWidth, element.scrollHeight] }, "scroll dimensions <= client dimensions");
      }
    }

    for (let leftIndex = 0; leftIndex < textElements.length; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < textElements.length; rightIndex += 1) {
        const left = textElements[leftIndex];
        const right = textElements[rightIndex];
        if (left.element.contains(right.element) || right.element.contains(left.element)) continue;
        const overlaps = left.fragments.flatMap((leftRect) => right.fragments.map((rightRect) => ({ overlap: intersects(leftRect, rightRect), smallerArea: Math.min(leftRect.width * leftRect.height, rightRect.width * rightRect.height) })));
        const materialOverlap = overlaps.find(({ overlap, smallerArea }) => overlap.width > 2 && overlap.height > 2 && overlap.area > Math.max(8, smallerArea * .035));
        if (materialOverlap) {
          const { overlap } = materialOverlap;
          add("TEXT_TEXT_OVERLAP", [left.id, right.id], { overlap_px: [Number(overlap.width.toFixed(1)), Number(overlap.height.toFixed(1))] }, { maximum_overlap_area_ratio: .035 });
        }
      }
    }

    for (const text of textElements) {
      for (const object of geometryElements) {
        if (object.role === "container") continue;
        if (object.element.contains(text.element) || text.element.contains(object.element)) continue;
        const materialOverlap = text.fragments.map((fragment) => ({ overlap: intersects(fragment, object.rect), textArea: fragment.width * fragment.height })).find(({ overlap, textArea }) => overlap.width > 3 && overlap.height > 3 && overlap.area > Math.max(12, textArea * .12));
        if (materialOverlap) {
          const { overlap } = materialOverlap;
          add("TEXT_OBJECT_OVERLAP", [text.id, object.id], { overlap_area_px2: Number(overlap.area.toFixed(1)) }, { maximum_text_area_ratio: .12 });
        }
      }
    }

    for (const object of geometryElements) {
      if (!inside(object.rect, safeRect)) {
        add("CLIPPING", [object.id], { rect: object.rect, safe_rect: safeRect }, "geometry inside safe area");
      }
      const element = object.element;
      const style = getComputedStyle(element);
      if (!(element instanceof SVGElement) && ["auto", "scroll"].includes(style.overflow) && element.clientWidth > 0 && (element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1)) {
        add("OVERFLOW", [object.id], { client: [element.clientWidth, element.clientHeight], scroll: [element.scrollWidth, element.scrollHeight] }, "owned region has no internal overflow");
      }
    }

    if (document.documentElement.scrollWidth > innerWidth + 1 || document.documentElement.scrollHeight > innerHeight + 1) {
      add("OVERFLOW", ["document"], { scroll: [document.documentElement.scrollWidth, document.documentElement.scrollHeight], viewport: [innerWidth, innerHeight] }, "document scroll equals viewport");
    }

    const connectors = [...document.querySelectorAll("[data-connector]")].filter(isRendered);
    for (const connector of connectors) {
      if (!(connector instanceof SVGGeometryElement) || typeof connector.getTotalLength !== "function") continue;
      const connectorId = connector.dataset.connector;
      const targetId = connector.dataset.connectorTarget;
      const matrix = connector.getScreenCTM();
      if (!matrix) continue;
      const length = connector.getTotalLength();
      for (let sample = 0; sample <= 30; sample += 1) {
        const point = connector.getPointAtLength(length * sample / 30);
        const screenPoint = new DOMPoint(point.x, point.y).matrixTransform(matrix);
        const collision = textElements.find((text) => text.id !== targetId && screenPoint.x >= text.rect.left - 2 && screenPoint.x <= text.rect.right + 2 && screenPoint.y >= text.rect.top - 2 && screenPoint.y <= text.rect.bottom + 2);
        if (collision) {
          add("CONNECTOR_LABEL_COLLISION", [connectorId, collision.id], { point: [Number(screenPoint.x.toFixed(1)), Number(screenPoint.y.toFixed(1))] }, { clearance_px: 6 });
          break;
        }
      }
    }

    const persistentIds = [...document.querySelectorAll("[data-persistent-id]")].filter(isRendered).map((element) => element.dataset.persistentId);
    const duplicates = [...new Set(persistentIds.filter((id, index) => persistentIds.indexOf(id) !== index))];
    for (const duplicate of duplicates) add("PERSISTENT_DUPLICATE", [duplicate], { visible_instances: persistentIds.filter((id) => id === duplicate).length }, { maximum: 1 });

    const primaryElements = [...document.querySelectorAll('[data-runtime-primary="true"]')].filter(isRendered);
    if (primaryElements.length !== policy.maxPrimaryCount) {
      add("PROTAGONIST_COMPETITION", primaryElements.map((element, index) => idOf(element, "primary", index)), { visible_primary_count: primaryElements.length }, { required: policy.maxPrimaryCount });
    } else {
      const primaryRect = rectOf(primaryElements[0]);
      const primaryAreaRatio = primaryRect.width * primaryRect.height / (innerWidth * innerHeight);
      if (!inside(primaryRect, safeRect) || primaryAreaRatio < .0025) {
        add("PROTAGONIST_COMPETITION", [idOf(primaryElements[0], "primary", 0)], { rect: primaryRect, area_ratio: Number(primaryAreaRatio.toFixed(4)) }, { inside_safe_area: true, minimum_area_ratio: .0025 });
      }
    }

    if (textElements.length < 2 || geometryElements.length < 1 || primaryElements.length === 0) {
      add("EMPTY_STATE", [], { visible_text_count: textElements.length, visible_geometry_count: geometryElements.length, visible_primary_count: primaryElements.length }, { minimum_text: 2, minimum_geometry: 1, minimum_primary: 1 });
    }

    return {
      runtime: window.__LIENZO_RUNTIME__.getState(),
      counts: { text: textElements.length, geometry: geometryElements.length, connectors: connectors.length, persistent: persistentIds.length, primary: primaryElements.length },
      persistent: Object.fromEntries([...document.querySelectorAll("[data-persistent-id]")].filter(isRendered).map((element) => [element.dataset.persistentId, rectOf(element)])),
      primaryIds: primaryElements.map((element, index) => idOf(element, "primary", index)),
      violations: violations.map(({ key, ...violation }) => violation)
    };
  }, viewport);
}

async function captureAnnotated({ viewport, slide, sampleKey, violations, representative }) {
  const targetDirectory = join(outputRoot, viewport.id, slide);
  await mkdir(targetDirectory, { recursive: true });
  const targetPath = join(targetDirectory, `${slug(sampleKey)}.png`);
  const ids = [...new Set(violations.flatMap((violation) => violation.ids))];
  await page.evaluate(({ safeInset, annotationIds, status, label }) => {
    document.querySelector("#geometry-annotation-layer")?.remove();
    const layer = document.createElement("div");
    layer.id = "geometry-annotation-layer";
    Object.assign(layer.style, { position: "fixed", inset: "0", zIndex: "99999", pointerEvents: "none", fontFamily: "ui-monospace, monospace" });
    const safe = document.createElement("div");
    Object.assign(safe.style, { position: "absolute", left: `${safeInset}px`, top: `${safeInset}px`, right: `${safeInset}px`, bottom: `${safeInset}px`, border: `1px dashed ${status === "PASS" ? "rgba(102,255,187,.62)" : "rgba(255,112,122,.72)"}` });
    layer.append(safe);
    const badge = document.createElement("div");
    badge.textContent = `${status} · ${label}`;
    Object.assign(badge.style, { position: "absolute", right: `${safeInset + 4}px`, top: `${safeInset + 4}px`, padding: "6px 9px", borderRadius: "6px", color: "#04111c", background: status === "PASS" ? "#76efb3" : "#ff7b86", fontSize: "11px", fontWeight: "900", letterSpacing: ".04em" });
    layer.append(badge);
    const selectorFor = (id) => `[data-text-id="${CSS.escape(id)}"],[data-geometry-id="${CSS.escape(id)}"],[data-persistent-id="${CSS.escape(id)}"],[data-connector="${CSS.escape(id)}"],#${CSS.escape(id)}`;
    const targets = annotationIds.length ? annotationIds.flatMap((id) => [...document.querySelectorAll(selectorFor(id))]) : [...document.querySelectorAll('[data-runtime-primary="true"]')];
    for (const [index, target] of [...new Set(targets)].entries()) {
      const rect = target.getBoundingClientRect();
      if (!rect.width || !rect.height) continue;
      const box = document.createElement("div");
      Object.assign(box.style, { position: "absolute", left: `${rect.left - 3}px`, top: `${rect.top - 3}px`, width: `${rect.width + 6}px`, height: `${rect.height + 6}px`, border: `2px solid ${status === "PASS" ? "#76efb3" : "#ff6572"}`, borderRadius: "4px", boxShadow: `0 0 0 1px rgba(0,0,0,.8), 0 0 16px ${status === "PASS" ? "rgba(118,239,179,.3)" : "rgba(255,101,114,.4)"}` });
      const marker = document.createElement("span");
      marker.textContent = annotationIds[index] || target.dataset.geometryId || target.dataset.textId || "primary";
      Object.assign(marker.style, { position: "absolute", left: "0", top: "-18px", maxWidth: "220px", overflow: "hidden", color: status === "PASS" ? "#76efb3" : "#ff8d97", fontSize: "9px", fontWeight: "800", whiteSpace: "nowrap" });
      box.append(marker);
      layer.append(box);
    }
    document.body.append(layer);
  }, { safeInset: viewport.safeInset, annotationIds: ids, status: violations.length ? "FAIL" : "PASS", label: `${viewport.id} · ${slide} · ${sampleKey}` });
  await page.screenshot({ path: targetPath });
  await page.evaluate(() => document.querySelector("#geometry-annotation-layer")?.remove());
  const record = {
    path: relative(REPO_ROOT, targetPath),
    sha256: await sha256(targetPath),
    viewport_id: viewport.id,
    slide_id: slide,
    sample_key: sampleKey,
    status: violations.length ? "FAIL" : "PASS",
    representative
  };
  screenshots.push(record);
  return record;
}

try {
  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    for (const slide of ["slide-02", "slide-04"]) {
      await openRuntime(page, server.baseUrl, { variant: requestedVariant, slide, motionScale: 0 });
      const config = await page.evaluate(() => window.__LIENZO_RUNTIME__.getSceneConfig());
      const slideRuns = [];

      for (const hold of config.holds) {
        await page.evaluate((holdId) => window.__LIENZO_RUNTIME__.setHold(holdId), hold.holdId);
        const inspection = await inspectState(viewport);
        const sampleKey = `hold-${hold.holdId}`;
        const run = { sample_type: "stable_hold", sample_key: sampleKey, hold_id: hold.holdId, status: inspection.violations.length ? "FAIL" : "PASS", ...inspection };
        slideRuns.push(run);
      }

      const beatSamples = new Map();
      for (const beat of config.beats) {
        for (const progress of [0, .5, 1]) {
          await page.evaluate(({ beatId, progressValue }) => window.__LIENZO_RUNTIME__.sampleBeat(beatId, progressValue), { beatId: beat.beatId, progressValue: progress });
          const inspection = await inspectState(viewport);
          const sampleKey = `beat-${beat.beatId}-p${String(progress).replace(".", "")}`;
          const run = { sample_type: "beat_sample", sample_key: sampleKey, beat_id: beat.beatId, progress, status: inspection.violations.length ? "FAIL" : "PASS", ...inspection };
          slideRuns.push(run);
          if (!beatSamples.has(beat.beatId)) beatSamples.set(beat.beatId, []);
          beatSamples.get(beat.beatId).push(run);
        }
        await page.evaluate(() => window.__LIENZO_RUNTIME__.clearSample());
      }

      for (const [beatId, samples] of beatSamples) {
        const commonIds = samples.map((sample) => new Set(Object.keys(sample.persistent))).reduce((common, ids) => new Set([...common].filter((id) => ids.has(id))));
        for (const persistentId of commonIds) {
          const rectangles = samples.map((sample) => sample.persistent[persistentId]);
          const maxJump = Math.max(...rectangles.slice(1).map((rect, index) => Math.hypot(rect.left - rectangles[index].left, rect.top - rectangles[index].top)));
          if (maxJump > Math.hypot(viewport.width, viewport.height) * .5) {
            const middle = samples.find((sample) => sample.progress === .5) || samples[0];
            middle.violations.push({ type: "MOTION_DISCONTINUITY", ids: [persistentId], measurement: { maximum_sample_jump_px: Number(maxJump.toFixed(1)) }, threshold: { maximum_viewport_diagonal_ratio: .5 } });
            middle.status = "FAIL";
          }
        }
        const endpointCommon = new Set(Object.keys(samples[0].persistent).filter((id) => Object.hasOwn(samples.at(-1).persistent, id)));
        for (const persistentId of endpointCommon) {
          if (!Object.hasOwn(samples[1].persistent, persistentId)) {
            samples[1].violations.push({ type: "MOTION_DISCONTINUITY", ids: [persistentId], measurement: { missing_at_progress: .5 }, threshold: "persistent endpoint identity remains visible at midpoint" });
            samples[1].status = "FAIL";
          }
        }
      }

      const finalHoldKey = `hold-${config.holds.at(-1).holdId}`;
      for (const run of slideRuns) {
        const shouldCapture = run.status === "FAIL" || run.sample_key === finalHoldKey;
        if (shouldCapture) {
          if (run.sample_type === "stable_hold") await page.evaluate((holdId) => window.__LIENZO_RUNTIME__.setHold(holdId), run.hold_id);
          else await page.evaluate(({ beatId, progressValue }) => window.__LIENZO_RUNTIME__.sampleBeat(beatId, progressValue), { beatId: run.beat_id, progressValue: run.progress });
          const screenshot = await captureAnnotated({ viewport, slide, sampleKey: run.sample_key, violations: run.violations, representative: run.sample_key === finalHoldKey });
          run.screenshot = screenshot;
          for (const violation of run.violations) violation.screenshot = screenshot;
        }
        for (const violation of run.violations) {
          allViolations.push({
            ...violation,
            owner: ownerByType[violation.type],
            recommendation: recommendationByType[violation.type],
            viewport_id: viewport.id,
            slide_id: slide,
            sample_key: run.sample_key,
            hold_id: run.hold_id || null,
            beat_id: run.beat_id || null,
            progress: run.progress ?? null
          });
        }
      }

      runs.push({ viewport_id: viewport.id, slide_id: slide, samples: slideRuns });
    }
  }
} finally {
  await browser.close();
  await server.close();
}

if (browserErrors.length) {
  for (const error of browserErrors) {
    allViolations.push({ type: "OVERFLOW", ids: ["browser-console"], measurement: { error }, threshold: "no browser errors", owner: "frontend-producer-lienzo", recommendation: "Resolve the browser runtime error before geometry acceptance.", viewport_id: null, slide_id: null, sample_key: null, hold_id: null, beat_id: null, progress: null });
  }
}

const violationCounts = Object.fromEntries(Object.keys(ownerByType).map((type) => [type, allViolations.filter((violation) => violation.type === type).length]));
const report = {
  schema_version: "1.0.0",
  generated_at: new Date().toISOString(),
  variant: requestedVariant,
  status: allViolations.length ? "FAIL" : "PASS",
  policy: {
    samples: "every stable hold plus beat start/mid/end",
    viewports,
    font_tiers: { material: "viewport minimum", metadata: "9.5px floor", transient_tolerance_px: .9 },
    allowed_overlaps: visualContract.geometry_constraints.allowed_overlaps
  },
  summary: {
    viewports: viewports.length,
    slides: 2,
    samples: runs.reduce((total, run) => total + run.samples.length, 0),
    violations: allViolations.length,
    violation_counts: violationCounts,
    annotated_screenshots: screenshots.length
  },
  screenshots,
  violations: allViolations,
  runs
};

const reportPath = join(REPO_ROOT, `evidence/geometry/${requestedVariant}-report.json`);
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
process.stdout.write(`Geometry ${report.status} · ${requestedVariant} · ${report.summary.samples} samples · ${allViolations.length} violations\n`);
if (allViolations.length) {
  process.stdout.write(`${Object.entries(violationCounts).filter(([, count]) => count).map(([type, count]) => `${type}=${count}`).join(" · ")}\n`);
}
if (allViolations.length && !allowFail) process.exitCode = 1;
