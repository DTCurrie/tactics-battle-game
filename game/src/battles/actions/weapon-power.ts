import { Unit } from "@units";
import { ActionPower } from "./action-types";

export const createWeaponPower = (): ActionPower => {
  const getBaseAttack = (unit: Unit) => unit.getStat("attack");
  const getBaseDefense = (target: Unit) => target.getStat("defense");

  const getPower = (unit: Unit) => {
    return getBaseAttack(unit);
  };

  return {
    getBaseAttack,
    getBaseDefense,
    getPower,
  };
};
