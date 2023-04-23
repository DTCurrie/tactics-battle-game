import { nanoid } from "nanoid";
import { map, atom, action } from "nanostores";

import {
  Equipable,
  EquipmentSlot,
  MAIN_HAND_SLOT,
  OFF_HAND_SLOT,
  BODY_SLOT,
  HEAD_SLOT,
  ACCESSORY_SLOT,
} from "@equipment/equipment-types";

import {
  Equipment,
  EquipData,
  createEquipment,
  isWeapon,
  isArmor,
  isAccessory,
} from "@equipment/index";

import { Job } from "@jobs/index";
import { logger } from "@lib/logger";

import {
  BaseStatsData,
  StatsData,
  StatType,
  VariableStatType,
  RankStatsData,
  VariableStatsData,
  VARIABLE_STATS,
  TURN_COUNTER,
  MAX_HP,
  CURRENT_HP,
  MAX_AP,
  CURRENT_AP,
} from "./stats";

export type Unit = Readonly<{
  id: string;
  name: string;
  address: string;
}> & {
  baseStats: () => BaseStatsData;
  stats: () => StatsData;
  getStat: (type: StatType | VariableStatType) => number;

  job: () => Job;
  setJob: (next: Job) => BaseStatsData;

  equipment: () => Equipment;
  equip: (item: Equipable, slot: EquipmentSlot) => EquipData;
  unequip: (slot: EquipmentSlot) => EquipData;

  incrementCtr: () => number;
  reduceCtr: (cost: number) => number;

  adjustHealth: (by: number) => number;
  adjustAbilityPoints: (points: number) => number;

  debug: () => string;
};

export type UnitOptions = {
  name: string;
  job: Job;
  id?: string;
  stats?: Partial<StatsData>;
};

export const createUnit = ({
  name,
  job: initialJob,
  id = nanoid(),
  stats: initialStats,
}: UnitOptions): Unit => {
  const address = `${name} [${id}]`;
  const { logError } = logger(address);

  const experienceStats = map<RankStatsData>({
    level: 1,
    experience: 0,
    ...initialStats,
  });

  const baseStats = map<BaseStatsData>({
    maxHealthPoints: 1,
    maxAbilityPoints: 1,
    attack: 1,
    defense: 1,
    arcana: 1,
    spirit: 1,
    evade: 1,
    resist: 1,
    accuracy: 1,
    speed: 1,
    move: 1,
    jump: 1,
    ...initialStats,
  });

  const stats = map<StatsData>({
    ...initialStats,
    ...experienceStats.get(),
    ...baseStats.get(),
  });

  const variableStats = map<VariableStatsData>({
    currentHealthPoints: 1,
    currentAbilityPoints: 1,
    turnCounter: 0,
  });

  const job = atom(initialJob);
  const equipment = atom(createEquipment());

  const setBaseStats = action(
    baseStats,
    "setBaseStats",
    (store, to: Partial<BaseStatsData>) => {
      const next = { ...store.get(), ...to };
      stats.set({ ...stats.get(), ...next });
      store.set(next);
      return next;
    }
  );

  const getStat = (type: StatType | VariableStatType) => {
    if (VARIABLE_STATS.includes(type as VariableStatType)) {
      return variableStats.get()[type as VariableStatType];
    }

    return stats.get()[type as StatType];
  };

  const setJob = action(job, "setJob", (store, next: Job) => {
    let stats = baseStats.get();
    stats = { ...stats, ...store.get().unemploy(stats) };
    stats = { ...stats, ...next.employ(stats) };
    setBaseStats(stats);
    store.set(next);
    return stats;
  });

  const equip = action(
    baseStats,
    "equip",
    (store, item: Equipable, slot: EquipmentSlot) => {
      let nextStats = store.get();
      if (
        (slot === MAIN_HAND_SLOT || slot === OFF_HAND_SLOT) &&
        !isWeapon(item)
      ) {
        logError("Invalid weapon to equip", { item, slot });
        return { stats: nextStats, unequipped: [] };
      }

      if ((slot === BODY_SLOT || slot === HEAD_SLOT) && !isArmor(item)) {
        logError("Invalid armor to equip", { item, slot });
        return { stats: nextStats, unequipped: [] };
      }

      if (slot === ACCESSORY_SLOT && !isAccessory(item)) {
        logError("Invalid accessory to equip", { item, slot });
        return { stats: nextStats, unequipped: [] };
      }

      const { stats, unequipped } = equipment
        .get()
        .equip(nextStats, item, slot);

      nextStats = { ...nextStats, ...stats };
      store.set(nextStats);

      return { stats: nextStats, unequipped };
    }
  );

  const unequip = action(baseStats, "unequip", (store, slot: EquipmentSlot) => {
    let nextStats = store.get();
    if (!equipment.get().slots()[slot]) {
      logError("No item to equip", {
        slot,
        equipment: equipment.get().slots(),
      });

      return { stats: nextStats, unequipped: [] };
    }

    const { stats, unequipped } = equipment.get().unequip(nextStats, slot);

    nextStats = { ...nextStats, ...stats };
    store.set(nextStats);
    return { stats: nextStats, unequipped };
  });

  const incrementCtr = action(variableStats, "incrementCtr", (store) => {
    const { speed } = stats.get();
    const { turnCounter } = store.get();
    let next = turnCounter;
    next += speed;
    store.setKey(TURN_COUNTER, next);
    return next;
  });

  const reduceCtr = action(
    variableStats,
    "reduceCtr",
    (store, cost: number) => {
      const { turnCounter } = store.get();
      let next = turnCounter;
      next -= cost;
      store.setKey(TURN_COUNTER, next);
      return next;
    }
  );

  const adjustHealth = action(
    variableStats,
    "adjustHealth",
    (store, by: number) => {
      let next = store.get().currentHealthPoints + by;
      if (next < 0) {
        next = 0;
      }

      if (next > stats.get()[MAX_HP]) {
        next = getStat(MAX_HP);
      }

      store.setKey(CURRENT_HP, next);
      return next;
    }
  );

  const adjustAbilityPoints = action(
    variableStats,
    "adjustAbilityPoints",
    (store, by: number) => {
      let next = store.get().currentAbilityPoints + by;
      if (next < 0) {
        next = 0;
      }

      if (next > getStat(MAX_AP)) {
        next = getStat(MAX_AP);
      }

      store.setKey(CURRENT_AP, next);
      return next;
    }
  );

  setBaseStats(job.get().employ(baseStats.get()));

  return {
    id,
    name,
    address,
    baseStats: () => baseStats.get(),
    stats: () => stats.get(),
    job: () => job.get(),
    equipment: () => equipment.get(),

    getStat,
    setJob,
    equip,
    unequip,
    incrementCtr,
    reduceCtr,
    adjustHealth,
    adjustAbilityPoints,

    debug: () =>
      JSON.stringify(
        {
          id,
          name,
          address,
          stats: {
            ...stats.get(),
            ...variableStats.get(),
          },
          job: job.get().debug(),
          equipment: equipment.get().debug(),
        },
        undefined,
        2
      ),
  };
};

export * from "./stats";
