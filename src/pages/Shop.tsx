import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductDetailModal from "@/components/ProductDetailModal";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Search, Filter, Grid, List } from "lucide-react";
import { productsService, convertToFrontendProduct } from "@/services/products";
import heroImage from "@/assets/hero-pets.jpg";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  description?: string;
  features?: string[];
  rating: number;
  reviews: number;
  isNew?: boolean;
}

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Fetch active products from database
        const dbProducts = await productsService.getActiveProducts();
        const formattedProducts = dbProducts.map(convertToFrontendProduct);
        
        setProducts(formattedProducts);
        setFilteredProducts(formattedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search query and category
  useEffect(() => {
    let filtered = products;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product =>
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory]);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const categories = ["all", ...Array.from(new Set(products.map(p => p.category)))];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading products...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="relative h-[50vh] flex items-center justify-center text-center text-white overflow-hidden">
        <img 
          src={heroImage} 
          alt="Shop Banner" 
          className="absolute inset-0 w-full h-full object-cover opacity-60" 
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-4xl mx-auto space-y-6 px-4">
          <h1 className="text-4xl md:text-6xl font-bold drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
            Shop Our Products
          </h1>
          <h2 className="text-2xl md:text-3xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-medium">
            Premium pet care products for your beloved companions
          </h2>
          <p className="text-lg text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] max-w-3xl mx-auto">
            Discover our collection of innovative pet toys, interactive toys, and feeding solutions 
            designed to keep your pets happy, healthy, and entertained.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Search and Filter Controls */}
          <div className="mb-12">
            <GlassCard className="p-6">
              <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex items-center space-x-4">
                  <Filter className="h-5 w-5 text-slate-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className="border-slate-600 text-slate-300 hover:bg-slate-800"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className="border-slate-600 text-slate-300 hover:bg-slate-800"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Results Count */}
          <div className="mb-8">
            <p className="text-slate-400">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-slate-300 mb-2">No products found</h3>
              <p className="text-slate-400 mb-6">
                Try adjusting your search or filter criteria
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className={`grid gap-8 ${
              viewMode === "grid" 
                ? "md:grid-cols-2 lg:grid-cols-3" 
                : "grid-cols-1"
            }`}>
              {filteredProducts.map((product) => (
                <div key={product.id}>
                  <ProductCard 
                    product={product}
                    onViewDetails={() => handleViewDetails(product)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {filteredProducts.length > 0 && (
            <div className="text-center mt-12">
              <Button 
                variant="outline" 
                size="lg"
                className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-3"
              >
                Load More Products
              </Button>
            </div>
          )}
        </div>
      </section>
      <ProductDetailModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <Footer />
    </div>
  );
};
export default Shop;