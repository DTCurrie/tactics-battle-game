import { expect, test, describe } from "vitest";
import { createStateMachine } from "./state-machine";

describe("state-machine", () => {
  type TestContext = {
    count: number;
    finished: boolean;
  };

  test(".transition()", () => {
    const stateMachine = createStateMachine<TestContext>({
      count: 0,
      finished: false,
    });

    stateMachine.transition({
      onEnter: (context) => ({
        ...context,
        count: context.count + 1,
      }),
    });

    expect(stateMachine.context().count).toEqual(1);

    stateMachine.transition({
      onExit: (context) => ({
        ...context,
        count: context.count + 1,
      }),
    });

    stateMachine.transition({
      onEnter: (context) => ({
        ...context,
        finished: true,
      }),
    });

    expect(stateMachine.context().count).toEqual(2);
    expect(stateMachine.context().finished).toEqual(true);
  });
});
