import { WeaponSlot } from "../../units/equipment";
import { createWeaponAttack } from "../abilities/weapon-attack";
import { BattleState, battleStateMachine } from "../battle-state-machine";
import { createCommandSelectionState } from "./command-selection";

export const createWeaponAttackState = (
  slot: WeaponSlot = "mainHand"
): BattleState => {
  return {
    onEnter: (context) => {
      const attack = createWeaponAttack(context.turn.actor.get());
      console.log("attack", { slot, attack });

      const again =
        slot === "mainHand" &&
        context.turn.actor.get().equipment.get().slots.get().offHand;

      if (again) {
        battleStateMachine().transition(createWeaponAttackState("offHand"));
        return { ...context };
      }

      context.turn.acted.set(true);
      battleStateMachine().transition(createCommandSelectionState());

      return { ...context };
    },
  };
};
