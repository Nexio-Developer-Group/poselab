import * as THREE from 'three';

// ---------------- PRIMITIVES ----------------

export type Vec3 = [number, number, number]; // x, y, z
export type UV2 = [number, number]; // u, v

// ---------------- CONFIG SCHEMA ----------------

export interface RigidPartConfig {
    name: string;

    // Geometry
    size: Vec3; // Width, Height, Depth relative to the part logic

    // Transform
    pivot: Vec3; // The point around which this part rotates (Local space)
    position: Vec3; // Where this part attaches to the parent (Parent space)

    // Visuals
    textureOffset: UV2; // Top-left coordinate in the standard Minecraft skin

    // Hierarchy
    // A part can have children (e.g., Body -> Head)
    children?: RigidPartConfig[];

    // Constraints (Optional)
    rotationLimits?: {
        x?: [number, number];
        y?: [number, number];
        z?: [number, number];
    };
}

export interface RigDefinition {
    root: RigidPartConfig[]; // Top level parts (usually just Body or Hips)
}

// ---------------- RUNTIME STATE ----------------

export interface RigState {
    rotations: Record<string, THREE.Euler>; // Keyed by part name
    positions?: Record<string, THREE.Vector3>; // Optional position overrides
}
