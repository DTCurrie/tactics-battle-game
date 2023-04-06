import { BattleState } from "../state";
import { createCommandSelectionUi } from "./command-selection-ui";

export const createCommandSelectionState = (): BattleState => {
  const { dispose } = createCommandSelectionUi();

  return {
    onExit: (context) => {
      dispose();
      return context;
    },
  };
};
