import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductDetailModal from "@/components/ProductDetailModal";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import heroImage from "@/assets/hero-pets.jpg";
import robotToyPremium from "@/assets/robot-toy-premium.jpg";
import catToyPremium from "@/assets/cat-toy-premium.jpg";
import puzzleFeederPremium from "@/assets/puzzle-feeder-premium.jpg";
import laserToyPremium from "@/assets/laser-toy-premium.jpg";

const products = [
  {
    name: "SmartPlay Robot Companion",
    price: "$149.99",
    originalPrice: "$199.99",
    rating: 5,
    reviews: 127,
    image: robotToyPremium,
    category: "Interactive Robots",
    isNew: true,
    description: "An advanced AI-powered robot companion that adapts to your pet's behavior and provides hours of interactive entertainment. Features motion sensors, LED lights, and autonomous movement patterns.",
    features: [
      "AI-powered adaptive play modes",
      "Motion sensors and obstacle avoidance",
      "LED light patterns for visual stimulation",
      "Rechargeable battery (8+ hours)",
      "Safe, durable materials",
      "App connectivity for remote control"
    ]
  },
  {
    name: "FelineBot Interactive Cat Toy",
    price: "$89.99",
    rating: 5,
    reviews: 89,
    image: catToyPremium,
    category: "Cat Toys",
    description: "A high-tech interactive toy designed specifically for cats, featuring feathers, motion sensors, and unpredictable movement patterns to trigger your cat's hunting instincts.",
    features: [
      "Automatic motion detection",
      "Replaceable feather attachments",
      "Silent motor operation",
      "Timer-based play sessions",
      "Battery level indicator",
      "Washable components"
    ]
  },
  {
    name: "BrainBoost Puzzle Feeder",
    price: "$69.99",
    originalPrice: "$89.99",
    rating: 4,
    reviews: 203,
    image: puzzleFeederPremium,
    category: "Smart Feeders",
    description: "Transform mealtime into a mental workout with this innovative puzzle feeder. Multiple difficulty levels and adjustable compartments keep your pet engaged while eating.",
    features: [
      "Adjustable difficulty levels",
      "Multiple feeding compartments",
      "Non-slip base design",
      "Easy to clean and fill",
      "Slows down eating pace",
      "Suitable for all pet sizes"
    ]
  },
  {
    name: "AutoLaser Pro Pet Entertainment",
    price: "$75.99",
    rating: 5,
    reviews: 156,
    image: laserToyPremium,
    category: "Cat Toys",
    description: "Professional-grade automatic laser toy with multiple play patterns and safety features. Keeps your cat active and engaged even when you're away.",
    features: [
      "5 different laser patterns",
      "Auto shut-off safety timer",
      "Silent operation mode",
      "Wall or floor mounting",
      "Remote control included",
      "Pet-safe laser technology"
    ]
  },
  {
    name: "Smart Treat Dispenser",
    price: "$95.99",
    rating: 4,
    reviews: 234,
    image: puzzleFeederPremium,
    category: "Smart Feeders",
    description: "WiFi-enabled treat dispenser with camera and two-way audio. Schedule treats, monitor your pet, and interact remotely through the mobile app.",
    features: [
      "HD camera with night vision",
      "Two-way audio communication",
      "Scheduled treat dispensing",
      "Mobile app control",
      "Treat portion control",
      "Cloud video storage"
    ]
  },
  {
    name: "Interactive Ball Launcher",
    price: "$129.99",
    originalPrice: "$159.99",
    rating: 5,
    reviews: 178,
    image: robotToyPremium,
    category: "Interactive Robots",
    isNew: true,
    description: "Automatic ball launcher that keeps dogs entertained for hours. Adjustable distance settings and safety sensors ensure fun, safe play.",
    features: [
      "3 distance settings (10-30ft)",
      "Motion safety sensors",
      "Weatherproof design",
      "Rechargeable battery",
      "Compatible with standard tennis balls",
      "Training mode for new pets"
    ]
  }
];

const Shop = () => {
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (product: typeof products[0]) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-hero overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-80" />
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold">
              Zippty
            </h1>
            <h2 className="text-2xl md:text-3xl">
              Making pet care simple fun and full of love
            </h2>
            <p className="text-lg text-white/90">
              At Zippty, we know your pets are more than just animals—they're family. Whether you have a curious kitten or an energetic dog,
            </p>
            <div className="text-white/80">
              Collection of happy pet faces
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our collection of premium smart pet toys and accessories designed to keep your furry friends happy, healthy, and entertained.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <ProductCard 
                key={index} 
                {...product} 
                onViewDetails={() => handleViewDetails(product)}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="hero" size="lg">
              Load More Products
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Shop;