import * as THREE from "three";

export interface CharacterSkeleton {
    root: THREE.Bone;
    bones: {
        body: THREE.Bone;
        head: THREE.Bone;
        leftArm: { upper: THREE.Bone; lower: THREE.Bone };
        rightArm: { upper: THREE.Bone; lower: THREE.Bone };
        leftLeg: { upper: THREE.Bone; lower: THREE.Bone };
        rightLeg: { upper: THREE.Bone; lower: THREE.Bone };
    };
    skeleton: THREE.Skeleton;
}

export const createCharacterSkeleton = (): CharacterSkeleton => {
    // 1. Create all bones
    const root = new THREE.Bone();
    root.name = "Root";

    const body = new THREE.Bone();
    body.name = "Body";

    const head = new THREE.Bone();
    head.name = "Head";

    // Arms
    const leftArmUpper = new THREE.Bone(); leftArmUpper.name = "LeftArm_Upper";
    const leftArmLower = new THREE.Bone(); leftArmLower.name = "LeftArm_Lower";

    const rightArmUpper = new THREE.Bone(); rightArmUpper.name = "RightArm_Upper";
    const rightArmLower = new THREE.Bone(); rightArmLower.name = "RightArm_Lower";

    // Legs
    const leftLegUpper = new THREE.Bone(); leftLegUpper.name = "LeftLeg_Upper";
    const leftLegLower = new THREE.Bone(); leftLegLower.name = "LeftLeg_Lower";

    const rightLegUpper = new THREE.Bone(); rightLegUpper.name = "RightLeg_Upper";
    const rightLegLower = new THREE.Bone(); rightLegLower.name = "RightLeg_Lower";

    // 2. Build Hierarchy
    // Root -> Body, Legs (Legs are usually independent of Waist rotation in simple rigs, or child of Hip)
    // Here we treat Root as the ground/main pivot.
    // Body (Waist) is at proper height.
    // Legs are also at proper height.

    root.add(body);
    root.add(leftLegUpper);
    root.add(rightLegUpper);

    // Body children
    body.add(head);
    body.add(leftArmUpper);
    body.add(rightArmUpper);

    // Limb chains
    leftArmUpper.add(leftArmLower);
    rightArmUpper.add(rightArmLower);
    leftLegUpper.add(leftLegLower);
    rightLegUpper.add(rightLegLower);

    // 3. Set Rest Positions (Bind Pose)
    // All units are relative to the parent.
    // Coordinate System: Y is Up.

    // Body: Pivot at Waist (Y=12)

    // Head: Attached to top of Body (Y=12 relative to Body -> Y=24 World)
    head.position.set(0, 12, 0);
    body.position.set(0, 22, 0);


    // Arms: Attached to Shoulders (Y=12 relative to Body -> Y=24 World)
    // X offsets: Body width 8 (-4 to 4). Arms start at +/- 4? Center is at +/- 6.
    leftArmUpper.position.set(-3, 3, 0);
    rightArmUpper.position.set(3, 3, 0);

    leftArmLower.position.set(0, -6, 0);
rightArmLower.position.set(0, -6, 0);


    // Legs: Attached to Hips (World Y=12). Siblings of Body.
    // Root is at (0,0,0). So Legs need to go up to 12.
    leftLegUpper.position.set(-1, 8, 0);
    rightLegUpper.position.set(1, 8, 0);

   leftLegLower.position.set(0, -6, 0);
rightLegLower.position.set(0, -6, 0);

    // 4. Create Skeleton wrapper
    // We include ALL bones in the list for the Skeleton to manage matrices
    const bonesList = [
        root, body, head,
        leftArmUpper, leftArmLower,
        rightArmUpper, rightArmLower,
        leftLegUpper, leftLegLower,
        rightLegUpper, rightLegLower
    ];
    const skeleton = new THREE.Skeleton(bonesList);

    return {
        root,
        bones: {
            body,
            head,
            leftArm: { upper: leftArmUpper, lower: leftArmLower },
            rightArm: { upper: rightArmUpper, lower: rightArmLower },
            leftLeg: { upper: leftLegUpper, lower: leftLegLower },
            rightLeg: { upper: rightLegUpper, lower: rightLegLower },
        },
        skeleton
    };
};
