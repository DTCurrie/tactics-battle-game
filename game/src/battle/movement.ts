import { getHeading } from "@tactics-battle-game/api";
import { Vector3 } from "three";
import { PathfinderData, simpleSearch } from "./pathfinder";
import { Unit } from "./unit";
import { logger } from "../lib/logger";
import { Easing, Tween } from "@tweenjs/tween.js";

export interface Movement {
  expandSearch: (from: PathfinderData, to: PathfinderData) => boolean;
  move: (target: PathfinderData) => Tween<Vector3>[];
}

export const createWalkMovement = (unit: Unit): Movement => {
  const { logError } = logger(`${unit.address()} Movement`);

  const expandSearch = (from: PathfinderData, to: PathfinderData) => {
    if (!to.tile || !from.tile) {
      return false;
    }

    if (to.tile.content()) {
      return false;
    }

    if (Math.abs(from.tile.height() - to.tile.height()) > unit.stats().jump) {
      return false;
    }

    return simpleSearch(unit.stats().move, from.cost);
  };

  const onUpdate = (to: Vector3) => unit.setPosition(to);

  const walk = (to: PathfinderData): Tween<Vector3> => {
    if (!to.tile) {
      return new Tween(unit.position()).to(unit.position(), 500);
    }

    const target = to.tile.top();

    return new Tween(unit.position())
      .to(target, 500)
      .onUpdate(onUpdate)
      .start();
  };

  const jumpHorizontal = (target: Vector3) =>
    new Tween(unit.position())
      .to(
        {
          x: target.x,
          z: target.z,
        },
        500
      )
      .onUpdate(({ x, z }) => onUpdate(new Vector3(x, unit.position().y, z)))
      .start();

  const jumpVertical = (target: Vector3, jumping: boolean) => {
    const up = new Tween(unit.position())
      .to(
        {
          y: (jumping ? target : unit.position()).y + 0.5,
        },
        250
      )
      .easing(Easing.Cubic.Out)
      .onUpdate(({ y }) =>
        unit.setPosition(new Vector3(unit.position().x, y, unit.position().z))
      )
      .start();

    const down = new Tween(unit.position())
      .to({ y: target.y }, 250)
      .easing(Easing.Cubic.Out)
      .onUpdate(({ y }) =>
        onUpdate(new Vector3(unit.position().x, y, unit.position().z))
      );

    up.onComplete(() => down.start());

    return [up, down];
  };

  const jump = (to: PathfinderData) => {
    if (!to.tile) {
      return [];
    }

    const target = to.tile.top();
    const jumping = unit.position().y <= target.y;
    const direction = new Vector3().subVectors(target, unit.position());
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
      unit: unit.debug(),
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

    const direction = getHeading(from.coordinates, to.coordinates);
    if (unit.direction() !== direction) {
      unit.setDirection(direction);
    }

    const tweens = walkOrJump(from, to);
    return tweens;
  }

  return {
    expandSearch,
    move,
  };
};
