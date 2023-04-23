import { button, buttons } from "@tactics-battle-game/ui";
import { battleStateMachine } from "@battles";
import { createCommandSelectionState } from "./command-selection";

export const createAbilitySelectionUi = () => {
  const btns = buttons([
    button("Cancel", () =>
      battleStateMachine().transition(createCommandSelectionState())
    ),
  ]);

  document.body.prepend(btns);

  const dispose = () => document.body.removeChild(btns);

  return { dispose };
};
