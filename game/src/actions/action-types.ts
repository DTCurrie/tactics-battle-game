import { Board } from "@tactics-battle-game/core";
import { Actor, PathfinderData } from "@battles";
import { Unit } from "@units";

export type ActionArea = {
  getTilesInArea: (board: Board, target: PathfinderData) => PathfinderData[];
};

export type ActionEffect = {
  predict: (target: PathfinderData) => number;
  apply: (target: PathfinderData) => void;
};

export type ActionPower = {
  getBaseAttack: (unit: Unit) => number;
  getBaseDefense: (target: Unit) => number;
  getPower: (unit: Unit) => number;
};

export type ActionRange = Readonly<{
  directionOriented?: boolean;
  heightDeltaLimit?: number;
}> & {
  getPathsInRange: (board: Board, actor: Actor) => PathfinderData[];
};

export type ActionTarget = {
  isTarget: (unit: Unit) => boolean;
};

export type ActionHitChance = {
  calculate: (target: PathfinderData) => number;
};

export type Action = Readonly<
  Partial<{
    area: ActionArea;
    effect: ActionEffect;
    power: ActionPower;
    range: ActionRange;
    target: ActionTarget;
    hitChance: ActionHitChance;
  }>
>;
