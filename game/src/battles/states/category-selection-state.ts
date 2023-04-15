import { BattleState } from "../battle-state-machine";
import { createCategorySelectionUi } from "./category-selection-ui";

export const createCategorySelectionState = (): BattleState => {
  let cleanup: () => void;

  return {
    onEnter: (context) => {
      const { dispose } = createCategorySelectionUi();
      cleanup = dispose;
      return { ...context };
    },
    onExit: (context) => {
      cleanup();
      return { ...context };
    },
  };
};
