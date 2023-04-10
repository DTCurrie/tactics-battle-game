import {
  BaseStatsData,
  GrowthStatsData,
  baseStatTypes,
  growthStatTypes,
} from "../stats";

export type Job = Readonly<{
  name: string;
}> & {
  employ: (stats: BaseStatsData) => BaseStatsData;
  unemploy: (stats: BaseStatsData) => BaseStatsData;
  levelUp: (stats: BaseStatsData) => BaseStatsData;
};

export type JobOptions = {
  name: string;
  stats: BaseStatsData;
  growth: GrowthStatsData;
};

export const createJob = ({ name, stats, growth }: JobOptions): Job => {
  const levelUp = (unitStats: BaseStatsData): BaseStatsData => {
    const next: BaseStatsData = { ...unitStats };
    for (const stat of growthStatTypes) {
      let value = next[stat];

      if (Math.random() > 1 - growth[stat]) {
        value++;
      }

      next[stat] = value;
    }

    return next;
  };

  const employ = (unitStats: BaseStatsData) => {
    const next: BaseStatsData = { ...unitStats };

    for (const stat of baseStatTypes) {
      let value = next[stat];
      value += stats[stat];
      next[stat] = value;
    }

    return next;
  };

  const unemploy = (unitStats: BaseStatsData) => {
    const next: BaseStatsData = { ...unitStats };

    for (const stat of baseStatTypes) {
      let value = next[stat];
      value -= stats[stat];
      next[stat] = value;
    }

    return next;
  };

  return {
    name,
    employ,
    unemploy,
    levelUp,
  };
};
