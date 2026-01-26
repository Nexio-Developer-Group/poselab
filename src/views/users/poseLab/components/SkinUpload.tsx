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
    <Card className="w-full border-0">
      <div
        className={`
          border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer group
          ${isDragOver
            ? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
            : "border-white/5 bg-[#0a0a0c]/40 hover:border-primary/40 hover:bg-primary/[0.02]"
          }
        `}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {uploadedSkin ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 border border-white/10 rounded-xl overflow-hidden bg-black/40 p-2 shadow-inner">
              <img
                src={uploadedSkin.preview}
                alt="Uploaded skin"
                className="w-full h-full object-contain pixel-art"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
                <CheckCircle className="w-4 h-4 fill-primary/10" /> {uploadedSkin.file.name}
              </div>
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter">Diagnostic: 64x64 PNG • Integrity Verified</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:border-primary/20 group-hover:bg-primary/5 transition-all">
              <Upload className="w-8 h-8 text-gray-500 group-hover:text-primary transition-colors" />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-300 font-black uppercase tracking-widest">Deploy custom appearance</p>
              <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Drop skin or click to browse</p>
            </div>
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
          className="w-full mt-6 bg-primary hover:bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] h-12 rounded-xl transition-all shadow-lg shadow-primary/20"
          size="sm"
          onClick={handleLoadCharacter}
        >
          Initialize Appearance
        </Button>
      )}
    </Card>

  );
};
