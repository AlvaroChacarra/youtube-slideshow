import type { BaseMode, Lesson, Scene } from "../../contracts/course";

export type DeliverySelection = Readonly<{
  requestedMode: BaseMode;
  mode: BaseMode;
  professor: boolean;
  capture: boolean;
  mobileFallback: boolean;
}>;

export function resolveDelivery(input: { search: string; viewportWidth: number }): DeliverySelection {
  const params = new URLSearchParams(input.search);
  const requested = params.get("mode");
  const requestedMode: BaseMode = requested === "aula" || requested === "video" ? requested : "estudio";
  const mobileFallback = input.viewportWidth <= 900 && requestedMode !== "estudio";
  return Object.freeze({
    requestedMode,
    mode: mobileFallback ? "estudio" : requestedMode,
    professor: params.get("profe") === "1" && requestedMode === "aula" && !mobileFallback,
    capture: params.get("capture") === "1" && (requestedMode === "aula" || requestedMode === "video") && !mobileFallback,
    mobileFallback
  });
}

function videoScenes(lesson: Lesson): Scene[] {
  const presentation = lesson.scenes.filter((scene) => scene.route === "LIVE" && scene.phase === "presentation");
  let minutes = presentation.reduce((sum, scene) => sum + scene.durationMinutes, 0);
  const selected = [...presentation];
  const removable = [
    ...selected.filter((scene) => scene.type === "recall"),
    ...selected.filter((scene) => scene.type !== "recall" && scene.type !== "bridge").sort((a, b) => a.durationMinutes - b.durationMinutes)
  ];
  for (const scene of removable) {
    if (minutes <= 18) break;
    if (minutes - scene.durationMinutes < 12) continue;
    const index = selected.findIndex((item) => item.id === scene.id);
    if (index >= 0) selected.splice(index, 1);
    minutes -= scene.durationMinutes;
  }
  return selected;
}

export function scopedScenes(lesson: Lesson, mode: BaseMode, optionalEnabled: boolean): Scene[] {
  if (mode === "video") return videoScenes(lesson);
  if (mode === "aula") return lesson.scenes.filter((scene) => scene.route === "LIVE");
  return lesson.scenes.filter((scene) => scene.route === "LIVE" || scene.route === "REQUIRED" || optionalEnabled);
}

export function videoMinutes(lesson: Lesson): number {
  return videoScenes(lesson).reduce((sum, scene) => sum + scene.durationMinutes, 0);
}
