import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";

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

const ProductCard = ({ name, price, originalPrice, rating, reviews, image, category, isNew }: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <GlassCard 
      intensity="medium" 
      animated
      className="group overflow-hidden transition-all duration-500 hover:shadow-float"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-0">
        <div className="relative overflow-hidden rounded-t-2xl">
          <img 
            src={image} 
            alt={name}
            className={`w-full h-80 object-cover transition-all duration-700 ${
              isHovered ? 'scale-110 brightness-110' : 'scale-100'
            }`}
          />
          
          {/* Floating Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {isNew && (
              <Badge className="bg-gradient-primary text-white shadow-glow animate-pulse-slow">
                ✨ New
              </Badge>
            )}
            {originalPrice && (
              <Badge variant="destructive" className="shadow-glow">
                Sale
              </Badge>
            )}
          </div>
          
          {/* Heart Button */}
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md border border-white/20 transition-all duration-300 ${
              isLiked ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          
          {/* Overlay on Hover */}
          <div className={`absolute inset-0 bg-gradient-primary/20 backdrop-blur-sm transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`} />
        </div>
        
        <div className="p-8 space-y-6">
          <div className="space-y-3">
            <p className="text-sm text-primary font-semibold uppercase tracking-wider">{category}</p>
            <h3 className="text-2xl font-bold leading-tight group-hover:text-primary transition-colors duration-300">
              {name}
            </h3>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-5 w-5 transition-colors duration-300 ${
                    i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
                  }`} 
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground font-medium">({reviews} reviews)</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  {price}
                </span>
                {originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">{originalPrice}</span>
                )}
              </div>
            </div>
          </div>
          
          <Button className="w-full group bg-gradient-primary hover:shadow-glow text-white border-0 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105">
            <ShoppingCart className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
            Add to Cart
          </Button>
        </div>
      </div>
    </GlassCard>
  );
};

export default ProductCard;