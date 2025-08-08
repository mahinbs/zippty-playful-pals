import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { ShoppingCart, Menu } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import zipptyLogo from "@/assets/zippty-logo.png";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useCart();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="w-full backdrop-blur-3xl border-b border-slate-800/50 sticky top-0 z-50 bg-white/20">
      <GlassCard intensity="heavy" className="border-0 border-b border-slate-800/50 rounded-none backdrop-blur-xl shadow-lg">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/">
              <img 
                src={zipptyLogo} 
                alt="Zippty - Premium Pet Care" 
                className="h-12 w-auto transition-transform duration-300 hover:scale-105 cursor-pointer"
              />
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-10">
            <Link 
              to="/" 
              className={`hover:text-blue-500 transition-all duration-300 font-medium text-lg relative group ${
                isActive('/') ? 'text-blue-500' : ''
              }`}
            >
              Home
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 ${
                isActive('/') ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></span>
            </Link>
            <Link 
              to="/shop" 
              className={`hover:text-blue-500 transition-all duration-300 font-medium text-lg relative group ${
                isActive('/shop') ? 'text-blue-500' : ''
              }`}
            >
              Products
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 ${
                isActive('/shop') ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></span>
            </Link>
            <Link 
              to="/about" 
              className={`hover:text-blue-500 transition-all duration-300 font-medium text-lg relative group ${
                isActive('/about') ? 'text-blue-500' : ''
              }`}
            >
              About
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 ${
                isActive('/about') ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></span>
            </Link>
            <Link 
              to="/contact" 
              className={`hover:text-blue-500 transition-all duration-300 font-medium text-lg relative group ${
                isActive('/contact') ? 'text-blue-500' : ''
              }`}
            >
              Contact
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 ${
                isActive('/contact') ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></span>
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/cart')}
              className="relative bg-slate-200/50 hover:bg-slate-300/50 backdrop-blur-md border border-slate-700/50 rounded-full h-12 w-12 hover:text-blue-500"
            >
              <ShoppingCart className="h-6 w-6" />
              {state.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-xs text-white flex items-center justify-center animate-bounce">
                  {state.itemCount > 99 ? '99+' : state.itemCount}
                </span>
              )}
            </Button>
            
            <Button 
              onClick={() => navigate('/shop')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Shop Now
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-md border border-slate-700/50 rounded-full h-12 w-12 hover:text-blue-500"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </GlassCard>
    </header>
  );
};
export default Header;