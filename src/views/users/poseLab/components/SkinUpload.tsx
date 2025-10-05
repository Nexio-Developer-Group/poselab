import { useState, useRef } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Upload, Image as ImageIcon, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";

interface SkinUploadProps {
  onSkinUpload: (skinFile: File, skinImage: HTMLImageElement) => void;
}

export const SkinUpload = ({ onSkinUpload }: SkinUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedSkin, setUploadedSkin] = useState<{
    file: File;
    image: HTMLImageElement;
    preview: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateSkinFile = (file: File): boolean => {
    if (!file.type.includes("png")) {
      alert("Please upload a PNG file");
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return false;
    }
    return true;
  };

  const loadSkinImage = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        if (img.width !== 64 || img.height !== 64) {
          reject(new Error("Skin must be 64x64 pixels"));
          return;
        }
        resolve(img);
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileUpload = async (file: File) => {
    if (!validateSkinFile(file)) return;

    try {
      const skinImage = await loadSkinImage(file);
      const preview = URL.createObjectURL(file);

      setUploadedSkin({ file, image: skinImage, preview });
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to load skin");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleLoadCharacter = () => {
    if (uploadedSkin) {
      onSkinUpload(uploadedSkin.file, uploadedSkin.image);
    }
  };

  return (
    <Card className="w-full p-4 shadow-lg rounded-xl bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950">
  <div
    className={`
      border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer
      ${isDragOver
        ? "border-primary bg-primary/10 shadow-lg"
        : "border-border hover:border-primary/50 hover:bg-primary/5"
      }
    `}
    onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
    onDragLeave={() => setIsDragOver(false)}
    onDrop={handleDrop}
    onClick={() => fileInputRef.current?.click()}
  >
    {uploadedSkin ? (
      <div className="flex flex-col items-center gap-3">
        <div className="w-24 h-24 border border-border rounded-lg overflow-hidden bg-gray-900">
          <img
            src={uploadedSkin.preview}
            alt="Uploaded skin"
            className="w-full h-full object-contain pixel-art"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
        <div className="flex items-center gap-2 text-primary font-semibold">
          <CheckCircle className="w-5 h-5" /> {uploadedSkin.file.name}
        </div>
        <p className="text-xs text-muted-foreground">64x64 PNG • Ready</p>
      </div>
    ) : (
      <div className="flex flex-col items-center gap-2">
        <Upload className="w-10 h-10 text-muted-foreground" />
        <p className="text-sm text-foreground font-medium">Drop skin or click to upload</p>
        <p className="text-xs text-muted-foreground">PNG • 64x64 pixels</p>
      </div>
    )}
  </div>

  <input
    ref={fileInputRef}
    type="file"
    accept=".png"
    className="hidden"
    onChange={handleFileSelect}
  />

  {uploadedSkin && (
    <Button
      className="w-full mt-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white hover:shadow-xl transition-all"
      size="sm"
      onClick={handleLoadCharacter}
    >
      Load Skin
    </Button>
  )}
</Card>

  );
};
