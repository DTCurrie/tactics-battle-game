import { button, buttons } from "@tactics-battle-game/ui";
import {
  BattleContext,
  battleStateMachine,
} from "@battles/battle-state-machine";

import { createMoveTargetState } from "./move-target";
import { createAbilitySelectionState } from "./ability-selection";
import { createActionTargetState } from "./action-target";
import { WeaponAttackAction } from "@equipment/index";

export const createCommandSelectionUi = ({
  turn,
  board,
}: Pick<BattleContext, "turn" | "board">) => {
  const actor = turn.actor();
  const equipment = actor.equipment();
  const moveLocked = turn.moveLocked();
  const acted = turn.acted();
  let attackAction: WeaponAttackAction;
  let weapon = equipment.getWeapon("mainHand");

  const move = button("Move", () =>
    battleStateMachine().transition(createMoveTargetState())
  );

  const undo = button("Undo Move", () => {
    turn.undoMove();
    const position = actor.position();
    board.moveSelector([position.x, position.z]);
  });

  const attack = button("Attack", () => {
    battleStateMachine().transition(
      createActionTargetState(attackAction, "attack")
    );
  });

  const ability = button("Ability", () =>
    battleStateMachine().transition(createAbilitySelectionState())
  );

  const defend = button("Defend", () => console.log("defend"));
  const wait = button("Wait", () => console.log("wait"));
  const end = button("End Turn", () => console.log("end"));

  const btns = buttons([
    turn.moved() && !moveLocked ? undo : move,
    attack,
    ability,
    defend,
    acted ? end : wait,
  ]);

  turn.addMovedListener((next) => {
    btns.removeChild(btns.children[0]);
    btns.prepend(next ? undo : move);
  });

  if (moveLocked) {
    move.ariaReadOnly = "true";
    move.style.cursor = "not-allowed";
  }

  if (acted) {
    attack.ariaReadOnly = "true";
    attack.style.cursor = "not-allowed";

    ability.ariaReadOnly = "true";
    ability.style.cursor = "not-allowed";

    defend.ariaReadOnly = "true";
    defend.style.cursor = "not-allowed";
  }

  if (weapon?.attack === undefined) {
    weapon = equipment.getWeapon("offHand");
  }

  if (weapon?.attack === undefined) {
    attack.ariaReadOnly = "true";
    attack.style.cursor = "not-allowed";
  } else {
    attackAction = weapon.attack;
  }

  document.body.prepend(btns);
  const dispose = () => document.body.removeChild(btns);

  return { dispose };
};
