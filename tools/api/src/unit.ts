import { nanoid } from "nanoid";

import { Direction, toEuler } from "./direction";
import { Mesh } from "three";
import { Stats } from "./stats";
import { Tile } from "./tile";

export type UnitData = Readonly<{
  id: string;
  mesh: Mesh;
}>;

export type Unit = UnitData & {
  address: () => string;

  name: () => string;
  setName: (next: string) => void;

  stats: () => Stats;
  setStats: (next: Partial<Stats>) => void;

  tile: () => Tile;
  setTile: (next: Tile) => void;

  direction: () => Direction;
  setDirection: (towards: Direction) => void;
};

export type UnitOptions = {
  mesh: Mesh;
  name: string;
  id?: string;
  stats?: Omit<Stats, "ctr">;
};

export const createUnit = ({
  name: initialName,
  mesh,
  id = nanoid(),
  stats: initialStats,
}: UnitOptions): Unit => {
  let name = `${initialName}`;
  let stats = { ...(initialStats ?? { spd: 0 }), ctr: 0 };
  let tile: Tile;
  let direction: Direction;

  const setName = (next: string) => (name = next);

  const setStats = (next: Partial<Stats>) => {
    stats = { ...stats, ...next };
  };

  const setTile = (next: Tile) => {
    if (next.content()) {
      return;
    }

    tile?.setContent();
    next.setContent(mesh);
    tile = next;
  };

  const setDirection = (towards: Direction) => {
    mesh.rotation.set(...toEuler(towards));
    direction = towards;
  };

  return {
    id,
    mesh,

    address: () => `${name} [${id}]`,

    name: () => name,
    setName,

    stats: () => stats,
    setStats,

    tile: () => tile,
    setTile,

    setDirection,
    direction: () => direction,
  };
};
