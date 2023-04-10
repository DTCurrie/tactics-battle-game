import { nanoid } from "nanoid";

import { ReadableAtom, action, atom, map } from "nanostores";
import { Job } from "./jobs";
import {
  BaseStatsData,
  ExperienceStatsData,
  StatType,
  StatsData,
  statTypes,
} from "./stats";
import {
  EquipData,
  Equipable,
  Equipment,
  EquipmentSlot,
  createEquipment,
  isAccessory,
  isArmor,
  isWeapon,
} from "./equipment";
import { logger } from "../lib/logger";

export type Unit = Readonly<{
  id: string;
  name: string;
  address: string;
  baseStats: ReadableAtom<BaseStatsData>;
  stats: ReadableAtom<StatsData>;
  job: ReadableAtom<Job>;
  equipment: ReadableAtom<Equipment>;
}> & {
  getStat: (type: StatType) => number;
  setJob: (next: Job) => BaseStatsData;
  equip: (item: Equipable, slot: EquipmentSlot) => EquipData;
  unequip: (slot: EquipmentSlot) => EquipData;
  incrementCtr: () => number;
  reduceCtr: (cost: number) => number;
  damage: (damage: number) => number;
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

  const experienceStats = map<ExperienceStatsData>({
    level: 1,
    experience: 0,
    ...initialStats,
  });

  const baseStats = map<BaseStatsData>({
    maxHealthPoints: 1,
    maxMagicPoints: 1,
    attack: 1,
    defense: 1,
    magicAttack: 1,
    magicDefense: 1,
    evade: 1,
    resist: 1,
    speed: 1,
    move: 1,
    jump: 1,
    ...initialStats,
  });

  const stats = map<StatsData>({
    healthPoints: 1,
    magicPoints: 1,
    ctr: 0,
    ...initialStats,
    ...experienceStats.get(),
    ...baseStats.get(),
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

  const getStat = (type: StatType) => stats.get()[type];

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
      if ((slot === "mainHand" || slot === "offHand") && !isWeapon(item)) {
        logError("Invalid weapon to equip", { item, slot });
        return { stats: nextStats, unequipped: [] };
      }

      if ((slot === "body" || slot === "head") && !isArmor(item)) {
        logError("Invalid armor to equip", { item, slot });
        return { stats: nextStats, unequipped: [] };
      }

      if (slot === "accessory" && !isAccessory(item)) {
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
    if (!equipment.get().slots.get()[slot]) {
      logError("No item to equip", {
        slot,
        equipment: equipment.get().slots.get(),
      });

      return { stats: nextStats, unequipped: [] };
    }

    const { stats, unequipped } = equipment.get().unequip(nextStats, slot);

    nextStats = { ...nextStats, ...stats };
    store.set(nextStats);
    return { stats: nextStats, unequipped };
  });

  const incrementCtr = action(stats, "incrementCtr", (store) => {
    const { ctr, speed } = stats.get();
    let next = ctr;
    next += speed;
    store.setKey("ctr", next);
    return next;
  });

  const reduceCtr = action(stats, "reduceCtr", (store, cost: number) => {
    const { ctr } = stats.get();
    let next = ctr;
    next -= cost;
    store.setKey("ctr", next);
    return next;
  });

  const damage = action(stats, "damage", (store, damage: number) => {
    let next = store.get().healthPoints - damage;
    if (next < 0) {
      next = 0;
    }

    store.setKey("healthPoints", next);
    return next;
  });

  setBaseStats(job.get().employ(baseStats.get()));

  return {
    id,
    name,
    address,
    baseStats,
    stats,
    job,
    equipment,

    getStat,
    setJob,
    equip,
    unequip,
    incrementCtr,
    reduceCtr,
    damage,

    debug: () =>
      JSON.stringify(
        {
          id,
          name,
          address,
          stats: statTypes,
        },
        undefined,
        2
      ),
  };
};
