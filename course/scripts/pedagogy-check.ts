import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { course } from "../contracts/lessons";
import { financialClaims, misconceptions, notationRegistry } from "../contracts/registries";

type Check = { id: string; name: string; errors: string[] };
const checks: Check[] = Array.from({ length: 14 }, (_, index) => ({ id: `BOND-CHECK-${String(index + 1).padStart(2, "0")}`, name: "", errors: [] }));
const check = (number: number, name: string) => (checks[number - 1]!.name = name, checks[number - 1]!);

const source = check(1, "source mapping");
const conceptOrder = check(2, "concept order");
const notationOrder = check(3, "notation order");
const routes = check(4, "route completeness");
const optional = check(5, "OPTIONAL isolation");
const liveLoad = check(6, "LIVE load");
const guidedLoad = check(7, "guided load");
const claims = check(8, "financial claim coverage");
const fixtures = check(9, "numerical fixture consistency");
const misconceptionCheck = check(10, "misconception treatment");
const bridges = check(11, "bridge causality");
const profiles = check(12, "delivery-profile coverage");
const bindings = check(13, "scene/stage binding");
const drift = check(14, "source drift");

const manifest = JSON.parse(readFileSync(resolve(import.meta.dirname, "../contracts/source-manifest.json"), "utf8")) as { entries: { id: string; used_by: string[] }[] };
const sourceIds = new Set(manifest.entries.map((entry) => entry.id));
if (sourceIds.size !== 17) source.errors.push("source manifest must contain 17 unique IDs");

const introducedConcepts = new Map<string, "LIVE" | "REQUIRED" | "OPTIONAL">();
const introducedNotation = new Map<string, "LIVE" | "REQUIRED" | "OPTIONAL">();
const sceneIds = new Set<string>();
const stageIds = new Set<string>();

for (const lesson of course.lessons) {
  for (const required of lesson.requires.concepts) if (!introducedConcepts.has(required)) conceptOrder.errors.push(`${lesson.id}: ${required} not introduced earlier`);
  for (const required of lesson.requires.notation) if (!introducedNotation.has(required)) notationOrder.errors.push(`${lesson.id}: ${required} not introduced earlier`);
  for (const entry of lesson.introduces) {
    const registry = entry.kind === "concept" ? introducedConcepts : introducedNotation;
    if (registry.has(entry.id)) (entry.kind === "concept" ? conceptOrder : notationOrder).errors.push(`${entry.id} introduced more than once`);
    registry.set(entry.id, entry.route);
    if (lesson.introduction_routes[entry.id] !== entry.route) routes.errors.push(`${lesson.id}: introduction route mismatch for ${entry.id}`);
  }
  for (const [id, route] of Object.entries(lesson.requirement_routes.concepts)) if (introducedConcepts.get(id) === "OPTIONAL" && route !== "OPTIONAL") optional.errors.push(`${lesson.id}: ${id} depends only on OPTIONAL`);
  for (const [id, route] of Object.entries(lesson.requirement_routes.notation)) if (introducedNotation.get(id) === "OPTIONAL" && route !== "OPTIONAL") optional.errors.push(`${lesson.id}: ${id} depends only on OPTIONAL`);

  const presentationMinutes = lesson.scenes.filter((scene) => scene.phase === "presentation" && scene.route === "LIVE").reduce((sum, scene) => sum + scene.durationMinutes, 0);
  const guidedMinutes = lesson.scenes.filter((scene) => scene.phase === "guided" && scene.route === "LIVE").reduce((sum, scene) => sum + scene.durationMinutes, 0);
  if (presentationMinutes !== lesson.load.livePresentationMinutes || presentationMinutes < 18 || presentationMinutes > 22) liveLoad.errors.push(`${lesson.id}: presentation ${presentationMinutes}`);
  if (guidedMinutes !== lesson.load.guidedMinutes || guidedMinutes < 18 || guidedMinutes > 22) guidedLoad.errors.push(`${lesson.id}: guided ${guidedMinutes}`);

  const routed = new Map<string, string>();
  for (const [route, ids] of Object.entries(lesson.routes)) for (const id of ids) {
    if (routed.has(id)) routes.errors.push(`${lesson.id}: ${id} classified twice`);
    routed.set(id, route);
  }
  for (const scene of lesson.scenes) {
    if (sceneIds.has(scene.id)) bindings.errors.push(`duplicate scene ${scene.id}`);
    sceneIds.add(scene.id);
    if (routed.get(scene.id) !== scene.route) routes.errors.push(`${scene.id}: route mismatch`);
    if (!scene.stages.length) bindings.errors.push(`${scene.id}: no stages`);
    for (const stage of scene.stages) {
      if (stageIds.has(stage.id)) bindings.errors.push(`duplicate stage ${stage.id}`);
      stageIds.add(stage.id);
      if (stage.route !== scene.route) bindings.errors.push(`${stage.id}: route differs from scene`);
      if (!stage.component) bindings.errors.push(`${stage.id}: no component`);
    }
    for (const ref of scene.sourceRefs) if (!sourceIds.has(ref)) source.errors.push(`${scene.id}: unknown source ${ref}`);
  }
  if (!lesson.bridge.known || !lesson.bridge.gap || !lesson.bridge.next || !lesson.bridge.target) bridges.errors.push(`${lesson.id}: incomplete bridge`);
  if (new Set(lesson.deliveryProfiles).size !== 4) profiles.errors.push(`${lesson.id}: incomplete delivery profiles`);
}

for (const notation of notationRegistry) {
  if (!introducedNotation.has(notation.id)) notationOrder.errors.push(`${notation.id}: registered but not introduced`);
  if (!notation.unit || !notation.visual || !notation.constraints) notationOrder.errors.push(`${notation.id}: metadata incomplete`);
}

for (const claim of financialClaims) {
  const lesson = course.lessons.find((item) => item.id === claim.lesson);
  if (!lesson?.financialClaims.includes(claim.id)) claims.errors.push(`${claim.id}: not linked by lesson`);
  if (!sourceIds.has(claim.sourceRef)) claims.errors.push(`${claim.id}: invalid source`);
  if (claim.route !== "LIVE") claims.errors.push(`${claim.id}: essential claim must be LIVE`);
}

for (const misconception of misconceptions) {
  const lesson = course.lessons.find((item) => item.id === misconception.lesson);
  if (!lesson?.misconceptions.includes(misconception.id)) misconceptionCheck.errors.push(`${misconception.id}: not linked by lesson`);
  if (!lesson?.scenes.some((scene) => scene.id === misconception.treatmentScene)) misconceptionCheck.errors.push(`${misconception.id}: missing treatment scene`);
}

const numeric = JSON.parse(readFileSync(resolve(import.meta.dirname, "../contracts/numerical-fixtures.json"), "utf8")) as { canonicalBond?: { cashFlows?: number[] }; tolerances?: object };
if (numeric.canonicalBond?.cashFlows?.join(",") !== "4,4,4,4,104" || !numeric.tolerances) fixtures.errors.push("canonical fixtures incomplete");
if (manifest.entries.some((entry) => !entry.used_by.length)) source.errors.push("unused source");
if (manifest.entries.length !== course.sourceIds.length) drift.errors.push("manifest/course source count mismatch");

const failed = checks.filter((item) => item.errors.length);
console.log(JSON.stringify({ checks, passed: checks.length - failed.length, failed: failed.length }, null, 2));
if (failed.length) process.exit(1);
console.log("PEDAGOGY PASS — BOND-CHECK-01…14 green");
