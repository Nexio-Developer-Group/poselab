import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import heroImage from "@/assets/images/hero-minecraft.jpg";
import { Sparkles, Move3d, Download } from "lucide-react";
import Logo from "@/components/template/Logo";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="bg-gray-950 text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0 opacity-40 grayscale"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Deep Overlay for Dark Theme */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/5 to-gray-950/95 z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_5%,_#020202_95%)] z-10" />

        <div className="relative z-20 text-center max-w-5xl mx-auto px-6">
          <div className="mb-6">
            <Logo mode="dark" logoWidth={220} className="mx-auto" />
          </div>

          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-semibold text-primary animate-pulse shadow-[0_0_20px_rgba(34,197,94,0.2)]">
            <Sparkles className="w-4 h-4" />
            <span className="tracking-wide uppercase">3D MINECRAFT SKIN STUDIO ENGINE v1.0</span>
          </div>

          <h1 className="mb-8 text-5xl md:text-7xl font-black leading-[1.4] tracking-tighter">
            DESIGN, POSE & <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-emerald-400 to-primary-deep animate-gradient">
              RENDER YOUR SKINS
            </span>
          </h1>

          <p className="mx-auto mb-12 max-w-2xl text-lg md:text-lg text-gray-100 font-medium leading-relaxed">
            The ultimate workstation for Minecraft creators. Professional-grade 3D rigging,
            cinematic lighting, and high-fidelity rendering—all in your browser.
          </p>

          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
            <Link to="/pose-lab">
            <Button className="h-14 px-10 transition-all bg-primary hover:bg-primary text-black font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95">
              START CREATING
            </Button>
            </Link>
            <Link to="/home">
            <Button variant="outline" className="h-14 px-10 border-white/10 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 backdrop-blur-md transition-all">
              EXPLORE SHOWCASE
            </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative px-6 py-32 bg-gray-950">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="mx-auto max-w-7xl">
          <div className="mb-24 text-center">
            <h2 className="mb-6 text-3xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-emerald-400 to-primary-deep animate-gradient font-extrabold md:text-6xl tracking-tight">
              CREATE WITHOUT LIMITS
            </h2>
            <div className="w-2xl h-1 bg-primary mx-auto rounded-full mb-8 shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
            <p className="text-lg text-gray-100 max-w-xl mx-auto font-medium">
              Everything you need to bring your Minecraft character to life with
              unparalleled precision and style.
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            <FeatureCard
              icon={<Move3d className="h-8 w-8 text-primary" />}
              title="3D Rigging Engine"
              description="Full cinematic control over limbs, head, and body with precise mathematical rotation for natural poses."
            />
            <FeatureCard
              icon={<Sparkles className="h-8 w-8 text-secondary" />}
              title="Dynamic Expressions"
              description="Switch between facial presets or manually adjust eyes and mouth for emotional character storytelling."
            />
            <FeatureCard
              icon={<Download className="h-8 w-8 text-emerald-400" />}
              title="Ultra-HD Rendering"
              description="Export your creations in stunning 4K resolution with transparent backgrounds for professional thumbnails."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <Card className="group relative overflow-hidden border-white/5 bg-gray-900 p-8 transition-all duration-500 hover:bg-gray-800/80 hover:-translate-y-2 backdrop-blur-xl rounded-xl  ">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] transition-opacity opacity-0 group-hover:opacity-100" />
      <div className="relative z-10">
        <div className="mb-8 inline-flex items-center justify-center rounded-2xl bg-white/5 p-4 transition-all duration-500 group-hover:bg-primary/20 group-hover:scale-110 group-hover:rotate-6">
          {icon}
        </div>
        <h3 className="mb-4 text-2xl font-bold tracking-tight text-white">{title}</h3>
        <p className="text-gray-100 leading-relaxed font-medium">{description}</p>
      </div>
      <div className="absolute bottom-0 left-0 h-1 bg-primary w-0 transition-all duration-500 group-hover:w-full" />
    </Card>
  );
};

export default Index;