import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FileSignature, Shield, Bell } from "lucide-react";

export default function ContractSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-32 px-6 relative" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="text-primary text-sm tracking-[0.3em] uppercase mb-4 text-center"
        >
          Step 2
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-3xl md:text-5xl font-bold text-center mb-6"
        >
          Signed, Sealed, Funded —{" "}
          <span className="text-gradient-primary">In 5 Minutes</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-muted-foreground text-lg text-center max-w-2xl mx-auto mb-16"
        >
          DocuSign integration auto-generates the contract. Customer signs digitally and puts down a credit card deposit. You get notified instantly.
        </motion.p>

        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          {/* Contract visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative"
          >
            <div className="bg-card border border-border rounded-2xl p-8 relative">
              <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground text-xs px-3 py-1.5 rounded-full font-medium glow-primary">
                Auto-Generated
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <FileSignature className="w-6 h-6 text-primary" />
                  <span className="font-display font-bold text-lg">Service Agreement</span>
                </div>

                <div className="space-y-3">
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-5/6" />
                  <div className="h-3 bg-muted rounded w-4/6" />
                </div>

                <div className="border-t border-border pt-4 mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Service</span>
                    <span>Herbicide Application</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Acreage</span>
                    <span>47.3 acres</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-muted-foreground">Total</span>
                    <span className="text-primary">$938.00</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-32 border-b-2 border-primary/40 pb-1">
                      <span className="text-primary/70 italic text-sm font-medium">J. Smith</span>
                    </div>
                    <Shield className="w-4 h-4 text-secondary" />
                    <span className="text-xs text-secondary">DocuSign Verified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Flow line */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={inView ? { scaleY: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="absolute -bottom-8 left-1/2 w-px h-8 bg-primary/30 origin-top"
            />
          </motion.div>

          {/* Stats and features */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="space-y-8"
          >
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="text-5xl font-bold text-gradient-primary mb-2">{"< 5 min"}</div>
              <p className="text-muted-foreground">From website visit to signed contract with deposit</p>
            </div>

            <div className="space-y-4">
              {[
                { icon: FileSignature, text: "DocuSign e-signature built in" },
                { icon: Shield, text: "Secure credit card deposit collection" },
                { icon: Bell, text: "Instant operator notifications" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground/80">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
