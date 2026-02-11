import { motion } from "framer-motion";
import { useMemo } from "react";
const BubbleParticles = () => {
    // Memoize bubble data to prevent recalculation on re-renders
    const bubbles = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 5 + Math.random() * 5,
        size: 4 + Math.random() * 8,
        wobble: Math.random() * 30 - 15,
    })), []);
    return (<div className="absolute inset-0 overflow-hidden pointer-events-none contain-paint">
      {bubbles.map((bubble) => (<motion.div key={bubble.id} className="absolute rounded-full will-animate" style={{
                left: `${bubble.x}%`,
                bottom: -20,
                width: bubble.size,
                height: bubble.size,
                background: `radial-gradient(circle at 30% 30%, hsl(195, 100%, 70%, 0.8), hsl(195, 100%, 50%, 0.4))`,
                boxShadow: `inset 0 0 ${bubble.size / 2}px hsl(195, 100%, 80%, 0.5), 0 0 ${bubble.size}px hsl(195, 100%, 50%, 0.3)`,
                willChange: 'transform, opacity',
            }} animate={{
                y: [0, -600, -800],
                x: [0, bubble.wobble, -bubble.wobble, 0],
                opacity: [0, 0.8, 0.6, 0],
                scale: [0.5, 1, 0.8, 0.3],
            }} transition={{
                duration: bubble.duration,
                delay: bubble.delay,
                repeat: Infinity,
                ease: "easeOut",
            }}/>))}
    </div>);
};
export default BubbleParticles;
