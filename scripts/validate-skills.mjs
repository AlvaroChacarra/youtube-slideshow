#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKILLS = [
  "audita-y-mejora-lienzo-didactico",
  "frontend-producer-lienzo",
  "motion-director-lienzo",
  "visual-director-lienzo"
];
const SCHEMAS = [
  "audit-report.schema.json",
  "implementation-manifest.schema.json",
  "motion-contract.schema.json",
  "visual-contract.schema.json"
];
const REQUIRED_SECTIONS = [
  "## Inputs requeridos",
  "## Fuentes de autoridad",
  "## Autoridad exclusiva",
  "## Output canónico",
  "## Workflow obligatorio",
  "## Acciones prohibidas",
  "## Blockers y escalado upstream",
  "## Definition of Done",
  "## Relación con las otras skills"
];
const REQUIRED_SCHEMA_FIELDS = {
  "visual-contract.schema.json": [
    "contract_version",
    "workflow_mode",
    "project_id",
    "narrative_hash",
    "status",
    "direction_id",
    "direction_options",
    "user_approval",
    "global_system",
    "scenes",
    "prohibited_patterns",
    "known_limitations"
  ],
  "motion-contract.schema.json": [
    "contract_version",
    "visual_contract_hash",
    "status",
    "scenes",
    "beats",
    "attention_rules",
    "focus_moments",
    "breathing_moments",
    "continuity_invariants",
    "simultaneity_limits",
    "reduced_motion",
    "global_timing_rules",
    "known_risks"
  ],
  "implementation-manifest.schema.json": [
    "implementation_id",
    "status",
    "narrative_hash",
    "visual_contract_hash",
    "motion_contract_hash",
    "consumed_versions",
    "subject_commit",
    "stack",
    "commands",
    "variants",
    "outputs",
    "scenes",
    "tests",
    "visual_evidence",
    "reference_context",
    "comparisons",
    "viewports",
    "geometry_gate",
    "deviations",
    "limitations"
  ],
  "audit-report.schema.json": [
    "audit_id",
    "subject_commit",
    "implementation_manifest_hash",
    "consumed_versions",
    "independence",
    "evidence",
    "comparative_assessment",
    "scores",
    "geometry_gate",
    "findings",
    "blockers",
    "limitations",
    "verdict",
    "decision",
    "required_next_owner"
  ]
};
const REQUIRED_TERMS = {
  "visual-director-lienzo": [
    "reference_guided_enhancement",
    "enhancement_intent",
    "transformative_delta",
    "aesthetic_system",
    "attention_model",
    "geometry_constraints",
    "baseline_faithful",
    "enhanced_immersive"
  ],
  "motion-director-lienzo": [
    "attention_direction",
    "focus_moments",
    "breathing_moments",
    "continuity_invariants",
    "simultaneity",
    "generic_fade_only",
    "reverse",
    "reset",
    "reduced motion"
  ],
  "frontend-producer-lienzo": [
    "geometry gate",
    "getboundingclientrect",
    "baseline",
    "enhanced",
    "overlap",
    "clipping",
    "responsive",
    "screenshot anotado"
  ],
  "audita-y-mejora-lienzo-didactico": [
    "essential_fidelity",
    "visual_uplift",
    "immersive_uplift",
    "pedagogical_uplift",
    "spatial_robustness",
    "go_enhanced_v3",
    "no_go_enhanced_v3"
  ]
};

const errors = [];
let checkedLinks = 0;
const issue = (code, file, message) => errors.push({ code, file, message });

function read(relative) {
  return fs.readFileSync(path.join(ROOT, relative), "utf8");
}

function listDirectories(relative) {
  const absolute = path.join(ROOT, relative);
  if (!fs.existsSync(absolute)) return [];
  return fs.readdirSync(absolute, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function walk(relative = "") {
  const absolute = path.join(ROOT, relative);
  const output = [];
  for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
    if ([".git", "node_modules"].includes(entry.name)) continue;
    const next = relative ? `${relative}/${entry.name}` : entry.name;
    if (entry.isDirectory()) output.push(...walk(next));
    else if (entry.isFile()) output.push(next);
    else issue("SYMLINK", next, "symlinks and special files are not allowed");
  }
  return output;
}

function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) return null;
  const values = new Map();
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (!field) return null;
    let value = field[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    values.set(field[1], value);
  }
  return values;
}

function collectRefs(value, refs = []) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectRefs(item, refs));
  } else if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      if (key === "$ref" && typeof item === "string") refs.push(item);
      collectRefs(item, refs);
    }
  }
  return refs;
}

function pointerExists(document, pointer) {
  if (!pointer.startsWith("#/")) return true;
  let current = document;
  for (const token of pointer.slice(2).split("/")) {
    const key = token.replace(/~1/g, "/").replace(/~0/g, "~");
    if (!current || typeof current !== "object" || !(key in current)) return false;
    current = current[key];
  }
  return true;
}

function validateMarkdownLinks(files) {
  const pattern = /\[[^\]]*\]\(([^)]+)\)/g;
  for (const file of files.filter((name) => name.endsWith(".md"))) {
    const text = read(file);
    for (const match of text.matchAll(pattern)) {
      const target = match[1].trim().replace(/^<|>$/g, "").split("#")[0].split("?")[0];
      if (!target || /^(?:https?:|mailto:|tel:|data:)/i.test(target)) continue;
      checkedLinks += 1;
      const resolved = path.resolve(path.dirname(path.join(ROOT, file)), decodeURIComponent(target));
      if (!(resolved === ROOT || resolved.startsWith(`${ROOT}${path.sep}`)) || !fs.existsSync(resolved)) {
        issue("BROKEN_LINK", file, `unresolved internal link: ${match[1]}`);
      }
    }
  }
}

function validateSkills() {
  const actual = listDirectories("skills");
  if (actual.join("\n") !== SKILLS.join("\n")) {
    issue("SKILL_COUNT", "skills", `expected exactly ${SKILLS.join(", ")}; received ${actual.join(", ")}`);
  }

  for (const name of SKILLS) {
    const file = `skills/${name}/SKILL.md`;
    if (!fs.existsSync(path.join(ROOT, file))) {
      issue("SKILL_FILE", file, "missing SKILL.md");
      continue;
    }
    const text = read(file);
    const lower = text.toLowerCase();
    const frontmatter = parseFrontmatter(text);
    if (!frontmatter) issue("SKILL_FRONTMATTER", file, "invalid frontmatter");
    else {
      const keys = [...frontmatter.keys()].sort();
      if (keys.join(",") !== "description,name") issue("SKILL_FRONTMATTER", file, "frontmatter must contain only name and description");
      if (frontmatter.get("name") !== name) issue("SKILL_NAME", file, "frontmatter name must match directory");
      if (!frontmatter.get("description")) issue("SKILL_DESCRIPTION", file, "description is empty");
    }
    for (const heading of REQUIRED_SECTIONS) {
      if (!text.includes(`${heading}\n`)) issue("SKILL_SECTION", file, `missing ${heading}`);
    }
    for (const term of REQUIRED_TERMS[name]) {
      if (!lower.includes(term)) issue("SKILL_V3_TERM", file, `missing V3 capability: ${term}`);
    }
    if (!/invocar autom[aá]ticamente/iu.test(text)) issue("NO_AUTO_CHAIN", file, "must prohibit automatic skill invocation");
    if (!/fullscreen/iu.test(text)) issue("FULLSCREEN_POLICY", file, "must reject fullscreen reference implementation");
    if (!/(?:pixel-perfect|pixel perfect)/iu.test(text)) issue("PIXEL_POLICY", file, "must reject pixel-perfect as sole target");
    if (/puede\s+autoaprobar|autoaprobaci[oó]n\s+permitida/iu.test(text)) issue("AUTO_APPROVAL", file, "skill permits auto-approval");
  }
}

function validateSchemas() {
  const actual = fs.readdirSync(path.join(ROOT, "contracts"))
    .filter((name) => name.endsWith(".schema.json"))
    .sort();
  if (actual.join("\n") !== SCHEMAS.join("\n")) {
    issue("SCHEMA_COUNT", "contracts", `expected exactly ${SCHEMAS.join(", ")}`);
  }

  for (const name of SCHEMAS) {
    const file = `contracts/${name}`;
    let schema;
    try {
      schema = JSON.parse(read(file));
    } catch (error) {
      issue("SCHEMA_JSON", file, error.message);
      continue;
    }
    if (schema.$schema !== "https://json-schema.org/draft/2020-12/schema") issue("SCHEMA_DRAFT", file, "must use draft 2020-12");
    if (schema["x-schema-version"] !== "3.0.0") issue("SCHEMA_VERSION", file, "must declare 3.0.0");
    if (schema.type !== "object" || schema.additionalProperties !== false) issue("SCHEMA_STRICT", file, "root must be a strict object");
    const required = new Set(schema.required || []);
    for (const field of REQUIRED_SCHEMA_FIELDS[name]) {
      if (!required.has(field)) issue("SCHEMA_REQUIRED", file, `missing required root field ${field}`);
      if (!(field in (schema.properties || {}))) issue("SCHEMA_PROPERTY", file, `missing property ${field}`);
    }
    for (const ref of collectRefs(schema)) {
      if (!pointerExists(schema, ref)) issue("SCHEMA_REF", file, `unresolved pointer ${ref}`);
    }
  }

  const visual = JSON.parse(read("contracts/visual-contract.schema.json"));
  const modes = visual.properties?.workflow_mode?.enum || [];
  if (!modes.includes("reference_guided_enhancement")) issue("VISUAL_MODE", "contracts/visual-contract.schema.json", "enhancement mode missing");
  for (const field of ["enhancement_intent", "transformative_delta", "aesthetic_system", "attention_model", "geometry_constraints", "comparison_plan"]) {
    if (!(field in visual.properties)) issue("VISUAL_V3_FIELD", "contracts/visual-contract.schema.json", `missing ${field}`);
  }
}

function validateDoctrine() {
  const pipeline = read("contracts/pipeline-contract.md").toLowerCase();
  for (const term of ["reference_guided_enhancement", "geometry gate", "go_enhanced_v3", "no_go_enhanced_v3", "baseline_faithful", "enhanced_immersive"]) {
    if (!pipeline.includes(term)) issue("PIPELINE_V3", "contracts/pipeline-contract.md", `missing ${term}`);
  }
  for (const file of ["docs/premium-aesthetic-doctrine.md", "docs/geometry-gate.md"]) {
    if (!fs.existsSync(path.join(ROOT, file))) issue("DOC_MISSING", file, "required V3 doctrine missing");
  }
  const agents = read("AGENTS.md");
  if (!agents.includes("exactamente las cuatro skills")) issue("AGENTS_INVARIANT", "AGENTS.md", "four-skill invariant missing");
  if (!agents.includes("Slide 2 y Slide 4")) issue("AGENTS_SCOPE", "AGENTS.md", "vertical-slice scope missing");
}

function validateRuntimeScope() {
  const packagePath = path.join(ROOT, "package.json");
  if (fs.existsSync(packagePath)) {
    const manifest = JSON.parse(fs.readFileSync(packagePath, "utf8"));
    if (manifest.dependencies && Object.keys(manifest.dependencies).length) {
      issue("RUNTIME_DEPENDENCY", "package.json", "runtime dependencies are not allowed for this slice");
    }
  }
  const slideRoot = path.join(ROOT, "projects/bonds/slides");
  if (fs.existsSync(slideRoot)) {
    const slides = fs.readdirSync(slideRoot).filter((name) => name.endsWith(".md")).sort();
    const expected = ["02-bond-anatomy.md", "04-discounting-example.md"];
    if (slides.join("\n") !== expected.join("\n")) {
      issue("VERTICAL_SLICE_SCOPE", "projects/bonds/slides", `expected only ${expected.join(", ")}`);
    }
  }
  const runtimeConfig = path.join(ROOT, "runtime/scene-config.js");
  if (fs.existsSync(runtimeConfig)) {
    const text = fs.readFileSync(runtimeConfig, "utf8");
    for (const forbidden of ["slide-01", "slide-03", "slide-05", "slide-06", "slide-07", "slide-08", "slide-09"]) {
      if (text.includes(forbidden)) issue("VERTICAL_SLICE_SCOPE", "runtime/scene-config.js", `unexpected ${forbidden}`);
    }
  }
}

const files = walk();
validateSkills();
validateSchemas();
validateDoctrine();
validateRuntimeScope();
validateMarkdownLinks(files);

if (errors.length) {
  process.stderr.write(`validate-skills: FAIL (${errors.length} error(s))\n`);
  for (const error of errors) process.stderr.write(`${error.code} ${error.file}: ${error.message}\n`);
  process.exit(1);
}

process.stdout.write(`validate-skills: PASS (4 skills, 4 V3 schemas, ${checkedLinks} internal links, doctrine and scope checked)\n`);
