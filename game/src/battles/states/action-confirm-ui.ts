import { MarkerColor } from "@tactics-battle-game/core";
import { three, Html, createHtml } from "@tactics-battle-game/three-utils";
import { button, buttons } from "@tactics-battle-game/ui";
import { Action } from "@actions/action-types";
import { Actor, battleStateMachine } from "@battles";
import { createActionTargetState } from "./action-target";
import { Vector2 } from "three";

const { camera, renderer } = three();

export const createActionConfirmUi = (
  action: Action,
  type: Extract<MarkerColor, "offense" | "support">,
  actors: Actor[]
) => {
  const htmls: Html[] = [];
  const btns = buttons([
    button(
      "Confirm",
      () => console.log("confirm")
      // battleStateMachine().transition(createCommandSelectionState())
    ),
    button("Cancel", () =>
      battleStateMachine().transition(createActionTargetState(action, type))
    ),
  ]);

  for (const actor of actors) {
    const el = document.createElement("div");

    el.innerHTML = actor.name;
    el.classList.add(
      ...[
        "absolute",
        "top-0",
        "left-0",
        "pl-4",
        "pr-8",
        "py-0.5",
        "from-offense",
        "to-offense-50",
        "bg-gradient-to-r",
        "opacity-80",
        "font-bold",
      ]
    );

    document.body.prepend(el);

    htmls.push(
      createHtml(
        camera(),
        renderer.domElement,
        el,
        actor.object3d,
        new Vector2(0, -(actor.height() * 60))
      )
    );
  }

  const dispose = () => {
    document.body.removeChild(btns);

    for (const html of htmls) {
      html.dispose();
    }
  };

  document.body.prepend(btns);

  return { dispose };
};
