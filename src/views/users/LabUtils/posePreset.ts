const PRESET_POSES = {
  standing: {
    poseConfig: {
      leftUpperArm: { x: 0, y: 0, z: 0 },
      leftLowerArm: { x: 0, y: 0, z: 0 },
      rightUpperArm: { x: 0, y: 0, z: 0 },
      rightLowerArm: { x: 0, y: 0, z: 0 },
      leftUpperLeg: { x: 0, y: 0, z: 0 },
      leftLowerLeg: { x: 0, y: 0, z: 0 },
      rightUpperLeg: { x: 0, y: 0, z: 0 },
      rightLowerLeg: { x: 0, y: 0, z: 0 },
      head: { x: 0, y: 0, z: 0 },
      body: { x: 0, y: 0, z: 0 },
    },
    facial: {
      eyes: { x: 0, y: 0, blink: 0 },
      mouth: { smile: 0, open: 0 },
      eyebrows: { left: 0, right: 0 },
    },
    attachments: {
      leftHand: { item_code: "sword", offset: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
      rightHand: { item_code: "shield", offset: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
    },
    poseMeta: {
      name: "Standing",
      description: "Neutral relaxed pose with both legs straight.",
      category: "Idle",
      tags: ["neutral", "idle", "standing"],
      isSymmetrical: true,
      difficulty: "easy",
      previewImgUrl: "./poseLabsPose/standing.png",
    },
  },

  walking: {
    poseConfig: {
      leftUpperArm: { x: -20, y: 0, z: -5 },
      leftLowerArm: { x: -5, y: 0, z: 5 },
      rightUpperArm: { x: 20, y: 0, z: 5 },
      rightLowerArm: { x: 0, y: 0, z: 0 },
      leftUpperLeg: { x: 25, y: 0, z: -3 },
      leftLowerLeg: { x: 0, y: 0, z: 0 },
      rightUpperLeg: { x: -25, y: 0, z: 5 },
      rightLowerLeg: { x: 0, y: 0, z: 0 },
      head: { x: 0, y: 2, z: 5 },
      body: { x: 0, y: 0, z: 0 },
    },
    facial: {
      eyes: { x: 0, y: 0, blink: 0 },
      mouth: { smile: 0, open: 0 },
      eyebrows: { left: 0, right: 0 },
    },
    attachments: {
      leftHand: { item_code: "sword", offset: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
      rightHand: { item_code: "shield", offset: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
    },
    poseMeta: {
      name: "Walking",
      description: "A natural stride with swinging arms.",
      category: "Movement",
      tags: ["walk", "move", "stride"],
      isSymmetrical: false,
      difficulty: "easy",
      previewImgUrl: "./poseLabsPose/walking.png",
    },
  },

  waving: {
    poseConfig: {
      leftUpperArm: { x: 0, y: 0, z: 0 },
      leftLowerArm: { x: 0, y: 0, z: 0 },
      rightUpperArm: { x: -80, y: 0, z: 30 },
      rightLowerArm: { x: -45, y: 0, z: 15 },
      leftUpperLeg: { x: 0, y: 0, z: 0 },
      leftLowerLeg: { x: 0, y: 0, z: 0 },
      rightUpperLeg: { x: 0, y: 0, z: 0 },
      rightLowerLeg: { x: 0, y: 0, z: 0 },
      head: { x: 0, y: 15, z: 0 },
      body: { x: 0, y: 0, z: 0 },
    },
    facial: {
      eyes: { x: 0, y: 5, blink: 0 },
      mouth: { smile: 1, open: 0 },
      eyebrows: { left: 5, right: 5 },
    },
    attachments: {
      leftHand: { item_code: "", offset: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
      rightHand: { item_code: "", offset: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
    },
    poseMeta: {
      name: "Waving",
      description: "Friendly wave with right hand raised.",
      category: "Greeting",
      tags: ["wave", "hello", "interaction"],
      isSymmetrical: false,
      difficulty: "medium",
      previewImgUrl: "./poseLabsPose/waving.png",
    },
  },

  sitting: {
    poseConfig: {
      leftUpperArm: { x: 0, y: 0, z: 0 },
      leftLowerArm: { x: -30, y: 0, z: 0 },
      rightUpperArm: { x: 0, y: 0, z: 0 },
      rightLowerArm: { x: -30, y: 0, z: 0 },
      leftUpperLeg: { x: -45, y: 0, z: 0 },
      leftLowerLeg: { x: 45, y: 0, z: 0 },
      rightUpperLeg: { x: -45, y: 0, z: 0 },
      rightLowerLeg: { x: 45, y: 0, z: 0 },
      head: { x: 0, y: 0, z: 0 },
      body: { x: 0, y: 0, z: 0 },
    },
    facial: {
      eyes: { x: 0, y: 0, blink: 0 },
      mouth: { smile: 0.2, open: 0 },
      eyebrows: { left: 0, right: 0 },
    },
    attachments: {
      leftHand: { item_code: "", offset: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
      rightHand: { item_code: "", offset: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
    },
    poseMeta: {
      name: "Sitting",
      description: "Character in a relaxed sitting position.",
      category: "Idle",
      tags: ["sit", "rest", "idle"],
      isSymmetrical: true,
      difficulty: "easy",
      previewImgUrl: "./poseLabsPose/sitting.png",
    },
  },

  running: {
    poseConfig: {
      leftUpperArm: { x: -45, y: 0, z: 0 },
      leftLowerArm: { x: 0, y: 0, z: 0 },
      rightUpperArm: { x: 45, y: 0, z: 0 },
      rightLowerArm: { x: 0, y: 0, z: 0 },
      leftUpperLeg: { x: 45, y: 0, z: 0 },
      leftLowerLeg: { x: 0, y: 0, z: 0 },
      rightUpperLeg: { x: -45, y: 0, z: 0 },
      rightLowerLeg: { x: 0, y: 0, z: 0 },
      head: { x: 5, y: 0, z: 0 },
      body: { x: 5, y: 0, z: 0 },
    },
    facial: {
      eyes: { x: 0, y: 0, blink: 0 },
      mouth: { smile: 0, open: 0.3 },
      eyebrows: { left: 0, right: 0 },
    },
    attachments: {
      leftHand: { item_code: "sword", offset: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
      rightHand: { item_code: "", offset: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
    },
    poseMeta: {
      name: "Running",
      description: "Dynamic running motion with forward lean.",
      category: "Movement",
      tags: ["run", "sprint", "motion"],
      isSymmetrical: false,
      difficulty: "medium",
      previewImgUrl: "./poseLabsPose/running.png",
    },
  },

  combat: {
    poseConfig: {
      leftUpperArm: { x: -45, y: 30, z: 0 },
      leftLowerArm: { x: -90, y: 0, z: 0 },
      rightUpperArm: { x: -30, y: -45, z: 15 },
      rightLowerArm: { x: -60, y: 0, z: 0 },
      leftUpperLeg: { x: 15, y: 0, z: 0 },
      leftLowerLeg: { x: 0, y: 0, z: 0 },
      rightUpperLeg: { x: -15, y: 0, z: 0 },
      rightLowerLeg: { x: 0, y: 0, z: 0 },
      head: { x: 0, y: -15, z: 0 },
      body: { x: 0, y: -10, z: 0 },
    },
    facial: {
      eyes: { x: 0, y: -5, blink: 0 },
      mouth: { smile: 0, open: 0.2 },
      eyebrows: { left: -5, right: -5 },
    },
    attachments: {
      leftHand: { item_code: "shield", offset: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
      rightHand: { item_code: "sword", offset: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
    },
    poseMeta: {
      name: "Combat Ready",
      description: "Aggressive stance prepared for battle.",
      category: "Action",
      tags: ["combat", "fight", "battle"],
      isSymmetrical: false,
      difficulty: "hard",
      previewImgUrl: "./poseLabsPose/combat.png",
    },
  },
};


export default PRESET_POSES