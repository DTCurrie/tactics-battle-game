import { BattleState, battleStateMachine } from "../battle-state-machine";
import { PathfinderData } from "../pathfinder";
import { createCommandSelectionState } from "./command-selection";
import { createWalkMovement } from "../movement";

export const createMoveStepState = (
  targets: PathfinderData[],
  cursor: number
): BattleState => {
  return {
    onEnter: ({ board, turn }) => {
      const actor = turn.actor();
      const movement = createWalkMovement(actor);
      const tweens = movement.move(targets[cursor]);

      tweens[0].onComplete(() => {
        const next = cursor + 1;
        if (cursor < targets.length - 1) {
          battleStateMachine().transition(createMoveStepState(targets, next));
          return;
        }

        const target = targets[cursor];
        if (target.tile === undefined) {
          throw new Error("Invalid target in pathfinding", { cause: target });
        }

        const tile = board.getTile(actor.coordinates());
        tile.setOccupied(true);
        turn.setMoved(true);

        battleStateMachine().transition(createCommandSelectionState());
      });

      return {};
    },
  };
};
