import { button, buttons } from "@tactics-battle-game/ui";
import { BattleContext, battleStateMachine } from "../state";
import { createMoveTargetState } from "./move-target";
import { createCommandSelectionState } from "./command-selection";

export const createCommandSelectionUi = ({
  turn,
  board,
}: Pick<BattleContext, "turn" | "board">) => {
  const move = button("Move", () =>
    battleStateMachine().transition(createMoveTargetState())
  );

  const undo = button("Undo Move", () => {
    turn.undoMove();
    board.updateSelector(turn.actor().tile().position());
    battleStateMachine().transition(createCommandSelectionState());
  });

  const btns = buttons([
    turn.moved() ? undo : move,
    button("Action", () => console.log("action")),
    button("Wait", () => console.log("wait")),
  ]);

  document.body.prepend(btns);

  const dispose = () => document.body.removeChild(btns);

  return { dispose };
};
