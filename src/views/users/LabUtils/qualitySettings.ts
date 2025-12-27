/**
 * Quality presets for rendering optimization
 * Balances visual fidelity with performance across devices
 */

import * as THREE from "three";

export type QualityLevel = "low" | "medium" | "high" | "ultra";

export interface QualityPreset {
  // Shadow settings
  shadowMapSize: number;
  shadowType: "basic" | "pcf" | "pcfSoft" | "vsm";
  shadowBias: number;
  shadowNormalBias: number;
  
  // Rendering settings
  antialias: boolean;
  pixelRatio: number;
  toneMapping: boolean;
  toneMappingExposure: number;
  
  // Post-processing
  postProcessing: boolean;
  bloom: boolean;
  ssao: boolean;
  dof: boolean;
  
  // Performance
  maxLights: number;
  envMapIntensity: number;
  textureAnisotropy: number;
  
  // LOD settings
  lodDistances: [number, number, number];
}

export const QUALITY_PRESETS: Record<QualityLevel, QualityPreset> = {
  low: {
    shadowMapSize: 512,
    shadowType: "basic",
    shadowBias: -0.001,
    shadowNormalBias: 0.05,
    antialias: false,
    pixelRatio: 1,
    toneMapping: false,
    toneMappingExposure: 1,
    postProcessing: false,
    bloom: false,
    ssao: false,
    dof: false,
    maxLights: 2,
    envMapIntensity: 0.3,
    textureAnisotropy: 1,
    lodDistances: [0, 5, 10],
  },
  medium: {
    shadowMapSize: 1024,
    shadowType: "pcf",
    shadowBias: -0.0005,
    shadowNormalBias: 0.03,
    antialias: true,
    pixelRatio: Math.min(window.devicePixelRatio, 1.5),
    toneMapping: true,
    toneMappingExposure: 1,
    postProcessing: true,
    bloom: true,
    ssao: false,
    dof: false,
    maxLights: 4,
    envMapIntensity: 0.6,
    textureAnisotropy: 4,
    lodDistances: [0, 10, 20],
  },
  high: {
    shadowMapSize: 2048,
    shadowType: "pcfSoft",
    shadowBias: -0.0001,
    shadowNormalBias: 0.02,
    antialias: true,
    pixelRatio: Math.min(window.devicePixelRatio, 2),
    toneMapping: true,
    toneMappingExposure: 1.2,
    postProcessing: true,
    bloom: true,
    ssao: true,
    dof: false,
    maxLights: 8,
    envMapIntensity: 1.0,
    textureAnisotropy: 8,
    lodDistances: [0, 15, 30],
  },
  ultra: {
    shadowMapSize: 4096,
    shadowType: "pcfSoft",
    shadowBias: -0.00005,
    shadowNormalBias: 0.01,
    antialias: true,
    pixelRatio: Math.min(window.devicePixelRatio, 2),
    toneMapping: true,
    toneMappingExposure: 1.2,
    postProcessing: true,
    bloom: true,
    ssao: true,
    dof: true,
    maxLights: 16,
    envMapIntensity: 1.2,
    textureAnisotropy: 16,
    lodDistances: [0, 20, 40],
  },
};

export const getShadowMapType = (shadowType: QualityPreset["shadowType"]) => {
  switch (shadowType) {
    case "basic":
      return THREE.BasicShadowMap;
    case "pcf":
      return THREE.PCFShadowMap;
    case "pcfSoft":
      return THREE.PCFSoftShadowMap;
    case "vsm":
      return THREE.VSMShadowMap;
    default:
      return THREE.PCFShadowMap;
  }
};

export const getQualityPreset = (level: QualityLevel): QualityPreset => {
  return QUALITY_PRESETS[level];
};
