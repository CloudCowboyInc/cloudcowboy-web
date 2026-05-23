import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Gift, Tag, MessageSquare, Trophy, CalendarCheck, Settings, Rocket } from "lucide-react";
import Navbar from "@/components/Navbar";

const DEMO_LINK = "https://calendly.com/chris-cloudcowboy/30min";

export default function BetaPage() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const whatRef = useRef(null);
  const whatInView = useInView(whatRef, { once: true, margin: "-100px" });
  const howRef = useRef(null);
  const howInView = useInView(howRef, { once: true, margin: "-100px" });
  const lookingRef = useRef(null);
  const lookingInView = useInView(lookingRef, { once: true, margin: "-100px" });
  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  return (
    <main className="bg-background text-foreground overflow-x-hidden">
      <Helmet>
        <title>Beta Program | Cloud Cowboy — Free Access for Ag Service Operators</title>
        <meta name="description" content="Join the Cloud Cowboy beta and get free access to the ag service operating system built for spray, seed, and custom operators. Lock in founder pricing and shape the platform." />
        <link rel="canonical" href="https://cloudcowboy.us/beta" />
        <meta property="og:title" content="Cloud Cowboy Beta — Free Access for Ag Service Operators" />
        <meta property="og:description" content="Free beta access to the ag service operating system. Lock in founder pricing and help shape the platform." />
        <meta property="og:url" content="https://cloudcowboy.us/beta" />
      </Helmet>
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-[70vh] flex items-center justify-center pt-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.p initial={{ opacity: 0 }} animate={heroInView ? { opacity: 1 } : {}} className="text-primary text-sm tracking-[0.3em] uppercase mb-6">Beta Program</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.1 }} className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            Be First. <span className="text-gradient-primary">Shape the Future.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join the Cloud Cowboy beta program and get free access to the platform that will transform your business.
          </motion.p>
        </div>
      </section>

      {/* What You Get */}
      <section ref={whatRef} className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={whatInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="text-3xl md:text-5xl font-bold text-center mb-16">
            What You <span className="text-gradient-primary">Get</span>
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Gift, title: "Free Access", desc: "Full platform access during beta. No credit card required. No commitment." },
              { icon: Tag, title: "Founder Pricing", desc: "Lock in the lowest price tier forever when we launch. Beta testers get grandfathered rates." },
              { icon: MessageSquare, title: "Shape the Product", desc: "Direct line to our dev team. Your feedback builds the features YOU actually need." },
              { icon: Trophy, title: "Be First in Your Market", desc: "While competitors figure out spreadsheets, you'll have a command center." },
            ].map((card, i) => (
              <motion.div key={card.title} initial={{ opacity: 0, y: 30 }} animate={whatInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 + i * 0.1 }}
                className="bg-card border border-border rounded-xl p-8 flex gap-5 items-start hover:border-primary/30 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <card.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section ref={howRef} className="py-28 px-6 relative">
        <div className="absolute inset-0 bg-topo-pattern opacity-30" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={howInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="text-3xl md:text-5xl font-bold text-center mb-16">
            How It <span className="text-gradient-primary">Works</span>
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: CalendarCheck, step: "1", title: "Book a Call", desc: "30-minute walkthrough of the platform. We learn about your operation." },
              { icon: Settings, step: "2", title: "Get Set Up", desc: "We install the free quoting widget on your website. Takes 15 minutes." },
              { icon: Rocket, step: "3", title: "Start Winning", desc: "Watch quotes come in automatically. Track jobs. See your data come alive." },
            ].map((item, i) => (
              <motion.div key={item.step} initial={{ opacity: 0, y: 30 }} animate={howInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 + i * 0.15 }} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-5">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="text-xs text-primary font-semibold tracking-widest mb-2">STEP {item.step}</div>
                <h3 className="font-display font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What We're Looking For */}
      <section ref={lookingRef} className="py-28 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={lookingInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="text-3xl md:text-5xl font-bold mb-8">
            What We're <span className="text-gradient-primary">Looking For</span>
          </motion.h2>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={lookingInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.15 }}
            className="bg-card border border-primary/20 rounded-2xl p-10" style={{ boxShadow: `0 0 40px hsl(var(--primary) / 0.08)` }}>
            <p className="text-lg text-foreground/90 leading-relaxed">
              We want <span className="text-primary font-semibold">10 drone spray operators</span> who are tired of running their business on texts and spreadsheets. If you operate DJI Agras or similar spray drones and want to 10x your quoting speed, we want to talk.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA with Calendly */}
      <section ref={ctaRef} className="py-28 px-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 blur-[120px] rounded-full" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={ctaInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="text-3xl md:text-5xl font-bold mb-4">
            Apply for the <span className="text-gradient-primary">Beta</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={ctaInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }} className="text-muted-foreground text-lg mb-8">
            Book a call and let's get your operation set up
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={ctaInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-2xl overflow-hidden">
            <iframe src={DEMO_LINK} width="100%" height="660" frameBorder="0" title="Apply for Beta" className="w-full" />
          </motion.div>
        </div>
      </section>

      <div className="text-center py-12 px-6 border-t border-border/30">
        <p className="text-sm text-muted-foreground">© 2026 Cloud Cowboy LLC · <a href="mailto:chris@cloudcowboy.us" className="hover:text-primary transition-colors">chris@cloudcowboy.us</a></p>
      </div>
    </main>
  );
}
