import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Users, BarChart3, Plane } from "lucide-react";

export default function OperationsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-32 px-6 relative" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="text-secondary text-sm tracking-[0.3em] uppercase mb-4 text-center"
        >
          Step 3
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-3xl md:text-5xl font-bold text-center mb-6"
        >
          Now the <span className="text-gradient-secondary">Real Work</span> Begins
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-muted-foreground text-lg text-center max-w-2xl mx-auto mb-16"
        >
          The contract flows into your operations dashboard. Crew scheduling, flight planning, 
          chemical tracking, and compliance — all in one command center.
        </motion.p>

        {/* Dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-card border border-border rounded-2xl p-6 max-w-5xl mx-auto"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Active Jobs", value: "12", icon: Plane, color: "text-primary" },
              { label: "Crews Deployed", value: "4", icon: Users, color: "text-secondary" },
              { label: "Acres Today", value: "847", icon: MapPin, color: "text-primary" },
              { label: "Revenue MTD", value: "$47.2K", icon: BarChart3, color: "text-secondary" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                className="bg-muted/50 rounded-xl p-4"
              >
                <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Map area */}
          <div className="bg-muted/30 rounded-xl h-48 flex items-center justify-center relative overflow-hidden">
            <img
              src="https://tile.openstreetmap.org/4/4/6.png"
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-20 scale-[3]"
              style={{ imageRendering: 'auto' }}
            />
            <img
              src="https://tile.openstreetmap.org/4/3/6.png"
              alt=""
              className="absolute inset-0 w-1/2 h-full object-cover opacity-20 scale-[3]"
              style={{ imageRendering: 'auto' }}
            />
            <div className="relative z-10 flex items-center gap-3 text-muted-foreground">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="text-sm">Live Operations Map — 4 crews active</span>
            </div>
            {/* Crew dots */}
            {[
              { top: "30%", left: "25%" },
              { top: "55%", left: "60%" },
              { top: "40%", left: "75%" },
              { top: "65%", left: "35%" },
            ].map((pos, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full bg-primary"
                style={pos}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 2, delay: i * 0.5 }}
              >
                <div className="absolute inset-0 rounded-full bg-primary animate-pulse-glow" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
