import { Color, Group, Vector2Tuple, Vector3Tuple } from "three";
import {
  Tile,
  createBoard,
  createTile,
  settings,
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
  board: Group;
  adjustCurrent: (height: number) => void;
  adjustRect: (rect: Rect, height: number) => void;
  adjustRandom: (height: number) => void;
  setSelector: ([x, y]: Vector2Tuple) => void;
  getTileData: () => Vector3Tuple[];
};

const createLevelEditor = (): LevelEditor => {
  const {
    group,
    grid,
    getTile,
    setTile,
    moveSelector: updateSelector,
  } = createBoard({
    id: "",
    name: "",
    tileData: [],
  });

  let currentCoordinates: Vector2Tuple = [0, 0];

  const getOrCreateTile = ([x, y]: Vector2Tuple): Tile => {
    if (getTile([x, y])) {
      return getTile([x, y]) as Tile;
    }

    const tile = createTile({});
    tile.setPosition([x, y]);
    group.add(tile.mesh);
    setTile([x, y], tile);
    return tile;
  };

  const randomRect = (): Rect => {
    const x = Math.floor(Math.random() * settings.board.width);
    const y = Math.floor(Math.random() * settings.board.depth);

    const width = Math.floor(
      Math.floor(Math.random() * (settings.board.width - x)) + 1
    );

    const depth = Math.floor(
      Math.floor(Math.random() * (settings.board.depth - y)) + 1
    );

    return { x, y, width, depth };
  };

  const adjustSingle = ([x, y]: Vector2Tuple, height: number) => {
    if (height > 0) {
      const tile = getOrCreateTile([x, y]);
      if (tile.height() < settings.board.height) {
        if (tile.height() > settings.board.height) {
          tile.setHeight(settings.board.height - tile.height());
          return;
        }

        tile.setHeight(height);
        setTile([x, y], tile);
      }

      return;
    }

    if (!getTile([x, y])) {
      return;
    }

    const tile = getTile([x, y]) as Tile;
    tile.setHeight(height);

    setTile([x, y], tile);
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

  const setSelector = ([x, y]: Vector2Tuple) => {
    currentCoordinates = [x, y];
    updateSelector([x, y]);
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
  scene.add(group);

  camera().position.y = settings.board.width / 2;
  camera().position.y = 10;
  camera().position.z = 10;
  camera().lookAt(group.position);

  return {
    board: group,
    adjustCurrent,
    adjustRect,
    adjustRandom,
    setSelector,
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
