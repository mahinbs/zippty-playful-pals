import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-pets.jpg";
import robotToy from "@/assets/robot-toy-1.jpg";
import catToy from "@/assets/cat-toy-1.jpg";
import puzzleFeeder from "@/assets/puzzle-feeder.jpg";

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
  },
  {
    name: "FelineBot Interactive Cat Toy",
    price: "$89.99",
    rating: 5,
    reviews: 89,
    image: catToy,
    category: "Cat Toys",
  },
  {
    name: "BrainBoost Puzzle Feeder",
    price: "$69.99",
    originalPrice: "$89.99",
    rating: 4,
    reviews: 203,
    image: puzzleFeeder,
    category: "Smart Feeders",
  },
  // Add more products to showcase larger inventory
  {
    name: "Interactive Laser Toy",
    price: "$45.99",
    rating: 5,
    reviews: 156,
    image: catToy,
    category: "Cat Toys",
  },
];

const Shop = () => {
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
            <div className="text-muted-foreground mb-4">Loading products...</div>
            <div className="flex justify-center gap-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground text-xs">dog-image</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <ProductCard key={index} {...product} />
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
    </div>
  );
};

export default Shop;