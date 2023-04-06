import { nanoid } from "nanoid";
import { messenger } from "../lib/messenger";
import { Direction, Tile } from "@tactics-battle-game/api";
import { Unit } from "./unit";

const { message } = messenger();

export const beforeRound = "BeforeRound";
export const turnChecked = "TurnChecked";
export const beforeTurn = "BeforeTurn";
export const turnCompleted = "TurnCompleted";
export const roundCompleted = "RoundCompleted";

const activationCost = 1000;
const turnCost = 500;
const moveCost = 300;
const actionCost = 200;

export type TurnData = {
  actor: () => Unit;
  setActor: (next: Unit) => void;

  moved: () => boolean;
  setMoved: (to: boolean) => void;

  acted: () => boolean;
  setActed: (to: boolean) => void;

  moveLocked: () => boolean;
  setMoveLocked: (to: boolean) => void;

  ability: () => unknown;
  setAbility: (next: unknown) => void;

  targets: () => Tile[];
  setTargets: (next: Tile[]) => void;

  undoMove: () => void;
};

export const createTurnData = (): TurnData => {
  let startTile: Tile;
  let startDirection: Direction;

  let actor: Unit;

  let moved = false;
  let acted = false;
  let moveLocked = false;

  let ability: unknown;
  let targets: Tile[] = [];

  const setActor = (next: Unit) => {
    setMoved(false);
    setActed(false);
    setMoveLocked(false);
    startTile = next.tile();
    startDirection = next.direction();
    actor = next;
  };

  const setMoved = (to: boolean) => {
    moved = to;
  };

  const setActed = (to: boolean) => {
    acted = to;
  };

  const setMoveLocked = (to: boolean) => {
    moveLocked = to;
  };

  const setAbility = (next: unknown) => {
    ability = next;
  };

  const setTargets = (next: Tile[]) => (targets = next);

  const undoMove = () => {
    setMoved(false);
    actor.setPosition(startTile.top());
    actor.setDirection(startDirection);
    startTile.setContent(actor);
  };

  return {
    actor: () => actor,
    setActor,

    moved: () => moved,
    setMoved,

    acted: () => acted,
    setActed,

    moveLocked: () => moveLocked,
    setMoveLocked,

    ability: () => ability,
    setAbility,

    targets: () => targets,
    setTargets,

    undoMove,
  };
};

export const createFlag = (initial: boolean) => {
  const defaultState: Readonly<boolean> = initial;
  let active = initial;

  const setActive = (to: boolean) => (active = to);

  return {
    defaultState,
    active: () => active,
    setActive,
  };
};

export type TurnOrder = {
  round: (units: Unit[], data: TurnData) => Generator<Unit, void, unknown>;
};

export const createTurnOrder = () => {
  const id = `turn-order [${nanoid()}]`;

  const canTakeTurn = (unit: Unit) => {
    const flag = createFlag(unit.stats().ctr >= activationCost);
    message(turnChecked, unit.address(), flag);
    return flag.active();
  };

  function* round(units: Unit[], data: TurnData) {
    while (true) {
      message(beforeRound, id);
      for (const unit of units) {
        const { ctr: ctr, speed: spd } = unit.stats();
        unit.setStats({ ctr: ctr + spd });
      }

      const sortedUnits = [
        ...units.sort((a, b) => (a.stats().ctr >= b.stats().ctr ? 1 : -1)),
      ];

      for (const unit of sortedUnits) {
        if (canTakeTurn(unit)) {
          data.setActor(unit);
          message(beforeTurn, id);
          yield unit;

          let cost = 0 + turnCost;

          if (data.moved()) {
            cost += moveCost;
          }

          if (data.acted()) {
            cost += actionCost;
          }

          unit.setStats({ ctr: unit.stats().ctr - cost });
          message(turnChecked, unit.address());
        }
      }
    }
  }

  return {
    round,
  };
};
