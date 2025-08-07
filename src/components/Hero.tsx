import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "@/assets/hero-pets.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-6xl font-bold leading-tight">
              The{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                smarter
              </span>{" "}
              way to shop for your pet
            </h2>
            <p className="text-xl text-muted-foreground max-w-lg">
              At Zippty, we believe playtime isn't just fun; it's essential for your pet's 
              physical and mental well-being. Discover cutting-edge interactive toys and 
              robots designed to engage, excite, and enrich your furry friend's life.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="hero" size="lg" className="group">
              Shop Interactive Toys
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="group">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
          
          <div className="flex items-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent rounded-full" />
              <span>Free shipping over $50</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent rounded-full" />
              <span>30-day returns</span>
            </div>
          </div>
        </div>
        
        {/* Right side - could add more content or keep the image visible */}
        <div className="hidden lg:block" />
      </div>
    </section>
  );
};

export default Hero;
