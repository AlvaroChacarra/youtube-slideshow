import type { Scenario } from "../runtime/reducer";

export type VisualProps = {
  stage: number;
  scenario: Scenario;
  onScenario?: ((patch: Partial<Scenario>) => void) | undefined;
  compact?: boolean | undefined;
};
