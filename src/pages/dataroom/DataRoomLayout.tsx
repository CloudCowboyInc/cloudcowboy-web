import { Helmet } from "react-helmet-async";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { LineChart, Map, Coins, Lock, LogOut, CalendarDays } from "lucide-react";
import CloudCowboyLogo from "@/components/CloudCowboyLogo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const TAGLINE = "The Ag Catalyst Through Service Instigation.";
const DEMO_CALL = "https://calendly.com/chris-cloudcowboy/30min";

const TABS = [
  { to: "/portal/market", label: "Market", icon: Map },
  { to: "/portal/gtm", label: "Go-To-Market", icon: LineChart },
  { to: "/portal/finance", label: "Finance", icon: Coins },
] as const;

/**
 * Investor data-room shell. Lives behind the investor guard. Provides the
 * on-brand header (logo + tagline), the Market · Go-To-Market · Finance tab
 * nav with an animated active indicator, and renders the active page via
 * <Outlet/>.
 */
export default function DataRoomLayout() {
  const { email, signOut } = useAuth();
  const { pathname } = useLocation();

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 pb-24 pt-24 md:px-8 md:pt-28">
      <Helmet>
        <title>Investor Data Room · Cloud Cowboy</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      {/* Header */}
      <header className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <CloudCowboyLogo size={48} />
            <div>
              <div className="mb-0.5 flex items-center gap-2 text-xs uppercase tracking-wide text-primary">
                <Lock className="h-3.5 w-3.5" /> Private · Investor data room
              </div>
              <h1 className="font-display text-2xl font-bold leading-tight md:text-3xl">
                <span className="text-gradient-primary">Cloud Cowboy</span> Data Room
              </h1>
              <p className="mt-0.5 text-sm italic text-muted-foreground">{TAGLINE}</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            {email && (
              <span className="text-xs text-muted-foreground">Signed in as {email}</span>
            )}
            <Button variant="outline" size="sm" onClick={() => signOut()} className="gap-1">
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Tab nav */}
      <nav
        aria-label="Data room sections"
        className="mb-8 flex flex-wrap gap-1 border-b border-border/60"
      >
        {TABS.map((tab) => {
          const active = pathname === tab.to || pathname.startsWith(tab.to + "/");
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={cn(
                "relative flex items-center gap-2 rounded-t-md px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <tab.icon className="h-4 w-4" aria-hidden />
              {tab.label}
              {active && (
                <motion.span
                  layoutId="dataroom-active-tab"
                  className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Active page */}
      <main>
        <Outlet />
      </main>

      {/* Want to talk? — migrated from the old portal landing; available everywhere. */}
      <Card className="mt-10 flex flex-wrap items-center justify-between gap-4 border-primary/30 bg-primary/5 p-6">
        <div>
          <h3 className="font-display text-lg font-semibold">Want to talk?</h3>
          <p className="text-sm text-muted-foreground">Book 30 minutes with the founder.</p>
        </div>
        <Button asChild className="gap-1.5">
          <a href={DEMO_CALL} target="_blank" rel="noreferrer">
            <CalendarDays className="h-4 w-4" /> Schedule a call
          </a>
        </Button>
      </Card>
    </div>
  );
}
