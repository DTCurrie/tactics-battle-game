import { Board, Tile } from "@tactics-battle-game/core";
import { Actor } from "@battles";
import { Unit } from "@units";

export type ActionArea = {
  getTilesInArea: (board: Board, target: Tile) => Tile[];
};

export type ActionEffect = {
  predict: (target: Tile) => number;
  apply: (target: Tile) => void;
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
  getPathsInRange: (board: Board, actor: Actor) => Tile[];
};

export type ActionTarget = {
  isTarget: (unit: Unit) => boolean;
};

export type ActionHitChance = {
  calculate: (target: Tile) => number;
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
