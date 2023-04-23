import { MarkerColor } from "@tactics-battle-game/core";
import { Action } from "@actions/action-types";
import { Actor, BattleState } from "@battles";
import { createActionConfirmUi } from "./action-confirm-ui";

export const createActionConfirmState = (
  action: Action,
  type: Extract<MarkerColor, "offense" | "support">
): BattleState => {
  return {
    onEnter: ({ targets, getActorAtPosition }) => {
      const actors: Actor[] = [];

      for (const target of targets) {
        const actor = getActorAtPosition(target.position());
        if (actor && action?.target?.isTarget(actor)) {
          target.setMarked(type);
          actors.push(actor);
        }
      }

      return { ui: createActionConfirmUi(action, type) };
    },
    onExit: ({ targets, ui }) => {
      for (const target of targets) {
        target.setMarked();
      }

      ui.dispose();
      return { ui: undefined };
    },
  };
};
