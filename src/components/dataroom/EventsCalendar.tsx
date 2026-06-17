import { useMemo } from "react";
import EventDetailDialog from "./EventDetailDialog";
import { EVENT_SHOWS } from "@/lib/model/data";
import { EVENT_DETAILS, parseISO, MONTHS_SHORT } from "@/data/eventsData";
import { cn } from "@/lib/utils";
import type { EventShow, EventTier } from "@/lib/model/types";

const TIER_COLOR: Record<EventTier, string> = {
  Top: "hsl(var(--primary))",
  Strong: "hsl(var(--secondary))",
  Optional: "hsl(var(--muted-foreground))",
};

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

type DayHit = { event: EventShow; type: "show" | "travel" };

const keyOf = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
const addDays = (d: Date, n: number) => {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
};

/**
 * Calendar view of the event circuit — each show plus its travel days laid out
 * on month grids, colour-coded by priority. Click any chip for full detail.
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
        const k = keyOf(day);
        if (!map.has(k)) map.set(k, []);
        map.get(k)!.push({ event: e, type: isShow ? "show" : "travel" });
        if (!min || day < min) min = new Date(day);
        if (!max || day > max) max = new Date(day);
      }
    }

    const monthList: { y: number; m: number }[] = [];
    if (min && max) {
      const cur = new Date((min as Date).getFullYear(), (min as Date).getMonth(), 1);
      const end = new Date((max as Date).getFullYear(), (max as Date).getMonth(), 1);
      while (cur <= end) {
        monthList.push({ y: cur.getFullYear(), m: cur.getMonth() });
        cur.setMonth(cur.getMonth() + 1);
      }
    }
    return { byDay: map, months: monthList };
  }, []);

  return (
    <div>
      {/* Legend */}
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        {(["Top", "Strong", "Optional"] as EventTier[]).map((t) => (
          <span key={t} className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-3 rounded-sm" style={{ background: TIER_COLOR[t] }} /> {t} priority
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-3 rounded-sm border border-dashed border-muted-foreground/60 bg-muted/40" /> Travel day
        </span>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {months.map(({ y, m }) => {
          const firstWeekday = new Date(y, m, 1).getDay();
          const daysInMonth = new Date(y, m + 1, 0).getDate();
          const cells: (number | null)[] = [
            ...Array(firstWeekday).fill(null),
            ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
          ];
          return (
            <div key={`${y}-${m}`} className="rounded-lg border border-border/60 bg-card/40 p-3">
              <div className="mb-2 font-display text-sm font-semibold">
                {MONTHS_SHORT[m]} {y}
              </div>
              <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground">
                {WEEKDAYS.map((w) => (
                  <div key={w}>{w}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {cells.map((day, idx) => {
                  if (day === null) return <div key={`b-${idx}`} />;
                  const hits = byDay.get(`${y}-${m}-${day}`) ?? [];
                  return (
                    <div
                      key={day}
                      className={cn(
                        "min-h-[44px] rounded border border-border/40 p-1 text-[10px]",
                        hits.length > 0 ? "bg-background/40" : "bg-transparent",
                      )}
                    >
                      <div className="mb-0.5 text-muted-foreground">{day}</div>
                      <div className="space-y-0.5">
                        {hits.slice(0, 3).map((h, i) => {
                          const color = TIER_COLOR[h.event.tier];
                          const dimmed = h.type === "travel" || !includedIds[h.event.id];
                          return (
                            <EventDetailDialog key={`${h.event.id}-${i}`} event={h.event}>
                              <button
                                type="button"
                                title={`${h.event.name} — ${h.type === "travel" ? "travel day" : "show day"}`}
                                aria-label={`${h.event.name}, ${h.type} day`}
                                className={cn(
                                  "block h-1.5 w-full rounded-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                                  h.type === "travel" && "opacity-40",
                                )}
                                style={{
                                  background: color,
                                  opacity: dimmed ? 0.4 : 1,
                                  ...(h.type === "travel"
                                    ? { backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.35) 2px, rgba(0,0,0,0.35) 4px)" }
                                    : {}),
                                }}
                              />
                            </EventDetailDialog>
                          );
                        })}
                        {hits.length > 3 && (
                          <div className="text-[9px] text-muted-foreground">+{hits.length - 3}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground">
        Excluded shows appear dimmed. Click any bar for dates, cost breakdown and sign-up.
      </p>
    </div>
  );
}
