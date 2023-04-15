import { button, buttons } from "@tactics-battle-game/ui";
import { BattleContext, battleStateMachine } from "../battle-state-machine";
import { createMoveTargetState } from "./move-target";
import { createCategorySelectionState } from "./category-selection-state";

export const createCommandSelectionUi = ({
  turn: { actor, moved, undoMove },
  board,
}: Pick<BattleContext, "turn" | "board">) => {
  const move = button("Move", () =>
    battleStateMachine().transition(createMoveTargetState())
  );

  const undo = button("Undo Move", () => {
    undoMove();
    const position = actor.get().position.get();
    board.moveSelector([position.x, position.z]);
  });

  const btns = buttons([
    moved.get() ? undo : move,
    button("Action", () =>
      battleStateMachine().transition(createCategorySelectionState())
    ),
    button("Wait", () => console.log("wait")),
  ]);

  moved.listen((next) => {
    btns.removeChild(btns.children[0]);
    btns.prepend(next ? undo : move);
  });

  document.body.prepend(btns);
  const dispose = () => document.body.removeChild(btns);

  return { dispose };
};
