import { MarkerColor } from "@tactics-battle-game/core";
import { button, buttons } from "@tactics-battle-game/ui";
import { Action } from "@actions/action-types";
import { battleStateMachine } from "@battles";
import { createActionTargetState } from "./action-target";

export const createActionConfirmUi = (
  action: Action,
  type: Extract<MarkerColor, "offense" | "support">
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
