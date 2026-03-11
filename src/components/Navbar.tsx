import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import CloudCowboyLogo from "./CloudCowboyLogo";

const DEMO_LINK = "https://calendly.com/chris-cloudcowboy/30min";

const navLinks = [
{ label: "Investors", to: "/investors" },
{ label: "Beta Program", to: "/beta" },
  { label: "Contact", to: "/contact" }];


export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen ?
        "bg-background/90 backdrop-blur-xl border-b border-border/50" :
        "bg-transparent"}`
        }>
        
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <CloudCowboyLogo size={36} />
            <span className="text-xl font-display font-bold text-primary">Cloud Cowboy</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === link.to ? "text-primary" : "text-muted-foreground"}`
              }>
              
                {link.label}
              </Link>
            )}
            <a
              href={DEMO_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
              
              Learn More 
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu">
            
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen &&
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/50 px-6 py-6 flex flex-col gap-4 md:hidden">
          
            {navLinks.map((link) =>
          <Link
            key={link.to}
            to={link.to}
            className={`text-base font-medium py-2 transition-colors hover:text-primary ${
            location.pathname === link.to ? "text-primary" : "text-muted-foreground"}`
            }>
            
                {link.label}
              </Link>
          )}
            <a
            href={DEMO_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm text-center hover:opacity-90 transition-opacity mt-2">
            
              Book a Demo
            </a>
          </motion.div>
        }
      </AnimatePresence>
    </>);

}