import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Clock, EyeOff, TrendingDown } from "lucide-react";

const painPoints = [
  {
    icon: Clock,
    title: "3 Hours Per Quote",
    description: "Manual quoting kills your pipeline. Every lead waits while you measure fields, calculate distance, and build PDFs by hand.",
  },
  {
    icon: EyeOff,
    title: "Zero Visibility",
    description: "No idea where your crews are or what's happening in the field. You're running a tech business on phone calls and texts.",
  },
  {
    icon: TrendingDown,
    title: "Gut-Feel Pricing",
    description: "No data means money left on every table. You're guessing rates while competitors undercut or you leave margin behind.",
  },
];

export default function PainPointsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-32 px-6 relative">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="text-primary text-sm tracking-[0.3em] uppercase mb-4 text-center"
        >
          The Problem
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-3xl md:text-5xl font-bold text-center mb-16 max-w-3xl mx-auto leading-tight"
        >
          Your Business Runs on{" "}
          <span className="text-gradient-primary">Handshakes and Whiteboards</span>
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6">
          {painPoints.map((point, i) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
              className="bg-card rounded-xl p-8 border-l-4 border-l-primary border border-border relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                  <point.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{point.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{point.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
