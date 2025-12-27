import { useState, useEffect } from "react";
import { CharacterViewer } from "@/views/users/LabUtils/CharacterViewer";
import { SkinUpload } from "./components/SkinUpload";

const Index = () => {
  const [skinData, setSkinData] = useState<{
    file?: File;
    image: HTMLImageElement;
  } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load default skin automatically
  useEffect(() => {
    const loadDefaultSkin = async () => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = "/skins/default-skin.png";
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      setSkinData({ image: img });
    };
    loadDefaultSkin();
  }, []);

  const handleSkinUpload = (file: File, image: HTMLImageElement) => {
    setSkinData({ file, image });
    setIsModalOpen(false); // close modal after upload
  };

  if (!skinData) return null;

  return (
    <div className="relative h-[92.2vh] w-full flex flex-col items-center justify-center">
      {/* Character Viewer */}
      <CharacterViewer
        skinImage={skinData.image}
        onChangeSkinClick={() => setIsModalOpen(true)}
      />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-xl shadow-2x mx-auto relative">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold text-foreground mb-4 text-center">
              Upload New Skin
            </h2>

            <SkinUpload onSkinUpload={handleSkinUpload} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
