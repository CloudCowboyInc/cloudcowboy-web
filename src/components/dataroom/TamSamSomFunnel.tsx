import { type MarketTier } from "@/data/marketData";
import { cn } from "@/lib/utils";

interface TamSamSomFunnelProps {
  tiers: MarketTier[];
  className?: string;
}

// Centre + per-tier ring radii (largest → smallest), indexed by tier order.
const CX = 215;
const CY = 215;
const RADII = [200, 134, 74];
// Angle (deg) on each ring where its entity-count leader line starts.
const LEADER_ANGLE = [-58, 2, 60];
const LEGEND_X = 452;
const LEADER_Y = [60, 215, 350];

const rad = (deg: number) => (deg * Math.PI) / 180;

/**
 * Nested TAM → SAM → SOM ARR funnel (concentric circles, slide styling).
 * Orange TAM → blue SAM → cream SOM beachhead, with leader lines to the entity
 * counts. Fully data-driven from MARKET_TIERS; nothing hardcoded here.
 */
export default function TamSamSomFunnel({ tiers, className }: TamSamSomFunnelProps) {
  return (
    <figure className={cn("w-full", className)}>
      <svg
        viewBox="0 0 760 430"
        className="h-auto w-full"
        role="img"
        aria-label="Nested TAM, SAM and SOM ARR funnel with entity counts"
      >
        <title>TAM / SAM / SOM ARR funnel</title>
        {/* Concentric rings, largest first so smaller ones layer on top. */}
        {tiers.map((tier, i) => {
          const r = RADII[i];
          const beachhead = tier.isBeachhead;
          return (
            <circle
              key={`ring-${tier.key}`}
              cx={CX}
              cy={CY}
              r={r}
              fill={tier.colorVar}
              fillOpacity={beachhead ? 0.95 : i === 0 ? 0.16 : 0.22}
              stroke={tier.colorVar}
              strokeWidth={beachhead ? 2.5 : 1.5}
              strokeOpacity={0.9}
            />
          );
        })}

        {/* Inside labels: tier name + ARR, stacked top→centre. */}
        {tiers.map((tier, i) => {
          const r = RADII[i];
          // place text near the top inside each band (centre for innermost)
          const labelY = i === tiers.length - 1 ? CY - 6 : CY - (r - 26);
          const onLight = tier.isBeachhead;
          const labelColor = onLight ? "hsl(var(--accent-foreground))" : "hsl(var(--foreground))";
          return (
            <g key={`label-${tier.key}`} textAnchor="middle">
              <text
                x={CX}
                y={labelY}
                fill={labelColor}
                fontSize="15"
                fontWeight="700"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                {tier.key}
              </text>
              <text
                x={CX}
                y={labelY + 20}
                fill={labelColor}
                fontSize="19"
                fontWeight="800"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                {tier.arrLabel} ARR
              </text>
              {tier.isBeachhead && (
                <text
                  x={CX}
                  y={labelY + 38}
                  fill="hsl(var(--accent-foreground))"
                  fontSize="10.5"
                  fontWeight="700"
                  letterSpacing="0.06em"
                >
                  BEACHHEAD
                </text>
              )}
            </g>
          );
        })}

        {/* Leader lines to entity counts on the right. */}
        {tiers.map((tier, i) => {
          const r = RADII[i];
          const a = rad(LEADER_ANGLE[i]);
          const sx = CX + r * Math.cos(a);
          const sy = CY + r * Math.sin(a);
          const ly = LEADER_Y[i];
          return (
            <g key={`leader-${tier.key}`}>
              <polyline
                points={`${sx},${sy} ${LEGEND_X - 12},${sy} ${LEGEND_X - 12},${ly} ${LEGEND_X},${ly}`}
                fill="none"
                stroke={tier.colorVar}
                strokeWidth="1.25"
                strokeOpacity="0.7"
              />
              <circle cx={sx} cy={sy} r="3" fill={tier.colorVar} />
              <text
                x={LEGEND_X + 6}
                y={ly - 4}
                fill={tier.colorVar}
                fontSize="22"
                fontWeight="800"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                {tier.entitiesLabel}
              </text>
              <text x={LEGEND_X + 6} y={ly + 13} fill="hsl(var(--muted-foreground))" fontSize="12">
                entities · {tier.marketLabel}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Accessible descriptor legend (carries the full descriptors). */}
      <figcaption className="mt-4 grid gap-3 sm:grid-cols-3">
        {tiers.map((tier) => (
          <div
            key={`leg-${tier.key}`}
            className={cn(
              "rounded-lg border bg-card/50 p-3",
              tier.isBeachhead ? "border-accent/60" : "border-border/60",
            )}
          >
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ background: tier.colorVar }}
                aria-hidden
              />
              <span className="font-display text-sm font-bold">{tier.key}</span>
              <span className="ml-auto font-display text-sm font-bold" style={{ color: tier.colorVar }}>
                {tier.arrLabel} ARR
              </span>
            </div>
            <div className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
              {tier.marketLabel}
            </div>
            <div className="mt-0.5 text-sm text-foreground">{tier.descriptor}</div>
            {tier.isBeachhead && (
              <div className="mt-1 inline-block rounded bg-accent/20 px-1.5 py-0.5 text-[11px] font-semibold text-accent">
                Beachhead · won first
              </div>
            )}
          </div>
        ))}
      </figcaption>
    </figure>
  );
}
