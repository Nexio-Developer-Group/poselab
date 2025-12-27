import { useState, useEffect } from "react";
import { QualityLevel } from "./../qualitySettings";

/**
 * Detects device capabilities and suggests optimal quality level
 * Can be overridden by user preference
 */
export const useDeviceQuality = () => {
  const [autoDetectedQuality, setAutoDetectedQuality] = useState<QualityLevel>("medium");
  const [userQuality, setUserQuality] = useState<QualityLevel | null>(null);
  const [fps, setFps] = useState(60);
  
  useEffect(() => {
    const detectQuality = (): QualityLevel => {
      // GPU capability check
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
    
    // Load user preference if exists
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