import { button, buttons } from "@tactics-battle-game/ui";
import { battleStateMachine } from "../battle-state-machine";
import { createWeaponAttackState } from "./weapon-attack-state";

export const createCategorySelectionUi = () => {
  const attack = button("Attack", () => {
    console.log("attac");
    battleStateMachine().transition(createWeaponAttackState());
  });

  const btns = buttons([attack]);

  document.body.prepend(btns);

  const dispose = () => document.body.removeChild(btns);

  return { dispose };
};
