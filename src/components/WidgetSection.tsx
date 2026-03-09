import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MousePointer, FileText, ClipboardCheck, CreditCard } from "lucide-react";

const steps = [
{ icon: MousePointer, label: "Click" },
{ icon: FileText, label: "Quote" },
{ icon: ClipboardCheck, label: "Contract" },
{ icon: CreditCard, label: "Deposit" }];


export default function WidgetSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-32 px-6 relative" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="text-secondary text-sm tracking-[0.3em] uppercase mb-4 text-center">
          
          Step 1
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-3xl md:text-5xl font-bold text-center mb-6">
          
          It Starts With a <span className="text-gradient-secondary">Click</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-muted-foreground text-lg text-center max-w-2xl mx-auto mb-16">Install a free widget on your website. A customer clicks their field on the map, selects services. The AI generates an instant quote based on real data and your set preferences. In minutes, not hours.



        </motion.p>

        {/* Widget mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative max-w-4xl mx-auto mb-20">
          
          <div className="bg-card border border-border rounded-2xl p-2 glow-secondary">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-muted" />
                <div className="w-3 h-3 rounded-full bg-muted" />
                <div className="w-3 h-3 rounded-full bg-muted" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-muted rounded-md px-4 py-1.5 text-xs text-muted-foreground">
                  yourspraying.com
                </div>
              </div>
            </div>

            {/* Mock page content */}
            <div className="p-8 min-h-[350px] relative">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="h-4 bg-muted rounded w-3/4 mb-3" />
                  <div className="h-3 bg-muted/60 rounded w-full mb-2" />
                  <div className="h-3 bg-muted/60 rounded w-5/6 mb-6" />
                  <div className="h-10 bg-primary/20 rounded-lg w-40 flex items-center justify-center">
                    <span className="text-primary text-sm font-medium">Get Instant Quote</span>
                  </div>
                </div>

                {/* Map widget */}
                <div className="bg-muted/30 rounded-xl border border-secondary/30 p-4 relative overflow-hidden">
                  <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded font-medium">
                    Cloud Cowboy Widget
                  </div>
                  <div className="h-48 rounded-lg bg-muted/50 relative flex items-center justify-center">
                    <div className="text-muted-foreground/50 text-sm">Interactive Map View</div>
                    {/* Field polygon mockup */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 200">
                      <path
                        d="M80 60 L220 50 L240 150 L60 160 Z"
                        fill="hsl(25 68% 50% / 0.15)"
                        stroke="hsl(25 68% 50% / 0.6)"
                        strokeWidth="2" />
                      
                    </svg>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <div className="h-8 flex-1 bg-secondary/20 rounded text-xs flex items-center justify-center text-secondary">
                      Select Service
                    </div>
                    <div className="h-8 flex-1 bg-primary/20 rounded text-xs flex items-center justify-center text-primary">
                      47.3 acres
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Step indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex justify-center items-center gap-4 md:gap-8">
          
          {steps.map((step, i) =>
          <div key={step.label} className="flex items-center gap-4 md:gap-8">
              <motion.div
              initial={{ scale: 0 }}
              animate={inView ? { scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.7 + i * 0.12, type: "spring" }}
              className="flex flex-col items-center gap-2">
              
                <div className="w-14 h-14 rounded-xl bg-card border border-primary/30 flex items-center justify-center">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground font-medium">{step.label}</span>
              </motion.div>
              {i < steps.length - 1 &&
            <div className="w-8 md:w-16 h-px bg-primary/30" />
            }
            </div>
          )}
        </motion.div>
      </div>
    </section>);

}