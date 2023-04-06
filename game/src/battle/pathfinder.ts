import {
  Board,
  SETTINGS,
  Tile,
  normalizedDirections,
} from "@tactics-battle-game/api";
import { Vector2Tuple } from "three";
import { createQueue } from "../lib/queue";
import { Movement } from "./movement";

export type PathfinderData = {
  previous?: PathfinderData;
  coordinates: Vector2Tuple;
  cost: number;
  tile?: Tile;
};

export const simpleSearch = (range: number, cost: number) => cost + 1 <= range;

export const filterPath = (paths: PathfinderData[]) => {
  const filtered = [];

  for (const path of paths) {
    if (!path.tile?.content()) {
      filtered.push(path);
    }
  }

  return filtered;
};

export type Pathfinder = {
  map: () => PathfinderData[][];
  reset: () => void;
  getPathsInRange: (start: PathfinderData) => PathfinderData[];
};

export const createPathfinder = (board: Board, movement: Movement) => {
  const map: PathfinderData[][] = Array.from(
    { length: SETTINGS.board.width },
    () => Array.from({ length: SETTINGS.board.depth })
  );

  const reset = () => {
    for (let x = 0; x < SETTINGS.board.width; x++) {
      for (let y = 0; y < SETTINGS.board.depth; y++) {
        const coordinates: Vector2Tuple = [x, y];

        map[x][y] = {
          coordinates,
          cost: Number.MAX_SAFE_INTEGER,
          tile: board.getTile(coordinates),
        };
      }
    }
  };

  const rangeSearch = (
    start: PathfinderData,
    checkCost: (from: PathfinderData, to: PathfinderData) => boolean
  ) => {
    const visited = [start];
    const frontier = createQueue<PathfinderData>();

    reset();
    start.cost = 0;
    frontier.enqueue(start);

    while (frontier.count() > 0) {
      // if there is a count, something can be dequeued
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const path = frontier.dequeue()!;

      for (const direction of normalizedDirections) {
        const col = map[path.coordinates[0] + direction[0]];
        if (!col) {
          continue;
        }

        const neighbor =
          map[path.coordinates[0] + direction[0]][
            path.coordinates[1] + direction[1]
          ];

        if (!neighbor) {
          continue;
        }

        if (neighbor.cost <= path.cost + 1) {
          continue;
        }

        if (checkCost(path, neighbor)) {
          neighbor.cost = path.cost + 1;
          neighbor.previous = path;

          if (!visited.includes(neighbor)) {
            frontier.enqueue(neighbor);
            visited.push(neighbor);
          }
        }
      }
    }

    return visited;
  };

  const getPathsInRange = (start: PathfinderData) => {
    const paths = filterPath(rangeSearch(start, movement.expandSearch));
    return paths;
  };

  reset();

  return {
    map: () => map,
    reset,
    getPathsInRange,
  };
};
