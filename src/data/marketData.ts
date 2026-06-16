/**
 * Market data for the data-room Market page.
 *
 * SOURCE OF TRUTH for the funnel = Chris's TAM/SAM/SOM slide ONLY (§3.8 of the
 * build spec). Do NOT use the market-research PDF/DOCX for the funnel figures.
 * Dollar figures on the funnel are labelled ARR exactly as the slide does.
 *
 * The 12-segment table (§3.8b) is the SUPPORTING underlying-market layer —
 * total industry revenue, NOT Cloud Cowboy ARR — and is labelled as such so the
 * two are never conflated. Nothing here is hardcoded in JSX.
 */

export const MARKET_HEADLINE = "Market is rapidly climbing — over $4B by 2030.";

export type TierKey = "TAM" | "SAM" | "SOM";

export interface MarketTier {
  key: TierKey;
  /** ARR headline exactly as the slide labels it. */
  arrLabel: string;
  /** Numeric ARR (USD) — for relative sizing only; display uses arrLabel. */
  arrValue: number;
  entities: number;
  entitiesLabel: string;
  /** Market ring label, e.g. "TOTAL US MARKET". */
  marketLabel: string;
  descriptor: string;
  isBeachhead: boolean;
  /** Ring colour, mapped to existing brand tokens (orange/blue/cream). */
  colorVar: string;
  /** Foreground colour for text sitting on the ring fill. */
  textColorVar: string;
}

/** §3.8 — the three nested tiers, from Chris's slide. */
export const MARKET_TIERS: MarketTier[] = [
  {
    key: "TAM",
    arrLabel: "$3.1B",
    arrValue: 3_100_000_000,
    entities: 86_500,
    entitiesLabel: "86,500",
    marketLabel: "TOTAL US MARKET",
    descriptor: "All Large-Scale Ag Services",
    isBeachhead: false,
    colorVar: "hsl(var(--primary))",
    textColorVar: "hsl(var(--primary-foreground))",
  },
  {
    key: "SAM",
    arrLabel: "$2.0B",
    arrValue: 2_000_000_000,
    entities: 50_000,
    entitiesLabel: "50,000",
    marketLabel: "AVAILABLE MARKET",
    descriptor: "Across 8 separate ag-service verticals",
    isBeachhead: false,
    colorVar: "hsl(var(--secondary))",
    textColorVar: "hsl(var(--secondary-foreground))",
  },
  {
    key: "SOM",
    arrLabel: "$450M",
    arrValue: 450_000_000,
    entities: 15_000,
    entitiesLabel: "15,000",
    marketLabel: "OBTAINABLE MARKET",
    descriptor: "Our beachhead: Chemical Applicators",
    isBeachhead: true,
    colorVar: "hsl(var(--accent))",
    textColorVar: "hsl(var(--accent-foreground))",
  },
];

/**
 * §3.8 — plain-language derivation, rendered on the page (WhyThis / caption).
 * Each line is one bullet; `intro` and `closing` frame them.
 */
export const TIER_DERIVATION = {
  intro:
    "Each business on Cloud Cowboy is worth a $12,000/yr subscription + 2% of the job revenue that runs through the platform. Multiply that per-business value by the number of businesses in each ring:",
  bullets: [
    "TAM $3.1B = all 86,500 US ag-service providers, if every one ran on Cloud Cowboy.",
    "SAM $2B = the ~50,000 providers inside the 8 ag-service verticals our platform serves.",
    "SOM $450M = our beachhead — ~15,000 chemical-application businesses we win first, at ~$30K each ($12K subscription + 2% of ~$900K of jobs = $12K + $18K).",
  ],
  closing:
    "The $30K/customer SOM unit is identical to the figure driving the finance model, so the Market page and the proforma reconcile.",
} as const;

export const VERTICALS_NOTE =
  "The slide does not itemize the 8 verticals with individual sizes or CAGR, so none are invented here — only the three tiers, the 8-verticals count, and the chemical-applicator beachhead are shown.";

// ── §3.8b Underlying market — 12 segments (SUPPORTING layer, not the funnel) ──
export interface MarketSegment {
  rank: number;
  name: string;
  /** Total industry revenue 2025 (label exactly as the source states). */
  revenue2025: string;
  /** CAGR label, or null where the source does not state it (render "—"). */
  cagr: string | null;
  entities: number;
  isBeachhead: boolean;
}

export const UNDERLYING_MARKET_LABEL =
  "Underlying US ag-services market — total industry revenue";

export const MARKET_SEGMENTS: MarketSegment[] = [
  { rank: 1, name: "Chemical & Fertilizer Application", revenue2025: "$18.2B", cagr: "6.8%", entities: 11_200, isBeachhead: true },
  { rank: 2, name: "Agricultural Trucking & Transport", revenue2025: "$15.3B", cagr: "5.2%", entities: 10_500, isBeachhead: false },
  { rank: 3, name: "Farm Labor & Staffing Services", revenue2025: "$14.8B", cagr: "12.7%", entities: 12_400, isBeachhead: false },
  { rank: 4, name: "Livestock Support Services", revenue2025: "$12.8B", cagr: "7.9%", entities: 17_800, isBeachhead: false },
  { rank: 5, name: "Custom Harvesting Services", revenue2025: "$12.5B", cagr: "5.5%", entities: 6_200, isBeachhead: false },
  { rank: 6, name: "Precision Agriculture & Consulting", revenue2025: "$6.9B", cagr: "13.3%", entities: 5_800, isBeachhead: false },
  { rank: 7, name: "Aerial Application Services", revenue2025: "$5.8B", cagr: "8.5%", entities: 2_400, isBeachhead: false },
  { rank: 8, name: "Post-Harvest & Ginning Services", revenue2025: "$5.6B", cagr: "4.8%", entities: 5_100, isBeachhead: false },
  { rank: 9, name: "Irrigation Services", revenue2025: "$4.2B", cagr: "5.6%", entities: 1_900, isBeachhead: false },
  { rank: 10, name: "Vineyard, Orchard & Specialty Crop", revenue2025: "$3.4B", cagr: "5.5%", entities: 3_800, isBeachhead: false },
  { rank: 11, name: "Soil Preparation & Planting", revenue2025: "$3.1B", cagr: null, entities: 7_800, isBeachhead: false },
  { rank: 12, name: "Agricultural Fencing Services", revenue2025: "$1.7B", cagr: null, entities: 1_600, isBeachhead: false },
];

export const MARKET_TOTALS = {
  total2025: "$104.3B",
  total2030: "$140.3B",
  compositeCagr: "5.8%",
  cagrFootnote: "CAGR not stated in the source for segments 11–12; shown as “—”, not fabricated.",
} as const;

export const MARKET_SOURCE =
  "Cloud Cowboy, US Agricultural Service Providers Market Analysis, March 2026, §3 (citing USDA, 2022 Census of Agriculture, BLS, Grand View Research, Mordor Intelligence, IBISWorld, NAAA).";

/** How the supporting table relates to the ARR funnel — stated on the page. */
export const FUNNEL_RELATIONSHIP =
  "The $104.3B is the total industry; Cloud Cowboy's $3.1B TAM is what we monetize from it ($12K subscription + 2% of transactions). Chemical & Fertilizer Application is both the largest segment and our beachhead.";
