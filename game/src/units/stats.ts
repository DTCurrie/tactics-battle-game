export const MAX_HP = "maxHealthPoints" as const;
export const MAX_AP = "maxAbilityPoints" as const;
export const ATTACK = "attack" as const;
export const DEFENSE = "defense" as const;
export const ARCANA = "arcana" as const;
export const SPIRIT = "spirit" as const;
export const ACCURACY = "accuracy" as const;
export const SPEED = "speed" as const;
export const EVADE = "evade" as const;
export const RESIST = "resist" as const;

export const GROWTH_STATS = [
  MAX_HP,
  MAX_AP,
  ATTACK,
  DEFENSE,
  ARCANA,
  SPIRIT,
  ACCURACY,
  SPEED,
  EVADE,
  RESIST,
] as const;

export const MOVE = "move" as const;
export const JUMP = "jump" as const;

export const LEVEL = "level" as const;
export const EXPERIENCE = "experience" as const;

export const RANK_STATS = [LEVEL, EXPERIENCE] as const;
export const BASE_STATS = [...GROWTH_STATS, MOVE, JUMP] as const;
export const STATS = [...RANK_STATS, ...BASE_STATS] as const;

export const CURRENT_HP = "currentHealthPoints" as const;
export const CURRENT_AP = "currentAbilityPoints" as const;
export const TURN_COUNTER = "turnCounter" as const;

export const VARIABLE_STATS = [CURRENT_HP, CURRENT_AP, TURN_COUNTER] as const;

export type GrowthStatType = (typeof GROWTH_STATS)[number];
export type GrowthStatsData = Record<GrowthStatType, number>;

export type RankStatType = (typeof RANK_STATS)[number];
export type RankStatsData = Record<RankStatType, number>;

export type BaseStatType = (typeof BASE_STATS)[number];
export type BaseStatsData = Record<BaseStatType, number>;

export type StatType = (typeof STATS)[number];
export type StatsData = Record<StatType, number>;

export type VariableStatType = (typeof VARIABLE_STATS)[number];
export type VariableStatsData = Record<VariableStatType, number>;
