import { UpdateHandler, updatesSystem } from "@tactics-battle-game/three-utils";

export interface State<Context> {
  onEnter?: (previous: State<Context>) => Context;
  onUpdate?: UpdateHandler;
  onPostUpdate?: UpdateHandler;
  onExit?: (next: State<Context>) => Context;
}

const { addUpdate, addPostUpdate, removeUpdate, removePostUpdate } =
  updatesSystem();

export const createStateMachine = <Context>(
  initialState: State<Context>,
  initialContext: Context
) => {
  let state: { previous: State<Context>; current: State<Context> } = {
    previous: initialState,
    current: initialState,
  };

  let context: Context = {
    ...initialContext,
  };

  const transition = (next: State<Context>) => {
    if (state.current.onUpdate) {
      removeUpdate(state.current.onUpdate);
    }

    if (state.current.onPostUpdate) {
      removePostUpdate(state.current.onPostUpdate);
    }

    context = state.current.onExit?.(next) ?? context;
    state = { previous: state.current, current: next };
    context = state.current.onEnter?.(state.previous) ?? context;

    if (state.current.onUpdate) {
      addUpdate(state.current.onUpdate);
    }

    if (state.current.onPostUpdate) {
      addPostUpdate(state.current.onPostUpdate);
    }
  };

  return {
    state,
    context,
    transition,
  };
};
