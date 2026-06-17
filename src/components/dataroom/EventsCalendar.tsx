import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import EventDetailDialog from "./EventDetailDialog";
import { EVENT_SHOWS } from "@/lib/model/data";
import { compactUSD } from "@/lib/model/format";
import { EVENT_DETAILS, parseISO, formatRange, MONTHS_SHORT } from "@/data/eventsData";
import { cn } from "@/lib/utils";
import type { EventShow, EventTier } from "@/lib/model/types";

const TIER_COLOR: Record<EventTier, string> = {
  Top: "hsl(var(--primary))",
  Strong: "hsl(var(--secondary))",
  Optional: "hsl(var(--muted-foreground))",
};
const TIER_BADGE: Record<EventTier, string> = {
  Top: "bg-primary/20 text-primary",
  Strong: "bg-secondary/20 text-secondary",
  Optional: "bg-muted text-muted-foreground",
};

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

type DayHit = { event: EventShow; type: "show" | "travel" };

const keyOf = (y: number, m: number, d: number) => `${y}-${m}-${d}`;
const addDays = (d: Date, n: number) => {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
};

/**
 * Calendar view of the event circuit — one month at a time, colour-coded by
 * priority with travel days. Click any event (in the grid or the list below)
 * for full detail: cost breakdown, dates, and a link to the event's website.
 */
export default function EventsCalendar({
  includedIds,
}: {
  includedIds: Record<string, boolean>;
}) {
  const { byDay, months } = useMemo(() => {
    const map = new Map<string, DayHit[]>();
    let min: Date | null = null;
    let max: Date | null = null;
    for (const e of EVENT_SHOWS) {
      const d = EVENT_DETAILS[e.id];
      if (!d) continue;
      const start = parseISO(d.start);
      const end = parseISO(d.end);
      const first = addDays(start, -d.travelDays);
      const last = addDays(end, d.travelDays);
      for (let day = new Date(first); day <= last; day = addDays(day, 1)) {
        const isShow = day >= start && day <= end;
        const k = keyOf(day.getFullYear(), day.getMonth(), day.getDate());
        if (!map.has(k)) map.set(k, []);
        map.get(k)!.push({ event: e, type: isShow ? "show" : "travel" });
        if (!min || day < min) min = new Date(day);
        if (!max || day > max) max = new Date(day);
      }
    }
    const monthList: { y: number; m: number }[] = [];
    if (min && max) {
      const cur = new Date(min.getFullYear(), min.getMonth(), 1);
      const stop = new Date(max.getFullYear(), max.getMonth(), 1);
      while (cur <= stop) {
        monthList.push({ y: cur.getFullYear(), m: cur.getMonth() });
        cur.setMonth(cur.getMonth() + 1);
      }
    }
    return { byDay: map, months: monthList };
  }, []);

  const [idx, setIdx] = useState(0);
  if (months.length === 0) return null;
  const { y, m } = months[Math.min(idx, months.length - 1)];

  const firstWeekday = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Events whose show dates fall in (overlap) the displayed month, for the list.
  const monthEvents = EVENT_SHOWS.filter((e) => {
    const d = EVENT_DETAILS[e.id];
    if (!d) return false;
    const s = parseISO(d.start);
    const en = parseISO(d.end);
    const inMonth = (dt: Date) => dt.getFullYear() === y && dt.getMonth() === m;
    return inMonth(s) || inMonth(en) || (s < new Date(y, m, 1) && en > new Date(y, m + 1, 0));
  }).sort((a, b) => parseISO(EVENT_DETAILS[a.id].start).getTime() - parseISO(EVENT_DETAILS[b.id].start).getTime());

  return (
    <div>
      {/* Legend */}
      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        {(["Top", "Strong", "Optional"] as EventTier[]).map((t) => (
          <span key={t} className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-3 rounded-sm" style={{ background: TIER_COLOR[t] }} /> {t} priority
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-3 rounded-sm border border-dashed border-muted-foreground/60 bg-muted/40" /> Travel day
        </span>
      </div>

      {/* Month navigation */}
      <div className="mb-3 flex items-center justify-between">
        <Button variant="outline" size="sm" className="gap-1" onClick={() => setIdx((i) => Math.max(0, i - 1))} disabled={idx === 0}>
          <ChevronLeft className="h-4 w-4" /> Prev
        </Button>
        <div className="font-display text-lg font-bold">{MONTHS_SHORT[m]} {y}</div>
        <Button variant="outline" size="sm" className="gap-1" onClick={() => setIdx((i) => Math.min(months.length - 1, i + 1))} disabled={idx >= months.length - 1}>
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Single-month grid */}
      <div className="rounded-lg border border-border/60 bg-card/40 p-3">
        <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[11px] text-muted-foreground">
          {WEEKDAYS.map((w) => <div key={w}>{w}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (day === null) return <div key={`b-${i}`} />;
            const hits = byDay.get(keyOf(y, m, day)) ?? [];
            return (
              <div
                key={day}
                className={cn("min-h-[64px] rounded border border-border/40 p-1 text-[11px]", hits.length > 0 ? "bg-background/40" : "bg-transparent")}
              >
                <div className="mb-1 text-muted-foreground">{day}</div>
                <div className="space-y-1">
                  {hits.slice(0, 3).map((h, k) => {
                    const color = TIER_COLOR[h.event.tier];
                    const dimmed = !includedIds[h.event.id];
                    return (
                      <EventDetailDialog key={`${h.event.id}-${k}`} event={h.event}>
                        <button
                          type="button"
                          title={`${h.event.name} — ${h.type === "travel" ? "travel day" : "show day"}`}
                          aria-label={`${h.event.name}, ${h.type} day — open details`}
                          className={cn(
                            "block h-2 w-full rounded-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                            h.type === "travel" && "opacity-40",
                          )}
                          style={{
                            background: color,
                            opacity: dimmed ? 0.35 : 1,
                            ...(h.type === "travel"
                              ? { backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.35) 2px, rgba(0,0,0,0.35) 4px)" }
                              : {}),
                          }}
                        />
                      </EventDetailDialog>
                    );
                  })}
                  {hits.length > 3 && <div className="text-[9px] text-muted-foreground">+{hits.length - 3}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Events this month — clickable for full detail */}
      <div className="mt-4">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
          Events this month ({monthEvents.length})
        </div>
        {monthEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground">No shows this month — use Prev/Next to browse the circuit.</p>
        ) : (
          <div className="space-y-2">
            {monthEvents.map((e) => {
              const d = EVENT_DETAILS[e.id];
              return (
                <EventDetailDialog key={e.id} event={e}>
                  <button
                    type="button"
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg border bg-card/40 px-3 py-2 text-left transition-colors hover:bg-card/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      includedIds[e.id] ? "border-border/60" : "border-border/40 opacity-60",
                    )}
                  >
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: TIER_COLOR[e.tier] }} aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5 text-sm font-medium">
                        {e.name}
                        <Info className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        {formatRange(d.start, d.end)}{!d.dateConfirmed && " · est."}
                        <span className="mx-1">·</span>
                        <MapPin className="h-3 w-3" /> {d.location}
                      </span>
                    </span>
                    <span className={cn("shrink-0 rounded px-1.5 py-0.5 text-[11px] font-semibold", TIER_BADGE[e.tier])}>{e.tier}</span>
                    <span className="shrink-0 text-sm font-medium tabular-nums">{compactUSD(e.cost)}</span>
                  </button>
                </EventDetailDialog>
              );
            })}
          </div>
        )}
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground">
        Click any event — on the calendar or in the list — for dates, the full cost breakdown, and a
        link to its website. Excluded shows appear dimmed.
      </p>
    </div>
  );
}
