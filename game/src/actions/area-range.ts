import { Vector2Tuple } from "three";
import { Board } from "@tactics-battle-game/core";

import {
  Actor,
  PathfinderData,
  createPathfinder,
  simpleSearch,
} from "@battles";

import { ActionRange } from "./action-types";

export const createAreaRange = (horizontal = 3, vertical = 1): ActionRange => {
  const expandSearch = (from: PathfinderData, to: PathfinderData) => {
    if (!to.tile || !from.tile) {
      return false;
    }

    const fromHeight = from.tile.height();
    const toHeight = to.tile.height();
    const heightAbs = Math.abs(fromHeight - toHeight);
    if (heightAbs > vertical) {
      return false;
    }

    return simpleSearch(horizontal, from.cost);
  };

  const getPathsInRange = (board: Board, actor: Actor): PathfinderData[] => {
    const pathfinder = createPathfinder(board, expandSearch);
    const start: Vector2Tuple = actor.coordinates();
    return pathfinder.getPathsInRange(
      pathfinder.paths.get()[start[0]][start[1]]
    );
  };

  return {
    directionOriented: true,
    getPathsInRange,
  };
};
