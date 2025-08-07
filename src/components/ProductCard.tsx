import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  name: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  isNew?: boolean;
}

const ProductCard = ({ 
  name, 
  price, 
  originalPrice, 
  rating, 
  reviews, 
  image, 
  category, 
  isNew = false 
}: ProductCardProps) => {
  return (
    <Card className="group cursor-pointer overflow-hidden border-border hover:shadow-soft transition-smooth">
      <div className="relative overflow-hidden">
        {isNew && (
          <div className="absolute top-3 left-3 z-10 bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-medium">
            New
          </div>
        )}
        <img 
          src={image} 
          alt={name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-smooth"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
      </div>
      
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground uppercase tracking-wide">{category}</p>
          <h3 className="font-semibold text-lg group-hover:text-primary transition-smooth">
            {name}
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${
                  i < rating ? 'fill-accent text-accent' : 'text-muted-foreground'
                }`} 
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">({reviews})</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-x-2">
            <span className="text-xl font-bold text-primary">{price}</span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">{originalPrice}</span>
            )}
          </div>
          
          <Button variant="accent" size="sm" className="group">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;