/**
 * Shared model store — the "dynamic connection" between the GTM toggles, the
 * Finance assumptions, and the proforma. One singleton, read by all three
 * data-room pages via useSyncExternalStore (no Provider, no JSX → stays a .ts).
 *
 * Holds editable assumptions (`base`), event/org toggles, and growth levers.
 * The effective `inputs` fed to compute() = applyGrowth(base, growth); growth
 * levers default to inactive, so the base case is unchanged (§3.9 holds).
 */
import { useSyncExternalStore } from "react";
import { compute } from "./engine";
import { DEFAULT_INPUTS, EVENT_SHOWS, ORG_MEMBERSHIPS } from "./data";
import type { ModelInputs, ModelResult } from "./types";

const LS_KEY = "cc_model_store_v2";

/** Series that can be driven by "first value + YoY %" instead of per-year. */
export type GrowthKey =
  | "customersEOY"
  | "annualChurn"
  | "social"
  | "digital"
  | "national"
  | "gAndA";

export interface GrowthLever {
  first: number;
  rate: number;
  active: boolean;
}

export interface GrowthState extends Record<GrowthKey, GrowthLever> {
  /** Global salary inflation applied from 2027 (per category, off the 2027 base). */
  salaryInflation: { rate: number; active: boolean };
}

export interface ModelState {
  /** Effective inputs fed to compute() (= applyGrowth(base, growth)). */
  inputs: ModelInputs;
  /** Editable inputs before growth levers are applied. */
  base: ModelInputs;
  eventToggles: Record<string, boolean>;
  orgToggles: Record<string, boolean>;
  growth: GrowthState;
}

type Toggles = Record<string, boolean>;

const allOn = (items: { id: string }[]): Toggles =>
  Object.fromEntries(items.map((i) => [i.id, true]));

function deriveEventsBaseAnnual(t: Toggles): number {
  return EVENT_SHOWS.filter((e) => t[e.id]).reduce((s, e) => s + e.cost, 0);
}
function deriveMembershipsAnnual(t: Toggles): number {
  return ORG_MEMBERSHIPS.filter((o) => t[o.id]).reduce((s, o) => s + o.dues, 0);
}

export function defaultGrowth(): GrowthState {
  const f = DEFAULT_INPUTS;
  return {
    customersEOY: { first: f.customersEOY[1], rate: 1.0, active: false },
    annualChurn: { first: f.annualChurn[1], rate: -0.08, active: false },
    social: { first: f.social[1], rate: 0, active: false },
    digital: { first: f.digital[1], rate: 0.35, active: false },
    national: { first: f.national[2], rate: 0.3, active: false },
    gAndA: { first: f.gAndA[1], rate: 0.4, active: false },
    salaryInflation: { rate: 0.05, active: false },
  };
}

/** [year0kept, first, first*(1+r), …] across the 6 model years. */
function geomSeries(year0: number, first: number, rate: number): number[] {
  const arr = [year0];
  for (let y = 1; y < 6; y++) arr.push(first * Math.pow(1 + rate, y - 1));
  return arr;
}

/** Effective inputs = base with any active growth lever regenerating its series. */
function applyGrowth(base: ModelInputs, g: GrowthState): ModelInputs {
  const out: ModelInputs = { ...base };
  const keys: GrowthKey[] = ["customersEOY", "annualChurn", "social", "digital", "national", "gAndA"];
  for (const k of keys) {
    const lever = g[k];
    if (!lever.active) continue;
    const y0 = DEFAULT_INPUTS[k][0];
    let arr = geomSeries(y0, lever.first, lever.rate);
    arr = k === "annualChurn" ? arr.map((v) => Math.max(0, v)) : arr.map((v) => Math.round(v));
    out[k] = arr;
  }
  if (g.salaryInflation.active) {
    const infl = g.salaryInflation.rate;
    out.staff = DEFAULT_INPUTS.staff.map((c) => ({
      ...c,
      sal: c.sal.map((s, y) => (y === 0 ? s : Math.round(c.sal[1] * Math.pow(1 + infl, y - 1)))),
    }));
  }
  return out;
}

function makeState(base: ModelInputs, eventToggles: Toggles, orgToggles: Toggles, growth: GrowthState): ModelState {
  const withToggles: ModelInputs = {
    ...base,
    eventsBaseAnnual: deriveEventsBaseAnnual(eventToggles),
    membershipsAnnual: deriveMembershipsAnnual(orgToggles),
  };
  return {
    base: withToggles,
    inputs: applyGrowth(withToggles, growth),
    eventToggles,
    orgToggles,
    growth,
  };
}

function baseState(): ModelState {
  return makeState({ ...DEFAULT_INPUTS }, allOn(EVENT_SHOWS), allOn(ORG_MEMBERSHIPS), defaultGrowth());
}

function loadState(): ModelState {
  const fresh = baseState();
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return fresh;
    const saved = JSON.parse(raw) as Partial<ModelState>;
    const eventToggles = { ...fresh.eventToggles, ...(saved.eventToggles ?? {}) };
    const orgToggles = { ...fresh.orgToggles, ...(saved.orgToggles ?? {}) };
    const growth: GrowthState = { ...fresh.growth, ...(saved.growth ?? {}) };
    // Merge editable fields over defaults; keep structural constants fresh.
    const base: ModelInputs = {
      ...fresh.base,
      ...(saved.base ?? {}),
      staff: DEFAULT_INPUTS.staff,
      seasonal: DEFAULT_INPUTS.seasonal,
      eventTiming: DEFAULT_INPUTS.eventTiming,
      fall2026: DEFAULT_INPUTS.fall2026,
      eventYearFactor: DEFAULT_INPUTS.eventYearFactor,
    };
    return makeState(base, eventToggles, orgToggles, growth);
  } catch {
    return fresh;
  }
}

/** The untouched all-Y base case — a fixed reference for "Δ to base" readouts. */
export const BASE_RESULT: ModelResult = compute(baseState().inputs);

let state: ModelState = loadState();
const listeners = new Set<() => void>();

function persist() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({ base: state.base, eventToggles: state.eventToggles, orgToggles: state.orgToggles, growth: state.growth }));
  } catch {
    /* storage-restricted context — run in-memory only */
  }
}

function setState(next: ModelState) {
  state = next;
  persist();
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

const getState = () => state;

// ── memoized compute(): recompute only when effective inputs change ───────────
let memoInputs: ModelInputs | null = null;
let memoResult: ModelResult | null = null;
function getResult(): ModelResult {
  if (state.inputs !== memoInputs || memoResult === null) {
    memoInputs = state.inputs;
    memoResult = compute(state.inputs);
  }
  return memoResult;
}

/** Rebuild effective state from a mutated base/toggles/growth. */
function rebuild(parts: { base?: ModelInputs; eventToggles?: Toggles; orgToggles?: Toggles; growth?: GrowthState }) {
  const base = parts.base ?? state.base;
  const eventToggles = parts.eventToggles ?? state.eventToggles;
  const orgToggles = parts.orgToggles ?? state.orgToggles;
  const growth = parts.growth ?? state.growth;
  setState(makeState(base, eventToggles, orgToggles, growth));
}

// ── actions ─────────────────────────────────────────────────────────────────
export const modelStore = {
  getState,
  getResult,

  setAssumption<K extends keyof ModelInputs>(key: K, value: ModelInputs[K]) {
    rebuild({ base: { ...state.base, [key]: value } });
  },

  setInputArrayValue(
    key: "customersEOY" | "annualChurn" | "preSeasonCapture" | "presold" | "social" | "digital" | "national" | "gAndA" | "oneTime",
    index: number,
    value: number,
  ) {
    const arr = [...(state.base[key] as number[])];
    arr[index] = value;
    rebuild({ base: { ...state.base, [key]: arr } });
  },

  /** Set a growth lever (first / rate / active). */
  setGrowth(key: GrowthKey, partial: Partial<GrowthLever>) {
    rebuild({ growth: { ...state.growth, [key]: { ...state.growth[key], ...partial } } });
  },

  setSalaryInflation(partial: Partial<{ rate: number; active: boolean }>) {
    rebuild({ growth: { ...state.growth, salaryInflation: { ...state.growth.salaryInflation, ...partial } } });
  },

  toggleEvent(id: string, included?: boolean) {
    rebuild({ eventToggles: { ...state.eventToggles, [id]: included ?? !state.eventToggles[id] } });
  },

  toggleOrg(id: string, included?: boolean) {
    rebuild({ orgToggles: { ...state.orgToggles, [id]: included ?? !state.orgToggles[id] } });
  },

  setRaiseAmount(value: number) {
    this.setAssumption("raiseAmount", value);
  },

  setDilution(value: number) {
    this.setAssumption("dilution", value);
  },

  setPostMoney(postMoney: number) {
    if (postMoney <= 0) return;
    this.setAssumption("dilution", state.base.raiseAmount / postMoney);
  },

  resetToBaseCase() {
    setState(baseState());
  },
};

// ── hooks ─────────────────────────────────────────────────────────────────
export function useModelState(): ModelState {
  return useSyncExternalStore(subscribe, getState, getState);
}

export function useModelResult(): ModelResult {
  return useSyncExternalStore(subscribe, getResult, getResult);
}

export function useModel() {
  const state = useModelState();
  const result = getResult();
  return { ...state, result, actions: modelStore };
}
