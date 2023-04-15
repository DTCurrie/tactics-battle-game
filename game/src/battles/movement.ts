import { getHeading } from "@tactics-battle-game/api";
import { Vector3 } from "three";
import { PathfinderData, simpleSearch } from "./pathfinder";
import { logger } from "../lib/logger";
import { Easing, Tween } from "@tweenjs/tween.js";
import { Actor } from "./actor";

export interface Movement {
  move: (target: PathfinderData) => Tween<Vector3>[];
}

export const expandWalkSearch = (
  from: PathfinderData,
  to: PathfinderData,
  jump: number,
  move: number
) => {
  if (!to.tile || !from.tile) {
    return false;
  }

  if (to.tile.content() !== undefined) {
    return false;
  }

  const fromHeight = from.tile.height();
  const toHeight = to.tile.height();
  const heightAbs = Math.abs(fromHeight - toHeight);
  if (heightAbs > jump) {
    return false;
  }

  return simpleSearch(move, from.cost);
};

export const createWalkMovement = ({
  position,
  direction,
  address,
  setPosition,
  debug,
}: Actor): Movement => {
  const { logError } = logger(`${address} Movement`);

  const onUpdate = (to: Vector3) => setPosition(to);

  const walk = (to: PathfinderData): Tween<Vector3> => {
    if (!to.tile) {
      return new Tween(position.get()).to(position.get(), 500);
    }

    const target = to.tile.top();
    return new Tween(position.get()).to(target, 500).onUpdate(onUpdate).start();
  };

  const jumpHorizontal = (target: Vector3) =>
    new Tween(position.get())
      .to(
        {
          x: target.x,
          z: target.z,
        },
        500
      )
      .onUpdate(({ x, z }) => onUpdate(new Vector3(x, position.get().y, z)))
      .start();

  const jumpVertical = (target: Vector3, jumping: boolean) => {
    const up = new Tween(position.get())
      .to(
        {
          y: (jumping ? target : position.get()).y + 0.5,
        },
        250
      )
      .easing(Easing.Cubic.Out)
      .onUpdate(({ y }) =>
        setPosition(new Vector3(position.get().x, y, position.get().z))
      )
      .start();

    const down = new Tween(position.get())
      .to({ y: target.y }, 250)
      .easing(Easing.Cubic.Out)
      .onUpdate(({ y }) =>
        onUpdate(new Vector3(position.get().x, y, position.get().z))
      );

    up.onComplete(() => down.start());

    return [up, down];
  };

  const jump = (to: PathfinderData) => {
    if (!to.tile) {
      return [];
    }

    const target = to.tile.top();
    const jumping = position.get().y <= target.y;
    const direction = new Vector3().subVectors(target, position.get());
    direction.normalize();

    const horizontal = jumpHorizontal(target);
    const [up, down] = jumpVertical(target, jumping);

    return [horizontal, up, down];
  };

  const walkOrJump = (from: PathfinderData, to: PathfinderData) =>
    from.tile?.height() === to.tile?.height() ? [walk(to)] : jump(to);

  function move(target: PathfinderData): Tween<Vector3>[] {
    const from = target.previous;
    const to = target;

    const logData = {
      actor: debug(),
      target,
      from,
      to,
    };

    if (!to.tile || !from || !from.tile) {
      logError("Undefined tile in pathfinding targets", logData);
      throw new Error("Undefined tile in pathfinding targets", {
        cause: logData,
      });
    }

    const heading = getHeading(from.coordinates, to.coordinates);
    if (heading !== direction.get()) {
      direction.set(heading);
    }

    const tweens = walkOrJump(from, to);
    return tweens;
  }

  return {
    move,
  };
};
