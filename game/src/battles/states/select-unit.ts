import { BattleContext, BattleState, battleStateMachine } from "@battles";
import { createCommandSelectionState } from "./command-selection";

export const createSelectUnitState = (): BattleState => {
  function changeCurrentUnit({ board, turn }: BattleContext) {
    const position = turn.actor().position();
    turn.round.next();
    board.getTile([position.x, position.z]).setOccupied(true);
    board.moveSelector([position.x, position.z]);
    battleStateMachine().transition(createCommandSelectionState());
  }

  return {
    onEnter: (context) => {
      changeCurrentUnit(context);
      return {};
    },
  };
};
