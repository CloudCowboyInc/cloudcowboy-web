import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Star, TrendingUp, Users } from "lucide-react";
import { MARKET_SEGMENTS, type MarketSegment } from "@/data/marketData";
import { cn } from "@/lib/utils";

/** Implied 2030 revenue ($B) at the segment's own CAGR — derived, clearly labelled. */
const implied2030 = (s: MarketSegment) =>
  s.revenue2025Bn * Math.pow(1 + s.cagrPct, 5);

// Pyramid taper: map revenue to a width band so the largest segment is widest.
const REV = MARKET_SEGMENTS.map((s) => s.revenue2025Bn);
const MIN = Math.min(...REV);
const MAX = Math.max(...REV);
const widthPct = (bn: number) => 42 + ((bn - MIN) / (MAX - MIN)) * 58;

interface SegmentDetailProps {
  s: MarketSegment;
}

function SegmentDetail({ s }: SegmentDetailProps) {
  const y2030 = implied2030(s);
  const maxBar = Math.max(s.revenue2025Bn, y2030);
  return (
    <div className="grid gap-5 px-4 pb-4 pt-1 md:grid-cols-[1.4fr_1fr]">
      <div className="space-y-3 text-sm text-muted-foreground">
        <p className="text-foreground/90">{s.description}</p>
        <ul className="space-y-1">
          {s.supportingData.map((d) => (
            <li key={d} className="flex gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden />
              {d}
            </li>
          ))}
        </ul>
        {s.players && s.players.length > 0 && (
          <div className="pt-1">
            <div className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Representative players
            </div>
            <div className="flex flex-wrap gap-1.5">
              {s.players.map((p) => (
                <span key={p} className="rounded border border-border/60 bg-card/60 px-2 py-0.5 text-xs">
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Per-segment projection visual */}
      <div className="rounded-lg border border-border/50 bg-card/40 p-4">
        <div className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Future projection
        </div>
        <div className="space-y-3">
          {[
            { label: "2025", val: s.revenue2025Bn, color: "hsl(var(--secondary))" },
            { label: "2030E", val: y2030, color: "hsl(var(--primary))" },
          ].map((b) => (
            <div key={b.label}>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-muted-foreground">{b.label}</span>
                <span className="font-display font-semibold tabular-nums">${b.val.toFixed(1)}B</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${(b.val / maxBar) * 100}%`, background: b.color }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <TrendingUp className="h-3.5 w-3.5 text-primary" />
          Implied 2030 at the segment's {s.cagr} CAGR · {s.entities.toLocaleString()} entities
        </div>
      </div>
    </div>
  );
}

/**
 * Drill-down pyramid of the 12 underlying US ag-service segments (§3 of the
 * source doc). High level = name + revenue + CAGR + entities, sized largest →
 * smallest; click any tier to expand into the weeds (description, supporting
 * data, players, and a per-segment projection visual).
 */
export default function SegmentPyramid() {
  const [open, setOpen] = useState<number | null>(MARKET_SEGMENTS[0].rank);

  return (
    <div className="space-y-2">
      <p className="mb-2 text-xs text-muted-foreground">
        Click any segment to drill into the details and its future projection. Sized by 2025 US
        industry revenue.
      </p>
      {MARKET_SEGMENTS.map((s) => {
        const isOpen = open === s.rank;
        return (
          <div
            key={s.rank}
            className={cn(
              "mx-auto rounded-lg border transition-colors",
              s.isBeachhead ? "border-primary/50 bg-primary/10" : "border-border/60 bg-card/40",
              isOpen && "border-primary/60",
            )}
            style={{ width: isOpen ? "100%" : `${widthPct(s.revenue2025Bn)}%` }}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : s.rank)}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-3 px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span className="w-5 shrink-0 text-xs text-muted-foreground">{s.rank}</span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium">{s.name}</span>
                  {s.isBeachhead && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded bg-primary/20 px-1.5 py-0.5 text-[11px] font-semibold text-primary">
                      <Star className="h-3 w-3" aria-hidden /> Beachhead
                    </span>
                  )}
                </span>
                <span className="mt-0.5 hidden text-xs text-muted-foreground sm:block">
                  {s.keyChars}
                </span>
              </span>
              <span className="shrink-0 text-right">
                <span className="block font-display text-sm font-bold tabular-nums">{s.revenue2025}</span>
                <span className="flex items-center justify-end gap-2 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-0.5"><TrendingUp className="h-3 w-3" />{s.cagr}</span>
                  <span className="inline-flex items-center gap-0.5"><Users className="h-3 w-3" />{s.entities.toLocaleString()}</span>
                </span>
              </span>
              <ChevronDown
                className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-180")}
                aria-hidden
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="detail"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden border-t border-border/50"
                >
                  <SegmentDetail s={s} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
