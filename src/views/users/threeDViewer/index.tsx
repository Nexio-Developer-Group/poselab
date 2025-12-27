import { useState, useEffect } from "react";
import { ModelUpload } from "./components/ModelUpload";
import { ModelViewer } from "@/views/users/LabUtils/ModelViewer";
import CharacterViewer from "@/views/users/LabUtils/CharacterViewer";

const Index = () => {
  const [modelType, setModelType] = useState<"model" | "skin" | null>(null);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [skinImage, setSkinImage] = useState<HTMLImageElement | null>(null);

  const handleModelUpload = (file: File, url: string) => {
    const fileName = file.name.toLowerCase();
    const isImage = [".png", ".jpg", ".jpeg"].some(ext => fileName.endsWith(ext));

    if (isImage) {
      const img = new Image();
      img.onload = () => {
        setSkinImage(img);
        setModelType("skin");
        setModelUrl(url);
      };
      img.src = url;
    } else {
      setModelUrl(url);
      setModelType("model");
    }
  };

  const handleNewModel = () => {
    setModelUrl(null);
    setModelType(null);
    setSkinImage(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c]">
      {!modelUrl ? (
        <ModelUpload onModelUpload={handleModelUpload} />
      ) : (
        modelType === "skin" && skinImage ? (
          <CharacterViewer
            skinImage={skinImage}
            onChangeSkinClick={handleNewModel}
          />
        ) : (
          <ModelViewer
            modelUrl={modelUrl}
            onChangeModelClick={handleNewModel}
          />
        )
      )}
    </div>
  );
};

export default Index;
