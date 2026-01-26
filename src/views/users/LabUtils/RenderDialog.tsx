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
import { Download, Loader2, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  { label: "4K (3840x2160)", value: "3840x2160" },
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
      <DialogContent className="bg-gray-900/95 border border-white/10 sm:max-w-[700px] text-white p-0 overflow-hidden backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-none !duration-0 data-[state=open]:animate-none data-[state=closed]:animate-none">
        <AnimatePresence mode="wait">
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="p-8 space-y-6"
            >
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-black tracking-tighter">
                      High Quality <span className="text-primary italic">Render</span>
                    </DialogTitle>
                    <DialogDescription className="text-gray-500 font-medium">
                      {previewUrl ? "Preview and download your masterwork" : "Configure cinematic render settings for high-fidelity output"}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              {previewUrl ? (
                // Preview Mode
                <div className="space-y-6">
                  <div className="relative rounded-2xl overflow-hidden border border-white/5 bg-black/40 shadow-2xl">
                    <img
                      src={previewUrl}
                      alt="Render preview"
                      className="w-full h-auto"
                      style={{ maxHeight: "500px", objectFit: "contain" }}
                    />
                  </div>
                  <div className="flex gap-3 justify-end">
                    <Button
                      variant="outline"
                      onClick={handleClose}
                      className="bg-white/5 border-white/5 hover:bg-white/10 text-gray-400"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Discard
                    </Button>
                    <Button
                      onClick={handleDownload}
                      className="bg-primary hover:bg-white text-black font-bold px-8"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Save Render
                    </Button>
                  </div>
                </div>
              ) : (
                // Settings Mode
                <>
                  <div className="space-y-6">
                    {/* Size Preset */}
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                        Resolution Preset
                      </Label>
                      <Select value={sizePreset} onValueChange={setSizePreset}>
                        <SelectTrigger className="bg-gray-950 border-white/5 h-12 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-950 border-white/10 text-white rounded-xl">
                          {PRESET_SIZES.map((size) => (
                            <SelectItem
                              key={size.value}
                              value={size.value}
                              className="focus:bg-white/10 cursor-pointer"
                            >
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
                          <Label
                            htmlFor="width"
                            className="text-[10px] font-bold uppercase tracking-widest text-gray-500"
                          >
                            Width (px)
                          </Label>
                          <Input
                            id="width"
                            type="number"
                            value={customWidth}
                            min={512}
                            max={7680}
                            onChange={(e) => setCustomWidth(Number(e.target.value))}
                            className="bg-gray-950 border-white/5 h-12 rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="height"
                            className="text-[10px] font-bold uppercase tracking-widest text-gray-500"
                          >
                            Height (px)
                          </Label>
                          <Input
                            id="height"
                            type="number"
                            value={customHeight}
                            min={512}
                            max={4320}
                            onChange={(e) => setCustomHeight(Number(e.target.value))}
                            className="bg-gray-950 border-white/5 h-12 rounded-xl"
                          />
                        </div>
                      </div>
                    )}

                    {/* Quality */}
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                        Sampling Density
                      </Label>
                      <Select
                        value={quality.toString()}
                        onValueChange={(v) => setQuality(Number(v))}
                      >
                        <SelectTrigger className="bg-gray-950 border-white/5 h-12 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-950 border-white/10 text-white rounded-xl">
                          <SelectItem
                            value="1"
                            className="focus:bg-white/10 cursor-pointer"
                          >
                            Standard (1x)
                          </SelectItem>
                          <SelectItem
                            value="2"
                            className="focus:bg-white/10 cursor-pointer"
                          >
                            High Fidelity (2x)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Transparent Background */}
                    <div className="flex items-center justify-between p-4 bg-gray-950 rounded-xl border border-white/5">
                      <Label
                        htmlFor="transparent"
                        className="cursor-pointer text-sm font-medium"
                      >
                        Transparent Alpha Channel
                      </Label>
                      <Switch
                        id="transparent"
                        className="data-[state=checked]:bg-primary"
                        checked={transparentBackground}
                        onCheckedChange={setTransparentBackground}
                      />
                    </div>

                    {/* Progress Bar */}
                    {isRendering && (
                      <div className="space-y-3 p-4 bg-primary/5 rounded-xl border border-primary/20">
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                          <span className="text-primary animate-pulse">
                            Processing Master...
                          </span>
                          <span className="text-primary">{renderProgress}%</span>
                        </div>
                        <Progress value={renderProgress} className="h-1.5" />
                      </div>
                    )}
                  </div>

                  <DialogFooter className="gap-3 pt-4">
                    <Button
                      variant="outline"
                      disabled={isRendering}
                      onClick={handleClose}
                      className="bg-white/5 border-white/5 hover:bg-white/10 text-gray-500"
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={isRendering}
                      onClick={handleRender}
                      className="bg-primary hover:bg-white text-black font-black uppercase tracking-widest text-xs px-8 h-12 rounded-xl transition-all"
                    >
                      {isRendering ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Computing...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Initialize Render
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};