export const growthStatTypes = [
  "maxHealthPoints",
  "maxAbilityPoints",
  "attack",
  "defense",
  "arcana",
  "spirit",
  "accuracy",
  "speed",
] as const;

export type GrowthStatType = (typeof growthStatTypes)[number];
export type GrowthStatsData = Record<GrowthStatType, number>;

export const experienceStatTypes = ["level", "experience"] as const;

export type ExperienceStatType = (typeof experienceStatTypes)[number];
export type ExperienceStatsData = Record<ExperienceStatType, number>;

export const baseStatTypes = [
  ...growthStatTypes,
  "evade",
  "resist",
  "move",
  "jump",
] as const;

export type BaseStatType = (typeof baseStatTypes)[number];
export type BaseStatsData = Record<BaseStatType, number>;

export const statTypes = [...experienceStatTypes, ...baseStatTypes] as const;

export type StatType = (typeof statTypes)[number];
export type StatsData = Record<StatType, number>;

export const variableStatTypes = [
  "currentHealthPoints",
  "currentAbilityPoints",
  "turnCounter",
] as const;

export type VariableStatType = (typeof variableStatTypes)[number];
export type VariableStatsData = Record<VariableStatType, number>;
