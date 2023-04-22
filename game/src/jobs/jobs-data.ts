import { Job, JobOptions, createJob } from ".";

export const jobsData: Readonly<Record<string, JobOptions>> = {
  recruit: {
    name: "Recruit",
    stats: {
      maxHealthPoints: 3,
      maxAbilityPoints: 2,
      attack: 4,
      defense: 5,
      arcana: 2,
      spirit: 5,
      speed: 9,
      evade: 4,
      resist: 5,
      move: 4,
      jump: 2,
    },
    growth: {
      maxHealthPoints: 0.8,
      maxAbilityPoints: 0.095,
      attack: 0.72,
      defense: 0.9,
      arcana: 0.34,
      spirit: 0.83,
      speed: 0.15,
    },
  },
  warrior: {
    name: "Warrior",
    stats: {
      maxHealthPoints: 4,
      maxAbilityPoints: 2,
      attack: 6,
      defense: 9,
      arcana: 2,
      spirit: 6,
      speed: 10,
      evade: 5,
      resist: 5,
      move: 4,
      jump: 1,
    },
    growth: {
      maxHealthPoints: 0.84,
      maxAbilityPoints: 0.08,
      attack: 0.98,
      defense: 0.92,
      arcana: 0.11,
      spirit: 0.78,
      speed: 0.11,
    },
  },
  rogue: {
    name: "Rogue",
    stats: {
      maxHealthPoints: 3,
      maxAbilityPoints: 2,
      attack: 5,
      defense: 6,
      arcana: 5,
      spirit: 6,
      speed: 11,
      evade: 6,
      resist: 5,
      move: 5,
      jump: 3,
    },
    growth: {
      maxHealthPoints: 0.76,
      maxAbilityPoints: 0.11,
      attack: 0.56,
      defense: 0.88,
      arcana: 0.56,
      spirit: 0.88,
      speed: 0.18,
    },
  },
  wizard: {
    name: "Wizard",
    stats: {
      maxHealthPoints: 3,
      maxAbilityPoints: 3,
      attack: 2,
      defense: 6,
      arcana: 6,
      spirit: 9,
      speed: 10,
      evade: 5,
      resist: 5,
      move: 3,
      jump: 2,
    },
    growth: {
      maxHealthPoints: 0.66,
      maxAbilityPoints: 0.22,
      attack: 0.11,
      defense: 0.76,
      arcana: 0.88,
      spirit: 0.92,
      speed: 0.08,
    },
  },
} as const;

export const createRecruit = (): Job => createJob(jobsData.recruit);
export const createWarrior = (): Job => createJob(jobsData.warrior);
export const createRogue = (): Job => createJob(jobsData.rogue);
export const createWizard = (): Job => createJob(jobsData.wizard);

export const jobFactories = {
  recruit: createRecruit,
  warrior: createWarrior,
  rogue: createRogue,
  wizard: createWizard,
};
