import { expect, test, describe } from "vitest";
import { BASE_STATS, GROWTH_STATS } from "@units/stats";
import { TEST_BASE_STATS } from "@units/units.test";
import { JOB_FACTORIES } from "./jobs-data";

describe("Job", () => {
  test(".employ()", () => {
    const job = JOB_FACTORIES.recruit();
    const next = job.employ(TEST_BASE_STATS);

    for (const stat of BASE_STATS) {
      expect(next[stat]).toEqual(TEST_BASE_STATS[stat] + job.stats[stat]);
    }
  });

  test(".unemploy()", () => {
    const job = JOB_FACTORIES.recruit();
    let next = job.employ(TEST_BASE_STATS);
    next = job.unemploy(next);

    for (const stat of BASE_STATS) {
      expect(next[stat]).toEqual(TEST_BASE_STATS[stat]);
    }
  });

  test(".levelUp()", () => {
    const job = JOB_FACTORIES.recruit();
    const next = job.levelUp(TEST_BASE_STATS);

    for (const stat of GROWTH_STATS) {
      expect(next[stat]).toBeGreaterThanOrEqual(TEST_BASE_STATS[stat] + 1);
    }

    expect(next.move).toEqual(TEST_BASE_STATS.move);
    expect(next.jump).toEqual(TEST_BASE_STATS.jump);
  });
});
