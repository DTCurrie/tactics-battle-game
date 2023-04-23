import {
  BattleState,
  PathfinderData,
  simpleSearch,
  createPathfinder,
} from "@battles";
import { JUMP, MOVE } from "@units/stats";
import { createMoveTargetUi } from "./move-target-ui";

export const createMoveTargetState = (): BattleState => {
  let paths: PathfinderData[] = [];

  return {
    onEnter: ({ board, turn }) => {
      const actor = turn.actor();
      const start = actor.position();

      const expandSearch = (from: PathfinderData, to: PathfinderData) => {
        if (!to.tile || !from.tile) {
          return false;
        }

        if (to.tile.occupied()) {
          return false;
        }

        const fromHeight = from.tile.height();
        const toHeight = to.tile.height();
        const heightAbs = Math.abs(fromHeight - toHeight);
        const jumpHeight = actor.getStat(JUMP);
        if (heightAbs > jumpHeight) {
          return false;
        }

        const move = actor.getStat(MOVE);
        return simpleSearch(move, from.cost);
      };

      const pathfinder = createPathfinder(board, expandSearch);

      paths = pathfinder.getPathsInRange(
        pathfinder.paths.get()[start.x][start.z]
      );

      for (const path of paths) {
        path.tile.setMarked("movement");
      }

      return { ui: createMoveTargetUi(board, pathfinder) };
    },
    onExit: ({ ui }) => {
      for (const path of paths) {
        path.tile.setMarked();
      }

      ui.dispose();

      return { ui: undefined };
    },
  };
};
