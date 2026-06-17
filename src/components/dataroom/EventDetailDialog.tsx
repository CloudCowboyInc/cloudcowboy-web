import { type ReactNode } from "react";
import { CalendarDays, MapPin, ExternalLink, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EVENTS_BASE_ANNUAL_DEFAULT } from "@/lib/model/data";
import { usd } from "@/lib/model/format";
import {
  EVENT_DETAILS,
  priceBreakdown,
  formatRange,
  SIX_YEAR_EVENT_MULTIPLIER,
} from "@/data/eventsData";
import { cn } from "@/lib/utils";
import type { EventShow, EventTier } from "@/lib/model/types";

const TIER_STYLE: Record<EventTier, string> = {
  Top: "bg-primary/20 text-primary",
  Strong: "bg-secondary/20 text-secondary",
  Optional: "bg-muted text-muted-foreground",
};

export default function EventDetailDialog({
  event,
  children,
}: {
  event: EventShow;
  children: ReactNode;
}) {
  const d = EVENT_DETAILS[event.id];
  const breakdown = priceBreakdown(event.cost);
  const sixYear = Math.round(event.cost * SIX_YEAR_EVENT_MULTIPLIER);
  const share = ((event.cost / EVENTS_BASE_ANNUAL_DEFAULT) * 100).toFixed(1);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex flex-wrap items-center gap-2 font-display text-xl">
            {event.name}
            <span className={cn("rounded px-1.5 py-0.5 text-[11px] font-semibold", TIER_STYLE[event.tier])}>
              {event.tier}
            </span>
          </DialogTitle>
        </DialogHeader>

        {d && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-primary" />
              {formatRange(d.start, d.end)}
              {!d.dateConfirmed && (
                <span className="rounded bg-muted px-1 text-[10px] uppercase tracking-wide">est.</span>
              )}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4" /> {d.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Plane className="h-4 w-4" /> +{d.travelDays} travel day{d.travelDays > 1 ? "s" : ""} each side
            </span>
          </div>
        )}

        {d && <p className="text-sm leading-relaxed text-foreground/90">{d.description}</p>}

        {/* Financial implications */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { k: "Show cost", v: usd(event.cost) },
            { k: "Share of circuit", v: `${share}%` },
            { k: "~6-yr footprint", v: usd(sixYear) },
          ].map((s) => (
            <div key={s.k} className="rounded-lg border border-border/60 bg-card/50 p-2.5">
              <div className="font-display text-base font-bold">{s.v}</div>
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{s.k}</div>
            </div>
          ))}
        </div>

        {/* Price breakdown */}
        <div className="rounded-lg border border-border/50 bg-background/40 p-3">
          <div className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Cost breakdown — estimated allocation
          </div>
          <div className="space-y-1.5">
            {breakdown.map((b) => (
              <div key={b.label} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{b.label}</span>
                <span className="tabular-nums">{usd(b.amount)}</span>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-border/50 pt-1.5 text-sm font-semibold">
              <span>Total</span>
              <span className="tabular-nums">{usd(event.cost)}</span>
            </div>
          </div>
        </div>

        {d?.signupUrl && (
          <Button asChild className="w-full gap-1.5">
            <a href={d.signupUrl} target="_blank" rel="noreferrer">
              Sign up / register <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}
        <p className="text-[11px] text-muted-foreground">
          Cost breakdown is an estimated allocation of the budgeted total. Dates marked “est.” are
          scheduled to the typical window and should be confirmed with the organizer.
        </p>
      </DialogContent>
    </Dialog>
  );
}
