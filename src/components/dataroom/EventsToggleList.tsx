import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import ToggleRow from "./ToggleRow";
import StatTile from "./StatTile";
import { EVENT_SHOWS, EVENTS_BASE_ANNUAL_DEFAULT } from "@/lib/model/data";
import { useModel } from "@/lib/model/store";
import { compactUSD, signedCompactUSD } from "@/lib/model/format";
import { cn } from "@/lib/utils";
import type { EventTier } from "@/lib/model/types";

const TIER_STYLE: Record<EventTier, string> = {
  Top: "bg-primary/20 text-primary",
  Strong: "bg-secondary/20 text-secondary",
  Optional: "bg-muted text-muted-foreground",
};

/**
 * The 18-show event circuit (§3.6). Each Y/N toggle writes to the shared store;
 * eventsBaseAnnual recomputes → the whole proforma updates live.
 */
export default function EventsToggleList() {
  const { eventToggles, actions } = useModel();
  const included = EVENT_SHOWS.filter((e) => eventToggles[e.id]);
  const circuitTotal = included.reduce((s, e) => s + e.cost, 0);
  const deltaToFinance = circuitTotal - EVENTS_BASE_ANNUAL_DEFAULT;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <StatTile
          label="Shows included"
          value={`${included.length} / ${EVENT_SHOWS.length}`}
          icon={CalendarDays}
        />
        <StatTile label="Included circuit total" value={compactUSD(circuitTotal)} hint="per year (base year factor 1.0)" />
        <StatTile
          label="Δ to finance vs base"
          value={signedCompactUSD(deltaToFinance)}
          accent={deltaToFinance === 0 ? undefined : deltaToFinance < 0 ? "hsl(var(--secondary))" : "hsl(var(--destructive))"}
        />
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => EVENT_SHOWS.forEach((e) => actions.toggleEvent(e.id, true))}
        >
          Include all
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => EVENT_SHOWS.forEach((e) => actions.toggleEvent(e.id, false))}
        >
          Exclude all
        </Button>
      </div>

      <div className="space-y-2">
        {EVENT_SHOWS.map((e) => (
          <ToggleRow
            key={e.id}
            label={e.name}
            checked={!!eventToggles[e.id]}
            onCheckedChange={(v) => actions.toggleEvent(e.id, v)}
            meta={
              <>
                <span className={cn("rounded px-1.5 py-0.5 text-[11px] font-semibold", TIER_STYLE[e.tier])}>
                  {e.tier}
                </span>
                <span className="w-10 text-right text-muted-foreground">{e.month}</span>
                <span className="w-16 text-right font-medium tabular-nums">{compactUSD(e.cost)}</span>
              </>
            }
          />
        ))}
      </div>
    </div>
  );
}
