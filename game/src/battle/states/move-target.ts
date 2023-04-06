import { createWalkMovement } from "../movement";
import { PathfinderData, createPathfinder } from "../pathfinder";
import { BattleState } from "../state";
import { createMoveTargetUi } from "./move-target-ui";

export const createMoveTargetState = (): BattleState => {
  let paths: PathfinderData[] = [];
  let cleanup: () => void;

  return {
    onEnter: (context) => {
      const start = context.turn.actor().tile().position();
      const movement = createWalkMovement(context.turn.actor());
      const pathfinder = createPathfinder(context.board, movement);
      const { dispose } = createMoveTargetUi(context.board, pathfinder);

      paths = pathfinder.getPathsInRange(pathfinder.map()[start[0]][start[1]]);
      cleanup = dispose;

      for (const path of paths) {
        path.tile?.setSelected(true);
      }

      return context;
    },
    onExit: (context) => {
      for (const path of paths) {
        path.tile?.setSelected(false);
      }

      cleanup();

      return context;
    },
  };
};
