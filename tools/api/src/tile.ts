import {
  BoxGeometry,
  ColorRepresentation,
  Mesh,
  MeshToonMaterial,
  Object3D,
  Vector2Tuple,
  Vector3Tuple,
} from "three";
import { SETTINGS } from "./settings";

export const tileGeometry = (height: number) =>
  new BoxGeometry(1, SETTINGS.stepHeight * height, 1);

export const tileMesh = (color: ColorRepresentation) =>
  new Mesh(tileGeometry(1), new MeshToonMaterial({ color }));

export type TilePathfinding = {
  previous?: Tile;
  cost: number;
};

export type TileData = Readonly<{
  mesh: Mesh;
  color: ColorRepresentation;
  selectedColor: ColorRepresentation;
}>;

export type TileOptions = Partial<Omit<TileData, "mesh">>;

export interface Tile extends TileData {
  calculatedHeight: () => number;
  height: () => number;
  top: () => Vector3Tuple;
  setHeight: (height: number) => void;
  position: () => Vector2Tuple;
  setPosition: (position: Vector2Tuple) => void;
  select: (selecting: boolean) => void;
  content: () => Object3D | undefined;
  setContent: (content?: Object3D | undefined) => void;
  pathfinding: () => TilePathfinding;
  setPathfinding: (pathfinding: TilePathfinding) => void;
  resetPathfinding: () => void;
}

export const createTile = ({
  color = "forestgreen",
  selectedColor = "green",
}: TileOptions): Tile => {
  const mesh = tileMesh(color);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  let position: Vector2Tuple = [0, 0];
  let baseHeight = 0;
  let content: Object3D | undefined;
  let pathfinding: TilePathfinding = {
    cost: 0,
  };

  const height = () => baseHeight;
  const calculatedHeight = () => mesh.geometry.parameters.height;

  const top = (): Vector3Tuple => [
    mesh.position.x,
    calculatedHeight(),
    mesh.position.z,
  ];

  const setHeight = (next: number) => {
    const geometry = tileGeometry(next);
    mesh.geometry.dispose();
    mesh.geometry = geometry;
    mesh.position.y = (mesh.parent?.position.y ?? 0) + calculatedHeight() / 2;
    baseHeight = next;
  };

  const setPosition = ([x, y]: Vector2Tuple) => {
    mesh.position.set(
      x,
      (mesh.parent?.position.y ?? 0) + calculatedHeight() / 2,
      y
    );
    position = [x, y];
  };

  const select = (selecting: boolean) =>
    mesh.material.color.set(selecting ? selectedColor : color);

  const setContent = (next?: Object3D) => {
    if (next) {
      next.position.set(...top());
      mesh.add(next);
      content = next;
      return;
    }

    if (content) {
      mesh.remove(content);
    }

    content = undefined;
  };

  const setPathfinding = (next: TilePathfinding) => (pathfinding = { ...next });
  const resetPathfinding = () => {
    delete pathfinding.previous;
    pathfinding.cost = 0;
  };

  return {
    mesh,
    color,
    selectedColor,
    height,
    calculatedHeight,
    top,
    setHeight,
    position: () => position,
    setPosition,
    select,
    content: () => content,
    setContent,
    pathfinding: () => pathfinding,
    setPathfinding,
    resetPathfinding,
  };
};
