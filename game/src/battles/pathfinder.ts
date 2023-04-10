import {
  Board,
  settings,
  Tile,
  normalizedDirections,
} from "@tactics-battle-game/api";
import { Vector2Tuple } from "three";
import { createQueue } from "../lib/queue";
import { ReadableAtom, action, atom } from "nanostores";

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
    if (path.tile?.content() === undefined) {
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

export const createPathfinder = (
  board: Board,
  expandSearch: (from: PathfinderData, to: PathfinderData) => boolean
): Pathfinder => {
  const paths = atom<PathfinderData[][]>(
    Array.from({ length: settings.board.width }, () =>
      Array.from({ length: settings.board.depth })
    )
  );

  const reset = action(paths, "reset", (store) => {
    const next: PathfinderData[][] = Array.from(
      { length: settings.board.width },
      () => Array.from({ length: settings.board.depth })
    );

    for (let x = 0; x < settings.board.width; x++) {
      for (let y = 0; y < settings.board.depth; y++) {
        const coordinates: Vector2Tuple = [x, y];

        next[x][y] = {
          coordinates,
          cost: Number.MAX_SAFE_INTEGER,
          tile: board.getTile(coordinates),
        };
      }
    }

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

  reset();

  return {
    paths,
    reset,
    getPathsInRange,
  };
};
