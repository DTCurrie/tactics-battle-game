import { DirectionalLight } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { three, updatesSystem } from "@tactics-battle-game/three-utils";
import { battleStateMachine } from "./battle/state";
import { createInitBattleState } from "./battle/states/init-battle";

const { scene, camera, renderer, play } = three();
const { addUpdate } = updatesSystem();

const light = new DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 0);
light.castShadow = true;
scene.add(light);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

battleStateMachine().transition(createInitBattleState());

addUpdate(() => {
  controls.update();
  camera.updateMatrixWorld();
});

play();
