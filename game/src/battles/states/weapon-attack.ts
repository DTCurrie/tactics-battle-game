import { MAIN_HAND_SLOT, OFF_HAND_SLOT, WeaponSlot } from "@equipment";
import { createWeaponPower } from "../actions/weapon-power";
import { BattleState, battleStateMachine } from "../battle-state-machine";
import { createCommandSelectionState } from "./command-selection";
import { ATTACK } from "@units/stats";

export const createWeaponAttackState = (
  slot: WeaponSlot = MAIN_HAND_SLOT
): BattleState => {
  return {
    onEnter: ({ turn }) => {
      const actor = turn.actor();
      const attack = createWeaponPower();
      console.log(ATTACK, { slot, attack });

      const again = Boolean(
        slot === MAIN_HAND_SLOT && actor.equipment().slots().offHand
      );

      if (again) {
        battleStateMachine().transition(createWeaponAttackState(OFF_HAND_SLOT));
        return {};
      }

      turn.setActed(true);
      battleStateMachine().transition(createCommandSelectionState());

      return {};
    },
  };
};
