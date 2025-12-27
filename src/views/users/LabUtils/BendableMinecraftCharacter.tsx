import { useMemo, useRef, useEffect, useCallback } from "react";
import * as THREE from "three";

interface Vec3 { x: number; y: number; z: number }
interface LimbPose {
  position: Vec3;  
  bend: number;    
}

interface MinecraftCharacterProps {
  skinImage: HTMLImageElement;
  pose: {
    leftArm: LimbPose;
    rightArm: LimbPose;
    leftLeg: LimbPose;
    rightLeg: LimbPose;
    head: Vec3;
    body: Vec3;
  };
}

export function BendableMinecraftCharacter({ skinImage, pose }: MinecraftCharacterProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Create material helper
  const createMaterial = useCallback((x: number, y: number, w: number, h: number) => {
    const canvas = document.createElement("canvas");
    canvas.width = w * 4;
    canvas.height = h * 4;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(skinImage, x, y, w, h, 0, 0, w * 4, h * 4);
    const texture = new THREE.CanvasTexture(canvas);
    texture.flipY = false;
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    return new THREE.MeshPhongMaterial({ map: texture, skinning: true });
  }, [skinImage]);

  // Create a complete limb with two-bone system
  const createLimbSystem = useCallback(() => {
    const upperBone = new THREE.Bone();
    const lowerBone = new THREE.Bone();
    
    // Position bones correctly for a 12-unit tall limb
    upperBone.position.set(0, 3, 0);  // Upper bone at top third
    lowerBone.position.set(0, -6, 0); // Lower bone 6 units down (joint at middle)
    upperBone.add(lowerBone);

    const geometry = new THREE.BoxGeometry(4, 12, 4);
    const positions = geometry.attributes.position;
    
    const skinIndices: number[] = [];
    const skinWeights: number[] = [];
    
    // Weight vertices based on Y position
    for (let i = 0; i < positions.count; i++) {
      const y = positions.getY(i);
      if (y > 0) {
        // Top half - upper bone (index 0)
        skinIndices.push(0, 0, 0, 0);
        skinWeights.push(1, 0, 0, 0);
      } else {
        // Bottom half - lower bone (index 1)
        skinIndices.push(1, 0, 0, 0);
        skinWeights.push(1, 0, 0, 0);
      }
    }

    geometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndices, 4));
    geometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeights, 4));

    return { upperBone, lowerBone, geometry };
  }, []);

  // Create limb systems
  const limbSystems = useMemo(() => ({
    leftArm: createLimbSystem(),
    rightArm: createLimbSystem(), 
    leftLeg: createLimbSystem(),
    rightLeg: createLimbSystem(),
  }), [createLimbSystem]);

  // Create separate bones for head and body
  const staticBones = useMemo(() => ({
    head: new THREE.Bone(),
    body: new THREE.Bone(),
  }), []);

  // Materials
  const headMaterials = useMemo(() => [
    createMaterial(8, 8, 8, 8),   
    createMaterial(16, 8, 8, 8),  
    createMaterial(8, 0, 8, 8),   
    createMaterial(16, 0, 8, 8),  
    createMaterial(8, 8, 8, 8),   
    createMaterial(24, 8, 8, 8),  
  ], [createMaterial]);

  const bodyMaterials = useMemo(() => [
    createMaterial(16, 20, 4, 12),
    createMaterial(28, 20, 4, 12),
    createMaterial(20, 16, 8, 4),
    createMaterial(28, 16, 8, 4),
    createMaterial(20, 20, 8, 12),
    createMaterial(32, 20, 8, 12),
  ], [createMaterial]);

  const armMaterials = useMemo(() => [
    createMaterial(44, 20, 4, 12),
    createMaterial(52, 20, 4, 12),
    createMaterial(44, 16, 4, 4),
    createMaterial(48, 16, 4, 4),
    createMaterial(44, 20, 4, 12),
    createMaterial(48, 20, 4, 12),
  ], [createMaterial]);

  const legMaterials = useMemo(() => [
    createMaterial(4, 20, 4, 12),
    createMaterial(12, 20, 4, 12),
    createMaterial(4, 16, 4, 4),
    createMaterial(8, 16, 4, 4),
    createMaterial(4, 20, 4, 12),
    createMaterial(8, 20, 4, 12),
  ], [createMaterial]);

  // Create skinned meshes
  const meshes = useMemo(() => {
    const leftArmMesh = new THREE.SkinnedMesh(limbSystems.leftArm.geometry, armMaterials);
    leftArmMesh.add(limbSystems.leftArm.upperBone);
    leftArmMesh.bind(new THREE.Skeleton([limbSystems.leftArm.upperBone, limbSystems.leftArm.lowerBone]));

    const rightArmMesh = new THREE.SkinnedMesh(limbSystems.rightArm.geometry, armMaterials);  
    rightArmMesh.add(limbSystems.rightArm.upperBone);
    rightArmMesh.bind(new THREE.Skeleton([limbSystems.rightArm.upperBone, limbSystems.rightArm.lowerBone]));

    const leftLegMesh = new THREE.SkinnedMesh(limbSystems.leftLeg.geometry, legMaterials);
    leftLegMesh.add(limbSystems.leftLeg.upperBone);
    leftLegMesh.bind(new THREE.Skeleton([limbSystems.leftLeg.upperBone, limbSystems.leftLeg.lowerBone]));

    const rightLegMesh = new THREE.SkinnedMesh(limbSystems.rightLeg.geometry, legMaterials);
    rightLegMesh.add(limbSystems.rightLeg.upperBone);
    rightLegMesh.bind(new THREE.Skeleton([limbSystems.rightLeg.upperBone, limbSystems.rightLeg.lowerBone]));

    return { leftArmMesh, rightArmMesh, leftLegMesh, rightLegMesh };
  }, [limbSystems, armMaterials, legMaterials]);

  // Apply pose
  useEffect(() => {
    const deg2rad = (deg: number) => (deg * Math.PI) / 180;

    // Static bones
    staticBones.head.rotation.set(deg2rad(pose.head.x), deg2rad(pose.head.y), deg2rad(pose.head.z));
    staticBones.body.rotation.set(deg2rad(pose.body.x), deg2rad(pose.body.y), deg2rad(pose.body.z));
    
    // Limbs
    limbSystems.leftArm.upperBone.rotation.set(
      deg2rad(pose.leftArm.position.x), 
      deg2rad(pose.leftArm.position.y), 
      deg2rad(pose.leftArm.position.z)
    );
    limbSystems.leftArm.lowerBone.rotation.set(deg2rad(pose.leftArm.bend), 0, 0);
    
    limbSystems.rightArm.upperBone.rotation.set(
      deg2rad(pose.rightArm.position.x), 
      deg2rad(pose.rightArm.position.y), 
      deg2rad(pose.rightArm.position.z)
    );
    limbSystems.rightArm.lowerBone.rotation.set(deg2rad(pose.rightArm.bend), 0, 0);
    
    limbSystems.leftLeg.upperBone.rotation.set(
      deg2rad(pose.leftLeg.position.x), 
      deg2rad(pose.leftLeg.position.y), 
      deg2rad(pose.leftLeg.position.z)
    );
    limbSystems.leftLeg.lowerBone.rotation.set(deg2rad(pose.leftLeg.bend), 0, 0);
    
    limbSystems.rightLeg.upperBone.rotation.set(
      deg2rad(pose.rightLeg.position.x), 
      deg2rad(pose.rightLeg.position.y), 
      deg2rad(pose.rightLeg.position.z)
    );
    limbSystems.rightLeg.lowerBone.rotation.set(deg2rad(pose.rightLeg.bend), 0, 0);
  }, [pose, staticBones, limbSystems]);

  return (
    <group ref={groupRef} position={[0, -1, 0]} scale={0.125}>
      {/* Head - with bone for rotation */}
      <group position={[0, 28, 0]}>
        <primitive object={staticBones.head} />
        <mesh geometry={new THREE.BoxGeometry(8, 8, 8)} material={headMaterials} />
      </group>

      {/* Body - with bone for rotation */}
      <group position={[0, 18, 0]}>
        <primitive object={staticBones.body} />
        <mesh geometry={new THREE.BoxGeometry(8, 12, 4)} material={bodyMaterials} />
      </group>

      {/* Limbs - skinned meshes */}
      <primitive object={meshes.leftArmMesh} position={[-6, 22, 0]} />
      <primitive object={meshes.rightArmMesh} position={[6, 22, 0]} />
      <primitive object={meshes.leftLegMesh} position={[-2, 12, 0]} />
      <primitive object={meshes.rightLegMesh} position={[2, 12, 0]} />
    </group>
  );
}
