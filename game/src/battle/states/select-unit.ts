import { startCoroutine } from "@tactics-battle-game/api";
import { BattleContext, BattleState } from "../state";

export const createSelectUnitState = (): BattleState => {
  function* changeCurrentUnit(context: BattleContext) {
    context.turn.round?.next();
    context.board.updateSelector(context.turn.data.actor().tile().position());
    yield null;
    console.log("to select command!", {
      actor: context.turn.data.actor().name(),
    });
  }

  return {
    onEnter: (context) => {
      startCoroutine(changeCurrentUnit(context));
      return { ...context };
    },
  };
};
