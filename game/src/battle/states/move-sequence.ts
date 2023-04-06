import { BattleState, battleStateMachine } from "../state";
import { PathfinderData } from "../pathfinder";
import { createMoveStepState } from "./move-step";

export const createMoveSequenceState = (
  target: PathfinderData
): BattleState => {
  const targets: PathfinderData[] = [];
  let current: PathfinderData | undefined = target;

  return {
    onEnter: (context) => {
      while (current !== undefined) {
        targets.unshift(current);
        current = current.previous;
      }

      battleStateMachine().transition(createMoveStepState(targets, 1));

      return context;
    },
  };
};
