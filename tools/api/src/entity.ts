import { nanoid } from "nanoid";
import { Box3, Mesh, Quaternion, Vector3 } from "three";
import { Direction } from "./direction";

export type EntityData = Readonly<{
  id: string;
  mesh: Mesh;
}>;

export type Entity = EntityData & {
  address: () => string;

  name: () => string;
  setName: (next: string) => void;

  position: () => Vector3;
  setPosition: (position: Vector3) => void;

  rotation: () => Quaternion;
  setRotation: (towards: Quaternion) => void;

  direction: () => Direction;
  setDirection: (towards: Direction) => void;

  height: () => number;

  debug: () => string;
};

export type EntityOptions = {
  id?: string;
  mesh: Mesh;
  name: string;
};

export const createEntity = ({
  name: initialName,
  mesh,
  id = nanoid(),
}: EntityOptions): Entity => {
  const { min, max } = new Box3().setFromObject(mesh);
  const height = max.y - min.y;
  let name = `${initialName}`;
  let position: Vector3 = new Vector3();
  let direction: Direction = Direction.North;

  const setName = (next: string) => (name = next);

  const setPosition = ({ x, y, z }: Vector3) => {
    mesh.position.set(x, y + height / 2, z);
    position = new Vector3(x, y, z);
  };

  const setRotation = (towards: Quaternion) => {
    mesh.quaternion.copy(towards);
  };

  const setDirection = (towards: Direction) => {
    direction = towards;
  };

  return {
    id,
    mesh,

    address: () => `${name} [${id}]`,

    name: () => name,
    setName,

    position: () => position,
    setPosition,

    rotation: () => mesh.quaternion,
    setRotation,

    direction: () => direction,
    setDirection,

    height: () => height,

    debug: () =>
      JSON.stringify(
        {
          id,
          mesh,
          name,
          direction,
        },
        undefined,
        2
      ),
  };
};
