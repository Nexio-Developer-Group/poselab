import * as THREE from "three";

export const createLimbMesh = (
    name: string,
    upperBone: THREE.Bone,
    lowerBone: THREE.Bone,
    matOrMats: THREE.Material | THREE.Material[],
    size: { w: number; h: number; d: number } = { w: 4, h: 12, d: 4 }
): THREE.SkinnedMesh => {

    /* -------------------------------------------------
     * 1️⃣ Geometry (pivot at TOP)
     * ------------------------------------------------- */
    const geometry = new THREE.BoxGeometry(size.w, size.h, size.d, 1, 32, 1);

    // Move geometry DOWN so top = y = 0
    geometry.translate(0, -size.h / 2, 0);
 
    /* -------------------------------------------------
     * 2️⃣ Skinning (MID JOINT)
     * ------------------------------------------------- */
    const pos = geometry.attributes.position;
    const skinIndices: number[] = [];
    const skinWeights: number[] = [];

    const jointY = -size.h / 2; // keep your visual joint

for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);

    if (y > jointY) {
        // 🔒 Upper arm: ABSOLUTELY RIGID
        skinIndices.push(0, 0, 0, 0);
        skinWeights.push(1, 0, 0, 0);
    } else {
        // 🔒 Lower arm: ABSOLUTELY RIGID
        skinIndices.push(1, 0, 0, 0);
        skinWeights.push(1, 0, 0, 0);
    }
}

    geometry.setAttribute("skinIndex", new THREE.Uint16BufferAttribute(skinIndices, 4));
    geometry.setAttribute("skinWeight", new THREE.Float32BufferAttribute(skinWeights, 4));

    /* -------------------------------------------------
     * 3️⃣ Mesh
     * ------------------------------------------------- */
    const mesh = new THREE.SkinnedMesh(geometry, matOrMats);
    mesh.name = name;
    mesh.frustumCulled = false;

    /* -------------------------------------------------
     * 4️⃣ Skeleton (IMPORTANT FIX)
     * ------------------------------------------------- */
    const skeleton = new THREE.Skeleton([upperBone, lowerBone]);

    // ❌ DO NOT move mesh to bone position
    // ❌ DO NOT use mesh.matrixWorld
    // ✔️ Minecraft-style local bind
    mesh.bind(skeleton);

    return mesh;
};
