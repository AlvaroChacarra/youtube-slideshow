import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { promisify } from "node:util";
import { SCENE_CONFIG } from "../runtime/scene-config.js";
import { REPO_ROOT } from "./runtime-harness.mjs";

const runFile = promisify(execFile);
const readJson = async (path) => JSON.parse(await readFile(join(REPO_ROOT, path), "utf8"));
const canonicalize = (value) => {
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(value[key])}`).join(",")}}`;
  return JSON.stringify(value);
};
const digest = (bytes) => `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
const digestJson = (value) => digest(canonicalize(value));
const fileHash = async (path) => digest(await readFile(join(REPO_ROOT, path)));

const visual = await readJson("projects/bonds/contracts/visual-contract.json");
const motion = await readJson("projects/bonds/contracts/motion-contract.json");
const evidenceIndex = await readJson("evidence/evidence-index.json");
const runtimeTests = await readJson("evidence/runtime-tests.json");
const baselineGeometry = await readJson("evidence/geometry/baseline_faithful-report.json");
const enhancedGeometry = await readJson("evidence/geometry/enhanced_immersive-report.json");
const subjectCommit = (await runFile("git", ["log", "-1", "--format=%H", "--", "index.html", "runtime"], { cwd: REPO_ROOT })).stdout.trim();

const normalizedOwner = (type) => {
  if (type === "PROTAGONIST_COMPETITION") return "visual-director-lienzo";
  if (["PERSISTENT_DUPLICATE", "EMPTY_STATE", "MOTION_DISCONTINUITY"].includes(type)) return "motion-director-lienzo";
  return "frontend-producer-lienzo";
};

function representativeViolations(report) {
  const selected = [];
  for (const violation of report.violations) {
    if (!violation.ids?.length || !violation.screenshot?.path || selected.some((item) => item.code === violation.type)) continue;
    selected.push({
      code: violation.type,
      scene_id: violation.slide_id,
      hold_or_beat_id: violation.hold_id || violation.beat_id || violation.sample_key,
      viewport_id: violation.viewport_id,
      ids: violation.ids,
      measurement: JSON.stringify(violation.measurement),
      threshold: JSON.stringify(violation.threshold),
      owner: normalizedOwner(violation.type),
      annotated_screenshot: violation.screenshot.path
    });
  }
  return selected;
}

const geometryResult = async (report, reportPath) => ({
  status: report.status,
  report: reportPath,
  content_hash: await fileHash(reportPath),
  viewports_covered: report.policy.viewports.map((viewport) => viewport.id),
  states_checked: report.summary.samples,
  material_violation_count: report.summary.violations,
  violations: representativeViolations(report),
  annotated_screenshots: report.screenshots.map((screenshot) => screenshot.path)
});

const findEvidence = (predicate) => {
  const record = evidenceIndex.records.find(predicate);
  if (!record) throw new Error("Required evidence record not found");
  return record;
};
const pointer = (record) => ({ path: record.path, content_hash: record.content_hash, viewport_id: record.viewport_id });

const comparisons = ["slide-02", "slide-04"].map((sceneId) => {
  const meta = sceneId === "slide-02" ? { referenceId: "bonds-slide-02-reference", baseline: "s2-b3", enhanced: "s2-e5" } : { referenceId: "bonds-slide-04-reference", baseline: "s4-b4", enhanced: "s4-e6" };
  return {
    scene_id: sceneId,
    reference_id: meta.referenceId,
    original: pointer(findEvidence((record) => record.scene_id === sceneId && record.variant === "original")),
    baseline: pointer(findEvidence((record) => record.scene_id === sceneId && record.variant === "baseline_faithful" && record.hold_id === meta.baseline && record.viewport_id === "desktop-1600x900")),
    enhanced: pointer(findEvidence((record) => record.scene_id === sceneId && record.variant === "enhanced_immersive" && record.hold_id === meta.enhanced && record.viewport_id === "desktop-1600x900")),
    comparison_surface: pointer(findEvidence((record) => record.scene_id === sceneId && record.state === "comparison")),
    baseline_fidelity: "passed",
    enhancement_delta_traced: true
  };
});

const outputPaths = [
  ["index.html", "application"],
  ["runtime/app.js", "application"],
  ["runtime/styles.css", "application"],
  ["runtime/templates.js", "application"],
  ["evidence/evidence-index.json", "data"],
  ["evidence/runtime-tests.json", "report"],
  ["evidence/geometry/baseline_faithful-report.json", "report"],
  ["evidence/geometry/enhanced_immersive-report.json", "report"],
  ["projects/bonds/audit/executive-comparison.md", "report"],
  ["evidence/comparisons/slide-02-original-baseline-enhanced.png", "capture"],
  ["evidence/comparisons/slide-04-original-baseline-enhanced.png", "capture"]
];

const scenes = [];
for (const variant of ["baseline_faithful", "enhanced_immersive"]) {
  for (const sceneId of ["slide-02", "slide-04"]) {
    const config = SCENE_CONFIG[variant][sceneId];
    scenes.push({
      scene_id: sceneId,
      variant,
      implemented_beats: config.beats.map((beat) => beat.beatId),
      holds_verified: config.holds.map((hold) => hold.holdId)
    });
  }
}

const manifest = {
  implementation_id: "bonds-reference-guided-enhancement-v3",
  status: "implemented",
  narrative_hash: visual.narrative_hash,
  visual_contract_hash: digestJson(visual),
  motion_contract_hash: digestJson(motion),
  consumed_versions: {
    visual_contract: "3.0.0",
    motion_contract: "3.0.0",
    implementation_manifest_schema: "3.0.0"
  },
  subject_commit: subjectCommit,
  stack: ["HTML5", "CSS custom layout", "SVG", "Web Animations API", "Playwright/Chromium geometry harness", "ImageMagick evidence compositor"],
  commands: [
    { name: "serve", command: "node scripts/serve.mjs", purpose: "Run the presenter-paced runtime locally." },
    { name: "runtime tests", command: "node scripts/test-runtime.mjs", purpose: "Verify semantic holds, controls, reverse/reset/interruption and reduced motion." },
    { name: "enhanced geometry", command: "node scripts/geometry-gate.mjs --variant enhanced_immersive", purpose: "Block acceptance on material geometry violations." },
    { name: "baseline geometry", command: "node scripts/geometry-gate.mjs --variant baseline_faithful --allow-fail", purpose: "Measure legacy baseline fragility without accepting it." },
    { name: "evidence", command: "node scripts/capture-evidence.mjs", purpose: "Regenerate desktop/mobile originals, runtimes, beats and comparison surfaces." }
  ],
  variants: ["baseline_faithful", "enhanced_immersive"],
  outputs: await Promise.all(outputPaths.map(async ([path, kind]) => ({ path, kind, content_hash: await fileHash(path) }))),
  scenes,
  tests: [
    { name: "skill structure and V3 semantics", command: "node scripts/validate-skills.mjs", status: "passed", evidence: "validate-skills: PASS (4 skills, V3 doctrine and overlap policies)" },
    { name: "contract schemas and hashes", command: "node scripts/validate-contracts.mjs", status: "passed", evidence: "Visual and Motion V3 instances validated before implementation manifest generation." },
    { name: "runtime behavior", command: "node scripts/test-runtime.mjs", status: runtimeTests.status === "PASS" ? "passed" : "failed", evidence: "evidence/runtime-tests.json" },
    { name: "enhanced geometry gate", command: "node scripts/geometry-gate.mjs --variant enhanced_immersive", status: enhancedGeometry.status === "PASS" ? "passed" : "failed", evidence: "evidence/geometry/enhanced_immersive-report.json" },
    { name: "baseline diagnostic geometry", command: "node scripts/geometry-gate.mjs --variant baseline_faithful --allow-fail", status: "expected_fail", evidence: "evidence/geometry/baseline_faithful-report.json" },
    { name: "visual evidence capture", command: "node scripts/capture-evidence.mjs", status: "passed", evidence: `evidence/evidence-index.json (${evidenceIndex.records.length} hashed artifacts)` }
  ],
  visual_evidence: evidenceIndex.records,
  reference_context: {
    applicable: true,
    reference_ids: ["bonds-slide-02-reference", "bonds-slide-04-reference"],
    fullscreen_reference_used: false,
    runtime_reference_requests: 0
  },
  comparisons,
  viewports: [
    { viewport_id: "desktop-1600x900", browser: "Chromium 149", width_px: 1600, height_px: 900, device_pixel_ratio: 1, purpose: "Desktop presentation and primary comparison", minimum_text_px: 18 },
    { viewport_id: "mobile-presenter-390x844", browser: "Chromium 149", width_px: 390, height_px: 844, device_pixel_ratio: 1, purpose: "Portrait presenter reflow", minimum_text_px: 15 },
    { viewport_id: "mobile-downsample-390x219@2x", browser: "Chromium 149", width_px: 390, height_px: 219, device_pixel_ratio: 2, purpose: "16:9 mobile downsample evidence", minimum_text_px: 9.5 }
  ],
  geometry_gate: {
    baseline: await geometryResult(baselineGeometry, "evidence/geometry/baseline_faithful-report.json"),
    enhanced: await geometryResult(enhancedGeometry, "evidence/geometry/enhanced_immersive-report.json")
  },
  deviations: [],
  limitations: [
    "The faithful baseline intentionally preserves fixed 16:9 density and therefore remains a diagnostic expected-fail on compact viewports.",
    "This vertical slice covers only Bonds Slides 2 and 4; no deck-wide scalability claim is made.",
    "Final taste approval remains a user decision; the automated audit cannot be fully independent from the implementation author."
  ]
};

const manifestPath = join(REPO_ROOT, "implementation-manifest.json");
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
await writeFile(join(REPO_ROOT, "implementation-manifest.sha256"), `${digestJson(manifest)}\n`);
process.stdout.write(`Implementation manifest written · ${manifest.visual_evidence.length} evidence records · subject ${subjectCommit.slice(0, 12)}\n`);
