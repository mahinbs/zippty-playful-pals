import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { ArrowRight, Play, Heart, Star } from "lucide-react";
import FloatingElements from "./FloatingElements";
import HeroCarousel from "./HeroCarousel";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient Mesh Background */}
      <div className="absolute inset-0 bg-gradient-mesh" />
      
      {/* Dynamic Hero Carousel */}
      <HeroCarousel />
      
      {/* Floating Elements */}
      <FloatingElements />
      
      {/* Enhanced Glass Overlay */}
      <div className="absolute inset-0 bg-gradient-hero backdrop-blur-md" />
      
      <div className="relative z-20 container mx-auto px-4 text-center text-white">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Animated Main Heading */}
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-bold leading-tight tracking-tight drop-shadow-2xl">
              <span className="text-white">Joy for them{" "}</span>
              <span className="bg-gradient-accent bg-clip-text text-transparent animate-pulse-slow drop-shadow-lg">
                love from you
              </span>{" "}
              <span className="text-white">only at{" "}</span>
              <span className="relative text-white">
                Zippty
                <div className="absolute -inset-2 bg-gradient-primary opacity-30 blur-xl rounded-full animate-pulse-slow" />
              </span>
            </h1>
            
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 max-w-4xl mx-auto">
              <p className="text-2xl md:text-3xl text-white leading-relaxed animate-slide-up">
                At Zippty, we know your pets are more than just animals—they're family. 
                Experience the future of pet care with our revolutionary interactive toys.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-scale-in">
            <Button size="lg" className="group bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-lg px-8 py-4 rounded-2xl shadow-glass transition-glass hover:shadow-float hover:scale-105">
              <Play className="mr-3 h-6 w-6" />
              Watch Demo
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
            </Button>
            
            <Button variant="hero" size="lg" className="group text-lg px-8 py-4 rounded-2xl hover:scale-105 transition-all duration-300">
              Shop Now
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 animate-slide-up">
            <GlassCard intensity="medium" animated className="p-6 text-center">
              <Heart className="h-8 w-8 text-red-400 mx-auto mb-3 animate-pulse" />
              <div className="text-3xl font-bold mb-2">2k+</div>
              <div className="text-white/80">Happy Pets</div>
            </GlassCard>
            
            <GlassCard intensity="medium" animated className="p-6 text-center">
              <Star className="h-8 w-8 text-yellow-400 mx-auto mb-3 animate-pulse" />
              <div className="text-3xl font-bold mb-2">4.9</div>
              <div className="text-white/80">Average Rating</div>
            </GlassCard>
            
            <GlassCard intensity="medium" animated className="p-6 text-center">
              <div className="text-2xl mb-3">🎮</div>
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-white/80">Smart Toys</div>
            </GlassCard>
          </div>
          
          <div className="text-lg text-white/70 animate-bounce-slow">
            ✨ Transform playtime into an extraordinary adventure ✨
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
