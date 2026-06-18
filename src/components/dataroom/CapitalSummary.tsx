import { useModel } from "@/lib/model/store";
import { EVENT_SHOWS, ORG_MEMBERSHIPS } from "@/lib/model/data";
import { EVENT_DETAILS, EVENT_BUDGET } from "@/data/eventsData";
import { usd } from "@/lib/model/format";
import type { EventTier } from "@/lib/model/types";
import { cn } from "@/lib/utils";

const CONTINGENCY = 0.1; // proforma Capital Summary
const ONE_TIME = [
  { label: "Wrapped truck (wrap + branding)", cost: 60000 },
  { label: "Equipment trailer (haul booth + gear)", cost: 15000 },
  { label: "Merch / giveaways (swag, samples)", cost: 15000 },
  { label: "Booth build / modular display", cost: 30000 },
];

const TIER_STYLE: Record<EventTier, string> = {
  Top: "text-primary",
  Strong: "text-secondary",
  Optional: "text-muted-foreground",
};

/**
 * Year-1 go-to-market capital summary — mirrors the proforma's "5. Capital
 * Summary" tab. Live by the Events/Orgs toggles: event cost components, the
 * memberships subtotal, one-time launch capital, a 10% contingency, the grand
 * total, and event spend by priority tier.
 */
export default function CapitalSummary() {
  const { eventToggles, orgToggles } = useModel();
  const inc = EVENT_SHOWS.filter((e) => eventToggles[e.id]);

  let booth = 0, mileage = 0, lodging = 0, perDiem = 0;
  for (const e of inc) {
    const d = EVENT_DETAILS[e.id];
    if (!d) continue;
    booth += d.booth;
    mileage += Math.round(d.miles * EVENT_BUDGET.mileRate);
    lodging += d.nights * EVENT_BUDGET.rooms * EVENT_BUDGET.roomNight;
    perDiem += d.days * EVENT_BUDGET.people * EVENT_BUDGET.perDiem;
  }
  const eventsSubtotal = booth + mileage + lodging + perDiem;
  const membershipsSubtotal = ORG_MEMBERSHIPS.filter((o) => orgToggles[o.id]).reduce((s, o) => s + o.dues, 0);
  const oneTime = ONE_TIME.reduce((s, x) => s + x.cost, 0);
  const contingency = Math.round((eventsSubtotal + membershipsSubtotal + oneTime) * CONTINGENCY);
  const grand = eventsSubtotal + membershipsSubtotal + oneTime + contingency;

  const tiers = (["Top", "Strong", "Optional"] as EventTier[]).map((t) => {
    const list = inc.filter((e) => e.tier === t);
    return { tier: t, count: list.length, total: list.reduce((s, e) => s + e.cost, 0) };
  });

  const Line = ({ label, value, bold }: { label: string; value: number; bold?: boolean }) => (
    <div className={cn("flex items-center justify-between text-sm", bold && "font-semibold text-foreground")}>
      <span className={bold ? "" : "text-muted-foreground"}>{label}</span>
      <span className="tabular-nums">{usd(value)}</span>
    </div>
  );

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-lg border border-border/60 bg-card/40 p-4">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">Year-1 go-to-market capital</div>
        <div className="space-y-1.5">
          <Line label="Booth / registration" value={booth} />
          <Line label="Mileage (driving)" value={mileage} />
          <Line label="Lodging" value={lodging} />
          <Line label="Per diem (meals)" value={perDiem} />
          <div className="border-t border-border/50 pt-1.5"><Line label="Events subtotal" value={eventsSubtotal} bold /></div>
          <Line label="Memberships & dues" value={membershipsSubtotal} />
          {ONE_TIME.map((x) => <Line key={x.label} label={x.label} value={x.cost} />)}
          <Line label="One-time / capital subtotal" value={oneTime} bold />
          <Line label={`Contingency (${Math.round(CONTINGENCY * 100)}%)`} value={contingency} />
          <div className="mt-1 border-t-2 border-border pt-2">
            <div className="flex items-center justify-between">
              <span className="font-display text-base font-bold">Grand total · Year 1</span>
              <span className="font-display text-base font-bold tabular-nums">{usd(grand)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border/60 bg-card/40 p-4">
        <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary">Event spend by priority tier</div>
        <div className="space-y-3">
          {tiers.map((t) => {
            const max = Math.max(...tiers.map((x) => x.total), 1);
            return (
              <div key={t.tier}>
                <div className="mb-0.5 flex items-center justify-between text-sm">
                  <span className={cn("font-medium", TIER_STYLE[t.tier])}>{t.tier} · {t.count} events</span>
                  <span className="tabular-nums">{usd(t.total)}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${(t.total / max) * 100}%` }} />
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-[11px] text-muted-foreground">
          Full-send drives 3 people to every booth event; long hauls (Savannah, New Orleans, Miami)
          are modeled as multi-day drives — flying may be cheaper there. Booth/reg figures pending
          confirmation. Toggle any event or membership to update the totals.
        </p>
      </div>
    </div>
  );
}
