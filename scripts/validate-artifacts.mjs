import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";
import { REPO_ROOT } from "./runtime-harness.mjs";

const runFile = promisify(execFile);
const errors = [];
const issue = (code, target, message) => errors.push({ code, target, message });
const readJson = async (path) => JSON.parse(await readFile(join(REPO_ROOT, path), "utf8"));
const canonicalize = (value) => {
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(value[key])}`).join(",")}}`;
  return JSON.stringify(value);
};
const digest = (bytes) => `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
const digestJson = (value) => digest(canonicalize(value));

async function fileHash(path) {
  const absolute = join(REPO_ROOT, path);
  if (!existsSync(absolute)) {
    issue("MISSING", path, "artifact does not exist");
    return null;
  }
  return digest(await readFile(absolute));
}

async function verifyFile(path, expected) {
  const actual = await fileHash(path);
  if (actual && actual !== expected) issue("HASH", path, `expected ${expected}; received ${actual}`);
}

async function verifyCanonicalSidecar(jsonPath, hashPath) {
  if (!existsSync(join(REPO_ROOT, jsonPath)) || !existsSync(join(REPO_ROOT, hashPath))) {
    issue("SIDECAR", jsonPath, `missing ${hashPath}`);
    return;
  }
  const expected = (await readFile(join(REPO_ROOT, hashPath), "utf8")).trim();
  const actual = digestJson(await readJson(jsonPath));
  if (actual !== expected) issue("SIDECAR", jsonPath, `expected ${expected}; received ${actual}`);
}

const manifest = await readJson("implementation-manifest.json");
const audit = await readJson("projects/bonds/audit/audit-report.json");
const source = await readJson("projects/bonds/source-manifest.json");
const enhancedGeometry = await readJson("evidence/geometry/enhanced_immersive-report.json");
const baselineGeometry = await readJson("evidence/geometry/baseline_faithful-report.json");

for (const output of manifest.outputs) await verifyFile(output.path, output.content_hash);
for (const evidence of manifest.visual_evidence) await verifyFile(evidence.path, evidence.content_hash);
for (const comparison of manifest.comparisons) {
  for (const pointer of [comparison.original, comparison.baseline, comparison.enhanced, comparison.comparison_surface]) await verifyFile(pointer.path, pointer.content_hash);
}
for (const result of [manifest.geometry_gate.baseline, manifest.geometry_gate.enhanced]) {
  await verifyFile(result.report, result.content_hash);
  for (const screenshot of result.annotated_screenshots) await fileHash(screenshot);
}
for (const artifact of audit.evidence.artifacts) await verifyFile(artifact.path, artifact.content_hash);
for (const assessment of audit.comparative_assessment) await verifyFile(assessment.comparison_evidence.path, assessment.comparison_evidence.content_hash);
for (const entry of source.files) await verifyFile(entry.path, entry.content_hash);

await verifyCanonicalSidecar("implementation-manifest.json", "implementation-manifest.sha256");
await verifyCanonicalSidecar("projects/bonds/audit/audit-report.json", "projects/bonds/audit/audit-report.sha256");
await verifyCanonicalSidecar("projects/bonds/contracts/visual-contract.json", "projects/bonds/contracts/visual-contract.sha256");
await verifyCanonicalSidecar("projects/bonds/contracts/motion-contract.json", "projects/bonds/contracts/motion-contract.sha256");

if (enhancedGeometry.status !== "PASS" || enhancedGeometry.summary.violations !== 0 || enhancedGeometry.summary.samples !== 114) {
  issue("GEOMETRY_ENHANCED", "enhanced_immersive-report.json", JSON.stringify(enhancedGeometry.summary));
}
if (baselineGeometry.status !== "FAIL" || baselineGeometry.summary.violations < 1) {
  issue("GEOMETRY_BASELINE", "baseline_faithful-report.json", "diagnostic baseline must expose measured fragility");
}
if (audit.decision !== "GO_ENHANCED_V3" || audit.verdict !== "ready_for_user_review" || audit.blockers.length) {
  issue("AUDIT", "audit-report.json", "expected non-independent GO ready for user review with no blockers");
}
if (audit.independence.fully_independent !== false || audit.required_next_owner !== "user") {
  issue("INDEPENDENCE", "audit-report.json", "same-author audit must disclose user as next owner");
}

const skillDirectories = (await runFile("find", ["skills", "-mindepth", "1", "-maxdepth", "1", "-type", "d", "-printf", "%f\n"], { cwd: REPO_ROOT })).stdout.trim().split("\n").filter(Boolean).sort();
const expectedSkills = ["audita-y-mejora-lienzo-didactico", "frontend-producer-lienzo", "motion-director-lienzo", "visual-director-lienzo"].sort();
if (skillDirectories.join("|") !== expectedSkills.join("|")) issue("SKILLS", "skills/", `received ${skillDirectories.join(", ")}`);

const branch = (await runFile("git", ["branch", "--show-current"], { cwd: REPO_ROOT })).stdout.trim();
const mergeBase = (await runFile("git", ["merge-base", "skill-branch", "HEAD"], { cwd: REPO_ROOT })).stdout.trim();
if (branch !== "v3/immersive-slide-enhancement") issue("BRANCH", branch, "wrong feature branch");
if (mergeBase !== source.base.commit) issue("BASE", mergeBase, `expected ${source.base.commit}`);
try {
  await runFile("git", ["cat-file", "-e", `${manifest.subject_commit}^{commit}`], { cwd: REPO_ROOT });
} catch {
  issue("SUBJECT_COMMIT", manifest.subject_commit, "commit not found");
}

if (errors.length) {
  process.stderr.write(`validate-artifacts: FAIL (${errors.length} error(s))\n`);
  for (const error of errors) process.stderr.write(`${error.code} ${error.target}: ${error.message}\n`);
  process.exit(1);
}

process.stdout.write(`validate-artifacts: PASS · ${manifest.outputs.length} outputs · ${manifest.visual_evidence.length} evidence records · ${enhancedGeometry.summary.samples} enhanced geometry samples\n`);
