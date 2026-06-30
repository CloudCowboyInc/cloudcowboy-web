import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Mail, Calendar, Linkedin, Send, Globe } from "lucide-react";

const DEMO_LINK = "https://calendly.com/chris-cloudcowboy/30min";

export default function ContactPage() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `mailto:chris@cloudcowboy.us?subject=Contact from ${formData.name}&body=${encodeURIComponent(formData.message)}%0A%0AFrom: ${formData.name} (${formData.email})`;
  };

  return (
    <main className="relative z-10 text-foreground overflow-x-hidden">
      <Helmet>
        <title>Contact Cloud Cowboy | Talk to the Ag Service OS Team</title>
        <meta name="description" content="Get in touch with Cloud Cowboy. Book a 30-minute call to see how the ag service operating system fits your spray, seed, or custom operation." />
        <link rel="canonical" href="https://cloudcowboy.us/contact" />
        <meta property="og:title" content="Contact Cloud Cowboy" />
        <meta property="og:description" content="Book a 30-minute call to see how the ag service OS fits your operation." />
        <meta property="og:url" content="https://cloudcowboy.us/contact" />
      </Helmet>
      {/* Hero */}
      <section ref={heroRef} className="relative pt-32 pb-16 px-6">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            Let's <span className="text-gradient-primary">Talk</span>
          </motion.h1>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Mail, title: "Email", desc: "chris@cloudcowboy.us", href: "mailto:chris@cloudcowboy.us" },
            { icon: Calendar, title: "Schedule a Call", desc: "Book a 30-min call", href: DEMO_LINK },
            { icon: Linkedin, title: "LinkedIn", desc: "linkedin.com/in/chrislong3347", href: "https://linkedin.com/in/chrislong3347" },
          ].map((method, i) => (
            <motion.a
              key={method.title}
              href={method.href}
              target={method.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="bg-card border border-border rounded-xl p-8 text-center hover:border-primary/30 transition-colors block"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <method.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">{method.title}</h3>
              <p className="text-sm text-muted-foreground">{method.desc}</p>
            </motion.a>
          ))}
        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-2xl font-bold font-display text-center mb-8">Send a Message</h2>
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-8 space-y-5">
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Message</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
                placeholder="Tell us about your operation..."
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity glow-primary"
            >
              <Send className="w-4 h-4" /> Send Message
            </button>
          </form>
        </motion.div>

        {/* Calendly embed */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="max-w-4xl mx-auto mt-16">
          <h2 className="text-2xl font-bold font-display text-center mb-8">Or Schedule a Call</h2>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <iframe src={DEMO_LINK} width="100%" height="660" frameBorder="0" title="Schedule a Call" className="w-full" />
          </div>
        </motion.div>

        {/* Company info */}
        <div className="max-w-2xl mx-auto mt-16 text-center space-y-2">
          <p className="text-foreground font-display font-semibold">Cloud Cowboy LLC</p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <a href="mailto:chris@cloudcowboy.us" className="hover:text-primary transition-colors flex items-center gap-1">
              <Mail className="w-3 h-3" /> chris@cloudcowboy.us
            </a>
            <a href="https://cloudcowboy.us" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">
              <Globe className="w-3 h-3" /> cloudcowboy.us
            </a>
          </div>
        </div>
      </section>

      <div className="text-center py-12 px-6 border-t border-border/30 mt-16">
        <p className="text-sm text-muted-foreground">© 2026 Cloud Cowboy LLC · Built for the operators who feed the world.</p>
      </div>
    </main>
  );
}
