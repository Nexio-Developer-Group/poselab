import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import heroImage from "@/assets/images/hero-minecraft.jpg";
import { Sparkles, Move3d, Download } from "lucide-react";
import Logo from "@/components/template/Logo";

const Index = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-100"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-primary/60 to-primary-deep/80 z-0" />
        
        <div className="relative z-10 text-center max-w-5xl mx-auto">

          <div className="flex justify-between items-center">
            <Logo mode="dark" logoWidth={180} className="flex justify-center items-center mx-auto" />
          </div>

          <div className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white animate-fade-in">
            <span className="sm:text-lg">3D Skin Rendering in Your Browser</span>
          </div>
          
          <h1 className="mb-6 text-4xl text-white font-extrabold leading-tight tracking-tight md:text-6xl">
            Pose, Render & Showcase Your{" "}
            <span className="text-white">
              Minecraft Skins
            </span>
          </h1>
          
          <p className="mx-auto mb-12 max-w-2xl text-lg text-white md:text-xl">
            Upload your Minecraft skin, choose a pose, adjust limbs, rotate the camera,
            and generate stunning 3D renders—all directly in your browser.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button variant="outline" className="border-white hover:border-white text-white  hover:bg-white/10">
              Start Creating
            </Button>
            <Button variant="outline" className="border-white hover:border-white text-white  hover:bg-white/10">
              View Examples
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground">
              Powerful tools to create perfect Minecraft character renders
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <FeatureCard
              icon={<Move3d className="h-10 w-10 text-primary" />}
              title="3D Skin Viewer"
              description="Interactively view your Minecraft skin in 3D, rotate, zoom, and see it from every angle."
            />
            <FeatureCard
              icon={<Sparkles className="h-10 w-10 text-secondary" />}
              title="Pose Editor"
              description="Choose preset poses or manually adjust arms, legs, and head angles for perfect screenshots."
            />
            <FeatureCard
              icon={<Download className="h-10 w-10 text-accent" />}
              title="Render & Export"
              description="Generate high-quality renders directly in your browser and download them as PNG images."
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
    <Card className="group relative overflow-hidden border-border bg-card p-8 transition-all duration-300 hover:scale-105 hover:shadow-[var(--shadow-lg)]">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative z-10">
        <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-primary/10 p-3 transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
        <h3 className="mb-3 text-2xl font-semibold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </Card>
  );
};

export default Index;