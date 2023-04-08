import { nanoid } from "nanoid";

import {
  Direction,
  Entity,
  EntityOptions,
  Stats,
  Tile,
  createEntity,
} from "@tactics-battle-game/api";

export type Unit = Entity & {
  stats: () => Stats;
  setStats: (next: Partial<Stats>) => void;

  tile: () => Tile;
  setTile: (next: Tile) => void;
};

export type UnitOptions = EntityOptions & {
  stats?: Omit<Stats, "ctr">;
};

export const createUnit = ({
  name,
  mesh,
  id = nanoid(),
  stats: initialStats,
}: UnitOptions): Unit => {
  const entity = createEntity({ name, mesh });
  let stats = { ...(initialStats ?? { speed: 0, move: 0, jump: 0 }), ctr: 0 };
  let tile: Tile;
  let direction: Direction;

  const setStats = (next: Partial<Stats>) => {
    stats = { ...stats, ...next };
  };

  const setTile = (next: Tile) => {
    if (next.content()) {
      return;
    }

    next.setContent(entity);
    tile = next;
  };

  return {
    ...entity,

    stats: () => stats,
    setStats,

    tile: () => tile,
    setTile,

    debug: () =>
      JSON.stringify(
        {
          id,
          mesh,
          name: entity.name(),
          stats,
          direction,
        },
        undefined,
        2
      ),
  };
};
