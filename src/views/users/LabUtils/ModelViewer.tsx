import { useState, useRef, useEffect, Suspense, Component, ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, useAnimations, GizmoHelper, GizmoViewport, Stats } from "@react-three/drei";
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/slider";
import { Camera, Upload, AlertCircle, Play, Pause, Download, Sun, Settings, Accessibility, Layers, Paintbrush, Share, LogOut, RotateCcw, RotateCw, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LightingControls, Light } from "./LightingControls";
import { LightRenderer } from "./LightRenderer";
import { RenderDialog, RenderSettings } from "./RenderDialog";
import { createHighQualityRender } from "./renderUtils";
import * as THREE from "three";
import { cn } from "@/lib/utils";

class ErrorBoundary extends Component<
  { children: ReactNode; onError: (error: unknown) => void },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; onError: (error: unknown) => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    this.props.onError(error);
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

interface ModelViewerProps {
  modelUrl: string;
  onChangeModelClick: () => void;
}

interface TextureInfo {
  name: string;
  texture: THREE.Texture;
  materialIndex: number;
  mapType: string;
}

const Model = ({
  url,
  onTexturesExtracted,
  onAnimationsFound,
  playingAnimation,
  animationSpeed,
}: {
  url: string;
  onTexturesExtracted: (textures: TextureInfo[]) => void;
  onError: (error: Error) => void;
  onAnimationsFound: (animations: string[]) => void;
  playingAnimation: string | null;
  animationSpeed: number;
}) => {
  const gltf = useGLTF(url);
  const { scene, animations } = gltf;
  const { actions, names } = useAnimations(animations, scene);
  const notified = useRef(false);

  useEffect(() => {
    if (names.length > 0 && !notified.current) {
      onAnimationsFound(names);
      notified.current = true;
    }
  }, [names, onAnimationsFound]);

  useEffect(() => {
    Object.values(actions).forEach((a) => a?.stop());
    if (playingAnimation && actions[playingAnimation]) {
      const action = actions[playingAnimation];
      action.timeScale = animationSpeed;
      action.reset().play();
    }
  }, [playingAnimation, actions, animationSpeed]);

  useEffect(() => {
    const textures: TextureInfo[] = [];
    let materialIndex = 0;
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshStandardMaterial;
        if (material.map)
          textures.push({
            name: `${child.name}_diffuse`,
            texture: material.map,
            materialIndex,
            mapType: "map",
          });
        if (material.normalMap)
          textures.push({
            name: `${child.name}_normal`,
            texture: material.normalMap,
            materialIndex,
            mapType: "normalMap",
          });
        if (material.roughnessMap)
          textures.push({
            name: `${child.name}_roughness`,
            texture: material.roughnessMap,
            materialIndex,
            mapType: "roughnessMap",
          });
        materialIndex++;
      }
    });
    onTexturesExtracted(textures);
  }, [scene, onTexturesExtracted]);

  return <primitive object={scene} dispose={null} />;
};

export const ModelViewer = ({ modelUrl, onChangeModelClick }: ModelViewerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [textures, setTextures] = useState<TextureInfo[]>([]);
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [camera, setCamera] = useState<THREE.Camera | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [animations, setAnimations] = useState<string[]>([]);
  const [playingAnimation, setPlayingAnimation] = useState<string | null>(null);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [renderDialogOpen, setRenderDialogOpen] = useState(false);
  const [openPanel, setOpenPanel] = useState<"lighting" | "textures" | "animations" | null>(null);

  const [lights, setLights] = useState<Light[]>([
    { id: "key", type: "directional", position: [10, 10, 5], color: "#ffffff", intensity: 0.8 },
    { id: "fill", type: "directional", position: [-10, 5, -5], color: "#ffffff", intensity: 0.2 },
  ]);

  const togglePanel = (panel: typeof openPanel) =>
    setOpenPanel((prev) => (prev === panel ? null : panel));

  const handleTexturesExtracted = (t: TextureInfo[]) => setTextures(t);
  const handleAnimationsFound = (a: string[]) => setAnimations(a);

  const takeScreenshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return toast.error("Canvas not found");
    const link = document.createElement("a");
    link.download = "screenshot.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast.success("Screenshot saved!");
  };

  const handleHQRender = async (settings: RenderSettings, onProgress: (n: number) => void) => {
    if (!scene || !camera) throw new Error("Scene not ready");
    return await createHighQualityRender(scene, camera, settings, onProgress);
  };

  const handleTextureReplace = (textureInfo: TextureInfo, file: File) => {
    if (!scene) return toast.error("Scene not ready");

    const reader = new FileReader();
    reader.onload = (e) => {
      const loader = new THREE.TextureLoader();
      const newTexture = loader.load(e.target?.result as string, () => {
        scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const material = mesh.material as THREE.MeshStandardMaterial;

            if (material[textureInfo.mapType as keyof typeof material] === textureInfo.texture) {
              // Only assign to writable texture properties, not read-only ones
              if (
                textureInfo.mapType === "map" ||
                textureInfo.mapType === "normalMap" ||
                textureInfo.mapType === "roughnessMap"
              ) {
                (material as any)[textureInfo.mapType] = newTexture;  // eslint-disable-line
                material.needsUpdate = true;
                mesh.material = material;
              }
            }
          }
        });
        toast.success(`Replaced ${textureInfo.name}`);
      });
    };
    reader.readAsDataURL(file);
  };


  const toggleAnimation = (name: string) => {
    if (playingAnimation === name) {
      setPlayingAnimation(null);
      toast("Animation stopped");
    } else {
      setPlayingAnimation(name);
      toast.success(`Playing: ${name}`);
    }
  };

  const SidebarButton = ({
    icon: Icon,
    label,
    active,
    onClick
  }: {
    icon: any;
    label: string;
    active?: boolean;
    onClick?: () => void
  }) => (
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

  const BottomControlGroup = ({
    label,
    children
  }: {
    label: string;
    children: React.ReactNode
  }) => (
    <div className="flex flex-col items-center px-6 border-r border-white/5 last:border-0 gap-3">
      <span className="text-[10px] font-bold tracking-widest text-gray-500">{label}</span>
      <div className="flex gap-2">
        {children}
      </div>
    </div>
  );

  const ControlButton = ({
    icon: Icon,
    active,
    onClick
  }: {
    icon: any;
    active?: boolean;
    onClick?: () => void
  }) => (
    <button
      onClick={onClick}
      className={cn(
        "p-3 rounded-xl border transition-all duration-200",
        active
          ? "bg-blue-500/10 border-blue-500/50 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]"
          : "bg-white/5 border-white/5 text-gray-400 hover:border-white/20 hover:text-white"
      )}
    >
      <Icon className="w-5 h-5" />
    </button>
  );

  return (
    <div className="relative w-full h-[100vh] bg-gray-950 flex overflow-hidden text-white font-sans selection:bg-blue-500/30">
      {/* Left Sidebar */}
      <aside className="w-24 border-r border-white/5 flex flex-col items-center py-8 gap-10 bg-gray-900 z-20">
        <div className="mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Settings className="w-6 h-6 text-white" />
          </div>
        </div>

        <SidebarButton
          icon={Accessibility}
          label="POSE"
          active={openPanel === "animations"}
          onClick={() => togglePanel("animations")}
        />
        <SidebarButton
          icon={Layers}
          label="LAYERS"
          active={openPanel === "textures"}
          onClick={() => togglePanel("textures")}
        />
        <SidebarButton
          icon={Paintbrush}
          label="PAINT"
          active={openPanel === "lighting"}
          onClick={() => togglePanel("lighting")}
        />
        <SidebarButton
          icon={Camera}
          label="RENDER"
          active={renderDialogOpen}
          onClick={() => setRenderDialogOpen(true)}
        />

        <div className="mt-auto flex flex-col gap-6 items-center">
          <button className="text-gray-500 hover:text-white transition-colors">
            <Share className="w-5 h-5" />
          </button>
          <button className="text-gray-500 hover:text-red-400 transition-colors" onClick={onChangeModelClick}>
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Main Viewport */}
      <main className="flex-1 relative flex flex-col bg-[#0a0a0c]">
        {/* Header/Breadcrumbs */}
        <div className="absolute top-6 left-8 z-10 flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-lg backdrop-blur-md">
            <span className="text-xs font-medium text-gray-400">PoseLab.gg</span>
            <span className="text-xs text-gray-600">/</span>
            <span className="text-xs font-semibold text-white">Character Editor</span>
          </div>
        </div>

        {/* 3D Canvas Container */}
        <div className="flex-1 relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />

          <Canvas
            ref={canvasRef}
            className="w-full h-full"
            camera={{ position: [32, 0, 72], fov: 120 }}
            gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true }}
            onCreated={({ scene, camera }) => {
              setScene(scene);
              setCamera(camera);
            }}
          >
            <ambientLight intensity={0.5} />
            <LightRenderer lights={lights} />

            <GizmoHelper
              alignment="bottom-left"
              margin={[80, 80]}
            >
              <GizmoViewport
                axisColors={["#ff3653", "#8adb00", "#2c8fff"]}
                labelColor="white"
              />
            </GizmoHelper>

            <Suspense fallback={null}>
              <ErrorBoundary onError={(e) => setLoadError((e as any).message)}>
                <Model
                  url={modelUrl}
                  onTexturesExtracted={handleTexturesExtracted}
                  onError={(e) => setLoadError((e as any).message)}
                  onAnimationsFound={handleAnimationsFound}
                  playingAnimation={playingAnimation}
                  animationSpeed={animationSpeed}
                />
              </ErrorBoundary>
            </Suspense>
            <OrbitControls enablePan enableZoom enableRotate />
            <Environment preset="sunset" />
          </Canvas>

          {/* Screenshot Button (Floating) */}
          <button
            onClick={takeScreenshot}
            className="absolute top-6 right-8 p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all backdrop-blur-md text-white group"
          >
            <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Bottom Controls */}
        <div className="h-32 border-t border-white/5 bg-gray-900 flex items-center justify-center z-20">
          <div className="flex items-center bg-gray-800/40 border border-white/5 rounded-2xl p-2 px-4 shadow-2xl backdrop-blur-xl">
            <BottomControlGroup label="JOINTS">
              <ControlButton icon={Accessibility} active />
              <ControlButton icon={Accessibility} />
            </BottomControlGroup>

            <BottomControlGroup label="ROTATION">
              <ControlButton icon={RotateCcw} />
              <ControlButton icon={RotateCw} />
            </BottomControlGroup>

            <BottomControlGroup label="LIGHTING">
              <ControlButton icon={Sun} onClick={() => togglePanel("lighting")} active={openPanel === "lighting"} />
              <ControlButton icon={Lightbulb} />
            </BottomControlGroup>
          </div>
        </div>

        {/* Sliding Panel */}
        <div
          className={cn(
            "fixed top-6 bottom-38 right-6 z-30 w-80 bg-gray-900/95 border border-white/10 rounded-3xl backdrop-blur-2xl shadow-2xl transition-all duration-500 ease-in-out p-6 overflow-hidden flex flex-col",
            openPanel ? "translate-x-0 opacity-100" : "translate-x-[120%] opacity-0"
          )}
        >
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-sm font-bold tracking-widest text-white uppercase italic">
              {openPanel === "lighting" && "Lighting Engine"}
              {openPanel === "animations" && "Motion & Pose"}
              {openPanel === "textures" && "Surface Layers"}
            </h4>
            <button
              onClick={() => setOpenPanel(null)}
              className="text-gray-500 hover:text-white"
            >
              <LogOut className="w-4 h-4 rotate-180" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {openPanel === "lighting" && <LightingControls lights={lights} onLightsChange={setLights} />}
            {openPanel === "animations" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-2">
                  {animations.map((name) => (
                    <button
                      key={name}
                      onClick={() => toggleAnimation(name)}
                      className={cn(
                        "group flex items-center justify-between p-4 rounded-xl border transition-all duration-200",
                        playingAnimation === name
                          ? "bg-blue-500/10 border-blue-500/30 text-white"
                          : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:border-white/10"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg transition-colors",
                          playingAnimation === name ? "bg-blue-500/20" : "bg-white/5"
                        )}>
                          {playingAnimation === name ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-gray-400 group-hover:text-white" />}
                        </div>
                        <span className="text-sm font-medium">{name}</span>
                      </div>
                      {playingAnimation === name && (
                        <div className="flex gap-1">
                          <div className="w-1 h-3 bg-blue-500 animate-pulse" />
                          <div className="w-1 h-3 bg-blue-500 animate-pulse delay-75" />
                          <div className="w-1 h-3 bg-blue-500 animate-pulse delay-150" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {playingAnimation && (
                  <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">Playback Speed</label>
                      <span className="text-xs font-mono text-blue-400">{animationSpeed.toFixed(2)}x</span>
                    </div>
                    <Slider
                      value={[animationSpeed]}
                      min={0.1}
                      max={3}
                      step={0.1}
                      onValueChange={([v]) => setAnimationSpeed(v)}
                      className="my-4"
                    />
                  </div>
                )}
              </div>
            )}
            {openPanel === "textures" && (
              <div className="space-y-3">
                {textures.map((t, i) => (
                  <div key={i} className="group bg-white/5 border border-white/5 rounded-2xl p-4 hover:bg-white/[0.07] hover:border-white/10 transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-gray-800 border border-white/10 flex items-center justify-center p-1 overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 rounded" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">{t.name}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-tight">{t.mapType}</p>
                      </div>
                    </div>

                    <input
                      id={`texture-${i}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleTextureReplace(t, file);
                      }}
                    />
                    <label
                      htmlFor={`texture-${i}`}
                      className="w-full text-xs py-3 bg-white/5 rounded-xl border border-white/5 hover:bg-blue-500 hover:border-blue-400 hover:text-white cursor-pointer transition-all flex items-center justify-center gap-2 font-bold"
                    >
                      <Upload className="w-3 h-3" /> UPDATE LAYER
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Error message */}
        {loadError && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-40">
            <div className="bg-red-500/20 border border-red-500/50 backdrop-blur-xl px-6 py-3 rounded-2xl flex items-center gap-3 animate-bounce shadow-lg shadow-red-500/10">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-sm font-semibold text-red-200">{loadError}</span>
            </div>
          </div>
        )}

        <div className="absolute bottom-36 left-8 opacity-50 pointer-events-none scale-75 origin-left">
          <Stats className="!static" />
        </div>
      </main>

      <RenderDialog
        open={renderDialogOpen}
        onOpenChange={setRenderDialogOpen}
        onRender={handleHQRender}
      />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};
