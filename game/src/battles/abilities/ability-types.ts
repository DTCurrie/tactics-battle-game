import { Board } from "@tactics-battle-game/api";
import { Unit } from "../../units/unit";
import { PathfinderData } from "../pathfinder";

export type AbilityArea = {
  getTilesInArea: (board: Board, target: PathfinderData) => PathfinderData[];
};

export type AbilityEffect = {
  predict: (target: PathfinderData) => number;
  apply: (target: PathfinderData) => void;
};

export type AbilityPower = {
  getBaseAttack: () => number;
  getBaseDefense: (target: Unit) => number;
  getPower: () => number;
};

export type AbilityRange = Readonly<{
  directionOriented?: boolean;
}> & {
  getTilesInRange: (board: Board) => PathfinderData[];
};

export type AbilityTarget = {
  isTarget: (tile: PathfinderData) => boolean;
};

export type AbilityHitChance = {
  calculate: (target: PathfinderData) => number;
};
