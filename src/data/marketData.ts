/**
 * Market data for the data-room Market page.
 *
 * SCOPE: United States only. Every figure here is US-specific — we quantify the
 * US because that is where we have the data density to project responsibly.
 * Global expansion is on the roadmap but deliberately not modelled yet.
 *
 * FUNNEL source of truth = Chris's TAM/SAM/SOM slide (§3.8). The 12-segment
 * underlying market + all per-segment detail = the Cloud Cowboy "US Agricultural
 * Service Providers Market Analysis" (March 2026), the source document. Dollar
 * figures on the funnel are labelled ARR exactly as the slide does; the segment
 * figures are total industry revenue (NOT ARR). Nothing is hardcoded in JSX.
 */

export const MARKET_HEADLINE = "Market is rapidly climbing — over $4B by 2030.";

/** US-only framing, shown prominently so the scope is never ambiguous. */
export const US_FOCUS_NOTE =
  "United States market — every figure on this page is US-specific. We model only the US today because that is where the data is strong enough to project within reason.";

/** Why US-only today, and why global is an efficient next step. */
export const GLOBAL_EXPANSION_NOTE =
  "We intend to go global. Cloud Cowboy's systems are built agnostically — not dependent on any single AI model, hardware, or company — so the platform can expand across geographies efficiently once we can project new markets responsibly.";

/** The "Ag Catalyst Through Service Instigation" thesis, in the founder's words. */
export const SERVICE_INSTIGATION = {
  tagline: "The Ag Catalyst Through Service Instigation.",
  paragraphs: [
    "Cloud Cowboy stimulates the entire ag industry. We let service companies — chemical application, custom harvesting, and the rest — serve farmers more consistently, yielding better returns, while in parallel letting those service companies scale toward economy of scale effortlessly.",
    "Our service instigation stems from a simple fact: they could not scale like this, serve farmers like this, or be as profitable as they will be without our platform. That is the core of instigating — it wouldn't have happened without what we are doing.",
  ],
} as const;

export type TierKey = "TAM" | "SAM" | "SOM";

export interface MarketTier {
  key: TierKey;
  arrLabel: string;
  arrValue: number;
  entities: number;
  entitiesLabel: string;
  marketLabel: string;
  descriptor: string;
  isBeachhead: boolean;
  colorVar: string;
  textColorVar: string;
}

/** §3.8 — the three nested tiers, from Chris's slide (US ARR). */
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

/** §3.8 — plain-language derivation, rendered on the page (WhyThis / caption). */
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

/** The TAM bridge from the source doc — how the $3.1B US ARR TAM is built. */
export const TAM_BRIDGE = {
  note: "Cloud Cowboy's US TAM is two additive revenue streams: a 2% flat fee on service transactions, plus a $12,000/yr SaaS subscription per entity.",
  rows: [
    { label: "Transaction flat fee (2% of $104.3B)", y2025: "$2.09B", y2030: "$2.81B" },
    { label: "SaaS subscriptions (86,500 × $12,000)", y2025: "$1.04B", y2030: "$1.22B" },
    { label: "Combined US TAM", y2025: "$3.12B", y2030: "$4.03B" },
  ],
} as const;

// ── Underlying market — 12 segments (total US industry revenue, NOT ARR) ──────
export interface MarketSegment {
  rank: number;
  name: string;
  /** Total US industry revenue 2025, display string. */
  revenue2025: string;
  /** Numeric 2025 revenue in $B, for charts / projections. */
  revenue2025Bn: number;
  /** CAGR display string. */
  cagr: string;
  /** Numeric CAGR fraction (e.g. 0.068), for projections. */
  cagrPct: number;
  entities: number;
  isBeachhead: boolean;
  keyChars: string;
  /** Drill-down description, grounded in the source document. */
  description: string;
  /** Notable supporting market data points from the source. */
  supportingData: string[];
  /** Named players from the source (where listed). */
  players?: string[];
}

export const UNDERLYING_MARKET_LABEL =
  "Underlying US ag-services market — total industry revenue";

export const MARKET_SEGMENTS: MarketSegment[] = [
  {
    rank: 1,
    name: "Chemical & Fertilizer Application",
    revenue2025: "$18.2B",
    revenue2025Bn: 18.2,
    cagr: "6.8%",
    cagrPct: 0.068,
    entities: 15_000,
    isBeachhead: true,
    keyChars: "Custom spraying, spreading, precision VRT",
    description:
      "The largest service segment: custom application of herbicides, pesticides and fungicides, fertilizer spreading and injection, and variable-rate technology (VRT). Farmers increasingly outsource specialized spraying to avoid equipment costs and regulatory complexity — and this is Cloud Cowboy's beachhead.",
    supportingData: [
      "US crop-protection chemicals alone are valued at $21.34B in 2025.",
      "Global ag crop-service market grows $8.01B (2025) → $14.70B (2034) at 7.0% CAGR.",
      "~15,000 custom-application businesses operate across the US.",
    ],
    players: ["Nutrien Ag Solutions", "Helena Agri-Enterprises", "GROWMARK", "Wilbur-Ellis", "CHS"],
  },
  {
    rank: 2,
    name: "Agricultural Trucking & Transport",
    revenue2025: "$15.3B",
    revenue2025Bn: 15.3,
    cagr: "5.2%",
    cagrPct: 0.052,
    entities: 10_500,
    isBeachhead: false,
    keyChars: "Grain hauling, livestock transport, logistics",
    description:
      "The critical link between farm origins, grain elevators, processing facilities and intermodal hubs — grain hauling, livestock transport, produce delivery, and farm-to-market freight logistics.",
    supportingData: [
      "Driver shortages — especially short-haul seasonal freight — constrain regional capacity.",
      "Insurance costs and driver churn push many regional carriers to scale back.",
      "~10,500 agricultural trucking entities serve the US market.",
    ],
    players: ["Regional carriers (predominant)", "Cargill", "ADM (in-house logistics)"],
  },
  {
    rank: 3,
    name: "Farm Labor & Staffing Services",
    revenue2025: "$14.8B",
    revenue2025Bn: 14.8,
    cagr: "12.7%",
    cagrPct: 0.127,
    entities: 12_400,
    isBeachhead: false,
    keyChars: "Labor contractors, H-2A, seasonal crews",
    description:
      "One of the fastest-growing segments, driven by chronic agricultural labor shortages. Farm labor contractors now account for over 40% of H-2A visa jobs, with their share of crop-labor positions rising for two decades — particularly in California.",
    supportingData: [
      "Ag-support employment rose from 1.07M (2010) to 1.18M (2024).",
      "US farming-as-a-service market: $1.16B (2024) → $3.38B (2033) at 12.7% CAGR.",
      "~12,400 labor-contracting and staffing entities operate nationally.",
    ],
    players: ["Fresh Harvest", "Foothill Packing", "AgriLabor", "USA Farm Labor", "Global Ag Services"],
  },
  {
    rank: 4,
    name: "Livestock Support Services",
    revenue2025: "$12.8B",
    revenue2025Bn: 12.8,
    cagr: "7.9%",
    cagrPct: 0.079,
    entities: 17_800,
    isBeachhead: false,
    keyChars: "Vet services, AI, hoof care, feed mgmt",
    description:
      "Veterinary care, artificial insemination (AI), hoof trimming, shearing, branding, feed management and livestock handling across cattle, dairy, hog, sheep, goat and poultry operations. The largest entity count of any segment, reflecting how fragmented livestock services are.",
    supportingData: [
      "US animal-health market: $12.65B (2024) at a 7.97% projected CAGR.",
      "US veterinary-AI market: $2.0–2.55B (2024) → $4.61B (2034) at 6.1% CAGR.",
      "~17,800 entities — the most of any segment.",
    ],
    players: ["Zoetis", "Bayer Animal Health", "Neogen Corp.", "ABS Global (AI services)"],
  },
  {
    rank: 5,
    name: "Custom Harvesting Services",
    revenue2025: "$12.5B",
    revenue2025Bn: 12.5,
    cagr: "5.5%",
    cagrPct: 0.055,
    entities: 6_200,
    isBeachhead: false,
    keyChars: "Combine, forage, specialty crop harvest",
    description:
      "Combine harvesting, forage harvesting, hay baling and specialty-crop harvest crews. Custom harvesters follow the wheat and corn belts seasonally, and demand is rising with skilled-operator shortages and equipment costs.",
    supportingData: [
      "Average US custom grain-harvest rate projected +8% in 2025 vs 2024.",
      "Harvesting-machinery market $31.86B (2025); US growing at 8.07%.",
      "~6,200 custom-harvesting entities operate nationally.",
    ],
    players: ["Independent operators (predominant)", "Great Plains Custom Harvesters Assn."],
  },
  {
    rank: 6,
    name: "Precision Agriculture & Consulting",
    revenue2025: "$6.9B",
    revenue2025Bn: 6.9,
    cagr: "13.3%",
    cagrPct: 0.133,
    entities: 5_800,
    isBeachhead: false,
    keyChars: "Agronomy, drone mapping, farm mgmt",
    description:
      "The fastest-growing segment by CAGR: agronomy consulting, soil testing, drone mapping and analytics, farm-management advisory, and data-driven decision support — a technology wave creating demand for specialized operators.",
    supportingData: [
      "US precision-farming market: $4.37B (2025) → $15.23B (2035) at 13.3% CAGR.",
      "Agriculture drone market: $5.40B (2025) → $12.70B (2030) at 18.8% CAGR.",
      "~5,800 consulting and precision-ag entities operate in the US.",
    ],
    players: ["John Deere", "Trimble", "AGCO", "CNH Industrial", "Bayer Crop Science (Climate Corp)"],
  },
  {
    rank: 7,
    name: "Aerial Application Services",
    revenue2025: "$5.8B",
    revenue2025Bn: 5.8,
    cagr: "8.5%",
    cagrPct: 0.085,
    entities: 2_400,
    isBeachhead: false,
    keyChars: "Crop dusting, drone spraying, monitoring",
    description:
      "Agricultural aviation — traditional crop dusting, helicopter application, and the rapidly growing drone-based aerial application segment. Drones are increasingly complementing aircraft for targeted spraying and crop monitoring.",
    supportingData: [
      "Global agricultural-aircraft market $6.3B (2025) → $11.4B (2034) at 6.8%; North America 33.2% share.",
      "Average aerial business operates 2.3 aircraft (84% fixed-wing, 16% rotorcraft).",
      "~2,400 aerial-application businesses operate in the US.",
    ],
    players: ["NAAA members", "DJI", "Rotor Technologies (drones)"],
  },
  {
    rank: 8,
    name: "Post-Harvest & Ginning Services",
    revenue2025: "$5.6B",
    revenue2025Bn: 5.6,
    cagr: "4.8%",
    cagrPct: 0.048,
    entities: 5_100,
    isBeachhead: false,
    keyChars: "Grain drying, storage, cotton ginning",
    description:
      "Grain drying, storage and handling, plus cotton ginning. A steady, essential segment tied to harvest volumes.",
    supportingData: [
      "Grain-dryers market: $3.81B (2025) → $6.21B (2035) at 5.01% CAGR.",
      "US grain-storage silos: a $297.59M market in 2025.",
      "~5,100 entities, including 594 cotton-ginning establishments.",
    ],
  },
  {
    rank: 9,
    name: "Irrigation Services",
    revenue2025: "$4.2B",
    revenue2025Bn: 4.2,
    cagr: "5.6%",
    cagrPct: 0.056,
    entities: 1_900,
    isBeachhead: false,
    keyChars: "Installation, maintenance, optimization",
    description:
      "Irrigation system installation, maintenance, scheduling optimization and water-management consulting. Water-conservation mandates and drought frequency are accelerating demand, especially in California and the Western states.",
    supportingData: [
      "US ag-irrigation machinery: $2.10B (2025) → $2.80B (2030) at 5.6% CAGR.",
      "Drip irrigation leads at 11.4% CAGR, driven by specialty fruit & nut expansion.",
      "~1,900 irrigation service providers operate nationally.",
    ],
    players: ["Valmont Industries", "Lindsay Corporation", "The Toro Company", "Netafim (Orbia)"],
  },
  {
    rank: 10,
    name: "Vineyard, Orchard & Specialty Crop",
    revenue2025: "$3.4B",
    revenue2025Bn: 3.4,
    cagr: "5.5%",
    cagrPct: 0.055,
    entities: 3_800,
    isBeachhead: false,
    keyChars: "Pruning, pollination, specialty harvest",
    description:
      "Specialized labor and management for vineyards, orchards and other specialty crops — berries, nuts and vegetables. A 15–20% annual labor deficit is accelerating demand for contracted specialty-crop services.",
    supportingData: [
      "North America led the orchard/vineyard equipment market in 2024 (43.8% share, $0.7B).",
      "California alone reports ~590,000 acres of grape cultivation.",
      "Pruning and leafing account for ~40% of segment revenue; ~3,800 entities.",
    ],
  },
  {
    rank: 11,
    name: "Soil Preparation & Planting",
    revenue2025: "$3.1B",
    revenue2025Bn: 3.1,
    cagr: "5.2%",
    cagrPct: 0.052,
    entities: 7_800,
    isBeachhead: false,
    keyChars: "Tilling, land clearing, seed drilling",
    description:
      "Tilling, plowing, land clearing, seed drilling and cultivation services. Grows in line with planted-acreage expansion and no-till / reduced-till adoption trends.",
    supportingData: [
      "Census shows 4,136 soil-prep/planting/cultivating establishments; ~7,800 incl. smaller operators.",
      "Cultivation and soil prep capture 36.7% of broader farm-equipment usage.",
    ],
  },
  {
    rank: 12,
    name: "Agricultural Fencing Services",
    revenue2025: "$1.7B",
    revenue2025Bn: 1.7,
    cagr: "4.6%",
    cagrPct: 0.046,
    entities: 1_600,
    isBeachhead: false,
    keyChars: "Installation, repair, maintenance",
    description:
      "Installation, repair and maintenance of farm and ranch perimeter fencing, livestock-containment systems and crop-protection barriers.",
    supportingData: [
      "US ag-fencing market estimated at $2.40B (2022), growing at 4.6% CAGR.",
      "USDA allocated $200M for rural infrastructure in 2024, including fencing.",
      "Barbed wire leads at 35.7% revenue share; ~1,600 contractors serve the US.",
    ],
  },
];

export const MARKET_TOTALS = {
  total2025: "$104.3B",
  total2030: "$140.3B",
  compositeCagr: "5.8%",
  entities2025: "~86,500",
  entities2030: "~102,000",
  methodologyNote:
    "Total is aggregated across all 12 segments and cross-referenced against the 2022 US Economic Census (NAICS 115: $59.3B from ~14,900 establishments); our broader figure captures trucking, veterinary, precision-ag, fencing and irrigation services spread across multiple NAICS codes. Where sources disagree, estimates lean to the larger end of available ranges.",
} as const;

/** §5/§6 — historical actuals + forecast for the total US market ($B). */
export interface MarketTrendPoint {
  year: string;
  size: number; // $B
  kind: "actual" | "forecast";
  note?: string;
}

export const MARKET_TREND: MarketTrendPoint[] = [
  { year: "2018", size: 72.4, kind: "actual", note: "Strong farm-economy baseline" },
  { year: "2019", size: 76.1, kind: "actual", note: "+5.1% — recovery in farm income" },
  { year: "2020", size: 74.8, kind: "actual", note: "-1.7% — COVID-19 disruptions" },
  { year: "2021", size: 82.5, kind: "actual", note: "+10.3% — record commodity prices" },
  { year: "2022", size: 89.7, kind: "actual", note: "+8.7% — peak commodity cycle" },
  { year: "2023", size: 93.2, kind: "actual", note: "+3.9% — price normalization" },
  { year: "2024", size: 98.6, kind: "actual", note: "+5.8% — tech adoption accelerates" },
  { year: "2025", size: 104.3, kind: "actual", note: "+5.8% — precision ag & drones drive growth" },
  { year: "2026", size: 110.5, kind: "forecast" },
  { year: "2027", size: 117.2, kind: "forecast" },
  { year: "2028", size: 124.4, kind: "forecast" },
  { year: "2029", size: 132.1, kind: "forecast" },
  { year: "2030", size: 140.3, kind: "forecast" },
];

/** §7 — key market drivers. */
export const MARKET_DRIVERS: { title: string; body: string }[] = [
  {
    title: "Chronic farm-labor shortage",
    body: "A persistent 15–20% annual labor shortfall in key regions; ag-support employment hit 1.18M in 2024 yet demand outpaces supply, with farm labor contractors now >40% of H-2A positions.",
  },
  {
    title: "Precision ag & technology adoption",
    body: "US precision farming is growing 13.3% CAGR; the agriculture drone market alone reaches $12.70B by 2030 at 18.8% CAGR — creating demand for specialized service providers.",
  },
  {
    title: "Farm consolidation & specialization",
    body: "US farms declined 7% from 2017–2022 while average size grew; larger operations outsource specialized services to focus on core farming.",
  },
  {
    title: "Rising equipment costs & complexity",
    body: "Modern equipment runs $100K to $2M+ per unit, making ownership impractical for many farmers and driving custom application, harvesting and contract services.",
  },
  {
    title: "Regulatory complexity",
    body: "Expanding rules on chemical application, water and labor favor licensed, insured specialists over in-house operations.",
  },
  {
    title: "Climate variability & water scarcity",
    body: "Drives irrigation (11.4% CAGR for drip), precision application and crop monitoring — especially under Western water mandates.",
  },
];

/** §10/§11 — sources, grouped, to build credibility. */
export interface SourceGroup {
  category: string;
  items: string[];
}

export const MARKET_SOURCE_GROUPS: SourceGroup[] = [
  {
    category: "Government & official statistics",
    items: [
      "USDA Economic Research Service — Farm Labor",
      "USDA NASS — Census of Agriculture 2022",
      "US Census Bureau — 2022 Economic Census, NAICS Sector 11",
      "Bureau of Labor Statistics — NAICS 115",
      "USDA AMS — Transportation Research & Analysis",
      "USDA NASS — Farm Labor Survey",
    ],
  },
  {
    category: "Market research reports",
    items: [
      "Grand View Research — US Farming as a Service; US Agriculture Drone; US Veterinary AI; US Animal Health; US Agricultural Fencing",
      "Mordor Intelligence — Agricultural Sprayers; US Agricultural Irrigation Machinery",
      "Precedence Research — Farming as a Service; Precision Farming",
      "Market Research Future — Agriculture Crop Service; Grain Dryers",
      "IBISWorld — Crop Services in the US; Precision Agriculture Systems & Services",
    ],
  },
  {
    category: "Industry associations & publications",
    items: [
      "National Agricultural Aviation Association — Industry Facts",
      "CropLife Magazine — Top 100 US Ag Retailers",
      "AgAmerica — US Farm Labor Shortage",
      "Grain Journal — 2025 Transportation Report",
    ],
  },
  {
    category: "Academic & research",
    items: [
      "UC Davis — Labor Contractors in US Agriculture",
      "Federal Reserve Bank of Kansas City — Agricultural Labor",
    ],
  },
];

export const MARKET_SOURCE =
  "Cloud Cowboy, US Agricultural Service Providers Market Analysis, March 2026 (citing USDA, 2022 Census of Agriculture, US Economic Census, BLS, Grand View Research, Mordor Intelligence, Precedence Research, IBISWorld, NAAA, and others — full list below).";

/** How the supporting table relates to the ARR funnel — stated on the page. */
export const FUNNEL_RELATIONSHIP =
  "The $104.3B is the total US industry; Cloud Cowboy's $3.1B TAM is what we monetize from it ($12K subscription + 2% of transactions). Chemical & Fertilizer Application is both the largest segment and our beachhead.";
