export interface Vec3 {
    x: number;
    y: number;
    z: number;
}

export interface BendableRotation extends Vec3 {
    bendAngle?: number; // Elbow/knee bend in degrees (for bendable model only)
}

export interface Facial {
    eyes?: { x: number; y: number; blink: number };
    mouth?: { smile: number; open: number };
    eyebrows?: { left: number; right: number };
}

export interface Attachment {
    item_code: string;
    offset: Vec3;
    rotation: Vec3;
}

export interface PoseMeta {
    name: string;
    description: string;
    category: string;
    tags: string[];
    isSymmetrical: boolean;
    difficulty: string;
    previewImgUrl: string;
}

export interface Pose {
    poseConfig: {
        leftUpperArm: BendableRotation;
        rightUpperArm: BendableRotation;
        leftUpperLeg: BendableRotation;
        rightUpperLeg: BendableRotation;
        head: Vec3;
        body: Vec3;
    };
    facial: Facial;
    attachments: {
        leftHand: Attachment;
        rightHand: Attachment;
    };
    poseMeta?: PoseMeta;
}

const PRESET_POSES: Record<string, Pose> = {
    standing: {
        poseConfig: {
            leftUpperArm: { x: 0, y: 0, z: 0, bendAngle: 0 },
            rightUpperArm: { x: 0, y: 0, z: 0, bendAngle: 0 },
            leftUpperLeg: { x: 0, y: 0, z: 0, bendAngle: 0 },
            rightUpperLeg: { x: 0, y: 0, z: 0, bendAngle: 0 },
            head: { x: 0, y: 0, z: 0 },
            body: { x: 0, y: 0, z: 0 },
        },
        facial: {
            eyes: { x: 0, y: 0, blink: 0 },
            mouth: { smile: 0, open: 0 },
            eyebrows: { left: 0, right: 0 },
        },
        attachments: {
            leftHand: { item_code: "", offset: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
            rightHand: { item_code: "", offset: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
        },
        poseMeta: {
            name: "Standing (Bendable)",
            description: "Neutral relaxed standing pose for bendable model.",
            category: "Bendable",
            tags: ["neutral", "idle", "standing", "bendable"],
            isSymmetrical: true,
            difficulty: "easy",
            previewImgUrl: "./poseLabsPose/standing.png",
        },
    },

    reaching: {
        poseConfig: {
            leftUpperArm: { x: 0, y: 0, z: 0, bendAngle: 0 },
            rightUpperArm: { x: -120, y: 20, z: 10, bendAngle: 60 },
            leftUpperLeg: { x: 0, y: 0, z: 0, bendAngle: 0 },
            rightUpperLeg: { x: 0, y: 0, z: 0, bendAngle: 0 },
            head: { x: -10, y: 15, z: 0 },
            body: { x: 0, y: 5, z: 0 },
        },
        facial: {
            eyes: { x: 0, y: 2, blink: 0 },
            mouth: { smile: 0.3, open: 0 },
            eyebrows: { left: 3, right: 3 },
        },
        attachments: {
            leftHand: { item_code: "", offset: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
            rightHand: { item_code: "", offset: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
        },
        poseMeta: {
            name: "Reaching Up",
            description: "Smooth arm reaching upward with natural elbow bend.",
            category: "Bendable",
            tags: ["reach", "smooth", "bendable"],
            isSymmetrical: false,
            difficulty: "medium",
            previewImgUrl: "./poseLabsPose/reaching.png",
        },
    },

    crouching: {
        poseConfig: {
            leftUpperArm: { x: 20, y: -10, z: -5, bendAngle: 30 },
            rightUpperArm: { x: 20, y: 10, z: 5, bendAngle: 30 },
            leftUpperLeg: { x: -70, y: -5, z: 0, bendAngle: 80 },
            rightUpperLeg: { x: -70, y: 5, z: 0, bendAngle: 80 },
            head: { x: 15, y: 0, z: 0 },
            body: { x: 10, y: 0, z: 0 },
        },
        facial: {
            eyes: { x: 0, y: -2, blink: 0 },
            mouth: { smile: 0, open: 0.1 },
            eyebrows: { left: -2, right: -2 },
        },
        attachments: {
            leftHand: { item_code: "", offset: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
            rightHand: { item_code: "", offset: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
        },
        poseMeta: {
            name: "Crouching",
            description: "Deep crouch with smooth knee bends.",
            category: "Bendable",
            tags: ["crouch", "sneak", "bendable"],
            isSymmetrical: true,
            difficulty: "medium",
            previewImgUrl: "./poseLabsPose/crouching.png",
        },
    },

    throwing: {
        poseConfig: {
            leftUpperArm: { x: -30, y: -15, z: -10, bendAngle: 20 },
            rightUpperArm: { x: -100, y: 45, z: 80, bendAngle: 90 },
            leftUpperLeg: { x: 25, y: 0, z: -5, bendAngle: 15 },
            rightUpperLeg: { x: -35, y: 0, z: 5, bendAngle: 25 },
            head: { x: 10, y: 25, z: 0 },
            body: { x: 5, y: 20, z: 10 },
        },
        facial: {
            eyes: { x: 0, y: 3, blink: 0 },
            mouth: { smile: 0, open: 0.4 },
            eyebrows: { left: 5, right: 5 },
        },
        attachments: {
            leftHand: { item_code: "", offset: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
            rightHand: { item_code: "snowball", offset: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
        },
        poseMeta: {
            name: "Throwing",
            description: "Dynamic throwing motion with natural arm wind-up.",
            category: "Bendable",
            tags: ["throw", "action", "bendable"],
            isSymmetrical: false,
            difficulty: "hard",
            previewImgUrl: "./poseLabsPose/throwing.png",
        },
    },
};

export default PRESET_POSES;
