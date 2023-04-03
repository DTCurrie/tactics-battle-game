import { Vector2Tuple } from "three";
import { Board } from "@tactics-battle-game/api";
import { State, StateMachine, createStateMachine } from "../lib/state-machine";
import { Unit } from "@tactics-battle-game/api/src/unit";
import { TurnData, TurnOrder } from "./turn-order";

export type BattleContext = {
  board: Board;
  currentCoordinates: Vector2Tuple;
  units: Unit[];
  turn: {
    data: TurnData;
    order: TurnOrder;
    round?: Generator<Unit>;
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
