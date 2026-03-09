import { motion } from "framer-motion";
import CloudCowboyLogo from "./CloudCowboyLogo";

const DEMO_LINK = "https://calendly.com/chris-cloudcowboy/30min";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15 },
  }),
} as const;

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40" />
      <div className="absolute inset-0 bg-topo-pattern" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-[120px]" />

      <motion.div
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <motion.div variants={fadeUp} custom={0} className="flex justify-center mb-6">
          <CloudCowboyLogo size={100} />
        </motion.div>

        <motion.p
          variants={fadeUp}
          custom={0.5}
          className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6"
        >
          Agricultural Drone Operations
        </motion.p>

        <motion.h1
          variants={fadeUp}
          custom={1}
          className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-6"
        >
          <span className="text-gradient-primary">Cloud Cowboy</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          custom={2}
          className="text-xl md:text-2xl font-display font-medium text-foreground/90 mb-3"
        >
          The Operating System for Chemical Application
        </motion.p>

        <motion.p
          variants={fadeUp}
          custom={3}
          className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          From first click to final flight — one platform runs it all.
        </motion.p>

        <motion.div variants={fadeUp} custom={4} className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={DEMO_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold text-lg glow-primary hover:opacity-90 transition-opacity"
          >
            Book a Demo
          </a>
          <a
            href={DEMO_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-lg border border-primary/40 text-foreground font-semibold text-lg hover:border-primary/70 transition-colors"
          >
            Join the Beta
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1.5">
          <div className="w-1.5 h-3 rounded-full bg-primary/60" />
        </div>
      </motion.div>
    </section>
  );
}
