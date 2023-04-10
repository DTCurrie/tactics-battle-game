import { Weapon } from "../../units/equipment";
import { Unit } from "../../units/unit";
import { AbilityPower } from "./ability-types";

export const createWeaponAttack = (
  unit: Unit,
  weapon?: Weapon
): AbilityPower => {
  const getBaseAttack = () => unit.getStat("attack");
  const getBaseDefense = (target: Unit) => target.getStat("defense");

  const getPower = () => {
    let power = 0;
    if (weapon) {
      power += weapon.stats.get().attack ?? 0;
    }

    if (power > 0) {
      return power;
    }

    return getBaseAttack();
  };

  return {
    getBaseAttack,
    getBaseDefense,
    getPower,
  };
};
