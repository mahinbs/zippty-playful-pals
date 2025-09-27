import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, ShoppingCart, Minus, Plus, CheckCircle, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addItem, isInCart, getItemQuantity } = useCart();
  const navigate = useNavigate();

  const images = product?.images || (product?.image ? [product.image] : []);
  const currentImage = images[currentImageIndex] || product?.image;

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
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

  const handleGoToCart = () => {
    onClose(); // Close the modal first
    navigate('/cart');
  };

  if (!product) return null;

  const cartQuantity = getItemQuantity(product.id);
  const isInCartState = isInCart(product.id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-lg border-white/20 p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-foreground">
            {product.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {/* Product Image Gallery */}
          <div className="space-y-4">
            <div className="relative group">
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-xl"
              />
              
              {/* Navigation arrows - only show if multiple images */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white/90"
                    onClick={previousImage}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white/90"
                    onClick={nextImage}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  
                  {/* Image counter */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
              
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
                  Go to Cart ({cartQuantity})
                </Badge>
              )}
            </div>
            
            {/* Thumbnail gallery - only show if multiple images */}
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? 'border-primary shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2 text-xs sm:text-sm">
                {product.category}
              </Badge>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 sm:w-4 sm:h-4 ${
                        i < product.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground">
                  ({product.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-base sm:text-lg text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2 text-sm sm:text-base">Description</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                {product.description || "This premium pet product is designed to provide endless entertainment and engagement for your beloved pets. Crafted with high-quality materials and innovative technology."}
              </p>
            </div>

            {/* Features */}
            <div>
              <h3 className="font-semibold mb-2 text-sm sm:text-base">Key Features</h3>
              <ul className="space-y-1">
                {(product.features || [
                  "Premium quality materials",
                  "Interactive technology",
                  "Safe for all pets",
                  "Easy to clean",
                  "Battery operated"
                ]).map((feature, index) => (
                  <li key={index} className="text-muted-foreground flex items-center text-sm sm:text-base">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity and Add to Cart */}
            <GlassCard className="p-3 sm:p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm sm:text-base">Quantity:</span>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8 sm:w-10 sm:h-10"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  <span className="font-medium text-base sm:text-lg w-6 sm:w-8 text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8 sm:w-10 sm:h-10"
                    onClick={() => handleQuantityChange(1)}
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              </div>
              
              <Button 
                onClick={isInCartState ? handleGoToCart : handleAddToCart}
                disabled={isAddingToCart}
                className={`w-full ${
                  isInCartState 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                } text-white py-2 sm:py-3 font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-105 disabled:opacity-50`}
              >
                {isAddingToCart ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    <span className="hidden sm:inline">Adding to Cart...</span>
                    <span className="sm:hidden">Adding...</span>
                  </>
                ) : isInCartState ? (
                  <>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    <span className="hidden sm:inline">Go to Cart ({cartQuantity})</span>
                    <span className="sm:hidden">Go to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    <span className="hidden sm:inline">Add to Cart</span>
                    <span className="sm:hidden">Add</span>
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