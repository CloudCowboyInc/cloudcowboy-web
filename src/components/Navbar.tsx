import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CloudCowboyLogo from "./CloudCowboyLogo";

const DEMO_LINK = "https://calendly.com/chris-cloudcowboy/30min";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CloudCowboyLogo size={32} />
          <span className="text-xl font-display font-bold text-primary">Cloud Cowboy</span>
        </div>
        <a
          href={DEMO_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Book a Demo
        </a>
      </div>
    </motion.nav>
  );
}
