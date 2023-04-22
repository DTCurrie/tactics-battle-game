import { Vector2Tuple } from "three";
import { Board, Tile } from "@tactics-battle-game/core";
import { State, StateMachine, createStateMachine } from "@lib/state-machine";
import { Turn } from "./turn-order";
import { Actor } from "./actor";
import { Factions } from "./faction";

export type BattleUi = {
  dispose: () => void;
};

export type BattleContext = Readonly<{
  board: Board;
  currentCoordinates: Vector2Tuple;
  factions: Factions;
  targets: Tile[];
  ui: BattleUi;
  turn: Turn & {
    round: Generator<Actor>;
  };
}> & {
  getActorAtPosition: (position: Vector2Tuple) => Actor | undefined;
};

export type BattleState = State<BattleContext>;

let instance: StateMachine<BattleContext> | null = null;
export const battleStateMachine = () => {
  if (instance !== null) {
    return instance;
  }

  instance = createStateMachine<BattleContext>();
  return instance;
};
