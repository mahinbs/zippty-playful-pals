import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, ShoppingCart, Minus, Plus, CheckCircle } from "lucide-react";
import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { useCart, Product } from "@/contexts/CartContext";
import { formatPrice } from "@/services/api";

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailModal = ({ product, isOpen, onClose }: ProductDetailModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addItem, isInCart, getItemQuantity } = useCart();

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Add the product to cart with the selected quantity
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    
    setIsAddingToCart(false);
  };

  if (!product) return null;

  const cartQuantity = getItemQuantity(product.id);
  const isInCartState = isInCart(product.id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-lg border-white/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            {product.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative group">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-96 object-cover rounded-xl"
              />
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isLiked ? "fill-red-500 text-red-500" : "text-white"
                  }`}
                />
              </button>
              {product.isNew && (
                <Badge className="absolute top-4 left-4 bg-green-500 text-white">
                  New
                </Badge>
              )}
              {product.originalPrice && (
                <Badge className="absolute top-12 left-4 bg-red-500 text-white">
                  Sale
                </Badge>
              )}
              {isInCartState && (
                <Badge className="absolute top-20 left-4 bg-blue-500 text-white">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  In Cart ({cartQuantity})
                </Badge>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {product.category}
              </Badge>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < product.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description || "This premium pet product is designed to provide endless entertainment and engagement for your beloved pets. Crafted with high-quality materials and innovative technology."}
              </p>
            </div>

            {/* Features */}
            <div>
              <h3 className="font-semibold mb-2">Key Features</h3>
              <ul className="space-y-1">
                {(product.features || [
                  "Premium quality materials",
                  "Interactive technology",
                  "Safe for all pets",
                  "Easy to clean",
                  "Battery operated"
                ]).map((feature, index) => (
                  <li key={index} className="text-muted-foreground flex items-center">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity and Add to Cart */}
            <GlassCard className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="font-medium text-lg w-8 text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <Button 
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className={`w-full ${
                  isInCartState 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                } text-white py-3 font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50`}
              >
                {isAddingToCart ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Adding to Cart...
                  </>
                ) : isInCartState ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    In Cart ({cartQuantity})
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
            </GlassCard>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;