import type { DeckDefinition, Position, Scenario, Snapshot } from "./types";

export function clampPosition(
  slide: number,
  step: number,
  counts: readonly number[],
): Position {
  if (!counts.length) throw new Error("A presentation must contain a scene.");
  const s = Number.isFinite(slide)
    ? Math.min(Math.max(Math.floor(slide), 0), counts.length - 1)
    : 0;
  return {
    slide: s,
    step: Number.isFinite(step)
      ? Math.min(Math.max(Math.floor(step), 0), (counts[s] ?? 1) - 1)
      : 0,
  };
}
export function movePosition(
  p: Position,
  dir: 1 | -1,
  counts: readonly number[],
): Position {
  if (dir === 1)
    return p.step < (counts[p.slide] ?? 1) - 1
      ? { ...p, step: p.step + 1 }
      : clampPosition(
          p.slide + 1,
          p.slide === counts.length - 1 ? p.step : 0,
          counts,
        );
  return p.step > 0
    ? { ...p, step: p.step - 1 }
    : clampPosition(
        p.slide - 1,
        p.slide > 0 ? (counts[p.slide - 1] ?? 1) - 1 : 0,
        counts,
      );
}
export function snapshotOf<S extends Scenario>(
  deck: DeckDefinition<S>,
  position: Position,
  scenario: S,
): Snapshot<S> {
  const scene = deck.scenes[position.slide]!;
  return {
    sceneId: scene.id,
    stepId: scene.steps[position.step]!.id,
    scenario: { ...scenario },
  };
}
export function positionOf<S extends Scenario>(
  deck: DeckDefinition<S>,
  snapshot: Snapshot<S>,
): Position {
  const slide = deck.scenes.findIndex((s) => s.id === snapshot.sceneId);
  if (slide < 0) throw new Error("La escena no pertenece a esta presentación.");
  const step = deck.scenes[slide]!.steps.findIndex(
    (s) => s.id === snapshot.stepId,
  );
  if (step < 0) throw new Error("El paso no pertenece a esta escena.");
  if (!deck.validateScenario(snapshot.scenario))
    throw new Error("El escenario contiene valores no válidos.");
  return { slide, step };
}
export function assertDeck<S extends Scenario>(deck: DeckDefinition<S>): void {
  const unique = (ids: string[]) => new Set(ids).size === ids.length;
  if (!deck.scenes.length || !unique(deck.scenes.map((s) => s.id)))
    throw new Error("Scenes require unique stable IDs.");
  if (!deck.validateScenario(deck.initialScenario))
    throw new Error("Invalid initial scenario.");
  const concepts = new Set(deck.concepts.map((c) => c.id));
  for (const scene of deck.scenes) {
    if (!scene.steps.length || !unique(scene.steps.map((s) => s.id)))
      throw new Error(`Invalid steps in ${scene.id}`);
    if (
      [...scene.conceptIds, ...scene.prerequisiteIds].some(
        (id) => !concepts.has(id),
      )
    )
      throw new Error(`Unknown concept in ${scene.id}`);
    if (
      scene.entityIds.some((id) => !deck.entities.includes(id)) ||
      !deck.scenarioIds.includes(scene.scenarioId)
    )
      throw new Error(`Unknown entity or scenario in ${scene.id}`);
  }
  for (const concept of deck.concepts)
    if (!deck.scenes.some((s) => s.id === concept.introducedAt))
      throw new Error(`Unknown introduction for ${concept.id}`);
}
