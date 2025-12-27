import { useState } from "react";
import { ModelUpload } from "./components/ModelUpload";
import { ModelViewer } from "@/views/users/LabUtils/ModelViewer";

const Index = () => {
  const [viewMode, setViewMode] = useState<"model">("model");
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  
  const handleModelUpload = (url: string) => {
    setModelUrl(url);
  };

  const handleNewModel = () => {
    setModelUrl(null);
    setViewMode("model");
  };


  if (viewMode === "model") {
    return (
      <div className="min-h-screen">
        {!modelUrl ? (
          <ModelUpload onModelUpload={handleModelUpload} />
        ) : (
          <ModelViewer
            modelUrl={modelUrl}
            onNewModel={handleNewModel}
          />
        )}
      </div>
    );
  }

  return null;
};

export default Index;
