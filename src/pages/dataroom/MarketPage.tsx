import { Layers, TrendingUp, BookOpen, MapPin, Zap, Globe, FileText, Compass } from "lucide-react";
import {
  SectionCard,
  StatTile,
  TamSamSomFunnel,
  SegmentPyramid,
  MarketGrowthChart,
  WhyThis,
  StoryNotes,
} from "@/components/dataroom";
import {
  MARKET_HEADLINE,
  MARKET_TIERS,
  MARKET_TOTALS,
  MARKET_SOURCE,
  MARKET_SOURCE_GROUPS,
  MARKET_DRIVERS,
  TIER_DERIVATION,
  TAM_BRIDGE,
  VERTICALS_NOTE,
  UNDERLYING_MARKET_LABEL,
  FUNNEL_RELATIONSHIP,
  US_FOCUS_NOTE,
  GLOBAL_EXPANSION_NOTE,
  SERVICE_INSTIGATION,
} from "@/data/marketData";

/**
 * Market page (TERRITORY + enrichment). US-only scope made explicit. PRIMARY:
 * the TAM/SAM/SOM ARR funnel (slide). Enriched from the source doc with the
 * market trajectory, a 12-segment drill-down pyramid, drivers, the service-
 * instigation thesis, and grouped sources. All figures from src/data/marketData.ts.
 */
export default function MarketPage() {
  return (
    <div className="space-y-6">
      {/* Hero — US scope front and centre */}
      <div>
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
          <MapPin className="h-3.5 w-3.5" /> United States market · all figures US-specific
        </div>
        <h2 className="max-w-3xl font-display text-3xl font-bold leading-tight md:text-4xl">
          {MARKET_HEADLINE}
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">{US_FOCUS_NOTE}</p>
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
        title="The US ARR funnel"
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

        {/* TAM bridge from the source doc */}
        <div className="mt-5 rounded-lg border border-border/50 bg-card/40 p-4">
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            How the US TAM is built
          </div>
          <p className="mb-3 text-sm text-muted-foreground">{TAM_BRIDGE.note}</p>
          <div className="space-y-1.5">
            {TAM_BRIDGE.rows.map((r, i) => (
              <div
                key={r.label}
                className={cnRow(i === TAM_BRIDGE.rows.length - 1)}
              >
                <span className="text-foreground/90">{r.label}</span>
                <span className="flex gap-6 tabular-nums">
                  <span>{r.y2025}</span>
                  <span className="text-muted-foreground">→ {r.y2030}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Market trajectory — historical + forecast */}
      <SectionCard
        icon={TrendingUp}
        eyebrow="Market trajectory"
        title={`Total US ag-services market: ${MARKET_TOTALS.total2025} → ${MARKET_TOTALS.total2030}`}
        description={`A resilient ${MARKET_TOTALS.compositeCagr} composite CAGR — even the 2020 COVID dip was just -1.7%. Entities ${MARKET_TOTALS.entities2025} → ${MARKET_TOTALS.entities2030}.`}
      >
        <MarketGrowthChart />
        <p className="mt-4 text-xs text-muted-foreground">{MARKET_TOTALS.methodologyNote}</p>
      </SectionCard>

      {/* SECONDARY — underlying market drill-down (industry revenue, NOT ARR) */}
      <SectionCard
        icon={Layers}
        eyebrow="Supporting data — total industry revenue (not ARR)"
        title={`${UNDERLYING_MARKET_LABEL} (${MARKET_TOTALS.total2025})`}
        description="The dollars flowing through each US ag-service vertical — the industry the ARR funnel is derived from. Drill into any segment."
      >
        <SegmentPyramid />

        <WhyThis className="mt-5" title="How the industry relates to our ARR funnel">
          <p>{FUNNEL_RELATIONSHIP}</p>
        </WhyThis>
      </SectionCard>

      {/* What's driving growth */}
      <SectionCard icon={Compass} eyebrow="Tailwinds" title="What's driving the market">
        <div className="grid gap-3 sm:grid-cols-2">
          {MARKET_DRIVERS.map((d) => (
            <div key={d.title} className="rounded-lg border border-border/60 bg-card/40 p-4">
              <div className="mb-1 font-display text-sm font-semibold">{d.title}</div>
              <p className="text-sm text-muted-foreground">{d.body}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Service instigation thesis */}
      <SectionCard icon={Zap} eyebrow="Our thesis" title={SERVICE_INSTIGATION.tagline}>
        <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          {SERVICE_INSTIGATION.paragraphs.map((p, i) => (
            <p key={i} className={i === 0 ? "text-foreground/90" : undefined}>{p}</p>
          ))}
        </div>
      </SectionCard>

      {/* Global expansion */}
      <SectionCard icon={Globe} eyebrow="Roadmap" title="Built to go global">
        <p className="text-sm leading-relaxed text-muted-foreground">{GLOBAL_EXPANSION_NOTE}</p>
      </SectionCard>

      {/* Sources */}
      <SectionCard icon={FileText} eyebrow="Sources &amp; references" title="The evidence base">
        <p className="mb-4 text-sm text-muted-foreground">{MARKET_SOURCE}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {MARKET_SOURCE_GROUPS.map((g) => (
            <div key={g.category}>
              <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
                {g.category}
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {g.items.map((it) => (
                  <li key={it} className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/60" aria-hidden />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard icon={BookOpen} eyebrow="Story &amp; notes" title="The thesis, in context">
        <StoryNotes page="market" />
      </SectionCard>
    </div>
  );
}

/** Row styling helper for the TAM bridge (last row emphasised). */
function cnRow(isTotal: boolean): string {
  return [
    "flex items-center justify-between text-sm",
    isTotal ? "border-t border-border/50 pt-1.5 font-semibold text-foreground" : "",
  ]
    .filter(Boolean)
    .join(" ");
}
