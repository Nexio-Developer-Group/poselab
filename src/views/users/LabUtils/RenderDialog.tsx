import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/Input";
import { Progress } from "@/components/ui/progress";
import { Download, Loader2, X } from "lucide-react";

export interface RenderSettings {
  width: number;
  height: number;
  transparentBackground: boolean;
  quality: number;
}

interface RenderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRender: (settings: RenderSettings, onProgress: (progress: number) => void) => Promise<{ blob: Blob; previewUrl: string }>;
}

const PRESET_SIZES = [
  { label: "HD (1920x1080)", value: "1920x1080" },
  { label: "2K (2560x1440)", value: "2560x1440" },
  // { label: "4K (3840x2160)", value: "3840x2160" },
  { label: "Square HD (1080x1080)", value: "1080x1080" },
  { label: "Custom", value: "custom" },
];

export const RenderDialog = ({ open, onOpenChange, onRender }: RenderDialogProps) => {
  const [sizePreset, setSizePreset] = useState("1920x1080");
  const [customWidth, setCustomWidth] = useState(1920);
  const [customHeight, setCustomHeight] = useState(1080);
  const [transparentBackground, setTransparentBackground] = useState(false);
  const [quality, setQuality] = useState(2);
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [renderedBlob, setRenderedBlob] = useState<Blob | null>(null);

  const handleRender = async () => {
    let width = customWidth;
    let height = customHeight;

    if (sizePreset !== "custom") {
      const [w, h] = sizePreset.split("x").map(Number);
      width = w;
      height = h;
    }

    const settings: RenderSettings = {
      width,
      height,
      transparentBackground,
      quality,
    };

    setIsRendering(true);
    setRenderProgress(0);
    setPreviewUrl(null);
    setRenderedBlob(null);

    try {
      const result = await onRender(settings, setRenderProgress);
      setPreviewUrl(result.previewUrl);
      setRenderedBlob(result.blob);
    } catch (error) {
      console.error("Render error:", error);
    } finally {
      setIsRendering(false);
    }
  };

  const handleDownload = () => {
    if (!renderedBlob) return;

    let width = customWidth;
    let height = customHeight;

    if (sizePreset !== "custom") {
      const [w, h] = sizePreset.split("x").map(Number);
      width = w;
      height = h;
    }

    const url = URL.createObjectURL(renderedBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `render-${width}x${height}.png`;
    link.click();
    URL.revokeObjectURL(url);
    
    onOpenChange(false);
    setPreviewUrl(null);
    setRenderedBlob(null);
  };

  const handleClose = () => {
    onOpenChange(false);
    setPreviewUrl(null);
    setRenderedBlob(null);
    setIsRendering(false);
    setRenderProgress(0);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className=" bg-white sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>High Quality Render</DialogTitle>
          <DialogDescription>
            {previewUrl ? "Preview and download your render" : "Configure render settings for highest quality output"}
          </DialogDescription>
        </DialogHeader>

        {previewUrl ? (
          // Preview Mode
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden border border-border bg-muted">
              <img 
                src={previewUrl} 
                alt="Render preview" 
                className="w-full h-auto"
                style={{ maxHeight: '500px', objectFit: 'contain' }}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleClose}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        ) : (
          // Settings Mode
          <>
            <div className="space-y-6 py-4">
          {/* Size Preset */}
          <div className="space-y-2 bg-white">
            <Label>Resolution</Label>
            <Select value={sizePreset} onValueChange={setSizePreset}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {PRESET_SIZES.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Size */}
          {sizePreset === "custom" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width">Width (px)</Label>
                <Input
                  id="width"
                  type="number"
                  value={customWidth}
                  min={512}
                  max={7680}
                  onChange={(e) => setCustomWidth(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (px)</Label>
                <Input
                  id="height"
                  type="number"
                  value={customHeight}
                  min={512}
                  max={4320}
                  onChange={(e) => setCustomHeight(Number(e.target.value))}
                />
              </div>
            </div>
          )}

          {/* Quality */}
          <div className="space-y-2">
            <Label>Anti-aliasing Quality</Label>
            <Select value={quality.toString()} onValueChange={(v) => setQuality(Number(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="1">Standard (1x)</SelectItem>
                <SelectItem value="2">High (2x)</SelectItem>
                {/* <SelectItem value="4">Ultra (4x)</SelectItem> */}
              </SelectContent>
            </Select>
          </div>

          {/* Transparent Background */}
          <div className="flex items-center justify-between">
            <Label htmlFor="transparent" className="cursor-pointer">
              Transparent Background
            </Label>
            <Switch
              id="transparent"
              className="mr-2 p-1 border border-gray-400 "
              checked={transparentBackground}
              onCheckedChange={setTransparentBackground}
            />
          </div>

          {/* Progress Bar */}
          {isRendering && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Rendering...</span>
                <span className="font-medium">{renderProgress}%</span>
              </div>
              <Progress value={renderProgress} className="w-full" />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline"  disabled={isRendering} onClick={handleClose}>
            Cancel
          </Button>
          <Button  disabled={isRendering} onClick={handleRender}>
            {isRendering ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Rendering...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Render Preview
              </>
            )}
          </Button>
        </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};