import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { TrendingUp, Rocket, Briefcase } from "lucide-react";

const DEMO_LINK = "https://calendly.com/chris-cloudcowboy/30min";

export default function JoinMovementSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-32 px-6 relative overflow-hidden" ref={ref}>
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary/5 blur-[130px] rounded-full" />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="text-secondary text-sm tracking-[0.3em] uppercase mb-4 text-center"
        >
          Join the Movement
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-3xl md:text-5xl font-bold text-center mb-16"
        >
          The Future of Ag Drone Operations{" "}
          <span className="text-gradient-primary">Starts Here</span>
        </motion.h2>

        {/* Market stat */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center mb-16 relative"
        >
          {/* Growth line behind */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg width="400" height="80" viewBox="0 0 400 80" className="opacity-20">
              <motion.path
                d="M0 70 Q100 60 150 45 T250 25 T400 5"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={inView ? { pathLength: 1 } : {}}
                transition={{ duration: 2, delay: 0.5 }}
              />
            </svg>
          </div>
          <div className="relative">
            <div className="flex items-center justify-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              <span className="text-4xl md:text-5xl font-bold font-display">$506M</span>
            </div>
            <p className="text-muted-foreground text-lg">market growing <span className="text-primary font-semibold">23.5% yearly</span></p>
          </div>
        </motion.div>

        {/* Two CTA cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-card border border-border rounded-2xl p-8 text-center group hover:border-primary/40 transition-colors"
          >
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <Rocket className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-display font-bold text-xl mb-3">Become a Beta Tester</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Get free access. Shape the product. Lock in founder pricing.
            </p>
            <a
              href={DEMO_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold glow-primary hover:opacity-90 transition-opacity"
            >
              Apply for Beta
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-card border border-border rounded-2xl p-8 text-center group hover:border-secondary/40 transition-colors"
          >
            <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mx-auto mb-5">
              <Briefcase className="w-7 h-7 text-secondary" />
            </div>
            <h3 className="font-display font-bold text-xl mb-3">Invest in Cloud Cowboy</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Pre-seed round open. Ground-floor opportunity in ag-tech.
            </p>
            <a
              href={DEMO_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 rounded-lg border border-secondary/50 text-foreground font-semibold hover:border-secondary transition-colors"
            >
              Schedule Investor Call
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
