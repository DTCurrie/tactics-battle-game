import {
  BoxGeometry,
  ColorRepresentation,
  Mesh,
  MeshToonMaterial,
  Vector2Tuple,
  Vector3,
} from "three";
import { settings } from "./settings";
import { Entity } from "./entity";

export const tileGeometry = (height: number) =>
  new BoxGeometry(1, settings.stepHeight * height, 1);

export const tileMesh = (color: ColorRepresentation) =>
  new Mesh(tileGeometry(1), new MeshToonMaterial({ color }));

export type TileData = Readonly<{
  mesh: Mesh<BoxGeometry, MeshToonMaterial>;
  color: ColorRepresentation;
  selectedColor: ColorRepresentation;
  position: () => Vector2Tuple;
  height: () => number;
  selected: () => boolean;
  content: () => Entity | undefined;
  top: () => Vector3;
  calculatedHeight: () => number;
}>;

export type Tile = TileData & {
  setPosition: (next: Vector2Tuple) => Vector2Tuple;
  setHeight: (next: number) => number;
  setSelected: (selecting: boolean) => boolean;
  setContent: (next?: Entity) => Entity | undefined;
};

export type TileOptions = Pick<Partial<TileData>, "color" | "selectedColor"> & {
  mesh?: Mesh<BoxGeometry, MeshToonMaterial>;
};

export const createTile = ({
  mesh: meshProp,
  color = "forestgreen",
  selectedColor = "limegreen",
}: TileOptions): Tile => {
  const mesh = meshProp ?? tileMesh(color);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  let position: Vector2Tuple = [0, 0];
  let height = 0;
  let content: Entity | undefined = undefined;
  let selected = false;

  const calculatedHeight = () => mesh.geometry.parameters.height;
  const top = () => new Vector3(position[0], calculatedHeight(), position[1]);

  const setPosition = ([x, y]: Vector2Tuple): Vector2Tuple => {
    mesh.position.set(x, calculatedHeight() / 2, y);
    position = [x, y];
    return [x, y];
  };

  const setHeight = (next: number): number => {
    const geometry = tileGeometry(next);
    mesh.geometry.dispose();
    mesh.geometry = geometry;
    setPosition(position);
    height = next;
    return next;
  };

  const setSelected = (next: boolean): boolean => {
    mesh.material.color.set(next ? selectedColor : color);
    selected = next;
    return next;
  };

  const setContent = (next?: Entity): Entity | undefined => {
    content = next;
    return next;
  };

  return {
    mesh,
    color,
    selectedColor,

    height: () => height,
    position: () => position,
    selected: () => selected,
    content: () => content,

    top,
    calculatedHeight,

    setHeight,
    setPosition,
    setSelected,
    setContent,
  };
};
