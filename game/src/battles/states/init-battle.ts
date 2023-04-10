import { CapsuleGeometry, Color, Mesh, MeshToonMaterial } from "three";
import {
  Board,
  LevelData,
  settings,
  createBoard,
  listLevels,
  Tile,
} from "@tactics-battle-game/api";
import { three } from "@tactics-battle-game/three-utils";
import { BattleState, battleStateMachine } from "../battle-state-machine";
import { createTurn, createTurnOrder } from "../turn-order";
import { createSelectUnitState } from "./select-unit";
import { Actor, createActor } from "../actor";
import { createPiece } from "../piece";
import { createUnit } from "../../units/unit";
import { jobFactories } from "../../units/jobs/jobs-data";
import {
  createCap,
  createChainmail,
  createDagger,
  createHelm,
  createLeatherTunic,
  createRobe,
  createShield,
  createStaff,
  createStrawHat,
  createSword,
} from "../../units/equipment/equipment-data";

// DEBUG

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

const jobWeapons = (job: "rogue" | "warrior" | "wizard") => {
  switch (job) {
    case "rogue":
      return [createDagger(), createDagger()];
    case "warrior":
      return [createSword(), createShield()];
    case "wizard":
      return [createStaff()];
  }
};

const jobArmor = (job: "rogue" | "warrior" | "wizard") => {
  switch (job) {
    case "rogue":
      return [createLeatherTunic(), createCap()];
    case "warrior":
      return [createChainmail(), createHelm()];
    case "wizard":
      return [createRobe(), createStrawHat()];
  }
};

const jobs: Array<"rogue" | "warrior" | "wizard"> = [
  "rogue",
  "warrior",
  "wizard",
];

// END DEBUG

const { scene, camera } = three();

export const createInitBattleState = (): BattleState => {
  const actors: Actor[] = [];
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
        job: jobFactories[job](),
      });

      const weapons = jobWeapons(job);
      for (let i = 0; i < weapons.length; i++) {
        const weapon = weapons[i];
        unit.equip(weapon, i === 0 ? "mainHand" : "offHand");
      }

      const armors = jobArmor(job);
      for (let i = 0; i < armors.length; i++) {
        const armor = armors[i];
        unit.equip(armor, i === 0 ? "body" : "head");
      }

      let tile: Tile | undefined = undefined;
      for (const [x, y, z] of level.tileData) {
        const candidate = board.getTile([x, z]);
        if (y > 0 && candidate && !candidate.content()) {
          tile = candidate;
          break;
        }
      }

      if (tile === undefined) {
        throw new Error("No valid candidates for the actor's tile");
      }

      const piece = createPiece({ mesh, tile });
      piece.setPosition(tile.top());
      piece.setTile(tile);
      tile.setContent(piece);

      const actor = createActor({
        unit,
        piece,
      });

      board.group.add(actor.mesh.get());
      actors.push(actor);
    }

    scene.background = new Color(0xffffff);
    scene.add(board.group);
    scene.add(board.selector);

    camera().position.y = settings.board.width / 2;
    camera().position.y = 10;
    camera().position.z = 10;
    camera().lookAt(board.group.position);

    battleStateMachine().transition(createSelectUnitState());
  };

  return {
    onEnter: (context) => {
      spawnUnits();

      return {
        ...context,
      };
    },
    onExit: (context) => {
      const turn = createTurn(actors[0]);
      const round = createTurnOrder().round(actors, turn);
      return {
        ...context,
        actors: actors,
        board,
        currentCoordinates: [0, 0],
        turn: { ...turn, round },
      };
    },
  };
};
