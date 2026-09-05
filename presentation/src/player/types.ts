import type { ReactNode, CSSProperties } from 'react';

export type Scenario = Record<string, number | string | boolean | null>;
export type Position = { slide: number; step: number };
export type Snapshot<S extends Scenario = Scenario> = { sceneId: string; stepId: string; scenario: S };
export type SceneContext<S extends Scenario> = {
  sceneId: string; step: number; motion: boolean; scenario: S;
  update: (patch: Partial<S>) => void; jump: (sceneId: string) => void;
};
export type Concept = { id: string; title: string; explanation: string; introducedAt: string; inputs?: string; output?: string };
export type Scene<S extends Scenario> = {
  id: string; title: string; eyebrow: string; chapter: number;
  steps: { id: string; title: string; caption: string }[];
  note: string; question: string; answer: string;
  conceptIds: string[]; prerequisiteIds: string[]; entityIds: string[]; scenarioId: string;
  cover?: boolean; className?: string;
  render: (context: SceneContext<S>) => ReactNode;
  caption?: (context: SceneContext<S>) => string;
};
export type DeckDefinition<S extends Scenario> = {
  id: string; version: number; title: string; subtitle: string; author: string; mark: string;
  className: string; theme?: CSSProperties;
  chapters: { title: string; sceneId: string }[];
  scenes: Scene<S>[]; concepts: Concept[]; entities: string[]; scenarioIds: string[];
  initialScenario: S;
  validateScenario: (value: unknown) => value is S;
  resetScene: (sceneId: string, scenario: S) => S;
  backdrop?: (context: SceneContext<S>) => ReactNode;
  controls?: (context: SceneContext<S>) => ReactNode;
  overlay?: (context: SceneContext<S>) => ReactNode;
};
