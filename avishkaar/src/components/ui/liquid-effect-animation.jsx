import { useEffect, useRef } from "react";

export function LiquidEffectAnimation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // If the liquid app is already running, don't re-initialize it.
    if (window.__liquidApp) {
      return;
    }

    if (!canvasRef.current) return;

    const script = document.createElement("script");
    script.type = "module";
    script.textContent = `
      import LiquidBackground from "https://cdn.jsdelivr.net/npm/threejs-components@0.0.22/build/backgrounds/liquid1.min.js";

      const canvas = document.getElementById("liquid-canvas");

      if (canvas) {
        const app = LiquidBackground(canvas);

        app.loadImage("https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80");
        app.liquidPlane.material.metalness = 0.4;
        app.liquidPlane.material.roughness = 0.4;
        app.liquidPlane.uniforms.displacementScale.value = 5;
        app.setRain(false);

        window.__liquidApp = app;
      }
    `;

    document.body.appendChild(script);

    // On the main page, we don't dispose the global app on unmount;
    // this keeps the effect smoother by avoiding re-creation.
    return () => {};
  }, []);

  
  return (
    <div
      className="absolute inset-0 m-0 w-full h-full touch-none overflow-hidden pointer-events-none"
    >
      <canvas
        ref={canvasRef}
        id="liquid-canvas"
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}

