import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  CreditCard,
  Truck,
  Shield,
  CheckCircle
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/services/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Cart = () => {
  const navigate = useNavigate();
  const { state, removeItem, updateQuantity, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Here you would typically redirect to a checkout page or payment processor
    setTimeout(() => {
      setIsCheckingOut(false);
      // For demo purposes, we'll just clear the cart
      clearCart();
      navigate('/shop');
    }, 2000);
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <ShoppingCart className="h-24 w-24 text-slate-400 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-slate-300 mb-4">Your Cart is Empty</h1>
              <p className="text-slate-400 mb-8">
                Looks like you haven't added any products to your cart yet. 
                Start shopping to find amazing pet products!
              </p>
            </div>
            
            <div className="space-y-4">
              <Button 
                onClick={() => navigate('/shop')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                Start Shopping
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => navigate('/')}
                className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-3 rounded-lg"
              >
                Continue Browsing
              </Button>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="text-slate-400 hover:text-slate-300 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-slate-300">Shopping Cart</h1>
          <Badge className="ml-4 bg-blue-500 text-white">
            {state.itemCount} {state.itemCount === 1 ? 'item' : 'items'}
          </Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item) => (
              <GlassCard key={item.product.id} className="p-6">
                <div className="flex items-center space-x-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-slate-300 mb-1">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-slate-400 mb-2">
                      {item.product.category}
                    </p>
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-bold text-blue-400">
                        {formatPrice(item.product.price)}
                      </span>
                      {item.product.originalPrice && (
                        <span className="text-sm text-slate-500 line-through">
                          {formatPrice(item.product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                      className="border-slate-600 text-slate-300 hover:bg-slate-800"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    
                    <span className="w-12 text-center font-semibold text-slate-300">
                      {item.quantity}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                      className="border-slate-600 text-slate-300 hover:bg-slate-800"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.product.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
                
                {/* Item Total */}
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Item Total:</span>
                    <span className="text-lg font-bold text-blue-400">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </GlassCard>
            ))}
            
            {/* Clear Cart Button */}
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={clearCart}
                className="border-red-500 text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <GlassCard className="p-6 sticky top-24">
              <h2 className="text-xl font-bold text-slate-300 mb-6">Order Summary</h2>
              
              {/* Summary Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-400">Subtotal ({state.itemCount} items)</span>
                  <span className="text-slate-300">{formatPrice(state.total)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-400">Shipping</span>
                  <span className="text-green-400">Free</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-400">Tax</span>
                  <span className="text-slate-300">{formatPrice(state.total * 0.08)}</span>
                </div>
                
                <div className="border-t border-slate-700 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-slate-300">Total</span>
                    <span className="text-xl font-bold text-blue-400">
                      {formatPrice(state.total * 1.08)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50"
              >
                {isCheckingOut ? (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Proceed to Checkout
                  </>
                )}
              </Button>
              
              {/* Benefits */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center text-sm text-slate-400">
                  <Truck className="h-4 w-4 mr-2 text-green-400" />
                  Free shipping on orders over $50
                </div>
                <div className="flex items-center text-sm text-slate-400">
                  <Shield className="h-4 w-4 mr-2 text-blue-400" />
                  30-day return policy
                </div>
                <div className="flex items-center text-sm text-slate-400">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                  Secure checkout
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Cart; 