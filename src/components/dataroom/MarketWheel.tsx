import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, TrendingUp, Users, Building2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MARKET_SEGMENTS, SEGMENT_DETAILS, type MarketSegment } from "@/data/marketData";
import { cn } from "@/lib/utils";

/** Categorical palette for the 12 segments — warm earth tones with cool accents. */
const WHEEL_COLORS = [
  "hsl(25 80% 56%)", "hsl(38 76% 55%)", "hsl(202 55% 56%)", "hsl(14 70% 52%)",
  "hsl(45 66% 58%)", "hsl(188 45% 50%)", "hsl(20 66% 50%)", "hsl(212 50% 58%)",
  "hsl(33 60% 50%)", "hsl(174 38% 48%)", "hsl(8 58% 53%)", "hsl(222 42% 56%)",
];

const TOTAL = MARKET_SEGMENTS.reduce((s, x) => s + x.revenue2025Bn, 0);
const MAX_CAGR = Math.max(...MARKET_SEGMENTS.map((s) => s.cagrPct));

const CX = 340;
const CY = 205;
const R_OUT = 138;
const R_OUT_ACTIVE = 148;
const R_IN = 80;
const PAD = 1.3;

const RIGHT_TEXT_X = 548;
const RIGHT_LEAD_X = 540;
const LEFT_TEXT_X = 132;
const LEFT_LEAD_X = 140;

const implied2030 = (s: MarketSegment) => s.revenue2025Bn * Math.pow(1 + s.cagrPct, 5);
const growthPct = (s: MarketSegment) => Math.round((implied2030(s) / s.revenue2025Bn - 1) * 100);
const sharePct = (s: MarketSegment) => ((s.revenue2025Bn / TOTAL) * 100).toFixed(1);

function pt(r: number, deg: number): [number, number] {
  const rad = (deg * Math.PI) / 180;
  return [CX + r * Math.sin(rad), CY - r * Math.cos(rad)];
}

function wedgePath(a0: number, a1: number, rOut: number): string {
  const large = a1 - a0 > 180 ? 1 : 0;
  const [x0o, y0o] = pt(rOut, a0);
  const [x1o, y1o] = pt(rOut, a1);
  const [x1i, y1i] = pt(R_IN, a1);
  const [x0i, y0i] = pt(R_IN, a0);
  return `M ${x0o} ${y0o} A ${rOut} ${rOut} 0 ${large} 1 ${x1o} ${y1o} L ${x1i} ${y1i} A ${R_IN} ${R_IN} 0 ${large} 0 ${x0i} ${y0i} Z`;
}

// Wedge geometry — angle proportional to 2025 revenue.
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

// Label geometry — leader lines around the ring, decluttered per side.
function declutter(items: { y: number }[], gap: number, top: number, bottom: number) {
  items.sort((a, b) => a.y - b.y);
  for (let k = 1; k < items.length; k++) {
    if (items[k].y - items[k - 1].y < gap) items[k].y = items[k - 1].y + gap;
  }
  if (items.length) {
    items[items.length - 1].y = Math.min(items[items.length - 1].y, bottom);
    for (let k = items.length - 2; k >= 0; k--) {
      if (items[k + 1].y - items[k].y < gap) items[k].y = items[k + 1].y - gap;
    }
    items[0].y = Math.max(items[0].y, top);
  }
}

const LABELS = (() => {
  const raw = WEDGES.map((w, i) => {
    const [tx, ty] = pt(R_OUT, w.mid);
    const [ex, ey] = pt(R_OUT + 14, w.mid);
    const side: "left" | "right" = Math.sin((w.mid * Math.PI) / 180) >= 0 ? "right" : "left";
    return { i, w, side, tx, ty, ex, ey, y: ey };
  });
  declutter(raw.filter((l) => l.side === "right"), 30, 24, 400);
  declutter(raw.filter((l) => l.side === "left"), 30, 24, 400);
  return raw;
})();

/** CAGR radial gauge. */
function CagrGauge({ cagr, cagrPct, color, size = 64 }: { cagr: string; cagrPct: number; color: string; size?: number }) {
  const r = 26;
  const circ = 2 * Math.PI * r;
  const frac = Math.min(cagrPct / MAX_CAGR, 1);
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
          <circle cx="32" cy="32" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
          <circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - frac)} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-display text-sm font-bold">{cagr}</div>
      </div>
      <div className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">CAGR</div>
    </div>
  );
}

/** Projection mini-chart (2025 → 2030E). */
function ProjectionBars({ seg, color }: { seg: MarketSegment; color: string }) {
  const y2030 = implied2030(seg);
  const maxBar = Math.max(seg.revenue2025Bn, y2030);
  return (
    <div className="rounded-lg border border-border/50 bg-background/40 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-wide text-muted-foreground">Projection</span>
        <span className="inline-flex items-center gap-1 text-xs font-medium text-secondary">
          <TrendingUp className="h-3.5 w-3.5" /> +{growthPct(seg)}% by 2030E
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
            <motion.div className="h-full rounded-full" style={{ background: b.c }} initial={{ width: 0 }} animate={{ width: `${(b.val / maxBar) * 100}%` }} transition={{ duration: 0.4, ease: "easeOut" }} />
          </div>
        </div>
      ))}
      <p className="mt-1.5 text-[11px] text-muted-foreground">Implied 2030 at the segment's {seg.cagr} CAGR.</p>
    </div>
  );
}

function Players({ players }: { players: string[] }) {
  return (
    <div>
      <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Representative players</div>
      <div className="flex flex-wrap gap-1.5">
        {players.map((p) => (
          <span key={p} className="rounded border border-border/60 bg-card/60 px-2 py-0.5 text-xs">{p}</span>
        ))}
      </div>
    </div>
  );
}

/** Full-detail dialog — every detail the document carries for the segment. */
function ReadMoreDialog({ seg, color }: { seg: MarketSegment; color: string }) {
  const d = SEGMENT_DETAILS[seg.rank];
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="mt-4 w-full gap-1.5">
          <BookOpen className="h-4 w-4" /> Read more — full segment detail
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex flex-wrap items-center gap-2 font-display text-xl">
            <span className="h-3 w-3 rounded-full" style={{ background: color }} aria-hidden />
            {seg.name}
            {seg.isBeachhead && (
              <span className="inline-flex items-center gap-1 rounded bg-primary/20 px-1.5 py-0.5 text-[11px] font-semibold text-primary">
                <Star className="h-3 w-3" aria-hidden /> Beachhead
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        {/* Stat strip */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { k: "2025 revenue", v: seg.revenue2025 },
            { k: "Market share", v: `${sharePct(seg)}%` },
            { k: "CAGR", v: seg.cagr },
            { k: "Entities", v: seg.entities.toLocaleString() },
          ].map((s) => (
            <div key={s.k} className="rounded-lg border border-border/60 bg-card/50 p-2.5">
              <div className="font-display text-lg font-bold" style={{ color }}>{s.v}</div>
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{s.k}</div>
            </div>
          ))}
        </div>

        <p className="text-sm leading-relaxed text-foreground/90">{d.fullDetail}</p>

        <ProjectionBars seg={seg} color={color} />

        <div>
          <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Key data points</div>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {seg.supportingData.map((x) => (
              <li key={x} className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ background: color }} aria-hidden />
                {x}
              </li>
            ))}
          </ul>
        </div>

        {d.marketStructure && (
          <div className="rounded-lg border border-border/50 bg-card/40 p-3 text-sm">
            <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Market structure</span>
            <p className="mt-0.5 text-foreground/90">{d.marketStructure}</p>
          </div>
        )}

        {seg.players && seg.players.length > 0 && <Players players={seg.players} />}
      </DialogContent>
    </Dialog>
  );
}

/** The hover/selected detail "popup" for one segment. */
function SegmentPopup({ seg, color }: { seg: MarketSegment; color: string }) {
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

      <div className="mt-4 grid grid-cols-[1fr_auto] items-center gap-4">
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="h-4 w-4 text-primary" aria-hidden />
            <span className="font-display text-xl font-bold" style={{ color }}>{seg.revenue2025}</span>
            <span className="text-xs text-muted-foreground">2025 · {sharePct(seg)}% of market</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" aria-hidden /> {seg.entities.toLocaleString()} entities
          </div>
        </div>
        <CagrGauge cagr={seg.cagr} cagrPct={seg.cagrPct} color={color} />
      </div>

      <div className="mt-4">
        <ProjectionBars seg={seg} color={color} />
      </div>

      <p className="mt-4 text-sm text-foreground/90">{seg.description}</p>

      <ReadMoreDialog seg={seg} color={color} />
    </motion.div>
  );
}

/**
 * Interactive, labelled market wheel — a revenue-weighted donut of the 12 US
 * ag-service segments with leader-line labels for every market. Hover, click,
 * or keyboard-focus any wedge / label / legend row to pop up that segment's
 * detail, and open "Read more" for the full document write-up.
 */
export default function MarketWheel() {
  const [active, setActive] = useState(0);
  const activeWedge = WEDGES[active];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
      <div>
        <svg
          viewBox="0 0 680 430"
          className="mx-auto h-auto w-full"
          role="group"
          aria-label="US ag-service segments by 2025 revenue — select a segment for detail"
        >
          {/* Wedges */}
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
                className="cursor-pointer outline-none focus-visible:fill-[hsl(var(--foreground))]"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
              >
                <title>{`${w.seg.name} — ${w.seg.revenue2025}`}</title>
              </path>
            );
          })}

          {/* Leader-line labels for every market */}
          {LABELS.map((l) => {
            const isActive = l.i === active;
            const right = l.side === "right";
            const leadX = right ? RIGHT_LEAD_X : LEFT_LEAD_X;
            const textX = right ? RIGHT_TEXT_X : LEFT_TEXT_X;
            const anchor = right ? "start" : "end";
            return (
              <g
                key={`lbl-${l.w.seg.rank}`}
                className="cursor-pointer"
                onMouseEnter={() => setActive(l.i)}
                onClick={() => setActive(l.i)}
              >
                <polyline
                  points={`${l.tx},${l.ty} ${l.ex},${l.ey} ${leadX},${l.y}`}
                  fill="none"
                  stroke={l.w.color}
                  strokeWidth={isActive ? 1.6 : 1}
                  strokeOpacity={isActive ? 0.95 : 0.55}
                />
                <circle cx={leadX} cy={l.y} r={2.5} fill={l.w.color} />
                <text
                  x={textX}
                  y={l.y - 2}
                  textAnchor={anchor}
                  fill={isActive ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))"}
                  style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 12, fontWeight: isActive ? 700 : 600 }}
                >
                  {SEGMENT_DETAILS[l.w.seg.rank].short}
                </text>
                <text x={textX} y={l.y + 12} textAnchor={anchor} fill="hsl(var(--muted-foreground))" style={{ fontSize: 11 }}>
                  {l.w.seg.revenue2025} · {l.w.seg.cagr}
                </text>
              </g>
            );
          })}

          {/* Center label */}
          <text x={CX} y={CY - 8} textAnchor="middle" className="fill-foreground" style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 13, fontWeight: 700 }}>US ag-services</text>
          <text x={CX} y={CY + 16} textAnchor="middle" className="fill-foreground" style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 22, fontWeight: 800 }}>${TOTAL.toFixed(1)}B</text>
          <text x={CX} y={CY + 34} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 11 }}>12 segments · 2025</text>
        </svg>

        {/* Legend — all 12, clickable, keyboard-accessible */}
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

      <AnimatePresence mode="wait">
        <SegmentPopup key={activeWedge.seg.rank} seg={activeWedge.seg} color={activeWedge.color} />
      </AnimatePresence>
    </div>
  );
}
