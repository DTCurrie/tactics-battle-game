import {
  BoxGeometry,
  ColorRepresentation,
  Mesh,
  MeshToonMaterial,
  Vector2Tuple,
  Vector3,
} from "three";
import { settings } from "../settings";

export type TileMesh = Mesh<BoxGeometry, MeshToonMaterial>;

export type MarkerColor = "selected" | "move" | "attack" | "support";
export const markerColors: Record<MarkerColor, ColorRepresentation> = {
  selected: "ghostwhite",
  move: "dodgerblue",
  attack: "tomato",
  support: "limegreen",
};

export const createTileGeometry = (height: number) =>
  new BoxGeometry(1, settings.stepHeight * height, 1);

export const createTileMaterial = (color: ColorRepresentation) =>
  new MeshToonMaterial({ color });

export const createTileMesh = (
  height: number,
  color: ColorRepresentation
): TileMesh => new Mesh(createTileGeometry(height), createTileMaterial(color));

export type Tile = Readonly<{
  mesh: TileMesh;
}> & {
  position: () => Vector2Tuple;
  height: () => number;
  marked: () => boolean;
  occupied: () => boolean;
  top: () => Vector3;

  setPosition: (next: Vector2Tuple) => Vector2Tuple;
  setHeight: (next: number) => number;
  setMarked: (color?: MarkerColor) => boolean;
  setOccupied: (next: boolean) => boolean;
};

export type TileOptions = {
  mesh: Mesh<BoxGeometry, MeshToonMaterial>;
};

export const createTile = ({ mesh }: TileOptions): Tile => {
  let position: Vector2Tuple = [0, 0];
  let height = 0;
  let occupied = false;
  let marked = false;

  const marker = new Mesh(
    new BoxGeometry(0.8, 0.1, 0.8),
    new MeshToonMaterial({
      color: markerColors.selected,
      opacity: 0.75,
      transparent: true,
    })
  );

  const calculatedHeight = () => mesh.geometry.parameters.height;
  const top = () => new Vector3(position[0], calculatedHeight(), position[1]);

  const setPosition = ([x, y]: Vector2Tuple): Vector2Tuple => {
    mesh.position.set(x, calculatedHeight() / 2, y);
    position = [x, y];
    return [x, y];
  };

  const setHeight = (next: number): number => {
    const geometry = createTileGeometry(next);
    mesh.geometry.dispose();
    mesh.geometry = geometry;
    setPosition(position);
    height = next;
    return next;
  };

  const setMarked = (next?: MarkerColor): boolean => {
    if (next) {
      marker.visible = true;
      marker.material.color.set(markerColors[next]);
      marked = true;
      return true;
    }

    marker.visible = false;
    return false;
  };

  const setOccupied = (next: boolean): boolean => {
    occupied = next;
    return next;
  };

  marker.layers.set(settings.layers.ignore);
  marker.visible = false;
  marker.position.set(
    mesh.position.x,
    calculatedHeight() / 2 + 0.05,
    mesh.position.z
  );

  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.layers.set(settings.layers.tile);
  mesh.add(marker);

  return {
    mesh,

    height: () => height,
    position: () => position,
    marked: () => marked,
    occupied: () => occupied,

    top,

    setHeight,
    setPosition,
    setMarked,
    setOccupied,
  };
};
