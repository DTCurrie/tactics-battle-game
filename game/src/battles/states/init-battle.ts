import {
  CapsuleGeometry,
  Color,
  ConeGeometry,
  Mesh,
  MeshToonMaterial,
  Vector2Tuple,
  Vector3,
} from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { uniqueNamesGenerator, Config, names } from "unique-names-generator";

import {
  LevelData,
  createBoard,
  Tile,
  BOARD_WIDTH,
} from "@tactics-battle-game/core";
import { three } from "@tactics-battle-game/three-utils";

import {
  Faction,
  Factions,
  BattleState,
  Actor,
  createEntity,
  createActor,
  createTurn,
  createTurnOrder,
  battleStateMachine,
} from "@battles";

import {
  BODY_SLOT,
  HEAD_SLOT,
  MAIN_HAND_SLOT,
  OFF_HAND_SLOT,
  ARMOR_FACTORIES,
  OFF_HAND_FACTORIES,
  WEAPON_FACTORIES,
} from "@equipment";

import { JOB_FACTORIES } from "@jobs";
import { createUnit } from "@units";

import { createSelectUnitState } from "./select-unit";

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
      return [WEAPON_FACTORIES.dagger(), WEAPON_FACTORIES.dagger()];
    case "warrior":
      return [WEAPON_FACTORIES.sword(), OFF_HAND_FACTORIES.shield()];
    case "wizard":
      return [WEAPON_FACTORIES.staff()];
  }
};

const jobArmor = (job: "rogue" | "warrior" | "wizard") => {
  switch (job) {
    case "rogue":
      return [ARMOR_FACTORIES.tunic(), ARMOR_FACTORIES.cap()];
    case "warrior":
      return [ARMOR_FACTORIES.chainmail(), ARMOR_FACTORIES.helm()];
    case "wizard":
      return [ARMOR_FACTORIES.robe(), ARMOR_FACTORIES.strawHat()];
  }
};

const jobs: Array<"rogue" | "warrior" | "wizard"> = [
  "rogue",
  "warrior",
  "wizard",
];

const good: Faction = {
  name: "Good Guys",
  members: [],
  allyFactions: [],
  isPlayer: true,
};

const evil: Faction = { name: "Bad Guys", members: [], allyFactions: [] };

const factions: Factions = {
  good,
  evil,
};

// END DEBUG

const { scene, camera } = three();

const nameConfig: Config = {
  dictionaries: [names],
};

export const createInitBattleState = (
  selectorGltf: GLTF,
  levels: LevelData[]
): BattleState => {
  const initializeBoard = () => {
    const level = levels.sort(() => 0.5 - Math.random())[0];
    const board = createBoard(level, selectorGltf.scene);
    const actors: Actor[] = [];

    for (const job of jobs) {
      const mesh = new Mesh(
        new CapsuleGeometry(0.25, 1),
        new MeshToonMaterial({ color: jobColor(job) })
      );
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      const pointer = new Mesh(
        new ConeGeometry(0.25, 0.25),
        new MeshToonMaterial({ color: jobColor(job) })
      );

      mesh.add(pointer);
      pointer.position.y = 0.5;
      pointer.position.z = 0.25;
      pointer.rotation.setFromVector3(new Vector3(-5, 0, 0));
      const unit = createUnit({
        name: uniqueNamesGenerator(nameConfig),
        job: JOB_FACTORIES[job](),
      });

      const weapons = jobWeapons(job);
      for (let i = 0; i < weapons.length; i++) {
        const weapon = weapons[i];
        unit.equip(weapon, i === 0 ? MAIN_HAND_SLOT : OFF_HAND_SLOT);
      }

      const armors = jobArmor(job);
      for (let i = 0; i < armors.length; i++) {
        const armor = armors[i];
        unit.equip(armor, i === 0 ? BODY_SLOT : HEAD_SLOT);
      }

      let tile: Tile | undefined = undefined;
      for (const [x, y, z] of level.tileData) {
        const candidate = board.getTile([x, z]);
        if (y > 0 && candidate && !candidate.occupied()) {
          tile = candidate;
          break;
        }
      }

      if (tile === undefined) {
        throw new Error("No valid candidates for the actor's tile");
      }

      const piece = createEntity({ mesh });
      piece.setPosition(tile.top());
      tile.setOccupied(true);

      const actor = createActor({
        unit,
        piece,
      });

      good.members.push(actor);
      board.group.add(actor.object3d);
      actors.push(actor);
    }

    scene.background = new Color(0xffffff);
    scene.add(board.group);
    scene.add(board.selector);

    camera().position.y = BOARD_WIDTH / 2;
    camera().position.y = 10;
    camera().position.z = 10;
    camera().lookAt(board.group.position);

    const turn = createTurn(board, actors[0]);
    const round = createTurnOrder().round(actors, turn);

    battleStateMachine().transition(createSelectUnitState());

    return {
      board,
      actors,
      currentCoordinates: [0, 0] as Vector2Tuple,
      factions,
      turn: { ...turn, round },
      getActorAtPosition: (position: Vector2Tuple) =>
        actors.find((actor) => {
          const actorPosition = actor.position();
          return (
            position[0] === actorPosition.x && position[1] === actorPosition.z
          );
        }),
    };
  };

  return {
    onEnter: () => ({ ...initializeBoard() }),
  };
};
