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

  // Load banners
  useEffect(() => {
    const loadBanners = async () => {
      try {
        const data = await bannersService.getActiveBanners();
        setBanners(data);
      } catch (error) {
        console.error("Error loading banners:", error);
        // Use fallback content if banners fail to load
        setBanners([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadBanners();
  }, []);

  // Auto-rotate banners
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const currentBanner = banners[currentBannerIndex];

  // Get responsive image based on screen size using CSS classes instead of JS
  const getMobileImage = (banner: Banner) => {
    return banner.mobile_image || banner.background_image || banner.desktop_image;
  };
  
  const getDesktopImage = (banner: Banner) => {
    return banner.desktop_image || banner.background_image || banner.mobile_image;
  };

  return (
    <section className="relative flex items-center justify-center overflow-hidden w-full max-h-[80vh] md:max-h-max">
      {/* Dynamic Background Images - Responsive */}
      {currentBanner && (getMobileImage(currentBanner) || getDesktopImage(currentBanner)) && (
        <>
          {/* Mobile Background - 3:4 Aspect Ratio */}
          {getMobileImage(currentBanner) && (
            <div className="absolute inset-0 flex items-center justify-center md:hidden">
              <div 
                className="w-full max-w-sm bg-cover bg-center bg-no-repeat transition-all duration-1000"
                style={{
                  backgroundImage: `url(${getMobileImage(currentBanner)})`,
                  aspectRatio: '3/4',
                  maxHeight: '80vh'
                }}
              >
                {/* Mobile Overlay */}
                <div 
                  className="absolute inset-0 bg-black transition-opacity duration-1000 rounded-lg"
                  style={{ 
                    opacity: (currentBanner.overlay_opacity || 30) / 100 
                  }}
                />
              </div>
            </div>
          )}
          
          {/* Desktop Background */}
          {getDesktopImage(currentBanner) && (
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 hidden md:block"
              style={{
                backgroundImage: `url(${getDesktopImage(currentBanner)})`,
              }}
            >
              {/* Desktop Overlay */}
              <div 
                className="absolute inset-0 bg-black transition-opacity duration-1000"
                style={{ 
                  opacity: (currentBanner.overlay_opacity || 30) / 100 
                }}
              />
            </div>
          )}
        </>
      )}

      {/* Fallback Gradient Background */}
      {(!currentBanner || (!getMobileImage(currentBanner) && !getDesktopImage(currentBanner))) && (
        <div className="absolute inset-0 bg-gradient-mesh" />
      )}

      {/* Dynamic Hero Carousel */}
      <HeroCarousel
        currentBannerIndex={currentBannerIndex}
        onBannerChange={setCurrentBannerIndex}
      />

      {/* Floating Elements */}
      <FloatingElements />

      {/* Enhanced Glass Overlay */}

      <div className="relative z-20 container mx-auto px-4 text-center text-white">
        <div className="max-w-6xl mx-auto space-y-12">
          {isLoading ? (
            // Loading state
            <div className="flex flex-col items-center justify-center space-y-6 animate-fade-in">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"></div>
              <p className="text-xl text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-medium">
                Loading banners...
              </p>
            </div>
          ) : banners.length > 0 && currentBanner ? (
            // Dynamic banner content
            <div className="space-y-6 animate-fade-in">
              <h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold leading-tight tracking-tight drop-shadow-2xl"
                style={{ color: currentBanner.text_color || "white" }}
              >
                <span className="drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                  {currentBanner.title}
                </span>
              </h1>

              {currentBanner.subtitle && (
                <div className="bg-black/30 backdrop-blur-md rounded-3xl p-4 sm:p-6 md:p-8 border border-white/30 max-w-4xl mx-auto shadow-2xl">
                  <p
                    className="text-lg sm:text-xl md:text-2xl lg:text-3xl leading-relaxed animate-slide-up drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] font-medium"
                    style={{ color: currentBanner.text_color || "white" }}
                  >
                    {currentBanner.subtitle}
                  </p>
                </div>
              )}

              {currentBanner.description && (
                <div className="backdrop-blur-md rounded-2xl p-3 sm:p-4 max-w-3xl mx-auto shadow-xl">
                  <p
                    className="text-sm sm:text-base md:text-lg leading-relaxed animate-slide-up drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                    style={{ color: currentBanner.text_color || "white" }}
                  >
                    {currentBanner.description}
                  </p>
                </div>
              )}
            </div>
          ) : null}

          {/* Action Buttons */}
          <div className="flex flex-col gap-8 justify-center items-center animate-scale-in pb-20">
            <Button
              onClick={() => navigate(currentBanner?.button_link || "/shop")}
              variant="hero"
              size="lg"
              className="group text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-2xl hover:scale-105 transition-all duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            >
              {currentBanner?.button_text || "Shop Now"}
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
            </Button>
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
