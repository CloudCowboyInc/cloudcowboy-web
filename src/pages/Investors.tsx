import { motion, useInView, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { TrendingUp, Zap, Server, Brain, ArrowRight, DollarSign, BarChart3, Users, Target, Briefcase } from "lucide-react";

const DEMO_LINK = "https://calendly.com/chris-cloudcowboy/30min";

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

export default function InvestorsPage() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const marketRef = useRef(null);
  const marketInView = useInView(marketRef, { once: true, margin: "-100px" });
  const whyRef = useRef(null);
  const whyInView = useInView(whyRef, { once: true, margin: "-100px" });
  const unitRef = useRef(null);
  const unitInView = useInView(unitRef, { once: true, margin: "-100px" });
  const askRef = useRef(null);
  const askInView = useInView(askRef, { once: true, margin: "-100px" });
  const founderRef = useRef(null);
  const founderInView = useInView(founderRef, { once: true, margin: "-100px" });
  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  return (
    <main className="relative z-10 text-foreground overflow-x-hidden">
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-[80vh] flex items-center justify-center pt-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.p initial={{ opacity: 0 }} animate={heroInView ? { opacity: 1 } : {}} className="text-primary text-sm tracking-[0.3em] uppercase mb-6">
            Investor Relations
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.1 }} className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            The Ground Floor of{" "}<span className="text-gradient-primary">Agricultural Intelligence</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Pre-seed investment opportunity in the operating system for chemical application
          </motion.p>
        </div>
      </section>

      {/* Market Opportunity */}
      <section ref={marketRef} className="py-28 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={marketInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="text-3xl md:text-5xl font-bold text-center mb-16">
            The Market <span className="text-gradient-primary">Opportunity</span>
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={marketInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-2xl p-8 text-center">
              <div className="text-4xl md:text-5xl font-bold font-display text-primary mb-2">
                <AnimatedCounter target={1710} inView={marketInView} />
                <span className="text-muted-foreground text-lg"> → </span>
                <AnimatedCounter target={4913} inView={marketInView} />
              </div>
              <p className="text-sm text-muted-foreground mt-3">FAA Part 137 spray drone operators: 122 in 2023, 1,710 today, projected 4,913 by 2030</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={marketInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }} className="bg-card border border-border rounded-2xl p-8 text-center">
              <div className="text-4xl md:text-5xl font-bold font-display text-secondary mb-2">
                $<AnimatedCounter target={506} inView={marketInView} />M
              </div>
              <p className="text-sm text-muted-foreground mt-3">Market in 2024, growing 23.5% CAGR</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={marketInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 }} className="bg-card border border-border rounded-2xl p-8 text-center">
              <div className="text-4xl md:text-5xl font-bold font-display text-primary mb-2">0%</div>
              <p className="text-sm text-muted-foreground mt-3">Software penetration — no one owns this category yet</p>
            </motion.div>
          </div>

          {/* Growth chart mockup */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={marketInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4 }} className="bg-card border border-border rounded-2xl p-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Operator Growth Projection (2023–2030)</span>
            </div>
            <div className="h-40 flex items-end gap-2">
              {[122, 400, 850, 1710, 2400, 3200, 4100, 4913].map((val, i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-t-sm"
                  initial={{ height: 0 }}
                  animate={marketInView ? { height: `${(val / 5200) * 100}%` } : {}}
                  transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
                  style={{ background: `linear-gradient(to top, hsl(var(--primary)), hsl(var(--primary) / 0.3))`, boxShadow: `0 0 10px hsl(var(--primary) / 0.3)` }}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>2023</span><span>2024</span><span>2025</span><span>2026</span><span>2027</span><span>2028</span><span>2029</span><span>2030</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Cloud Cowboy Wins */}
      <section ref={whyRef} className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={whyInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="text-3xl md:text-5xl font-bold text-center mb-16">
            Why Cloud Cowboy <span className="text-gradient-primary">Wins</span>
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: "Free Widget Wedge", desc: "Install on operator websites for free. Customers click a map, get AI-powered instant quotes, sign via DocuSign, pay deposit. Cloud Cowboy takes 8–18% of every contract. Turns a 3-hour sales process into 5 minutes." },
              { icon: Server, title: "SaaS Expansion", desc: "$500/month operations platform with crew management, GPS tracking, job scheduling, chemical logging. 84.6% gross margins." },
              { icon: Brain, title: "Data Moat", desc: "Every transaction builds proprietary pricing intelligence. Network effects make the platform smarter with every operator added. Defensible and compounding." },
            ].map((card, i) => (
              <motion.div key={card.title} initial={{ opacity: 0, y: 30 }} animate={whyInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 + i * 0.15 }}
                className="bg-card border border-border rounded-2xl p-8 hover:border-primary/30 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                  <card.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-bold text-xl mb-3">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Unit Economics */}
      <section ref={unitRef} className="py-28 px-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-secondary/5 blur-[120px] rounded-full" />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={unitInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="text-3xl md:text-5xl font-bold text-center mb-16">
            Unit <span className="text-gradient-secondary">Economics</span>
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: "LTV:CAC Ratio", value: "99:1" },
              { label: "CAC Payback", value: "< 1 mo" },
              { label: "Revenue / Operator", value: "$78K" },
              { label: "Gross Margin", value: "84.6%" },
              { label: "Year 3 ARR", value: "$5.2M" },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={unitInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 + i * 0.1 }}
                className="bg-card border border-border rounded-xl p-6 text-center">
                <div className="text-2xl md:text-3xl font-bold font-display text-primary mb-2">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
          <motion.p initial={{ opacity: 0 }} animate={unitInView ? { opacity: 0.6 } : {}} transition={{ delay: 0.6 }} className="text-center text-sm text-muted-foreground mt-4">
            Year 3 target: 65 operators generating $5.2M ARR
          </motion.p>
        </div>
      </section>

      {/* The Ask */}
      <section ref={askRef} className="py-28 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={askInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="text-3xl md:text-5xl font-bold mb-6">
            The <span className="text-gradient-primary">Ask</span>
          </motion.h2>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={askInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.15 }}
            className="bg-card border border-primary/30 rounded-2xl p-10" style={{ boxShadow: `0 0 40px hsl(var(--primary) / 0.1)` }}>
            <div className="text-5xl md:text-6xl font-bold font-display text-primary mb-4">$500K</div>
            <div className="text-xl font-display font-semibold mb-4">Pre-Seed Round</div>
            <p className="text-muted-foreground leading-relaxed">
              Build MVP widget, acquire first 8 operators, prove unit economics. Target: 10+ operators and $50K+ MRR within 12 months.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Meet the Founder */}
      <section ref={founderRef} className="py-28 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={founderInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="text-3xl md:text-5xl font-bold text-center mb-12">
            Meet the <span className="text-gradient-primary">Founder</span>
          </motion.h2>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={founderInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.15 }} className="bg-card border border-border rounded-2xl p-10 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-primary" />
            </div>
            <h3 className="font-display font-bold text-2xl mb-1">Chris Long</h3>
            <p className="text-primary text-sm mb-4">Founder & CEO</p>
            <p className="text-muted-foreground leading-relaxed">
              Background in agricultural technology and SaaS operations. Building Cloud Cowboy to bring intelligence to an industry that still runs on handshakes and spreadsheets.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA with Calendly */}
      <section ref={ctaRef} className="py-28 px-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 blur-[120px] rounded-full" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={ctaInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="text-3xl md:text-5xl font-bold mb-4">
            Ready to <span className="text-gradient-primary">Talk?</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={ctaInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }} className="text-muted-foreground text-lg mb-8">
            Schedule a 30-minute investor call with Chris
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={ctaInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-2xl overflow-hidden mb-8">
            <iframe
              src="https://calendly.com/chris-cloudcowboy/30min"
              width="100%"
              height="660"
              frameBorder="0"
              title="Schedule Investor Call"
              className="w-full"
            />
          </motion.div>

          <motion.a initial={{ opacity: 0 }} animate={ctaInView ? { opacity: 1 } : {}} transition={{ delay: 0.4 }}
            href="#" className="inline-flex items-center gap-2 px-8 py-4 rounded-lg border border-primary/40 text-foreground font-semibold hover:border-primary/70 transition-colors">
            Download Pitch Deck <ArrowRight className="w-4 h-4" />
          </motion.a>
        </div>
      </section>

      {/* Footer */}
      <div className="text-center py-12 px-6 border-t border-border/30">
        <p className="text-sm text-muted-foreground">© 2026 Cloud Cowboy LLC · <a href="mailto:chris@cloudcowboy.us" className="hover:text-primary transition-colors">chris@cloudcowboy.us</a></p>
      </div>
    </main>
  );
}
