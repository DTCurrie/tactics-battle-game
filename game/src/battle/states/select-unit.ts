import { BattleContext, BattleState, battleStateMachine } from "../state";
import { createCommandSelectionState } from "./command-selection";

export const createSelectUnitState = (): BattleState => {
  function changeCurrentUnit(context: BattleContext) {
    context.turn.round?.next();
    context.board.updateSelector(context.turn.actor().tile().position());
    battleStateMachine().transition(createCommandSelectionState());
  }

  return {
    onEnter: (context) => {
      changeCurrentUnit(context);
      return { ...context };
    },
  };
};
