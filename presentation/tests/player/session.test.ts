import { describe, expect, it } from "vitest";
import { bondsDeck } from "../../src/decks/bonds";
import {
  regressionDeck,
  meanSquaredError,
  predict,
} from "../../src/decks/regression";
import {
  assertDeck,
  clampPosition,
  movePosition,
  snapshotOf,
  positionOf,
} from "../../src/player/state";
import {
  parseSession,
  readSharedState,
  shareHash,
  sessionStateAt,
} from "../../src/player/session";

it("validates two unrelated decks with the same player contract", () => {
  expect(() => assertDeck(bondsDeck)).not.toThrow();
  expect(() => assertDeck(regressionDeck)).not.toThrow();
  for (const deck of [bondsDeck, regressionDeck]) {
    const counts = deck.scenes.map((s) => s.steps.length);
    let p = { slide: 0, step: 0 };
    const states = new Set<string>();
    for (let i = 0; i < counts.reduce((a, b) => a + b, 0); i++) {
      states.add(`${p.slide}:${p.step}`);
      const next = movePosition(p, 1, counts);
      if (JSON.stringify(next) !== JSON.stringify(p))
        expect(movePosition(next, -1, counts)).toEqual(p);
      p = next;
    }
    expect(states.size).toBe(counts.reduce((a, b) => a + b, 0));
    expect(p).toEqual(clampPosition(999, 999, counts));
  }
});
const start = snapshotOf(
  bondsDeck,
  { slide: 5, step: 3 },
  { ...bondsDeck.initialScenario, lastRate: 0.08, flow: 5 },
);
const end = snapshotOf(
  bondsDeck,
  { slide: 6, step: 3 },
  { ...start.scenario, reinvestment: 0.08 },
);
const session = {
  format: "presentation-session",
  version: 1,
  deckId: bondsDeck.id,
  deckVersion: bondsDeck.version,
  duration: 1000,
  events: [
    { at: 0, state: start },
    { at: 600, state: end },
  ],
};
it("round trips financial assumptions and stable scene/step IDs", () => {
  const parsed = parseSession(JSON.stringify(session), bondsDeck);
  expect(sessionStateAt(parsed, 599)).toEqual(start);
  expect(sessionStateAt(parsed, 600)).toEqual(end);
  expect(sessionStateAt(parsed, 99999)).toEqual(end);
  expect(readSharedState(shareHash(start), bondsDeck)).toEqual(start);
  expect(positionOf(bondsDeck, start)).toEqual({ slide: 5, step: 3 });
});
describe("untrusted session import", () => {
  it.each([
    { ...session, deckId: "different" },
    { ...session, deckVersion: 999 },
    { ...session, events: [] },
    { ...session, duration: -1 },
    { ...session, events: [{ at: 1, state: start }] },
    {
      ...session,
      events: [
        { at: 0, state: start },
        { at: -1, state: end },
      ],
    },
    {
      ...session,
      events: [{ at: 0, state: { ...start, sceneId: "missing" } }],
    },
    { ...session, events: [{ at: 0, state: { ...start, stepId: "missing" } }] },
    {
      ...session,
      events: [
        {
          at: 0,
          state: { ...start, scenario: { ...start.scenario, lastRate: -0.1 } },
        },
      ],
    },
    {
      ...session,
      events: [
        {
          at: 0,
          state: { ...start, scenario: { ...start.scenario, flow: 6 } },
        },
      ],
    },
  ])("rejects incompatible, unordered or impossible states", (raw) =>
    expect(() => parseSession(JSON.stringify(raw), bondsDeck)).toThrow(),
  );
});
it("resets only the financial control owned by the current scene", () => {
  const scenario = {
    ...bondsDeck.initialScenario,
    lastRate: 0.08,
    reinvestment: 0.06,
    marketYield: 0.07,
    flow: 3,
    curvePoint: "ILL-30",
  };
  expect(bondsDeck.resetScene("06-discounting-example", scenario)).toEqual({
    ...scenario,
    lastRate: 0.04,
    flow: 1,
  });
  expect(bondsDeck.resetScene("11-yield-curve", scenario)).toEqual({
    ...scenario,
    curvePoint: null,
    flow: 1,
  });
});
it("keeps the second deck numerically meaningful", () => {
  expect(meanSquaredError(1)).toBeCloseTo(0.04, 12);
  expect(predict(5, 1)).toBe(6);
  expect(meanSquaredError(0.5)).toBeGreaterThan(meanSquaredError(1));
});
