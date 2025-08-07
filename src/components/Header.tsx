import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { ShoppingCart, Menu } from "lucide-react";
import zipptyLogo from "@/assets/zippty-logo.png";

const Header = () => {
  return (
    <header className="w-full backdrop-blur-3xl border-b border-white/20 sticky top-0 z-50 bg-white/5">
      <GlassCard intensity="heavy" className="border-0 border-b border-white/20 rounded-none backdrop-blur-xl bg-white/10 shadow-glass">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src={zipptyLogo} 
              alt="Zippty - Premium Pet Care" 
              className="h-12 w-auto transition-transform duration-300 hover:scale-105 cursor-pointer"
            />
          </div>
          
          <nav className="hidden md:flex items-center space-x-10">
            <a href="/shop" className="text-foreground hover:text-primary transition-glass font-medium text-lg relative group">
              Products
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="/about" className="text-foreground hover:text-primary transition-glass font-medium text-lg relative group">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="/contact" className="text-foreground hover:text-primary transition-glass font-medium text-lg relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              className="relative bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-full h-12 w-12"
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 h-5 w-5 bg-gradient-primary rounded-full text-xs text-white flex items-center justify-center animate-bounce">
                2
              </span>
            </Button>
            
            <Button 
              className="bg-gradient-primary hover:shadow-glow text-white border-0 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105"
            >
              Shop Now
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-full h-12 w-12"
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