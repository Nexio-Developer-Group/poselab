import * as THREE from "three";
import { QualityPreset } from "./qualitySettings";

/**
 * Enhanced PBR material utilities
 * Applies physically-based rendering principles for realistic materials
 */

export interface PBRMaterialOptions {
  albedoMap?: THREE.Texture;
  normalMap?: THREE.Texture;
  roughnessMap?: THREE.Texture;
  metalnessMap?: THREE.Texture;
  aoMap?: THREE.Texture;
  emissiveMap?: THREE.Texture;
  
  color?: THREE.ColorRepresentation;
  roughness?: number;
  metalness?: number;
  emissive?: THREE.ColorRepresentation;
  emissiveIntensity?: number;
  
  envMap?: THREE.Texture;
  envMapIntensity?: number;
  
  qualityPreset?: QualityPreset;
}

/**
 * Creates an enhanced PBR material with optimized settings
 */
export const createPBRMaterial = (options: PBRMaterialOptions): THREE.MeshStandardMaterial => {
  const {
    albedoMap,
    normalMap,
    roughnessMap,
    metalnessMap,
    aoMap,
    emissiveMap,
    color = 0xffffff,
    roughness = 0.5,
    metalness = 0.0,
    emissive = 0x000000,
    emissiveIntensity = 1,
    envMap,
    envMapIntensity = 1,
    qualityPreset,
  } = options;
  
  const material = new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness,
    emissive,
    emissiveIntensity,
  });
  
  // Texture assignments
  if (albedoMap) {
    material.map = albedoMap;
    optimizeTexture(albedoMap, qualityPreset);
  }
  
  if (normalMap) {
    material.normalMap = normalMap;
    material.normalScale = new THREE.Vector2(1, 1);
    optimizeTexture(normalMap, qualityPreset);
  }
  
  if (roughnessMap) {
    material.roughnessMap = roughnessMap;
    optimizeTexture(roughnessMap, qualityPreset);
  }
  
  if (metalnessMap) {
    material.metalnessMap = metalnessMap;
    optimizeTexture(metalnessMap, qualityPreset);
  }
  
  if (aoMap) {
    material.aoMap = aoMap;
    material.aoMapIntensity = 1.0;
    optimizeTexture(aoMap, qualityPreset);
  }
  
  if (emissiveMap) {
    material.emissiveMap = emissiveMap;
    optimizeTexture(emissiveMap, qualityPreset);
  }
  
  if (envMap) {
    material.envMap = envMap;
    material.envMapIntensity = envMapIntensity;
  }
  
  return material;
};

/**
 * Optimizes texture settings based on quality preset
 */
export const optimizeTexture = (texture: THREE.Texture, qualityPreset?: QualityPreset) => {
  // Enable mipmaps for better quality at distance
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  
  // Anisotropic filtering for better quality at angles
  if (qualityPreset) {
    texture.anisotropy = qualityPreset.textureAnisotropy;
  }
  
  // Proper wrapping
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  
  texture.needsUpdate = true;
};

/**
 * Enhances existing materials in a scene with PBR settings
 */
export const enhanceSceneMaterials = (
  scene: THREE.Scene,
  envMap?: THREE.Texture,
  qualityPreset?: QualityPreset
) => {
  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      const material = mesh.material;
      
      if (Array.isArray(material)) {
        material.forEach((mat) => enhanceMaterial(mat, envMap, qualityPreset));
      } else {
        enhanceMaterial(material, envMap, qualityPreset);
      }
    }
  });
};

/**
 * Enhances a single material with PBR features
 */
const enhanceMaterial = (
  material: THREE.Material,
  envMap?: THREE.Texture,
  qualityPreset?: QualityPreset
) => {
  if (material instanceof THREE.MeshStandardMaterial) {
    // Apply environment map for reflections
    if (envMap) {
      material.envMap = envMap;
      material.envMapIntensity = qualityPreset?.envMapIntensity || 1.0;
    }
    
    // Optimize existing textures
    if (material.map) optimizeTexture(material.map, qualityPreset);
    if (material.normalMap) optimizeTexture(material.normalMap, qualityPreset);
    if (material.roughnessMap) optimizeTexture(material.roughnessMap, qualityPreset);
    if (material.metalnessMap) optimizeTexture(material.metalnessMap, qualityPreset);
    if (material.aoMap) optimizeTexture(material.aoMap, qualityPreset);
    
    material.needsUpdate = true;
  }
};

/**
 * Creates a ground plane with realistic PBR material
 */
export const createGroundPlane = (
  size: number = 50,
  color: THREE.ColorRepresentation = 0x808080,
  roughness: number = 0.8
): THREE.Mesh => {
  const geometry = new THREE.PlaneGeometry(size, size);
  const material = new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness: 0.0,
  });
  
  const plane = new THREE.Mesh(geometry, material);
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = 0;
  plane.receiveShadow = true;
  
  return plane;
};
