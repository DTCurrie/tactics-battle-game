import { button, buttons } from "@tactics-battle-game/ui";
import { battleStateMachine } from "@battles/battle-state-machine";
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
