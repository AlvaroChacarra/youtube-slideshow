import type { DeliveryProfile, Lesson, Route, Scene } from "../course";

export const deliveryProfiles: DeliveryProfile[] = ["AULA", "ESTUDIO", "VIDEO", "CAPTURE"];

type SceneInput = Omit<Scene, "stages" | "teacher"> & {
  component: string;
  stageLabels?: string[];
  teacher?: Partial<Scene["teacher"]>;
};

export function scene(input: SceneInput): Scene {
  const labels = input.stageLabels ?? ["Idea", "Mecanismo", "Conclusión"];
  const route: Route = input.route;
  return {
    id: input.id,
    title: input.title,
    type: input.type,
    route,
    phase: input.phase,
    durationMinutes: input.durationMinutes,
    sourceRefs: input.sourceRefs,
    concepts: input.concepts,
    stages: labels.map((label, index) => ({
      id: `${input.id}-${index + 1}`,
      label,
      route,
      component: input.component,
      concepts: input.concepts
    })),
    teacher: {
      objective: input.teacher?.objective ?? input.title,
      askBeforeReveal: input.teacher?.askBeforeReveal ?? "¿Qué relación esperas ver?",
      interaction: input.teacher?.interaction ?? "Avanza por estados y pide una predicción antes del resultado.",
      commonError: input.teacher?.commonError ?? "Confundir la etiqueta con la magnitud económica.",
      bridge: input.teacher?.bridge ?? "Conecta la conclusión con la siguiente escena."
    }
  };
}

export function routesFromScenes(scenes: Scene[]): Lesson["routes"] {
  return {
    LIVE: scenes.filter((item) => item.route === "LIVE").map((item) => item.id),
    REQUIRED: scenes.filter((item) => item.route === "REQUIRED").map((item) => item.id),
    OPTIONAL: scenes.filter((item) => item.route === "OPTIONAL").map((item) => item.id)
  };
}
