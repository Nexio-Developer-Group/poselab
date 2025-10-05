import { useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { MinecraftCharacter } from "./MinecraftCharacter";
import { PoseControls } from "./PoseControls";
import { LightingControls, Light } from "./LightingControls";
import { LightRenderer } from "./LightRenderer";
import { RenderDialog, RenderSettings } from "./RenderDialog";
import { createHighQualityRender } from "./renderUtils";
import { Button } from "@/components/ui/Button";
import { Camera, Upload, Download, RotateCcw, Sun, Armchair, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import * as THREE from "three";

// --- Your PRESET_POSES stays same here ---

const PRESET_POSES = {
  standing: {
    leftUpperArm: { x: 0, y: 0, z: 0 },
    leftLowerArm: { x: 0, y: 0, z: 0 },
    rightUpperArm: { x: 0, y: 0, z: 0 },
    rightLowerArm: { x: 0, y: 0, z: 0 },
    leftUpperLeg: { x: 0, y: 0, z: 0 },
    leftLowerLeg: { x: 0, y: 0, z: 0 },
    rightUpperLeg: { x: 0, y: 0, z: 0 },
    rightLowerLeg: { x: 0, y: 0, z: 0 },
    head: { x: 0, y: 0, z: 0 },
    body: { x: 0, y: 0, z: 0 },
  },
  walking: {
    leftUpperArm: { x: -20, y: 0, z: -5 },
    leftLowerArm: { x: -5, y: 0, z: 5 },
    rightUpperArm: { x: 20, y: 0, z: 5 },
    rightLowerArm: { x: 0, y: 0, z: 0 },
    leftUpperLeg: { x: 25, y: 0, z: -3 },
    leftLowerLeg: { x: 0, y: 0, z: 0 },
    rightUpperLeg: { x: -25, y: 0, z: 5 },
    rightLowerLeg: { x: 0, y: 0, z: 0 },
    head: { x: 0, y: 2, z: 5 },
    body: { x: 0, y: 0, z: 0 },
  },
  waving: {
    leftUpperArm: { x: 0, y: 0, z: 0 },
    leftLowerArm: { x: 0, y: 0, z: 0 },
    rightUpperArm: { x: -80, y: 0, z: 30 },
    rightLowerArm: { x: -45, y: 0, z: 15 },
    leftUpperLeg: { x: 0, y: 0, z: 0 },
    leftLowerLeg: { x: 0, y: 0, z: 0 },
    rightUpperLeg: { x: 0, y: 0, z: 0 },
    rightLowerLeg: { x: 0, y: 0, z: 0 },
    head: { x: 0, y: 15, z: 0 },
    body: { x: 0, y: 0, z: 0 },
  },
  sitting: {
    leftUpperArm: { x: 0, y: 0, z: 0 },
    leftLowerArm: { x: -30, y: 0, z: 0 },
    rightUpperArm: { x: 0, y: 0, z: 0 },
    rightLowerArm: { x: -30, y: 0, z: 0 },
    leftUpperLeg: { x: -45, y: 0, z: 0 },
    leftLowerLeg: { x: 45, y: 0, z: 0},
    rightUpperLeg: { x: -45, y: 0, z: 0 },
    rightLowerLeg: { x: 45, y: 0, z: 0 },
    head: { x: 0, y: 0, z: 0 },
    body: { x: 0, y: 0, z: 0 },
  },
  running: {
    leftUpperArm: { x: -45, y: 0, z: 0 },
    leftLowerArm: { x: 0, y: 0, z: 0 },
    rightUpperArm: { x: 45, y: 0, z: 0 },
    rightLowerArm: { x: 0, y: 0, z: 0 },
    leftUpperLeg: { x: 45, y: 0, z: 0 },
    leftLowerLeg: { x: 0, y: 0, z: 0 },
    rightUpperLeg: { x: -45, y: 0, z: 0 },
    rightLowerLeg: { x: 0, y: 0, z: 0 },
    head: { x: 5, y: 0, z: 0 },
    body: { x: 5, y: 0, z: 0 },
  },
  combat: {
    leftUpperArm: { x: -45, y: 30, z: 0 },
    leftLowerArm: { x: -90, y: 0, z: 0 },
    rightUpperArm: { x: -30, y: -45, z: 15 },
    rightLowerArm: { x: -60, y: 0, z: 0 },
    leftUpperLeg: { x: 15, y: 0, z: 0 },
    leftLowerLeg: { x: 0, y: 0, z: 0 },
    rightUpperLeg: { x: -15, y: 0, z: 0 },
    rightLowerLeg: { x: 0, y: 0, z: 0 },
    head: { x: 0, y: -15, z: 0 },
    body: { x: 0, y: -10, z: 0 },
  },
};

export interface CharacterViewerProps {
  skinImage: HTMLImageElement;
  onChangeSkinClick: (el: HTMLElement) => void;
}


export const CharacterViewer = ({ skinImage, onChangeSkinClick }: CharacterViewerProps) => {
  const [currentPose, setCurrentPose] = useState(PRESET_POSES.standing);
  const [selectedPreset, setSelectedPreset] = useState("standing");
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [camera, setCamera] = useState<THREE.Camera | null>(null);
  const [renderDialogOpen, setRenderDialogOpen] = useState(false);
  const [lights, setLights] = useState<Light[]>([
    { id: "light-1", type: "directional", position: [10, 10, 5], color: "#ffffff", intensity: 1.2 },
    { id: "light-2", type: "directional", position: [-10, 5, -5], color: "#fffff", intensity: 0.3 },
  ]);

  // --- existing handlers same ---
  const handlePoseChange = (bodyPart: string, axis: string, value: number) => {
    setCurrentPose((prev) => ({
      ...prev,
      [bodyPart]: { ...prev[bodyPart as keyof typeof prev], [axis]: value },
    }));
    setSelectedPreset("standing");
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

  return (
    <div className="relative w-full h-full bg-white border border-gray-300 flex overflow-hidden">
      {/* ---- Main Canvas ---- */}
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

        {/* ---- Right Vertical Tabs ---- */}
        <div className="absolute flex flex-col right-0 items-center border-l z-50 border-gray-400 rounded-bl-xl bg-white w-14 p-2 space-y-4">
          <Button
            variant={openPanel === "lighting" ? "default" : "ghost"}
            size="icon"
            onClick={() => setOpenPanel(openPanel === "lighting" ? null : "lighting")}
          >
            <Sun className="w-4 h-4" />
          </Button>
          <Button
            variant={openPanel === "poses" ? "default" : "ghost"}
            size="icon"
            onClick={() => setOpenPanel(openPanel === "poses" ? null : "poses")}
          >
            <Armchair className="w-4 h-4" />
          </Button>
          <Button
            variant={openPanel === "poseControls" ? "default" : "ghost"}
            size="icon"
            onClick={() => setOpenPanel(openPanel === "poseControls" ? null : "poseControls")}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </div>


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
          <MinecraftCharacter skinImage={skinImage} pose={currentPose} />
          <OrbitControls enablePan enableZoom enableRotate />
          <Environment preset="studio" />
        </Canvas>
      </div>




      {/* ---- Side Panel ---- */}
      <div
        className={`
    absolute bg-white top-0 bottom-0 right-13 z-30 w-80 bg-card border-border p-4 overflow-y-auto
    transition-transform duration-600 ease-in-out
    ${openPanel ? "translate-x-0" : "translate-x-[calc(100%+4rem)]"}
  `}
      >
        {openPanel === "lighting" && (
          <LightingControls lights={lights} onLightsChange={setLights} />
        )}
        {openPanel === "poses" && (
          <div>
            <h4 className="font-semibold mb-3">Preset Poses</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(PRESET_POSES).map((preset) => (
                <Button
                  key={preset}
                  variant={selectedPreset === preset ? "default" : "outline"}
                  size="sm"
                  className="capitalize text-xs"
                  onClick={() => handlePresetChange(preset)}
                >
                  {preset}
                </Button>
              ))}
            </div>
            <Button
              className="w-full mt-3"
              size="sm"
              onClick={resetPose}
            >
              <RotateCcw className="w-4 h-4 mr-1" /> Reset
            </Button>
          </div>
        )}
        {openPanel === "poseControls" && (
          <PoseControls pose={currentPose} onPoseChange={handlePoseChange} />
        )}
      </div>


      <RenderDialog
        open={renderDialogOpen}
        onOpenChange={setRenderDialogOpen}
        onRender={handleHighQualityRender}
      />
    </div>
  );
};

export default CharacterViewer;