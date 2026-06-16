import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, TrendingUp, Users, Building2 } from "lucide-react";
import { MARKET_SEGMENTS, type MarketSegment } from "@/data/marketData";
import { cn } from "@/lib/utils";

/**
 * Categorical palette for the 12 segments — warm earth tones with cool accents,
 * harmonised with the dark ag-tech theme. Distinct colours are a legitimate
 * reason to introduce hues (12 data series can't come from 3 brand tokens).
 */
const WHEEL_COLORS = [
  "hsl(25 80% 56%)", // 1 Chemical — primary orange (beachhead)
  "hsl(38 76% 55%)", // 2 amber
  "hsl(202 55% 56%)", // 3 blue
  "hsl(14 70% 52%)", // 4 rust
  "hsl(45 66% 58%)", // 5 gold
  "hsl(188 45% 50%)", // 6 teal
  "hsl(20 66% 50%)", // 7 burnt orange
  "hsl(212 50% 58%)", // 8 steel blue
  "hsl(33 60% 50%)", // 9 ochre
  "hsl(174 38% 48%)", // 10 muted teal
  "hsl(8 58% 53%)", // 11 terracotta
  "hsl(222 42% 56%)", // 12 slate blue
];

const TOTAL = MARKET_SEGMENTS.reduce((s, x) => s + x.revenue2025Bn, 0);
const MAX_CAGR = Math.max(...MARKET_SEGMENTS.map((s) => s.cagrPct));

const CX = 180;
const CY = 180;
const R_OUT = 162;
const R_OUT_ACTIVE = 174;
const R_IN = 96;
const PAD = 1.4; // degrees of gap between wedges

const implied2030 = (s: MarketSegment) => s.revenue2025Bn * Math.pow(1 + s.cagrPct, 5);

/** Point on a circle, degrees measured from top, clockwise. */
function pt(r: number, deg: number): [number, number] {
  const rad = (deg * Math.PI) / 180;
  return [CX + r * Math.sin(rad), CY - r * Math.cos(rad)];
}

/** Annular-sector path between r_in and r_out, from a0 to a1 (clockwise). */
function wedgePath(a0: number, a1: number, rOut: number): string {
  const large = a1 - a0 > 180 ? 1 : 0;
  const [x0o, y0o] = pt(rOut, a0);
  const [x1o, y1o] = pt(rOut, a1);
  const [x1i, y1i] = pt(R_IN, a1);
  const [x0i, y0i] = pt(R_IN, a0);
  return `M ${x0o} ${y0o} A ${rOut} ${rOut} 0 ${large} 1 ${x1o} ${y1o} L ${x1i} ${y1i} A ${R_IN} ${R_IN} 0 ${large} 0 ${x0i} ${y0i} Z`;
}

// Pre-compute wedge geometry (angles proportional to 2025 revenue).
const WEDGES = (() => {
  let cursor = 0;
  return MARKET_SEGMENTS.map((s, i) => {
    const sweep = (s.revenue2025Bn / TOTAL) * 360;
    const a0 = cursor + PAD / 2;
    const a1 = cursor + sweep - PAD / 2;
    cursor += sweep;
    return { seg: s, color: WHEEL_COLORS[i], a0, a1, mid: (a0 + a1) / 2 };
  });
})();

/** CAGR radial gauge. */
function CagrGauge({ cagr, cagrPct, color }: { cagr: string; cagrPct: number; color: string }) {
  const r = 26;
  const circ = 2 * Math.PI * r;
  const frac = Math.min(cagrPct / MAX_CAGR, 1);
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - frac)}
        />
      </svg>
      <div className="-mt-11 text-center">
        <div className="font-display text-sm font-bold">{cagr}</div>
      </div>
      <div className="mt-3 text-[11px] uppercase tracking-wide text-muted-foreground">CAGR</div>
    </div>
  );
}

/** The hover/selected detail "popup" for one segment. */
function SegmentPopup({ seg, color }: { seg: MarketSegment; color: string }) {
  const y2030 = implied2030(seg);
  const growth = Math.round((y2030 / seg.revenue2025Bn - 1) * 100);
  const sharePct = ((seg.revenue2025Bn / TOTAL) * 100).toFixed(1);
  const maxBar = Math.max(seg.revenue2025Bn, y2030);

  return (
    <motion.div
      key={seg.rank}
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="rounded-xl border border-border/60 bg-card/80 p-5 shadow-xl backdrop-blur"
    >
      <div className="flex items-start gap-2">
        <span className="mt-1 h-3 w-3 shrink-0 rounded-full" style={{ background: color }} aria-hidden />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-lg font-bold leading-tight">{seg.name}</h3>
            {seg.isBeachhead && (
              <span className="inline-flex items-center gap-1 rounded bg-primary/20 px-1.5 py-0.5 text-[11px] font-semibold text-primary">
                <Star className="h-3 w-3" aria-hidden /> Beachhead
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{seg.keyChars}</p>
        </div>
      </div>

      {/* Stat row */}
      <div className="mt-4 grid grid-cols-[1fr_auto] items-center gap-4">
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="h-4 w-4 text-primary" aria-hidden />
            <span className="font-display text-xl font-bold" style={{ color }}>{seg.revenue2025}</span>
            <span className="text-xs text-muted-foreground">2025 · {sharePct}% of market</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" aria-hidden /> {seg.entities.toLocaleString()} entities
          </div>
        </div>
        <CagrGauge cagr={seg.cagr} cagrPct={seg.cagrPct} color={color} />
      </div>

      {/* Projection mini-chart */}
      <div className="mt-4 rounded-lg border border-border/50 bg-background/40 p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wide text-muted-foreground">Projection</span>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-secondary">
            <TrendingUp className="h-3.5 w-3.5" /> +{growth}% by 2030E
          </span>
        </div>
        {[
          { label: "2025", val: seg.revenue2025Bn, c: "hsl(var(--muted-foreground))" },
          { label: "2030E", val: y2030, c: color },
        ].map((b) => (
          <div key={b.label} className="mb-1.5 last:mb-0">
            <div className="mb-0.5 flex justify-between text-xs">
              <span className="text-muted-foreground">{b.label}</span>
              <span className="font-semibold tabular-nums">${b.val.toFixed(1)}B</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full"
                style={{ background: b.c }}
                initial={{ width: 0 }}
                animate={{ width: `${(b.val / maxBar) * 100}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
        <p className="mt-1.5 text-[11px] text-muted-foreground">Implied 2030 at the segment's {seg.cagr} CAGR.</p>
      </div>

      {/* Description + supporting data */}
      <p className="mt-4 text-sm text-foreground/90">{seg.description}</p>
      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
        {seg.supportingData.map((d) => (
          <li key={d} className="flex gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ background: color }} aria-hidden />
            {d}
          </li>
        ))}
      </ul>

      {seg.players && seg.players.length > 0 && (
        <div className="mt-3">
          <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Representative players
          </div>
          <div className="flex flex-wrap gap-1.5">
            {seg.players.map((p) => (
              <span key={p} className="rounded border border-border/60 bg-card/60 px-2 py-0.5 text-xs">{p}</span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

/**
 * Interactive market wheel — a revenue-weighted donut of the 12 US ag-service
 * segments. Hover, click, or keyboard-focus any wedge (or legend item) to pop
 * up that segment's full detail and projection. The wheel itself encodes market
 * size; the beachhead is highlighted.
 */
export default function MarketWheel() {
  const [active, setActive] = useState(0); // index into WEDGES
  const activeWedge = WEDGES[active];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
      {/* Wheel + legend */}
      <div>
        <svg
          viewBox="0 0 360 360"
          className="mx-auto h-auto w-full max-w-[380px]"
          role="group"
          aria-label="Market segments by 2025 revenue — select a segment for detail"
        >
          {WEDGES.map((w, i) => {
            const isActive = i === active;
            return (
              <path
                key={w.seg.rank}
                d={wedgePath(w.a0, w.a1, isActive ? R_OUT_ACTIVE : R_OUT)}
                fill={w.color}
                fillOpacity={isActive ? 1 : 0.82}
                stroke="hsl(var(--background))"
                strokeWidth={2}
                tabIndex={0}
                role="button"
                aria-label={`${w.seg.name}: ${w.seg.revenue2025}, ${w.seg.cagr} CAGR, ${w.seg.entities.toLocaleString()} entities`}
                aria-pressed={isActive}
                className="cursor-pointer outline-none transition-[fill-opacity] focus-visible:fill-[hsl(var(--foreground))]"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                style={{ transition: "d 0.15s ease" }}
              >
                <title>{`${w.seg.name} — ${w.seg.revenue2025}`}</title>
              </path>
            );
          })}
          {/* Center label */}
          <text x={CX} y={CY - 8} textAnchor="middle" className="fill-foreground" style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 13, fontWeight: 700 }}>
            US ag-services
          </text>
          <text x={CX} y={CY + 16} textAnchor="middle" className="fill-foreground" style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 22, fontWeight: 800 }}>
            ${TOTAL.toFixed(1)}B
          </text>
          <text x={CX} y={CY + 34} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 11 }}>
            12 segments · 2025
          </text>
        </svg>

        {/* Legend — all 12, always present, clickable */}
        <div className="mt-4 grid grid-cols-1 gap-1 sm:grid-cols-2">
          {WEDGES.map((w, i) => (
            <button
              key={w.seg.rank}
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              className={cn(
                "flex items-center gap-2 rounded px-2 py-1 text-left text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                i === active ? "bg-muted/60 text-foreground" : "text-muted-foreground hover:bg-muted/30",
              )}
            >
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: w.color }} aria-hidden />
              <span className="flex-1 truncate">{w.seg.name}</span>
              <span className="shrink-0 tabular-nums">{w.seg.revenue2025}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Live detail popup */}
      <AnimatePresence mode="wait">
        <SegmentPopup key={activeWedge.seg.rank} seg={activeWedge.seg} color={activeWedge.color} />
      </AnimatePresence>
    </div>
  );
}
