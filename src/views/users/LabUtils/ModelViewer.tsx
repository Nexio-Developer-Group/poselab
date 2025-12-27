import { useState, useRef, useEffect, Suspense, Component, ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, useAnimations, GizmoHelper, GizmoViewport,Stats } from "@react-three/drei";
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/slider";
import { Camera, Upload, AlertCircle, Play, Pause, Download, Sun, Settings } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LightingControls, Light } from "./LightingControls";
import { LightRenderer } from "./LightRenderer";
import { RenderDialog, RenderSettings } from "./RenderDialog";
import { createHighQualityRender } from "./renderUtils";
import * as THREE from "three";

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

  return (
    <div className="relative w-full h-full bg-white flex overflow-hidden">
      {/* 3D Viewer */}
      <div className="flex-1 relative">
        {/* Header */}
        <div className="absolute z-20 flex justify-between items-center bg-white rounded-br-xl backdrop-blur-sm p-3">
          <div className="flex gap-2">
            <Button variant="outline" onClick={onChangeModelClick}>
              <Upload className="w-4 h-4 mr-1" /> New Model
            </Button>
            <Button variant="outline" onClick={takeScreenshot}>
              <Camera className="w-4 h-4 mr-1" /> Screenshot
            </Button>
            <Button
              variant="default"
              onClick={() => setRenderDialogOpen(true)}
            >
              <Download className="w-4 h-4 mr-1" /> HQ Render
            </Button>
          </div>
        </div>


        {/* Sidebar Tabs */}
        <div className="absolute flex flex-col items-center top-16 z-10 border-gray-400 rounded-br-xl rounded-tr-xl bg-white w-14 p-2 space-y-4">
          <Button
            size="icon"
            variant={openPanel === "lighting" ? "default" : "ghost"}
            onClick={() => togglePanel("lighting")}
          >
            <Sun className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant={openPanel === "animations" ? "default" : "ghost"}
            onClick={() => togglePanel("animations")}
          >
            <Play className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant={openPanel === "textures" ? "default" : "ghost"}
            onClick={() => togglePanel("textures")}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* Error message */}
        {loadError && (
          <Alert variant="destructive" className="absolute top-20 left-1/2 -translate-x-1/2 z-30">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{loadError}</AlertDescription>
          </Alert>
        )}

         <div className="relative bottom-2 right-2">
          <Stats className="!top-auto !bottom-0 !right-0" />
        </div>


        {/* 3D Canvas */}
        <Canvas
          ref={canvasRef}
          className="sm:w-auto bg-gray-950 border border-gray-300"
          camera={{ position: [32, 0, 72], fov: 120 }}
          gl={{ preserveDrawingBuffer: true, antialias: true }}
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
              axisColors={["#ff3653", "#8adb00", "#2c8fff"]} // X, Y, Z colors
              labelColor="white"
            />
          </GizmoHelper>

          <Suspense fallback={null}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <ErrorBoundary onError={(e) => setLoadError((e as any).message)}>
              <Model
                url={modelUrl}
                onTexturesExtracted={handleTexturesExtracted}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      </div>

      {/* Right Panel */}
      <div
        className={`
    absolute bg-white top-0 bottom-0 right-0 z-10 w-80 bg-card border-border p-4 overflow-y-auto
    transition-transform duration-600 ease-in-out
    ${openPanel ? "translate-x-0" : "translate-x-[calc(100%+4rem)]"}
  `}
      >
        <div className="overflow-y-auto h-full">
          {openPanel === "lighting" && <LightingControls lights={lights} onLightsChange={setLights} />}
          {openPanel === "animations" && (
            <div>
              <h4 className="font-semibold mb-4">Animations</h4>
              <div className="space-y-3">
                {animations.map((name) => (
                  <Button
                    key={name}
                    size="sm"
                    variant={playingAnimation === name ? "default" : "outline"}
                    className="w-full text-xs justify-between"
                    onClick={() => toggleAnimation(name)}
                  >
                    {name}
                    {playingAnimation === name ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  </Button>
                ))}
                {playingAnimation && (
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">
                      Speed: {animationSpeed.toFixed(1)}x
                    </label>
                    <Slider
                      value={[animationSpeed]}
                      min={0.1}
                      max={3}
                      step={0.1}
                      onValueChange={([v]) => setAnimationSpeed(v)}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          {openPanel === "textures" && (
            <div>
              <h4 className="font-semibold mb-4">Textures</h4>
              {textures.map((t, i) => (
                <div key={i} className="border border-border rounded-lg p-3">
                  <p className="text-sm font-medium mb-2 truncate">{t.name}</p>
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
                    className="text-xs px-3 py-2 bg-secondary rounded cursor-pointer hover:bg-secondary/80 flex items-center gap-2 justify-center"
                  >
                    <Upload className="w-3 h-3" /> Replace
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>



      <RenderDialog
        open={renderDialogOpen}
        onOpenChange={setRenderDialogOpen}
        onRender={handleHQRender}
      />
    </div>
  );
};
