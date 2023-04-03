import { DirectionalLight } from "three";
import { three, updatesSystem } from "@tactics-battle-game/three-utils";

const { scene, camera, play } = three();
const { addUpdate } = updatesSystem();

const light = new DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 0);
light.castShadow = true;
scene.add(light);

addUpdate(() => {
  camera.updateMatrixWorld();
});

play();
