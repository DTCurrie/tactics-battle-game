import { Box3, Mesh, Quaternion, Vector3 } from "three";
import { Direction, toEuler } from "./direction";
import { ReadableAtom, action, atom, computed } from "nanostores";

export type Entity = Readonly<{
  mesh: ReadableAtom<Mesh>;
  position: ReadableAtom<Vector3>;
  rotation: ReadableAtom<Quaternion>;
  direction: ReadableAtom<Direction>;
  height: ReadableAtom<number>;
}> & {
  setPosition: (position: Vector3) => Vector3;
  setRotation: (towards: Quaternion) => Quaternion;
  setDirection: (to: Direction) => Direction;
  debug: () => string;
};

export type EntityOptions = {
  mesh: Mesh;
};

export const createEntity = ({ mesh: meshProp }: EntityOptions): Entity => {
  const mesh = atom<Mesh>(meshProp);
  const position = atom<Vector3>(mesh.get().position);
  const rotation = atom<Quaternion>(mesh.get().quaternion);
  const direction = atom<Direction>(Direction.North);

  const box = computed(mesh, (next: Mesh) => new Box3().setFromObject(next));
  const height = computed(box, (next: Box3) => next.max.y - next.min.y);

  const setPosition = action(position, "setPosition", (store, next) => {
    const { x, y, z } = next;
    mesh.get().position.set(x, y + height.get() / 2, z);
    store.set(new Vector3(x, y, z));
    return next;
  });

  const setRotation = action(
    rotation,
    "setRotation",
    (store, next: Quaternion) => {
      mesh.get().quaternion.copy(next);
      store.set(next);
      return next;
    }
  );

  const setDirection = action(
    direction,
    "setDirection",
    (store, next: Direction) => {
      setRotation(new Quaternion().setFromEuler(toEuler(next)));
      store.set(next);
      return next;
    }
  );

  return {
    mesh,
    position,
    rotation,
    direction,
    height,

    setPosition,
    setRotation,
    setDirection,

    debug: () =>
      JSON.stringify(
        {
          mesh,
          position: position.get(),
          rotation: rotation.get(),
          direction: direction.get(),
        },
        undefined,
        2
      ),
  };
};
