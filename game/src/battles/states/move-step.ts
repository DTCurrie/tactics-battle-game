import { BattleState, battleStateMachine } from "../battle-state-machine";
import { PathfinderData } from "../pathfinder";
import { createCommandSelectionState } from "./command-selection";
import { createWalkMovement } from "../movement";

export const createMoveStepState = (
  targets: PathfinderData[],
  cursor: number
): BattleState => {
  return {
    onEnter: (context) => {
      const movement = createWalkMovement(context.turn.actor.get());
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

        context.turn.actor.get().tile.get().setContent(undefined);
        context.turn.actor.get().setTile(target.tile);
        context.turn.moved.set(true);

        battleStateMachine().transition(createCommandSelectionState());
      });

      return { ...context };
    },
  };
};
