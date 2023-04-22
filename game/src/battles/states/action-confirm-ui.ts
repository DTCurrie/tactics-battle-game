import { button, buttons } from "@tactics-battle-game/ui";
import { battleStateMachine } from "../battle-state-machine";
import { createActionTargetState } from "./action-target";
import { Action } from "@battles/actions/action-types";
import { MarkerColor } from "@tactics-battle-game/core";

export const createActionConfirmUi = (
  action: Action,
  type: Extract<MarkerColor, "attack" | "support">
) => {
  const btns = buttons([
    button(
      "Confirm",
      () => console.log("confirm")
      // battleStateMachine().transition(createCommandSelectionState())
    ),
    button("Cancel", () =>
      battleStateMachine().transition(createActionTargetState(action, type))
    ),
  ]);

  document.body.prepend(btns);

  const dispose = () => {
    document.body.removeChild(btns);
  };

  return { dispose };
};
