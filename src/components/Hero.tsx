import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { ArrowRight, Play, Heart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FloatingElements from "./FloatingElements";
import HeroCarousel from "./HeroCarousel";
import { bannersService, Banner } from "@/services/banners";

const Hero = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const activeBanners = await bannersService.getActiveBanners();
        setBanners(activeBanners);
      } catch (error) {
        console.error("Error loading banners:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBanners();
  }, []);

  // Cycle through banners if multiple exist
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
      }, 5000); // Change banner every 5 seconds

      return () => clearInterval(interval);
    }
  }, [banners.length]);

  // Default banner content (fallback)
  const defaultBanner = {
    title: "Joy for them love from you only at Zippty",
    subtitle: "",
    description: "At Zippty, we know pets are more than just animals they're family. That's why we create innovative interactive toys that keep them happy, engaged, and cared for every moment.",
    button_text: "Shop Now",
    button_link: "/shop",
    text_color: "white",
    overlay_opacity: 30,
    background_image: null,
  };

  const currentBanner = banners.length > 0 ? banners[currentBannerIndex] : defaultBanner;
  
  const handleButtonClick = () => {
    navigate(currentBanner.button_link);
  };

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: currentBanner.background_image ? `url(${currentBanner.background_image})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Gradient Mesh Background (fallback) */}
      {!currentBanner.background_image && <div className="absolute inset-0 bg-gradient-mesh" />}
      
      {/* Background Overlay */}
      {currentBanner.background_image && (
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: currentBanner.overlay_opacity / 100 }}
        />
      )}

      {/* Dynamic Hero Carousel (only show if no custom background) */}
      {!currentBanner.background_image && <HeroCarousel />}

      {/* Floating Elements */}
      <FloatingElements />

      <div className="relative z-20 container mx-auto px-4 text-center">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Dynamic Banner Content */}
          <div className="space-y-6 animate-fade-in">
            <h1 
              className={`text-6xl md:text-8xl font-bold leading-tight tracking-tight drop-shadow-2xl ${
                currentBanner.text_color === 'white' ? 'text-white' : 
                currentBanner.text_color === 'black' ? 'text-black' : 
                'text-primary'
              }`}
            >
              {currentBanner.title}
            </h1>

            {(currentBanner.subtitle || currentBanner.description) && (
              <div className="bg-black/30 backdrop-blur-md rounded-3xl p-8 border border-white/30 max-w-4xl mx-auto shadow-2xl">
                {currentBanner.subtitle && (
                  <h2 className={`text-3xl md:text-4xl font-semibold mb-4 ${
                    currentBanner.text_color === 'white' ? 'text-white' : 
                    currentBanner.text_color === 'black' ? 'text-black' : 
                    'text-primary'
                  }`}>
                    {currentBanner.subtitle}
                  </h2>
                )}
                {currentBanner.description && (
                  <p className={`text-2xl md:text-3xl leading-relaxed animate-slide-up drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] font-medium ${
                    currentBanner.text_color === 'white' ? 'text-white' : 
                    currentBanner.text_color === 'black' ? 'text-black' : 
                    'text-primary'
                  }`}>
                    {currentBanner.description}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="flex flex-col gap-8 justify-center items-center animate-scale-in pb-20">
            <Button
              onClick={handleButtonClick}
              variant="hero"
              size="lg"
              className="group text-lg px-8 py-4 rounded-2xl hover:scale-105 transition-all duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            >
              {currentBanner.button_text}
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
            </Button>
            
            {!isLoading && banners.length === 0 && (
              <div className="text-lg text-white/90 animate-bounce-slow drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-medium">
                <p>✨ Transform playtime into an extraordinary adventure ✨</p>
              </div>
            )}

            {/* Banner Navigation Dots */}
            {banners.length > 1 && (
              <div className="flex gap-2">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBannerIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentBannerIndex 
                        ? 'bg-white' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Stats Cards */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 animate-slide-up">
            <GlassCard
              intensity="medium"
              animated
              className="p-6 text-center bg-black/30 backdrop-blur-md border border-white/30 shadow-2xl"
            >
              <Heart className="h-8 w-8 text-red-400 mx-auto mb-3 animate-pulse drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
              <div className="text-3xl font-bold mb-2 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                2k+
              </div>
              <div className="text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                Happy Pets
              </div>
            </GlassCard>

            <GlassCard
              intensity="medium"
              animated
              className="p-6 text-center bg-black/30 backdrop-blur-md border border-white/30 shadow-2xl"
            >
              <Star className="h-8 w-8 text-yellow-400 mx-auto mb-3 animate-pulse drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
              <div className="text-3xl font-bold mb-2 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                4.9
              </div>
              <div className="text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                Average Rating
              </div>
            </GlassCard>

            <GlassCard
              intensity="medium"
              animated
              className="p-6 text-center bg-black/30 backdrop-blur-md border border-white/30 shadow-2xl"
            >
              <div className="text-2xl mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                🎮
              </div>
              <div className="text-3xl font-bold mb-2 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                50+
              </div>
              <div className="text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                Smart Toys
              </div>
            </GlassCard>
          </div> */}
        </div>
      </div>
    </section>
  );
};
export default Hero;
