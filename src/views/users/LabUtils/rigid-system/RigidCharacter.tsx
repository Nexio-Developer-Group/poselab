import React, { useMemo } from 'react';
import * as THREE from 'three';
import { RigDefinition, RigState, RigidPartConfig } from './types';
import { RigidPart } from './RigidPart';

interface RigidCharacterProps {
    definition: RigDefinition;
    pose: RigState;

    // Strategy for materials: Function that returns material(s) for a config
    // This allows adhering to "clean architecture" by decoupling Texture logic from Rig logic
    materialFactory: (config: RigidPartConfig) => THREE.Material | THREE.Material[];
}

export const RigidCharacter: React.FC<RigidCharacterProps> = ({
    definition,
    pose,
    materialFactory
}) => {
    const { root } = definition;

    return (
        <group>
            {root.map(partConfig => (
                <RigidPart
                    key={partConfig.name}
                    config={partConfig}
                    rigState={pose}
                    materialFactory={materialFactory}
                />
            ))}
        </group>
    );
};
