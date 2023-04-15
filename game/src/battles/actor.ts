import { Piece } from "./piece";
import { Unit } from "../units/unit";

export type Actor = Unit & Piece;
export type ActorOptions = { unit: Unit; piece: Piece };

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
