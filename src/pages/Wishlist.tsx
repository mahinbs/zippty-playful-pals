import { useWishlist } from "@/contexts/WishlistContext";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/services/api";
import { toast } from "sonner";

const Wishlist = () => {
  const { state, removeItem, clearWishlist } = useWishlist();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (product: any) => {
    addItem(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleRemoveFromWishlist = (productId: string) => {
    removeItem(productId);
  };

  const handleClearWishlist = () => {
    if (state.items.length > 0) {
      clearWishlist();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                <Heart className="h-8 w-8 text-red-400 fill-current" />
                My Wishlist
              </h1>
              <p className="text-gray-300 mt-2">
                {state.count === 0 
                  ? "Your wishlist is empty" 
                  : `${state.count} item${state.count > 1 ? 's' : ''} in your wishlist`
                }
              </p>
            </div>
          </div>
          
          {state.items.length > 0 && (
            <Button
              variant="outline"
              onClick={handleClearWishlist}
              className="text-red-400 border-red-400 hover:bg-red-400/10"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {/* Empty State */}
        {state.items.length === 0 ? (
          <div className="text-center py-16">
            <GlassCard intensity="medium" className="max-w-md mx-auto p-8">
              <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Your wishlist is empty</h3>
              <p className="text-gray-400 mb-6">
                Start adding products you love to keep track of them!
              </p>
              <Button
                onClick={() => navigate('/shop')}
                className="bg-gradient-primary hover:shadow-glow text-white"
              >
                Browse Products
              </Button>
            </GlassCard>
          </div>
        ) : (
          /* Wishlist Items Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {state.items.map((product) => (
              <GlassCard key={product.id} intensity="medium" animated className="overflow-hidden">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  
                  {/* Remove from wishlist button */}
                  <button
                    onClick={() => handleRemoveFromWishlist(product.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors duration-200"
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </button>
                </div>
                
                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-xs text-primary font-semibold uppercase tracking-wider">
                      {product.category}
                    </p>
                    <h3 className="text-lg font-bold text-white leading-tight">
                      {product.name}
                    </h3>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-gradient-primary hover:shadow-glow text-white"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleRemoveFromWishlist(product.id)}
                      className="px-3 text-red-400 border-red-400 hover:bg-red-400/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Wishlist;