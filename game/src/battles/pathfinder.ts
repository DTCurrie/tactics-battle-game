import { Vector2Tuple } from "three";
import { ReadableAtom, action, atom } from "nanostores";
import {
  BOARD_DEPTH,
  BOARD_WIDTH,
  Board,
  Tile,
  normalizedDirections,
} from "@tactics-battle-game/core";
import { createQueue } from "@lib/queue";

export type PathfinderData = {
  previous?: PathfinderData;
  coordinates: Vector2Tuple;
  cost: number;
  tile: Tile;
};

export const simpleSearch = (range: number, cost: number) => cost + 1 <= range;

export const filterPath = (paths: PathfinderData[]) => {
  const filtered = [];

  for (const path of paths) {
    if (!path.tile.occupied()) {
      filtered.push(path);
    }
  }

  return filtered;
};

export type Pathfinder = Readonly<{
  paths: ReadableAtom<PathfinderData[][]>;
}> & {
  reset: () => void;
  getPathsInRange: (start: PathfinderData) => PathfinderData[];
};

export const createPathfinderMap = (board: Board) => {
  const map: PathfinderData[][] = Array.from({ length: BOARD_WIDTH }, () =>
    Array.from({ length: BOARD_DEPTH })
  );

  for (let x = 0; x < BOARD_WIDTH; x++) {
    for (let y = 0; y < BOARD_DEPTH; y++) {
      const coordinates: Vector2Tuple = [x, y];

      map[x][y] = {
        coordinates,
        cost: Number.MAX_SAFE_INTEGER,
        tile: board.getTile(coordinates),
      };
    }
  }

  return map;
};

export const createPathfinder = (
  board: Board,
  expandSearch: (from: PathfinderData, to: PathfinderData) => boolean
): Pathfinder => {
  const paths = atom<PathfinderData[][]>(createPathfinderMap(board));

  const reset = action(paths, "reset", (store) => {
    const next = createPathfinderMap(board);
    store.set(next);
  });

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
      const path = frontier.dequeue();
      if (!path) {
        break;
      }

      for (const direction of normalizedDirections) {
        const col = paths.get()[path.coordinates[0] + direction[0]];
        if (!col) {
          continue;
        }

        const neighbor =
          paths.get()[path.coordinates[0] + direction[0]][
            path.coordinates[1] + direction[1]
          ];

        if (!neighbor) {
          continue;
        }

        if (neighbor.cost <= path.cost + 1) {
          continue;
        }

        if (checkCost(path, neighbor)) {
          const offset = (neighbor.tile.height() - path.tile.height()) / 2;
          neighbor.cost = path.cost + offset + 1;
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

  const getPathsInRange = (start: PathfinderData) =>
    filterPath(rangeSearch(start, expandSearch));

  return {
    paths,
    reset,
    getPathsInRange,
  };
};
