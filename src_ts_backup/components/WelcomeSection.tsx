import { motion } from "framer-motion";
import { Droplets } from "lucide-react";
import TypingEffect from "./TypingEffect";
import WaveDivider from "./WaveDivider";
import WaterTextEffect from "./WaterTextEffect";

const WelcomeSection = () => {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden water-bg-effect" id="welcome">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-deep-sea to-background" />

      {/* Wave Dividers */}
      <WaveDivider variant="top" />
      <WaveDivider variant="bottom" />

      {/* Animated background glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, hsl(195, 100%, 50% / 0.15), transparent 60%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      {/* Floating bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `hsl(${195 + Math.random() * 20}, 100%, ${50 + Math.random() * 15}%)`,
              boxShadow: `0 0 ${4 + Math.random() * 4}px hsl(195, 100%, 50%)`,
            }}
            animate={{
              y: [0, -80, -160],
              x: [0, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 60],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Welcome Header with water effect */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <WaterTextEffect id="welcomeTitle">
            <motion.h2
              className="text-3xl md:text-5xl font-display font-black italic mb-4 text-gradient-water"
            >
              Welcome to
            </motion.h2>
          </WaterTextEffect>
        </motion.div>

        {/* Same Typing Effect as Hero Section with water effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-4"
        >
          <WaterTextEffect id="welcomeAvishkaar">
            <TypingEffect />
          </WaterTextEffect>
        </motion.div>

        {/* Season 4 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mb-12"
        >
          <h3 className="text-2xl md:text-4xl font-display font-bold text-foreground tracking-[0.3em]">
            SEASON 4
          </h3>
        </motion.div>

        {/* Welcome Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto text-center"
        >
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Welcome to the Official Website of Avishkaar Season 4 — a high-energy arena where innovation meets impact. 
            Step into an immersive hackathon experience that celebrates creativity, teamwork, and cutting-edge technology. 
            From AI and web to AR/VR, IoT, and sustainability, Avishkaar brings together brilliant minds to prototype bold ideas, 
            build real solutions, and present them to mentors and industry leaders. Join us for 48 hours of focused problem-solving, 
            lightning workshops, deep-dive mentoring, and live demos — where every commit pushes the future forward and every project 
            can spark change.
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <motion.button
            className="relative px-10 py-5 font-display font-bold text-lg text-foreground rounded-full overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open('https://unstop.com/o/3C4O1aP?lb=O4B2h3r', '_blank')}
          >
            {/* Animated water border */}
            <motion.div
              className="absolute inset-0 rounded-full p-[3px]"
              style={{
                background: 'linear-gradient(135deg, hsl(175, 100%, 45%), hsl(195, 100%, 50%), hsl(220, 85%, 55%), hsl(175, 100%, 45%))',
                backgroundSize: '400% 400%',
              }}
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="w-full h-full bg-card rounded-full" />
            </motion.div>

            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                boxShadow: '0 0 30px hsl(195, 100%, 50% / 0.5), 0 0 60px hsl(175, 100%, 45% / 0.3)',
              }}
            />

            <span className="relative z-10 flex items-center gap-3">
              JOIN THE INNOVATION
              <motion.span
                animate={{ 
                  y: [0, -5, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Droplets className="w-6 h-6 text-primary" />
              </motion.span>
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default WelcomeSection;
