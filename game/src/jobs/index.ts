import {
  BaseStatsData,
  GrowthStatsData,
  BASE_STATS,
  GROWTH_STATS,
} from "../units";

export type Job = Readonly<{
  name: string;
  stats: Readonly<BaseStatsData>;
  growth: Readonly<GrowthStatsData>;
}> & {
  employ: (stats: BaseStatsData) => BaseStatsData;
  unemploy: (stats: BaseStatsData) => BaseStatsData;
  levelUp: (stats: BaseStatsData) => BaseStatsData;

  debug: () => string;
};

export type JobOptions = Pick<Job, "name" | "stats" | "growth">;

export const createJob = ({ name, stats, growth }: JobOptions): Job => {
  const levelUp = (unitStats: BaseStatsData): BaseStatsData => {
    const next: BaseStatsData = { ...unitStats };
    for (const stat of GROWTH_STATS) {
      let value = next[stat] + 1;

      if (Math.random() > 1 - growth[stat]) {
        value++;
      }

      next[stat] = value;
    }

    return next;
  };

  const employ = (unitStats: BaseStatsData) => {
    const next: BaseStatsData = { ...unitStats };

    for (const stat of BASE_STATS) {
      let value = next[stat];
      value += stats[stat];
      next[stat] = value;
    }

    return next;
  };

  const unemploy = (unitStats: BaseStatsData) => {
    const next: BaseStatsData = { ...unitStats };

    for (const stat of BASE_STATS) {
      let value = next[stat];
      value -= stats[stat];
      next[stat] = value;
    }

    return next;
  };

  return {
    name,
    stats,
    growth,
    employ,
    unemploy,
    levelUp,

    debug: () =>
      JSON.stringify(
        {
          name,
          stats,
          growth,
        },
        undefined,
        2
      ),
  };
};

export * from "./jobs-data";
