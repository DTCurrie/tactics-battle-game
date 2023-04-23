import { createAreaRange } from "@actions/area-range";
import { createLineRange } from "@actions/line-range";
import { createWeaponPower } from "@actions/weapon-power";
import { createWeaponTarget } from "@actions/weapon-target";
import { createOffHand, createWeapon, createArmor, createAccessory } from ".";
import {
  OFF_HAND_SLOT,
  MAIN_HAND_SLOT,
  ONE_HANDED,
  TWO_HANDED,
  BODY_SLOT,
  HEAD_SLOT,
  ACCESSORY_SLOT,
} from "./equipment-types";

export const OFF_HAND_FACTORIES = {
  shield: () =>
    createOffHand({
      name: "Shield",
      slot: OFF_HAND_SLOT,
      stats: {
        defense: 4,
      },
    }),
} as const;

export const WEAPON_FACTORIES = {
  dagger: () =>
    createWeapon({
      name: "Dagger",
      slot: MAIN_HAND_SLOT,
      type: ONE_HANDED,
      dualWield: true,
      attack: {
        range: createLineRange(),
        power: createWeaponPower(),
        target: createWeaponTarget(),
      },
      stats: {
        attack: 6,
      },
    }),

  sword: () =>
    createWeapon({
      name: "Sword",
      slot: MAIN_HAND_SLOT,
      type: ONE_HANDED,
      attack: {
        range: createLineRange(),
        power: createWeaponPower(),
        target: createWeaponTarget(),
      },
      stats: {
        attack: 8,
      },
    }),

  staff: () =>
    createWeapon({
      name: "Staff",
      slot: MAIN_HAND_SLOT,
      type: TWO_HANDED,
      attack: {
        range: createAreaRange(2),
        power: createWeaponPower(),
        target: createWeaponTarget(),
      },
      stats: {
        attack: 2,
        arcana: 6,
      },
    }),
} as const;

export const ARMOR_FACTORIES = {
  tunic: () =>
    createArmor({
      name: "Tunic",
      slot: BODY_SLOT,
      stats: {
        defense: 4,
        evade: 2,
      },
    }),

  chainmail: () =>
    createArmor({
      name: "Chainmail",
      slot: BODY_SLOT,
      stats: {
        defense: 6,
      },
    }),

  robe: () =>
    createArmor({
      name: "Robe",
      slot: BODY_SLOT,
      stats: {
        defense: 2,
        spirit: 4,
      },
    }),

  cap: () =>
    createArmor({
      name: "Cap",
      slot: HEAD_SLOT,
      stats: {
        defense: 2,
        spirit: 2,
      },
    }),

  helm: () =>
    createArmor({
      name: "Helm",
      slot: HEAD_SLOT,
      stats: {
        defense: 4,
      },
    }),

  strawHat: () =>
    createArmor({
      name: "Straw Hat",
      slot: HEAD_SLOT,
      stats: {
        spirit: 4,
      },
    }),
} as const;

export const ACCESSORY_FACTORIES = {
  runningShoes: () =>
    createAccessory({
      name: "Running Shoes",
      slot: ACCESSORY_SLOT,
      stats: {
        move: 1,
      },
    }),
} as const;
