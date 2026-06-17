import { RigState } from './types';
import * as THREE from 'three';

const e = (x: number, y: number, z: number) => new THREE.Euler(x * Math.PI / 180, y * Math.PI / 180, z * Math.PI / 180);

export const RIGID_POSES: Record<string, { poseConfig: RigState, poseMeta: { name: string, previewImgUrl?: string } }> = {
    standing: {
        poseMeta: { name: "Standing" },
        poseConfig: {
            rotations: {
                head: e(0, 0, 0),
                body: e(0, 0, 0),
                leftArm: e(0, 0, 0),
                rightArm: e(0, 0, 0),
                leftLeg: e(0, 0, 0),
                rightLeg: e(0, 0, 0),
            }
        }
    },
    walking: {
        poseMeta: { name: "Walking" },
        poseConfig: {
            rotations: {
                head: e(0, 0, 0),
                body: e(0, 0, 0),
                leftArm: e(-20, 0, 0),
                rightArm: e(20, 0, 0),
                leftLeg: e(20, 0, 0),
                rightLeg: e(-20, 0, 0),
            }
        }
    },
    zombie: {
        poseMeta: { name: "Zombie" },
        poseConfig: {
            rotations: {
                head: e(-10, 0, 0),
                body: e(0, 0, 0),
                leftArm: e(-90, 0, 0),
                rightArm: e(-90, 0, 0),
                leftLeg: e(0, 0, 0),
                rightLeg: e(0, 0, 0),
            }
        }
    },
    running: {
        poseMeta: { name: "Running" },
        poseConfig: {
            rotations: {
                head: e(5, 0, 0),
                body: e(10, 0, 0),
                leftArm: e(-60, 0, 0),
                rightArm: e(60, 0, 0),
                leftLeg: e(50, 0, 0),
                rightLeg: e(-40, 0, 0),
            }
        }
    },
    combat: {
        poseMeta: { name: "Combat" },
        poseConfig: {
            rotations: {
                head: e(0, -15, 0),
                body: e(5, -10, 0),
                leftArm: e(-45, 30, 0),
                rightArm: e(-30, -45, 15),
                leftLeg: e(15, 0, 0),
                rightLeg: e(-15, 0, 0),
            }
        }
    },
    sitting: {
        poseMeta: { name: "Sitting" },
        poseConfig: {
            rotations: {
                head: e(0, 0, 0),
                body: e(0, 0, 0),
                leftArm: e(0, 0, 0),
                rightArm: e(0, 0, 0),
                leftLeg: e(-90, 0, 0),
                rightLeg: e(-90, 0, 0),
            }
        }
    },
    waving: {
        poseMeta: { name: "Waving" },
        poseConfig: {
            rotations: {
                head: e(0, 15, 0),
                body: e(0, 5, 0),
                leftArm: e(0, 0, 0),
                rightArm: e(-120, 0, 30),
                leftLeg: e(0, 0, 0),
                rightLeg: e(0, 0, 0),
            }
        }
    },
};

export const BENDABLE_RIGID_POSES: Record<string, { poseConfig: RigState, poseMeta: { name: string, previewImgUrl?: string } }> = {
    standing: {
        poseMeta: { name: "Standing" },
        poseConfig: {
            rotations: {
                head: e(0, 0, 0),
                body: e(0, 0, 0),
                leftUpperArm: e(0, 0, 0),
                leftLowerArm: e(0, 0, 0),
                rightUpperArm: e(0, 0, 0),
                rightLowerArm: e(0, 0, 0),
                leftUpperLeg: e(0, 0, 0),
                leftLowerLeg: e(0, 0, 0),
                rightUpperLeg: e(0, 0, 0),
                rightLowerLeg: e(0, 0, 0),
            }
        }
    },
    walking: {
        poseMeta: { name: "Walking" },
        poseConfig: {
            rotations: {
                head: e(0, 0, 0),
                body: e(0, 0, 0),
                leftUpperArm: e(-20, 0, 0),
                leftLowerArm: e(-10, 0, 0),
                rightUpperArm: e(20, 0, 0),
                rightLowerArm: e(-10, 0, 0),
                leftUpperLeg: e(20, 0, 0),
                leftLowerLeg: e(10, 0, 0),
                rightUpperLeg: e(-20, 0, 0),
                rightLowerLeg: e(10, 0, 0),
            }
        }
    },
    running: {
        poseMeta: { name: "Running" },
        poseConfig: {
            rotations: {
                head: e(0, 0, 0),
                body: e(10, 0, 0),
                leftUpperArm: e(-60, 0, 0),
                leftLowerArm: e(-60, 0, 0),
                rightUpperArm: e(60, 0, 0),
                rightLowerArm: e(-60, 0, 0),
                leftUpperLeg: e(70, 0, 0),
                leftLowerLeg: e(20, 0, 0),
                rightUpperLeg: e(-50, 0, 0),
                rightLowerLeg: e(10, 0, 0)
            }
        }
    },
    combat: {
        poseMeta: { name: "Combat" },
        poseConfig: {
            rotations: {
                head: e(0, -15, 0),
                body: e(5, -10, 0),
                leftUpperArm: e(-45, 30, 0),
                leftLowerArm: e(-90, 0, 0),
                rightUpperArm: e(-30, -45, 15),
                rightLowerArm: e(-60, 0, 0),
                leftUpperLeg: e(20, -10, 0),
                leftLowerLeg: e(0, 0, 0),
                rightUpperLeg: e(-15, 10, 0),
                rightLowerLeg: e(0, 0, 0),
            }
        }
    },
    sitting: {
        poseMeta: { name: "Sitting" },
        poseConfig: {
            rotations: {
                head: e(0, 0, 0),
                body: e(0, 0, 0),
                leftUpperArm: e(0, 0, -10),
                leftLowerArm: e(-30, 0, 0),
                rightUpperArm: e(0, 0, 10),
                rightLowerArm: e(-30, 0, 0),
                leftUpperLeg: e(-90, 0, 0),
                leftLowerLeg: e(90, 0, 0),
                rightUpperLeg: e(-90, 0, 0),
                rightLowerLeg: e(90, 0, 0),
            }
        }
    },
};
