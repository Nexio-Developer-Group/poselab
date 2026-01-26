import { useState, useRef, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, GizmoHelper, GizmoViewport } from "@react-three/drei";

import { MinecraftCharacter } from "./standard/MinecraftCharacter";
import { BendableMinecraftCharacter } from "./bendable/BendableMinecraftCharacter";
import { PoseControls as StandardPoseControls } from "./standard/PoseControls";
import { PoseControls as BendablePoseControls } from "./bendable/PoseControls";

import STANDARD_POSES from "./standard/posePresets";
import BENDABLE_POSES from "./bendable/posePresets";
import { NewMinecraftCharacter } from "./rigid-system/NewMinecraftCharacter";
import { RIGID_POSES, BENDABLE_RIGID_POSES } from "./rigid-system/posePresets";

import { LightingControls, Light } from "./LightingControls";
import { LightRenderer } from "./LightRenderer";
import { RenderDialog, RenderSettings } from "./RenderDialog";
import { createHighQualityRender } from "./renderUtils";
import { Camera, Upload, Download, RotateCcw, Lightbulb, Gpu, Box, Accessibility, Smile, LogOut, RotateCw } from "lucide-react";
import { toast } from "sonner";
import * as THREE from "three";
import { QualitySetting } from "./QualitySetting";
import { getQualityPreset } from "./qualitySettings";
import { useDeviceQuality } from "./hooks/useDeviceQuality";
import { enhanceSceneMaterials } from "./pbrMaterials";
import { cn } from "@/lib/utils";

export interface CharacterViewerProps {
  skinImage: HTMLImageElement;
  onChangeSkinClick: (el: HTMLElement) => void;
  pose?: any; // Accepting any pose config as it varies by model
}

export const CharacterViewer = ({ skinImage, onChangeSkinClick, pose }: CharacterViewerProps) => {
  const [characterModel, setCharacterModel] = useState<'default' | 'bendable' | 'new_rigid' | 'new_bendable'>('default');

  const activePresets =
    characterModel === 'default' ? STANDARD_POSES :
      characterModel === 'bendable' ? BENDABLE_POSES :
        characterModel === 'new_rigid' ? RIGID_POSES :
          BENDABLE_RIGID_POSES;
  const defaultPose = activePresets.standing || Object.values(activePresets)[0];

  const [currentPose, setCurrentPose] = useState(pose || defaultPose);
  const [selectedPreset, setSelectedPreset] = useState("standing");

  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);
  const [renderDialogOpen, setRenderDialogOpen] = useState(false);
  const [lights, setLights] = useState<Light[]>([
    { id: "light-1", type: "directional", position: [10, 10, 5], color: "#ffffff", intensity: 1.2 },
    { id: "light-2", type: "directional", position: [-10, 5, -5], color: "#ffffff", intensity: 0.3 },
  ]);

  const deviceQuality = useDeviceQuality();
  const qualityPreset = getQualityPreset(deviceQuality.quality);

  useEffect(() => {
    if (sceneRef.current) enhanceSceneMaterials(sceneRef.current, undefined, qualityPreset);
  }, [qualityPreset]);

  const handleModelChange = (model: 'default' | 'bendable' | 'new_rigid' | 'new_bendable') => {
    if (model === characterModel) return;

    // Get the correct presets for the NEW model
    const newPresets =
      model === 'default' ? STANDARD_POSES :
        model === 'bendable' ? BENDABLE_POSES :
          model === 'new_rigid' ? RIGID_POSES :
            BENDABLE_RIGID_POSES;
    const newDefault = newPresets.standing || Object.values(newPresets)[0];

    // Update everything in one batch to ensure they stay in sync
    // This is critical to prevent passing a Bendable pose to the Standard renderer
    setCharacterModel(model);
    setCurrentPose(newDefault);
    setSelectedPreset("standing");

    toast(`Switched to ${newDefault.poseMeta?.name || "Default"} for ${model} model`);
  };

  const handlePoseChange = (bodyPart: string, axis: string, value: number) => {
    setCurrentPose((prev: any) => ({
      ...prev,
      poseConfig: {
        ...prev.poseConfig,
        [bodyPart]: {
          ...prev.poseConfig[bodyPart],
          [axis]: value,
        },
      },
    }));
    setSelectedPreset("custom");
  };

  const handlePresetChange = (preset: string) => {
    // @ts-ignore
    setCurrentPose(activePresets[preset]);
    setSelectedPreset(preset);
  };

  const resetPose = () => {
    // @ts-ignore
    setCurrentPose(activePresets.standing || Object.values(activePresets)[0]);
    setSelectedPreset("standing");
    toast("Pose reset to standing");
  };

  const takeScreenshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return toast.error("Canvas not found");
    const link = document.createElement("a");
    link.download = "minecraft-character.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast.success("Screenshot saved!");
  };

  const handleHighQualityRender = async (settings: RenderSettings, onProgress: (progress: number) => void) => {
    if (!sceneRef.current || !cameraRef.current) throw new Error("Scene not ready");
    return await createHighQualityRender(sceneRef.current, cameraRef.current, settings, onProgress);
  };

  const SidebarButton = ({ icon: Icon, label, active, onClick }: { icon: any; label: string; active?: boolean; onClick?: () => void }) => (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 group transition-all duration-200",
        active ? "text-blue-400" : "text-gray-500 hover:text-gray-300"
      )}
    >
      <div className={cn(
        "p-3 rounded-xl transition-all duration-200",
        active ? "bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.3)] ring-1 ring-blue-500/50" : "group-hover:bg-white/5"
      )}>
        <Icon className="w-6 h-6" />
      </div>
      <span className="text-[10px] font-bold tracking-widest">{label}</span>
    </button>
  );

  const BottomControlGroup = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex flex-col items-center px-6 border-r border-white/5 last:border-0 gap-3">
      <span className="text-[10px] font-bold tracking-widest text-gray-500">{label}</span>
      <div className="flex gap-2">
        {children}
      </div>
    </div>
  );

  const ControlButton = ({ icon: Icon, active, onClick }: { icon: any; active?: boolean; onClick?: () => void }) => (
    <button
      onClick={onClick}
      className={cn(
        "p-2 rounded-lg border transition-all duration-200",
        active
          ? "bg-blue-500/10 border-blue-500/50 text-blue-400"
          : "bg-white/5 border-white/5 text-gray-400 hover:border-white/20 hover:text-white"
      )}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  return (
    <div className="relative w-full flex overflow-hidden text-white font-sans" style={{ backgroundColor: '#020202' }}>
      {/* Sidebar */}
      <aside className="w-24 min-h-[calc(100vh-12rem)] border-r border-white/5 flex flex-col items-center py-8 gap-10 bg-gray-900">

        <SidebarButton
          icon={Accessibility}
          label="POSE"
          active={openPanel === "poses" || openPanel === "poseControls"}
          onClick={() => setOpenPanel(openPanel === "poses" ? "poseControls" : "poses")}
        />
        <SidebarButton
          icon={Smile}
          label="FACE"
          active={openPanel === "expressions"}
          onClick={() => setOpenPanel("expressions")}
        />
        <SidebarButton
          icon={Lightbulb}
          label="LIGHT"
          active={openPanel === "lighting"}
          onClick={() => setOpenPanel("lighting")}
        />
        <SidebarButton
          icon={Gpu}
          label="GFX"
          active={openPanel === "quality"}
          onClick={() => setOpenPanel("quality")}
        />

        <div className="mt-auto flex flex-col gap-6 items-center">
          <button className="text-gray-500 hover:text-white transition-colors" onClick={() => setRenderDialogOpen(true)}>
            <Download className="w-5 h-5" />
          </button>
          <button className="text-gray-500 hover:text-red-400 transition-colors" onClick={(e) => onChangeSkinClick(e.currentTarget)}>
            <Upload className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative flex flex-col" style={{ backgroundColor: '#020202' }}>
        {/* Header/Breadcrumbs Overlay */}
        <div className="absolute top-8 left-10 z-50 flex items-center gap-3">
          <div className="flex items-center gap-3 px-5 py-2.5 bg-gray-900/40 border border-white/10 rounded-2xl backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.3)]">
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] animate-pulse">PoseLab.gg</span>
            <span className="text-xs text-gray-600">/</span>
            <span className="text-[10px] font-black text-white uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded">Pose Editor</span>
          </div>
        </div>

        {/* <button
          onClick={takeScreenshot}
          className="absolute top-8 right-10 z-50 p-4 bg-gray-900/40 border border-white/10 rounded-2xl hover:bg-primary/20 hover:border-primary/50 transition-all backdrop-blur-2xl text-white group shadow-2xl"
        >
          <Camera className="w-5 h-5 group-hover:scale-125 transition-transform" />
        </button> */}

        {/* Canvas Area */}
        <div className="h-full relative overflow-hidden" style={{ backgroundColor: '#020202' }}>

          {/* Ambient Glows - Cinematic Lighting behind character */}
          <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-blue-600/20 blur-[140px] rounded-full z-0 opacity-80" />
          <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-purple-600/20 blur-[140px] rounded-full z-0 opacity-80" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-primary/5 blur-[100px] rounded-full z-0" />

          <Canvas
            ref={canvasRef}
            camera={{ position: [0, 2, 12], fov: 45 }}
            gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true }}
            className="z-10 relative" // Added relative to ensure z-index works on the R3F wrapper
            onCreated={({ scene, camera }) => {
              sceneRef.current = scene;
              cameraRef.current = camera;
            }}
          >
            <ambientLight intensity={1.2} />
            <LightRenderer lights={lights} />
            <GizmoHelper alignment="bottom-left" margin={[80, 80]}>
              <GizmoViewport axisColors={["#ff3653", "#8adb00", "#2c8fff"]} labelColor="white" />
            </GizmoHelper>
            <Suspense fallback={null}>
              {characterModel === 'default' ? (
                <MinecraftCharacter
                  skinImage={skinImage}
                  pose={currentPose.poseConfig}
                />
              ) : characterModel === 'bendable' ? (
                <BendableMinecraftCharacter
                  skinImage={skinImage}
                  pose={currentPose.poseConfig}
                  facial={currentPose.facial}
                />
              ) : (
                <NewMinecraftCharacter
                  skinImage={skinImage}
                  pose={currentPose.poseConfig} // Pass RigState directly
                  bendable={characterModel === 'new_bendable'}
                />
              )}
            </Suspense>
            <OrbitControls enablePan enableZoom enableRotate />
            <Environment preset="sunset" />
          </Canvas>
        </div>

        {/* Bottom Bar */}
        <div className="flex absolute right-5 top-5 items-center z-10 bg-gray-800/40 border border-white/5 rounded-2xl p-2 px-4 shadow-2xl backdrop-blur-xl">
          <BottomControlGroup label="MODEL">
            <button
              onClick={() => handleModelChange('default')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest transition-all duration-200 border",
                characterModel === 'default'
                  ? "bg-blue-500/10 border-blue-500/50 text-blue-400"
                  : "bg-white/5 border-white/5 text-gray-400 hover:border-white/20"
              )}
            >
              STANDARD
            </button>
            {/* <button
                onClick={() => handleModelChange('bendable')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest transition-all duration-200 border",
                  characterModel === 'bendable'
                    ? "bg-blue-500/10 border-blue-500/50 text-blue-400"
                    : "bg-white/5 border-white/5 text-gray-400 hover:border-white/20"
                )}
              >
                BENDABLE
              </button> */}
          </BottomControlGroup>

          {/* <BottomControlGroup label="NEW SYSTEM">
              <button
                onClick={() => handleModelChange('new_rigid')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest transition-all duration-200 border",
                  characterModel === 'new_rigid'
                    ? "bg-purple-500/10 border-purple-500/50 text-purple-400"
                    : "bg-white/5 border-white/5 text-gray-400 hover:border-white/20"
                )}
              >
                RIGID
              </button>
              <button
                onClick={() => handleModelChange('new_bendable')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest transition-all duration-200 border",
                  characterModel === 'new_bendable'
                    ? "bg-purple-500/10 border-purple-500/50 text-purple-400"
                    : "bg-white/5 border-white/5 text-gray-400 hover:border-white/20"
                )}
              >
                BENDABLE
              </button>
            </BottomControlGroup> */}

          {/* <BottomControlGroup label="JOINTS">
              <ControlButton icon={Accessibility} active />
              <ControlButton icon={Accessibility} />
            </BottomControlGroup>

            <BottomControlGroup label="VIEW">
              <ControlButton icon={RotateCcw} onClick={resetPose} />
              <ControlButton icon={RotateCw} />
            </BottomControlGroup> */}

          <BottomControlGroup label="UTILITY">
            <ControlButton icon={Camera} onClick={takeScreenshot} />
            <ControlButton icon={Download} onClick={() => setRenderDialogOpen(true)} />
          </BottomControlGroup>
        </div>

        {/* Floating Side Panel */}
        <div
          className={cn(
            "fixed top-6 bottom-38 right-6 z-30 w-80 bg-gray-900/95 border border-white/10 rounded-3xl backdrop-blur-2xl shadow-2xl transition-all duration-500 ease-in-out p-6 overflow-hidden flex flex-col",
            openPanel ? "translate-x-0 opacity-100" : "translate-x-[120%] opacity-0"
          )}
        >
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xs font-bold tracking-widest text-white uppercase italic">
              {openPanel}
            </h4>
            <button
              onClick={() => setOpenPanel(null)}
              className="text-gray-500 hover:text-white"
            >
              <LogOut className="w-4 h-4 rotate-180" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {openPanel === "quality" && (
              <QualitySetting
                quality={deviceQuality.quality}
                autoDetectedQuality={deviceQuality.autoDetectedQuality}
                isUserOverride={deviceQuality.isUserOverride}
                onQualityChange={deviceQuality.setQuality}
                onResetToAuto={deviceQuality.resetToAuto}
                fps={deviceQuality.fps}
              />
            )}
            {openPanel === "lighting" && <LightingControls lights={lights} onLightsChange={setLights} />}
            {openPanel === "poses" && (
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(activePresets)
                  .map(([key, presetData]: [string, any]) => (
                    <button
                      key={key}
                      onClick={() => handlePresetChange(key)}
                      className={cn(
                        "group relative aspect-square rounded-2xl border transition-all overflow-hidden",
                        selectedPreset === key ? "border-blue-500 ring-4 ring-blue-500/20" : "border-white/5 hover:border-white/20"
                      )}
                    >
                      <img
                        src={presetData.poseMeta?.previewImgUrl || "./poseLabsPose/placeholder-pose.png"}
                        alt={presetData.poseMeta?.name || key}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                      <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                        <p className="text-[10px] font-bold text-white truncate">{presetData.poseMeta?.name || key}</p>
                      </div>
                    </button>
                  ))}
              </div>
            )}
            {openPanel === "poseControls" && (
              characterModel === 'default' ?
                <StandardPoseControls pose={currentPose} onPoseChange={handlePoseChange} /> :
                <BendablePoseControls pose={currentPose} onPoseChange={handlePoseChange} />
            )}
          </div>
        </div>

        {/* Stats removed for WebGL stability */}
      </main>

      <RenderDialog open={renderDialogOpen} onOpenChange={setRenderDialogOpen} onRender={handleHighQualityRender} />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
      `}</style>
    </div >
  );
};

export default CharacterViewer;
