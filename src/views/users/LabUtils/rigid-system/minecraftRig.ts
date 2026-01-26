import { RigDefinition, RigidPartConfig } from './types';

// Constants for Steve
const BODY_W = 8, BODY_H = 12, BODY_D = 4;
const HEAD_S = 8;
const LIMB_W = 4, LIMB_H = 12, LIMB_D = 4;

// ---------------- STANDARD RIG ----------------

const standardHead: RigidPartConfig = {
    name: 'head',
    size: [HEAD_S, HEAD_S, HEAD_S],
    pivot: [0, -HEAD_S / 2, 0], // Pivot at bottom center
    position: [0, BODY_H, 0],   // Top of body
    textureOffset: [0, 0] // 0,0 in 64x64 grid often implies generic handling
};

const standardLeftArm: RigidPartConfig = {
    name: 'leftArm',
    size: [LIMB_W, LIMB_H, LIMB_D],
    // Pivot is offset from the CENTER of the geometry to the rotation point.
    // BoxGeometry is centered at (0,0,0).
    // Rotation point (Shoulder) is Top Center of arm: (0, H/2, 0).
    pivot: [0, LIMB_H / 2, 0],
    position: [-6, BODY_H - 2, 0], // Attached near top of body
    textureOffset: [32, 48]
};
// Correction: Standard MC rig arms attach at shoulders (Body Height approx).
// Body Top is 12 (relative to waist 0).
// Head is at 12.
// Arms at 10? (2 units down).

export const createMinecraftRig = (bendable: boolean): RigDefinition => {
    // Shared Body
    const body: RigidPartConfig = {
        name: 'body',
        size: [BODY_W, BODY_H, BODY_D],
        pivot: [0, -BODY_H / 2, 0], // Pivot at bottom (Waist)
        position: [0, 12, 0],       // Waist Height in World
        textureOffset: [16, 16],
        children: []
    };

    // Head (Same for both)
    // Pivot relative to Body Top (which is local Y = BODY_H/2... wait)
    // RigidPart Logic:
    // Mesh is at -pivot.
    // Child is at 'position' relative to Parent Origin.
    // Parent Origin (Body) is Waist (Bottom of geometry + height/2? No).
    // Body Pivot = [0, -6, 0].
    // Mesh is at [0, 6, 0].
    // Mesh Top is at 12.
    // Mesh Bottom is at 0.
    // So 'position' for Head (Neck) should be [0, 12, 0].

    // Head Config
    const head: RigidPartConfig = {
        name: 'head',
        size: [8, 8, 8],
        pivot: [0, -4, 0], // Pivot at bottom of head
        position: [0, 12, 0], // relative to Body Pivot (Waist) ??
        // Wait. Body Mesh is from 0 to 12.
        // Body Pivot is at 0 (Waist).
        // So Head attaches at 12. Yes.
        textureOffset: [0, 0]
    };
    body.children?.push(head);

    // Limbs helper
    const addLimb = (name: string, side: 'left' | 'right', type: 'arm' | 'leg') => {
        const isArm = type === 'arm';
        const xSign = side === 'left' ? -1 : 1;

        // Position relative to Waist (0,0,0)
        // Arms: Top of body (12) - 2 = 10? Or 12 (flush)? Usually 2 units down from top.
        const yPos = isArm ? 12 : 0; // Legs attach at 0 (Waist/Hips)

        // Fix for Leg Position: Legs are under the body (offset 2), Arms are on side (offset 6)
        const centerDist = isArm ? 6 : 2;
        const xPos = xSign * centerDist;

        // Determine Base Texture Offsets
        let baseU = 0;
        let baseV = 0;

        if (isArm) {
            if (side === 'right') { baseU = 40; baseV = 16; } // Standard Right Arm
            else { baseU = 32; baseV = 48; } // Alex Left Arm
        } else {
            if (side === 'right') { baseU = 0; baseV = 16; } // Standard Right Leg
            else { baseU = 16; baseV = 48; } // Standard Left Leg
        }

        if (!bendable) {
            // Standard Rigid Limb
            const limb: RigidPartConfig = {
                name: `${side}${isArm ? 'Arm' : 'Leg'}`,
                size: [4, 12, 4],
                pivot: [0, 6, 0], // Top pivot
                position: [xPos, yPos, 0],
                textureOffset: [baseU, baseV]
            };
            body.children?.push(limb);
        } else {
            // Bendable (Split) Limb
            const uName = `${side}Upper${isArm ? 'Arm' : 'Leg'}`;
            const lName = `${side}Lower${isArm ? 'Arm' : 'Leg'}`;

            const upper: RigidPartConfig = {
                name: uName,
                size: [4, 8, 4],
                pivot: [0, 4, 0], // Top of Upper
                position: [xPos, yPos, 0],
                textureOffset: [baseU, baseV],
                children: []
            };

            const lower: RigidPartConfig = {
                name: lName,
                size: [4, 8, 4],
                pivot: [0, 3, 0], // Top of Lower (Elbow)
                position: [0, -6.5, -0.2], // Attach to bottom of upper
                textureOffset: [baseU, baseV + 4] // Offset by 6 pixels (height of upper) relative to limb strip? 
                // Wait. 
                // Upper: 4x6x4. v to v+6 (box height). 
                // Lower: 4x6x4. v+6 to v+12.
                // 
                // Let's check calculation again.
                // Box Front mapped at v+d. d=4.
                // Upper Front starts at baseV+4. Ends at baseV+4+6 = baseV+10.
                // Lower Front should start at...
                // If Lower Offset is baseV+6.
                // Lower Front starts at (baseV+6)+4 = baseV+10.
                // Yes, checking out.
            };

            upper.children?.push(lower);
            body.children?.push(upper);
        }
    };

    addLimb('leftArm', 'left', 'arm');
    addLimb('rightArm', 'right', 'arm');
    addLimb('leftLeg', 'left', 'leg');
    addLimb('rightLeg', 'right', 'leg');

    return { root: [body] };
};
