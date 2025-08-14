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
  animationType: 'float' | 'drift';
  glowDelay: number;
}

const GlobalBubbles = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    const generateBubbles = () => {
      const newBubbles: Bubble[] = [];
      for (let i = 0; i < 45; i++) {
        newBubbles.push({
          id: i,
          x: Math.random() * 120 - 10, // -10% to 110% for partial off-screen
          y: Math.random() * 120 - 10,
          size: Math.random() * 100 + 20, // 20px to 120px (varied sizes)
          delay: Math.random() * 40, // 0-40s delay for better staggering
          duration: Math.random() * 20 + 25, // 25-45 seconds for varied speeds
          opacity: Math.random() * 0.4 + 0.3, // 30-70% opacity for 3D effect
          colorVariant: Math.floor(Math.random() * 6), // 6 vibrant color variants
          animationType: Math.random() > 0.5 ? 'float' : 'drift',
          glowDelay: Math.random() * 8, // 0-8s delay for glow animation
        });
      }
      setBubbles(newBubbles);
    };

    generateBubbles();
  }, []);

  const getBubbleStyle = (bubble: Bubble) => {
    const colors = [
      // Vibrant Pink/Magenta
      {
        background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.6), rgba(255, 20, 147, 0.8), rgba(199, 21, 133, 1))',
        shadow: '0 8px 32px rgba(255, 20, 147, 0.4), inset 0 2px 8px rgba(255, 255, 255, 0.3), inset 0 -4px 8px rgba(139, 0, 139, 0.3)'
      },
      // Deep Blue/Purple
      {
        background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.6), rgba(30, 144, 255, 0.8), rgba(75, 0, 130, 1))',
        shadow: '0 8px 32px rgba(30, 144, 255, 0.4), inset 0 2px 8px rgba(255, 255, 255, 0.3), inset 0 -4px 8px rgba(75, 0, 130, 0.3)'
      },
      // Bright Green/Lime
      {
        background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.6), rgba(50, 205, 50, 0.8), rgba(0, 128, 0, 1))',
        shadow: '0 8px 32px rgba(50, 205, 50, 0.4), inset 0 2px 8px rgba(255, 255, 255, 0.3), inset 0 -4px 8px rgba(0, 100, 0, 0.3)'
      },
      // Sunny Yellow/Orange
      {
        background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.6), rgba(255, 215, 0, 0.8), rgba(255, 140, 0, 1))',
        shadow: '0 8px 32px rgba(255, 215, 0, 0.4), inset 0 2px 8px rgba(255, 255, 255, 0.3), inset 0 -4px 8px rgba(218, 165, 32, 0.3)'
      },
      // Light Purple/Lavender
      {
        background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.6), rgba(186, 85, 211, 0.8), rgba(138, 43, 226, 1))',
        shadow: '0 8px 32px rgba(186, 85, 211, 0.4), inset 0 2px 8px rgba(255, 255, 255, 0.3), inset 0 -4px 8px rgba(128, 0, 128, 0.3)'
      },
      // Coral/Pink-Orange
      {
        background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.6), rgba(255, 127, 80, 0.8), rgba(255, 69, 0, 1))',
        shadow: '0 8px 32px rgba(255, 127, 80, 0.4), inset 0 2px 8px rgba(255, 255, 255, 0.3), inset 0 -4px 8px rgba(205, 92, 92, 0.3)'
      }
    ];
    
    return colors[bubble.colorVariant];
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
      {bubbles.map((bubble) => {
        const bubbleStyle = getBubbleStyle(bubble);
        return (
          <div
            key={bubble.id}
            className={`absolute rounded-full animate-${bubble.animationType === 'float' ? 'bubble-float' : 'bubble-drift'} animate-bubble-glow`}
            style={{
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              opacity: bubble.opacity,
              background: bubbleStyle.background,
              boxShadow: bubbleStyle.shadow,
              animationDelay: `${bubble.delay}s, ${bubble.glowDelay}s`,
              animationDuration: `${bubble.duration}s, 4s`,
              willChange: "transform, filter",
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(2px)',
            }}
          />
        );
      })}
    </div>
  );
};

export default GlobalBubbles;