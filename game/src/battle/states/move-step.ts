import { BattleState, battleStateMachine } from "../state";
import { PathfinderData } from "../pathfinder";
import { updatesSystem } from "@tactics-battle-game/three-utils";
import { createCommandSelectionState } from "./command-selection";
import { createWalkMovement } from "../movement";
import { Tween } from "@tweenjs/tween.js";
import { Quaternion, Vector3 } from "three";

const { addUpdate, removeUpdate } = updatesSystem();

export const createMoveStepState = (
  targets: PathfinderData[],
  cursor: number
): BattleState => {
  let toUpdate: (Tween<Quaternion> | Tween<Vector3>)[] = [];
  const animate = () => {
    for (const tween of toUpdate) {
      tween.update();
    }
  };

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

        context.turn.actor().tile().setContent();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        context.turn.actor().setTile(targets[cursor].tile!);
        battleStateMachine().transition(createCommandSelectionState());
      });

      toUpdate = [...tweens];
      addUpdate(animate);
      return context;
    },
    onExit: (context) => {
      removeUpdate(animate);
      return context;
    },
  };
};
