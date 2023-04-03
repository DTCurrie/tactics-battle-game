import { expect, test, vi, describe, it, beforeAll, afterAll } from "vitest";
import { logger } from "./logger";

describe("logger", () => {
  const original = { ...console };

  beforeAll(() => {
    console.log = () => ({});
    console.info = () => ({});
    console.warn = () => ({});
    console.error = () => ({});
  });

  afterAll(() => {
    console.log = original.log;
    console.info = original.info;
    console.warn = original.warn;
    console.error = original.error;
  });

  test("logger.log()", () => {
    const { log } = logger("test");
    const spy = vi.spyOn(console, "log");

    log("test message", { isTest: true });

    expect(spy).toHaveBeenCalledWith("[test]: test message", { isTest: true });
  });

  test("logger.logInfo()", () => {
    const { logInfo } = logger("test");
    const spy = vi.spyOn(console, "info");

    logInfo("test message", { isTest: true });

    expect(spy).toHaveBeenCalledWith("[test]: test message", { isTest: true });
  });

  test("logger.logWarning()", () => {
    const { logWarning } = logger("test");
    const spy = vi.spyOn(console, "warn");

    logWarning("test message", { isTest: true });

    expect(spy).toHaveBeenCalledWith("[test]: test message", { isTest: true });
  });

  test("logger.logError()", () => {
    const { logError } = logger("test");
    const spy = vi.spyOn(console, "error");

    logError("test message", { isTest: true });

    expect(spy).toHaveBeenCalledWith("[test]: test message", { isTest: true });
  });

  it("should log once", () => {
    const { log } = logger("test");
    const spy = vi.spyOn(console, "log");

    log("test message", { isTest: true }, true);

    expect(spy).toHaveBeenCalledWith("[test]: test message", { isTest: true });
    expect(spy).toHaveBeenCalledTimes(1);

    log("test message", { isTest: true }, true);

    expect(spy).toHaveBeenCalledWith("[test]: test message", { isTest: true });
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
