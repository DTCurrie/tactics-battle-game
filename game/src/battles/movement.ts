import { getHeading } from "@tactics-battle-game/core";
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

  if (to.tile.occupied()) {
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
  address,
  setPosition,
  setDirection,
  debug,
}: Actor): Movement => {
  const { logError } = logger(`${address} Movement`);

  const updatePosition = (to: Vector3) => setPosition(to);

  const walk = (to: PathfinderData): Tween<Vector3> => {
    if (!to.tile) {
      return new Tween(position()).to(position(), 500);
    }

    const target = to.tile.top();
    return new Tween(position())
      .to(target, 500)
      .onUpdate((next) => {
        updatePosition(next);
      })
      .start();
  };

  const jumpHorizontal = (target: Vector3) =>
    new Tween(position())
      .to(
        {
          x: target.x,
          z: target.z,
        },
        500
      )
      .onUpdate(({ x, z }) => {
        updatePosition(new Vector3(x, position().y, z));
      })
      .start();

  const jumpVertical = (target: Vector3, jumping: boolean) => {
    const up = new Tween(position())
      .to(
        {
          y: (jumping ? target : position()).y + 0.25,
        },
        250
      )
      .easing(Easing.Cubic.In)
      .onUpdate(({ y }) => {
        setPosition(new Vector3(position().x, y, position().z));
      })
      .start();

    const down = new Tween(position())
      .to({ y: target.y }, 250)
      .easing(Easing.Cubic.Out)
      .onUpdate(({ y }) => {
        updatePosition(new Vector3(position().x, y, position().z));
      });

    up.onComplete(() => down.start());

    return [up, down];
  };

  const jump = (to: PathfinderData) => {
    if (!to.tile) {
      return [];
    }

    const target = to.tile.top();
    const jumping = position().y <= target.y;
    const direction = new Vector3().subVectors(target, position());
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
    setDirection(heading);

    const tweens = walkOrJump(from, to);
    return tweens;
  }

  return {
    move,
  };
};
