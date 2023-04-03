import { expect, test, vi, describe } from "vitest";
import { messenger } from "./messenger";

describe("messenger", () => {
  test("messenger.addObserver()", () => {
    const { addObserver, removeObserver, postMessage } = messenger();

    const target = {
      toSpy: () => ({}),
    };

    const spy = vi.spyOn(target, "toSpy");
    const handler = () => target.toSpy();

    addObserver("test", handler);
    postMessage("test");

    expect(spy).toHaveBeenCalled();

    removeObserver("test", handler);
  });

  test("messenger.removeObserver()", () => {
    const { addObserver, removeObserver, postMessage } = messenger();

    const target = {
      toSpy: () => ({}),
    };

    const spy = vi.spyOn(target, "toSpy");
    const handler = () => target.toSpy();

    addObserver("test", handler);
    postMessage("test");

    expect(spy).toHaveBeenCalledTimes(1);

    removeObserver("test", handler);
    postMessage("test");

    expect(spy).toHaveBeenCalledTimes(1);
  });

  test("messenger.clean()", () => {
    const sender = "test-sender";
    const { tables, addObserver, removeObserver, clean } = messenger();

    const handler = () => ({});

    addObserver("test-a", handler, sender);
    addObserver("test-b", handler, sender);

    expect(tables["test-a"][sender].length).toEqual(1);
    expect(tables["test-b"][sender].length).toEqual(1);

    removeObserver("test-a", handler, sender);

    expect(tables["test-a"][sender].length).toEqual(0);
    expect(tables["test-b"][sender].length).toEqual(1);

    clean();

    expect(tables["test-a"]).toBeUndefined();
    expect(tables["test-b"][sender].length).toEqual(1);
  });

  test("performance", () => {
    const { addObserver, removeObserver, postMessage, clean } = messenger();
    const testMessage = "test";
    const clearMessage = "clear";
    const start = "start";
    const finish = "finish";

    const testListener = () => {
      const sender = (Math.random() + 1).toString(36).substring(7);

      const onTest = () => postMessage(clearMessage, sender);
      const onClear = () => removeObserver(testMessage, onTest);

      const addObservers = () => {
        addObserver(testMessage, onTest, sender);
        addObserver(clearMessage, onClear, sender);
      };

      const removeObservers = () => {
        removeObserver(testMessage, onTest, sender);
        removeObserver(clearMessage, onClear, sender);
      };

      return {
        sender,
        addObservers,
        removeObservers,
      };
    };

    performance.mark(start);

    const listeners = [];
    for (let i = 0; i < 10000; i++) {
      const listener = testListener();
      listener.addObservers();
      listeners.push(listener);
    }

    postMessage(testMessage);

    for (const listener of listeners) {
      listener.removeObservers();
    }

    clean();

    performance.mark(finish);

    const measure = performance.measure(
      "measure start to finish",
      start,
      finish
    );

    console.log(
      "messenger performance",
      performance.getEntriesByType("measure")
    );

    expect(measure.duration).toBeLessThan(100);

    performance.clearMarks();
    performance.clearMeasures();
  });
});
