import { BattleState, battleStateMachine } from "../state";
import { PathfinderData } from "../pathfinder";
import { createCommandSelectionState } from "./command-selection";
import { createWalkMovement } from "../movement";

export const createMoveStepState = (
  targets: PathfinderData[],
  cursor: number
): BattleState => {
  return {
    onEnter: (context) => {
      const movement = createWalkMovement(context.turn.actor());
      const tweens = movement.move(targets[cursor]);
      tweens[0].onComplete(() => {
        const next = cursor + 1;
        if (next < targets.length) {
          battleStateMachine().transition(createMoveStepState(targets, next));
          return;
        }

        battleStateMachine().transition(createCommandSelectionState());
      });

      return { ...context };
    },
    onExit: (context) => {
      context.turn.actor().tile().setContent();
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      context.turn.actor().setTile(targets[cursor].tile!);
      context.turn.setMoved(true);
      return { ...context };
    },
  };
};
