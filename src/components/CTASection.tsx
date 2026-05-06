import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { CheckCircle, Zap, Globe, DollarSign } from "lucide-react";

const DEMO_LINK = "https://calendly.com/chris-cloudcowboy/30min";

export default function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-32 px-6 relative" ref={ref}>
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/8 blur-[100px] rounded-full" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-3xl md:text-5xl font-bold mb-6">
          
          One Platform. <span className="text-gradient-primary">Every Acre.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-muted-foreground text-lg max-w-2xl mx-auto mb-12">
          
          Stop stitching together spreadsheets, texts, and gut feelings. 
          Cloud Cowboy is the command center your operation deserves.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          
          {[
          { icon: Zap, label: "Instant Quotes" },
          { icon: CheckCircle, label: "Auto Contracts" },
          { icon: Globe, label: "Live Ops Map" },
          { icon: DollarSign, label: "Smart Pricing" }].
          map((item) =>
          <div key={item.label} className="flex flex-col items-center gap-2 py-4">
              <item.icon className="w-6 h-6 text-primary" />
              <span className="text-sm text-foreground/70">{item.label}</span>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center">
          
          <a
            href={DEMO_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold text-lg glow-primary hover:opacity-90 transition-opacity">
            
            Learn More 
          </a>
          <a
            href={DEMO_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-lg border border-primary/40 text-foreground font-semibold text-lg hover:border-primary/70 transition-colors">
            
            Get in Touch
          </a>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.6 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-20 space-y-2">
          
          <p className="text-sm text-muted-foreground">
            Built for the operators who fuel the world.
          </p>
          <p className="text-sm text-muted-foreground">
            <a href="mailto:chris@cloudcowboy.us" className="hover:text-primary transition-colors">
              chris@cloudcowboy.us
            </a>
          </p>
          <p className="text-xs text-muted-foreground">
            © 2026 Cloud Cowboy LLC
          </p>
        </motion.div>
      </div>
    </section>);

}