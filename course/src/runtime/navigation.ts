import type { Scene } from "../../contracts/course";

export type Position = Readonly<{ sceneIndex: number; stageIndex: number }>;

export function clampPosition(scenes: readonly Scene[], position: Position): Position {
  const sceneIndex = Math.min(Math.max(position.sceneIndex, 0), Math.max(0, scenes.length - 1));
  const maxStage = Math.max(0, (scenes[sceneIndex]?.stages.length ?? 1) - 1);
  return { sceneIndex, stageIndex: Math.min(Math.max(position.stageIndex, 0), maxStage) };
}

export function nextPosition(scenes: readonly Scene[], current: Position): Position {
  const scene = scenes[current.sceneIndex];
  if (!scene) return { sceneIndex: 0, stageIndex: 0 };
  if (current.stageIndex < scene.stages.length - 1) return { sceneIndex: current.sceneIndex, stageIndex: current.stageIndex + 1 };
  return clampPosition(scenes, { sceneIndex: current.sceneIndex + 1, stageIndex: 0 });
}

export function previousPosition(scenes: readonly Scene[], current: Position): Position {
  if (current.stageIndex > 0) return { sceneIndex: current.sceneIndex, stageIndex: current.stageIndex - 1 };
  if (current.sceneIndex <= 0) return { sceneIndex: 0, stageIndex: 0 };
  const sceneIndex = current.sceneIndex - 1;
  return { sceneIndex, stageIndex: Math.max(0, (scenes[sceneIndex]?.stages.length ?? 1) - 1) };
}

export function positionFromDeepLink(scenes: readonly Scene[], search: string): Position | null {
  const params = new URLSearchParams(search);
  const sceneId = params.get("scene");
  if (!sceneId) return null;
  const sceneIndex = scenes.findIndex((scene) => scene.id === sceneId);
  if (sceneIndex < 0) return null;
  const stageId = params.get("stage");
  const stageIndex = stageId ? scenes[sceneIndex]?.stages.findIndex((stage) => stage.id === stageId) ?? 0 : 0;
  return { sceneIndex, stageIndex: Math.max(0, stageIndex) };
}

export function stateKey(lessonId: string, scene: Scene | undefined, stageIndex: number): string {
  return `${lessonId}:${scene?.id ?? "none"}:${scene?.stages[stageIndex]?.id ?? "none"}`;
}
