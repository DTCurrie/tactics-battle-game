import { DirectionalLight } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { listLevels } from "@tactics-battle-game/core";
import {
  three,
  updatesSystem,
  gltfLoader,
} from "@tactics-battle-game/three-utils";

import { battleStateMachine } from "@battles";
import { createInitBattleState } from "@battles/states/init-battle";
import { logger } from "@lib/logger";

const { scene, camera, renderer, play } = three();
const { addUpdate } = updatesSystem();
const { logInfo, logError } = logger("main");

camera().layers.enable(0);
camera().layers.enable(1);

const light = new DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 0);
light.castShadow = true;
light.layers.enable(0);
light.layers.enable(1);
scene.add(light);

const controls = new OrbitControls(camera(), renderer.domElement);
controls.update();

addUpdate(() => {
  controls.update();
  camera().updateMatrixWorld();
});

gltfLoader().load(
  "models/selector.glb",
  async (gltf) => {
    const levels = await listLevels();
    battleStateMachine().transition(createInitBattleState(gltf, levels));
    play();
  },
  (xhr) => {
    logInfo("loader progress", (xhr.loaded / xhr.total) * 100 + "%");
  },
  (error) => {
    logError("An error happened", error);
  }
);
