import { WeaponSlot } from "@equipment";
import { createWeaponPower } from "../actions/weapon-power";
import { BattleState, battleStateMachine } from "../battle-state-machine";
import { createCommandSelectionState } from "./command-selection";

export const createWeaponAttackState = (
  slot: WeaponSlot = "mainHand"
): BattleState => {
  return {
    onEnter: ({ turn }) => {
      const actor = turn.actor();
      const attack = createWeaponPower();
      console.log("attack", { slot, attack });

      const again = Boolean(
        slot === "mainHand" && actor.equipment().slots().offHand
      );

      if (again) {
        battleStateMachine().transition(createWeaponAttackState("offHand"));
        return {};
      }

      turn.setActed(true);
      battleStateMachine().transition(createCommandSelectionState());

      return {};
    },
  };
};
