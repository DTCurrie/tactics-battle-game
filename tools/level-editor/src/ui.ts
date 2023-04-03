import { Vector2, WebGLRenderer } from "three";
import { LevelEditor } from "./editor";
import { SETTINGS, createLevel } from "@tactics-battle-game/api";

const button = (label: string, handler: (e: Event) => void) => {
  const btn = document.createElement("button");

  btn.textContent = label;
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    handler(e);
  });

  return btn;
};

const buttons = (btns: HTMLButtonElement[]) => {
  const btnContainer = document.createElement("div");

  btnContainer.style.position = "absolute";
  btnContainer.style.left = "4px";
  btnContainer.style.top = "4px";
  btnContainer.style.display = "flex";
  btnContainer.style.flexDirection = "column";
  btnContainer.style.gap = "2px";
  btnContainer.style.zIndex = "100";
  btnContainer.append(...btns);

  return btnContainer;
};

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
        Math.floor(Math.random() * SETTINGS.board.height)
      )
    ),
    button("Set Random Ground", () => levelEditor.adjustRandom(1)),
    button("Randomize", () => {
      let count = 0;

      function randomizer() {
        levelEditor.adjustRandom(
          Math.floor(Math.random() * SETTINGS.board.height)
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
        name: `Test ${Array.from(
          crypto.getRandomValues(new Uint8Array(10)),
          (dec) => dec.toString(16).padStart(2, "0")
        ).join("")}`,
        tileData: levelEditor.getTileData(),
      })
    ),
  ]);

  document.body.prepend(btns);

  window.addEventListener("pointermove", onPointerMove);

  return { pointer };
};
