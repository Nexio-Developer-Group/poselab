import { useState, useEffect } from "react";
import { QualityLevel } from "./../qualitySettings";

/**
 * Synchronously estimates quality from CPU/memory hints (no WebGL context needed).
 * Used as the initial value to avoid a quality-drop flash on first render.
 */
const estimateInitialQuality = (): QualityLevel => {
  // Check for saved user preference first
  try {
    const saved = localStorage.getItem("userQualityPreference");
    if (saved) return saved as QualityLevel;
  } catch {
    // localStorage may be unavailable in some contexts
  }

  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as any).deviceMemory as number | undefined; // GB, if available

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  if (isMobile) {
    return memory && memory >= 4 ? "medium" : "low";
  }

  if (cores >= 8 && memory && memory >= 8) return "high";
  if (cores >= 4 && memory && memory >= 4) return "medium";
  if (cores >= 4) return "medium";
  return "low";
};

/**
 * Detects device capabilities and suggests optimal quality level
 * Can be overridden by user preference
 */
export const useDeviceQuality = () => {
  // Initialise synchronously so the very first render already uses the right quality
  const [autoDetectedQuality, setAutoDetectedQuality] = useState<QualityLevel>(
    () => estimateInitialQuality()
  );
  const [userQuality, setUserQuality] = useState<QualityLevel | null>(() => {
    try {
      const saved = localStorage.getItem("userQualityPreference");
      return saved ? (saved as QualityLevel) : null;
    } catch {
      return null;
    }
  });
  const [fps, setFps] = useState(60);

  useEffect(() => {
    // Refine quality estimate using WebGL info (runs asynchronously after mount)
    const detectQuality = (): QualityLevel => {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");

      if (!gl) return "low";

      const renderer = gl.getParameter(gl.RENDERER);
      const vendor = gl.getParameter(gl.VENDOR);

      // Check max texture size (proxy for GPU power)
      const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);

      // Memory check (if available)
      const memory = (performance as any).memory?.jsHeapSizeLimit || 0; // eslint-disable-line

      // Device type detection
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

      // RTX or high-end GPU detection
      const isHighEndGPU = /NVIDIA|GeForce RTX|Radeon RX|Apple M[0-9]|Metal/i.test(
        renderer + vendor
      );

      // Quality determination logic
      if (isMobile) {
        return memory > 2e9 ? "medium" : "low";
      }

      if (isHighEndGPU && maxTextureSize >= 16384 && memory > 4e9) {
        return "ultra";
      }

      if (maxTextureSize >= 8192 && memory > 4e9) {
        return "high";
      }

      if (maxTextureSize >= 4096 && memory > 2e9) {
        return "medium";
      }

      return "low";
    };

    const quality = detectQuality();
    setAutoDetectedQuality(quality);

    // Load user preference if exists (re-confirm after mount)
    const savedQuality = localStorage.getItem("userQualityPreference");
    if (savedQuality) {
      setUserQuality(savedQuality as QualityLevel);
    }
  }, []);

  const setQuality = (level: QualityLevel) => {
    setUserQuality(level);
    localStorage.setItem("userQualityPreference", level);
  };

  const resetToAuto = () => {
    setUserQuality(null);
    localStorage.removeItem("userQualityPreference");
  };

  // Adaptive quality based on FPS (optional feature)
  const updateFPS = (currentFPS: number) => {
    setFps(currentFPS);
  };

  const activeQuality = userQuality || autoDetectedQuality;

  return {
    quality: activeQuality,
    autoDetectedQuality,
    isUserOverride: userQuality !== null,
    setQuality,
    resetToAuto,
    fps,
    updateFPS,
  };
};
