import { motion } from "framer-motion";
import CloudCowboyLogo from "@/components/CloudCowboyLogo";
import wordmark from "@/assets/cloud-cowboy-wordmark.svg";
import heroVideo from "@/assets/hero-agriculture.mov";

export default function HeroLanding() {
  return (
    <section
      id="landing"
      className="cc-anchor relative w-full overflow-hidden flex items-center justify-center"
      style={{ height: "100vh", minHeight: 700 }}
    >
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

      {/* Navy overlay */}
      <div className="absolute inset-0" style={{ background: "rgba(15,23,34,0.55)" }} />

      {/* Top + bottom vignette */}
      <div
        className="absolute inset-x-0 top-0 h-40 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(15,23,34,0.95), rgba(15,23,34,0))" }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(15,23,34,1), rgba(15,23,34,0))" }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-20 md:py-24 w-full h-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{ filter: "drop-shadow(0 0 32px rgba(217,108,71,0.55))" }}
        >
          <motion.div
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <CloudCowboyLogo size={228} />
          </motion.div>
        </motion.div>

        <motion.img
          src={wordmark}
          alt="Cloud Cowboy"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
          className="mt-6 w-[86vw] max-w-[660px] h-auto"
        />

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
          className="mt-7 text-[14px] md:text-[15px] tracking-[0.3em] uppercase font-medium"
          style={{ color: "#d96c47" }}
        >
          The Ag Service Operating System
        </motion.p>
      </div>
    </section>
  );
}