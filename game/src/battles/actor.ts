import { Unit } from "@units";
import { Entity } from "./entity";

export type Actor = Unit & Entity;
export type ActorOptions = {
  unit: Unit;
  piece: Entity;
};

export const createActor = ({ unit, piece }: ActorOptions): Actor => {
  return {
    ...unit,
    ...piece,
    debug: () =>
      JSON.stringify(
        {
          unit: unit.debug(),
          piece: piece.debug(),
        },
        undefined,
        2
      ),
  };
};
