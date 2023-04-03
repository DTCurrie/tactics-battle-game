import {
  BoxGeometry,
  DirectionalLight,
  Group,
  Mesh,
  MeshBasicMaterial,
  Raycaster,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { SETTINGS } from "@tactics-battle-game/api";
import { three, updatesSystem } from "@tactics-battle-game/three-utils";
import { levelEditor } from "./editor";
import { createLevelEditorUi } from "./ui";

const { scene, camera, renderer, play } = three();
const { addUpdate } = updatesSystem();
const editor = levelEditor();
const raycaster = new Raycaster();
const { pointer } = createLevelEditorUi(renderer, editor);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

const light = new DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 0);
light.castShadow = true;
scene.add(light);

const board = new Group();
for (let x = 0; x < SETTINGS.board.width; x++) {
  for (let y = 0; y < SETTINGS.board.depth; y++) {
    const tile = new Mesh(
      new BoxGeometry(0.9, SETTINGS.stepHeight, 0.9),
      new MeshBasicMaterial({ color: "gray", opacity: 0.25, transparent: true })
    );
    tile.position.set(x, 0, y);
    board.add(tile);
  }
}

board.position.set(0, -SETTINGS.stepHeight / 2, 0);
scene.add(board);
camera.lookAt(board.position);

addUpdate(() => {
  camera.updateMatrixWorld();
  controls.update();
  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObjects(board.children);
  for (const intersect of intersects) {
    editor.updateSelector([
      Math.floor(intersect.object.position.x),
      Math.floor(intersect.object.position.z),
    ]);
  }
});

play();
