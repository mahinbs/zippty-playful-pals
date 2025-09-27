import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { bannersService, Banner } from "@/services/banners";

interface HeroCarouselProps {
  currentBannerIndex?: number;
  onBannerChange?: (index: number) => void;
}

const HeroCarousel = ({
  currentBannerIndex = 0,
  onBannerChange,
}: HeroCarouselProps) => {
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

  console.log({ banners });
  // Use banners if available, otherwise show nothing
  const heroImages =
    banners.length > 0
      ? banners.map((banner) => ({
          src: banner.background_image,
          mobSrc: banner.mobile_image || banner.background_image,
          alt: banner.title,
          title: banner.title,
          subtitle: banner.subtitle || "",
        }))
      : [];

  const goToSlide = (index: number) => {
    onBannerChange?.(index);
  };

  const goToPrevious = () => {
    const newIndex =
      (currentBannerIndex - 1 + heroImages.length) % heroImages.length;
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
    <div className="absolute inset-0 overflow-hidden w-full h-full">
      {/* Background Images */}
      {heroImages.map((image, index) => {
        const currentBanner = banners[index];
        const overlayOpacity = currentBanner?.overlay_opacity || 30;
        const overlayStyle = `rgba(0, 0, 0, ${overlayOpacity / 100})`;

        return (
          <div key={index}>
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 transform ${
              index === currentBannerIndex
                ? "opacity-100 scale-100"
                : "opacity-0 scale-110"
            }`}>
              {/* Mobile Image - 3:4 Aspect Ratio */}
              <img
                src={image.mobSrc}
                alt={image.alt}
                className="w-full max-w-sm object-cover md:hidden"
                style={{
                  aspectRatio: '3/4',
                  maxHeight: '80vh'
                }}
              />
              {/* Desktop Image - Full Screen */}
              <img
                src={image.src}
                alt={image.alt}
                className="hidden md:block w-full h-full object-cover"
                style={{
                  minHeight: "100vh",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center center",
                }}
              />
            </div>
            {/* Dynamic Overlay based on banner settings */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${
                index === currentBannerIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* Mobile Overlay - 3:4 Aspect Ratio */}
              <div
                className="w-full max-w-sm md:hidden"
                style={{ 
                  backgroundColor: overlayStyle,
                  aspectRatio: '3/4',
                  maxHeight: '80vh',
                  borderRadius: '0.5rem'
                }}
              />
              {/* Desktop Overlay - Full Screen */}
              <div
                className="hidden md:block absolute inset-0"
                style={{ backgroundColor: overlayStyle }}
              />
            </div>
          </div>
        );
      })}

      {/* Navigation Controls */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevious}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-full h-8 w-8 sm:h-10 sm:w-10"
          >
            <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
          </Button>

          {/* Dots */}
          <div className="flex gap-1 sm:gap-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
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
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-full h-8 w-8 sm:h-10 sm:w-10"
          >
            <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
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
