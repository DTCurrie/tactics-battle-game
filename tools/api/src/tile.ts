import {
  BoxGeometry,
  ColorRepresentation,
  Mesh,
  MeshToonMaterial,
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

export type TileData = {
  mesh: Mesh;
  color: ColorRepresentation;
  selectedColor: ColorRepresentation;

  content?: Mesh;

  pathfinding: TilePathfinding;
};

export type TileOptions = Partial<
  Pick<TileData, "color" | "selectedColor" | "content">
>;

export interface Tile extends TileData {
  height: () => number;
  top: () => Vector3Tuple;
  setHeight: (height: number) => void;
  place: (position: Vector2Tuple) => void;
  select: (selecting: boolean) => void;
  resetPathfinding: () => void;
}

export const createTile = ({
  color = "forestgreen",
  selectedColor = "green",
  content,
}: TileOptions): Tile => {
  const mesh = tileMesh(color);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  const pathfinding: TilePathfinding = {
    cost: 0,
  };

  const height = () => mesh.geometry.parameters.height;

  const top = (): Vector3Tuple => [
    mesh.position.x,
    mesh.position.y + height(),
    mesh.position.z,
  ];

  const setHeight = (next: number) => {
    const geometry = tileGeometry(next);
    mesh.geometry.dispose();
    mesh.geometry = geometry;
    mesh.position.y = height() / 2;
  };

  const place = ([x, y]: Vector2Tuple) => {
    mesh.position.set(x, height(), y);
  };

  const select = (selecting: boolean) =>
    mesh.material.color.set(selecting ? selectedColor : color);

  const resetPathfinding = () => {
    delete pathfinding.previous;
    pathfinding.cost = 0;
  };

  if (content) {
    content.position.set(...top());
    mesh.add(content);
  }

  return {
    mesh,
    color,
    selectedColor,
    content,
    pathfinding,
    height,
    top,
    setHeight,
    place,
    select,
    resetPathfinding,
  };
};
