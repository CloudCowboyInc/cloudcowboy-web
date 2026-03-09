import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Shield, Radio, Beaker, CloudSun } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "FAA Part 137 Ready",
    desc: "Compliance built into every workflow.",
  },
  {
    icon: Radio,
    title: "DJI Agras Integration",
    desc: "Syncs with your existing fleet hardware.",
  },
  {
    icon: Beaker,
    title: "Chemical Rate Calculator",
    desc: "Precise application rates per acre per chemical.",
  },
  {
    icon: CloudSun,
    title: "Weather-Aware Scheduling",
    desc: "Auto-flags wind speed and rain risks.",
  },
];

export default function BuiltForOperatorsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-32 px-6 relative" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="text-primary text-sm tracking-[0.3em] uppercase mb-4 text-center"
        >
          Built for Drone Operators
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-3xl md:text-5xl font-bold text-center mb-6"
        >
          We Speak <span className="text-gradient-primary">Your Language</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-muted-foreground text-lg text-center max-w-2xl mx-auto mb-16"
        >
          Purpose-built tools for agricultural drone spray operations.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              className="bg-card border border-border rounded-xl p-6 flex gap-5 items-start group hover:border-primary/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <feat.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg mb-1">{feat.title}</h3>
                <p className="text-sm text-muted-foreground">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
