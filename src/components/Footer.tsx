import { Facebook, Twitter, Instagram, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Zippty
            </h3>
            <p className="text-muted-foreground max-w-xs">
              The smarter way to shop for your pet. Cutting-edge technology meets irresistible fun.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-smooth" />
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-smooth" />
              <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-smooth" />
              <Mail className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-smooth" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold">Products</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="hover:text-foreground cursor-pointer transition-smooth">Interactive Robots</div>
              <div className="hover:text-foreground cursor-pointer transition-smooth">Smart Feeders</div>
              <div className="hover:text-foreground cursor-pointer transition-smooth">Cat Toys</div>
              <div className="hover:text-foreground cursor-pointer transition-smooth">Dog Toys</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold">Support</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="hover:text-foreground cursor-pointer transition-smooth">Contact Us</div>
              <div className="hover:text-foreground cursor-pointer transition-smooth">Shipping Info</div>
              <div className="hover:text-foreground cursor-pointer transition-smooth">Returns</div>
              <div className="hover:text-foreground cursor-pointer transition-smooth">Warranty</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold">Newsletter</h4>
            <p className="text-sm text-muted-foreground">
              Get the latest updates on new products and exclusive offers.
            </p>
            <div className="flex space-x-2">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-smooth">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Zippty. All rights reserved. Made with ❤️ for pet lovers everywhere.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;