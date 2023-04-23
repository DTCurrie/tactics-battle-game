import { Raycaster, Vector2, Vector2Tuple } from "three";
import { button, buttons } from "@tactics-battle-game/ui";
import { three, updatesSystem } from "@tactics-battle-game/three-utils";
import { battleStateMachine } from "../battle-state-machine";
import { createCommandSelectionState } from "./command-selection";
import { Board, TILE_LAYER } from "@tactics-battle-game/core";
import { createMoveSequenceState } from "./move-sequence";
import { Pathfinder } from "../pathfinder";

const { renderer, camera } = three();
const { addUpdate, removeUpdate } = updatesSystem();

export const createMoveTargetUi = (board: Board, pathfinder: Pathfinder) => {
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

    const [x, y]: Vector2Tuple = [
      Math.floor(intersects[0].object.position.x),
      Math.floor(intersects[0].object.position.z),
    ];

    const tile = board.getTile([x, y]);

    if (!tile || !tile.marked()) {
      return;
    }

    battleStateMachine().transition(
      createMoveSequenceState(pathfinder.paths.get()[x][y])
    );
  }

  const raycast = () => {
    raycaster.setFromCamera(pointer, camera());

    const intersects = raycaster.intersectObjects(board.group.children);
    if (intersects.length) {
      board.moveSelector([
        Math.floor(intersects[0].object.position.x),
        Math.floor(intersects[0].object.position.z),
      ]);
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
