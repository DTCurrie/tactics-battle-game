import { Raycaster, Vector2, Vector2Tuple } from "three";
import {
  Board,
  MarkerColor,
  TILE_LAYER,
  Tile,
  getHeading,
} from "@tactics-battle-game/core";
import { button, buttons } from "@tactics-battle-game/ui";
import { three, updatesSystem } from "@tactics-battle-game/three-utils";

import { Actor, battleStateMachine } from "@battles";
import { Action } from "@actions/action-types";

import { createCommandSelectionState } from "./command-selection";
import { createActionConfirmState } from "./action-confirm";

const { renderer, camera } = three();
const { addUpdate, removeUpdate } = updatesSystem();

export const createActionTargetUi = (
  board: Board,
  actor: Actor,
  action: Action,
  type: Extract<MarkerColor, "offense" | "support">
) => {
  const currentCandidates: Record<MarkerColor | "undefined", Tile[]> = {
    selected: [],
    movement: [],
    offense: [],
    support: [],
    undefined: [],
  };

  const pointer = new Vector2();
  const raycaster = new Raycaster();
  raycaster.layers.set(TILE_LAYER);

  const btns = buttons([
    button("Cancel", () =>
      battleStateMachine().transition(createCommandSelectionState())
    ),
  ]);

  function onPointerMove(event: PointerEvent) {
    pointer.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    pointer.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
  }

  function onPointerClick(event: MouseEvent) {
    event.preventDefault();

    raycaster.setFromCamera(pointer, camera());
    const intersects = raycaster.intersectObjects(board.group.children, false);
    if (!intersects.length) {
      return;
    }

    const coordinates: Vector2Tuple = [
      Math.floor(intersects[0].object.position.x),
      Math.floor(intersects[0].object.position.z),
    ];

    const tile = board.getTile(coordinates);

    if (!tile || !tile.marked() || !tile.occupied()) {
      return;
    }

    const heading = getHeading(actor.coordinates(), tile.position());
    actor.setDirection(heading);

    battleStateMachine().transition(createActionConfirmState(action, type));
  }

  const raycast = () => {
    raycaster.setFromCamera(pointer, camera());

    const intersects = raycaster.intersectObjects(board.group.children, false);
    if (intersects.length) {
      const coordinates: Vector2Tuple = [
        Math.floor(intersects[0].object.position.x),
        Math.floor(intersects[0].object.position.z),
      ];

      const tile = board.getTile(coordinates);

      if (!tile || !tile.marked() || !tile.occupied()) {
        return;
      }

      board.moveSelector(coordinates);

      for (const color in currentCandidates) {
        const marker = color as MarkerColor;
        const tiles = currentCandidates[marker];

        for (const reset of tiles) {
          reset.setMarked(marker);
        }

        currentCandidates[marker] = [];
      }

      const candidates = action.area?.getTilesInArea(board, tile) ?? [];
      if (candidates.length > 0) {
        for (const candidate of candidates) {
          currentCandidates[`${tile.marked()}`].push(tile);
          candidate.setMarked("selected");
        }
      }
    }
  };

  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("click", onPointerClick);
  document.body.prepend(btns);

  addUpdate(raycast);

  const dispose = () => {
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("click", onPointerClick);
    document.body.removeChild(btns);

    removeUpdate(raycast);
  };

  return { pointer, raycaster, dispose };
};
