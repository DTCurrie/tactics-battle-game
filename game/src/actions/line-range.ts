import { Vector2Tuple } from "three";
import {
  BOARD_DEPTH,
  BOARD_WIDTH,
  Board,
  Direction,
  Tile,
  directions,
} from "@tactics-battle-game/core";
import { Actor } from "@battles";
import { ActionRange } from "./action-types";

export const createLineRange = (horizontal = 1, vertical = 2): ActionRange => {
  const getPathsInRange = (board: Board, actor: Actor): Tile[] => {
    const tiles: Tile[] = [];
    const current: Vector2Tuple = [actor.position().x, actor.position().z];

    for (const direction of directions) {
      const next: Vector2Tuple = [...current];
      let end: Vector2Tuple = [...current];

      switch (direction) {
        case Direction.North:
          end = [current[0], current[1] + horizontal];
          break;
        case Direction.East:
          end = [current[0] + horizontal, current[1]];
          break;
        case Direction.South:
          end = [current[0], current[1] - horizontal];
          break;
        case Direction.West:
          end = [current[0] - horizontal, current[1]];
          break;
      }

      for (let i = 0; i < horizontal; i++) {
        switch (direction) {
          case Direction.North:
          case Direction.South: {
            if (next[1] < end[1]) {
              next[1] += 1;
            } else if (next[1] > end[1]) {
              next[1] -= 1;
            }
            break;
          }

          case Direction.East:
          case Direction.West: {
            if (next[0] < end[0]) {
              next[0] += 1;
            } else if (next[0] > end[0]) {
              next[0] -= 1;
            }
            break;
          }
        }

        if (next[0] === current[0] && next[1] === current[1]) {
          continue;
        }

        if (
          next[0] < 0 ||
          (next[0] >= BOARD_WIDTH && next[1] < 0) ||
          next[1] >= BOARD_DEPTH
        ) {
          continue;
        }

        const tile = board.getTile(next);
        const actorTile = board.getTile(current);
        if (tile && Math.abs(tile.height() - actorTile.height()) <= vertical) {
          tiles.push(board.grid[next[0]][next[1]]);
        }
      }
    }

    return tiles;
  };

  return {
    directionOriented: true,
    getPathsInRange,
  };
};
