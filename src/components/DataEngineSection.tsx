import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { TrendingUp, BarChart3, DollarSign, Droplets, Users } from "lucide-react";

function AnimatedCounter({ target, duration = 2, prefix = "", suffix = "", inView }: {
  target: number; duration?: number; prefix?: string; suffix?: string; inView: boolean;
}) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration,
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return controls.stop;
  }, [inView, target, duration]);
  return <span>{prefix}{value.toLocaleString()}{suffix}</span>;
}

const revenueData = [12, 18, 15, 24, 22, 31, 28, 35, 42, 38, 47, 52];

export default function DataEngineSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-32 px-6 relative overflow-hidden" ref={ref}>
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-primary/6 blur-[150px] rounded-full" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-secondary/5 blur-[120px] rounded-full" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="text-primary text-sm tracking-[0.3em] uppercase mb-4 text-center"
        >
          The Data Engine
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-3xl md:text-5xl font-bold text-center mb-4"
        >
          Your Business's <span className="text-gradient-primary">Living Heartbeat</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-muted-foreground text-lg text-center max-w-2xl mx-auto mb-16"
        >
          Every job generates data. Cloud Cowboy turns it into intelligence.
        </motion.p>

        {/* Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="bg-card border border-border rounded-2xl p-8 relative overflow-hidden"
        >
          {/* Subtle grid overlay */}
          <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

          {/* Revenue Chart */}
          <div className="mb-8 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Revenue Trend (12mo)</span>
              </div>
              <span className="text-sm font-semibold text-primary">
                +<AnimatedCounter target={127} inView={inView} suffix="%" />
              </span>
            </div>
            <div className="h-32 flex items-end gap-1.5 relative">
              {revenueData.map((val, i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-t-sm relative group"
                  initial={{ height: 0 }}
                  animate={inView ? { height: `${(val / 55) * 100}%` } : {}}
                  transition={{ duration: 0.6, delay: 0.5 + i * 0.08 }}
                  style={{
                    background: `linear-gradient(to top, hsl(var(--primary)), hsl(var(--primary) / 0.4))`,
                    boxShadow: `0 0 12px hsl(var(--primary) / 0.3)`,
                  }}
                />
              ))}
              {/* Glow line overlay */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                <motion.line
                  x1="0" y1="100%" x2="100%" y2="0%"
                  stroke="hsl(var(--primary))"
                  strokeWidth="1"
                  strokeOpacity="0.3"
                  initial={{ pathLength: 0 }}
                  animate={inView ? { pathLength: 1 } : {}}
                  transition={{ duration: 1.5, delay: 0.5 }}
                />
              </svg>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: BarChart3, label: "Jobs Completed", value: 1247, prefix: "", suffix: "", color: "text-primary" },
              { icon: DollarSign, label: "Avg Job Value", value: 842, prefix: "$", suffix: "", color: "text-primary" },
              { icon: Droplets, label: "Chemical Efficiency", value: 94, prefix: "", suffix: "%", color: "text-secondary" },
              { icon: Users, label: "Crew Utilization", value: 87, prefix: "", suffix: "%", color: "text-secondary" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
                className="bg-muted/40 rounded-xl p-5 border border-border/50 relative group"
              >
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ boxShadow: `inset 0 0 30px hsl(var(--primary) / 0.05)` }} />
                <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
                <div className="text-3xl font-bold font-display mb-1">
                  <AnimatedCounter target={stat.value} prefix={stat.prefix} suffix={stat.suffix} inView={inView} />
                </div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
