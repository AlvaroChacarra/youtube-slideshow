#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ajv = new Ajv2020({ allErrors: true, strict: false });
const errors = [];
const issue = (code, target, message) => errors.push({ code, target, message });

function readJson(relative) {
  return JSON.parse(readFileSync(path.join(ROOT, relative), "utf8"));
}

function canonicalize(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function digestBytes(bytes) {
  return `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
}

function digestJson(value) {
  return digestBytes(canonicalize(value));
}

function validateInstance(schemaPath, instancePath) {
  if (!existsSync(path.join(ROOT, instancePath))) return null;
  const schema = readJson(schemaPath);
  const instance = readJson(instancePath);
  const validate = ajv.compile(schema);
  if (!validate(instance)) {
    for (const error of validate.errors || []) {
      issue("SCHEMA_INSTANCE", instancePath, `${error.instancePath || "/"} ${error.message}`);
    }
  }
  return instance;
}

function verifyHash(jsonPath, hashPath) {
  if (!existsSync(path.join(ROOT, jsonPath)) || !existsSync(path.join(ROOT, hashPath))) return null;
  const actual = digestJson(readJson(jsonPath));
  const expected = readFileSync(path.join(ROOT, hashPath), "utf8").trim();
  if (actual !== expected) issue("CONTRACT_HASH", jsonPath, `expected ${expected}; received ${actual}`);
  return actual;
}

function validateSourceManifest() {
  const relative = "projects/bonds/source-manifest.json";
  if (!existsSync(path.join(ROOT, relative))) return;
  const manifest = readJson(relative);
  for (const entry of manifest.files || []) {
    const target = path.join(ROOT, entry.path);
    if (!existsSync(target)) {
      issue("SOURCE_MISSING", relative, entry.path);
      continue;
    }
    const actual = digestBytes(readFileSync(target));
    if (actual !== entry.content_hash) issue("SOURCE_HASH", entry.path, `expected ${entry.content_hash}; received ${actual}`);
  }
  const units = (manifest.files || []).filter((item) => item.unit_id).map((item) => item.unit_id);
  if ([...new Set(units)].sort().join(",") !== "slide-02,slide-04") {
    issue("SOURCE_SCOPE", relative, "only slide-02 and slide-04 are permitted");
  }
}

function validateVisual(visual) {
  if (!visual) return;
  const sceneIds = visual.scenes.map((scene) => scene.scene_id);
  if (sceneIds.sort().join(",") !== "slide-02,slide-04") issue("VISUAL_SCOPE", "visual-contract.json", "expected exactly Slides 2 and 4");

  const enhancedHolds = new Set();
  for (const scene of visual.scenes) {
    const baseline = scene.variants.baseline_faithful.holds;
    const enhanced = scene.variants.enhanced_immersive.holds;
    if (!baseline.length || enhanced.length <= baseline.length) {
      issue("VISUAL_VARIANTS", scene.scene_id, "enhanced must use more deliberate holds than baseline");
    }
    enhanced.forEach((hold) => enhancedHolds.add(`${scene.scene_id}:${hold.hold_id}`));
  }

  const attention = new Set(visual.attention_model.map((step) => `${step.scene_id}:${step.hold_id}`));
  for (const hold of enhancedHolds) {
    if (!attention.has(hold)) issue("ATTENTION_COVERAGE", "visual-contract.json", `missing ${hold}`);
  }
  for (const step of visual.attention_model) {
    if (!enhancedHolds.has(`${step.scene_id}:${step.hold_id}`)) issue("ATTENTION_TARGET", step.hold_id, "attention step targets no enhanced hold");
  }

  for (const delta of visual.transformative_delta) {
    if (!sceneIds.includes(delta.scene_id)) issue("DELTA_SCENE", delta.delta_id, delta.scene_id);
    if (delta.essence_preserved !== true) issue("DELTA_ESSENCE", delta.delta_id, "essence_preserved must be true");
  }

  const planned = new Set(visual.comparison_plan.units.map((item) => item.scene_id));
  for (const sceneId of sceneIds) if (!planned.has(sceneId)) issue("COMPARISON_COVERAGE", "visual-contract.json", sceneId);

  const referenceIds = new Set(visual.reference_bundle.units.map((unit) => unit.reference_id));
  for (const binding of visual.reference_bindings) {
    if (!referenceIds.has(binding.reference_id)) issue("REFERENCE_BINDING", binding.scene_id, binding.reference_id);
  }
}

function validateMotion(motion, visualHash) {
  if (!motion) return;
  if (motion.visual_contract_hash !== visualHash) issue("MOTION_VISUAL_HASH", "motion-contract.json", "visual hash mismatch");
  const beats = new Set();
  for (const beat of motion.beats) {
    if (beats.has(beat.beat_id)) issue("BEAT_DUPLICATE", beat.beat_id, "duplicate beat id");
    beats.add(beat.beat_id);
    const timing = beat.timing;
    if (timing.duration_ms !== timing.preparation_ms + timing.action_ms + timing.resolution_ms) {
      issue("BEAT_TIMING", beat.beat_id, "duration does not equal phase sum");
    }
    if (beat.transition_character.generic_fade_only !== false) issue("FADE_ONLY", beat.beat_id, "generic fade-only transition is forbidden");
    if (beat.simultaneity_limit > motion.simultaneity_limits.global_max_material_changes) {
      issue("SIMULTANEITY", beat.beat_id, "beat exceeds global limit");
    }
  }
  for (const scene of motion.scenes) {
    for (const beatId of scene.beat_ids) if (!beats.has(beatId)) issue("SCENE_BEAT", scene.scene_id, beatId);
  }
  const reduced = new Set(motion.reduced_motion.fallback_by_beat.map((item) => item.beat_id));
  for (const beatId of beats) if (!reduced.has(beatId)) issue("REDUCED_COVERAGE", "motion-contract.json", beatId);
}

function validateManifest(manifest, visualHash, motionHash) {
  if (!manifest) return;
  if (manifest.visual_contract_hash !== visualHash) issue("MANIFEST_VISUAL_HASH", "implementation-manifest.json", "visual hash mismatch");
  if (manifest.motion_contract_hash !== motionHash) issue("MANIFEST_MOTION_HASH", "implementation-manifest.json", "motion hash mismatch");
  if (manifest.status === "implemented" && manifest.geometry_gate.enhanced.status !== "PASS") {
    issue("MANIFEST_GEOMETRY", "implementation-manifest.json", "implemented requires enhanced PASS");
  }
  const compared = manifest.comparisons.map((item) => item.scene_id).sort().join(",");
  if (compared !== "slide-02,slide-04") issue("MANIFEST_COMPARISON", "implementation-manifest.json", "comparisons must cover Slides 2 and 4");
}

function validateAudit(audit, manifestHash) {
  if (!audit) return;
  if (audit.implementation_manifest_hash !== manifestHash) issue("AUDIT_MANIFEST_HASH", "audit-report.json", "manifest hash mismatch");
  const assessed = audit.comparative_assessment.map((item) => item.scene_id).sort().join(",");
  if (assessed !== "slide-02,slide-04") issue("AUDIT_SCOPE", "audit-report.json", "assessment must cover Slides 2 and 4");
  const mean = [
    audit.scores.pedagogical_comprehension,
    audit.scores.composition_and_hierarchy,
    audit.scores.visual_craft_and_taste,
    audit.scores.motion_and_continuity,
    audit.scores.cognitive_load_and_pacing,
    audit.scores.interaction_and_holds,
    audit.scores.mobile_legibility,
    audit.scores.technical_robustness
  ].reduce((sum, value) => sum + value, 0) / 8;
  if (Number(mean.toFixed(1)) !== audit.scores.total) issue("AUDIT_TOTAL", "audit-report.json", `expected ${mean.toFixed(1)}`);
  if (audit.decision === "GO_ENHANCED_V3" && audit.verdict === "revision_required") {
    issue("AUDIT_DECISION", "audit-report.json", "GO is incompatible with revision_required");
  }
}

validateSourceManifest();
const visual = validateInstance("contracts/visual-contract.schema.json", "projects/bonds/contracts/visual-contract.json");
const visualHash = verifyHash("projects/bonds/contracts/visual-contract.json", "projects/bonds/contracts/visual-contract.sha256");
validateVisual(visual);
const motion = validateInstance("contracts/motion-contract.schema.json", "projects/bonds/contracts/motion-contract.json");
const motionHash = verifyHash("projects/bonds/contracts/motion-contract.json", "projects/bonds/contracts/motion-contract.sha256");
validateMotion(motion, visualHash);
const manifest = validateInstance("contracts/implementation-manifest.schema.json", "implementation-manifest.json");
const manifestHash = existsSync(path.join(ROOT, "implementation-manifest.json")) ? digestJson(manifest) : null;
validateManifest(manifest, visualHash, motionHash);
const audit = validateInstance("contracts/audit-report.schema.json", "projects/bonds/audit/audit-report.json");
validateAudit(audit, manifestHash);

if (errors.length) {
  process.stderr.write(`validate-contracts: FAIL (${errors.length} error(s))\n`);
  for (const error of errors) process.stderr.write(`${error.code} ${error.target}: ${error.message}\n`);
  process.exit(1);
}

const instances = [visual, motion, manifest, audit].filter(Boolean).length;
process.stdout.write(`validate-contracts: PASS (${instances} V3 instance(s), hashes and cross-links checked)\n`);
