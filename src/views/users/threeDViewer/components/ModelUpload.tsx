import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import { Upload, FileType } from "lucide-react";
import { toast } from "sonner";

interface ModelUploadProps {
  onModelUpload: (file: File, url: string) => void;
}

export const ModelUpload = ({ onModelUpload }: ModelUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    const validModelExtensions = [".glb", ".gltf"];
    const validImageExtensions = [".png", ".jpg", ".jpeg"];
    const fileName = file.name.toLowerCase();

    const isModel = validModelExtensions.some((ext) => fileName.endsWith(ext));
    const isImage = validImageExtensions.some((ext) => fileName.endsWith(ext));

    if (!isModel && !isImage) {
      toast.error("Invalid file type. Please upload a .glb, .gltf, or a Minecraft skin (.png/.jpg).");
      return;
    }

    // Warn for .gltf (external textures)
    if (fileName.endsWith(".gltf")) {
      toast.warning(
        "Note: .gltf files with external textures may not load. Use .glb for best results.",
        { duration: 5000 }
      );
    }

    const url = URL.createObjectURL(file);
    onModelUpload(file, url);
    toast.success(isImage ? "Skin loaded successfully!" : "Model loaded successfully!");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="w-full flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-xl p-6 sm:p-8 bg-card/70 backdrop-blur-md border border-border/50 shadow-xl transition-all duration-300">
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-gaming rounded-2xl shadow-glow mx-auto">
            <FileType className="w-10 h-10 text-primary-foreground" />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Upload 3D Model
            </h1>
            <p className="text-muted-foreground">
              Drag and drop or choose a <code>.glb</code> / <code>.gltf</code> file
            </p>
          </div>

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 sm:p-12 transition-all cursor-pointer ${isDragging
                ? "border-primary bg-primary/10 scale-105"
                : "border-border hover:border-primary/50 hover:bg-accent/5"
              }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="space-y-4">
              <Upload className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-muted-foreground" />
              <p className="text-sm text-foreground font-medium">
                Drag & drop your model here
              </p>
              <p className="text-xs text-muted-foreground">
                <strong>Recommended:</strong> Use <code>.glb</code> (embedded textures)
              </p>

              {/* File Input */}
              <div className="relative">
                <input
                  type="file"
                  accept=".glb,.gltf,model/gltf-binary,model/gltf+json"
                  className="hidden"
                  id="model-upload"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                />
                <label htmlFor="model-upload">
                  <Button
                    asChild
                    className="cursor-pointer bg-gradient-gaming hover:shadow-glow transition-smooth"
                  >
                    <span>
                      <Upload className="w-4 h-4 mr-2 inline-block" />
                      Choose File
                    </span>
                  </Button>
                </label>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Models with baked animations will play automatically</p>
            <p>• You can swap textures or poses live</p>
            <p>• Capture cinematic renders directly in the viewer</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ModelUpload;
