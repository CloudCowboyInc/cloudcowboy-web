import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, BarChart3, Cpu, CalendarDays, LogOut, Lock, ArrowRight } from "lucide-react";

const DEMO_CALL = "https://calendly.com/chris-cloudcowboy/30min";

const materials = [
  { icon: FileText, title: "Executive Overview", desc: "The opportunity, market, and thesis in brief.", status: "Available on request" },
  { icon: BarChart3, title: "Financial Model", desc: "Unit economics, projections, and assumptions.", status: "Available on request" },
  { icon: Cpu, title: "Technical Architecture", desc: "How the AI-native platform is built to scale.", status: "Available on request" },
];

export default function InvestorPortal() {
  const { email, signOut } = useAuth();
  return (
    <div className="relative z-10 mx-auto max-w-4xl px-4 pb-24 pt-28 md:px-8">
      <Helmet><title>Investor Portal · Cloud Cowboy</title><meta name="robots" content="noindex" /></Helmet>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wide text-primary">
            <Lock className="h-3.5 w-3.5" /> Private · Investor access
          </div>
          <h1 className="font-display text-3xl font-bold md:text-4xl">
            <span className="text-gradient-primary">Investor</span> Portal
          </h1>
          {email && <p className="mt-1 text-sm text-muted-foreground">Signed in as {email}</p>}
        </div>
        <Button variant="outline" size="sm" onClick={() => signOut()} className="gap-1">
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </div>

      <p className="mb-8 max-w-2xl text-muted-foreground">
        Welcome. Below are Cloud Cowboy's investor materials. We're actively
        raising to build the AI-native operating system for the spray-drone
        services industry — thank you for taking a look.
      </p>

      <Card className="mb-6 flex flex-wrap items-center justify-between gap-4 border-primary/40 bg-primary/10 p-6">
        <div>
          <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wide text-primary">
            <BarChart3 className="h-3.5 w-3.5" /> Live · Interactive
          </div>
          <h3 className="font-display text-xl font-semibold">Enter the data room</h3>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Market sizing, go-to-market, and a fully interactive financial model —
            change any assumption and the proforma recomputes live.
          </p>
        </div>
        <Button asChild size="lg" className="gap-1.5">
          <Link to="/portal/market">
            Open data room <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        {materials.map((m) => (
          <Card key={m.title} className="flex flex-col border-border/60 bg-card/60 p-5">
            <m.icon className="mb-3 h-7 w-7 text-primary" />
            <h3 className="font-display text-lg font-semibold">{m.title}</h3>
            <p className="mt-1 flex-1 text-sm text-muted-foreground">{m.desc}</p>
            <div className="mt-4 text-xs font-medium text-secondary">{m.status}</div>
          </Card>
        ))}
      </div>

      <Card className="mt-6 flex flex-wrap items-center justify-between gap-4 border-primary/30 bg-primary/5 p-6">
        <div>
          <h3 className="font-display text-lg font-semibold">Want to talk?</h3>
          <p className="text-sm text-muted-foreground">Book 30 minutes with the founder.</p>
        </div>
        <Button asChild className="gap-1">
          <a href={DEMO_CALL} target="_blank" rel="noreferrer">
            <CalendarDays className="h-4 w-4" /> Schedule a call
          </a>
        </Button>
      </Card>

      <p className="mt-6 text-xs text-muted-foreground">
        Materials are confidential and provided for evaluation only. To receive a
        document, reach out to chris@cloudcowboy.us.
      </p>
    </div>
  );
}
