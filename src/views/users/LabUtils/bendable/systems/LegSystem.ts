import * as THREE from "three";
import { createLimbMesh } from "./LimbBuilder";

export const createLeftLeg = (
    bones: { upper: THREE.Bone; lower: THREE.Bone },
    materials: THREE.Material[]
) => {
    return createLimbMesh("LeftLeg", bones.upper, bones.lower, materials);
};

export const createRightLeg = (
    bones: { upper: THREE.Bone; lower: THREE.Bone },
    materials: THREE.Material[]
) => {
    return createLimbMesh("RightLeg", bones.upper, bones.lower, materials);
};
