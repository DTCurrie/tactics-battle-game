import { Direction, Tile } from "@tactics-battle-game/api";
import { Actor } from "./actor";
import { ReadableAtom, WritableAtom, action, atom } from "nanostores";

const activationCost = 100;
const turnCost = 50;
const moveCost = 30;
const actionCost = 20;

export type Turn = Readonly<{
  actor: ReadableAtom<Actor>;
  moved: WritableAtom<boolean>;
  acted: WritableAtom<boolean>;
  moveLocked: WritableAtom<boolean>;
  ability: WritableAtom<unknown>;
  targets: WritableAtom<Tile[]>;
}> & {
  setActor: (next: Actor) => void;
  undoMove: () => void;
};

export const createTurn = (first: Actor): Turn => {
  const actor = atom<Actor>(first);

  const startTile = atom<Tile>(first.tile.get());
  const startDirection = atom<Direction>(first.direction.get());

  const moved = atom(false);
  const acted = atom(false);
  const moveLocked = atom(false);

  const ability = atom<unknown | undefined>(undefined);
  const targets = atom<Tile[]>([]);

  const setActor = action(actor, "setActor", (store, next: Actor) => {
    moved.set(false);
    acted.set(false);
    moveLocked.set(false);
    startTile.set(next.tile.get());
    startDirection.set(next.direction.get());
    store.set(next);
  });

  const undoMove = action(moved, "undoMove", (store) => {
    actor.get().setPosition(startTile.get().top());
    actor.get().direction.set(startDirection.get());
    actor.get().tile.get().setContent(undefined);
    actor.get().setTile(startTile.get());
    startTile.get().setContent(actor.get());
    store.set(false);
  });

  return {
    actor,
    moved,
    acted,
    moveLocked,
    ability,
    targets,

    setActor,
    undoMove,
  };
};

export type TurnOrder = {
  round: (actors: Actor[], data: Turn) => Generator<Actor, void, unknown>;
};

export const createTurnOrder = () => {
  const canTakeTurn = ({ getStat }: Actor) => {
    return getStat("ctr") >= activationCost;
  };

  function* round(actors: Actor[], data: Turn) {
    for (;;) {
      for (const { incrementCtr } of actors) {
        incrementCtr();
      }

      const sortedUnits = [
        ...actors.sort((a, b) =>
          a.getStat("ctr") >= b.getStat("ctr") ? 1 : -1
        ),
      ];

      for (const unit of sortedUnits) {
        if (canTakeTurn(unit)) {
          data.setActor(unit);
          yield unit;

          let cost = 0 + turnCost;

          if (data.moved) {
            cost += moveCost;
          }

          if (data.acted) {
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
