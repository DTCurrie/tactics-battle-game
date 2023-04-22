import { ReadableAtom, atom, map, deepMap, action, MapStore } from "nanostores";
import { BaseStatsData, baseStatTypes } from "../units/stats";
import { Action } from "@battles/actions/action-types";

export const offhandSlot = "offHand" as const;
export type OffhandSlot = typeof offhandSlot;

export const weaponSlots = ["mainHand", offhandSlot] as const;
export const weaponTypes = ["oneHanded", "twoHanded"] as const;
export type WeaponSlot = (typeof weaponSlots)[number];
export type WeaponType = (typeof weaponTypes)[number];
export type WeaponAttackAction = Required<
  Pick<Action, "power" | "range" | "target">
>;
export type WeaponProperties = {
  slot: WeaponSlot;
  type: WeaponType;
  attack: WeaponAttackAction;
  dualWield?: boolean;
};

export const armorSlots = ["head", "body"] as const;
export type ArmorSlot = (typeof armorSlots)[number];

export const accessorySlot = "accessory" as const;
export type AccessorySlot = typeof accessorySlot;

export const equipmentSlots = [
  ...weaponSlots,
  ...armorSlots,
  accessorySlot,
] as const;

export type EquipmentSlot = (typeof equipmentSlots)[number];

export type Equipable = Readonly<{
  name: string;
  stats: MapStore<Partial<BaseStatsData>>;
  equipped: ReadableAtom<boolean>;
}> & {
  equip: (stats: BaseStatsData) => BaseStatsData;
  unequip: (stats: BaseStatsData) => BaseStatsData;
};

export type Offhand = Equipable & { slot: OffhandSlot };
export type Weapon = Equipable & WeaponProperties;
export type Armor = Equipable & { slot: ArmorSlot };
export type Accessory = Equipable & { slot: AccessorySlot };

export type EquipableOptions = Pick<Equipable, "name"> & {
  stats: Partial<BaseStatsData>;
};

export type OffhandOptions = EquipableOptions & { slot: OffhandSlot };
export type WeaponOptions = EquipableOptions & WeaponProperties;
export type ArmorOptions = EquipableOptions & { slot: ArmorSlot };
export type AccessoryOptions = EquipableOptions & { slot: AccessorySlot };

export const Offhand = (item: Equipable) => {
  if ((item as Offhand).slot === "offHand") {
    return item as Offhand;
  }

  return false;
};

export const isWeapon = (item: Equipable) => {
  if (
    (item as Weapon).slot === "mainHand" ||
    (item as Weapon).slot === "offHand"
  ) {
    return item as Weapon;
  }

  return false;
};

export const isArmor = (item: Equipable) => {
  if ((item as Armor).slot === "body" || (item as Armor).slot === "head") {
    return item as Armor;
  }

  return false;
};

export const isAccessory = (item: Equipable) => {
  if ((item as Accessory).slot === "accessory") {
    return item as Accessory;
  }

  return false;
};

export const isOfType = (
  item: Equipable,
  type: "weapon" | "armor" | "accessory"
) => {
  if (type === "weapon") {
    return isWeapon(item);
  }

  if (type === "armor") {
    return isArmor(item);
  }

  return isAccessory(item);
};

export const createEquipable = ({
  name,
  stats: initialStats,
}: EquipableOptions): Equipable => {
  const equipped = atom(false);
  const stats = map(initialStats);

  const equip = (unitStats: BaseStatsData) => {
    const next: BaseStatsData = { ...unitStats };

    for (const stat of baseStatTypes) {
      let value = next[stat];

      value += stats.get()[stat] ?? 0;
      next[stat] = value;
    }

    equipped.set(true);
    return next;
  };

  const unequip = (unitStats: BaseStatsData) => {
    const next: BaseStatsData = { ...unitStats };

    for (const stat of baseStatTypes) {
      let value = next[stat];
      value -= stats.get()[stat] ?? 0;
      next[stat] = value;
    }

    equipped.set(false);
    return next;
  };

  return {
    name,
    stats,
    equipped,

    equip,
    unequip,
  };
};

export const createOffhand = ({
  name,
  stats,
  slot,
}: OffhandOptions): Offhand => {
  const equipable = createEquipable({ name, stats });

  return {
    ...equipable,
    slot,
  };
};

export const createWeapon = ({
  name,
  stats,
  slot,
  type,
  attack,
  dualWield = false,
}: WeaponOptions): Weapon => {
  const equipable = createEquipable({ name, stats });

  return {
    ...equipable,
    slot,
    type,
    attack,
    dualWield,
  };
};

export const createArmor = ({ name, stats, slot }: ArmorOptions): Armor => {
  const equipable = createEquipable({ name, stats });

  return {
    ...equipable,
    slot,
  };
};

export const createAccessory = ({
  name,
  stats,
  slot,
}: AccessoryOptions): Accessory => {
  const equipable = createEquipable({ name, stats });

  return {
    ...equipable,
    slot,
  };
};

export type EquipmentSlots = Record<EquipmentSlot, Equipable | undefined>;
export type EquipData = { stats: BaseStatsData; unequipped: Equipable[] };

export type Equipment = {
  slots: () => EquipmentSlots;
  equip: (
    unitStats: BaseStatsData,
    item: Equipable,
    slot: EquipmentSlot
  ) => EquipData;

  getWeapon: (slot: WeaponSlot) => Weapon | undefined;
  unequip: (unitStats: BaseStatsData, slot: EquipmentSlot) => EquipData;

  debug: () => string;
};

export const createEquipment = (): Equipment => {
  const slots = deepMap<EquipmentSlots>();

  const getWeapon = (slot: WeaponSlot) =>
    slots.get()[slot] as Weapon | undefined;

  const equip = action(
    slots,
    "equip",
    (
      store,
      unitStats: BaseStatsData,
      item: Equipable,
      slot: EquipmentSlot
    ): EquipData => {
      let stats = { ...unitStats };
      const replaced = store.get()[slot];
      const unequipped: Equipable[] = [];

      if (replaced) {
        stats = { ...replaced.unequip(stats) };
        unequipped.push(replaced);
      }

      const mainHand = slot === "mainHand";
      const offHand = slot === "offHand";
      const dualWield = (item as Weapon).dualWield;

      if (mainHand && !dualWield) {
        // If replacing main hand with non-dual-wield weapon, unequip off hand if equipped and dual-wield
        const other = store.get()["offHand"];
        if (other && (other as Weapon).dualWield) {
          stats = { ...other.unequip(stats) };
          unequipped.push(other);
        }
      } else if (offHand && !dualWield) {
        // If replacing off hand with non-dual-wield weapon, unequip main hand if equipped and dual-wield
        const other = store.get()["mainHand"];
        if (other && (other as Weapon).dualWield) {
          stats = { ...other.unequip(stats) };
          unequipped.push(other);
        }
      } else if (mainHand && dualWield) {
        // If replacing main hand with dual-wield weapon, unequip off hand if equipped and non-dual-wield
        const other = store.get()["offHand"];
        if (other && !(other as Weapon).dualWield) {
          stats = { ...other.unequip(stats) };
          unequipped.push(other);
        }
      } else if (offHand && dualWield) {
        // If replacing off hand with dual-wield weapon, unequip main hand if equipped and non-dual-wield
        const other = store.get()["mainHand"];
        if (other && !(other as Weapon).dualWield) {
          stats = { ...other.unequip(stats) };
          unequipped.push(other);
        }
      } else if (mainHand && (item as Weapon).type === "twoHanded") {
        // If replacing main hand with two-handed, unequip off hand if equipped
        const other = store.get()["offHand"];
        if (other) {
          stats = { ...other.unequip(stats) };
          unequipped.push(other);
        }
      } else if (offHand) {
        // If replacing off hand, unequip two-handed weapon if equipped
        const other = store.get()["mainHand"];
        if (other && (other as Weapon).type === "twoHanded") {
          stats = { ...other.unequip(stats) };
          unequipped.push(other);
        }
      }

      stats = { ...item.equip(stats) };
      store.setKey(slot, item);

      return { stats, unequipped };
    }
  );

  const unequip = action(
    slots,
    "unequip",
    (store, unitStats: BaseStatsData, slot: EquipmentSlot): EquipData => {
      let stats = { ...unitStats };
      const unequipped = store.get()[slot];
      if (unequipped === undefined) {
        return { stats, unequipped: [] };
      }

      stats = { ...unequipped.unequip(stats) };
      store.setKey(slot, undefined);

      return { stats, unequipped: [unequipped] };
    }
  );

  return {
    slots: () => slots.get(),

    equip,
    unequip,
    getWeapon,

    debug: () => JSON.stringify(slots.get(), undefined, 2),
  };
};

export * from "./equipment-data";