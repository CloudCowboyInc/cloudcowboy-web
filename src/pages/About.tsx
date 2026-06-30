import { motion, useInView, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Users, Linkedin, Mail, Globe } from "lucide-react";
import CloudCowboyLogo from "@/components/CloudCowboyLogo";

function AnimatedCounter({ target, duration = 2, prefix = "", suffix = "", inView }: {
  target: number; duration?: number; prefix?: string; suffix?: string; inView: boolean;
}) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, { duration, onUpdate: (v) => setValue(Math.round(v)) });
    return controls.stop;
  }, [inView, target, duration]);
  return <span>{prefix}{value.toLocaleString()}{suffix}</span>;
}

export default function AboutPage() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const storyRef = useRef(null);
  const storyInView = useInView(storyRef, { once: true, margin: "-100px" });
  const teamRef = useRef(null);
  const teamInView = useInView(teamRef, { once: true, margin: "-100px" });
  const missionRef = useRef(null);
  const missionInView = useInView(missionRef, { once: true, margin: "-100px" });
  const numbersRef = useRef(null);
  const numbersInView = useInView(numbersRef, { once: true, margin: "-100px" });

  return (
    <main className="relative z-10 text-foreground overflow-x-hidden">
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-[60vh] flex items-center justify-center pt-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={heroInView ? { opacity: 1, scale: 1 } : {}} className="flex justify-center mb-8">
            <CloudCowboyLogo size={100} />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.1 }} className="text-4xl md:text-6xl lg:text-7xl font-bold">
            Where Agriculture Meets <span className="text-gradient-primary">Intelligence</span>
          </motion.h1>
        </div>
      </section>

      {/* Our Story */}
      <section ref={storyRef} className="py-28 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={storyInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="text-3xl md:text-5xl font-bold text-center mb-12">
            Our <span className="text-gradient-primary">Story</span>
          </motion.h2>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={storyInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.15 }}
            className="bg-card border border-border rounded-2xl p-10">
            <p className="text-foreground/90 leading-relaxed text-lg">
              Cloud Cowboy was born from a simple observation: agricultural drone operators are building incredible businesses with zero software support. They close deals on handshakes, manage fleets on whiteboards, and price jobs on gut feel. Meanwhile, every other industry has software eating it alive.
            </p>
            <p className="text-foreground/90 leading-relaxed text-lg mt-6">
              We're building the operating system that brings these operators into the modern era — from the first customer click all the way through contract execution, field operations, and business intelligence. One platform. Every acre.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Meet the Team */}
      <section ref={teamRef} className="py-28 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={teamInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="text-3xl md:text-5xl font-bold text-center mb-12">
            Meet the <span className="text-gradient-primary">Team</span>
          </motion.h2>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={teamInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.15 }}
            className="bg-card border border-border rounded-2xl p-10 text-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-primary" />
            </div>
            <h3 className="font-display font-bold text-2xl mb-1">Chris Long</h3>
            <p className="text-primary text-sm mb-4">Founder & CEO</p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Based in the US. Background spanning agricultural technology and SaaS operations. Obsessed with building tools that make real businesses measurably better.
            </p>
            <div className="flex items-center justify-center gap-4">
              <a href="mailto:chris@cloudcowboy.us" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-4 h-4" /> chris@cloudcowboy.us
              </a>
              <a href="https://linkedin.com/in/chrislong3347" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Mission */}
      <section ref={missionRef} className="py-28 px-6 relative">
        <div className="absolute inset-0 bg-topo-pattern opacity-30" />
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={missionInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="text-3xl md:text-5xl font-bold mb-8">
            Our <span className="text-gradient-primary">Mission</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={missionInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.15 }}
            className="text-xl text-foreground/90 leading-relaxed font-display">
            "Every spray operator deserves the same business intelligence that Fortune 500 companies take for granted. We're democratizing operational technology for the people who feed the world."
          </motion.p>
        </div>
      </section>

      {/* The Numbers */}
      <section ref={numbersRef} className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={numbersInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="text-3xl md:text-5xl font-bold text-center mb-16">
            The <span className="text-gradient-primary">Numbers</span>
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: 1710, suffix: "+", label: "FAA Part 137 spray drone operators in the US today" },
              { value: 506, prefix: "$", suffix: "M", label: "Agricultural drone market (2024)" },
              { value: 23, suffix: ".5%", label: "Annual market growth rate" },
              { value: 0, suffix: "", label: "Software platforms built for them — until now", display: "0" },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={numbersInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 + i * 0.1 }}
                className="bg-card border border-border rounded-xl p-6 text-center">
                <div className="text-3xl md:text-4xl font-bold font-display text-primary mb-3">
                  {stat.display !== undefined ? stat.display : <AnimatedCounter target={stat.value} prefix={stat.prefix || ""} suffix={stat.suffix} inView={numbersInView} />}
                </div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="text-center py-12 px-6 border-t border-border/30">
        <p className="text-sm text-muted-foreground">© 2026 Cloud Cowboy LLC · <a href="mailto:chris@cloudcowboy.us" className="hover:text-primary transition-colors">chris@cloudcowboy.us</a></p>
      </div>
    </main>
  );
}
