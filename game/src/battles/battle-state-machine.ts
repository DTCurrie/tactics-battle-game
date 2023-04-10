import { Vector2Tuple } from "three";
import { Board } from "@tactics-battle-game/api";
import { State, StateMachine, createStateMachine } from "../lib/state-machine";
import { Turn } from "./turn-order";
import { Actor } from "./actor";

export type BattleContext = {
  board: Board;
  currentCoordinates: Vector2Tuple;
  actors: Actor[];
  turn: Turn & {
    round: Generator<Actor>;
  };
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
