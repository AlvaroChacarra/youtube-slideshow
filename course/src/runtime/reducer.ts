import type { BaseMode, Scene } from "../../contracts/course";
import { clampPosition, nextPosition, previousPosition, stateKey, type Position } from "./navigation";

export type Scenario = Readonly<{ couponRate: number; notional: number; faceValue: number; maturityYears: number; yield: number; reinvestmentRate: number }>;
export type RuntimeState = Position & Readonly<{
  mode: BaseMode;
  requestedMode: BaseMode;
  optionalEnabled: boolean;
  teacherOpen: boolean;
  visited: string[];
  scenario: Scenario;
}>;

export type RuntimeAction =
  | { type: "NEXT"; scenes: readonly Scene[]; lessonId: string }
  | { type: "PREVIOUS"; scenes: readonly Scene[]; lessonId: string }
  | { type: "JUMP"; scenes: readonly Scene[]; lessonId: string; position: Position }
  | { type: "RESET"; lessonId: string; scenes: readonly Scene[] }
  | { type: "SET_MODE"; mode: BaseMode; requestedMode?: BaseMode }
  | { type: "TOGGLE_OPTIONAL" }
  | { type: "TOGGLE_TEACHER" }
  | { type: "CLOSE_TEACHER" }
  | { type: "SCENARIO"; patch: Partial<Scenario> };

export const canonicalScenario: Scenario = Object.freeze({ couponRate: 0.04, notional: 100, faceValue: 100, maturityYears: 5, yield: 0.04, reinvestmentRate: 0 });

function visit(state: RuntimeState, scenes: readonly Scene[], lessonId: string, position: Position): RuntimeState {
  const bounded = clampPosition(scenes, position);
  const key = stateKey(lessonId, scenes[bounded.sceneIndex], bounded.stageIndex);
  return { ...state, ...bounded, visited: [...new Set([...state.visited, key])] };
}

export function createInitialState(input: { mode: BaseMode; requestedMode: BaseMode; position?: Position | undefined; visited?: string[] | undefined; lessonId: string; scenes: readonly Scene[] }): RuntimeState {
  const position = clampPosition(input.scenes, input.position ?? { sceneIndex: 0, stageIndex: 0 });
  return {
    ...position,
    mode: input.mode,
    requestedMode: input.requestedMode,
    optionalEnabled: false,
    teacherOpen: false,
    visited: [...new Set([...(input.visited ?? []), stateKey(input.lessonId, input.scenes[position.sceneIndex], position.stageIndex)])],
    scenario: canonicalScenario
  };
}

export function runtimeReducer(state: RuntimeState, action: RuntimeAction): RuntimeState {
  switch (action.type) {
    case "NEXT": return visit(state, action.scenes, action.lessonId, nextPosition(action.scenes, state));
    case "PREVIOUS": return visit(state, action.scenes, action.lessonId, previousPosition(action.scenes, state));
    case "JUMP": return visit(state, action.scenes, action.lessonId, action.position);
    case "RESET": return createInitialState({ mode: state.mode, requestedMode: state.requestedMode, lessonId: action.lessonId, scenes: action.scenes });
    case "SET_MODE": return { ...state, mode: action.mode, requestedMode: action.requestedMode ?? action.mode, sceneIndex: 0, stageIndex: 0 };
    case "TOGGLE_OPTIONAL": return { ...state, optionalEnabled: !state.optionalEnabled };
    case "TOGGLE_TEACHER": return { ...state, teacherOpen: !state.teacherOpen };
    case "CLOSE_TEACHER": return { ...state, teacherOpen: false };
    case "SCENARIO": return { ...state, scenario: { ...state.scenario, ...action.patch } };
  }
}
