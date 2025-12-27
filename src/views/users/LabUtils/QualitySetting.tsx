import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Cpu } from "lucide-react";
import { QualityLevel } from "./qualitySettings";

interface QualitySettingsProps {
  quality: QualityLevel;
  autoDetectedQuality: QualityLevel;
  isUserOverride: boolean;
  onQualityChange: (quality: QualityLevel) => void;
  onResetToAuto: () => void;
  fps?: number;
}

const QUALITY_DESCRIPTIONS = {
  low: "Optimized for low-end devices and mobile",
  medium: "Balanced quality and performance",
  high: "Enhanced visuals for desktop",
  ultra: "Maximum quality for high-end GPUs"
};

const QUALITY_ICONS = {
  low: "📱",
  medium: "💻",
  high: "🖥️",
  ultra: "🚀"
};

export const QualitySetting = ({
  quality,
  autoDetectedQuality,
  isUserOverride,
  onQualityChange,
  onResetToAuto,
  fps
}: QualitySettingsProps) => {
  return (
    <div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-foreground">Quality Settings</h4>
          </div>
          {fps !== undefined && (
            <Badge className="text-white" variant={fps > 50 ? "default" : fps > 30 ? "default" : "default"}>
              {Math.round(fps)} FPS
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Rendering Quality</Label>
            {isUserOverride && (
              <Badge variant="outline" className="text-xs">
                Manual
              </Badge>
            )}
          </div>
          
          <Select value={quality} onValueChange={(v) => onQualityChange(v as QualityLevel)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {(["low", "medium", "high", "ultra"] as QualityLevel[]).map((level) => (
                <SelectItem key={level} value={level}>
                  <div className="flex items-center gap-2">
                    <span>{QUALITY_ICONS[level]}</span>
                    <span className="capitalize">{level}</span>
                    {level === autoDetectedQuality && (
                      <Cpu className="w-3 h-3 text-muted-foreground" />
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <p className="text-xs text-muted-foreground">
            {QUALITY_DESCRIPTIONS[quality]}
          </p>
        </div>

        {isUserOverride && (
          <Button
            variant="outline"
            size="sm"
            onClick={onResetToAuto}
            className="w-full flex items-center gap-2"
          >
            <RotateCcw className="w-3 h-3" />
            Reset to Auto ({autoDetectedQuality})
          </Button>
        )}

        <div className="pt-2 border-t border-border">
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Auto-detected:</span>
              <span className="font-medium capitalize">{autoDetectedQuality}</span>
            </div>
            <div className="flex justify-between">
              <span>Active:</span>
              <span className="font-medium capitalize">{quality}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

