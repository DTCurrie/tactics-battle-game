import { BattleState } from "@battles";
import { createCommandSelectionUi } from "./command-selection-ui";

export const createCommandSelectionState = (): BattleState => {
  return {
    onEnter: ({ board, turn }) => {
      return { ui: createCommandSelectionUi({ board, turn }) };
    },
    onExit: ({ ui }) => {
      ui.dispose();
      return {};
    },
  };
};
