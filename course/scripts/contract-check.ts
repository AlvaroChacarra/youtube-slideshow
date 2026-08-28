import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "zod";
import { CourseSchema } from "../contracts/course";
import { course } from "../contracts/lessons";
import { conceptRegistry, financialClaims, misconceptions, notationRegistry } from "../contracts/registries";

const schemaPath = resolve(import.meta.dirname, "../contracts/course.schema.json");
const schema = JSON.stringify(z.toJSONSchema(CourseSchema, { target: "draft-2020-12" }), null, 2) + "\n";

if (process.argv.includes("--write-schema")) {
  writeFileSync(schemaPath, schema);
  console.log(`wrote ${schemaPath}`);
  process.exit(0);
}

CourseSchema.parse(course);
const groups = [
  ["concept", conceptRegistry],
  ["notation", notationRegistry.map((item) => item.id)],
  ["financial claim", financialClaims.map((item) => item.id)],
  ["misconception", misconceptions.map((item) => item.id)]
] as const;

for (const [label, values] of groups) {
  if (new Set(values).size !== values.length) throw new Error(`${label} registry contains duplicates`);
}

const trackedConcepts = new Set(conceptRegistry);
const trackedNotation = new Set(notationRegistry.map((entry) => entry.id));
for (const lesson of course.lessons) {
  for (const entry of lesson.introduces) {
    const registry = entry.kind === "concept" ? trackedConcepts : trackedNotation;
    if (!registry.has(entry.id as never)) throw new Error(`${lesson.id}: unregistered ${entry.kind} ${entry.id}`);
  }
}

if (readFileSync(schemaPath, "utf8") !== schema) throw new Error("course.schema.json drift; run npm run schema");
console.log("CONTRACT PASS — Zod contract, registries, and JSON Schema agree");
