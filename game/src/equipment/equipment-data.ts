import { createLineRange } from "@battles/actions/line-range";
import {
  Armor,
  ArmorOptions,
  Offhand,
  OffhandOptions,
  Weapon,
  WeaponOptions,
  createArmor,
  createOffhand,
  createWeapon,
} from ".";
import { createAreaRange } from "@battles/actions/area-range";
import { createWeaponPower } from "@battles/actions/weapon-power";
import { createWeaponTarget } from "@battles/actions/weapon-target";

export const offhandData: Readonly<Record<string, OffhandOptions>> = {
  shield: {
    name: "Shield",
    slot: "offHand",
    stats: {
      defense: 4,
    },
  },
};

export const createShield = (): Offhand => createOffhand(offhandData.shield);

export const offhandFactories = {
  shield: createShield,
};

export const weaponData: Readonly<Record<string, WeaponOptions>> = {
  dagger: {
    name: "Dagger",
    slot: "mainHand",
    type: "oneHanded",
    dualWield: true,
    attack: {
      range: createLineRange(),
      power: createWeaponPower(),
      target: createWeaponTarget(),
    },
    stats: {
      attack: 6,
    },
  },

  sword: {
    name: "Sword",
    slot: "mainHand",
    type: "oneHanded",
    attack: {
      range: createLineRange(),
      power: createWeaponPower(),
      target: createWeaponTarget(),
    },
    stats: {
      attack: 8,
    },
  },

  staff: {
    name: "Staff",
    slot: "mainHand",
    type: "twoHanded",
    attack: {
      range: createAreaRange(2),
      power: createWeaponPower(),
      target: createWeaponTarget(),
    },
    stats: {
      attack: 2,
      arcana: 6,
    },
  },
};

export const createDagger = (): Weapon => createWeapon(weaponData.dagger);
export const createSword = (): Weapon => createWeapon(weaponData.sword);
export const createStaff = (): Weapon => createWeapon(weaponData.staff);

export const weaponFactories = {
  dagger: createDagger,
  sword: createSword,
  staff: createStaff,
};

export const armorData: Readonly<Record<string, ArmorOptions>> = {
  leatherTunic: {
    name: "Leather Tunic",
    slot: "body",
    stats: {
      defense: 4,
      evade: 2,
    },
  },

  chainmail: {
    name: "Chainmail",
    slot: "body",
    stats: {
      defense: 6,
    },
  },

  robe: {
    name: "Robe",
    slot: "body",
    stats: {
      defense: 2,
      spirit: 4,
    },
  },

  cap: {
    name: "Cap",
    slot: "head",
    stats: {
      defense: 2,
      spirit: 2,
    },
  },

  helm: {
    name: "Helm",
    slot: "head",
    stats: {
      defense: 4,
    },
  },

  strawHat: {
    name: "Straw Hat",
    slot: "head",
    stats: {
      spirit: 4,
    },
  },
};

export const createLeatherTunic = (): Armor =>
  createArmor(armorData.leatherTunic);

export const createChainmail = (): Armor => createArmor(armorData.chainmail);
export const createRobe = (): Armor => createArmor(armorData.robe);
export const createCap = (): Armor => createArmor(armorData.cap);
export const createHelm = (): Armor => createArmor(armorData.helm);
export const createStrawHat = (): Armor => createArmor(armorData.strawHat);

export const armorFactories = {
  leatherTunic: createLeatherTunic,
  chainmail: createChainmail,
  robe: createRobe,
  cap: createCap,
  helm: createHelm,
  strawHat: createStrawHat,
};
