import { BattleState } from "@battles";
import { createAbilitySelectionUi } from "./ability-selection-ui";

export const createAbilitySelectionState = (): BattleState => {
  return {
    onEnter: () => {
      return { ui: createAbilitySelectionUi() };
    },
    onExit: ({ ui }) => {
      ui.dispose();
      return {
        ui: undefined,
      };
    },
  };
};
