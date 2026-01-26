import React, { useMemo } from 'react';
import * as THREE from 'three';
import { RigidPartConfig, RigState } from './types';

interface RigidPartProps {
    config: RigidPartConfig;
    rigState: RigState;
    materialFactory: (config: RigidPartConfig) => THREE.Material | THREE.Material[];
}

export const RigidPart: React.FC<RigidPartProps> = ({ config, rigState, materialFactory }) => {
    const { name, size, pivot, position, children } = config;
    const [w, h, d] = size;

    // 1. Resolve Pose Rotation
    // Default to 0 if not targeted
    const rotationEuler = rigState.rotations[name] || new THREE.Euler(0, 0, 0);

    // 2. Geometry Creation
    const geometry = useMemo(() => new THREE.BoxGeometry(w, h, d), [w, h, d]);

    // Resolve material for THIS part
    const material = useMemo(() => materialFactory(config), [config, materialFactory]);

    return (
        <group position={new THREE.Vector3(...position)} rotation={rotationEuler}>
            {/* The Visual Part */}
            <mesh
                geometry={geometry}
                material={material}
                position={new THREE.Vector3(-pivot[0], -pivot[1], -pivot[2])}
                castShadow
                receiveShadow
            />

            {/* Recursively Render Children */}
            {children?.map((childConfig) => (
                <RigidPart
                    key={childConfig.name}
                    config={childConfig}
                    rigState={rigState}
                    materialFactory={materialFactory}
                />
            ))}
        </group>
    );
};
