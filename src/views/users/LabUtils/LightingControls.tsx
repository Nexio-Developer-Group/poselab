import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/slider";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export interface Light {
  id: string;
  type: "directional" | "point" | "spot";
  position: [number, number, number];
  color: string;
  intensity: number;
}

interface LightingControlsProps {
  lights: Light[];
  onLightsChange: (lights: Light[]) => void;
}

export const LightingControls = ({ lights, onLightsChange }: LightingControlsProps) => {
  const [selectedLight, setSelectedLight] = useState<string | null>(lights[0]?.id || null);

  const addLight = () => {
    const newLight: Light = {
      id: `light-${Date.now()}`,
      type: "point",
      position: [0, 5, 0],
      color: "#ffffff",
      intensity: 1,
    };
    onLightsChange([...lights, newLight]);
    setSelectedLight(newLight.id);
    toast.success("Light added");
  };

  const removeLight = (id: string) => {
    if (lights.length === 1) {
      toast.error("Cannot remove the last light");
      return;
    }
    const newLights = lights.filter((l) => l.id !== id);
    onLightsChange(newLights);
    if (selectedLight === id) {
      setSelectedLight(newLights[0]?.id || null);
    }
    toast.success("Light removed");
  };

  const updateLight = (id: string, updates: Partial<Light>) => {
    onLightsChange(
      lights.map((l) => (l.id === id ? { ...l, ...updates } : l))
    );
  };

  const selectedLightData = lights.find((l) => l.id === selectedLight);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          Lighting
        </h4>
        <Button
          size="sm"
          variant="default"
          onClick={addLight}
          className="h-8 px-2"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {/* Light selection */}
        <div className="flex flex-wrap gap-2">
          {lights.map((light, index) => (
            <div key={light.id} className="flex items-center gap-1">
              <Button
                size="sm"
                variant={selectedLight === light.id ? "default" : "outline"}
                onClick={() => setSelectedLight(light.id)}
                className="h-8 text-xs"
              >
                Light {index + 1}
              </Button>
              {lights.length > 1 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeLight(light.id)}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {selectedLightData && (
          <div className="space-y-4 pt-2">
            {/* Light type */}
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">
                Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["directional", "point", "spot"] as const).map((type) => (
                  <Button
                    key={type}
                    size="sm"
                    variant={selectedLightData.type === type ? "default" : "outline"}
                    onClick={() => updateLight(selectedLightData.id, { type })}
                    className="capitalize text-xs h-8"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            {/* Intensity */}
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">
                Intensity: {selectedLightData.intensity.toFixed(1)}
              </label>
              <Slider
                value={[selectedLightData.intensity]}
                onValueChange={([value]) =>
                  updateLight(selectedLightData.id, { intensity: value })
                }
                min={0}
                max={5}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Color */}
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">
                Color
              </label>
              <input
                type="color"
                value={selectedLightData.color}
                onChange={(e) =>
                  updateLight(selectedLightData.id, { color: e.target.value })
                }
                className="w-full h-10 rounded border border-border cursor-pointer"
              />
            </div>

            {/* Position X */}
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">
                Position X: {selectedLightData.position[0].toFixed(1)}
              </label>
              <Slider
                value={[selectedLightData.position[0]]}
                onValueChange={([value]) =>
                  updateLight(selectedLightData.id, {
                    position: [value, selectedLightData.position[1], selectedLightData.position[2]],
                  })
                }
                min={-20}
                max={20}
                step={0.5}
                className="w-full"
              />
            </div>

            {/* Position Y */}
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">
                Position Y: {selectedLightData.position[1].toFixed(1)}
              </label>
              <Slider
                value={[selectedLightData.position[1]]}
                onValueChange={([value]) =>
                  updateLight(selectedLightData.id, {
                    position: [selectedLightData.position[0], value, selectedLightData.position[2]],
                  })
                }
                min={-20}
                max={20}
                step={0.5}
                className="w-full"
              />
            </div>

            {/* Position Z */}
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">
                Position Z: {selectedLightData.position[2].toFixed(1)}
              </label>
              <Slider
                value={[selectedLightData.position[2]]}
                onValueChange={([value]) =>
                  updateLight(selectedLightData.id, {
                    position: [selectedLightData.position[0], selectedLightData.position[1], value],
                  })
                }
                min={-20}
                max={20}
                step={0.5}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};