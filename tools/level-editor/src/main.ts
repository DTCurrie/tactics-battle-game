import { DirectionalLight, Raycaster } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { three, updatesSystem } from "@tactics-battle-game/three-utils";
import { levelEditor } from "./editor";
import { createLevelEditorUi } from "./ui";

const { scene, camera, renderer, play } = three();
const { addUpdate } = updatesSystem();
const editor = levelEditor();
const raycaster = new Raycaster();
const { pointer } = createLevelEditorUi(renderer, editor);

const controls = new OrbitControls(camera(), renderer.domElement);
controls.update();

const light = new DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 0);
light.castShadow = true;
scene.add(light);

addUpdate(() => {
  camera().updateMatrixWorld();
  controls.update();
  raycaster.setFromCamera(pointer, camera());

  const intersects = raycaster.intersectObjects(editor.board.children);
  if (intersects.length) {
    editor.setSelector([
      Math.floor(intersects[0].object.position.x),
      Math.floor(intersects[0].object.position.z),
    ]);
  }
});

play();
