import { CapsuleGeometry, Color, Mesh, MeshToonMaterial } from "three";
import {} from "@tactics-battle-game/api/src/unit";
import {
  Board,
  LevelData,
  SETTINGS,
  Unit,
  createBoard,
  createUnit,
  listLevels,
  startAsyncCoroutine,
} from "@tactics-battle-game/api";
import { BattleState, battleStateMachine } from "../state";
import { createTurnData, createTurnOrder } from "../turn-order";
import { createSelectUnitState } from "./select-unit";
import { three } from "@tactics-battle-game/three-utils";

const jobColor = (job: "rogue" | "warrior" | "wizard") => {
  switch (job) {
    case "rogue":
      return new Color("red");
    case "warrior":
      return new Color("yellow");
    case "wizard":
      return new Color("blue");
  }
};

const jobs: Array<"rogue" | "warrior" | "wizard"> = [
  "rogue",
  "warrior",
  "wizard",
];

const { scene, camera } = three();

export const createInitBattleState = (): BattleState => {
  const units: Unit[] = [];
  const data = createTurnData();
  const order = createTurnOrder();
  let level: LevelData;
  let board: Board;

  async function* spawnUnits() {
    const levels = await listLevels();
    level = levels[0];
    board = createBoard(level);

    for (const job of jobs) {
      const mesh = new Mesh(
        new CapsuleGeometry(0.25, 1),
        new MeshToonMaterial({ color: jobColor(job) })
      );
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      const unit = createUnit({
        name: job,
        mesh,
        stats: { spd: Math.floor(Math.random() * 3 + 1) },
      });

      for (const [x, y, z] of level.tileData) {
        const tile = board.getTile([x, z]);
        if (y > 0 && tile && !tile.content()) {
          unit.setTile(tile);
          break;
        }
      }

      units.push(unit);
    }

    scene.background = new Color(0xffffff);
    scene.add(board.group);
    scene.add(board.selector);

    camera.position.y = SETTINGS.board.width / 2;
    camera.position.y = 10;
    camera.position.z = 10;
    camera.lookAt(board.group.position);

    yield null;

    battleStateMachine().transition(createSelectUnitState());
  }

  return {
    onEnter: (context) => {
      startAsyncCoroutine(spawnUnits());
      return context;
    },
    onExit: () => ({
      units,
      board,
      currentCoordinates: [0, 0],
      turn: {
        data: data,
        order: order,
        round: order.round(units, data),
      },
    }),
  };
};
