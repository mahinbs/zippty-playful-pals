import { useEffect, useState } from "react";

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
  colorVariant: number;
}

const GlobalBubbles = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    const generateBubbles = () => {
      const newBubbles: Bubble[] = [];
      for (let i = 0; i < 12; i++) {
        newBubbles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 160 + 40, // 40px to 200px
          delay: Math.random() * 20,
          duration: Math.random() * 40 + 20, // 20-60 seconds
          opacity: Math.random() * 0.1 + 0.05, // 5-15% opacity
          colorVariant: Math.floor(Math.random() * 4), // 4 color variants
        });
      }
      setBubbles(newBubbles);
    };

    generateBubbles();
  }, []);

  const getColorClass = (variant: number) => {
    const colors = [
      'bg-primary',
      'bg-accent', 
      'bg-secondary',
      'bg-muted'
    ];
    return colors[variant];
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className={`absolute rounded-full ${getColorClass(bubble.colorVariant)} animate-bubble-float`}
          style={{
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            opacity: bubble.opacity,
            animationDelay: `${bubble.delay}s`,
            animationDuration: `${bubble.duration}s`,
            filter: "blur(2px)",
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
};

export default GlobalBubbles;