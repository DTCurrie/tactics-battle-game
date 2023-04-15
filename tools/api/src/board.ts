import {
  Group,
  Mesh,
  BoxGeometry,
  MeshBasicMaterial,
  Vector2Tuple,
  Vector3,
} from "three";
import { settings } from "./settings";
import { Level } from "./level-api";
import { Tile, createTile } from "./tile";

export type Board = Readonly<{
  group: Group;
  selector: Mesh<BoxGeometry, MeshBasicMaterial>;
  grid: Tile[][];
  level: Level;
}> & {
  getTile: (coordinates: Vector2Tuple) => Tile;
  setTile: (coordinates: Vector2Tuple, next: Tile) => Tile;
  moveSelector: ([x, y]: Vector2Tuple) => void;
};

export const createBoard = (level: Level): Board => {
  const group = new Group();

  const selector = new Mesh(
    new BoxGeometry(1, 0.1, 1),
    new MeshBasicMaterial({ color: "yellow", opacity: 0.5, transparent: true })
  );

  const grid: Tile[][] = Array.from({ length: settings.board.width }, () =>
    Array.from({ length: settings.board.depth })
  );

  const getTile = ([x, y]: Vector2Tuple) => grid[x][y];
  const setTile = ([x, y]: Vector2Tuple, tile: Tile) => (grid[x][y] = tile);

  const moveSelector = ([x, y]: Vector2Tuple) => {
    const tile = getTile([x, y]);
    tile
      ? selector.position.copy(tile.top()).add(new Vector3(0, 0.05, 0))
      : selector.position.set(x, 0.05, y);
  };

  group.add(selector);
  selector.position.y = 0.05;
  group.position.set(0, 0, 0);

  for (let x = 0; x < settings.board.width; x++) {
    for (let y = 0; y < settings.board.depth; y++) {
      const gridSquare = new Mesh(
        new BoxGeometry(0.9, settings.stepHeight, 0.9),
        new MeshBasicMaterial({
          color: "gray",
          opacity: 0.25,
          transparent: true,
        })
      );

      gridSquare.position.set(x, -settings.stepHeight / 2, y);
      group.add(gridSquare);
    }
  }

  for (const [x, y, z] of level.tileData) {
    const tile = createTile({});
    tile.setHeight(y);
    grid[x][z] = tile;
    getTile([x, z])?.setPosition([x, z]);
    group.add(tile.mesh);
  }

  return {
    group,
    selector,
    level,
    grid,
    getTile,
    setTile,
    moveSelector,
  };
};
