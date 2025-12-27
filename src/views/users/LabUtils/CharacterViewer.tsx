import { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, GizmoHelper, GizmoViewport, Stats } from "@react-three/drei";
import { MinecraftCharacter } from "./MinecraftCharacter";
import { PoseControls } from "./PoseControls";
import { LightingControls, Light } from "./LightingControls";
import { LightRenderer } from "./LightRenderer";
import { RenderDialog, RenderSettings } from "./RenderDialog";
import { createHighQualityRender } from "./renderUtils";
import { Button } from "@/components/ui/Button";
import { Camera, Upload, Download, RotateCcw, SlidersHorizontal, Lightbulb, SplinePointer, Gpu } from "lucide-react";
import { toast } from "sonner";
import * as THREE from "three";
import { QualitySetting } from "./QualitySetting";
import { getQualityPreset } from "./qualitySettings";
import { useDeviceQuality } from "./hooks/useDeviceQuality";
import { enhanceSceneMaterials } from "./pbrMaterials";
import PRESET_POSES from "./posePreset";
// import {BendableMinecraftCharacter} from "./BendableMinecraftCharacter";



export interface CharacterViewerProps {
  skinImage: HTMLImageElement;
  onChangeSkinClick: (el: HTMLElement) => void;
  pose?: typeof PRESET_POSES[keyof typeof PRESET_POSES]; // optional input pose
}

export const CharacterViewer = ({ skinImage, onChangeSkinClick, pose }: CharacterViewerProps) => {
  // ✅ if pose not passed, fallback to standing
  const [currentPose, setCurrentPose] = useState(pose || PRESET_POSES.standing);
  const [selectedPreset, setSelectedPreset] = useState(
    Object.keys(PRESET_POSES).find((key) => PRESET_POSES[key as keyof typeof PRESET_POSES] === pose) || "standing"
  );

  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [camera, setCamera] = useState<THREE.Camera | null>(null);
  const [renderDialogOpen, setRenderDialogOpen] = useState(false);
  const [lights, setLights] = useState<Light[]>([
    { id: "light-1", type: "directional", position: [10, 10, 5], color: "#ffffff", intensity: 1.2 },
    { id: "light-2", type: "directional", position: [-10, 5, -5], color: "#fffff", intensity: 0.3 },
  ]);

  // --- Quality system ---
  const deviceQuality = useDeviceQuality();
  const qualityPreset = getQualityPreset(deviceQuality.quality);

  useEffect(() => {
    if (scene) enhanceSceneMaterials(scene, undefined, qualityPreset);
  }, [scene, qualityPreset]);

  // --- Pose handling ---
  const handlePoseChange = (bodyPart: string, axis: string, value: number) => {
    setCurrentPose((prev) => ({
      ...prev,
      poseConfig: {
        ...prev.poseConfig,
        [bodyPart]: {
          ...prev.poseConfig[bodyPart as keyof typeof prev.poseConfig],
          [axis]: value,
        },
      },
    }));
    setSelectedPreset("custom");
  };

  const handlePresetChange = (preset: string) => {
    setCurrentPose(PRESET_POSES[preset as keyof typeof PRESET_POSES]);
    setSelectedPreset(preset);
  };

  const resetPose = () => {
    setCurrentPose(PRESET_POSES.standing);
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
    if (!scene || !camera) throw new Error("Scene not ready");
    return await createHighQualityRender(scene, camera, settings, onProgress);
  };

  // --- JSX ---
  return (
    <div className="relative w-full h-full bg-white flex overflow-hidden">
      <div className="flex-1 relative">
        {/* Top Header */}
        <div className="absolute z-20 flex justify-between items-center bg-white rounded-br-xl backdrop-blur-sm p-3">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={(e) => onChangeSkinClick(e.currentTarget)}>
              <Upload className="w-4 h-4 mr-1" /> Change Skin
            </Button>
            <Button variant="outline" size="sm" onClick={takeScreenshot}>
              <Camera className="w-4 h-4 mr-1" /> Screenshot
            </Button>
            <Button variant="default" size="sm" onClick={() => setRenderDialogOpen(true)}>
              <Download className="w-4 h-4 mr-1" /> HQ Render
            </Button>
          </div>
        </div>

        {/* Right Tool Buttons */}
        <div className="absolute flex flex-col items-center top-16 z-10 border-gray-400 rounded-br-xl rounded-tr-xl bg-white w-14 p-2 space-y-4">
          <Button
            variant={openPanel === "quality" ? "default" : "ghost"}
            size="icon"
            onClick={() => setOpenPanel(openPanel === "quality" ? null : "quality")}
          >
            <Gpu className="w-4 h-4" />
          </Button>
          <Button
            variant={openPanel === "lighting" ? "default" : "ghost"}
            size="icon"
            onClick={() => setOpenPanel(openPanel === "lighting" ? null : "lighting")}
          >
            <Lightbulb className="w-4 h-4" />
          </Button>
          <Button
            variant={openPanel === "poses" ? "default" : "ghost"}
            size="icon"
            onClick={() => setOpenPanel(openPanel === "poses" ? null : "poses")}
          >
            <SplinePointer className="w-4 h-4" />
          </Button>
          <Button
            variant={openPanel === "poseControls" ? "default" : "ghost"}
            size="icon"
            onClick={() => setOpenPanel(openPanel === "poseControls" ? null : "poseControls")}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </div>

        {/* Canvas */}
        <Canvas
          ref={canvasRef}
          camera={{ position: [5, 0, 8], fov: 45 }}
          className="sm:w-auto bg-gray-950 border border-gray-300"
          gl={{ preserveDrawingBuffer: true, antialias: true }}
          onCreated={({ scene, camera }) => {
            setScene(scene);
            setCamera(camera);
          }}
        >
          <ambientLight intensity={0.5} />
          <LightRenderer lights={lights} />
          <GizmoHelper alignment="bottom-left" margin={[80, 80]}>
            <GizmoViewport axisColors={["#ff3653", "#8adb00", "#2c8fff"]} labelColor="white" />
          </GizmoHelper>
          <MinecraftCharacter skinImage={skinImage} pose={currentPose.poseConfig} />
          <OrbitControls enablePan enableZoom enableRotate />
          <Environment preset="sunset" />
        </Canvas>

        <div className="absolute bottom-2 right-2">
          <Stats className="!top-auto !bottom-0 !right-0" />
        </div>
      </div>

      {/* Side Panels */}
      <div
        className={`absolute bg-white top-0 bottom-0 right-0 z-10 w-80 p-4 overflow-y-auto border-border transition-transform duration-600 ease-in-out
          ${openPanel ? "translate-x-0" : "translate-x-[calc(100%+4rem)]"}`}
      >
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
          <div>
            <div className="flex items-center mb-3 justify-between">
            <h4 className="font-semibold">Preset Poses</h4>
             <Button size="sm" onClick={resetPose}>
              <RotateCcw className="w-4 h-4" />
            </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(PRESET_POSES).map(([key, presetData]) => (
                <div
                  key={key}
                  onClick={() => handlePresetChange(key)}
                  className={`cursor-pointer text-center text-xs rounded-lg border border-gray-400 overflow-hidden hover:bg-muted/40 transition
      ${selectedPreset === key ? "ring-2 ring-green-500" : ""}`}
                >
                  <img
                    src={presetData.poseMeta?.previewImgUrl || "./poseLabsPose/placeholder-pose.png"}
                    alt={presetData.poseMeta?.name || key}
                    className="w-full h-24 object-cover bg-gray-500"
                    loading="lazy"
                  />
                  <div className="p-1 font-medium">{presetData.poseMeta?.name || key}</div>
                </div>
              ))}

            </div>
           
          </div>
        )}
        {openPanel === "poseControls" && <PoseControls pose={currentPose} onPoseChange={handlePoseChange} />}
      </div>

      <RenderDialog open={renderDialogOpen} onOpenChange={setRenderDialogOpen} onRender={handleHighQualityRender} />
    </div>
  );
};

export default CharacterViewer;
