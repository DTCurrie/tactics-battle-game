import { ATTACK, DEFENSE, Unit } from "@units";
import { ActionPower } from "./action-types";

export const createWeaponPower = (): ActionPower => {
  const getBaseAttack = (unit: Unit) => unit.getStat(ATTACK);
  const getBaseDefense = (target: Unit) => target.getStat(DEFENSE);

  const getPower = (unit: Unit) => {
    return getBaseAttack(unit);
  };

  return {
    getBaseAttack,
    getBaseDefense,
    getPower,
  };
};
