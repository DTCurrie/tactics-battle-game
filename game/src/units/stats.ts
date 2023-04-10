export const growthStatTypes = [
  "maxHealthPoints",
  "maxMagicPoints",
  "attack",
  "defense",
  "magicAttack",
  "magicDefense",
  "speed",
] as const;

export type GrowthStatType = (typeof growthStatTypes)[number];
export type GrowthStatsData = Record<(typeof growthStatTypes)[number], number>;

export const experienceStatTypes = ["level", "experience"] as const;

export type ExperienceStatType = (typeof experienceStatTypes)[number];
export type ExperienceStatsData = Record<
  (typeof experienceStatTypes)[number],
  number
>;

export const baseStatTypes = [
  ...growthStatTypes,
  "evade",
  "resist",
  "move",
  "jump",
] as const;

export type BaseStatType = (typeof baseStatTypes)[number];
export type BaseStatsData = Record<(typeof baseStatTypes)[number], number>;

export const statTypes = [
  ...experienceStatTypes,
  ...baseStatTypes,
  "healthPoints",
  "magicPoints",
  "ctr",
] as const;

export type StatType = (typeof statTypes)[number];
export type StatsData = Record<(typeof statTypes)[number], number>;
