import { BattleState } from "../state";
import { createCommandSelectionUi } from "./command-selection-ui";

export const createCommandSelectionState = (): BattleState => {
  let cleanup: () => void;

  return {
    onEnter: (context) => {
      const { dispose } = createCommandSelectionUi(context);
      cleanup = dispose;
      return { ...context };
    },
    onExit: (context) => {
      cleanup();
      return { ...context };
    },
  };
};
