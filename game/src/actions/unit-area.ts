import { Board, Tile } from "@tactics-battle-game/core";
import { ActionArea } from "./action-types";

export const createTileArea = (): ActionArea => {
  const getTilesInArea = (_board: Board, target: Tile): Tile[] => {
    return [target];
  };

  return { getTilesInArea };
};
