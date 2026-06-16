import { Layers, TrendingUp } from "lucide-react";
import {
  SectionCard,
  StatTile,
  TamSamSomFunnel,
  SegmentTable,
  WhyThis,
} from "@/components/dataroom";
import {
  MARKET_HEADLINE,
  MARKET_TIERS,
  MARKET_TOTALS,
  MARKET_SOURCE,
  TIER_DERIVATION,
  VERTICALS_NOTE,
  UNDERLYING_MARKET_LABEL,
  FUNNEL_RELATIONSHIP,
} from "@/data/marketData";

/**
 * Market page (TERRITORY). PRIMARY: the TAM/SAM/SOM ARR funnel from Chris's
 * slide (§3.8). SECONDARY: the 12-segment underlying-market table (§3.8b),
 * clearly separated so industry revenue is never confused with Cloud Cowboy ARR.
 * All figures come from src/data/marketData.ts.
 */
export default function MarketPage() {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <div>
        <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-primary">
          <TrendingUp className="h-3.5 w-3.5" /> Market
        </div>
        <h2 className="max-w-3xl font-display text-3xl font-bold leading-tight md:text-4xl">
          {MARKET_HEADLINE}
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          The opportunity in <span className="text-foreground">ARR</span> Cloud Cowboy can
          monetize — total market, the verticals we serve, and the beachhead we win first.
        </p>
      </div>

      {/* Tier stat tiles */}
      <div className="grid gap-3 sm:grid-cols-3">
        {MARKET_TIERS.map((t) => (
          <StatTile
            key={t.key}
            label={`${t.key} · ${t.marketLabel}`}
            value={`${t.arrLabel} ARR`}
            hint={`${t.entitiesLabel} entities — ${t.descriptor}`}
            accent={t.colorVar}
          />
        ))}
      </div>

      {/* PRIMARY — the slide funnel */}
      <SectionCard
        eyebrow="From the TAM / SAM / SOM slide"
        title="The ARR funnel"
        description="Nested tiers: total US market → available market → our chemical-applicator beachhead. Dollar figures are ARR."
      >
        <TamSamSomFunnel tiers={MARKET_TIERS} />

        <WhyThis className="mt-5" title="How these numbers are derived" defaultOpen>
          <p>{TIER_DERIVATION.intro}</p>
          <ul className="ml-4 list-disc space-y-1">
            {TIER_DERIVATION.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <p className="text-foreground">{TIER_DERIVATION.closing}</p>
          <p className="text-xs italic">{VERTICALS_NOTE}</p>
        </WhyThis>
      </SectionCard>

      {/* SECONDARY — underlying market (industry revenue, NOT ARR) */}
      <SectionCard
        icon={Layers}
        eyebrow="Supporting data — total industry revenue (not ARR)"
        title={`${UNDERLYING_MARKET_LABEL} (${MARKET_TOTALS.total2025})`}
        description="The dollars flowing through each ag-service vertical — the industry the ARR funnel is derived from. This is not Cloud Cowboy ARR."
      >
        <SegmentTable />

        <WhyThis className="mt-5" title="How the industry relates to our ARR funnel">
          <p>{FUNNEL_RELATIONSHIP}</p>
        </WhyThis>

        <p className="mt-4 border-t border-border/50 pt-3 text-xs text-muted-foreground">
          Source: {MARKET_SOURCE}
        </p>
      </SectionCard>
    </div>
  );
}
