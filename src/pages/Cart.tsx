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
              <ShoppingCart className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-foreground mb-4">Your Cart is Empty</h1>
              <p className="text-muted-foreground mb-8">
                Looks like you haven't added any products to your cart yet. 
                Start shopping to find amazing pet products!
              </p>
            </div>
            
            <div className="space-y-4">
              <Button 
                onClick={() => navigate('/shop')}
                className="bg-gradient-primary hover:opacity-90 text-primary-foreground px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                Start Shopping
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => navigate('/')}
                className="px-8 py-3 rounded-lg"
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
            className="mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
          <Badge className="ml-4 bg-primary text-primary-foreground">
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
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {item.product.category}
                    </p>
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-bold text-primary">
                        {formatPrice(item.product.price)}
                      </span>
                      {item.product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
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
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    
                    <span className="w-12 text-center font-semibold text-foreground">
                      {item.quantity}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.product.id)}
                    className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
                
                {/* Item Total */}
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Item Total:</span>
                    <span className="text-lg font-bold text-primary">
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
                className="border-destructive text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <GlassCard className="p-6 sticky top-24">
              <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>
              
              {/* Summary Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({state.itemCount} items)</span>
                  <span className="text-foreground">{formatPrice(state.total)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  {state.total >= 4000 ? (
                    <span className="text-green-600 dark:text-green-400">Free</span>
                  ) : (
                    <span className="text-foreground">{formatPrice(200)}</span>
                  )}
                </div>
                
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-foreground">Total</span>
                    <span className="text-xl font-bold text-primary">
                      {formatPrice(state.total + (state.total >= 4000 ? 0 : 200))}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50"
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
                <div className="flex items-center text-sm text-muted-foreground">
                  <Truck className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                  Free shipping on orders over ₹4000
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 mr-2 text-primary" />
                  30-day return policy
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
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