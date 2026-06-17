/**
 * Types for the Cloud Cowboy investor financial model.
 * Years are index 0–5 = 2026, 2027, 2028, 2029, 2030, 2031.
 */

export type EventTier = "Top" | "Strong" | "Optional";
export type OrgPriority = "HIGH" | "MED" | "LOW";

/** A staffing category: FTE-years and avg base salary per year (length 6). */
export interface StaffCategory {
  name: string;
  fte: number[];
  sal: number[];
}

/** One show on the event circuit (§3.6). */
export interface EventShow {
  id: string;
  name: string;
  cost: number;
  month: string;
  tier: EventTier;
}

/** One org / board membership (§3.7). */
export interface OrgMembership {
  id: string;
  name: string;
  dues: number;
  priority: OrgPriority;
}

/**
 * Everything the engine needs to run. The static §3 data fills the defaults
 * (see DEFAULT_INPUTS); the store hands an edited copy to compute().
 */
export interface ModelInputs {
  // §3.1 scalar assumptions
  avgGmvPerCustomer: number;
  subscriptionPerYear: number;
  takeRate: number;
  transactionCapture: number;
  jobsPerCustomerYear: number;
  achCostPerJob: number;
  layer1AiPerFtePerYear: number;
  platformCogsPerCustomer: number;
  salesCommissionPerNewCustomer: number;
  arrMultiple: number;
  targetCac: number;
  raiseAmount: number;
  dilution: number;

  // §3.2 customers & demand (length 6)
  customersEOY: number[];
  presold: number[];
  preSeasonCapture: number[];
  annualChurn: number[];
  gmvGrowth: number[];

  // §3.3 marketing stack (length 6)
  social: number[];
  digital: number[];
  national: number[];
  oneTime: number[];
  gAndA: number[];
  eventYearFactor: number[];
  /** Σ cost of included shows (derived from event toggles). */
  eventsBaseAnnual: number;
  /** Σ dues of included orgs (derived from org toggles), applied every year. */
  membershipsAnnual: number;

  // §3.4 staffing
  staff: StaffCategory[];
  benefitsLoad: number[];

  // §3.5b monthly engine
  seasonal: number[]; // length 12, sums to 12
  eventTiming: number[]; // length 12, sums to 1.0
  fall2026: Record<number, number>; // month (1-12) -> factor, sums to 1.0
}

/** One year of the annual P&L. */
export interface AnnualRow {
  year: number; // calendar year, e.g. 2026
  yearIndex: number; // 0..5
  boy: number;
  churned: number;
  adds: number;
  customersEOY: number;
  activeSeason: number;
  subRev: number;
  txnRev: number;
  recognizedRev: number;
  ach: number;
  platform: number;
  cogs: number;
  grossProfit: number;
  baseSalaries: number;
  benefits: number;
  peopleCost: number;
  totalFTE: number;
  events: number;
  memberships: number;
  marketing: number;
  opexPeople: number;
  opexAi: number;
  opexComm: number;
  opexMkt: number;
  opexGna: number;
  ebitda: number;
  cumCash: number;
  arr: number;
  newCust: number;
  acqSpend: number;
  blendedCac: number;
  // Key metrics (mirroring the proforma's Key Metrics block)
  grossMargin: number;
  ebitdaMargin: number;
  arrGrowth: number;
  netNewArr: number;
  nrr: number;
  burnMultiple: number;
  revenuePerFte: number;
  marketingPctRev: number;
}

/** One month of the seasonalized cash model (72 total). */
export interface MonthlyRow {
  index: number; // 0..71
  yearIndex: number; // 0..5
  month: number; // 1..12
  label: string; // e.g. "Mar 2027"
  subM: number;
  txnM: number;
  achM: number;
  platM: number;
  jobsM: number;
  peopleM: number;
  aiM: number;
  commM: number;
  gnaM: number;
  eventsM: number;
  mktOtherM: number;
  oneTimeM: number;
  netM: number;
  cumM: number;
}

/** Headline metrics derived from the model. */
export interface ModelMetrics {
  arr5: number;
  valuation: number;
  peakCashNeed: number;
  troughIndex: number;
  troughMonth: string;
  /** First calendar year cumulative cash turns non-negative, or null. */
  firstCfPositive: number | null;
  postMoney: number;
  preMoney: number;
  investorStakeAtExit: number;
  moic: number;
  blendedCac5: number;
  eventsBaseAnnual: number;
  membershipsAnnual: number;
  /** Coverage of peak cash need by the raise (raise / peakCashNeed). */
  raiseCoverage: number;
}

export interface ModelResult {
  annual: AnnualRow[];
  monthly: MonthlyRow[];
  metrics: ModelMetrics;
}
