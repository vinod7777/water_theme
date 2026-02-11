import { useMemo } from "react";
const WaterDroplets = ({ count = 12, className = "" }) => {
    const droplets = useMemo(() => {
        return Array.from({ length: count }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 10,
            duration: 6 + Math.random() * 4,
            size: 8 + Math.random() * 10,
        }));
    }, [count]);
    return (<div className={`fixed inset-0 pointer-events-none z-[5] overflow-hidden ${className}`}>
      {droplets.map((droplet) => (<div key={droplet.id} className="absolute animate-droplet-fall" style={{
                left: `${droplet.left}%`,
                top: -20,
                width: droplet.size,
                height: droplet.size * 1.5,
                background: `radial-gradient(ellipse at 30% 20%, 
              hsl(195, 100%, 80%) 0%, 
              hsl(195, 100%, 50%) 40%, 
              hsl(220, 85%, 40%) 100%)`,
                boxShadow: `0 0 ${droplet.size}px hsl(195, 100%, 50% / 0.3)`,
                borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
                animationDelay: `${droplet.delay}s`,
                animationDuration: `${droplet.duration}s`,
                opacity: 0.5,
            }}/>))}
    </div>);
};
export default WaterDroplets;
