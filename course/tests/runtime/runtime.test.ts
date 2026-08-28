import { beforeEach, describe, expect, it } from "vitest";
import { lesson01 } from "../../contracts/lessons/01";
import { isCleanCapture, recordableCanvasRatio } from "../../src/runtime/capture-mode";
import { resolveDelivery, scopedScenes, videoMinutes } from "../../src/runtime/delivery-profile";
import { commandFromKey, shouldIgnoreKeyboard } from "../../src/runtime/keyboard";
import { nextPosition, positionFromDeepLink, previousPosition } from "../../src/runtime/navigation";
import { readProgress, storageKey, writeProgress } from "../../src/runtime/persistence";
import { createInitialState, runtimeReducer } from "../../src/runtime/reducer";

describe("delivery profiles", () => {
  it("keeps route and delivery depth separate", () => {
    expect(scopedScenes(lesson01, "aula", false).every((scene) => scene.route === "LIVE")).toBe(true);
    expect(scopedScenes(lesson01, "estudio", false).some((scene) => scene.route === "REQUIRED")).toBe(true);
    expect(scopedScenes(lesson01, "estudio", false).some((scene) => scene.route === "OPTIONAL")).toBe(false);
  });

  it("uses study fallback at and below 900px", () => {
    expect(resolveDelivery({ search: "?mode=aula&profe=1&capture=1", viewportWidth: 900 })).toEqual({ requestedMode: "aula", mode: "estudio", professor: false, capture: false, mobileFallback: true });
    expect(resolveDelivery({ search: "?mode=aula&profe=1&capture=1", viewportWidth: 901 })).toEqual({ requestedMode: "aula", mode: "aula", professor: true, capture: true, mobileFallback: false });
  });

  it("keeps the compact video route between 12 and 18 minutes", () => {
    expect(videoMinutes(lesson01)).toBeGreaterThanOrEqual(12);
    expect(videoMinutes(lesson01)).toBeLessThanOrEqual(18);
    expect(scopedScenes(lesson01, "video", false).at(-1)?.type).toBe("bridge");
  });
});

describe("navigation and reducer", () => {
  const scenes = scopedScenes(lesson01, "aula", false);

  it("moves across stage boundaries and reverses exactly", () => {
    const lastStage = scenes[0]!.stages.length - 1;
    expect(nextPosition(scenes, { sceneIndex: 0, stageIndex: lastStage })).toEqual({ sceneIndex: 1, stageIndex: 0 });
    expect(previousPosition(scenes, { sceneIndex: 1, stageIndex: 0 })).toEqual({ sceneIndex: 0, stageIndex: lastStage });
  });

  it("resolves deep links and rejects unknown scenes", () => {
    const scene = scenes[1]!;
    const stage = scene.stages.at(-1)!;
    expect(positionFromDeepLink(scenes, `?scene=${scene.id}&stage=${stage.id}`)).toEqual({ sceneIndex: 1, stageIndex: scene.stages.length - 1 });
    expect(positionFromDeepLink(scenes, "?scene=does-not-exist")).toBeNull();
  });

  it("records unique pedagogical states and resets deterministically", () => {
    const initial = createInitialState({ mode: "aula", requestedMode: "aula", lessonId: lesson01.id, scenes });
    const next = runtimeReducer(initial, { type: "NEXT", lessonId: lesson01.id, scenes });
    const back = runtimeReducer(next, { type: "PREVIOUS", lessonId: lesson01.id, scenes });
    expect(back.sceneIndex).toBe(0);
    expect(back.stageIndex).toBe(0);
    expect(back.visited).toHaveLength(2);
    expect(runtimeReducer(back, { type: "RESET", lessonId: lesson01.id, scenes })).toEqual(initial);
  });
});

describe("persistence, keyboard and capture", () => {
  beforeEach(() => localStorage.clear());

  it("round-trips versioned progress and ignores invalid payloads", () => {
    writeProgress(localStorage, lesson01.id, { sceneIndex: 2, stageIndex: 1 }, ["a", "a", "b"]);
    expect(readProgress(localStorage, lesson01.id)?.visited).toEqual(["a", "b"]);
    localStorage.setItem(storageKey(lesson01.id), "not-json");
    expect(readProgress(localStorage, lesson01.id)).toBeNull();
  });

  it("does not hijack keys from interactive controls", () => {
    const input = document.createElement("input");
    expect(shouldIgnoreKeyboard(input)).toBe(true);
    expect(commandFromKey(new KeyboardEvent("keydown", { key: "ArrowRight" }))).toBe("next");
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
  });

  it("keeps capture opt-in, desktop-only and 16:9", () => {
    expect(isCleanCapture("?mode=aula&capture=1", 1600)).toBe(true);
    expect(isCleanCapture("?mode=estudio&capture=1", 1600)).toBe(false);
    expect(isCleanCapture("?mode=video&capture=1", 900)).toBe(false);
    expect(recordableCanvasRatio(1600, 900)).toBeCloseTo(16 / 9, 8);
  });
});
