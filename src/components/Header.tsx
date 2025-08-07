import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Zippty
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="/shop" className="text-foreground hover:text-primary transition-smooth">
            Products
          </a>
          <a href="/about" className="text-foreground hover:text-primary transition-smooth">
            About
          </a>
          <a href="/contact" className="text-foreground hover:text-primary transition-smooth">
            Contact
          </a>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <Button variant="hero" size="sm">
            Shop Now
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;