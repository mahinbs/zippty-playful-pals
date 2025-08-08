import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import ProductDetailModal from "./ProductDetailModal";
import { GlassCard } from "@/components/ui/glass-card";
import { productAPI, Product } from "@/services/api";
import robotToyPremium from "@/assets/robot-toy-premium.jpg";
import catToyPremium from "@/assets/cat-toy-premium.jpg";
import puzzleFeederPremium from "@/assets/puzzle-feeder-premium.jpg";

const ProductShowcase = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // First, try to load admin products
        const adminProducts = localStorage.getItem("admin-products");
        if (adminProducts) {
          const parsedProducts = JSON.parse(adminProducts);
          // Filter only active products for display
          const activeProducts = parsedProducts.filter((p: any) => p.isActive !== false);
          if (activeProducts.length > 0) {
            setProducts(activeProducts);
            setLoading(false);
            return;
          }
        }

        // Fallback to mock data if no admin products
        const mockProducts = [
          {
            id: '1',
            name: 'SmartPlay Robot Companion',
            price: 149.99,
            originalPrice: 199.99,
            image: robotToyPremium,
            category: 'Interactive Robots',
            description: 'An advanced AI-powered robot companion that adapts to your pet\'s behavior and provides hours of interactive entertainment.',
            features: [
              'AI-powered adaptive play modes',
              'Motion sensors and obstacle avoidance',
              'LED light patterns for visual stimulation',
              'Rechargeable battery (8+ hours)',
              'Safe, durable materials',
              'App connectivity for remote control'
            ],
            rating: 5,
            reviews: 127,
            isNew: true,
          },
          {
            id: '2',
            name: 'FelineBot Interactive Cat Toy',
            price: 89.99,
            image: catToyPremium,
            category: 'Cat Toys',
            description: 'A high-tech interactive toy designed specifically for cats, featuring feathers, motion sensors, and unpredictable movement patterns.',
            features: [
              'Automatic motion detection',
              'Replaceable feather attachments',
              'Silent motor operation',
              'Timer-based play sessions',
              'Battery level indicator',
              'Washable components'
            ],
            rating: 5,
            reviews: 89,
          },
          {
            id: '3',
            name: 'BrainBoost Puzzle Feeder',
            price: 69.99,
            originalPrice: 89.99,
            image: puzzleFeederPremium,
            category: 'Smart Feeders',
            description: 'Transform mealtime into a mental workout with this innovative puzzle feeder.',
            features: [
              'Adjustable difficulty levels',
              'Multiple feeding compartments',
              'Non-slip base design',
              'Easy to clean and fill',
              'Slows down eating pace',
              'Suitable for all pet sizes'
            ],
            rating: 4,
            reviews: 203,
          }
        ];
        setProducts(mockProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <section id="products" className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
        <div className="absolute inset-0 bg-muted/50 backdrop-blur-3xl" />
        
        <div className="relative container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading featured products...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
      <div className="absolute inset-0 bg-muted/50 backdrop-blur-3xl" />
      
      <div className="relative container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 drop-shadow-lg">
            Featured Products
          </h2>
          <p className="text-lg max-w-2xl mx-auto">
            Explore our top-rated interactive toys and smart gadgets designed to bring joy and enrichment to your pet's life.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {products.map((product, index) => (
            <div 
              key={product.id} 
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <ProductCard 
                product={product} 
                onViewDetails={() => handleViewDetails(product)} 
              />
            </div>
          ))}
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