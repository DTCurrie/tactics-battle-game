import { Board, Direction } from "@tactics-battle-game/core";
import { Actor } from "./actor";
import { action, atom } from "nanostores";
import { Vector2Tuple } from "three";
import { TURN_COUNTER } from "@units/stats";

const activationCost = 100;
const turnCost = 50;
const moveCost = 30;
const actionCost = 20;

export type Turn = {
  actor: () => Actor;
  setActor: (next: Actor) => Actor;

  moved: () => boolean;
  addMovedListener: (listener: (value: boolean) => void) => void;
  setMoved: (next: boolean) => boolean;

  acted: () => boolean;
  setActed: (next: boolean) => boolean;

  moveLocked: () => boolean;
  setMoveLocked: (next: boolean) => boolean;

  undoMove: () => void;
};

export const createTurn = (board: Board, first: Actor): Turn => {
  const actor = atom<Actor>(first);

  const startPosition = atom<Vector2Tuple>([
    first.position().x,
    first.position().z,
  ]);

  const startDirection = atom<Direction>(first.direction());

  const moved = atom(false);
  const acted = atom(false);
  const moveLocked = atom(false);

  const setActor = action(actor, "setActor", (store, next: Actor) => {
    moved.set(false);
    acted.set(false);
    moveLocked.set(false);
    startPosition.set([next.position().x, next.position().z]);
    startDirection.set(next.direction());
    store.set(next);
    return next;
  });

  const undoMove = action(moved, "undoMove", (store) => {
    const current = board.getTile(actor.get().coordinates());
    const start = board.getTile(startPosition.get());

    actor.get().setPosition(start.top());
    actor.get().setDirection(startDirection.get());
    current.setOccupied(false);
    start.setOccupied(true);
    store.set(false);
  });

  return {
    actor: () => actor.get(),
    setActor,

    moved: () => moved.get(),

    addMovedListener: (listener: (value: boolean) => void) =>
      moved.listen(listener),

    setMoved: action(moved, "setMoved", (store, next: boolean) => {
      store.set(next);
      return next;
    }),

    acted: () => acted.get(),
    setActed: action(acted, "setActed", (store, next: boolean) => {
      store.set(next);
      return next;
    }),

    moveLocked: () => moveLocked.get(),
    setMoveLocked: action(
      moveLocked,
      "setMoveLocked",
      (store, next: boolean) => {
        store.set(next);
        return next;
      }
    ),

    undoMove,
  };
};

export type TurnOrder = {
  round: (actors: Actor[], data: Turn) => Generator<Actor, void, unknown>;
};

export const createTurnOrder = () => {
  const canTakeTurn = ({ getStat }: Actor) => {
    return getStat(TURN_COUNTER) >= activationCost;
  };

  function* round(actors: Actor[], data: Turn) {
    for (;;) {
      for (const { incrementCtr } of actors) {
        incrementCtr();
      }

      const sortedUnits = [
        ...actors.sort((a, b) =>
          a.getStat(TURN_COUNTER) >= b.getStat(TURN_COUNTER) ? 1 : -1
        ),
      ];

      for (const unit of sortedUnits) {
        if (canTakeTurn(unit)) {
          data.setActor(unit);
          yield unit;

          let cost = 0 + turnCost;

          if (data.moved()) {
            cost += moveCost;
          }

          if (data.acted()) {
            cost += actionCost;
          }

          unit.reduceCtr(cost);
        }
      }
    }
  }

  return {
    round,
  };
};
