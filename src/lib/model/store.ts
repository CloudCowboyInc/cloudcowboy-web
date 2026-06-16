/**
 * Shared model store — the "dynamic connection" between the GTM toggles, the
 * Finance assumptions, and the proforma. One singleton, read by all three
 * data-room pages via useSyncExternalStore (no Provider, no JSX → stays a .ts).
 *
 * Holds editable assumptions, event/org toggles, and raise/valuation. Derives
 * eventsBaseAnnual / membershipsAnnual from the toggles, memoizes compute(),
 * and persists to localStorage (guarded for storage-restricted contexts).
 */
import { useSyncExternalStore } from "react";
import { compute } from "./engine";
import { DEFAULT_INPUTS, EVENT_SHOWS, ORG_MEMBERSHIPS } from "./data";
import type { ModelInputs, ModelResult } from "./types";

const LS_KEY = "cc_model_store_v1";

export interface ModelState {
  inputs: ModelInputs;
  eventToggles: Record<string, boolean>;
  orgToggles: Record<string, boolean>;
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

function baseState(): ModelState {
  const eventToggles = allOn(EVENT_SHOWS);
  const orgToggles = allOn(ORG_MEMBERSHIPS);
  return {
    inputs: {
      ...DEFAULT_INPUTS,
      eventsBaseAnnual: deriveEventsBaseAnnual(eventToggles),
      membershipsAnnual: deriveMembershipsAnnual(orgToggles),
    },
    eventToggles,
    orgToggles,
  };
}

function loadState(): ModelState {
  const fresh = baseState();
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return fresh;
    const saved = JSON.parse(raw) as Partial<ModelState>;
    const eventToggles = { ...fresh.eventToggles, ...(saved.eventToggles ?? {}) };
    const orgToggles = { ...fresh.orgToggles, ...(saved.orgToggles ?? {}) };
    // Merge editable fields over defaults; keep structural constants fresh so
    // spec/data changes always win over anything persisted.
    const inputs: ModelInputs = {
      ...fresh.inputs,
      ...(saved.inputs ?? {}),
      staff: DEFAULT_INPUTS.staff,
      seasonal: DEFAULT_INPUTS.seasonal,
      eventTiming: DEFAULT_INPUTS.eventTiming,
      fall2026: DEFAULT_INPUTS.fall2026,
      eventYearFactor: DEFAULT_INPUTS.eventYearFactor,
      eventsBaseAnnual: deriveEventsBaseAnnual(eventToggles),
      membershipsAnnual: deriveMembershipsAnnual(orgToggles),
    };
    return { inputs, eventToggles, orgToggles };
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
    localStorage.setItem(LS_KEY, JSON.stringify(state));
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

// ── memoized compute(): recompute only when inputs reference changes ─────────
let memoInputs: ModelInputs | null = null;
let memoResult: ModelResult | null = null;
function getResult(): ModelResult {
  if (state.inputs !== memoInputs || memoResult === null) {
    memoInputs = state.inputs;
    memoResult = compute(state.inputs);
  }
  return memoResult;
}

// ── actions ─────────────────────────────────────────────────────────────────
export const modelStore = {
  getState,
  getResult,

  setAssumption<K extends keyof ModelInputs>(key: K, value: ModelInputs[K]) {
    setState({ ...state, inputs: { ...state.inputs, [key]: value } });
  },

  /** Set one element of a per-year array input (e.g. customersEOY[2]). */
  setInputArrayValue(
    key: "customersEOY" | "annualChurn" | "preSeasonCapture" | "presold" | "social" | "digital" | "national" | "gAndA" | "oneTime",
    index: number,
    value: number,
  ) {
    const arr = [...(state.inputs[key] as number[])];
    arr[index] = value;
    setState({ ...state, inputs: { ...state.inputs, [key]: arr } });
  },

  toggleEvent(id: string, included?: boolean) {
    const eventToggles = { ...state.eventToggles, [id]: included ?? !state.eventToggles[id] };
    setState({
      ...state,
      eventToggles,
      inputs: { ...state.inputs, eventsBaseAnnual: deriveEventsBaseAnnual(eventToggles) },
    });
  },

  toggleOrg(id: string, included?: boolean) {
    const orgToggles = { ...state.orgToggles, [id]: included ?? !state.orgToggles[id] };
    setState({
      ...state,
      orgToggles,
      inputs: { ...state.inputs, membershipsAnnual: deriveMembershipsAnnual(orgToggles) },
    });
  },

  setRaiseAmount(value: number) {
    this.setAssumption("raiseAmount", value);
  },

  setDilution(value: number) {
    this.setAssumption("dilution", value);
  },

  /** Edit post-money directly; dilution is derived (postMoney = raise / dilution). */
  setPostMoney(postMoney: number) {
    if (postMoney <= 0) return;
    this.setAssumption("dilution", state.inputs.raiseAmount / postMoney);
  },

  resetToBaseCase() {
    setState(baseState());
  },
};

// ── hooks ─────────────────────────────────────────────────────────────────
export function useModelState(): ModelState {
  return useSyncExternalStore(subscribe, getState, getState);
}

/** Subscribe to the memoized compute() result. */
export function useModelResult(): ModelResult {
  return useSyncExternalStore(subscribe, getResult, getResult);
}

/** Everything a page needs: live state, result, and the action set. */
export function useModel() {
  const state = useModelState();
  const result = getResult();
  return { ...state, result, actions: modelStore };
}
