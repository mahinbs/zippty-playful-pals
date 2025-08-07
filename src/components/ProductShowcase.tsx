import ProductCard from "./ProductCard";
import ProductDetailModal from "./ProductDetailModal";
import { GlassCard } from "@/components/ui/glass-card";
import { useState } from "react";
import robotToy from "@/assets/robot-toy-premium.jpg";
import catToy from "@/assets/cat-toy-premium.jpg";
import puzzleFeeder from "@/assets/puzzle-feeder-premium.jpg";

const products = [
  {
    name: "SmartPlay Robot Companion",
    price: "$149.99",
    originalPrice: "$199.99",
    rating: 5,
    reviews: 127,
    image: robotToy,
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
    image: catToy,
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
    image: puzzleFeeder,
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
];

const ProductShowcase = () => {
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (product: typeof products[0]) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <section id="products" className="relative py-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
      <div className="absolute inset-0 bg-muted/50 backdrop-blur-3xl" />
      
      <div className="relative container mx-auto px-4">
        <div className="text-center mb-20 space-y-8 animate-fade-in">
          <div className="inline-block">
            <GlassCard intensity="light" className="px-6 py-3 mb-6">
              <span className="text-sm font-medium text-primary">✨ Premium Collection</span>
            </GlassCard>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold leading-tight">
            Featured{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent relative">
              Smart Toys
              <div className="absolute -inset-2 bg-gradient-primary opacity-20 blur-lg rounded-full animate-pulse-slow" />
            </span>
          </h2>
          
          <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover our bestselling interactive toys that combine cutting-edge technology 
            with irresistible fun to keep your pets engaged and happy.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {products.map((product, index) => (
            <div 
              key={index} 
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <ProductCard {...product} onViewDetails={() => handleViewDetails(product)} />
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16 animate-fade-in">
          <GlassCard intensity="medium" animated className="inline-block p-6">
            <button className="text-primary hover:text-primary/80 font-semibold text-xl transition-glass group">
              View All Products
              <span className="ml-2 group-hover:translate-x-2 transition-transform duration-300 inline-block">→</span>
            </button>
          </GlassCard>
        </div>
      </div>

      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default ProductShowcase;