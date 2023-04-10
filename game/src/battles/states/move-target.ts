import { PathfinderData, createPathfinder, simpleSearch } from "../pathfinder";
import { BattleState } from "../battle-state-machine";
import { createMoveTargetUi } from "./move-target-ui";

export const createMoveTargetState = (): BattleState => {
  let paths: PathfinderData[] = [];
  let cleanup: () => void;

  return {
    onEnter: (context) => {
      const start = context.turn.actor.get().tile.get().position();

      const expandSearch = (from: PathfinderData, to: PathfinderData) => {
        if (!to.tile || !from.tile) {
          return false;
        }

        if (to.tile.content() !== undefined) {
          return false;
        }

        const fromHeight = from.tile.height();
        const toHeight = to.tile.height();
        const heightAbs = Math.abs(fromHeight - toHeight);
        const jumpHeight = context.turn.actor.get().getStat("jump");
        if (heightAbs > jumpHeight) {
          return false;
        }

        const move = context.turn.actor.get().getStat("move");
        return simpleSearch(move, from.cost);
      };

      const pathfinder = createPathfinder(context.board, expandSearch);
      const { dispose } = createMoveTargetUi(context.board, pathfinder);

      paths = pathfinder.getPathsInRange(
        pathfinder.paths.get()[start[0]][start[1]]
      );
      cleanup = dispose;

      for (const path of paths) {
        path.tile?.setSelected(true);
      }

      return { ...context };
    },
    onExit: (context) => {
      for (const path of paths) {
        path.tile?.setSelected(false);
      }

      cleanup();

      return { ...context };
    },
  };
};
