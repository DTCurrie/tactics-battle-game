import { Vector2, WebGLRenderer } from "three";
import { nanoid } from "nanoid";
import { settings, createLevel } from "@tactics-battle-game/api";
import { button, buttons } from "@tactics-battle-game/ui";
import { LevelEditor } from "./editor";

export const createLevelEditorUi = (
  renderer: WebGLRenderer,
  levelEditor: LevelEditor
) => {
  const pointer = new Vector2();

  function onPointerMove(event: PointerEvent) {
    pointer.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    pointer.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
  }

  const btns = buttons([
    button("Set Random Height", () =>
      levelEditor.adjustRandom(
        Math.floor(Math.random() * settings.board.height)
      )
    ),
    button("Set Random Ground", () => levelEditor.adjustRandom(1)),
    button("Randomize", () => {
      let count = 0;

      function randomizer() {
        levelEditor.adjustRandom(
          Math.floor(Math.random() * settings.board.height)
        );
        count++;
        if (count < 100) {
          setTimeout(randomizer, 10);
        }
      }

      randomizer();
    }),
    button("Save Level", () =>
      createLevel({
        name: `Test ${nanoid(10)}`,
        tileData: levelEditor.getTileData(),
      })
    ),
  ]);

  document.body.prepend(btns);

  window.addEventListener("pointermove", onPointerMove);

  return { pointer };
};
