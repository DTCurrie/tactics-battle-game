import {
  BattleContext,
  BattleState,
  battleStateMachine,
} from "../battle-state-machine";
import { createCommandSelectionState } from "./command-selection";

export const createSelectUnitState = (): BattleState => {
  function changeCurrentUnit(context: BattleContext) {
    context.turn.round.next();
    context.board.moveSelector(context.turn.actor.get().tile.get().position());
    battleStateMachine().transition(createCommandSelectionState());
  }

  return {
    onEnter: (context) => {
      changeCurrentUnit(context);
      return { ...context };
    },
  };
};
