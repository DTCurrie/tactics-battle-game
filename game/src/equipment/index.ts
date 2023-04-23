import { atom, deepMap, action } from "nanostores";
import { BaseStatsData, BASE_STATS } from "../units/stats";
import { logger } from "@lib/logger";
import {
  Equipable,
  OffHand,
  OFF_HAND_EQUIPMENT_TYPE,
  Weapon,
  MAIN_HAND_SLOT,
  Armor,
  BODY_SLOT,
  HEAD_SLOT,
  Accessory,
  ACCESSORY_EQUIPMENT_TYPE,
  EquipmentType,
  WEAPON_EQUIPMENT_TYPE,
  ARMOR_EQUIPMENT_TYPE,
  EquipableOptions,
  OffHandOptions,
  WeaponOptions,
  ArmorOptions,
  AccessoryOptions,
  EquipmentSlot,
  WeaponSlot,
  TWO_HANDED,
  OFF_HAND_SLOT,
  ACCESSORY_SLOT,
} from "./equipment-types";

const { logError } = logger("equipment");

export const isOffHand = (item: Equipable) => {
  if ((item as OffHand).slot === OFF_HAND_SLOT) {
    return item as OffHand;
  }

  return false;
};

export const isWeapon = (item: Equipable) => {
  if (
    (item as Weapon).slot === MAIN_HAND_SLOT ||
    (item as Weapon).slot === OFF_HAND_SLOT
  ) {
    return item as Weapon;
  }

  return false;
};

export const isArmor = (item: Equipable) => {
  if (
    (item as Armor).slot === BODY_SLOT ||
    (item as Armor).slot === HEAD_SLOT
  ) {
    return item as Armor;
  }

  return false;
};

export const isAccessory = (item: Equipable) => {
  if ((item as Accessory).slot === ACCESSORY_SLOT) {
    return item as Accessory;
  }

  return false;
};

export const isOfType = (item: Equipable, type: EquipmentType) => {
  switch (type) {
    case OFF_HAND_EQUIPMENT_TYPE:
      return isOffHand(item);
    case WEAPON_EQUIPMENT_TYPE:
      return isWeapon(item);
    case ARMOR_EQUIPMENT_TYPE:
      return isArmor(item);
    case ACCESSORY_EQUIPMENT_TYPE:
      return isAccessory(item);
    default:
      logError("Invalid `type` argument passed to `isOfType`", { item, type });
      return false;
  }
};

export const createEquipable = ({
  name,
  stats,
}: EquipableOptions): Equipable => {
  const equipped = atom(false);

  const equip = (unitStats: BaseStatsData) => {
    const next: BaseStatsData = { ...unitStats };

    for (const stat of BASE_STATS) {
      let value = next[stat];

      value += stats[stat] ?? 0;
      next[stat] = value;
    }

    equipped.set(true);
    return next;
  };

  const unequip = (unitStats: BaseStatsData) => {
    const next: BaseStatsData = { ...unitStats };

    for (const stat of BASE_STATS) {
      let value = next[stat];
      value -= stats[stat] ?? 0;
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

export const createOffHand = ({
  name,
  stats,
  slot,
}: OffHandOptions): OffHand => {
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
  getWeapon: (slot: WeaponSlot) => Weapon | undefined;

  equip: (
    unitStats: BaseStatsData,
    item: Equipable,
    slot: EquipmentSlot
  ) => EquipData;

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

      const mainHand = slot === MAIN_HAND_SLOT;
      const offHand = slot === OFF_HAND_SLOT;
      const dualWield = (item as Weapon).dualWield;

      if (mainHand && !dualWield) {
        // If replacing main hand with non-dual-wield weapon, unequip off hand if equipped and dual-wield
        const other = store.get()[OFF_HAND_SLOT];
        if (other && (other as Weapon).dualWield) {
          stats = { ...other.unequip(stats) };
          unequipped.push(other);
        }
      } else if (offHand && dualWield) {
        // If replacing off hand with dual-wield weapon, unequip main hand if equipped and non-dual-wield
        const other = store.get()[MAIN_HAND_SLOT];
        if (other && !(other as Weapon).dualWield) {
          stats = { ...other.unequip(stats) };
          unequipped.push(other);
        }
      } else if (mainHand && (item as Weapon).type === TWO_HANDED) {
        // If replacing main hand with two-handed, unequip off hand if equipped
        const other = store.get()[OFF_HAND_SLOT];
        if (other) {
          stats = { ...other.unequip(stats) };
          unequipped.push(other);
        }
      } else if (offHand) {
        // If replacing off hand, unequip two-handed weapon if equipped
        const other = store.get()[MAIN_HAND_SLOT];
        if (other && (other as Weapon).type === TWO_HANDED) {
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
export * from "./equipment-types";
