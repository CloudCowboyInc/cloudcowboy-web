/**
 * "Story & Notes" — the investor narrative, transcribed verbatim from the
 * CloudCowboy_Proforma "Story & Notes" tab so the data room mirrors the
 * spreadsheet exactly. Surfaced via WhyThis expanders on the relevant pages.
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
    title: "The one-line thesis",
    page: "market",
    paragraphs: [
      "Cloud Cowboy is the operating system for agricultural service providers — the payments-embedded platform that runs quoting, dispatch, flight planning, and billing for spray-drone and custom-application businesses. Because every job is invoiced and paid through us (ACH via Stripe), we capture transaction volume directly. We are the system of record that runs the business, not a marketplace taking a referral slice.",
    ],
  },
  {
    id: "how-to-read",
    title: "How to read this model",
    page: "finance",
    paragraphs: [
      "Base case only. Blue cells are adjustable inputs; black cells are formulas — change any blue number and the whole model recalculates. The portal exposes Aggressive / Conservative toggles on top of this base. Years run 2026 (Year 0, build) through 2031 (Year 5). All figures are US-only; the platform is built systems-agnostic and global-ready, but every number here is the US plan.",
    ],
  },
  {
    id: "ramp",
    title: "Customer ramp — why it is deliberately conservative",
    page: "finance",
    paragraphs: [
      "No hockey stick. 50 customers are pre-sold during the 2026 build year and begin billing in 2027, so 2026 shows zero paying customers and zero churn by design. We grow to 125 / 300 / 650 / 1,250 / 2,000 paying customers by 2031, intentionally capped at 2,000 — going larger this early strains credibility more than it adds value. Annual logo churn improves from 8% to 5% as the product deepens and switching cost rises.",
    ],
  },
  {
    id: "recognized-vs-arr",
    title: "Revenue — two numbers, on purpose",
    page: "finance",
    paragraphs: [
      "Recognized revenue is in-year and seasonal: customers acquired mid-season only contribute partial GMV that year, so recognized revenue trails the run-rate. ARR is the end-of-year run-rate — the forward 12-month value of the customer base — and is what the valuation multiple is applied to. We monetize two ways: a $12,000 annual subscription plus 2% of all transaction volume. At ~$900K average GMV per customer, that is ~$30K ARR per customer, so 2,000 customers = $60M ARR.",
    ],
  },
  {
    id: "capture",
    title: "Why 100% transaction capture is defensible",
    page: "finance",
    paragraphs: [
      "This is the core of the model and the assumption to probe hardest. We are not lead-gen: once a provider runs quoting, scheduling, and invoicing on Cloud Cowboy, payment runs natively through the platform (ACH via Stripe, ~$5/job). Capture approaches 100% by construction — the same dynamic by which Toast captures restaurant payments and ServiceTitan captures the trades. If a provider processes payments off-platform, they lose the workflow that makes the platform useful.",
    ],
  },
  {
    id: "marketing-cac",
    title: "Marketing & CAC — the efficiency story",
    page: "gtm",
    paragraphs: [
      "Marketing is built bottoms-up, not as a plug. The grounded foundation is our real field plan: 18 ag conventions ($93,752 full-send circuit; see the reference tabs), $10K/mo social & content, 12 industry memberships, and $120K of one-time launch capital (wrapped truck, equipment trailer, merch, booth build). The event circuit grows 10%/yr from 2028 as we add shows; digital media and a national-expansion line scale with our footprint.",
      "The result: blended CAC (marketing + sales commission ÷ new customers) starts high near $6K — we invest in brand and presence ahead of volume — then compresses to roughly our $2,500 target by Year 5 as fixed spend leverages over a larger base. Marketing as a share of revenue falls from ~14% to low-single-digits, which is the operating leverage an investor wants to see.",
    ],
  },
  {
    id: "staffing",
    title: "Staffing & FTE — how headcount is counted",
    page: "finance",
    paragraphs: [
      "Headcount is measured in FTE-years (full-time equivalents), not raw bodies, so partial-year hires are costed correctly. One FTE is one person working full-time for the full year; a half-time role is 0.5, and someone who starts mid-year counts only for the fraction of the year they are on payroll. Example: the CEO is 0.42 FTE in 2026 because salary starts in August (about 5 of 12 months), and the two founding engineers total ~0.83 FTE that year.",
      "This is why 2026 is a partial payroll year: CEO + 2 engineers from August, Business Ops + Marketing from October, and the Ag specialist joining mid-2027. By 2031 the company runs ~47 FTE across seven categories (engineering, sales, marketing, business ops, customer success, ag specialists, and the founder). Salaries are competitive and scale by category; benefits and payroll load step from 10% to 28% on Jan 1, 2028, when full healthcare and 401(k) begin.",
    ],
  },
  {
    id: "gna",
    title: "G&A — what the overhead line covers",
    page: "finance",
    paragraphs: [
      "G&A is company overhead, kept separate from the cost of delivering the product (payments and platform/AI sit in COGS) and from go-to-market (marketing and sales commission sit above it). It scales with headcount at roughly $33–35K per FTE per year and is front-loaded in 2026 for company formation. It covers software and internal tools (Workspace, Slack, GitHub, accounting, HR/payroll, the CRM); legal and compliance (entity, contracts, IP and patent filings, fundraising legal, SOC 2 and data-privacy work); insurance (general liability, tech E&O, cyber, and D&O after the round); and finance and admin (bookkeeping, tax, fractional CFO, recruiting). As a share of revenue it falls from ~17% to ~4% by Year 5 — the operating leverage of a remote-first, AI-native team.",
    ],
  },
  {
    id: "unit-economics",
    title: "Unit economics & margin",
    page: "finance",
    paragraphs: [
      "Strong gross and EBITDA margins are a feature of the operating-system model: software-plus-payments revenue against a lean, AI-native cost base where bespoke agents handle work that would otherwise be headcount. The business reaches cash-flow positive in 2028 on a peak operating cash need under ~$0.7M. The honest caveat, stated plainly: margins this strong depend on the $30K ARR/customer and high transaction-capture assumptions holding. That is the number we expect rigorous diligence to test, and we welcome the test.",
    ],
  },
  {
    id: "seasonality",
    title: "Seasonality & monthly cash flow",
    page: "finance",
    paragraphs: [
      "Ag is not a steady business, so a flat 1/12 monthly view would mislead. The Monthly Cash Flow spreads the annual base case across the real spray calendar: revenue, jobs, and payment processing follow the season (near-zero Nov–Mar, peak Apr–Aug), while salaries, G&A, platform, and subscription are paid evenly all year. Event spend is placed in the actual months each of the 18 shows occurs — which is fall- and winter-heavy, the opposite of revenue.",
      "The honest consequence: the company carries full fixed cost through every winter before the season pays, so the true cash low point is mid-spring, not year-end. In the base case the deepest point is about $0.80M in March 2027 — meaningfully below the $0.63M year-end figure — and that intra-year trough, not the annual number, is what the raise must cover. Every monthly column sums exactly back to the annual proforma.",
    ],
  },
  {
    id: "stress-test",
    title: "What we would stress-test (and bracket in the conservative case)",
    page: "finance",
    paragraphs: [
      "Lower transaction capture, a slower customer ramp, higher churn, and a CAC that compresses more slowly. The portal's conservative toggle will bracket each of these. We would rather hand you the downside than have you discover it — the base case is a plan, not a promise.",
    ],
  },
  {
    id: "reference-tabs",
    title: "Reference tabs — the live field plan",
    page: "gtm",
    paragraphs: [
      "The Events and Orgs sections are our live field-marketing plan: every convention with its booth/registration and travel cost, every membership, and the one-time launch capital — each with Y/N toggles that update the totals. These are the source of the grounded marketing numbers in the model.",
    ],
  },
];

export const notesForPage = (page: StoryPage): StoryNote[] =>
  STORY_NOTES.filter((n) => n.page === page);
