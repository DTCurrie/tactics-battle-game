import {
  BoxGeometry,
  ColorRepresentation,
  Mesh,
  MeshToonMaterial,
  Vector2Tuple,
  Vector3,
} from "three";
import { SETTINGS } from "./settings";
import { Entity } from "./entity";

export const tileGeometry = (height: number) =>
  new BoxGeometry(1, SETTINGS.stepHeight * height, 1);

export const tileMesh = (color: ColorRepresentation) =>
  new Mesh(tileGeometry(1), new MeshToonMaterial({ color }));

export type TileData = Readonly<{
  mesh: Mesh;
  color: ColorRepresentation;
  selectedColor: ColorRepresentation;
}>;

export type TileOptions = Partial<Omit<TileData, "mesh">>;

export interface Tile extends TileData {
  calculatedHeight: () => number;
  height: () => number;
  top: () => Vector3;
  setHeight: (height: number) => void;
  position: () => Vector2Tuple;
  setPosition: (position: Vector2Tuple) => void;
  selected: () => boolean;
  setSelected: (selecting: boolean) => void;
  content: () => Entity | undefined;
  setContent: (content?: Entity | undefined) => void;
}

export const createTile = ({
  color = "forestgreen",
  selectedColor = "limegreen",
}: TileOptions): Tile => {
  const mesh = tileMesh(color);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  let position: Vector2Tuple = [0, 0];
  let baseHeight = 0;
  let content: Entity | undefined;
  let selected = false;

  const height = () => baseHeight;
  const calculatedHeight = () => mesh.geometry.parameters.height;

  const top = (): Vector3 =>
    new Vector3(position[0], calculatedHeight(), position[1]);

  const setHeight = (next: number) => {
    const geometry = tileGeometry(next);
    mesh.geometry.dispose();
    mesh.geometry = geometry;
    setPosition(position);
    baseHeight = next;
  };

  const setPosition = ([x, y]: Vector2Tuple) => {
    mesh.position.set(x, calculatedHeight() / 2, y);
    position = [x, y];
  };

  const setSelected = (selecting: boolean) => {
    selected = selecting;
    mesh.material.color.set(selecting ? selectedColor : color);
  };

  const setContent = (next?: Entity) => {
    if (next) {
      content = next;
      return;
    }

    content = undefined;
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

    selected: () => selected,
    setSelected,

    content: () => content,
    setContent,
  };
};
