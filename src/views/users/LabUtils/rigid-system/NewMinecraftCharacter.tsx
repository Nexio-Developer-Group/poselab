import React, { useMemo } from 'react';
import * as THREE from 'three';
import { createMinecraftRig } from './minecraftRig';
import { RigidCharacter } from './RigidCharacter';
import { RigidPartConfig, RigState } from './types';

interface NewMinecraftCharacterProps {
    skinImage: HTMLImageElement;
    pose: any;
    bendable?: boolean;
}

export const NewMinecraftCharacter: React.FC<NewMinecraftCharacterProps> = ({ skinImage, pose, bendable = false }) => {
    // 1. Create Rig Definition
    const rigDefinition = useMemo(() => createMinecraftRig(bendable), [bendable]);

    // 2. Material Factory
    const materialFactory = useMemo(() => {
        return (config: RigidPartConfig) => {
            const [u, v] = config.textureOffset;
            const [w, h, d] = config.size;

            // Texture mapping for standard Minecraft box projection
            const faces = [
                { name: 'right', rect: [u, v + d, d, h] },
                { name: 'left', rect: [u + d + w, v + d, d, h] },
                { name: 'top', rect: [u + d, v, w, d] },
                { name: 'bottom', rect: [u + d + w, v, w, d] },
                { name: 'front', rect: [u + d, v + d, w, h] },
                { name: 'back', rect: [u + d + w + d, v + d, w, h] },
            ];

            return faces.map(face => {
                const [fx, fy, fw, fh] = face.rect;

                const canvas = document.createElement('canvas');
                // Scale for crisp pixels
                const scale = 4;
                canvas.width = fw * scale;
                canvas.height = fh * scale;
                const ctx = canvas.getContext('2d');

                if (ctx) {
                    ctx.imageSmoothingEnabled = false;
                    if (skinImage) {
                        ctx.drawImage(skinImage, fx, fy, fw, fh, 0, 0, fw * scale, fh * scale);
                    } else {
                        ctx.fillStyle = '#777';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                    }
                }

                const tex = new THREE.CanvasTexture(canvas);
                tex.colorSpace = THREE.SRGBColorSpace;
                tex.magFilter = THREE.NearestFilter;
                tex.minFilter = THREE.NearestFilter;
                tex.generateMipmaps = false;
                tex.flipY = true; // Important for mapping to box faces

                return new THREE.MeshStandardMaterial({
                    map: tex,
                    transparent: true,
                    alphaTest: 0.1,
                    roughness: 0.9,
                    metalness: 0.0
                });
            });
        };
    }, [skinImage]);

    return (
        <group scale={0.12} position={[0, -2, 0]}>
            <RigidCharacter
                definition={rigDefinition}
                pose={pose}
                materialFactory={materialFactory}
            />
        </group>
    );
};
