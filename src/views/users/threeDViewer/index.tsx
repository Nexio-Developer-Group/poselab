import { useState } from "react";
import ModelLibrary from "./components/ModelLibrary";
import { ModelViewer } from "@/views/users/LabUtils/ModelViewer";
import { type ModelItem } from "./config";

const Index = () => {
  const [selectedModel, setSelectedModel] = useState<ModelItem | null>(null);

  const handleModelSelect = (model: ModelItem) => {
    setSelectedModel(model);
  };

  const handleExitViewer = () => {
    setSelectedModel(null);
  };

  return (
    <div>
      {!selectedModel ? (
        <ModelLibrary onSelect={handleModelSelect} />
      ) : (
        <ModelViewer
          modelUrl={selectedModel.url}
          onChangeModelClick={handleExitViewer}
        />
      )}
    </div>
  );
};

export default Index;
