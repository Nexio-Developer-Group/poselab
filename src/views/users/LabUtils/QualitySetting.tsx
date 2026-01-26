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
            <h4 className="font-semibold text-white">Quality Settings</h4>
          </div>
          {fps !== undefined && (
            <Badge className="bg-primary text-black font-bold h-6" variant="default">
              {Math.round(fps)} FPS
            </Badge>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Rendering Quality</Label>
            {isUserOverride && (
              <Badge variant="outline" className="text-[10px] bg-white/5 border-white/10 text-primary">
                Manual
              </Badge>
            )}
          </div>

          <Select value={quality} onValueChange={(v) => onQualityChange(v as QualityLevel)}>
            <SelectTrigger className="bg-gray-900 border-white/10 text-white h-12 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-white/10 text-white rounded-xl shadow-2xl">
              {(["low", "medium", "high", "ultra"] as QualityLevel[]).map((level) => (
                <SelectItem key={level} value={level} className="focus:bg-white/10 focus:text-white cursor-pointer py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{QUALITY_ICONS[level]}</span>
                    <span className="capitalize font-medium">{level}</span>
                    {level === autoDetectedQuality && (
                      <Cpu className="w-3.5 h-3.5 text-primary" />
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <p className="text-[10px] font-medium text-gray-500 italic leading-relaxed">
            {QUALITY_DESCRIPTIONS[quality]}
          </p>
        </div>

        {isUserOverride && (
          <Button
            variant="outline"
            size="sm"
            onClick={onResetToAuto}
            className="w-full h-10 rounded-xl flex items-center gap-2 bg-white/5 border-white/5 hover:border-primary/50 text-gray-400 hover:text-white transition-all font-bold text-[10px] uppercase tracking-widest"
          >
            <RotateCcw className="w-3 h-3" />
            Reset to Auto ({autoDetectedQuality})
          </Button>
        )}

        <div className="pt-4 border-t border-white/5">
          <div className="text-[10px] font-bold tracking-widest text-gray-600 uppercase space-y-2">
            <div className="flex justify-between items-center">
              <span>Auto-detected</span>
              <span className="text-gray-400 bg-white/5 px-2 py-0.5 rounded uppercase">{autoDetectedQuality}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Active Profile</span>
              <span className="text-primary bg-primary/10 px-2 py-0.5 rounded uppercase">{quality}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

