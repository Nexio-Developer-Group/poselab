import * as THREE from "three";
import { createLimbMesh } from "./LimbBuilder";

export const createLeftArm = (
    bones: { upper: THREE.Bone; lower: THREE.Bone },
    materials: THREE.Material[]
) => {
    return createLimbMesh("LeftArm", bones.upper, bones.lower, materials);
};

export const createRightArm = (
    bones: { upper: THREE.Bone; lower: THREE.Bone },
    materials: THREE.Material[]
) => {
    return createLimbMesh("RightArm", bones.upper, bones.lower, materials);
};
