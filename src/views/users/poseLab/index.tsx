import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CharacterViewer from "@/views/users/LabUtils/CharacterViewer";
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
    <div className="relative w-full flex flex-col items-center justify-center">
      {/* Character Viewer */}
      <CharacterViewer
        skinImage={skinData.image}
        onChangeSkinClick={() => setIsModalOpen(true)}
      />

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-gray-900 border border-white/10 p-8 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] mx-auto relative z-10 w-full max-w-md"
            >
              {/* Close Button */}
              <button
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 border border-white/5 text-gray-500 hover:bg-white/10 hover:text-white transition-all"
                onClick={() => setIsModalOpen(false)}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-white tracking-tighter mb-2">
                  Update <span className="text-primary italic">Skin</span>
                </h2>
                <p className="text-gray-500 text-sm font-medium">Select a new PNG asset to deploy to the simulator</p>
              </div>

              <SkinUpload onSkinUpload={handleSkinUpload} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
