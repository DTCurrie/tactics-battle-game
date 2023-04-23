import { BattleState } from "@battles/battle-state-machine";
import { Action } from "@battles/actions/action-types";
import { MarkerColor } from "@tactics-battle-game/core";
import { createActionConfirmUi } from "./action-confirm-ui";
import { Actor } from "@battles/actor";

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
