import {
  Armor,
  ArmorOptions,
  Weapon,
  WeaponOptions,
  createArmor,
  createWeapon,
} from ".";

export const weaponData: Readonly<Record<string, WeaponOptions>> = {
  dagger: {
    name: "Dagger",
    slots: { mainHand: true, offHand: true },
    type: "oneHanded",
    dualWield: true,
    stats: {
      attack: 6,
    },
  },

  sword: {
    name: "Sword",
    slots: { mainHand: true },
    type: "oneHanded",
    stats: {
      attack: 8,
    },
  },

  shield: {
    name: "Shield",
    slots: { offHand: true },
    type: "oneHanded",
    stats: {
      defense: 4,
    },
  },

  staff: {
    name: "Staff",
    slots: { mainHand: true },
    type: "twoHanded",
    stats: {
      attack: 4,
      magicAttack: 8,
    },
  },
};

export const createDagger = (): Weapon => createWeapon(weaponData.dagger);
export const createSword = (): Weapon => createWeapon(weaponData.sword);
export const createShield = (): Weapon => createWeapon(weaponData.shield);
export const createStaff = (): Weapon => createWeapon(weaponData.staff);

export const weaponFactories = {
  dagger: createDagger,
  sword: createSword,
  shield: createShield,
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
      magicDefense: 4,
    },
  },

  cap: {
    name: "Cap",
    slot: "head",
    stats: {
      defense: 2,
      magicDefense: 2,
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
      magicDefense: 4,
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
