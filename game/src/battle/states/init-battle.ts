import { CapsuleGeometry, Color, Mesh, MeshToonMaterial } from "three";
import {
  Board,
  LevelData,
  SETTINGS,
  createBoard,
  listLevels,
} from "@tactics-battle-game/api";
import { BattleState, battleStateMachine } from "../state";
import { createTurnData, createTurnOrder } from "../turn-order";
import { createSelectUnitState } from "./select-unit";
import { three } from "@tactics-battle-game/three-utils";
import { Unit, createUnit } from "../unit";

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

  const spawnUnits = async () => {
    const levels = await listLevels();
    level = levels.sort(() => 0.5 - Math.random())[0];
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
        stats: {
          speed: Math.floor(Math.random() * (110 - 90) + 90),
          move: 5,
          jump: 3,
        },
      });

      for (const [x, y, z] of level.tileData) {
        const tile = board.getTile([x, z]);
        if (y > 0 && tile && !tile.content()) {
          unit.setPosition(tile.top());
          unit.setTile(tile);
          break;
        }
      }

      board.group.add(unit.mesh);
      units.push(unit);
    }

    scene.background = new Color(0xffffff);
    scene.add(board.group);
    scene.add(board.selector);

    camera.position.y = SETTINGS.board.width / 2;
    camera.position.y = 10;
    camera.position.z = 10;
    camera.lookAt(board.group.position);

    battleStateMachine().transition(createSelectUnitState());
  };

  return {
    onEnter: (context) => {
      spawnUnits();
      return context;
    },
    onExit: () => ({
      units,
      board,
      currentCoordinates: [0, 0],
      turn: {
        ...data,
        round: order.round(units, data),
      },
    }),
  };
};
