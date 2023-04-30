import { MarkerColor, Tile } from "@tactics-battle-game/core";
import { Action } from "@actions/action-types";
import { Actor, BattleState } from "@battles";
import { createActionConfirmUi } from "./action-confirm-ui";

export const createActionConfirmState = (
  action: Action,
  type: Extract<MarkerColor, "offense" | "support">,
  candidates: Tile[]
): BattleState => {
  return {
    onEnter: ({ getActorAtPosition }) => {
      const actors: Actor[] = [];

      for (const target of candidates) {
        const actor = getActorAtPosition(target.position());
        if (actor && action?.target?.isTarget(actor)) {
          target.setMarked(type);
          actors.push(actor);
        }
      }

      return { ui: createActionConfirmUi(action, type, actors) };
    },
    onExit: ({ ui }) => {
      for (const target of candidates) {
        target.setMarked();
      }

      ui.dispose();
      return { ui: undefined };
    },
  };
};
