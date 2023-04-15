export type StateMachine<Context> = {
  transition: (next: State<Context>) => void;
};

export type State<Context = unknown> = {
  onEnter?: (context: Context, previous?: State<Context>) => Context;
  onExit?: (context: Context, next: State<Context>) => Context;
};

export const createStateMachine = <Context>(
  initialContext?: Context
): StateMachine<Context> => {
  let context: Context = {
    ...initialContext,
  } as Context;

  let state: { previous?: State<Context>; current?: State<Context> } = {};

  const transition = (next: State<Context>) => {
    context = { ...(state.current?.onExit?.(context, next) ?? context) };
    state = { previous: state.current, current: next };
    setTimeout(
      () =>
        (context = {
          ...(next.onEnter?.(context, state.previous) ?? context),
        }),
      0
    );
  };

  return {
    transition,
  };
};
