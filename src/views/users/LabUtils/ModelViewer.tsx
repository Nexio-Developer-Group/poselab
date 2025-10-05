import { useState, useRef, useEffect, Suspense, Component, ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, useAnimations } from "@react-three/drei";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Camera, Upload, AlertCircle, Play, Pause, Download } from "lucide-react";
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
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

interface ModelViewerProps {
  modelUrl: string;
  onNewModel: () => void;
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
  onError,
  onAnimationsFound,
  playingAnimation,
  animationSpeed
}: { 
  url: string;
  onTexturesExtracted: (textures: TextureInfo[]) => void;
  onError: (error: Error) => void;
  onAnimationsFound: (animations: string[]) => void;
  playingAnimation: string | null;
  animationSpeed: number;
}) => {
  const gltf = useGLTF(url, true, true, (loader) => {
    loader.manager.onError = (itemUrl) => {
      onError(new Error(`Failed to load: ${itemUrl}`));
    };
  });
  
  const { scene, animations } = gltf;
  const { actions, names } = useAnimations(animations, scene);
  const hasNotifiedRef = useRef(false);
  
  useEffect(() => {
    if (names.length > 0 && !hasNotifiedRef.current) {
      onAnimationsFound(names);
      hasNotifiedRef.current = true;
    }
  }, [names, onAnimationsFound]);
  
  useEffect(() => {
    // Stop all animations first
    Object.values(actions).forEach(action => {
      if (action) {
        action.stop();
      }
    });
    
    // Play selected animation
    if (playingAnimation && actions[playingAnimation]) {
      const action = actions[playingAnimation];
      if (action) {
        action.timeScale = animationSpeed;
        action.reset().play();
      }
    }
  }, [playingAnimation, actions, animationSpeed]);
  
  useEffect(() => {
    const textures: TextureInfo[] = [];
    let materialIndex = 0;
    
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshStandardMaterial;
        
        if (material.map) {
          textures.push({
            name: `${child.name || 'Material'}_diffuse`,
            texture: material.map,
            materialIndex,
            mapType: 'map'
          });
        }
        if (material.normalMap) {
          textures.push({
            name: `${child.name || 'Material'}_normal`,
            texture: material.normalMap,
            materialIndex,
            mapType: 'normalMap'
          });
        }
        if (material.roughnessMap) {
          textures.push({
            name: `${child.name || 'Material'}_roughness`,
            texture: material.roughnessMap,
            materialIndex,
            mapType: 'roughnessMap'
          });
        }
        if (material.metalnessMap) {
          textures.push({
            name: `${child.name || 'Material'}_metalness`,
            texture: material.metalnessMap,
            materialIndex,
            mapType: 'metalnessMap'
          });
        }
        
        materialIndex++;
      }
    });
    
    onTexturesExtracted(textures);
  }, [scene, onTexturesExtracted]);
  
  // eslint-disable-next-line
  return <primitive object={scene} dispose={null} />;
};

export const ModelViewer = ({ modelUrl, onNewModel }: ModelViewerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [textures, setTextures] = useState<TextureInfo[]>([]);
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [camera, setCamera] = useState<THREE.Camera | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [animations, setAnimations] = useState<string[]>([]);
  const [playingAnimation, setPlayingAnimation] = useState<string | null>(null);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [renderDialogOpen, setRenderDialogOpen] = useState(false);
  const [lights, setLights] = useState<Light[]>([
    {
      id: "light-1",
      type: "directional",
      position: [10, 10, 5],
      color: "#ffffff",
      intensity: 1,
    },
    {
      id: "light-2",
      type: "directional",
      position: [-10, 5, -5],
      color: "#ffffff",
      intensity: 0.3,
    },
  ]);
  
  const handleTexturesExtracted = (extractedTextures: TextureInfo[]) => {
    setTextures(extractedTextures);
    setLoadError(null);
  };
  
  const handleAnimationsFound = (animationNames: string[]) => {
    setAnimations(animationNames);
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
  
  const handleModelError = (error: unknown) => {
    console.error("Model loading error:", error);
    let errorMessage = "";
    if (typeof error === "string") {
      errorMessage = error.toLowerCase();
    } else if (error && typeof (error as any).message === "string") { // eslint-disable-line
      errorMessage = (error as any).message.toLowerCase(); // eslint-disable-line
    }
    
    if (errorMessage.includes("failed to load buffer") || errorMessage.includes(".bin")) {
      setLoadError("This .gltf file requires external files (.bin, textures). Please use a .glb file with embedded data instead.");
      toast.error("Model format error - use .glb files");
    } else if (errorMessage.includes("texture")) {
      setLoadError("Some textures failed to load. The model will display without them.");
      toast.warning("Textures could not be loaded");
    } else {
      setLoadError("Failed to load the 3D model. Please try a different file.");
      toast.error("Could not load model");
    }
  };
  
  const handleTextureChange = (textureInfo: TextureInfo, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const image = new Image();
      image.onload = () => {
        const newTexture = new THREE.Texture(image);
        newTexture.needsUpdate = true;
        newTexture.wrapS = newTexture.wrapT = THREE.RepeatWrapping;
        
        // Update the texture in the scene
        if (scene) {
          let materialIndex = 0;
          scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              const material = mesh.material as THREE.MeshStandardMaterial;
              
              if (materialIndex === textureInfo.materialIndex) {
                (material as any)[textureInfo.mapType] = newTexture; // eslint-disable-line
                material.needsUpdate = true;
              }
              
              materialIndex++;
            }
          });
        }
        
        toast.success(`Texture ${textureInfo.name} updated!`);
      };
      image.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };
  
  const takeScreenshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      toast.error("Canvas not found");
      return;
    }
    
    const link = document.createElement('a');
    link.download = '3d-model-screenshot.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    
    toast.success("Screenshot saved!");
  };

  const handleHighQualityRender = async (
    settings: RenderSettings,
    onProgress: (progress: number) => void
  ) => {
    if (!scene || !camera) {
      toast.error("Scene not ready");
      throw new Error("Scene not ready");
    }

    try {
      const result = await createHighQualityRender(scene, camera, settings, onProgress);
      return result;
    } catch (error) {
      console.error("Render error:", error);
      toast.error("Failed to create high quality render");
      throw error;
    }
  };
  
  return (
    <div className="min-h-screen flex">
      {/* 3D Viewer */}
      <div className="flex-1 relative">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-background/80 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-gaming rounded-lg flex items-center justify-center shadow-glow">
                <Camera className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">3D Model Viewer</h1>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                className="flex items-center gap-2"
                onClick={onNewModel}
              >
                <Upload className="w-4 h-4" />
                New Model
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                disabled={!!loadError}
                onClick={takeScreenshot}
              >
                <Camera className="w-4 h-4" />
                Screenshot
              </Button>
              <Button
                className="flex items-center gap-2 bg-gradient-gaming hover:shadow-glow transition-smooth"
                disabled={!!loadError}
                onClick={() => setRenderDialogOpen(true)}
              >
                <Download className="w-4 h-4" />
                HQ Render
              </Button>
            </div>
          </div>
        </div>
        
        {/* Error Alert */}
        {loadError && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 w-full max-w-2xl px-4">
            <Alert variant="destructive" className="bg-destructive/90 backdrop-blur-sm">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2">
                {loadError}
              </AlertDescription>
            </Alert>
          </div>
        )}
        
        {/* 3D Canvas */}
        <Canvas
          ref={canvasRef}
          camera={{ position: [0, 2, 5], fov: 45 }}
          className="w-full h-full"
          gl={{ 
            preserveDrawingBuffer: true, 
            alpha: true, 
            antialias: true,
            powerPreference: "high-performance"
          }}
          onCreated={({ scene: threeScene, camera: threeCamera }) => {
            setScene(threeScene);
            setCamera(threeCamera);
          }}
        >
          <ambientLight intensity={0.5} />
          <LightRenderer lights={lights} />
          
          <Suspense fallback={null}>
            <ErrorBoundary onError={handleModelError}>
              <Model 
                url={modelUrl} 
                playingAnimation={playingAnimation}
                animationSpeed={animationSpeed}
                onTexturesExtracted={handleTexturesExtracted}
                onError={handleModelError}
                onAnimationsFound={handleAnimationsFound}
              />
            </ErrorBoundary>
          </Suspense>
          
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={1}
            maxDistance={20}
            enableDamping={true}
            dampingFactor={0.05}
          />
          
          <Environment preset="studio" />
        </Canvas>
      </div>
      
      {/* Texture Controls Panel */}
      <div className="w-80 bg-card border-l border-border p-6 overflow-y-auto">
        <div className="space-y-4">
          {/* Lighting Controls */}
          <LightingControls lights={lights} onLightsChange={setLights} />
          
          {/* Animations */}
          {animations.length > 0 && (
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-4">Animations</h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  {animations.map((name) => (
                    <Button
                      key={name}
                      size="sm"
                      variant={playingAnimation === name ? "default" : "outline"}
                      className="w-full text-xs justify-between"
                      onClick={() => toggleAnimation(name)}
                    >
                      <span className="truncate">{name}</span>
                      {playingAnimation === name ? (
                        <Pause className="w-3 h-3 ml-2 flex-shrink-0" />
                      ) : (
                        <Play className="w-3 h-3 ml-2 flex-shrink-0" />
                      )}
                    </Button>
                  ))}
                </div>
                
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
                      className="w-full"
                      onValueChange={([value]) => setAnimationSpeed(value)}
                    />
                  </div>
                )}
              </div>
            </Card>
          )}
          
          <Card className="p-4">
            <h3 className="font-semibold text-foreground mb-4">Textures</h3>
            {textures.length === 0 ? (
              <p className="text-sm text-muted-foreground">Loading textures...</p>
            ) : (
              <div className="space-y-4">
                {textures.map((textureInfo, index) => (
                  <div key={index} className="border border-border rounded-lg p-3">
                    <p className="text-sm font-medium text-foreground mb-2 truncate">
                      {textureInfo.name}
                    </p>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id={`texture-${index}`}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleTextureChange(textureInfo, file);
                          }
                        }}
                      />
                      <label
                        htmlFor={`texture-${index}`}
                        className="flex items-center justify-center gap-2 w-full px-3 py-2 text-xs bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 cursor-pointer transition-smooth"
                      >
                        <Upload className="w-3 h-3" />
                        Replace Texture
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      <RenderDialog
        open={renderDialogOpen}
        onOpenChange={setRenderDialogOpen}
        onRender={handleHighQualityRender}
      />
    </div>
  );
};