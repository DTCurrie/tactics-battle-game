import { Unit } from "@units";
import { ActionTarget } from "./action-types";

export const createWeaponTarget = (): ActionTarget => {
  return {
    isTarget: (unit: Unit) => {
      return unit.getStat("currentHealthPoints") > 0;
    },
  };
};
