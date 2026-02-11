import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";

// Water caustics pattern using SVG filter
const CausticsOverlay = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
    <svg className="absolute inset-0 w-full h-full opacity-0" style={{ filter: 'url(#caustics)' }}>
      <defs>
        <filter id="caustics">
          <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" seed="2">
            <animate attributeName="baseFrequency" values="0.01;0.02;0.01" dur="8s" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" scale="30" />
        </filter>
      </defs>
    </svg>
    {/* Caustic light rays */}
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={`caustic-${i}`}
        className="absolute"
        style={{
          left: `${5 + i * 12}%`,
          top: '-20%',
          width: '4px',
          height: '140%',
          background: `linear-gradient(to bottom, transparent, hsl(195, 100%, 70% / ${0.06 + i * 0.02}), transparent)`,
          filter: 'blur(6px)',
          transformOrigin: 'top center',
        }}
        animate={{
          rotate: [-8 + i * 2, 8 - i, -8 + i * 2],
          opacity: [0.15, 0.6, 0.15],
          scaleX: [1, 2, 1],
        }}
        transition={{
          duration: 3 + i * 0.4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.2,
        }}
      />
    ))}
  </div>
);

// Floating jellyfish-like particles
const FloatingOrganisms = () => {
  const organisms = useMemo(() => 
    [...Array(5)].map((_, i) => ({
      id: i,
      left: 10 + Math.random() * 80,
      size: 12 + Math.random() * 20,
      delay: i * 1.2,
      duration: 6 + Math.random() * 4,
    })), []
  );

  return (
    <div className="absolute inset-0 pointer-events-none z-[2]">
      {organisms.map((org) => (
        <motion.div
          key={org.id}
          className="absolute"
          style={{
            left: `${org.left}%`,
            bottom: '-5%',
            width: org.size,
            height: org.size * 1.3,
          }}
          animate={{
            y: [0, -window.innerHeight * 1.2],
            x: [0, Math.sin(org.id) * 60, -Math.sin(org.id) * 40, 0],
            rotate: [0, 15, -15, 0],
          }}
          transition={{
            duration: org.duration,
            repeat: Infinity,
            delay: org.delay,
            ease: "easeInOut",
          }}
        >
          <div
            className="w-full rounded-full relative"
            style={{
              height: '60%',
              background: `radial-gradient(circle at 35% 35%, hsl(195, 100%, 80% / 0.6), hsl(220, 85%, 50% / 0.3), transparent)`,
              boxShadow: `0 0 ${org.size}px hsl(195, 100%, 60% / 0.4)`,
            }}
          />
          {[...Array(3)].map((_, t) => (
            <motion.div
              key={t}
              className="absolute rounded-full"
              style={{
                left: `${25 + t * 20}%`,
                top: '55%',
                width: '2px',
                height: org.size * 0.6,
                background: `linear-gradient(to bottom, hsl(195, 100%, 70% / 0.4), transparent)`,
              }}
              animate={{ rotate: [-10, 10, -10], scaleY: [1, 0.8, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: t * 0.2, ease: "easeInOut" }}
            />
          ))}
        </motion.div>
      ))}
    </div>
  );
};

// Rising bubbles with realistic physics
const RisingBubbles = () => {
  const bubbles = useMemo(() =>
    [...Array(45)].map((_, i) => ({
      id: i,
      left: 2 + Math.random() * 96,
      size: 5 + Math.random() * 24,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 3.5,
      wobble: (Math.random() - 0.5) * 140,
    })), []
  );

  return (
    <div className="absolute inset-0 pointer-events-none z-[3]">
      {bubbles.map((b) => (
        <motion.div
          key={b.id}
          className="absolute rounded-full"
          style={{
            left: `${b.left}%`,
            bottom: '-5%',
            width: b.size,
            height: b.size,
            background: `radial-gradient(circle at 30% 30%, hsl(195, 100%, 92% / 0.9), hsl(195, 100%, 65% / 0.4), transparent)`,
            border: '1px solid hsl(195, 100%, 80% / 0.4)',
            boxShadow: `inset 0 -2px 6px hsl(195, 100%, 50% / 0.3), 0 0 ${b.size}px hsl(195, 100%, 60% / 0.4)`,
          }}
          animate={{
            y: [0, -window.innerHeight * 1.3],
            x: [0, b.wobble, -b.wobble * 0.6, b.wobble * 0.4],
            scale: [0.2, 1.1, 1, 0.7],
            opacity: [0, 1, 0.8, 0],
          }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            delay: b.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

// Water splash droplets that burst outward
const WaterSplash = ({ active }: { active: boolean }) => {
  const splashDroplets = useMemo(() =>
    [...Array(28)].map((_, i) => {
      const angle = (i / 28) * Math.PI * 2;
      const distance = 120 + Math.random() * 200;
      return {
        id: i,
        endX: Math.cos(angle) * distance,
        endY: Math.sin(angle) * distance - 60,
        size: 5 + Math.random() * 14,
        delay: Math.random() * 0.2,
      };
    }), []
  );

  // Secondary smaller splash wave
  const secondarySplash = useMemo(() =>
    [...Array(20)].map((_, i) => {
      const angle = (i / 20) * Math.PI * 2 + 0.3;
      const distance = 60 + Math.random() * 100;
      return {
        id: i,
        endX: Math.cos(angle) * distance,
        endY: Math.sin(angle) * distance - 20,
        size: 3 + Math.random() * 6,
        delay: 0.3 + Math.random() * 0.15,
      };
    }), []
  );

  if (!active) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-[6] flex items-center justify-center">
      {/* Primary large splash */}
      {splashDroplets.map((d) => (
        <motion.div
          key={`primary-${d.id}`}
          className="absolute rounded-full"
          style={{
            width: d.size,
            height: d.size,
            background: `radial-gradient(circle at 30% 30%, hsl(195, 100%, 95%), hsl(195, 100%, 65%))`,
            boxShadow: `0 0 ${d.size * 3}px hsl(195, 100%, 60% / 0.7)`,
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: [0, d.endX * 0.4, d.endX],
            y: [0, d.endY - 50, d.endY + 80],
            opacity: [1, 0.9, 0],
            scale: [1.2, 0.9, 0.2],
          }}
          transition={{
            duration: 1.5,
            delay: d.delay,
            ease: "easeOut",
            repeat: Infinity,
            repeatDelay: 2.5,
          }}
        />
      ))}
      {/* Secondary smaller splash */}
      {secondarySplash.map((d) => (
        <motion.div
          key={`secondary-${d.id}`}
          className="absolute rounded-full"
          style={{
            width: d.size,
            height: d.size,
            background: `radial-gradient(circle at 30% 30%, hsl(175, 100%, 85%), hsl(195, 100%, 55%))`,
            boxShadow: `0 0 ${d.size * 2}px hsl(175, 100%, 60% / 0.5)`,
          }}
          initial={{ x: 0, y: 0, opacity: 0.8, scale: 0.8 }}
          animate={{
            x: [0, d.endX * 0.5, d.endX],
            y: [0, d.endY - 20, d.endY + 40],
            opacity: [0.8, 0.6, 0],
            scale: [0.8, 0.5, 0.1],
          }}
          transition={{
            duration: 1,
            delay: d.delay,
            ease: "easeOut",
            repeat: Infinity,
            repeatDelay: 3,
          }}
        />
      ))}
      {/* Central splash impact rings - triple layer */}
      <motion.div
        className="absolute rounded-full border-2"
        style={{
          borderColor: 'hsl(195, 100%, 70% / 0.7)',
          boxShadow: '0 0 40px hsl(195, 100%, 60% / 0.5), inset 0 0 40px hsl(195, 100%, 60% / 0.2)',
        }}
        initial={{ width: 10, height: 10, opacity: 1 }}
        animate={{
          width: [10, 250, 400],
          height: [10, 250, 400],
          opacity: [1, 0.5, 0],
        }}
        transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2.2, ease: "easeOut" }}
      />
      <motion.div
        className="absolute rounded-full border"
        style={{
          borderColor: 'hsl(195, 100%, 80% / 0.5)',
        }}
        initial={{ width: 10, height: 10, opacity: 0.9 }}
        animate={{
          width: [10, 180, 320],
          height: [10, 180, 320],
          opacity: [0.9, 0.4, 0],
        }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 2, ease: "easeOut", delay: 0.15 }}
      />
      <motion.div
        className="absolute rounded-full border"
        style={{
          borderColor: 'hsl(175, 100%, 70% / 0.3)',
        }}
        initial={{ width: 5, height: 5, opacity: 0.7 }}
        animate={{
          width: [5, 120, 250],
          height: [5, 120, 250],
          opacity: [0.7, 0.2, 0],
        }}
        transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.8, ease: "easeOut", delay: 0.3 }}
      />
      {/* Central bright flash on splash impact */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 60,
          height: 60,
          background: 'radial-gradient(circle, hsl(195, 100%, 90% / 0.8), hsl(195, 100%, 60% / 0.3), transparent)',
          filter: 'blur(8px)',
        }}
        animate={{
          scale: [0, 2, 0],
          opacity: [0, 0.8, 0],
        }}
        transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 3.2, ease: "easeOut" }}
      />
    </div>
  );
};

// Water ripple rings
const WaterRipples = ({ progress }: { progress: number }) => (
  <div className="absolute inset-0 pointer-events-none z-[4] flex items-center justify-center">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full border"
        style={{
          width: 100 + i * 70,
          height: 100 + i * 70,
          borderColor: `hsl(195, 100%, ${60 + i * 5}% / ${0.2 - i * 0.03})`,
          boxShadow: `0 0 ${10 + i * 5}px hsl(195, 100%, 60% / ${0.1 - i * 0.02})`,
        }}
        animate={{
          scale: [1, 1.6 + i * 0.2, 1],
          opacity: [0.3, 0, 0.3],
        }}
        transition={{
          duration: 2.5 + i * 0.4,
          repeat: Infinity,
          delay: i * 0.5,
          ease: "easeOut",
        }}
      />
    ))}
  </div>
);

// Water surface wave effect at top
const WaterSurface = ({ progress }: { progress: number }) => {
  const waterLevel = Math.min(progress, 100);
  
  return (
    <div 
      className="absolute left-0 right-0 z-[5] pointer-events-none transition-all duration-500"
      style={{ bottom: `${waterLevel}%` }}
    >
      <div className="relative w-full h-8 md:h-12">
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, transparent 40%, hsl(195, 100%, 50% / 0.12) 100%)',
            borderRadius: '50% 50% 0 0 / 80% 80% 0 0',
          }}
          animate={{ scaleY: [0.6, 1, 0.6], y: [3, -3, 3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, transparent 50%, hsl(195, 100%, 60% / 0.08) 100%)',
            borderRadius: '40% 60% 0 0 / 70% 90% 0 0',
          }}
          animate={{ scaleY: [1, 0.7, 1], y: [-2, 4, -2] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
      </div>
    </div>
  );
};

// Falling water streams / drips
const WaterStreams = () => {
  const streams = useMemo(() =>
    [...Array(6)].map((_, i) => ({
      id: i,
      left: 10 + Math.random() * 80,
      width: 2 + Math.random() * 3,
      delay: Math.random() * 3,
      duration: 1.5 + Math.random() * 2,
      height: 40 + Math.random() * 80,
    })), []
  );

  return (
    <div className="absolute inset-0 pointer-events-none z-[3]">
      {streams.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: `${s.left}%`,
            top: '-10%',
            width: s.width,
            height: s.height,
            background: `linear-gradient(to bottom, hsl(195, 100%, 70% / 0.6), hsl(195, 100%, 50% / 0.3), transparent)`,
            filter: 'blur(1px)',
          }}
          animate={{
            y: [0, window.innerHeight * 1.3],
            opacity: [0, 0.7, 0.5, 0],
            scaleY: [0.5, 1.2, 0.8],
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            delay: s.delay,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
};

// Underwater ambient sound generator using Web Audio API
const useUnderwaterAmbient = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<AudioNode[]>([]);

  const start = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;
      const nodes: AudioNode[] = [];

      const master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
      nodes.push(master);

      master.gain.linearRampToValueAtTime(0.45, ctx.currentTime + 1.5);

      const bufferSize = ctx.sampleRate * 4;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.5;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;

      const lpf = ctx.createBiquadFilter();
      lpf.type = 'lowpass';
      lpf.frequency.value = 200;
      lpf.Q.value = 1;

      noise.connect(lpf);
      lpf.connect(master);
      noise.start();
      nodes.push(noise);

      const noise2 = ctx.createBufferSource();
      noise2.buffer = noiseBuffer;
      noise2.loop = true;
      const bpf = ctx.createBiquadFilter();
      bpf.type = 'bandpass';
      bpf.frequency.value = 800;
      bpf.Q.value = 2;
      const bpGain = ctx.createGain();
      bpGain.gain.value = 0.08;
      noise2.connect(bpf);
      bpf.connect(bpGain);
      bpGain.connect(master);
      noise2.start();
      nodes.push(noise2);

      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.15;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 300;
      lfo.connect(lfoGain);
      lfoGain.connect(bpf.frequency);
      lfo.start();
      nodes.push(lfo);

      // Splash sound effect - periodic water impact
      const scheduleSplash = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
        
        // White noise burst for splash
        const splashLen = 0.4;
        const splashBuf = ctx.createBuffer(1, ctx.sampleRate * splashLen, ctx.sampleRate);
        const splashData = splashBuf.getChannelData(0);
        for (let j = 0; j < splashBuf.length; j++) {
          const env = Math.exp(-j / (ctx.sampleRate * 0.08));
          splashData[j] = (Math.random() * 2 - 1) * env;
        }
        const splashSrc = ctx.createBufferSource();
        splashSrc.buffer = splashBuf;
        
        // Bandpass for watery character
        const splashBpf = ctx.createBiquadFilter();
        splashBpf.type = 'bandpass';
        splashBpf.frequency.value = 2000 + Math.random() * 1500;
        splashBpf.Q.value = 0.8;
        
        const splashGain = ctx.createGain();
        splashGain.gain.value = 0.15 + Math.random() * 0.1;
        
        splashSrc.connect(splashBpf);
        splashBpf.connect(splashGain);
        splashGain.connect(master);
        splashSrc.start(ctx.currentTime);
        
        // Also add a low "thud" for impact
        const thud = ctx.createOscillator();
        thud.type = 'sine';
        thud.frequency.value = 80 + Math.random() * 40;
        const thudGain = ctx.createGain();
        thudGain.gain.value = 0;
        thudGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.01);
        thudGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        thud.connect(thudGain);
        thudGain.connect(master);
        thud.start(ctx.currentTime);
        thud.stop(ctx.currentTime + 0.35);
        
        // High frequency droplet "plinks" after splash
        for (let k = 0; k < 3; k++) {
          const plink = ctx.createOscillator();
          plink.type = 'sine';
          plink.frequency.value = 2500 + Math.random() * 3000;
          const plinkG = ctx.createGain();
          plinkG.gain.value = 0;
          const plinkDelay = 0.05 + k * 0.06 + Math.random() * 0.04;
          plinkG.gain.linearRampToValueAtTime(0.06, ctx.currentTime + plinkDelay);
          plinkG.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + plinkDelay + 0.15);
          plink.connect(plinkG);
          plinkG.connect(master);
          plink.start(ctx.currentTime + plinkDelay);
          plink.stop(ctx.currentTime + plinkDelay + 0.2);
        }
        
        setTimeout(scheduleSplash, 3500 + Math.random() * 2000);
      };
      setTimeout(scheduleSplash, 1200);

      const scheduleBubble = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 1200 + Math.random() * 2000;
        g.gain.value = 0;
        g.gain.linearRampToValueAtTime(0.1 + Math.random() * 0.06, ctx.currentTime + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4 + Math.random() * 0.3);
        osc.connect(g);
        g.connect(master);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
        
        const next = 600 + Math.random() * 1800;
        setTimeout(scheduleBubble, next);
      };
      setTimeout(scheduleBubble, 300);

      nodesRef.current = nodes;
    } catch {
      // Web Audio not supported
    }
  }, []);

  const stop = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    try {
      const master = nodesRef.current[0] as GainNode;
      if (master?.gain) {
        master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
      }
      setTimeout(() => {
        ctx.close().catch(() => {});
      }, 700);
    } catch {
      ctx.close().catch(() => {});
    }
    audioCtxRef.current = null;
  }, []);

  return { start, stop };
};

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [showTitle, setShowTitle] = useState(false);
  const [splashActive, setSplashActive] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  const { start: startAmbient, stop: stopAmbient } = useUnderwaterAmbient();

  useEffect(() => {
    const tryAutoplay = () => {
      if (!audioStarted) {
        setAudioStarted(true);
        startAmbient();
      }
    };
    tryAutoplay();

    const handleGesture = () => {
      if (!audioStarted) {
        tryAutoplay();
      }
    };

    window.addEventListener('click', handleGesture, { once: true });
    window.addEventListener('touchstart', handleGesture, { once: true });
    window.addEventListener('keydown', handleGesture, { once: true });

    return () => {
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
      window.removeEventListener('keydown', handleGesture);
    };
  }, [startAmbient, audioStarted]);

  useEffect(() => {
    const titleTimer = setTimeout(() => setShowTitle(true), 400);
    const splashTimer = setTimeout(() => setSplashActive(true), 800);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          stopAmbient();
          setTimeout(onComplete, 1000);
          return 100;
        }
        // Slower increments for longer loading experience
        return prev + Math.random() * 3 + 1;
      });
    }, 280);

    return () => {
      clearInterval(interval);
      clearTimeout(titleTimer);
      clearTimeout(splashTimer);
      stopAmbient();
    };
  }, [onComplete, stopAmbient]);

  const clampedProgress = Math.min(progress, 100);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, hsl(210, 60%, 4%) 0%, hsl(215, 70%, 8%) 40%, hsl(210, 60%, 12%) 70%, hsl(200, 80%, 15%) 100%)',
      }}
      initial={{ opacity: 0, scale: 1.3, filter: 'blur(20px)' }}
      animate={{ 
        opacity: 1, 
        scale: [1.3, 1.05, 1.08, 1.03, 1.05],
        filter: 'blur(0px)',
        x: [0, 15, -10, 8, -5, 12, -8, 0],
        y: [0, -8, 12, -6, 10, -4, 6, 0],
      }}
      exit={{ 
        opacity: 0,
        scale: 0.9,
        filter: 'blur(15px)',
        y: -60,
      }}
      transition={{ 
        duration: 1.2, 
        ease: [0.22, 1, 0.36, 1],
        scale: { duration: 12, repeat: Infinity, ease: "easeInOut" },
        x: { duration: 16, repeat: Infinity, ease: "easeInOut" },
        y: { duration: 14, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      {/* Deep ocean ambient gradient */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 80%, hsl(195, 100%, 20% / 0.4), transparent 70%)',
        }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Pulsing ocean glow at center */}
      <motion.div
        className="absolute z-[1] rounded-full"
        style={{
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, hsl(195, 100%, 40% / 0.15), hsl(220, 80%, 30% / 0.08), transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Cinematic vignette overlay */}
      <div
        className="absolute inset-0 z-[20] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, transparent 40%, hsl(210, 60%, 3% / 0.5) 70%, hsl(210, 60%, 2% / 0.85) 100%)`,
        }}
      />
      <div
        className="absolute inset-0 z-[20] pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, hsl(210, 60%, 2% / 0.6) 0%, transparent 18%, transparent 82%, hsl(210, 60%, 2% / 0.6) 100%)`,
        }}
      />

      {/* Water fill effect from bottom */}
      <motion.div
        className="absolute left-0 right-0 bottom-0 z-[1]"
        style={{
          height: `${clampedProgress}%`,
          background: 'linear-gradient(to top, hsl(210, 80%, 10% / 0.8), hsl(200, 70%, 15% / 0.5), hsl(195, 100%, 30% / 0.2), transparent)',
        }}
        transition={{ duration: 0.3 }}
      />

      <CausticsOverlay />
      <FloatingOrganisms />
      <RisingBubbles />
      <WaterStreams />
      <WaterRipples progress={clampedProgress} />
      <WaterSurface progress={clampedProgress} />
      <WaterSplash active={splashActive} />

      {/* === CENTER CONTENT === */}
      <div className="relative z-[10] flex flex-col items-center">
        
        {/* Large water drop with glass effect */}
        <motion.div
          className="relative mb-6"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4, delay: 0.1 }}
        >
          {/* Outer glow - more dramatic */}
          <motion.div
            className="absolute -inset-12 rounded-full blur-3xl"
            style={{ background: 'hsl(195, 100%, 50% / 0.3)' }}
            animate={{
              scale: [1, 1.6, 1],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Secondary pulsing ring */}
          <motion.div
            className="absolute -inset-6 rounded-full"
            style={{
              border: '2px solid hsl(195, 100%, 60% / 0.3)',
              boxShadow: '0 0 20px hsl(195, 100%, 60% / 0.2)',
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
          />

          {/* Glass water drop */}
          <motion.div
            className="relative w-28 h-28 md:w-36 md:h-36"
            animate={{ 
              scale: [1, 1.08, 1],
              rotate: [0, 3, -3, 0],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-2xl">
              <defs>
                <linearGradient id="dropGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(175, 100%, 65%)" stopOpacity="0.9" />
                  <stop offset="40%" stopColor="hsl(195, 100%, 55%)" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="hsl(220, 85%, 45%)" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="dropShine" x1="20%" y1="0%" x2="80%" y2="100%">
                  <stop offset="0%" stopColor="white" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="white" stopOpacity="0" />
                </linearGradient>
                <radialGradient id="dropInner" cx="40%" cy="35%" r="50%">
                  <stop offset="0%" stopColor="hsl(195, 100%, 80%)" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
                <filter id="dropGlow">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              
              <path
                d="M50 8 C50 8 15 50 15 72 C15 92 30 108 50 108 C70 108 85 92 85 72 C85 50 50 8 50 8Z"
                fill="url(#dropGrad)"
                filter="url(#dropGlow)"
                stroke="hsl(195, 100%, 70% / 0.4)"
                strokeWidth="1"
              />
              <path
                d="M50 15 C50 15 25 48 25 70 C25 75 27 80 30 84"
                fill="none"
                stroke="url(#dropShine)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <ellipse cx="38" cy="55" rx="15" ry="20" fill="url(#dropInner)" />
              <circle cx="35" cy="45" r="5" fill="white" opacity="0.6" />
              <circle cx="38" cy="50" r="2.5" fill="white" opacity="0.4" />
            </svg>

            {/* Orbiting mini bubbles */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: 6 + i * 2,
                  height: 6 + i * 2,
                  background: `radial-gradient(circle at 30% 30%, hsl(195, 100%, 85% / 0.8), hsl(195, 100%, 60% / 0.3))`,
                  border: '1px solid hsl(195, 100%, 80% / 0.3)',
                  top: '50%',
                  left: '50%',
                }}
                animate={{
                  x: [Math.cos(i * 1.6) * 55, Math.cos(i * 1.6 + Math.PI) * 55],
                  y: [Math.sin(i * 1.6) * 55, Math.sin(i * 1.6 + Math.PI) * 55],
                  opacity: [0.4, 0.9, 0.4],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2.5 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.4,
                }}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* AVISHKAAR title with water effect */}
        <AnimatePresence>
          {showTitle && (
            <motion.div
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center mb-3 relative"
            >
              {/* SVG water distortion filter */}
              <svg className="absolute w-0 h-0">
                <defs>
                  <filter id="waterTextFilter">
                    <feTurbulence
                      type="fractalNoise"
                      baseFrequency="0.015 0.04"
                      numOctaves="3"
                      seed="3"
                      result="noise"
                    >
                      <animate attributeName="baseFrequency" values="0.015 0.04;0.02 0.06;0.015 0.04" dur="4s" repeatCount="indefinite" />
                    </feTurbulence>
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" />
                  </filter>
                </defs>
              </svg>

              <div className="relative" style={{ filter: 'url(#waterTextFilter)' }}>
                <motion.h1
                  className="text-5xl md:text-7xl lg:text-8xl font-display font-black tracking-[0.2em] relative"
                  style={{
                    background: 'linear-gradient(180deg, hsl(195, 100%, 80%) 0%, hsl(195, 100%, 60%) 30%, hsl(210, 90%, 50%) 60%, hsl(220, 85%, 40%) 100%)',
                    backgroundSize: '100% 200%',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    textShadow: 'none',
                  }}
                  animate={{
                    backgroundPosition: ['0% 0%', '0% 100%', '0% 0%'],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  AVISHKAAR

                  {/* Water reflection shine sweeping across */}
                  <motion.span
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(105deg, transparent 40%, hsl(195, 100%, 90% / 0.5) 45%, hsl(195, 100%, 95% / 0.7) 50%, transparent 55%)',
                      backgroundSize: '200% 100%',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                    }}
                    animate={{
                      backgroundPosition: ['200% 0%', '-200% 0%'],
                    }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
                    aria-hidden="true"
                  >
                    AVISHKAAR
                  </motion.span>

                  {/* Glow layer */}
                  <motion.span
                    className="absolute inset-0 blur-lg opacity-50"
                    style={{
                      background: 'linear-gradient(135deg, hsl(175, 100%, 55%), hsl(195, 100%, 60%), hsl(220, 85%, 60%))',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                    }}
                    animate={{ opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    aria-hidden="true"
                  >
                    AVISHKAAR
                  </motion.span>
                </motion.h1>
              </div>

              {/* Water drips falling from text */}
              <div className="relative flex justify-center">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={`drip-${i}`}
                    className="absolute rounded-full"
                    style={{
                      width: 3 + Math.random() * 3,
                      height: 8 + Math.random() * 10,
                      left: `${15 + i * 18}%`,
                      top: 0,
                      background: 'linear-gradient(to bottom, hsl(195, 100%, 70% / 0.8), hsl(195, 100%, 50% / 0.3))',
                      borderRadius: '50% 50% 50% 50% / 30% 30% 70% 70%',
                    }}
                    animate={{
                      y: [0, 30, 50],
                      opacity: [0.8, 0.5, 0],
                      scaleY: [1, 1.5, 0.5],
                    }}
                    transition={{
                      duration: 1.5 + Math.random(),
                      repeat: Infinity,
                      delay: i * 0.6 + Math.random() * 0.5,
                      ease: "easeIn",
                      repeatDelay: 1 + Math.random() * 2,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Season 4 subtitle */}
        <AnimatePresence>
          {showTitle && (
            <motion.p
              initial={{ opacity: 0, letterSpacing: '0.5em' }}
              animate={{ opacity: 1, letterSpacing: '0.4em' }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-sm md:text-lg font-display uppercase text-muted-foreground mb-10 tracking-[0.4em]"
            >
              Season 4 · 2026
            </motion.p>
          )}
        </AnimatePresence>

        {/* Glass progress container */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: '100%' }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative w-64 md:w-80"
        >
          <div
            className="relative h-3 rounded-full overflow-hidden"
            style={{
              background: 'hsl(210, 50%, 15% / 0.6)',
              backdropFilter: 'blur(10px)',
              border: '1px solid hsl(195, 100%, 50% / 0.15)',
              boxShadow: 'inset 0 2px 4px hsl(210, 50%, 5% / 0.5), 0 0 15px hsl(195, 100%, 50% / 0.1)',
            }}
          >
            <motion.div
              className="h-full rounded-full relative overflow-hidden"
              style={{
                width: `${clampedProgress}%`,
                background: 'linear-gradient(90deg, hsl(220, 85%, 50%), hsl(195, 100%, 50%), hsl(175, 100%, 50%))',
                boxShadow: '0 0 20px hsl(195, 100%, 50% / 0.6), 0 0 40px hsl(195, 100%, 50% / 0.3)',
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, hsl(195, 100%, 90% / 0.5) 50%, transparent 100%)',
                }}
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>

            <motion.div
              className="absolute top-0 bottom-0 w-4 rounded-full"
              style={{
                left: `${Math.max(clampedProgress - 2, 0)}%`,
                background: 'radial-gradient(circle, hsl(195, 100%, 80%), transparent)',
                filter: 'blur(3px)',
              }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="flex justify-between items-center mt-3">
            {!audioStarted ? (
              <motion.span
                className="text-xs font-display uppercase tracking-widest text-primary/70 cursor-pointer"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                onClick={() => {
                  setAudioStarted(true);
                  startAmbient();
                }}
              >
                🔊 Tap for sound
              </motion.span>
            ) : (
              <motion.span
                className="text-xs font-display uppercase tracking-widest text-muted-foreground"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Diving deep...
              </motion.span>
            )}
            <motion.span 
              className="text-sm font-display font-bold"
              style={{
                background: 'linear-gradient(135deg, hsl(195, 100%, 60%), hsl(175, 100%, 55%))',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {Math.round(clampedProgress)}%
            </motion.span>
          </div>
        </motion.div>
      </div>

      {/* Bottom ambient water glow */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[40%] z-[0]"
        style={{
          background: 'linear-gradient(to top, hsl(195, 100%, 25% / 0.3), hsl(210, 60%, 15% / 0.15), transparent)',
        }}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Vignette */}
      <div 
        className="absolute inset-0 z-[0] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, hsl(210, 60%, 3% / 0.7) 100%)',
        }}
      />
    </motion.div>
  );
};

export const usePreloader = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleComplete = () => {
    setIsLoading(false);
  };

  const PreloaderComponent = () => (
    <AnimatePresence mode="wait">
      {isLoading && <Preloader onComplete={handleComplete} />}
    </AnimatePresence>
  );

  return { isLoading, PreloaderComponent };
};

export default Preloader;
