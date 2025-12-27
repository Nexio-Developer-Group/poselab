import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

export interface RenderSettings {
  width: number;
  height: number;
  transparentBackground?: boolean;
  quality?: number; // 1 = low, 2 = medium, 3 = high, 4 = ultra
  enablePostFX?: boolean;
  bloom?: boolean;
  ao?: boolean;
}

export const createHighQualityRender = async (
  scene: THREE.Scene,
  camera: THREE.Camera,
  settings: RenderSettings,
  onProgress?: (progress: number) => void
): Promise<{ blob: Blob; previewUrl: string }> => {
  const {
    width,
    height,
    transparentBackground = false,
    quality = 3,
    enablePostFX = true,
    bloom = true,
    ao = true,
  } = settings;

  onProgress?.(5);

  // ---- Renderer Setup ----
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: transparentBackground,
    preserveDrawingBuffer: true,
    powerPreference: "high-performance",
  });

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality));

  // Physically correct setup
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  if (transparentBackground) {
    renderer.setClearColor(0x000000, 0);
  } else {
    renderer.setClearColor(0x000000, 1);
  }

  onProgress?.(20);

  // ---- Clone camera safely ----
  const renderCamera = camera.clone();
  if (renderCamera instanceof THREE.PerspectiveCamera) {
    renderCamera.aspect = width / height;
    renderCamera.updateProjectionMatrix();
  }

  // ---- Composer Setup ----
  let composer: EffectComposer | null = null;

  if (enablePostFX) {
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, renderCamera));

    if (bloom) {
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(width, height),
        0.5 * quality, // intensity
        0.4, // radius
        1.4 // threshold
      );
      composer.addPass(bloomPass);
    }

    if (ao) {
      const ssaoPass = new SSAOPass(scene, renderCamera, width, height);
      ssaoPass.kernelRadius = 8;
      ssaoPass.minDistance = 0.002;
      ssaoPass.maxDistance = 0.1;
      ssaoPass.output = 0;
      composer.addPass(ssaoPass);
    }

    composer.addPass(new OutputPass());
  }

  onProgress?.(60);

  // ---- Render Pass ----
  if (composer) {
    composer.render();
  } else {
    renderer.render(scene, renderCamera);
  }

  onProgress?.(80);

  // ---- Capture the Render ----
  const canvas = renderer.domElement;
  const previewUrl = canvas.toDataURL("image/png", 1.0);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Failed to create blob"))),
      "image/png",
      1.0
    );
  });

  onProgress?.(100);

  // ---- Cleanup ----
  composer?.dispose();
  renderer.dispose();

  return { blob, previewUrl };
};

// ---- Utility to download ----
export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
