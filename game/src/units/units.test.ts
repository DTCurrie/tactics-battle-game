import { describe, expect, test } from "vitest";
import { BaseStatsData } from "./stats";

export const TEST_BASE_STATS: Readonly<BaseStatsData> = {
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
} as const;

describe("Unit", () => {
  test("placeholder", () => expect(true).toBeTruthy());
});
