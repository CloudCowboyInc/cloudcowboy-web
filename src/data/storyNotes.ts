/**
 * "Story & Notes" — the narrative behind the model, ported as 12 sections and
 * surfaced via WhyThis expanders on the relevant data-room pages. Every figure
 * cited here is a canonical §3 input or a §3.9 output of the engine — nothing
 * is fabricated. `page` tags where each note is most relevant.
 */

export type StoryPage = "market" | "gtm" | "finance";

export interface StoryNote {
  id: string;
  title: string;
  page: StoryPage;
  paragraphs: string[];
}

export const STORY_NOTES: StoryNote[] = [
  {
    id: "thesis",
    title: "The thesis",
    page: "market",
    paragraphs: [
      "Cloud Cowboy is the AI-native operating system for ag-service providers. We start with the beachhead — ~15,000 chemical-application businesses (drone + ground) — then expand across the eight ag-service verticals that make up the available market.",
      "Each operator is worth ~$30K/yr: a $12,000 subscription plus 2% of the ~$900K of job revenue that runs through the platform. That single unit drives both the Market funnel and the finance model, so the two always reconcile.",
    ],
  },
  {
    id: "how-to-read",
    title: "How to read this model",
    page: "finance",
    paragraphs: [
      "Every number on this page is computed by one tested engine from the assumptions in §3 — there is no spreadsheet to drift out of sync. The six periods are 2026–2031.",
      "Change any assumption, the raise, or the Go-To-Market toggles and the entire model recomputes live. Costs are shown as negative values; the bottom line is EBITDA and the running cumulative cash.",
    ],
  },
  {
    id: "ramp",
    title: "The customer ramp",
    page: "gtm",
    paragraphs: [
      "Customers (end of year) grow 0 → 125 → 300 → 650 → 1,250 → 2,000, seeded by 50 presold operators in 2026. Net adds accelerate as the sales team scales from 1 to 12 reps.",
      "Churn starts conservative at 8% and compresses to 5% by 2031 as the product deepens and switching costs rise.",
    ],
  },
  {
    id: "recognized-vs-arr",
    title: "Recognized revenue vs ARR",
    page: "finance",
    paragraphs: [
      "ARR is the run-rate on end-of-year customers (× ~$30K) — it reaches $60M in 2031. Recognized revenue reflects the customers actually active in-season, so mid-year adds aren't fully recognized in the year they sign.",
      "That timing gap is why 2031 recognized revenue (~$46M) sits below the $60M ARR. ARR is the forward-looking valuation driver; recognized revenue is what hits the P&L.",
    ],
  },
  {
    id: "capture",
    title: "100% transaction capture",
    page: "finance",
    paragraphs: [
      "The base case assumes we process 100% of customers' job revenue (transaction capture = 1.0). This is the model's most sensitive lever — at 2% of ~$900K GMV it contributes ~$18K of each customer's ~$30K value.",
      "Dial capture down on the assumptions panel to see the conservative case; transaction revenue scales linearly with it.",
    ],
  },
  {
    id: "marketing-cac",
    title: "Marketing & CAC",
    page: "gtm",
    paragraphs: [
      "Spend scales from social/digital into national media plus the live event circuit and org memberships. The event circuit and memberships are the toggles on this page — every one flows into the proforma.",
      "Blended CAC compresses toward ~$2,553 by 2031 (against a $2,500 target) as brand, referrals, and the event presence lower the cost of each new operator.",
    ],
  },
  {
    id: "staffing",
    title: "Staffing & FTE",
    page: "finance",
    paragraphs: [
      "Headcount grows from ~1.75 FTE in 2026 to 47 by 2031 across engineering, sales, customer success, ag specialists, marketing, and ops.",
      "The benefits load steps from 10% to 28% in 2028, when the team formalizes full benefits — visible as a margin step in that year.",
    ],
  },
  {
    id: "gna",
    title: "G&A",
    page: "finance",
    paragraphs: [
      "General & administrative scales with the business from $150K (2026) to $1.65M (2031), covering operations, legal, tooling, and facilities. It is deliberately conservative — over-, not under-budgeted.",
    ],
  },
  {
    id: "unit-economics",
    title: "Unit economics",
    page: "finance",
    paragraphs: [
      "At ~$30K ARR per customer against ~$1,800 platform COGS plus ACH job costs, contribution margin is high. A blended CAC near $2,553 against ~$30K of annual value implies a payback measured in weeks, not years.",
      "Strong unit economics are what let the model turn cash-flow positive (cumulative ≥ 0) in 2028 despite the aggressive ramp.",
    ],
  },
  {
    id: "seasonality",
    title: "Seasonality & monthly cash",
    page: "finance",
    paragraphs: [
      "Spray season concentrates revenue from spring through late summer (monthly seasonal factors peak at 2.4×), while fixed costs run evenly across the year. Cash therefore dips through each off-season.",
      "The deepest dip — the peak cash need the raise must cover — is ~$797K in March 2027. The monthly chart marks that trough explicitly.",
    ],
  },
  {
    id: "stress-test",
    title: "Stress-testing the model",
    page: "finance",
    paragraphs: [
      "This proforma is built to be stressed, not just admired. Toggle off the event circuit, lower transaction capture, slow the customer ramp, or change the raise — every input flows through to peak cash need, EBITDA, and returns live.",
      "Use “Reset to base case” to return to the spec defaults at any time.",
    ],
  },
  {
    id: "sources",
    title: "Sources",
    page: "finance",
    paragraphs: [
      "Finance figures come from the canonical assumptions in the build spec §3 (customers, pricing, staffing, marketing, and the monthly seasonal model).",
      "Market figures come from Chris's TAM/SAM/SOM slide and the Cloud Cowboy US Agricultural Service Providers Market Analysis (March 2026).",
    ],
  },
];

export const notesForPage = (page: StoryPage): StoryNote[] =>
  STORY_NOTES.filter((n) => n.page === page);
