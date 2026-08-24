#!/usr/bin/env node

import fs from "node:fs";
import { createHash } from "node:crypto";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const SKILLS = [
  "audita-y-mejora-lienzo-didactico",
  "frontend-producer-lienzo",
  "motion-director-lienzo",
  "visual-director-lienzo",
];

const SCHEMAS = [
  "contracts/audit-report.schema.json",
  "contracts/implementation-manifest.schema.json",
  "contracts/motion-contract.schema.json",
  "contracts/visual-contract.schema.json",
];

const EXPECTED_FILES = [
  ".github/workflows/validate-skills.yml",
  "AGENTS.md",
  "README.md",
  "contracts/audit-report.schema.json",
  "contracts/implementation-manifest.schema.json",
  "contracts/motion-contract.schema.json",
  "contracts/pipeline-contract.md",
  "contracts/visual-contract.schema.json",
  "docs/image-to-code-integration.md",
  "docs/source-map.md",
  "scripts/validate-skills.mjs",
  "skills/README.md",
  ...SKILLS.map((name) => `skills/${name}/SKILL.md`),
].sort();

const EXPECTED_DIRS = new Set(
  EXPECTED_FILES.flatMap((file) => {
    const parts = file.split("/");
    return parts.slice(0, -1).map((_, index) => parts.slice(0, index + 1).join("/"));
  }),
);

const REQUIRED_SECTIONS = [
  "## Inputs requeridos",
  "## Fuentes de autoridad",
  "## Autoridad exclusiva",
  "## Output canónico",
  "## Workflow obligatorio",
  "## Acciones prohibidas",
  "## Blockers y escalado upstream",
  "## Definition of Done",
  "## Relación con las otras skills",
];

const REQUIRED_SCHEMA_FIELDS = {
  "contracts/visual-contract.schema.json": [
    "contract_version",
    "project_id",
    "narrative_hash",
    "status",
    "direction_id",
    "direction_options",
    "user_approval",
    "global_system",
    "anti_defaults",
    "scenes",
    "mobile",
    "prohibited_patterns",
    "known_limitations",
  ],
  "contracts/motion-contract.schema.json": [
    "contract_version",
    "visual_contract_hash",
    "status",
    "scenes",
    "beats",
    "reduced_motion",
    "global_timing_rules",
    "known_risks",
  ],
  "contracts/implementation-manifest.schema.json": [
    "implementation_id",
    "status",
    "narrative_hash",
    "visual_contract_hash",
    "motion_contract_hash",
    "consumed_versions",
    "commit",
    "stack",
    "commands",
    "outputs",
    "scenes",
    "tests",
    "visual_evidence",
    "viewports",
    "deviations",
    "limitations",
  ],
  "contracts/audit-report.schema.json": [
    "audit_id",
    "subject_commit",
    "implementation_manifest_hash",
    "consumed_versions",
    "independence",
    "evidence",
    "scores",
    "findings",
    "blockers",
    "limitations",
    "verdict",
    "required_next_owner",
  ],
};

const SEMVER = /^[0-9]+\.[0-9]+\.[0-9]+$/;
const SHA256 = /^sha256:[a-f0-9]{64}$/;
const GIT_SHA = /^[a-f0-9]{40,64}$/;

const INTEGRATION_SCHEMA_FIELDS = {
  "contracts/visual-contract.schema.json": ["workflow_mode", "reference_bundle", "reference_bindings"],
  "contracts/motion-contract.schema.json": ["reference_anchors"],
  "contracts/implementation-manifest.schema.json": ["reference_context", "reference_comparisons"],
  "contracts/audit-report.schema.json": ["reference_context"],
};

const FORBIDDEN_DIRS = new Set([
  "app",
  "assets",
  "benchmarks",
  "components",
  "fixtures",
  "knowledge-base",
  "node_modules",
  "public",
  "src",
  "styles",
]);

const contaminationTerms = [
  ["bench", "mark/react-", "gsap-svg"].join(""),
  ["bench", "marks/react-", "gsap-svg"].join(""),
  ["react-", "gsap-", "svg"].join(""),
  ["Bond", "Object"].join(""),
  ["Cash", "Flow", "Timeline"].join(""),
  ["Scene", "Header"].join(""),
  ["Yield", "Curve"].join(""),
  ["Scene", "Bond", "Value"].join(""),
  ["Scene", "Curve", "Build"].join(""),
  ["Scene", "Repricing"].join(""),
  ["ADR-001-", "html-runtime-", "canonic"].join(""),
  ["source-", "interactive-teaching-", "canvas"].join(""),
];

const projectSpecificTerms = [
  ["cup", "ón 4% anual"].join(""),
  ["5 a", "ños"].join(""),
  ["valor nominal ", "100"].join(""),
];

const issue = (code, file, message) => ({ code, file, message });

function inventory(root) {
  const files = [];
  const dirs = [];
  const symlinks = [];

  function visit(absolute, relative = "") {
    for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
      if (!relative && entry.name === ".git") continue;
      const rel = relative ? `${relative}/${entry.name}` : entry.name;
      const abs = path.join(absolute, entry.name);
      if (entry.isSymbolicLink()) {
        symlinks.push(rel);
      } else if (entry.isDirectory()) {
        dirs.push(rel);
        visit(abs, rel);
      } else if (entry.isFile()) {
        files.push(rel);
      }
    }
  }

  visit(root);
  return { files: files.sort(), dirs: dirs.sort(), symlinks: symlinks.sort() };
}

function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) return null;
  const fields = new Map();
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (!field) return null;
    let value = field[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    fields.set(field[1], value);
  }
  return fields;
}

function markdownTargets(text) {
  const targets = [];
  const regex = /\[[^\]]*\]\(([^)]+)\)/g;
  for (const match of text.matchAll(regex)) targets.push(match[1].trim());
  return targets;
}

function resolveInternalTarget(root, sourceFile, rawTarget) {
  const withoutTitle = rawTarget.replace(/\s+["'][^"']*["']\s*$/, "");
  const target = withoutTitle.replace(/^<|>$/g, "");
  if (/^(?:https?:|mailto:|tel:|data:)/i.test(target) || target.startsWith("#")) return null;
  const clean = decodeURIComponent(target.split("#")[0].split("?")[0]);
  if (!clean) return null;
  return path.resolve(path.dirname(path.join(root, sourceFile)), clean);
}

function repositoryReferences(text) {
  const references = [];
  const regex = /(?:^|[\s"'(])((?:\.{1,2}\/|(?:contracts|docs|scripts|skills|\.github)\/)[a-zA-Z0-9_./-]+\.(?:md|json|mjs|ya?ml))/gm;
  for (const match of text.matchAll(regex)) references.push(match[1]);
  return references;
}

function section(text, heading) {
  const start = text.indexOf(`${heading}\n`);
  if (start < 0) return "";
  const bodyStart = start + heading.length + 1;
  const rest = text.slice(bodyStart);
  const next = rest.search(/^##\s+/m);
  return next < 0 ? rest : rest.slice(0, next);
}

function collectRefs(value, refs = []) {
  if (Array.isArray(value)) {
    for (const item of value) collectRefs(item, refs);
  } else if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      if (key === "$ref" && typeof item === "string") refs.push(item);
      collectRefs(item, refs);
    }
  }
  return refs;
}

function resolveJsonPointer(document, pointer) {
  if (!pointer.startsWith("#/")) return true;
  let current = document;
  for (const token of pointer.slice(2).split("/")) {
    const key = token.replace(/~1/g, "/").replace(/~0/g, "~");
    if (!current || typeof current !== "object" || !(key in current)) return false;
    current = current[key];
  }
  return true;
}

function validate(root) {
  const errors = [];
  const metrics = { links: 0 };
  const tree = inventory(root);
  const expectedFiles = new Set(EXPECTED_FILES);

  for (const symlink of tree.symlinks) {
    errors.push(issue("TREE_SYMLINK", symlink, "symlinks are not allowed"));
  }
  for (const file of EXPECTED_FILES) {
    if (!tree.files.includes(file)) errors.push(issue("TREE_MISSING", file, "required file is missing"));
  }
  for (const file of tree.files) {
    if (!expectedFiles.has(file)) errors.push(issue("TREE_UNEXPECTED", file, "file is outside the canonical tree"));
  }
  for (const dir of tree.dirs) {
    if (!EXPECTED_DIRS.has(dir)) errors.push(issue("TREE_UNEXPECTED", dir, "directory is outside the canonical tree"));
    if (FORBIDDEN_DIRS.has(path.basename(dir))) {
      errors.push(issue("FRONTEND_FORBIDDEN", dir, "frontend, fixture, or inherited directory is forbidden"));
    }
  }

  for (const file of tree.files) {
    const base = path.basename(file).toLowerCase();
    if (
      base === "package.json" ||
      base === "package-lock.json" ||
      base === "pnpm-lock.yaml" ||
      base === "yarn.lock" ||
      base === "bun.lock" ||
      base === "bun.lockb"
    ) {
      errors.push(issue("NPM_DEPENDENCY", file, "npm manifests and dependency locks are forbidden"));
    }
    if (/^(?:design|narrative)\.md$/i.test(base) || /(?:bond|bono)/i.test(base)) {
      errors.push(issue("DESIGN_FORBIDDEN", file, "design or production-narrative file is forbidden"));
    }
  }

  const skillRoot = path.join(root, "skills");
  const actualSkillDirs = fs.existsSync(skillRoot)
    ? fs
        .readdirSync(skillRoot, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort()
    : [];
  if (actualSkillDirs.length !== 4 || actualSkillDirs.join("\n") !== SKILLS.join("\n")) {
    errors.push(issue("SKILL_COUNT", "skills", "exactly the four canonical skill directories must exist"));
  }

  const skillTexts = new Map();
  for (const name of SKILLS) {
    const relative = `skills/${name}/SKILL.md`;
    const absolute = path.join(root, relative);
    if (!fs.existsSync(absolute)) {
      errors.push(issue("SKILL_FILE", relative, "SKILL.md is missing"));
      continue;
    }
    const text = fs.readFileSync(absolute, "utf8");
    skillTexts.set(name, text);
    const frontmatter = parseFrontmatter(text);
    if (!frontmatter) {
      errors.push(issue("SKILL_FRONTMATTER", relative, "frontmatter is missing or invalid"));
    } else {
      const keys = [...frontmatter.keys()].sort();
      if (keys.join(",") !== "description,name") {
        errors.push(issue("SKILL_FRONTMATTER", relative, "frontmatter must contain only name and description"));
      }
      if (frontmatter.get("name") !== name) {
        errors.push(issue("SKILL_NAME", relative, "frontmatter name must match its directory"));
      }
      if (!frontmatter.get("description")) {
        errors.push(issue("SKILL_DESCRIPTION", relative, "description must be non-empty"));
      }
    }
    for (const heading of REQUIRED_SECTIONS) {
      if (!text.includes(`${heading}\n`)) {
        errors.push(issue("SKILL_SECTION", relative, `missing required section: ${heading}`));
      }
    }
    if (!/invocar autom[aá]ticamente/iu.test(section(text, "## Acciones prohibidas"))) {
      errors.push(issue("SKILL_NO_CHAINING", relative, "prohibited actions must forbid automatic skill invocation"));
    }
    if (
      /puede\s+autoaprobar(?:se|\s+el\s+trabajo)?|autoaprobaci[oó]n\s+(?:permitida|autom[aá]tica|habilitada)|auto[_ -]?approv(?:al|e)\s*[:=]\s*true/iu.test(
        text,
      )
    ) {
      errors.push(issue("AUTO_APPROVAL", relative, "skill declares or permits auto-approval"));
    }
    if (
      /requiere\s+(?:la\s+)?skill\s+externa[^\n]*instalada|depend(?:e|er)\s+de\s+(?:una\s+)?skill\s+externa|instalar\s+(?:una\s+|la\s+)?skill\s+externa/iu.test(
        text,
      )
    ) {
      errors.push(issue("EXTERNAL_RUNTIME_SKILL", relative, "external installed skills cannot be runtime requirements"));
    }
    if (!/fullscreen/iu.test(text)) {
      errors.push(issue("REFERENCE_FULLSCREEN_POLICY", relative, "skill must reject fullscreen reference rendering as implementation"));
    }
    if (!/(?:pixel-perfect|identidad de p[ií]xel)/iu.test(text)) {
      errors.push(issue("REFERENCE_PIXEL_POLICY", relative, "skill must reject pixel identity as the sole fidelity target"));
    }
    if (/(?<!no )\b(?:la skill\s+)?exige\s+(?:fidelidad\s+)?pixel-perfect/iu.test(text)) {
      errors.push(issue("SKILL_PIXEL_PERFECT", relative, "skill cannot require pixel-perfect fidelity"));
    }
    if (/fullscreen\s+(?:s[ií]\s+)?constituye\s+implementaci[oó]n/iu.test(text)) {
      errors.push(issue("SKILL_FULLSCREEN", relative, "skill cannot authorize a fullscreen reference as implementation"));
    }
    if (/la imagen\s+es\s+la\s+[uú]nica\s+fuente\s+sem[aá]ntica/iu.test(text)) {
      errors.push(issue("SKILL_SEMANTIC_IMAGE", relative, "skill cannot make pixels the sole semantic authority"));
    }
  }

  const ownership = [
    { label: "composition", pattern: /composici[oó]n/iu, owner: "visual-director-lienzo" },
    { label: "timing", pattern: /\btiming\b/iu, owner: "motion-director-lienzo" },
    { label: "implementation", pattern: /implementaci[oó]n/iu, owner: "frontend-producer-lienzo" },
    { label: "verdict", pattern: /veredicto/iu, owner: "audita-y-mejora-lienzo-didactico" },
  ];
  for (const rule of ownership) {
    for (const name of SKILLS) {
      const authority = section(skillTexts.get(name) || "", "## Autoridad exclusiva");
      const positiveAuthority = authority.split(/\nNo decide\b/iu)[0];
      const owns = rule.pattern.test(positiveAuthority);
      if (name === rule.owner && !owns) {
        errors.push(issue("AUTHORITY_OWNER", `skills/${name}/SKILL.md`, `owner does not declare ${rule.label}`));
      } else if (name !== rule.owner && owns) {
        errors.push(issue("AUTHORITY_EXCLUSIVE", `skills/${name}/SKILL.md`, `${rule.label} is owned only by ${rule.owner}`));
      }
    }
  }

  const schemaFiles = tree.files.filter((file) => /^contracts\/[^/]+\.schema\.json$/.test(file));
  if (schemaFiles.length !== 4 || schemaFiles.sort().join("\n") !== SCHEMAS.join("\n")) {
    errors.push(issue("SCHEMA_COUNT", "contracts", "exactly four canonical JSON schemas must exist"));
  }
  for (const relative of SCHEMAS) {
    const absolute = path.join(root, relative);
    if (!fs.existsSync(absolute)) continue;
    let schema;
    try {
      schema = JSON.parse(fs.readFileSync(absolute, "utf8"));
    } catch (error) {
      errors.push(issue("SCHEMA_JSON", relative, `invalid JSON: ${error.message}`));
      continue;
    }
    if (schema.$schema !== "https://json-schema.org/draft/2020-12/schema" || schema.type !== "object") {
      errors.push(issue("SCHEMA_META", relative, "schema must declare draft 2020-12 and object root"));
    }
    if (typeof schema.$id !== "string" || !schema.$id.endsWith(`/${path.basename(relative)}`)) {
      errors.push(issue("SCHEMA_ID", relative, "schema must declare its canonical repository $id"));
    }
    if (!SEMVER.test(schema["x-schema-version"] || "")) {
      errors.push(issue("SCHEMA_VERSION", relative, "schema must declare a SemVer x-schema-version"));
    }
    if (schema["x-schema-version"] !== "2.1.0") {
      errors.push(issue("SCHEMA_INTEGRATION_VERSION", relative, "Image-to-Code integration schemas must declare version 2.1.0"));
    }
    if (schema.additionalProperties !== false) {
      errors.push(issue("SCHEMA_ROOT_STRICT", relative, "schema root must reject undeclared properties"));
    }
    const required = new Set(schema.required || []);
    for (const field of REQUIRED_SCHEMA_FIELDS[relative]) {
      if (!required.has(field)) errors.push(issue("SCHEMA_FIELD", relative, `missing required root field: ${field}`));
      if (!schema.properties || !(field in schema.properties)) {
        errors.push(issue("SCHEMA_PROPERTY", relative, `missing root property definition: ${field}`));
      }
    }
    for (const ref of collectRefs(schema)) {
      if (ref.startsWith("#/") && !resolveJsonPointer(schema, ref)) {
        errors.push(issue("SCHEMA_REF", relative, `unresolved local JSON pointer: ${ref}`));
      }
    }
    for (const field of INTEGRATION_SCHEMA_FIELDS[relative] || []) {
      if (!schema.properties || !(field in schema.properties)) {
        errors.push(issue("SCHEMA_INTEGRATION_FIELD", relative, `missing Image-to-Code property: ${field}`));
      }
    }
    if (
      relative === "contracts/audit-report.schema.json" &&
      !schema.$defs?.evidence?.properties?.reference_fidelity
    ) {
      errors.push(issue("SCHEMA_INTEGRATION_FIELD", relative, "missing evidence.reference_fidelity"));
    }
    if (relative === "contracts/audit-report.schema.json") {
      for (const field of [
        "semantic_sources_hidden_first_pass",
        "contracts_hidden_first_pass",
        "reference_hidden_first_pass",
      ]) {
        if (!schema.$defs?.independence?.properties?.[field]) {
          errors.push(issue("SCHEMA_INTEGRATION_FIELD", relative, `missing independence.${field}`));
        }
      }
    }
    if (
      relative === "contracts/visual-contract.schema.json" &&
      !schema.$defs?.userApproval?.properties?.supplemental_approvals
    ) {
      errors.push(issue("SCHEMA_INTEGRATION_FIELD", relative, "missing user_approval.supplemental_approvals"));
    }
    if (
      relative === "contracts/implementation-manifest.schema.json" &&
      !schema.$defs?.referenceComparison?.properties?.scene_id
    ) {
      errors.push(issue("SCHEMA_INTEGRATION_FIELD", relative, "missing reference_comparison.scene_id"));
    }
  }

  for (const relative of tree.files.filter((file) => file.endsWith(".md"))) {
    const text = fs.readFileSync(path.join(root, relative), "utf8");
    for (const target of markdownTargets(text)) {
      const resolved = resolveInternalTarget(root, relative, target);
      if (!resolved) continue;
      metrics.links += 1;
      const withinRoot = resolved === root || resolved.startsWith(`${root}${path.sep}`);
      if (!withinRoot || !fs.existsSync(resolved)) {
        errors.push(issue("BROKEN_LINK", relative, `unresolved internal link: ${target}`));
      }
    }
    for (const reference of repositoryReferences(text)) {
      const resolved = reference.startsWith("../") || reference.startsWith("./")
        ? path.resolve(path.dirname(path.join(root, relative)), reference)
        : path.resolve(root, reference);
      if (!fs.existsSync(resolved)) {
        errors.push(issue("MISSING_REFERENCE", relative, `referenced repository file does not exist: ${reference}`));
      }
    }
  }

  for (const relative of tree.files.filter((file) => /\.(?:mjs|js|cjs)$/i.test(file))) {
    const text = fs.readFileSync(path.join(root, relative), "utf8");
    const imports = [
      ...text.matchAll(/\bfrom\s+["']([^"']+)["']/g),
      ...text.matchAll(/\bimport\s*\(\s*["']([^"']+)["']\s*\)/g),
      ...text.matchAll(/\brequire\s*\(\s*["']([^"']+)["']\s*\)/g),
    ].map((match) => match[1]);
    for (const specifier of imports) {
      if (!specifier.startsWith("node:") && !specifier.startsWith("./") && !specifier.startsWith("../")) {
        errors.push(issue("NPM_IMPORT", relative, `external module import is forbidden: ${specifier}`));
      }
    }
  }

  for (const relative of tree.files) {
    const absolute = path.join(root, relative);
    const text = fs.readFileSync(absolute, "utf8");
    for (const [index, term] of contaminationTerms.entries()) {
      if (text.toLowerCase().includes(term.toLowerCase())) {
        errors.push(issue("CONTAMINATION", relative, `contains a forbidden prior-benchmark identifier (#${index + 1})`));
      }
    }
    for (const [index, term] of projectSpecificTerms.entries()) {
      if (text.toLowerCase().includes(term.toLowerCase())) {
        errors.push(issue("PROJECT_CONTAMINATION", relative, `contains project-specific reference content (#${index + 1})`));
      }
    }
  }

  const workflow = path.join(root, ".github/workflows/validate-skills.yml");
  if (fs.existsSync(workflow)) {
    const text = fs.readFileSync(workflow, "utf8");
    const workflowChecks = [
      [/push:[\s\S]*branches:[\s\S]*skill-branch/m, "push to skill-branch"],
      [/pull_request:[\s\S]*branches:[\s\S]*skill-branch/m, "pull request targeting skill-branch"],
      [/workflow_dispatch:/, "manual dispatch"],
      [/actions\/checkout@v4/, "checkout v4"],
      [/actions\/setup-node@v4/, "setup-node v4"],
      [/node scripts\/validate-skills\.mjs/, "validator command"],
    ];
    for (const [pattern, label] of workflowChecks) {
      if (!pattern.test(text)) errors.push(issue("CI_CONTRACT", ".github/workflows/validate-skills.yml", `missing ${label}`));
    }
    if (/\bnpm\s+(?:install|ci)\b/.test(text)) {
      errors.push(issue("NPM_DEPENDENCY", ".github/workflows/validate-skills.yml", "CI must not install npm dependencies"));
    }
  }

  return { errors, metrics };
}

function copyFixture(source, destination) {
  for (const relative of EXPECTED_FILES) {
    const from = path.join(source, relative);
    if (!fs.existsSync(from)) continue;
    const to = path.join(destination, relative);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
  }
}

function replaceIn(root, relative, search, replacement) {
  const absolute = path.join(root, relative);
  const text = fs.readFileSync(absolute, "utf8");
  if (!text.includes(search)) throw new Error(`negative fixture could not find marker in ${relative}`);
  fs.writeFileSync(absolute, text.replace(search, replacement));
}

function appendTo(root, relative, content) {
  fs.appendFileSync(path.join(root, relative), content);
}

function digest(value) {
  return `sha256:${createHash("sha256").update(value).digest("hex")}`;
}

function writeIntegrationArtifact(root, relative, content) {
  const absolute = path.join(root, relative);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, content);
  return { path: relative, content_hash: digest(content) };
}

function buildIntegrationFixture(root, { mode = "approved_reference", unitCount = 1 } = {}) {
  const policies = {
    require_pixel_perfect: false,
    fullscreen_reference_is_implementation: false,
  };

  if (mode === "concept_first") {
    return {
      root,
      policies,
      visual: {
        contract_version: "2.0.0",
        status: "approved",
        direction_options: ["direction-a", "direction-b", "direction-c"],
        scenes: [{ scene_id: "scene-01", holds: [{ hold_id: "hold-final" }] }],
      },
      motion: {},
      implementation: {},
      audit: { verdict: "ready_for_user_review" },
    };
  }

  const design = writeIntegrationArtifact(root, "design/DESIGN.md", "# Global design doctrine\n");
  const project = writeIntegrationArtifact(root, "projects/example/PROJECT.md", "# Project narrative\n");
  const units = [];
  const bindings = [];
  const scenes = [];
  const anchors = [];
  const comparisons = [];
  const auditComparisons = [];

  for (let index = 1; index <= unitCount; index += 1) {
    const suffix = String(index).padStart(2, "0");
    const unitId = `unit-${suffix}`;
    const referenceId = `reference-${suffix}`;
    const sceneId = `scene-${suffix}`;
    const holdId = `hold-${suffix}-final`;
    const semanticSpec = writeIntegrationArtifact(
      root,
      `projects/example/slides/${unitId}.md`,
      `# ${unitId}\n\nGeneric pedagogical objective.\n`,
    );
    const perceptualReference = {
      reference_id: referenceId,
      ...writeIntegrationArtifact(
        root,
        `projects/example/references/${unitId}.webp`,
        Buffer.from(`synthetic-reference-${unitId}`),
      ),
      media_type: "image/webp",
    };

    units.push({
      unit_id: unitId,
      semantic_spec: semanticSpec,
      perceptual_reference: perceptualReference,
      approval_reference: `approval://${unitId}`,
      reference_role: "key_hold",
      element_classification: [
        {
          element_id: `text-${suffix}`,
          role: "semantic label",
          render_mode: "code_native",
          rationale: "Editable semantic text",
          source_provenance: null,
        },
      ],
    });
    bindings.push({
      reference_id: referenceId,
      scene_id: sceneId,
      hold_ids: [holdId],
      required_perceptual_properties: ["protagonist", "hierarchy", "spatial ownership"],
      mutable_properties: ["responsive spacing"],
      conceptual_tolerances: ["font rasterization may differ"],
      uncovered_parts: ["intermediate motion states"],
    });
    scenes.push({ scene_id: sceneId, holds: [{ hold_id: holdId }] });
    anchors.push({
      reference_id: referenceId,
      scene_id: sceneId,
      hold_id: holdId,
      keyframe_role: "target_keyframe",
      perceptual_invariants: ["protagonist", "hierarchy", "spatial ownership"],
      mutable_in_motion: ["intermediate position"],
      material_composition_preserved: true,
    });
    const screenshotHash = digest(`browser-screenshot-${unitId}`);
    comparisons.push({
      reference_id: referenceId,
      reference_hash: perceptualReference.content_hash,
      screenshot_hash: screenshotHash,
      scene_id: sceneId,
      viewport_id: "desktop-capture",
      hold_id: holdId,
      status: "passed",
      comparison_methods: ["perceptual_comparison", "dom_geometry"],
      pixel_diff_only: false,
      fullscreen_reference_used: false,
      reconstruction_evidence: ["Editable DOM/SVG inspection"],
      material_differences: [],
    });
    auditComparisons.push({
      reference_id: referenceId,
      semantic_spec_hash: semanticSpec.content_hash,
      reference_hash: perceptualReference.content_hash,
      output_hash: screenshotHash,
      scene_id: sceneId,
      hold_id: holdId,
      viewport_id: "desktop-capture",
      semantic_fidelity: "passed",
      perceptual_fidelity: "passed",
      failure_origin: "none",
      evidence: "Output preserves the bound semantic and perceptual properties.",
    });
  }

  return {
    root,
    policies,
    visual: {
      contract_version: "2.1.0",
      workflow_mode: "approved_reference",
      status: "approved",
      direction_options: [],
      scenes,
      user_approval: {
        status: "approved",
        approval_source: "approved_reference",
        approval_reference: "approval://bundle",
        source_branch: "image-to-code",
        source_commit: "9f22a3ef48bafc2bd9e979688a96cf4787fb76bf",
        semantic_spec: units[0].semantic_spec,
        reference: {
          path: units[0].perceptual_reference.path,
          content_hash: units[0].perceptual_reference.content_hash,
        },
      },
      reference_bundle: {
        source_branch: "image-to-code",
        source_commit: "9f22a3ef48bafc2bd9e979688a96cf4787fb76bf",
        design,
        project,
        authority_resolution: {
          semantic_authority: "semantic_spec",
          perceptual_authority: "approved_reference",
          conflict_policy: "block_upstream",
        },
        units,
      },
      reference_bindings: bindings,
    },
    motion: { contract_version: "2.1.0", reference_anchors: anchors },
    implementation: {
      status: "implemented",
      consumed_versions: {
        implementation_manifest_schema: "2.1.0",
      },
      reference_context: {
        applicable: true,
        reference_ids: units.map((unit) => unit.perceptual_reference.reference_id),
      },
      reference_comparisons: comparisons,
    },
    audit: {
      verdict: "ready_for_user_review",
      consumed_versions: {
        audit_report_schema: "2.1.0",
      },
      reference_context: {
        applicable: true,
        reference_ids: units.map((unit) => unit.perceptual_reference.reference_id),
      },
      independence: {
        semantic_sources_hidden_first_pass: true,
        contracts_hidden_first_pass: true,
        reference_hidden_first_pass: true,
      },
      evidence: {
        reference_fidelity: {
          status: "passed",
          evidence: "Semantic and perceptual comparison completed after blind decode.",
          comparisons: auditComparisons,
        },
      },
      scores: {
        pedagogical_comprehension: 9,
        composition_and_hierarchy: 9,
        visual_craft_and_taste: 9,
        motion_and_continuity: 9,
        cognitive_load_and_pacing: 9,
        interaction_and_holds: 9,
        mobile_legibility: 9,
        technical_robustness: 9,
        total: 9,
      },
    },
  };
}

function validateIntegrationPointer(root, pointer, label, code, errors) {
  if (!pointer || typeof pointer.path !== "string") {
    errors.push(issue(code, label, "artifact path is required"));
    return;
  }
  if (!SHA256.test(pointer.content_hash || "")) {
    errors.push(issue(code, label, "artifact requires a well-formed sha256 content hash"));
    return;
  }
  const absolute = path.resolve(root, pointer.path);
  if (!absolute.startsWith(`${path.resolve(root)}${path.sep}`) || !fs.existsSync(absolute)) {
    errors.push(issue(code, label, "artifact path must resolve inside the pinned bundle"));
    return;
  }
  if (digest(fs.readFileSync(absolute)) !== pointer.content_hash) {
    errors.push(issue(code, label, "artifact content does not match its declared hash"));
  }
}

function validateIntegrationFixture(fixture) {
  const errors = [];
  const visual = fixture.visual || {};
  const mode = visual.workflow_mode || "concept_first";

  if (fixture.policies?.require_pixel_perfect === true) {
    errors.push(issue("PIXEL_PERFECT", "fixture", "pixel-perfect cannot be required"));
  }
  if (fixture.policies?.fullscreen_reference_is_implementation === true) {
    errors.push(issue("FULLSCREEN_REFERENCE", "fixture", "fullscreen reference rendering is not implementation"));
  }

  const serialized = JSON.stringify(fixture);
  for (const term of projectSpecificTerms) {
    if (serialized.toLowerCase().includes(term.toLowerCase())) {
      errors.push(issue("PROJECT_CONTAMINATION", "fixture", "project-specific content entered the canonical pipeline fixture"));
    }
  }

  if (mode === "concept_first") {
    if (!Array.isArray(visual.direction_options) || visual.direction_options.length !== 3) {
      errors.push(issue("CONCEPT_FIRST", "visual", "concept-first must preserve exactly three material directions"));
    }
    if (visual.reference_bundle || visual.reference_bindings) {
      errors.push(issue("CONCEPT_FIRST", "visual", "concept-first cannot silently masquerade as approved-reference mode"));
    }
    return errors;
  }

  if (mode !== "approved_reference") {
    errors.push(issue("REFERENCE_MODE", "visual", "unknown visual workflow mode"));
    return errors;
  }
  if (visual.contract_version !== "2.1.0" || fixture.motion?.contract_version !== "2.1.0") {
    errors.push(issue("REFERENCE_VERSION", "fixture", "reference-aware visual and motion contracts must use version 2.1.0"));
  }

  const bundle = visual.reference_bundle;
  if (!bundle) {
    errors.push(issue("REFERENCE_BUNDLE", "visual", "approved-reference mode requires a bundle"));
    return errors;
  }
  if (!GIT_SHA.test(bundle.source_commit || "")) {
    errors.push(issue("SOURCE_COMMIT", "visual.reference_bundle", "pinned source commit is required"));
  }
  if (typeof bundle.source_branch !== "string" || !bundle.source_branch) {
    errors.push(issue("SOURCE_BRANCH", "visual.reference_bundle", "source branch is required"));
  }
  validateIntegrationPointer(fixture.root, bundle.design, "reference_bundle.design", "REFERENCE_HASH", errors);
  validateIntegrationPointer(fixture.root, bundle.project, "reference_bundle.project", "REFERENCE_HASH", errors);

  const authority = bundle.authority_resolution || {};
  if (authority.semantic_authority !== "semantic_spec") {
    errors.push(issue("SEMANTIC_AUTHORITY", "reference_bundle", "semantic spec must remain semantic authority"));
  }
  if (authority.perceptual_authority !== "approved_reference" || authority.conflict_policy !== "block_upstream") {
    errors.push(issue("PERCEPTUAL_AUTHORITY", "reference_bundle", "reference must govern perception and material conflicts must block upstream"));
  }

  const units = Array.isArray(bundle.units) ? bundle.units : [];
  if (!units.length) errors.push(issue("REFERENCE_BUNDLE", "reference_bundle.units", "at least one unit is required"));
  const referenceById = new Map();
  for (const unit of units) {
    const label = `reference_bundle.units.${unit?.unit_id || "unknown"}`;
    if (!unit?.semantic_spec) {
      errors.push(issue("REFERENCE_SPEC", label, "reference requires its semantic spec"));
    } else {
      validateIntegrationPointer(fixture.root, unit.semantic_spec, `${label}.semantic_spec`, "REFERENCE_HASH", errors);
    }
    if (!unit?.perceptual_reference) {
      errors.push(issue("REFERENCE_IMAGE", label, "approved-reference mode requires a perceptual reference for every declared unit"));
    } else {
      validateIntegrationPointer(fixture.root, unit.perceptual_reference, `${label}.perceptual_reference`, "REFERENCE_HASH", errors);
      const referenceId = unit.perceptual_reference.reference_id;
      if (typeof referenceId !== "string" || !referenceId) {
        errors.push(issue("REFERENCE_ID", label, "perceptual reference requires a stable reference_id"));
      } else if (referenceById.has(referenceId)) {
        errors.push(issue("REFERENCE_ID", label, `duplicate perceptual reference id: ${referenceId}`));
      } else {
        referenceById.set(referenceId, unit);
      }
    }
    if (typeof unit?.approval_reference !== "string" || !unit.approval_reference) {
      errors.push(issue("REFERENCE_APPROVAL", label, "file presence cannot substitute for persisted approval evidence"));
    }
  }
  if (
    visual.status === "approved" &&
    (visual.user_approval?.approval_source !== "approved_reference" || !visual.user_approval?.approval_reference)
  ) {
    errors.push(issue("REFERENCE_APPROVAL", "visual.user_approval", "inherited approval requires a verifiable approval reference"));
  }

  const holdsByScene = new Map(
    (visual.scenes || []).map((scene) => [
      scene.scene_id,
      new Set((scene.holds || []).map((hold) => (typeof hold === "string" ? hold : hold.hold_id))),
    ]),
  );
  const bindings = Array.isArray(visual.reference_bindings) ? visual.reference_bindings : [];
  const bindingKeys = new Set();
  for (const binding of bindings) {
    if (!referenceById.has(binding.reference_id)) {
      errors.push(issue("REFERENCE_BINDING", "visual.reference_bindings", `unknown reference: ${binding.reference_id}`));
    }
    const holds = holdsByScene.get(binding.scene_id);
    for (const holdId of binding.hold_ids || []) {
      const key = `${binding.reference_id}:${binding.scene_id}:${holdId}`;
      bindingKeys.add(key);
      if (!holds?.has(holdId)) {
        errors.push(issue("REFERENCE_BINDING", "visual.reference_bindings", `binding targets missing hold: ${binding.scene_id}/${holdId}`));
      }
    }
  }
  for (const referenceId of referenceById.keys()) {
    if (!bindings.some((binding) => binding.reference_id === referenceId)) {
      errors.push(issue("REFERENCE_BINDING", "visual.reference_bindings", `reference has no hold binding: ${referenceId}`));
    }
  }

  const anchorKeys = new Set(
    (fixture.motion?.reference_anchors || []).map(
      (anchor) => `${anchor.reference_id}:${anchor.scene_id}:${anchor.hold_id}`,
    ),
  );
  for (const key of bindingKeys) {
    if (!anchorKeys.has(key)) errors.push(issue("REFERENCE_ANCHOR", "motion", `missing perceptual keyframe anchor: ${key}`));
  }
  if ((fixture.motion?.reference_anchors || []).some((anchor) => anchor.material_composition_preserved !== true)) {
    errors.push(issue("REFERENCE_ANCHOR", "motion", "reference keyframes must preserve material composition"));
  }

  const comparisons = fixture.implementation?.reference_comparisons || [];
  const implementationContext = fixture.implementation?.reference_context;
  if (implementationContext?.applicable !== true) {
    errors.push(issue("REFERENCE_COMPARISON", "implementation.reference_context", "reference applicability and ids must be declared"));
  } else {
    const declared = new Set(implementationContext.reference_ids || []);
    for (const referenceId of referenceById.keys()) {
      if (!declared.has(referenceId)) {
        errors.push(issue("REFERENCE_COMPARISON", "implementation.reference_context", `missing consumed reference id: ${referenceId}`));
      }
    }
    for (const referenceId of declared) {
      if (!referenceById.has(referenceId)) {
        errors.push(issue("REFERENCE_COMPARISON", "implementation.reference_context", `unknown consumed reference id: ${referenceId}`));
      }
    }
  }
  const comparisonKeys = new Set(
    comparisons.map((comparison) => `${comparison.reference_id}:${comparison.scene_id}:${comparison.hold_id}`),
  );
  const implementationComparisonsByViewport = new Map();
  for (const binding of bindings) {
    for (const holdId of binding.hold_ids || []) {
      if (!comparisonKeys.has(`${binding.reference_id}:${binding.scene_id}:${holdId}`)) {
        errors.push(issue("REFERENCE_COMPARISON", "implementation", `missing browser/reference comparison: ${binding.reference_id}/${binding.scene_id}/${holdId}`));
      }
    }
  }
  for (const comparison of comparisons) {
    const comparisonKey = `${comparison.reference_id}:${comparison.scene_id}:${comparison.hold_id}`;
    if (!bindingKeys.has(comparisonKey)) {
      errors.push(issue("REFERENCE_COMPARISON", "implementation.reference_comparisons", `comparison is not bound by the visual contract: ${comparisonKey}`));
    }
    if (!SHA256.test(comparison.reference_hash || "") || !SHA256.test(comparison.screenshot_hash || "")) {
      errors.push(issue("REFERENCE_HASH", "implementation.reference_comparisons", "comparison hashes must be well formed"));
    }
    const sourceUnit = referenceById.get(comparison.reference_id);
    if (sourceUnit?.perceptual_reference && comparison.reference_hash !== sourceUnit.perceptual_reference.content_hash) {
      errors.push(issue("REFERENCE_HASH_LINK", "implementation.reference_comparisons", `reference hash does not match the pinned bundle: ${comparison.reference_id}`));
    }
    const viewportKey = `${comparisonKey}:${comparison.viewport_id}`;
    if (implementationComparisonsByViewport.has(viewportKey)) {
      errors.push(issue("REFERENCE_COMPARISON", "implementation.reference_comparisons", `duplicate comparison: ${viewportKey}`));
    } else {
      implementationComparisonsByViewport.set(viewportKey, comparison);
    }
    if (comparison.pixel_diff_only !== false) {
      errors.push(issue("PIXEL_PERFECT", "implementation.reference_comparisons", "pixel diff cannot be the sole comparison method"));
    }
    const nonPixelMethods = new Set([
      "bounding_boxes",
      "dom_geometry",
      "perceptual_comparison",
      "computer_vision",
      "human_or_agent_inspection",
    ]);
    if (!(comparison.comparison_methods || []).some((method) => nonPixelMethods.has(method))) {
      errors.push(issue("PIXEL_PERFECT", "implementation.reference_comparisons", "pixel_diff_only=false requires a real non-pixel comparison method"));
    }
    if (comparison.fullscreen_reference_used !== false) {
      errors.push(issue("FULLSCREEN_REFERENCE", "implementation.reference_comparisons", "fullscreen reference cannot count as reconstruction"));
    }
  }

  const fidelity = fixture.audit?.evidence?.reference_fidelity;
  const independence = fixture.audit?.independence || {};
  const auditContext = fixture.audit?.reference_context;
  if (auditContext?.applicable !== true) {
    errors.push(issue("REFERENCE_AUDIT_CONTEXT", "audit.reference_context", "reference applicability and ids must be declared"));
  } else {
    const declared = new Set(auditContext.reference_ids || []);
    for (const referenceId of referenceById.keys()) {
      if (!declared.has(referenceId)) {
        errors.push(issue("REFERENCE_AUDIT_CONTEXT", "audit.reference_context", `missing consumed reference id: ${referenceId}`));
      }
    }
    for (const referenceId of declared) {
      if (!referenceById.has(referenceId)) {
        errors.push(issue("REFERENCE_AUDIT_CONTEXT", "audit.reference_context", `unknown consumed reference id: ${referenceId}`));
      }
    }
  }
  if (
    independence.semantic_sources_hidden_first_pass !== true ||
    independence.contracts_hidden_first_pass !== true ||
    independence.reference_hidden_first_pass !== true
  ) {
    errors.push(issue("BLIND_REFERENCE_ORDER", "audit.independence", "semantic sources, contracts, and references must remain hidden until blind decode closes"));
  }
  if (["ready_for_user_review", "reference_candidate"].includes(fixture.audit?.verdict) && fidelity?.status !== "passed") {
    errors.push(issue("REFERENCE_VERDICT", "audit", "review-ready verdicts require passed reference fidelity"));
  }
  const auditComparisons = fidelity?.comparisons || [];
  const auditedBindings = new Set(
    auditComparisons.map((comparison) => `${comparison.reference_id}:${comparison.scene_id}:${comparison.hold_id}`),
  );
  for (const key of bindingKeys) {
    if (!auditedBindings.has(key)) {
      errors.push(issue("REFERENCE_AUDIT_COVERAGE", "audit", `missing reference-fidelity evidence: ${key}`));
    }
  }
  for (const comparison of auditComparisons) {
    const key = `${comparison.reference_id}:${comparison.scene_id}:${comparison.hold_id}`;
    if (!bindingKeys.has(key)) {
      errors.push(issue("REFERENCE_AUDIT_COVERAGE", "audit", `comparison is not bound by the visual contract: ${key}`));
    }
    const sourceUnit = referenceById.get(comparison.reference_id);
    if (sourceUnit) {
      if (sourceUnit.semantic_spec && comparison.semantic_spec_hash !== sourceUnit.semantic_spec.content_hash) {
        errors.push(issue("REFERENCE_HASH_LINK", "audit", `semantic spec hash does not match the pinned bundle: ${key}`));
      }
      if (sourceUnit.perceptual_reference && comparison.reference_hash !== sourceUnit.perceptual_reference.content_hash) {
        errors.push(issue("REFERENCE_HASH_LINK", "audit", `reference hash does not match the pinned bundle: ${key}`));
      }
    }
    const producerComparison = implementationComparisonsByViewport.get(`${key}:${comparison.viewport_id}`);
    if (!producerComparison) {
      errors.push(issue("REFERENCE_HASH_LINK", "audit", `no producer comparison exists for audit evidence: ${key}/${comparison.viewport_id}`));
    } else if (comparison.output_hash !== producerComparison.screenshot_hash) {
      errors.push(issue("REFERENCE_HASH_LINK", "audit", `output hash does not match the producer screenshot: ${key}/${comparison.viewport_id}`));
    }
    const bothPassed = comparison.semantic_fidelity === "passed" && comparison.perceptual_fidelity === "passed";
    if (bothPassed !== (comparison.failure_origin === "none")) {
      errors.push(issue("REFERENCE_FIDELITY", "audit", `failure origin contradicts comparison result: ${key}`));
    }
  }
  if (
    fidelity?.status === "passed" &&
    auditComparisons.some(
      (comparison) =>
        comparison.semantic_fidelity !== "passed" ||
        comparison.perceptual_fidelity !== "passed" ||
        comparison.failure_origin !== "none",
    )
  ) {
    errors.push(issue("REFERENCE_FIDELITY", "audit", "passed reference fidelity requires every bound comparison to pass"));
  }
  if (
    fidelity?.status === "failed" &&
    !auditComparisons.some(
      (comparison) => comparison.semantic_fidelity === "failed" || comparison.perceptual_fidelity === "failed",
    )
  ) {
    errors.push(issue("REFERENCE_FIDELITY", "audit", "failed reference fidelity requires a failed comparison"));
  }
  if (fidelity?.status === "limited") {
    const hasLimited = auditComparisons.some(
      (comparison) => comparison.semantic_fidelity === "limited" || comparison.perceptual_fidelity === "limited",
    );
    const hasFailed = auditComparisons.some(
      (comparison) => comparison.semantic_fidelity === "failed" || comparison.perceptual_fidelity === "failed",
    );
    if (!hasLimited || hasFailed) {
      errors.push(issue("REFERENCE_FIDELITY", "audit", "limited reference fidelity requires a limitation and no failed comparison"));
    }
  }

  const scoreKeys = [
    "pedagogical_comprehension",
    "composition_and_hierarchy",
    "visual_craft_and_taste",
    "motion_and_continuity",
    "cognitive_load_and_pacing",
    "interaction_and_holds",
    "mobile_legibility",
    "technical_robustness",
  ];
  const scores = fixture.audit?.scores;
  if (scores && scoreKeys.every((key) => typeof scores[key] === "number") && typeof scores.total === "number") {
    const expectedTotal = Math.round((scoreKeys.reduce((sum, key) => sum + scores[key], 0) / scoreKeys.length) * 10) / 10;
    if (Math.abs(scores.total - expectedTotal) > 0.001) {
      errors.push(issue("AUDIT_TOTAL", "audit.scores", `total must equal the eight-dimension mean: ${expectedTotal}`));
    }
  }
  return errors;
}

function runIntegrationTests() {
  const positiveCases = [
    { name: "concept-first compatibility", mode: "concept_first", unitCount: 0 },
    { name: "one approved reference", mode: "approved_reference", unitCount: 1 },
    { name: "ten approved references", mode: "approved_reference", unitCount: 10 },
  ];
  const positiveFailures = [];
  for (const testCase of positiveCases) {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "validate-integration-positive-"));
    try {
      const fixture = buildIntegrationFixture(root, testCase);
      const errors = validateIntegrationFixture(fixture);
      if (errors.length) positiveFailures.push(`${testCase.name}: ${errors.map((error) => error.code).join(", ")}`);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  }

  const negativeCases = [
    { name: "reference without spec", code: "REFERENCE_SPEC", mutate: (f) => delete f.visual.reference_bundle.units[0].semantic_spec },
    { name: "spec without reference", code: "REFERENCE_IMAGE", mutate: (f) => delete f.visual.reference_bundle.units[0].perceptual_reference },
    { name: "reference without hash", code: "REFERENCE_HASH", mutate: (f) => delete f.visual.reference_bundle.units[0].perceptual_reference.content_hash },
    { name: "missing source commit", code: "SOURCE_COMMIT", mutate: (f) => delete f.visual.reference_bundle.source_commit },
    { name: "reference mode on legacy contract version", code: "REFERENCE_VERSION", mutate: (f) => { f.visual.contract_version = "2.0.0"; } },
    { name: "malformed hash", code: "REFERENCE_HASH", mutate: (f) => { f.visual.reference_bundle.units[0].semantic_spec.content_hash = "sha256:not-a-hash"; } },
    { name: "binding to absent hold", code: "REFERENCE_BINDING", mutate: (f) => { f.visual.reference_bindings[0].hold_ids = ["missing-hold"]; } },
    { name: "producer without comparison", code: "REFERENCE_COMPARISON", mutate: (f) => { f.implementation.reference_comparisons = []; } },
    { name: "producer without reference context", code: "REFERENCE_COMPARISON", mutate: (f) => { delete f.implementation.reference_context; } },
    { name: "producer comparison for wrong scene", code: "REFERENCE_COMPARISON", mutate: (f) => { f.implementation.reference_comparisons[0].scene_id = "wrong-scene"; } },
    { name: "producer reference hash from another image", code: "REFERENCE_HASH_LINK", mutate: (f) => { f.implementation.reference_comparisons[0].reference_hash = digest("another-reference"); } },
    { name: "reference candidate without passed fidelity", code: "REFERENCE_VERDICT", mutate: (f) => { f.audit.verdict = "reference_candidate"; f.audit.evidence.reference_fidelity.status = "failed"; } },
    { name: "auditor without reference context", code: "REFERENCE_AUDIT_CONTEXT", mutate: (f) => { delete f.audit.reference_context; } },
    { name: "audit comparison for wrong hold", code: "REFERENCE_AUDIT_COVERAGE", mutate: (f) => { f.audit.evidence.reference_fidelity.comparisons[0].hold_id = "wrong-hold"; } },
    { name: "audit semantic hash from another spec", code: "REFERENCE_HASH_LINK", mutate: (f) => { f.audit.evidence.reference_fidelity.comparisons[0].semantic_spec_hash = digest("another-spec"); } },
    { name: "audit output hash from another screenshot", code: "REFERENCE_HASH_LINK", mutate: (f) => { f.audit.evidence.reference_fidelity.comparisons[0].output_hash = digest("another-output"); } },
    { name: "passed fidelity with failed comparison", code: "REFERENCE_FIDELITY", mutate: (f) => { f.audit.evidence.reference_fidelity.comparisons[0].perceptual_fidelity = "failed"; f.audit.evidence.reference_fidelity.comparisons[0].failure_origin = "implementation"; } },
    { name: "incoherent audit total", code: "AUDIT_TOTAL", mutate: (f) => { f.audit.scores.total = 10; } },
    { name: "image as semantic authority", code: "SEMANTIC_AUTHORITY", mutate: (f) => { f.visual.reference_bundle.authority_resolution.semantic_authority = "approved_reference"; } },
    { name: "approval inferred from file", code: "REFERENCE_APPROVAL", mutate: (f) => { f.visual.reference_bundle.units[0].approval_reference = null; f.visual.user_approval.approval_reference = null; } },
    { name: "pixel-perfect requirement", code: "PIXEL_PERFECT", mutate: (f) => { f.policies.require_pixel_perfect = true; } },
    { name: "pixel-only method mislabeled", code: "PIXEL_PERFECT", mutate: (f) => { f.implementation.reference_comparisons[0].comparison_methods = ["screenshot_diff"]; } },
    { name: "fullscreen image implementation", code: "FULLSCREEN_REFERENCE", mutate: (f) => { f.policies.fullscreen_reference_is_implementation = true; } },
    { name: "fullscreen comparison recorded as implemented", code: "FULLSCREEN_REFERENCE", mutate: (f) => { f.implementation.reference_comparisons[0].fullscreen_reference_used = true; } },
    { name: "reference visible before blind decode", code: "BLIND_REFERENCE_ORDER", mutate: (f) => { f.audit.independence.reference_hidden_first_pass = false; } },
    { name: "project-specific content", code: "PROJECT_CONTAMINATION", mutate: (f) => { f.visual.reference_bundle.units[0].notes = projectSpecificTerms[0]; } },
  ];
  const negativeFailures = [];
  for (const testCase of negativeCases) {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "validate-integration-negative-"));
    try {
      const fixture = buildIntegrationFixture(root, { mode: "approved_reference", unitCount: 1 });
      testCase.mutate(fixture);
      const errors = validateIntegrationFixture(fixture);
      if (!errors.some((error) => error.code === testCase.code)) {
        negativeFailures.push(`${testCase.name}: expected ${testCase.code}`);
      }
    } catch (error) {
      negativeFailures.push(`${testCase.name}: fixture error: ${error.message}`);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  }

  return {
    failures: [...positiveFailures, ...negativeFailures],
    positiveCount: positiveCases.length,
    negativeCount: negativeCases.length,
  };
}

function runNegativeTests(source) {
  const cases = [
    {
      name: "missing skill",
      code: "SKILL_COUNT",
      mutate: (root) => fs.rmSync(path.join(root, "skills/motion-director-lienzo"), { recursive: true }),
    },
    {
      name: "mismatched skill name",
      code: "SKILL_NAME",
      mutate: (root) => replaceIn(root, "skills/visual-director-lienzo/SKILL.md", "name: visual-director-lienzo", "name: wrong-name"),
    },
    {
      name: "missing required section",
      code: "SKILL_SECTION",
      mutate: (root) => replaceIn(root, "skills/frontend-producer-lienzo/SKILL.md", "## Inputs requeridos", "## Entradas"),
    },
    {
      name: "broken internal link",
      code: "BROKEN_LINK",
      mutate: (root) => appendTo(root, "skills/visual-director-lienzo/SKILL.md", "\n[broken](../../missing.md)\n"),
    },
    {
      name: "invalid schema JSON",
      code: "SCHEMA_JSON",
      mutate: (root) => fs.writeFileSync(path.join(root, "contracts/motion-contract.schema.json"), "{"),
    },
    {
      name: "schema without a contractual version",
      code: "SCHEMA_VERSION",
      mutate: (root) => replaceIn(root, "contracts/visual-contract.schema.json", '"x-schema-version": "2.1.0"', '"x-schema-version": "latest"'),
    },
    {
      name: "required schema field without a property",
      code: "SCHEMA_PROPERTY",
      mutate: (root) => replaceIn(root, "contracts/motion-contract.schema.json", '"visual_contract_hash": { "$ref": "#/$defs/sha256" }', '"visual_contract_hash_missing": { "$ref": "#/$defs/sha256" }'),
    },
    {
      name: "frontend directory",
      code: "FRONTEND_FORBIDDEN",
      mutate: (root) => {
        fs.mkdirSync(path.join(root, "src"));
        fs.writeFileSync(path.join(root, "src/example.ts"), "export {};\n");
      },
    },
    {
      name: "npm manifest",
      code: "NPM_DEPENDENCY",
      mutate: (root) => fs.writeFileSync(path.join(root, "package.json"), "{}\n"),
    },
    {
      name: "design document",
      code: "DESIGN_FORBIDDEN",
      mutate: (root) => fs.writeFileSync(path.join(root, "DESIGN.md"), "# forbidden\n"),
    },
    {
      name: "prior benchmark identifier",
      code: "CONTAMINATION",
      mutate: (root) => appendTo(root, "README.md", `\n${contaminationTerms[3]}\n`),
    },
    {
      name: "composition authority leak",
      code: "AUTHORITY_EXCLUSIVE",
      mutate: (root) => replaceIn(root, "skills/motion-director-lienzo/SKILL.md", "Esta skill decide:\n", "Esta skill decide:\n\n- composición;\n"),
    },
    {
      name: "timing authority leak",
      code: "AUTHORITY_EXCLUSIVE",
      mutate: (root) => replaceIn(root, "skills/visual-director-lienzo/SKILL.md", "Esta skill decide:\n", "Esta skill decide:\n\n- timing;\n"),
    },
    {
      name: "implementation authority leak",
      code: "AUTHORITY_EXCLUSIVE",
      mutate: (root) => replaceIn(root, "skills/motion-director-lienzo/SKILL.md", "Esta skill decide:\n", "Esta skill decide:\n\n- implementación;\n"),
    },
    {
      name: "verdict authority leak",
      code: "AUTHORITY_EXCLUSIVE",
      mutate: (root) => replaceIn(root, "skills/frontend-producer-lienzo/SKILL.md", "Esta skill decide:\n", "Esta skill decide:\n\n- veredicto;\n"),
    },
    {
      name: "auto approval",
      code: "AUTO_APPROVAL",
      mutate: (root) => appendTo(root, "skills/audita-y-mejora-lienzo-didactico/SKILL.md", "\nPuede autoaprobar el trabajo.\n"),
    },
    {
      name: "external installed skill dependency",
      code: "EXTERNAL_RUNTIME_SKILL",
      mutate: (root) => appendTo(root, "skills/visual-director-lienzo/SKILL.md", "\nRequiere la skill externa de referencia instalada.\n"),
    },
    {
      name: "skill requires pixel-perfect",
      code: "SKILL_PIXEL_PERFECT",
      mutate: (root) => appendTo(root, "skills/frontend-producer-lienzo/SKILL.md", "\nLa skill exige fidelidad pixel-perfect.\n"),
    },
    {
      name: "skill authorizes fullscreen reference",
      code: "SKILL_FULLSCREEN",
      mutate: (root) => appendTo(root, "skills/frontend-producer-lienzo/SKILL.md", "\nLa referencia fullscreen constituye implementación.\n"),
    },
    {
      name: "skill makes image sole semantic source",
      code: "SKILL_SEMANTIC_IMAGE",
      mutate: (root) => appendTo(root, "skills/visual-director-lienzo/SKILL.md", "\nLa imagen es la única fuente semántica.\n"),
    },
    {
      name: "project-specific reference content",
      code: "PROJECT_CONTAMINATION",
      mutate: (root) => appendTo(root, "README.md", `\n${projectSpecificTerms[0]}\n`),
    },
  ];

  const failures = [];
  for (const testCase of cases) {
    const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "validate-skills-"));
    try {
      copyFixture(source, fixture);
      testCase.mutate(fixture);
      const result = validate(fixture);
      if (!result.errors.some((error) => error.code === testCase.code)) {
        failures.push(`${testCase.name}: expected ${testCase.code}`);
      }
    } catch (error) {
      failures.push(`${testCase.name}: fixture error: ${error.message}`);
    } finally {
      fs.rmSync(fixture, { recursive: true, force: true });
    }
  }
  return { failures, count: cases.length };
}

const result = validate(ROOT);
if (result.errors.length) {
  console.error(`validate-skills: FAIL (${result.errors.length} error(s))`);
  for (const error of result.errors) {
    console.error(`${error.code} ${error.file}: ${error.message}`);
  }
  process.exit(1);
}

const negative = runNegativeTests(ROOT);
if (negative.failures.length) {
  console.error(`validate-skills: FAIL (${negative.failures.length} negative-test failure(s))`);
  for (const failure of negative.failures) console.error(failure);
  process.exit(1);
}

const integration = runIntegrationTests();
if (integration.failures.length) {
  console.error(`validate-skills: FAIL (${integration.failures.length} integration-test failure(s))`);
  for (const failure of integration.failures) console.error(failure);
  process.exit(1);
}

console.log(
  `validate-skills: PASS (${SKILLS.length} skills, ${SCHEMAS.length} schemas, ${result.metrics.links} internal links, ${integration.positiveCount} integration fixtures, ${negative.count + integration.negativeCount} negative fixtures)`,
);
