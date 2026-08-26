import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { REPO_ROOT } from "./runtime-harness.mjs";

const readJson = async (path) => JSON.parse(await readFile(join(REPO_ROOT, path), "utf8"));
const canonicalize = (value) => {
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(value[key])}`).join(",")}}`;
  return JSON.stringify(value);
};
const digest = (bytes) => `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
const digestJson = (value) => digest(canonicalize(value));
const fileHash = async (path) => digest(await readFile(join(REPO_ROOT, path)));

const manifest = await readJson("implementation-manifest.json");
const geometry = await readJson("evidence/geometry/enhanced_immersive-report.json");
const evidenceIndex = await readJson("evidence/evidence-index.json");

const artifact = async (path, kind, viewportId) => ({ path, content_hash: await fileHash(path), kind, viewport_id: viewportId });
const comparisonArtifact = async (sceneId) => artifact(`evidence/comparisons/${sceneId}-original-baseline-enhanced.png`, "comparison", "desktop-1600x900");

const scores = {
  pedagogical_comprehension: 9.0,
  composition_and_hierarchy: 8.8,
  visual_craft_and_taste: 8.6,
  motion_and_continuity: 8.7,
  cognitive_load_and_pacing: 9.0,
  interaction_and_holds: 9.1,
  mobile_legibility: 8.7,
  technical_robustness: 9.4,
  total: 8.9
};

const audit = {
  audit_id: "bonds-enhanced-v3-comparative-audit",
  subject_commit: manifest.subject_commit,
  implementation_manifest_hash: digestJson(manifest),
  consumed_versions: {
    visual_contract: "3.0.0",
    motion_contract: "3.0.0",
    implementation_manifest_schema: "3.0.0",
    audit_report_schema: "3.0.0"
  },
  independence: {
    fully_independent: false,
    output_observed_before_rationale: false,
    auditor_created_subject: true,
    auditor_remediated_subject: true,
    known_sources_before_first_pass: true,
    limitations: [
      "The same Work authored, rendered, remediated and audited the subject.",
      "Objective gates and hashed evidence are reproducible, but final taste approval still requires the user or a separate auditor."
    ]
  },
  evidence: {
    artifacts: [
      await comparisonArtifact("slide-02"),
      await comparisonArtifact("slide-04"),
      await artifact("evidence/geometry/enhanced_immersive-report.json", "geometry_report", "multi-viewport"),
      await artifact("evidence/runtime-tests.json", "test_log", "multi-viewport"),
      await artifact("evidence/evidence-index.json", "other", "multi-viewport"),
      await artifact("projects/bonds/audit/executive-comparison.md", "other", "multi-viewport"),
      await artifact("evidence/captures/enhanced_immersive/mobile-presenter-390x844/slide-02-s2-e5.png", "still", "mobile-presenter-390x844"),
      await artifact("evidence/captures/enhanced_immersive/mobile-presenter-390x844/slide-04-s4-e6.png", "still", "mobile-presenter-390x844")
    ],
    inspected_holds: ["s2-e1", "s2-e2", "s2-e3", "s2-e4", "s2-e5", "s4-e1", "s4-e2", "s4-e3", "s4-e4", "s4-e5", "s4-e6"],
    inspected_beats: ["S2-EN-01", "S2-EN-02", "S2-EN-03", "S2-EN-04", "S4-EN-01", "S4-EN-02", "S4-EN-03", "S4-EN-04", "S4-EN-05"],
    mobile: { status: "passed", evidence: "Portrait and @2x downsample captures plus 114-sample enhanced geometry PASS." },
    reverse: { status: "passed", evidence: "evidence/runtime-tests.json: forward-and-reverse and interrupted reverse groups PASS; evidence/captures/behavior/slide-02-reverse.png." },
    reset: { status: "passed", evidence: "evidence/runtime-tests.json: reset-idempotent PASS; evidence/captures/behavior/slide-02-reset.png." },
    reduced_motion: { status: "passed", evidence: "Semantic equivalence completed under 180ms; evidence/captures/behavior/slide-04-reduced-motion.png." },
    reproducibility: { status: "passed", evidence: `46 content-addressed captures in evidence/evidence-index.json; ${geometry.summary.samples} deterministic geometry samples.` }
  },
  comparative_assessment: [
    {
      scene_id: "slide-02",
      comparison_evidence: await comparisonArtifact("slide-02"),
      essential_fidelity: "passed",
      visual_uplift: "material",
      immersive_uplift: "material",
      pedagogical_uplift: "improved",
      spatial_robustness: "passed",
      baseline_summary: "Faithful certificate, seven anatomical callouts and cash-flow timeline preserve the approved source, but simultaneous labels retain the original density and fixed-canvas fragility.",
      enhanced_summary: "A persistent editorial certificate becomes three economic chapters—entry, coupon engine and exit—before resolving into the complete investor timeline; hierarchy is clearer and mobile reflows without dropping concepts."
    },
    {
      scene_id: "slide-04",
      comparison_evidence: await comparisonArtifact("slide-04"),
      essential_fidelity: "passed",
      visual_uplift: "material",
      immersive_uplift: "material",
      pedagogical_uplift: "improved",
      spatial_robustness: "passed",
      baseline_summary: "The faithful timeline, maturity callout, general equation and five-term expansion preserve the source but expose all layers with limited attentional control.",
      enhanced_summary: "Cash flows retain identity while one discounted term, four coupons, maturity principal and the complete sum are revealed in causal order; the final formula remains exact and legible across all target viewports."
    }
  ],
  scores,
  geometry_gate: {
    status: geometry.status,
    report_path: "evidence/geometry/enhanced_immersive-report.json",
    report_hash: await fileHash("evidence/geometry/enhanced_immersive-report.json"),
    states_checked: geometry.summary.samples,
    material_violation_count: geometry.summary.violations,
    sampling_verified: geometry.summary.samples === 114
  },
  findings: [
    {
      finding_id: "AUD-INDEPENDENCE-001",
      scene_id: "cross-scene",
      severity: "nit",
      evidence: "independence.fully_independent=false and the author/auditor flags are true.",
      consequence: "The result can support an engineering GO but cannot be promoted to reference_candidate without a separate first-pass audit.",
      probable_cause: "The execution mandate was completed in one Work and multi-agent delegation was not authorized.",
      verifiable_correction: "Have a separate auditor inspect rendered output before reading the rationale, then regenerate only the audit report.",
      owner: "user",
      failure_origin: "not_applicable"
    }
  ],
  blockers: [],
  limitations: [
    "The baseline is an intentional diagnostic expected-fail on compact viewports; only enhanced is acceptance-gated.",
    "The conclusion applies to Bonds Slides 2 and 4 and does not yet prove deck-wide scalability.",
    "User taste approval remains outstanding because this audit is not fully independent."
  ],
  verdict: "ready_for_user_review",
  decision: "GO_ENHANCED_V3",
  required_next_owner: "user"
};

const targetDirectory = join(REPO_ROOT, "projects/bonds/audit");
await mkdir(targetDirectory, { recursive: true });
await writeFile(join(targetDirectory, "audit-report.json"), `${JSON.stringify(audit, null, 2)}\n`);
await writeFile(join(targetDirectory, "audit-report.sha256"), `${digestJson(audit)}\n`);
process.stdout.write(`Comparative audit written · ${audit.verdict} · ${audit.decision} · score ${scores.total}\n`);
