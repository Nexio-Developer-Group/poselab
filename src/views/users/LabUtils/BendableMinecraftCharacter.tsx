import { useMemo, useRef, useEffect, useCallback } from "react";
import * as THREE from "three";

interface Vec3 { x: number; y: number; z: number }

interface MinecraftCharacterProps {
  skinImage: HTMLImageElement;
  pose: {
    leftUpperArm: Vec3;
    leftLowerArm: Vec3;
    rightUpperArm: Vec3;
    rightLowerArm: Vec3;
    leftUpperLeg: Vec3;
    leftLowerLeg: Vec3;
    rightUpperLeg: Vec3;
    rightLowerLeg: Vec3;
    head: Vec3;
    body: Vec3;
  };
  facial?: {
    eyes?: { x: number; y: number; blink: number };
    mouth?: { smile: number; open: number };
    eyebrows?: { left: number; right: number };
  };
}

export function BendableMinecraftCharacter({ skinImage, pose, facial }: MinecraftCharacterProps) {
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
    return new THREE.MeshPhongMaterial({ map: texture });
  }, [skinImage]);

  // Facials: System for swapping eye/mouth textures
  const createSubTextureMaterial = useCallback((x: number, y: number, w: number, h: number, opacity = 1) => {
    const canvas = document.createElement("canvas");
    canvas.width = w * 8;
    canvas.height = h * 8;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(skinImage, x, y, w, h, 0, 0, w * 8, h * 8);
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    return new THREE.MeshLambertMaterial({ map: texture, transparent: true, opacity });
  }, [skinImage]);

  // Create a complete limb with two-bone system
  const createLimbSystem = useCallback(() => {
    const upperBone = new THREE.Bone();
    const lowerBone = new THREE.Bone();

    // Position bones correctly for a 12-unit tall limb
    // Joint at center (elevation 0)
    upperBone.position.set(0, 6, 0);  // Pivot at top
    lowerBone.position.set(0, -6, 0); // Joint at middle
    upperBone.add(lowerBone);

    // Subdivide geometry for smooth bending: (width, height, depth, widthSegments, heightSegments, depthSegments)
    const geometry = new THREE.BoxGeometry(4, 12, 4, 1, 32, 1);
    const positions = geometry.attributes.position;

    const skinIndices: number[] = [];
    const skinWeights: number[] = [];

    // Weight vertices based on Y position for a smooth transition at the joint
    for (let i = 0; i < positions.count; i++) {
      const y = positions.getY(i);

      // y ranges from -6 to 6
      // Bone 0 is upperBone (influence at top), Bone 1 is lowerBone (influence at bottom)
      // However, the skeleton will be [upperBone, lowerBone]
      // Weights should be:
      // y = 6: upper=1, lower=0
      // y = 0: upper=0.5, lower=0.5
      // y = -6: upper=0, lower=1

      // Weight for upper bone (index 0)
      const weightUpper = THREE.MathUtils.smoothstep(y, -3, 3);
      const weightLower = 1 - weightUpper;

      skinIndices.push(0, 1, 0, 0);
      skinWeights.push(weightUpper, weightLower, 0, 0);
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
    const createSkinnedLimb = (geom: THREE.BoxGeometry, mats: THREE.Material[], system: any) => {
      const mesh = new THREE.SkinnedMesh(geom, mats);
      mesh.frustumCulled = false; // Prevent culling issues with animation
      mesh.add(system.upperBone);
      mesh.bind(new THREE.Skeleton([system.upperBone, system.lowerBone]));
      return mesh;
    };

    return {
      leftArmMesh: createSkinnedLimb(limbSystems.leftArm.geometry, armMaterials, limbSystems.leftArm),
      rightArmMesh: createSkinnedLimb(limbSystems.rightArm.geometry, armMaterials, limbSystems.rightArm),
      leftLegMesh: createSkinnedLimb(limbSystems.leftLeg.geometry, legMaterials, limbSystems.leftLeg),
      rightLegMesh: createSkinnedLimb(limbSystems.rightLeg.geometry, legMaterials, limbSystems.rightLeg),
    };
  }, [limbSystems, armMaterials, legMaterials]);

  // Apply pose mapping PRESET -> BONES
  useEffect(() => {
    const deg2rad = (deg: number) => (deg * Math.PI) / 180;

    staticBones.head.rotation.set(deg2rad(pose.head.x), deg2rad(pose.head.y), deg2rad(pose.head.z));
    staticBones.body.rotation.set(deg2rad(pose.body.x), deg2rad(pose.body.y), deg2rad(pose.body.z));

    // Arms mapping: Upper part to upperBone, Lower part'S X rotation to lowerBone (Bending)
    limbSystems.leftArm.upperBone.rotation.set(deg2rad(pose.leftUpperArm.x), deg2rad(pose.leftUpperArm.y), deg2rad(pose.leftUpperArm.z));
    limbSystems.leftArm.lowerBone.rotation.set(deg2rad(pose.leftLowerArm.x), 0, 0);

    limbSystems.rightArm.upperBone.rotation.set(deg2rad(pose.rightUpperArm.x), deg2rad(pose.rightUpperArm.y), deg2rad(pose.rightUpperArm.z));
    limbSystems.rightArm.lowerBone.rotation.set(deg2rad(pose.rightLowerArm.x), 0, 0);

    // Legs mapping
    limbSystems.leftLeg.upperBone.rotation.set(deg2rad(pose.leftUpperLeg.x), deg2rad(pose.leftUpperLeg.y), deg2rad(pose.leftUpperLeg.z));
    limbSystems.leftLeg.lowerBone.rotation.set(deg2rad(pose.leftLowerLeg.x), 0, 0);

    limbSystems.rightLeg.upperBone.rotation.set(deg2rad(pose.rightUpperLeg.x), deg2rad(pose.rightUpperLeg.y), deg2rad(pose.rightUpperLeg.z));
    limbSystems.rightLeg.lowerBone.rotation.set(deg2rad(pose.rightLowerLeg.x), 0, 0);
  }, [pose, staticBones, limbSystems]);

  // Facial materials
  const eyeMaterial = useMemo(() => createSubTextureMaterial(8, 12, 8, 2), [createSubTextureMaterial]);
  const mouthMaterial = useMemo(() => createSubTextureMaterial(8, 14, 8, 2), [createSubTextureMaterial]);

  return (
    <group ref={groupRef} position={[0, -1, 0]} scale={0.125}>
      {/* Head - with bone for rotation */}
      <primitive object={staticBones.head} position={[0, 24, 0]}>
        <mesh
          geometry={new THREE.BoxGeometry(8, 8, 8)}
          material={headMaterials}
          position={[0, 4, 0]} // Position mesh so pivot is at bottom
        />

        {/* Facial Features (Secondary Planes) */}
        <group position={[0, 4, 0]}>
          {/* Eyes with logic for facial props */}
          <mesh position={[
            (facial?.eyes?.x || 0) * 0.1,
            (facial?.eyes?.y || 0) * 0.1,
            4.01
          ]}>
            <planeGeometry args={[8, 2]} />
            <primitive object={eyeMaterial} attach="material" />
          </mesh>

          {/* Mouth */}
          <mesh position={[0, -2 - (facial?.mouth?.smile || 0) * 0.1, 4.01]}>
            <planeGeometry args={[8, 2]} />
            <primitive object={mouthMaterial} attach="material" />
          </mesh>
        </group>
      </primitive>

      {/* Body - with bone for rotation */}
      <primitive object={staticBones.body} position={[0, 18, 0]}>
        <mesh
          geometry={new THREE.BoxGeometry(8, 12, 4)}
          material={bodyMaterials}
          position={[0, 6, 0]} // Pivot at bottom 
        />
      </primitive>

      {/* Limbs - skinned meshes wrapped in groups for stability */}
      <group position={[-6, 22, 0]}>
        <primitive object={meshes.leftArmMesh} />
      </group>
      <group position={[6, 22, 0]}>
        <primitive object={meshes.rightArmMesh} />
      </group>
      <group position={[-2, 12, 0]}>
        <primitive object={meshes.leftLegMesh} />
      </group>
      <group position={[2, 12, 0]}>
        <primitive object={meshes.rightLegMesh} />
      </group>
    </group>
  );
}

