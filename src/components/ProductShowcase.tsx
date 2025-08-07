import ProductCard from "./ProductCard";
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
];

const ProductShowcase = () => {
  return (
    <section id="products" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold">
            Featured{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Smart Toys
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our bestselling interactive toys that combine cutting-edge technology 
            with irresistible fun to keep your pets engaged and happy.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {products.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="text-primary hover:text-primary/80 font-semibold text-lg underline underline-offset-4 transition-smooth">
            View All Products →
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;