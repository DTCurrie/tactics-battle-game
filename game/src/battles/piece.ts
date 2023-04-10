import {
  Entity,
  EntityOptions,
  Tile,
  createEntity,
} from "@tactics-battle-game/api";
import { ReadableAtom, action, atom } from "nanostores";

export type Piece = Readonly<{ tile: ReadableAtom<Tile> }> &
  Entity & {
    setTile: (next: Tile) => void;
  };

export type PieceOptions = EntityOptions & {
  tile: Tile;
};

export const createPiece = ({
  mesh,
  tile: initialTile,
}: PieceOptions): Piece => {
  const entity = createEntity({ mesh });
  const tile = atom<Tile>(initialTile);

  const setTile = action(tile, "setTile", (store, next: Tile) => {
    if (next.content()) {
      return;
    }

    next.setContent(entity);
    store.set(next);
  });

  return {
    ...entity,
    tile,
    setTile,
    debug: () =>
      JSON.stringify(
        {
          entity: entity.debug(),
        },
        undefined,
        2
      ),
  };
};
