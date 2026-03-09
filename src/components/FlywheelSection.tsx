import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MousePointer, FileText, FileCheck, Plane, BarChart3, Zap } from "lucide-react";

const nodes = [
  { icon: MousePointer, label: "Widget", angle: -90 },
  { icon: FileText, label: "Quotes", angle: -18 },
  { icon: FileCheck, label: "Contracts", angle: 54 },
  { icon: Plane, label: "Operations", angle: 126 },
  { icon: BarChart3, label: "Data", angle: 198 },
];

export default function FlywheelSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const radius = 160;

  return (
    <section className="py-32 px-6 relative" ref={ref}>
      <div className="max-w-4xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="text-secondary text-sm tracking-[0.3em] uppercase mb-4"
        >
          The Flywheel
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-3xl md:text-5xl font-bold mb-6"
        >
          The Growth Loop That <span className="text-gradient-primary">Runs Itself</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-muted-foreground text-lg max-w-2xl mx-auto mb-20"
        >
          Every spray job makes your next quote smarter, your ops tighter, and your margins wider.
        </motion.p>

        {/* Flywheel */}
        <div className="relative w-[360px] h-[360px] mx-auto">
          {/* Rotating ring */}
          <motion.div
            className="absolute inset-0 rounded-full border border-primary/20"
            animate={inView ? { rotate: 360 } : {}}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-4 rounded-full border border-border/40" />

          {/* Center label */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center"
              style={{ boxShadow: `0 0 30px hsl(var(--primary) / 0.2)` }}>
              <Zap className="w-8 h-8 text-primary" />
            </div>
          </motion.div>

          {/* Nodes */}
          {nodes.map((node, i) => {
            const rad = (node.angle * Math.PI) / 180;
            const x = Math.cos(rad) * radius;
            const y = Math.sin(rad) * radius;

            return (
              <motion.div
                key={node.label}
                className="absolute flex flex-col items-center gap-2"
                style={{
                  left: `calc(50% + ${x}px - 32px)`,
                  top: `calc(50% + ${y}px - 32px)`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.2 }}
              >
                <motion.div
                  className="w-16 h-16 rounded-xl bg-card border border-border flex items-center justify-center relative"
                  animate={inView ? {
                    boxShadow: [
                      `0 0 0px hsl(var(--primary) / 0)`,
                      `0 0 20px hsl(var(--primary) / 0.4)`,
                      `0 0 0px hsl(var(--primary) / 0)`,
                    ],
                  } : {}}
                  transition={{ duration: 2, delay: 0.6 + i * 0.4, repeat: Infinity, repeatDelay: nodes.length * 0.4 - 0.4 }}
                >
                  <node.icon className="w-6 h-6 text-primary" />
                </motion.div>
                <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">{node.label}</span>
              </motion.div>
            );
          })}

          {/* "Better Quotes" arrow label */}
          <motion.div
            className="absolute -top-10 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 1.5 }}
          >
            <span className="text-xs text-primary font-semibold tracking-wide">↻ Better Quotes</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
