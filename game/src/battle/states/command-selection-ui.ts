import { button, buttons } from "@tactics-battle-game/ui";
import { battleStateMachine } from "../state";
import { createMoveTargetState } from "./move-target";

export const createCommandSelectionUi = () => {
  const btns = buttons([
    button("Move", () =>
      battleStateMachine().transition(createMoveTargetState())
    ),
    button("Action", () => console.log("action")),
    button("Wait", () => console.log("wait")),
  ]);

  document.body.prepend(btns);

  const dispose = () => document.body.removeChild(btns);

  return { dispose };
};
