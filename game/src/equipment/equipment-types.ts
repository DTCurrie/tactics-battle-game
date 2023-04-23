import { ReadableAtom } from "nanostores";
import { Action } from "@actions/action-types";
import { BaseStatsData } from "@units/stats";

export const OFF_HAND_EQUIPMENT_TYPE = "offHand" as const;
export const OFF_HAND_SLOT = OFF_HAND_EQUIPMENT_TYPE;
export const MAIN_HAND_SLOT = "mainHand" as const;
export const WEAPON_SLOTS = [MAIN_HAND_SLOT, OFF_HAND_SLOT] as const;

export const WEAPON_EQUIPMENT_TYPE = "weapon" as const;
export const ONE_HANDED = "mainHand" as const;
export const TWO_HANDED = "mainHand" as const;
export const WEAPON_TYPES = [ONE_HANDED, TWO_HANDED] as const;

export const ARMOR_EQUIPMENT_TYPE = "armor" as const;
export const HEAD_SLOT = "head" as const;
export const BODY_SLOT = "body" as const;
export const ARMOR_SLOTS = [HEAD_SLOT, BODY_SLOT] as const;

export const ACCESSORY_EQUIPMENT_TYPE = "accessory" as const;
export const ACCESSORY_SLOT = ACCESSORY_EQUIPMENT_TYPE;

export const EQUIPMENT_SLOTS = [
  ...WEAPON_SLOTS,
  ...ARMOR_SLOTS,
  ACCESSORY_SLOT,
] as const;

export type OffHandEquipmentType = typeof OFF_HAND_EQUIPMENT_TYPE;
export type OffHandSlot = typeof OFF_HAND_SLOT;
export type OffHandProperties = { slot: OffHandSlot };

export type WeaponEquipmentType = typeof WEAPON_EQUIPMENT_TYPE;
export type WeaponSlot = (typeof WEAPON_SLOTS)[number];
export type WeaponType = (typeof WEAPON_TYPES)[number];

export type WeaponAttackAction = Required<
  Pick<Action, "power" | "range" | "target">
>;

export type WeaponProperties = {
  slot: WeaponSlot;
  type: WeaponType;
  attack: WeaponAttackAction;
  dualWield?: boolean;
};

export type ArmorEquipmentType = typeof ARMOR_EQUIPMENT_TYPE;
export type ArmorSlot = (typeof ARMOR_SLOTS)[number];
export type ArmorProperties = { slot: ArmorSlot };

export type AccessoryEquipmentType = typeof ACCESSORY_EQUIPMENT_TYPE;
export type AccessorySlot = AccessoryEquipmentType;
export type AccessoryProperties = { slot: AccessorySlot };

export type EquipmentSlot = (typeof EQUIPMENT_SLOTS)[number];
export type EquipmentType =
  | OffHandEquipmentType
  | WeaponEquipmentType
  | ArmorEquipmentType
  | AccessoryEquipmentType;

export type Equipable = Readonly<{
  name: string;
  stats: Readonly<Partial<BaseStatsData>>;
  equipped: ReadableAtom<boolean>;
}> & {
  equip: (stats: BaseStatsData) => BaseStatsData;
  unequip: (stats: BaseStatsData) => BaseStatsData;
};

export type OffHand = Equipable & OffHandProperties;
export type Weapon = Equipable & WeaponProperties;
export type Armor = Equipable & ArmorProperties;
export type Accessory = Equipable & AccessoryProperties;

export type EquipableOptions = Pick<Equipable, "name"> & {
  stats: Partial<BaseStatsData>;
};

export type OffHandOptions = EquipableOptions & OffHandProperties;
export type WeaponOptions = EquipableOptions & WeaponProperties;
export type ArmorOptions = EquipableOptions & ArmorProperties;
export type AccessoryOptions = EquipableOptions & AccessoryProperties;
