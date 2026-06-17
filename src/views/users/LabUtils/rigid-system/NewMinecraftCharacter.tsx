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

/**
 * Module-level cache for CanvasTextures keyed by skin image src.
 * Avoids re-creating identical textures on every re-render and across
 * multiple character instances that share the same skin.
 * Limited to 5 entries to prevent unbounded memory growth.
 */
const textureCache = new Map<string, THREE.CanvasTexture>();

const MAX_TEXTURE_CACHE_SIZE = 5;

const getCachedTexture = (cacheKey: string, factory: () => THREE.CanvasTexture): THREE.CanvasTexture => {
    const cached = textureCache.get(cacheKey);
    if (cached) return cached;

    const texture = factory();

    // Evict oldest entry when cache is full
    if (textureCache.size >= MAX_TEXTURE_CACHE_SIZE) {
        const oldestKey = textureCache.keys().next().value;
        if (oldestKey !== undefined) {
            const oldTexture = textureCache.get(oldestKey);
            oldTexture?.dispose();
            textureCache.delete(oldestKey);
        }
    }

    textureCache.set(cacheKey, texture);
    return texture;
};

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

                // Build a stable cache key from skin src + face coordinates
                const cacheKey = `${skinImage?.src ?? 'noskin'}|${fx},${fy},${fw},${fh}`;

                const tex = getCachedTexture(cacheKey, () => {
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

                    const t = new THREE.CanvasTexture(canvas);
                    t.colorSpace = THREE.SRGBColorSpace;
                    t.magFilter = THREE.NearestFilter;
                    t.minFilter = THREE.NearestFilter;
                    t.generateMipmaps = false;
                    t.flipY = true; // Important for mapping to box faces
                    return t;
                });

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
