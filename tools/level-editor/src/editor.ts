import {
  BoxGeometry,
  Color,
  Mesh,
  MeshBasicMaterial,
  Vector2Tuple,
  Vector3Tuple,
} from "three";
import {
  LevelData,
  Tile,
  createTile,
  SETTINGS,
} from "@tactics-battle-game/api";
import { three } from "@tactics-battle-game/three-utils";

type Rect = {
  x: number;
  y: number;
  width: number;
  depth: number;
};

const { scene, camera } = three();

export type LevelEditor = {
  levelData: Pick<LevelData, "name" | "tileData">;
  grid: (Tile | undefined)[][];
  currentCoordinates: Vector2Tuple;
  adjustCurrent: (height: number) => void;
  adjustRect: (rect: Rect, height: number) => void;
  adjustRandom: (height: number) => void;
  clearGrid: () => void;
  updateSelector: ([x, y]: Vector2Tuple) => void;
  getTileData: () => Vector3Tuple[];
};

const createLevelEditor = (): LevelEditor => {
  const levelData: Pick<LevelData, "name" | "tileData"> = {
    name: "",
    tileData: [],
  };

  const grid: (Tile | undefined)[][] = Array.from(
    { length: SETTINGS.board.width },
    () => Array.from({ length: SETTINGS.board.depth })
  );

  let currentCoordinates: Vector2Tuple = [0, 0];

  const selector = new Mesh(
    new BoxGeometry(1, 0.1, 1),
    new MeshBasicMaterial({ color: "yellow", opacity: 0.5, transparent: true })
  );

  const getOrCreateTile = ([x, y]: Vector2Tuple): Tile => {
    if (grid[x][y]) {
      return grid[x][y] as Tile;
    }

    const tile = createTile({});
    tile.place([x, y]);
    scene.add(tile.mesh);
    grid[x] ??= [];
    grid[x][y] = tile;
    return tile;
  };

  const randomRect = (): Rect => {
    const x = Math.floor(Math.random() * SETTINGS.board.width);
    const y = Math.floor(Math.random() * SETTINGS.board.depth);

    const width = Math.floor(
      Math.floor(Math.random() * (SETTINGS.board.width - x)) + 1
    );

    const depth = Math.floor(
      Math.floor(Math.random() * (SETTINGS.board.depth - y)) + 1
    );

    return { x, y, width, depth };
  };

  const adjustSingle = ([x, y]: Vector2Tuple, height: number) => {
    if (height > 0) {
      const tile = getOrCreateTile([x, y]);
      if (tile.height() < SETTINGS.board.height) {
        if (tile.height() > SETTINGS.board.height) {
          tile.setHeight(SETTINGS.board.height - tile.height());
          return;
        }

        tile.setHeight(height);
        grid[x][y] = tile;
      }

      return;
    }

    if (!grid[x][y]) {
      return;
    }

    const tile = grid[x][y] as Tile;
    tile.setHeight(height);

    if (tile.height() <= 0) {
      grid[x][y] = undefined;
      scene.remove(tile.mesh);
      return;
    }

    grid[x][y] = tile;
  };

  const adjustCurrent = (height: number) =>
    adjustSingle(currentCoordinates, height);

  const adjustRect = (rect: Rect, height: number) => {
    const { x, y, width, depth } = rect;

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < depth; j++) {
        adjustSingle([x + i, y + j], height);
      }
    }
  };

  const adjustRandom = (height: number) => adjustRect(randomRect(), height);

  const clearGrid = () => {
    for (const cols of grid) {
      for (const tile of cols) {
        if (tile) {
          scene.remove(tile.mesh);
          grid[tile.mesh.position.x][tile.mesh.position.z] = undefined;
        }
      }
    }
  };

  const updateSelector = ([x, y]: Vector2Tuple) => {
    currentCoordinates = [x, y];
    const tile = grid[x][y];
    tile
      ? selector.position.set(...tile.top())
      : selector.position.set(currentCoordinates[0], 0, currentCoordinates[1]);
  };

  const getTileData = (): Vector3Tuple[] => {
    const tiles: Vector3Tuple[] = [];

    for (const col of grid) {
      for (const tile of col) {
        if (tile) {
          tiles.push([
            tile.mesh.position.x,
            tile.height(),
            tile.mesh.position.z,
          ]);
        }
      }
    }

    return tiles;
  };

  scene.background = new Color(0xffffff);
  scene.add(selector);

  camera.position.y = SETTINGS.board.width / 2;
  camera.position.y = 10;
  camera.position.z = 10;

  return {
    levelData,
    grid,
    currentCoordinates,
    adjustCurrent,
    adjustRect,
    adjustRandom,
    clearGrid,
    updateSelector,
    getTileData,
  };
};

let instance: LevelEditor | null = null;
export const levelEditor = () => {
  if (instance !== null) {
    return instance;
  }

  instance = createLevelEditor();
  return instance;
};
