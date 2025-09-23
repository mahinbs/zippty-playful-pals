import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { bannersService, Banner } from "@/services/banners";

interface HeroCarouselProps {
  currentBannerIndex?: number;
  onBannerChange?: (index: number) => void;
}

const HeroCarousel = ({ currentBannerIndex = 0, onBannerChange }: HeroCarouselProps) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load banners from database
  useEffect(() => {
    const loadBanners = async () => {
      try {
        const data = await bannersService.getActiveBanners();
        setBanners(data);
      } catch (error) {
        console.error("Error loading banners:", error);
        // Use fallback images if banners fail to load
        setBanners([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadBanners();
  }, []);

  // Use banners if available, otherwise show nothing
  const heroImages = banners.length > 0 
    ? banners.map(banner => ({
        src: banner.background_image,
        alt: banner.title,
        title: banner.title,
        subtitle: banner.subtitle || ""
      }))
    : [];

  const goToSlide = (index: number) => {
    onBannerChange?.(index);
  };

  const goToPrevious = () => {
    const newIndex = (currentBannerIndex - 1 + heroImages.length) % heroImages.length;
    onBannerChange?.(newIndex);
  };

  const goToNext = () => {
    const newIndex = (currentBannerIndex + 1) % heroImages.length;
    onBannerChange?.(newIndex);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900" />
        <div className="absolute inset-0 bg-black/30" />
      </div>
    );
  }

  // Don't render if no images
  if (heroImages.length === 0) {
    return null;
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Background Images */}
      {heroImages.map((image, index) => {
        const currentBanner = banners[index];
        const overlayOpacity = currentBanner?.overlay_opacity || 30;
        const overlayStyle = `rgba(0, 0, 0, ${overlayOpacity / 100})`;
        
        return (
          <div key={index}>
            <div
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 transform ${
                index === currentBannerIndex
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-110"
              }`}
              style={{ backgroundImage: `url(${image.src})` }}
            />
            {/* Dynamic Overlay based on banner settings */}
            <div 
              className={`absolute inset-0 transition-all duration-1000 ${
                index === currentBannerIndex ? "opacity-100" : "opacity-0"
              }`}
              style={{ backgroundColor: overlayStyle }}
            />
          </div>
        );
      })}

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevious}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-full"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          {/* Dots */}
          <div className="flex space-x-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentBannerIndex
                    ? "bg-white scale-125"
                    : "bg-white/50 hover:bg-white/70"
                }`}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-full"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Image Info */}
      {/* <div className="absolute bottom-20 left-8 z-30 max-w-md">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-2">
            {heroImages[currentIndex].title}
          </h3>
          <p className="text-white/80">
            {heroImages[currentIndex].subtitle}
          </p>
        </div>
      </div> */}
    </div>
  );
};

export default HeroCarousel;