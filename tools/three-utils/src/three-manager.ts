import {
  ACESFilmicToneMapping,
  ColorManagement,
  OrthographicCamera,
  PCFSoftShadowMap,
  Scene,
  WebGLRenderer,
  sRGBEncoding,
} from "three";
import { update as updateTweens } from "@tweenjs/tween.js";
import { updatesSystem } from "./updates-system";
import { resizeToDisplay } from "./renderer";

ColorManagement.enabled = true;

const { update, postUpdate } = updatesSystem();

type ThreeInstance = {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: OrthographicCamera;
  setCamera: (next: OrthographicCamera) => void;
  play: () => void;
  pause: () => void;
};

const createThreeManager = (): ThreeInstance => {
  const renderer = new WebGLRenderer({
    canvas: document.querySelector<HTMLCanvasElement>("#canvas") ?? undefined,
    powerPreference: "high-performance",
  });

  const scene = new Scene();
  let camera = new OrthographicCamera();

  const loop = () => {
    resizeToDisplay(camera, renderer);
    update();
    updateTweens();
    renderer.render(scene, camera);
    postUpdate();
  };

  const setCamera = (next: OrthographicCamera) => {
    camera = next;
  };

  const play = () => renderer.setAnimationLoop(loop);
  const pause = () => renderer.setAnimationLoop(null);

  renderer.useLegacyLights = false;
  renderer.debug.checkShaderErrors = true;
  renderer.xr.enabled = false;
  renderer.outputEncoding = sRGBEncoding;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  scene.add(camera);

  return {
    renderer,
    scene,
    camera,
    setCamera,
    play,
    pause,
  };
};

let instance: ThreeInstance | null = null;

export const three = () => {
  if (instance !== null) {
    return instance;
  }

  instance = createThreeManager();

  return instance;
};
