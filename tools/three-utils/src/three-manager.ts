import {
  ACESFilmicToneMapping,
  Clock,
  ColorManagement,
  OrthographicCamera,
  PCFSoftShadowMap,
  Scene,
  WebGLRenderer,
  sRGBEncoding,
} from "three";
import { updatesSystem } from "./updates-system";
import { resizeToDisplay } from "./renderer";

ColorManagement.enabled = true;

type ThreeInstance = {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: OrthographicCamera;
  setCamera: (next: OrthographicCamera) => void;
  play: () => void;
  pause: () => void;
  deltaTime: () => number;
};

const createThreeManager = (): ThreeInstance => {
  const renderer = new WebGLRenderer({
    canvas: document.querySelector<HTMLCanvasElement>("#canvas") ?? undefined,
    powerPreference: "high-performance",
  });

  const scene = new Scene();
  const clock = new Clock();
  let camera = new OrthographicCamera();
  let deltaTime = 0;

  const loop = () => {
    deltaTime = clock.getDelta();
    resizeToDisplay(camera, renderer);
    updatesSystem().update();
    renderer.render(scene, camera);
    updatesSystem().postUpdate();
  };

  const setCamera = (next: OrthographicCamera) => {
    camera = next;
  };

  const play = () => {
    renderer.setAnimationLoop(loop);
    clock.start();
  };

  const pause = () => {
    renderer.setAnimationLoop(null);
    clock.stop();
  };

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
    deltaTime: () => deltaTime,
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
