import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { SEED_LEADS, type Lead, type PipelineStatus, type Readiness } from "@/data/leads";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

/**
 * CRM store.
 *
 * - Supabase configured  → reads/writes leads + interactions in Postgres (RLS-protected).
 * - Not configured       → Phase-1 behavior: local seed + localStorage persistence.
 *
 * Same interface either way, so components don't care which mode is active.
 */

export type InteractionType = "call" | "email" | "meeting" | "note";

export interface Interaction {
  id: string;
  leadId: string;
  type: InteractionType;
  date: string;
  summary: string;
}

const LS_STATUS = "cc_crm_status_overrides_v1";
const LS_INTERACTIONS = "cc_crm_interactions_v1";

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function rowToLead(r: any): Lead {
  return {
    id: r.id, name: r.name ?? "", dba: r.dba ?? "", contact: r.contact ?? "",
    aerial: !!r.aerial, codes: r.codes ?? [], phone: r.phone ?? "", email: r.email ?? "",
    website: r.website ?? "", city: r.city ?? "", county: r.county ?? "", state: r.state ?? "",
    zip: r.zip ?? "", lat: r.lat ?? null, lng: r.lng ?? null,
    employees: r.employees ?? "", revenue: r.revenue ?? "",
    status: (r.status ?? "New") as PipelineStatus, readiness: (r.readiness ?? "thin") as Readiness,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

interface CRMContextValue {
  leads: Lead[];
  interactions: Interaction[];
  loading: boolean;
  backend: "supabase" | "local";
  updateStatus: (leadId: string, status: PipelineStatus) => void;
  addInteraction: (i: Omit<Interaction, "id" | "date"> & { date?: string }) => void;
  interactionsFor: (leadId: string) => Interaction[];
}

const CRMContext = createContext<CRMContextValue | null>(null);

export function CRMProvider({ children }: { children: ReactNode }) {
  const useDb = isSupabaseConfigured && !!supabase;

  const [statusOverrides, setStatusOverrides] = useState<Record<string, PipelineStatus>>(
    () => (useDb ? {} : loadJSON(LS_STATUS, {}))
  );
  const [interactions, setInteractions] = useState<Interaction[]>(
    () => (useDb ? [] : loadJSON(LS_INTERACTIONS, []))
  );
  const [dbLeads, setDbLeads] = useState<Lead[] | null>(null);
  const [loading, setLoading] = useState(useDb);

  // Load from Supabase when configured.
  useEffect(() => {
    if (!useDb || !supabase) return;
    (async () => {
      const [{ data: leadRows }, { data: interRows }] = await Promise.all([
        supabase.from("leads").select("*").order("name"),
        supabase.from("interactions").select("*").order("created_at", { ascending: false }),
      ]);
      if (leadRows) setDbLeads(leadRows.map(rowToLead));
      if (interRows)
        setInteractions(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          interRows.map((r: any) => ({
            id: r.id, leadId: r.lead_id, type: r.type, date: r.created_at, summary: r.summary,
          }))
        );
      setLoading(false);
    })();
  }, [useDb]);

  // Persist locally only in local mode.
  useEffect(() => {
    if (!useDb) localStorage.setItem(LS_STATUS, JSON.stringify(statusOverrides));
  }, [statusOverrides, useDb]);
  useEffect(() => {
    if (!useDb) localStorage.setItem(LS_INTERACTIONS, JSON.stringify(interactions));
  }, [interactions, useDb]);

  const leads = useMemo<Lead[]>(() => {
    const base = useDb && dbLeads ? dbLeads : SEED_LEADS;
    return base.map((l) =>
      statusOverrides[l.id] ? { ...l, status: statusOverrides[l.id] } : l
    );
  }, [useDb, dbLeads, statusOverrides]);

  const value: CRMContextValue = {
    leads,
    interactions,
    loading,
    backend: useDb ? "supabase" : "local",
    updateStatus: (leadId, status) => {
      setStatusOverrides((prev) => ({ ...prev, [leadId]: status }));
      if (useDb && supabase)
        supabase.from("leads").update({ status, updated_at: new Date().toISOString() }).eq("id", leadId).then();
    },
    addInteraction: (i) => {
      const local: Interaction = {
        id: `I${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
        date: i.date ?? new Date().toISOString(),
        leadId: i.leadId, type: i.type, summary: i.summary,
      };
      setInteractions((prev) => [local, ...prev]);
      if (useDb && supabase)
        supabase.from("interactions").insert({ lead_id: i.leadId, type: i.type, summary: i.summary }).then();
    },
    interactionsFor: (leadId) =>
      interactions.filter((x) => x.leadId === leadId).sort((a, b) => b.date.localeCompare(a.date)),
  };

  return <CRMContext.Provider value={value}>{children}</CRMContext.Provider>;
}

export function useCRM() {
  const ctx = useContext(CRMContext);
  if (!ctx) throw new Error("useCRM must be used within CRMProvider");
  return ctx;
}
