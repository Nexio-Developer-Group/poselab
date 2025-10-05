import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import { Upload, FileType } from "lucide-react";
import { toast } from "sonner"

interface ModelUploadProps {
  onModelUpload: (url: string) => void;
}

export const ModelUpload = ({ onModelUpload }: ModelUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    const validExtensions = ['.glb', '.gltf'];
    const fileName = file.name.toLowerCase();
    
    const hasValidExtension = validExtensions.some(ext => 
      fileName.endsWith(ext)
    );
    
    if (!hasValidExtension) {
      toast.error("Invalid file type. Please upload a .glb or .gltf file.");
      return;
    }

    // Warn if .gltf file (may have external dependencies)
    if (fileName.endsWith('.gltf')) {
      toast.warning("Note: .gltf files with external textures may not load. Use .glb for best results.", {
        duration: 5000
      });
    }

    const url = URL.createObjectURL(file);
    onModelUpload(url);
    toast.success("Model loaded successfully!");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-8">
      <Card className="w-full max-w-2xl p-8 bg-card/50 backdrop-blur-sm border-border shadow-elevated">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-gaming rounded-2xl shadow-glow">
            <FileType className="w-10 h-10 text-primary-foreground" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">3D Model Viewer</h1>
            <p className="text-muted-foreground">
              Upload your glTF or GLB model with textures
            </p>
          </div>

          <div
            className={`border-2 border-dashed rounded-xl p-12 transition-all ${
              isDragging
                ? "border-primary bg-primary/5 scale-105"
                : "border-border hover:border-primary/50 hover:bg-accent/5"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="space-y-4">
              <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
              <div className="space-y-2">
                <p className="text-sm text-foreground font-medium">
                  Drag & drop your model file here
                </p>
                <p className="text-xs text-muted-foreground">
                  <strong>Recommended:</strong> Use .glb format (embedded textures)
                </p>
                <p className="text-xs text-muted-foreground">
                  .gltf files with external dependencies may not load properly
                </p>
              </div>
              
              <div className="relative">
                <input
                  type="file"
                  accept=".glb,.gltf,model/gltf-binary,model/gltf+json"
                  className="hidden"
                  id="model-upload"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileSelect(file);
                    }
                  }}
                />
                <label htmlFor="model-upload">
                  <Button 
                    asChild
                    className="cursor-pointer bg-gradient-gaming hover:shadow-glow transition-smooth"
                  >
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </span>
                  </Button>
                </label>
              </div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Models with baked animations will play automatically</p>
            <p>• You can swap textures live after loading</p>
            <p>• Take high-quality screenshots of your renders</p>
          </div>
        </div>
      </Card>
    </div>
  );
};