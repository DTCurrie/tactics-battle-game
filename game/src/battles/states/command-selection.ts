import { BattleState } from "@battles/battle-state-machine";
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
