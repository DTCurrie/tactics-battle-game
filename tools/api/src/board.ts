import {
  Group,
  Mesh,
  BoxGeometry,
  MeshBasicMaterial,
  Vector2Tuple,
  Vector3,
} from "three";
import { SETTINGS } from "./settings";
import { Level } from "./level";
import { Tile, createTile } from "./tile";

export type Board = {
  group: Group;
  selector: Mesh<BoxGeometry, MeshBasicMaterial>;
  level: () => Level;
  setLevel: (data: Level) => void;
  grid: () => (Tile | undefined)[][];
  getTile: (coordinates: Vector2Tuple) => Tile | undefined;
  setTile: (
    coordinates: Vector2Tuple,
    next: Tile | undefined
  ) => Tile | undefined;
  updateSelector: ([x, y]: Vector2Tuple) => void;
};

export const createBoard = (initialLevel: Level): Board => {
  const group = new Group();

  const selector = new Mesh(
    new BoxGeometry(1, 0.1, 1),
    new MeshBasicMaterial({ color: "yellow", opacity: 0.5, transparent: true })
  );

  let level: Level = { ...initialLevel };

  const grid: (Tile | undefined)[][] = Array.from(
    { length: SETTINGS.board.width },
    () => Array.from({ length: SETTINGS.board.depth })
  );

  const setLevel = (data: Level) => {
    level = { ...data };
  };

  const getTile = ([x, y]: Vector2Tuple) => grid[x][y];
  const setTile = ([x, y]: Vector2Tuple, tile: Tile | undefined) =>
    (grid[x][y] = tile);

  const updateSelector = ([x, y]: Vector2Tuple) => {
    const tile = getTile([x, y]);
    tile
      ? selector.position.copy(tile.top()).add(new Vector3(0, 0.05, 0))
      : selector.position.set(x, 0.05, y);
  };

  group.add(selector);
  selector.position.y = 0.05;
  group.position.set(0, 0, 0);

  for (let x = 0; x < SETTINGS.board.width; x++) {
    for (let y = 0; y < SETTINGS.board.depth; y++) {
      const gridSquare = new Mesh(
        new BoxGeometry(0.9, SETTINGS.stepHeight, 0.9),
        new MeshBasicMaterial({
          color: "gray",
          opacity: 0.25,
          transparent: true,
        })
      );

      gridSquare.position.set(x, -SETTINGS.stepHeight / 2, y);
      group.add(gridSquare);
    }
  }

  for (const [x, y, z] of level.tileData) {
    if (y > 0) {
      const tile = createTile({});
      tile.setHeight(y);
      grid[x][z] = tile;
      getTile([x, z])?.setPosition([x, z]);
      group.add(tile.mesh);
    }
  }

  return {
    group,
    selector,
    level: () => level,
    setLevel,
    grid: () => grid,
    getTile,
    setTile,
    updateSelector,
  };
};
