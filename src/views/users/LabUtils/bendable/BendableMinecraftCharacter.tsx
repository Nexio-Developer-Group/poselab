import { useMemo, useRef, useEffect, useCallback } from "react";
import * as THREE from "three";
import { createPortal } from "@react-three/fiber";
import { Pose } from "./posePresets";
import { createCharacterSkeleton } from "./systems/SkeletonSystem";
import { createLeftArm, createRightArm } from "./systems/ArmSystem";
import { createLeftLeg, createRightLeg } from "./systems/LegSystem";

interface MinecraftCharacterProps {
    skinImage: HTMLImageElement;
    pose: Pose["poseConfig"];
    facial?: Pose["facial"];
}

export function BendableMinecraftCharacter({ skinImage, pose, facial }: MinecraftCharacterProps) {
    const groupRef = useRef<THREE.Group>(null);

    /* ---------------- TEXTURE HELPERS ---------------- */
    // (Existing logic kept for consistency)
    const createMaterial = useCallback((x: number, y: number, w: number, h: number) => {
        const canvas = document.createElement("canvas");
        canvas.width = w * 8; // High res for crisp pixels
        canvas.height = h * 8;
        const ctx = canvas.getContext("2d")!;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(skinImage, x, y, w, h, 0, 0, w * 8, h * 8);

        const texture = new THREE.CanvasTexture(canvas);
        texture.flipY = true; // Standard UV mapping typically expects this
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;

        return new THREE.MeshLambertMaterial({ map: texture, transparent: true });
    }, [skinImage]);

    const createSubTextureMaterial = useCallback((x: number, y: number, w: number, h: number) => {
        const canvas = document.createElement("canvas");
        canvas.width = w * 8;
        canvas.height = h * 8;
        const ctx = canvas.getContext("2d")!;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(skinImage, x, y, w, h, 0, 0, w * 8, h * 8);
        const texture = new THREE.CanvasTexture(canvas);
        texture.magFilter = THREE.NearestFilter;
        return new THREE.MeshLambertMaterial({ map: texture, transparent: true });
    }, [skinImage]);

    /* ---------------- SYSTEM INITIALIZATION ---------------- */

    // 1. Create the Skeleton Hierarchy (Single Source of Truth)
    const { root, bones, skeleton } = useMemo(() => createCharacterSkeleton(), []);

    // 2. Create Materials
    const materials = useMemo(() => {
        const head = [
            createMaterial(8, 8, 8, 8),   // Right
            createMaterial(16, 8, 8, 8),  // Left
            createMaterial(8, 0, 8, 8),   // Top
            createMaterial(16, 0, 8, 8),  // Bottom
            createMaterial(8, 8, 8, 8),   // Front (Face)
            createMaterial(24, 8, 8, 8),  // Back
        ];
        const body = [
            createMaterial(16, 20, 4, 12),
            createMaterial(28, 20, 4, 12),
            createMaterial(20, 16, 8, 4),
            createMaterial(28, 16, 8, 4),
            createMaterial(20, 20, 8, 12),
            createMaterial(32, 20, 8, 12),
        ];
        const arm = [
            createMaterial(44, 20, 4, 12),
            createMaterial(52, 20, 4, 12),
            createMaterial(44, 16, 4, 4),
            createMaterial(48, 16, 4, 4),
            createMaterial(44, 20, 4, 12),
            createMaterial(48, 20, 4, 12),
        ];
        const leg = [
            createMaterial(4, 20, 4, 12),
            createMaterial(12, 20, 4, 12),
            createMaterial(4, 16, 4, 4),
            createMaterial(8, 16, 4, 4),
            createMaterial(4, 20, 4, 12),
            createMaterial(8, 20, 4, 12),
        ];
        return { head, body, arm, leg };
    }, [createMaterial]);

    // 3. Create Skinned Meshes (Bending Limbs)
    const meshes = useMemo(() => ({
        leftArm: createLeftArm(bones.leftArm, materials.arm),
        rightArm: createRightArm(bones.rightArm, materials.arm),
        leftLeg: createLeftLeg(bones.leftLeg, materials.leg),
        rightLeg: createRightLeg(bones.rightLeg, materials.leg),
    }), [bones, materials]);

    // 4. Rigid Geometries
    const rigidGeo = useMemo(() => ({
        head: new THREE.BoxGeometry(8, 8, 8),
        body: new THREE.BoxGeometry(8, 12, 4),
        // Facial features
        eye: new THREE.PlaneGeometry(8, 2),
        mouth: new THREE.PlaneGeometry(8, 2),
    }), []);

    // Facial Materials
    const eyeMat = useMemo(() => createSubTextureMaterial(8, 12, 8, 2), [createSubTextureMaterial]);
    const mouthMat = useMemo(() => createSubTextureMaterial(8, 14, 8, 2), [createSubTextureMaterial]);

    /* ---------------- POSE APPLICATION ---------------- */
    useEffect(() => {
        const r = THREE.MathUtils.degToRad;
        const safePose = {
            head: pose?.head || { x: 0, y: 0, z: 0 },
            body: pose?.body || { x: 0, y: 0, z: 0 },
            leftUpperArm: pose?.leftUpperArm || { x: 0, y: 10, z: 0, bendAngle: 0 },
            rightUpperArm: pose?.rightUpperArm || { x: 0, y: 10, z: 0, bendAngle: 0 },
            leftUpperLeg: pose?.leftUpperLeg || { x: 0, y: -10, z: 0, bendAngle: 0 },
            rightUpperLeg: pose?.rightUpperLeg || { x: 0, y: -10, z: 0, bendAngle: 0 },
        };

        // Apply Rotations to Bones
        // Body (Global Rotation + Waist)
        bones.body.rotation.set(r(safePose.body.x), r(safePose.body.y), r(safePose.body.z));
        bones.head.rotation.set(r(safePose.head.x), r(safePose.head.y), r(safePose.head.z));

        // Arms (Upper + Lower Bend)
        bones.leftArm.upper.rotation.set(r(safePose.leftUpperArm.x), r(safePose.leftUpperArm.y), r(safePose.leftUpperArm.z));
        bones.leftArm.lower.rotation.set(r(safePose.leftUpperArm.bendAngle || 0), 0, 0);

        bones.rightArm.upper.rotation.set(r(safePose.rightUpperArm.x), r(safePose.rightUpperArm.y), r(safePose.rightUpperArm.z));
        bones.rightArm.lower.rotation.set(r(safePose.rightUpperArm.bendAngle || 0), 0, 0);

        // Legs
        bones.leftLeg.upper.rotation.set(r(safePose.leftUpperLeg.x), r(safePose.leftUpperLeg.y), r(safePose.leftUpperLeg.z));
        bones.leftLeg.lower.rotation.set(r(safePose.leftUpperLeg.bendAngle || 0), 0, 0);

        bones.rightLeg.upper.rotation.set(r(safePose.rightUpperLeg.x), r(safePose.rightUpperLeg.y), r(safePose.rightUpperLeg.z));
        bones.rightLeg.lower.rotation.set(r(safePose.rightUpperLeg.bendAngle || 0), 0, 0);

    }, [pose, bones]);

    return (
        <group ref={groupRef} scale={0.125} position={[0, -2, 0]}>
            {/* 
        HIERARCHY:
        - Root (Skeleton)
          - Body
            - Head
            - Arms
        - Legs (Attached to Root, following Hip offset)
      */}
            <primitive object={root} />

            {/* Attach Rigid Meshes to Bones via Portals */}
            {createPortal(
                <group>
                    {/* Body Mesh: Offset to align pivot (Waist) with Geometry Center */}
                    <mesh geometry={rigidGeo.body} material={materials.body} position={[0, 6, 0]} />
                </group>,
                bones.body
            )}

            {createPortal(
                <group>
                    {/* Head Mesh: Offset to align Neck pivot with Head Center */}
                    <mesh geometry={rigidGeo.head} material={materials.head} position={[0, 4, 0]} />

                    {/* Facial Features */}
                    <group position={[0, 4, 0]}>
                        <mesh position={[(facial?.eyes?.x || 0) * 0.1, (facial?.eyes?.y || 0) * 0.1, 4.05]} geometry={rigidGeo.eye} material={eyeMat} />
                        <mesh position={[0, -2 - (facial?.mouth?.smile || 0) * 0.1, 4.05]} geometry={rigidGeo.mouth} material={mouthMat} />
                    </group>
                </group>,
                bones.head
            )}

            {/* Skinned Limb Meshes (Siblings of Skeleton, Bound to Bones) */}
            <primitive object={meshes.leftArm} />
            <primitive object={meshes.rightArm} />
            <primitive object={meshes.leftLeg} />
            <primitive object={meshes.rightLeg} />
        </group>
    );
}
