import { useRef, useEffect } from "react";
import {  Group, BoxGeometry, CanvasTexture, MeshPhongMaterial } from "three";

interface MinecraftCharacterProps {
  skinImage: HTMLImageElement;
  pose: {
    leftUpperArm: { x: number; y: number; z: number };
    leftLowerArm: { x: number; y: number; z: number };
    rightUpperArm: { x: number; y: number; z: number };
    rightLowerArm: { x: number; y: number; z: number };
    leftUpperLeg: { x: number; y: number; z: number };
    leftLowerLeg: { x: number; y: number; z: number };
    rightUpperLeg: { x: number; y: number; z: number };
    rightLowerLeg: { x: number; y: number; z: number };
    head: { x: number; y: number; z: number };
    body: { x: number; y: number; z: number };
  };
}

export const MinecraftCharacter = ({ skinImage, pose }: MinecraftCharacterProps) => {
  const groupRef = useRef<Group>(null);
  const headRef = useRef<Group>(null);
  const bodyRef = useRef<Group>(null);
  const leftUpperArmRef = useRef<Group>(null);
  const leftLowerArmRef = useRef<Group>(null);
  const rightUpperArmRef = useRef<Group>(null);
  const rightLowerArmRef = useRef<Group>(null);
  const leftUpperLegRef = useRef<Group>(null);
  const leftLowerLegRef = useRef<Group>(null);
  const rightUpperLegRef = useRef<Group>(null);
  const rightLowerLegRef = useRef<Group>(null);

  // Apply pose rotations with proper joint hierarchy
  useEffect(() => {
    if (headRef.current) {
      headRef.current.rotation.set(
        (pose.head.x * Math.PI) / 180,
        (pose.head.y * Math.PI) / 180,
        (pose.head.z * Math.PI) / 180
      );
    }
    if (bodyRef.current) {
      bodyRef.current.rotation.set(
        (pose.body.x * Math.PI) / 180,
        (pose.body.y * Math.PI) / 180,
        (pose.body.z * Math.PI) / 180
      );
    }

    // Left arm joints
    if (leftUpperArmRef.current) {
      leftUpperArmRef.current.rotation.set(
        (pose.leftUpperArm.x * Math.PI) / 180,
        (pose.leftUpperArm.y * Math.PI) / 180,
        (pose.leftUpperArm.z * Math.PI) / 180
      );
    }
    if (leftLowerArmRef.current) {
      leftLowerArmRef.current.rotation.set(
        (pose.leftLowerArm.x * Math.PI) / 180,
        (pose.leftLowerArm.y * Math.PI) / 180,
        (pose.leftLowerArm.z * Math.PI) / 180
      );
    }

    // Right arm joints
    if (rightUpperArmRef.current) {
      rightUpperArmRef.current.rotation.set(
        (pose.rightUpperArm.x * Math.PI) / 180,
        (pose.rightUpperArm.y * Math.PI) / 180,
        (pose.rightUpperArm.z * Math.PI) / 180
      );
    }
    if (rightLowerArmRef.current) {
      rightLowerArmRef.current.rotation.set(
        (pose.rightLowerArm.x * Math.PI) / 180,
        (pose.rightLowerArm.y * Math.PI) / 180,
        (pose.rightLowerArm.z * Math.PI) / 180
      );
    }

    // Left leg joints
    if (leftUpperLegRef.current) {
      leftUpperLegRef.current.rotation.set(
        (pose.leftUpperLeg.x * Math.PI) / 180,
        (pose.leftUpperLeg.y * Math.PI) / 180,
        (pose.leftUpperLeg.z * Math.PI) / 180
      );
    }
    if (leftLowerLegRef.current) {
      leftLowerLegRef.current.rotation.set(
        (pose.leftLowerLeg.x * Math.PI) / 180,
        (pose.leftLowerLeg.y * Math.PI) / 180,
        (pose.leftLowerLeg.z * Math.PI) / 180
      );
    }

    // Right leg joints
    if (rightUpperLegRef.current) {
      rightUpperLegRef.current.rotation.set(
        (pose.rightUpperLeg.x * Math.PI) / 180,
        (pose.rightUpperLeg.y * Math.PI) / 180,
        (pose.rightUpperLeg.z * Math.PI) / 180
      );
    }
    if (rightLowerLegRef.current) {
      rightLowerLegRef.current.rotation.set(
        (pose.rightLowerLeg.x * Math.PI) / 180,
        (pose.rightLowerLeg.y * Math.PI) / 180,
        (pose.rightLowerLeg.z * Math.PI) / 180
      );
    }
  }, [pose]);

  // Create UV-mapped materials for proper texture mapping
  // Three.js BoxGeometry face order: right, left, top, bottom, front, back
  const createCubeMaterials = (uvMap: {
    right: [number, number, number, number],
    left: [number, number, number, number],
    top: [number, number, number, number],
    bottom: [number, number, number, number],
    front: [number, number, number, number],
    back: [number, number, number, number]
  }) => {
    return [uvMap.right, uvMap.left, uvMap.top, uvMap.bottom, uvMap.front, uvMap.back].map(([x, y, w, h]) => {
      const canvas = document.createElement('canvas');
      canvas.width = w * 4; // Scale up for better quality
      canvas.height = h * 4;
      const ctx = canvas.getContext('2d')!;

      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(skinImage, x, y, w, h, 0, 0, w * 4, h * 4);

      const texture = new CanvasTexture(canvas);
      texture.flipY = true;
      texture.generateMipmaps = false;
      texture.magFilter = 1003; // NearestFilter for pixelated look
      texture.minFilter = 1003;
      texture.needsUpdate = true;

      return new MeshPhongMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.1
      });
    });
  };

  // Improved geometry with proper proportions
  const headGeometry = new BoxGeometry(8, 8, 8);
  const bodyGeometry = new BoxGeometry(8, 12, 4);
  const upperArmGeometry = new BoxGeometry(4, 6, 4);
  const lowerArmGeometry = new BoxGeometry(4, 6, 4);
  const upperLegGeometry = new BoxGeometry(4, 6, 4);
  const lowerLegGeometry = new BoxGeometry(4, 6, 4);

  // Overlay geometry (slightly larger for second layer)
  const headOverlayGeometry = new BoxGeometry(8.5, 8.5, 8.5);
  const bodyOverlayGeometry = new BoxGeometry(8.5, 12.5, 4.5);
  const upperArmOverlayGeometry = new BoxGeometry(4.5, 6.5, 4.5);
  const lowerArmOverlayGeometry = new BoxGeometry(4.5, 6.5, 4.5);
  const upperLegOverlayGeometry = new BoxGeometry(4.5, 6.5, 4.5);
  const lowerLegOverlayGeometry = new BoxGeometry(4.5, 6.5, 4.5);

  // HEAD (base)
  const headMaterials = createCubeMaterials({
    right: [0, 8, 8, 8],
    left: [16, 8, 8, 8],
    top: [8, 0, 8, 8],
    bottom: [16, 0, 8, 8],
    front: [8, 8, 8, 8],
    back: [24, 8, 8, 8]
  });

  // TORSO / BODY (base)
  const bodyMaterials = createCubeMaterials({
    right: [16, 20, 4, 12],
    left: [28, 20, 4, 12],
    top: [20, 16, 8, 4],
    bottom: [28, 16, 8, 4],
    front: [20, 20, 8, 12],
    back: [32, 20, 8, 12]
  });

  // RIGHT ARM (base)
  const rightArmMaterials = createCubeMaterials({
    right: [40, 26, 4, 6],
    left: [48, 26, 4, 6],
    top: [44, 16, 4, 4],
    bottom: [48, 16, 4, 4],
    front: [44, 26, 4, 6],
    back: [52, 26, 4, 6]
  });

  const rightArmTopMaterials = createCubeMaterials({
    right: [40, 20, 4, 6],
    left: [48, 20, 4, 6],
    top: [44, 16, 4, 4],
    bottom: [44, 16, 4, 4],
    front: [44, 20, 4, 6],
    back: [52, 20, 4, 6]
  })

  // LEFT ARM (1.8+ separate region)
  const leftArmMaterials = createCubeMaterials({
    right: [32, 58, 4, 6],
    left: [40, 58, 4, 6],
    top: [36, 48, 4, 4],
    bottom: [40, 48, 4, 4],
    front: [36, 58, 4, 6],
    back: [44, 58, 4, 6]
  });

  const leftArmTopMaterials = createCubeMaterials({
    right: [32, 52, 4, 6],
    left: [40, 52, 4, 6],
    top: [36, 48, 4, 4],
    bottom: [36, 48, 4, 4],
    front: [36, 52, 4, 6],
    back: [44, 52, 4, 6]
  });

  // RIGHT LEG (base)
  const rightLegMaterials = createCubeMaterials({
    right: [0, 26, 4, 6],
    left: [8, 26, 4, 6],
    top: [4, 16, 4, 4],
    bottom: [8, 16, 4, 4],
    front: [4, 26, 4, 6],
    back: [12, 26, 4, 6]
  });

  const rightLegTopMaterials = createCubeMaterials({
    right: [0, 20, 4, 6],
    left: [8, 20, 4, 6],
    top: [4, 16, 4, 4],
    bottom: [4, 16, 4, 4],
    front: [4, 20, 4, 6],
    back: [12, 20, 4, 6]
  })

  // LEFT LEG (1.8+ separate region)
  const leftLegMaterials = createCubeMaterials({
    right: [16, 58, 4, 6],
    left: [24, 58, 4, 6],
    top: [20, 48, 4, 4],
    bottom: [24, 48, 4, 4],
    front: [20, 58, 4, 6],
    back: [28, 58, 4, 6]
  });


  const leftLegTopMaterials = createCubeMaterials({
    right: [16, 52, 4, 6],
    left: [24, 52, 4, 6],
    top: [20, 48, 4, 4],
    bottom: [20, 48, 4, 4],
    front: [20, 52, 4, 6],
    back: [28, 52, 4, 6]
  })

  // --- OVERLAY (second layer) ---
  // head overlay
  const headOverlayMaterials = createCubeMaterials({
    right: [48, 8, 8, 8],
    left: [32, 8, 8, 8],
    top: [40, 0, 8, 8],
    bottom: [48, 0, 8, 8],
    front: [40, 8, 8, 8],
    back: [56, 8, 8, 8]
  });

  // torso overlay
  const bodyOverlayMaterials = createCubeMaterials({
    right: [16, 36, 4, 12],
    left: [28, 36, 4, 12],
    top: [20, 32, 8, 4],
    bottom: [28, 32, 8, 4],
    front: [20, 36, 8, 12],
    back: [32, 36, 8, 12]
  });

  // right arm overlay
  const rightArmOverlayMaterials = createCubeMaterials({
    right: [40, 42, 4, 6],
    left: [48, 42, 4, 6],
    top: [44, 32, 4, 4],
    bottom: [48, 32, 4, 4],
    front: [44, 42, 4, 6],
    back: [52, 42, 4, 6]
  });

  const rightArmOverlayTopMaterials = createCubeMaterials({
    right: [40, 36, 4, 6],
    left: [48, 36, 4, 6],
    top: [44, 32, 4, 4],
    bottom: [44, 32, 4, 4],
    front: [44, 36, 4, 6],
    back: [52, 36, 4, 6]
  });

  // left arm overlay
  const leftArmOverlayMaterials = createCubeMaterials({
    right: [48, 58, 4, 6],
    left: [56, 58, 4, 6],
    top: [52, 48, 4, 4],
    bottom: [56, 48, 4, 4],
    front: [52, 58, 4, 6],
    back: [60, 58, 4, 6]
  });

  const leftArmOverlayTopMaterials = createCubeMaterials({
    right: [48, 52, 4, 6],
    left: [56, 52, 4, 6],
    top: [52, 48, 4, 4],
    bottom: [52, 48, 4, 4],
    front: [52, 52, 4, 6],
    back: [60, 52, 4, 6]
  })

  // right leg overlay
  const rightLegOverlayMaterials = createCubeMaterials({
    right: [0, 42, 4, 6],
    left: [8, 42, 4, 6],
    top: [4, 32, 4, 4],
    bottom: [8, 32, 4, 4],
    front: [4, 42, 4, 6],
    back: [12, 42, 4, 6]
  });

  const rightLegOverlayTopMaterials = createCubeMaterials({
    right: [0, 36, 4, 6],
    left: [8, 36, 4, 6],
    top: [4, 32, 4, 4],
    bottom: [4, 32, 4, 4],
    front: [4, 36, 4, 6],
    back: [12, 36, 4, 6]
  });

  // left leg overlay
  const leftLegOverlayMaterials = createCubeMaterials({
    right: [0, 58, 4, 6],
    left: [8, 58, 4, 6],
    top: [4, 48, 4, 4],
    bottom: [8, 48, 4, 4],
    front: [4, 58, 4, 6],
    back: [12, 58, 4, 6]
  });

  const leftLegOverlayTopMaterials = createCubeMaterials({
    right: [0, 52, 4, 6],
    left: [8, 52, 4, 6],
    top: [4, 48, 4, 4],
    bottom: [4, 48, 4, 4],
    front: [4, 52, 4, 6],
    back: [12, 52, 4, 6]
  });


  return (
    <group ref={groupRef} position={[0, -2, 0]} scale={0.12}>
      {/* Head - pivot at bottom center */}
      <group ref={headRef} position={[0, 24, 0]}>
        <mesh
          position={[0, 4, 0]}
          geometry={headGeometry}
          material={headMaterials}
        />
        <mesh
          position={[0, 4, 0]}
          geometry={headOverlayGeometry}
          material={headOverlayMaterials}
        />
      </group>

      {/* Body - pivot at top center */}
      <group ref={bodyRef} position={[0, 24, 0]}>
        <mesh
          position={[0, -6, 0]}
          geometry={bodyGeometry}
          material={bodyMaterials}
        />
        <mesh
          position={[0, -6, 0]}
          geometry={bodyOverlayGeometry}
          material={bodyOverlayMaterials}
        />
      </group>

      {/* Left Arm - Complete arm with elbow joint */}
      <group ref={leftUpperArmRef} position={[-6, 24, 0]}>
        {/* Upper arm */}
        <mesh
          position={[0, -3, 0]}
          geometry={upperArmGeometry}
          material={leftArmTopMaterials}
        />
        <mesh
          position={[0, -3, 0]}
          geometry={upperArmOverlayGeometry}
          material={leftArmOverlayTopMaterials}
        />

        {/* Lower arm group - pivot at elbow */}
        <group ref={leftLowerArmRef} position={[0, -6, 0]}>
          <mesh
            position={[0, -3, 0]}
            geometry={lowerArmGeometry}
            material={leftArmMaterials}
          />
          <mesh
            position={[0, -3, 0]}
            geometry={lowerArmOverlayGeometry}
            material={leftArmOverlayMaterials}
          />
        </group>
      </group>

      {/* Right Arm - Complete arm with elbow joint */}
      <group ref={rightUpperArmRef} position={[6, 24, 0]}>
        {/* Upper arm */}
        <mesh
          position={[0, -3, 0]}
          geometry={upperArmGeometry}
          material={rightArmTopMaterials}
        />
        <mesh
          position={[0, -3, 0]}
          geometry={upperArmOverlayGeometry}
          material={rightArmOverlayTopMaterials}
        />

        {/* Lower arm group - pivot at elbow */}
        <group ref={rightLowerArmRef} position={[0, -6, 0]}>
          <mesh
            position={[0, -3, 0]}
            geometry={lowerArmGeometry}
            material={rightArmMaterials}
          />
          <mesh
            position={[0, -3, 0]}
            geometry={lowerArmOverlayGeometry}
            material={rightArmOverlayMaterials}
          />
        </group>
      </group>

      {/* Left Leg - Complete leg with knee joint */}
      <group ref={leftUpperLegRef} position={[-2, 12, 0]}>
        {/* Upper leg */}
        <mesh
          position={[0, -3, 0]}
          geometry={upperLegGeometry}
          material={leftLegTopMaterials}
        />
        <mesh
          position={[0, -3, 0]}
          geometry={upperLegOverlayGeometry}
          material={leftLegOverlayTopMaterials}
        />

        {/* Lower leg group - pivot at knee */}
        <group ref={leftLowerLegRef} position={[0, -6, 0]}>
          <mesh
            position={[0, -3, 0]}
            geometry={lowerLegGeometry}
            material={leftLegMaterials}
          />
          <mesh
            position={[0, -3, 0]}
            geometry={lowerLegOverlayGeometry}
            material={leftLegOverlayMaterials}
          />
        </group>
      </group>

      {/* Right Leg - Complete leg with knee joint */}
      <group ref={rightUpperLegRef} position={[2, 12, 0]}>
        {/* Upper leg */}
        <mesh
          position={[0, -3, 0]}
          geometry={upperLegGeometry}
          material={rightLegTopMaterials}
        />
        <mesh
          position={[0, -3, 0]}
          geometry={upperLegOverlayGeometry}
          material={rightLegOverlayTopMaterials}
        />

        {/* Lower leg group - pivot at knee */}
        <group ref={rightLowerLegRef} position={[0, -6, 0]}>
          <mesh
            position={[0, -3, 0]}
            geometry={lowerLegGeometry}
            material={rightLegMaterials}
          />
          <mesh
            position={[0, -3, 0]}
            geometry={lowerLegOverlayGeometry}
            material={rightLegOverlayMaterials}
          />
        </group>
      </group>
    </group>
  );
};