#!/usr/bin/env node

import fs from "node:fs";
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
    "scenes",
    "beats",
    "reduced_motion",
    "global_timing_rules",
    "known_risks",
  ],
  "contracts/implementation-manifest.schema.json": [
    "implementation_id",
    "narrative_hash",
    "visual_contract_hash",
    "motion_contract_hash",
    "commit",
    "stack",
    "commands",
    "outputs",
    "tests",
    "visual_evidence",
    "viewports",
    "deviations",
    "limitations",
  ],
  "contracts/audit-report.schema.json": [
    "audit_id",
    "subject_commit",
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
    const required = new Set(schema.required || []);
    for (const field of REQUIRED_SCHEMA_FIELDS[relative]) {
      if (!required.has(field)) errors.push(issue("SCHEMA_FIELD", relative, `missing required root field: ${field}`));
    }
    for (const ref of collectRefs(schema)) {
      if (ref.startsWith("#/") && !resolveJsonPointer(schema, ref)) {
        errors.push(issue("SCHEMA_REF", relative, `unresolved local JSON pointer: ${ref}`));
      }
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

console.log(
  `validate-skills: PASS (${SKILLS.length} skills, ${SCHEMAS.length} schemas, ${result.metrics.links} internal links, ${negative.count} negative fixtures)`,
);
