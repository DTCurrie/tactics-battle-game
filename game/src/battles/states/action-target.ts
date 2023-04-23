import { MarkerColor, Tile } from "@tactics-battle-game/core";
import { Action } from "@actions/action-types";
import { BattleState } from "@battles";
import { createActionTargetUi } from "./action-target-ui";

export const createActionTargetState = (
  action: Action,
  type: Extract<MarkerColor, "offense" | "support">
): BattleState => {
  return {
    onEnter: ({ board, turn }) => {
      const targets: Tile[] = [];
      const actor = turn.actor();

      const paths = action.range?.getPathsInRange(board, actor) ?? [];
      for (const path of paths) {
        path.tile.setMarked(type);
        targets.push(path.tile);
      }

      return { targets, ui: createActionTargetUi(board, actor, action, type) };
    },
    onExit: ({ ui, targets }) => {
      for (const target of targets) {
        target.setMarked();
      }

      ui.dispose();
      return { ui: undefined };
    },
  };
};
