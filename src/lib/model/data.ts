/**
 * Canonical model data — the single source of truth from §3 of
 * docs/DATAROOM_BUILD_SPEC.md. Do not invent numbers; every value here is
 * transcribed from the spec. Years are index 0–5 = 2026..2031.
 */
import type {
  EventShow,
  ModelInputs,
  OrgMembership,
  StaffCategory,
} from "./types";

/** Calendar years for the six model periods. */
export const YEARS = [2026, 2027, 2028, 2029, 2030, 2031] as const;

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// ── §3.4 Staffing (FTE-years and avg base salary, per year) ────────────────
export const STAFF: StaffCategory[] = [
  { name: "CEO (founder)", fte: [0.42, 1, 1, 1, 1, 1], sal: [150000, 150000, 175000, 180000, 185000, 190000] },
  { name: "Engineering", fte: [0.83, 3, 5, 7, 9, 11], sal: [70000, 70000, 140000, 145000, 150000, 155000] },
  { name: "Sales", fte: [0, 1, 3, 6, 9, 12], sal: [60000, 60000, 65000, 70000, 72000, 74000] },
  { name: "Marketing", fte: [0.25, 1, 2, 3, 4, 5], sal: [70000, 70000, 105000, 110000, 115000, 120000] },
  { name: "Business Ops", fte: [0.25, 1, 2, 3, 4, 5], sal: [70000, 70000, 105000, 110000, 115000, 120000] },
  { name: "Customer Success", fte: [0, 1, 2, 4, 6, 8], sal: [60000, 60000, 70000, 72000, 74000, 76000] },
  { name: "Ag Specialists", fte: [0, 0.58, 2, 3, 4, 5], sal: [70000, 70000, 95000, 100000, 105000, 110000] },
];

export const BENEFITS_LOAD = [0.1, 0.1, 0.28, 0.28, 0.28, 0.28];

// ── §3.6 Event circuit — the 18 shows (name, cost, month, tier) ─────────────
export const EVENT_SHOWS: EventShow[] = [
  { name: "Nebraska Ag & Spray Drone Conference", cost: 2158, month: "Aug", tier: "Top" },
  { name: "Farm Progress Show", cost: 7290, month: "Sep", tier: "Top" },
  { name: "Commercial UAV Expo Americas", cost: 8930, month: "Sep", tier: "Strong" },
  { name: "Husker Harvest Days", cost: 6000, month: "Sep", tier: "Strong" },
  { name: "Farm Science Review", cost: 8140, month: "Sep", tier: "Strong" },
  { name: "Ozark Fall Farmfest", cost: 5000, month: "Oct", tier: "Optional" },
  { name: "Sunbelt Ag Expo", cost: 8860, month: "Oct", tier: "Strong" },
  { name: "Colorado AAA Convention (CoAAA)", cost: 2044, month: "Nov", tier: "Top" },
  { name: "Western CO Farm & Ranch Innovation", cost: 2188, month: "Feb", tier: "Top" },
  { name: "NAAA Ag Aviation Expo", cost: 7570, month: "Dec", tier: "Top" },
  { name: "National Western Stock Show", cost: 2641, month: "Jan", tier: "Optional" },
  { name: "Colorado Farm Show", cost: 1291, month: "Jan", tier: "Strong" },
  { name: "Spray Drone End User Conf (SDEUC)", cost: 6600, month: "Feb", tier: "Top" },
  { name: "Ag Conference of the Southern Rockies", cost: 1708, month: "Feb", tier: "Strong" },
  { name: "Commodity Classic", cost: 8640, month: "Mar", tier: "Strong" },
  { name: "Four States Ag Expo", cost: 1862, month: "Mar", tier: "Optional" },
  { name: "XPONENTIAL (AUVSI)", cost: 12000, month: "May", tier: "Optional" },
  { name: "CSU Wheat Field Days", cost: 830, month: "Jun", tier: "Optional" },
].map((e) => ({ ...e, id: slug(e.name) }));

// ── §3.7 Orgs & boards — 12 memberships (name, annual dues, priority) ───────
export const ORG_MEMBERSHIPS: OrgMembership[] = [
  { name: "Colorado Ag Aviation Assoc (CoAAA)", dues: 250, priority: "HIGH" },
  { name: "NAAA + UAAS Committee", dues: 450, priority: "HIGH" },
  { name: "Rocky Mountain Agribusiness Assoc (RMAA)", dues: 350, priority: "HIGH" },
  { name: "Colorado Farm Bureau", dues: 60, priority: "HIGH" },
  { name: "CDA Advisory Committees / Ag Commission", dues: 0, priority: "HIGH" },
  { name: "Colorado Corn (Growers Assoc)", dues: 50, priority: "MED" },
  { name: "Colorado Wheat (Wheat Growers)", dues: 50, priority: "MED" },
  { name: "Colorado Weed Management Assoc (CWMA)", dues: 75, priority: "MED" },
  { name: "Local Conservation District / NRCS", dues: 0, priority: "MED" },
  { name: "Drone Service Providers Alliance (DSPA)", dues: 240, priority: "MED" },
  { name: "Commercial Drone Alliance", dues: 500, priority: "LOW" },
  { name: "Certified Crop Adviser (CCA)", dues: 300, priority: "LOW" },
].map((o) => ({ ...o, id: slug(o.name) }));

/** Σ cost of the given shows (defaults to all = 93752, the all-Y default). */
export function sumEventCosts(shows: EventShow[] = EVENT_SHOWS): number {
  return shows.reduce((s, e) => s + e.cost, 0);
}

/** Σ dues of the given orgs (defaults to all = 2325, the all-Y default). */
export function sumOrgDues(orgs: OrgMembership[] = ORG_MEMBERSHIPS): number {
  return orgs.reduce((s, o) => s + o.dues, 0);
}

/** All-Y default event circuit total (93752). */
export const EVENTS_BASE_ANNUAL_DEFAULT = sumEventCosts();
/** All-Y default memberships total (2325). */
export const MEMBERSHIPS_ANNUAL_DEFAULT = sumOrgDues();

// ── §3.5b monthly engine constants ──────────────────────────────────────────
/** seasonal[m], m=1..12, sums to 12, avg 1.00 (index 0 unused → pad). */
export const SEASONAL = [0.05, 0.1, 0.35, 1.5, 2.4, 1.8, 2.4, 1.8, 0.85, 0.5, 0.15, 0.1];
/** eventTiming[m], m=1..12, sums to 1.0. */
export const EVENT_TIMING = [0.0419, 0.112, 0.112, 0, 0.128, 0.0089, 0, 0.023, 0.3238, 0.1478, 0.0218, 0.0808];
/** 2026 events land Aug–Dec only; month (1-12) -> factor, sums to 1.0. */
export const FALL_2026: Record<number, number> = { 8: 0.0385, 9: 0.5422, 10: 0.2475, 11: 0.0365, 12: 0.1353 };

// ── §3.1 / §3.2 / §3.3 — default inputs ─────────────────────────────────────
export const DEFAULT_INPUTS: ModelInputs = {
  // §3.1
  avgGmvPerCustomer: 900000,
  subscriptionPerYear: 12000,
  takeRate: 0.02,
  transactionCapture: 1.0,
  jobsPerCustomerYear: 150,
  achCostPerJob: 5,
  layer1AiPerFtePerYear: 6000,
  platformCogsPerCustomer: 1800,
  salesCommissionPerNewCustomer: 1200,
  arrMultiple: 20,
  targetCac: 2500,
  raiseAmount: 1000000,
  dilution: 0.2,

  // §3.2
  customersEOY: [0, 125, 300, 650, 1250, 2000],
  presold: [50, 0, 0, 0, 0, 0],
  preSeasonCapture: [0, 0.15, 0.3, 0.35, 0.35, 0.35],
  annualChurn: [0, 0.08, 0.07, 0.06, 0.055, 0.05],
  gmvGrowth: [0, 0.08, 0.1, 0.12, 0.13, 0.14],

  // §3.3
  social: [50000, 120000, 120000, 120000, 120000, 120000],
  digital: [20000, 50000, 140000, 260000, 370000, 450000],
  national: [0, 0, 120000, 230000, 320000, 390000],
  oneTime: [120000, 0, 0, 0, 0, 0],
  gAndA: [150000, 320000, 580000, 880000, 1250000, 1650000],
  eventYearFactor: [0.5, 1.0, 1.1, 1.21, 1.331, 1.4641],
  eventsBaseAnnual: EVENTS_BASE_ANNUAL_DEFAULT,
  membershipsAnnual: MEMBERSHIPS_ANNUAL_DEFAULT,

  // §3.4
  staff: STAFF,
  benefitsLoad: BENEFITS_LOAD,

  // §3.5b
  seasonal: SEASONAL,
  eventTiming: EVENT_TIMING,
  fall2026: FALL_2026,
};

/** Short month name for a 1-based month index. */
export const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
