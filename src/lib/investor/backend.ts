/**
 * Investor engagement backend — config auto-save, activity/time tracking,
 * section feedback, and export snapshots. Uses Supabase when configured;
 * otherwise falls back to localStorage so the UI still works in dev (the admin
 * view then reflects this browser only).
 */
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface ConfigRow {
  email: string;
  config: unknown;
  updated_at: string;
}
export interface ActivityRow {
  email: string;
  section: string;
  kind: "time" | "visit" | "export" | "comment";
  seconds: number;
  occurred_at: string;
}
export interface CommentRow {
  id: string;
  email: string;
  section: string;
  body: string;
  created_at: string;
  reply: string | null;
  replied_by: string | null;
  replied_at: string | null;
}

const live = () => isSupabaseConfigured && !!supabase;
const LS = {
  config: "cc_inv_config_v1",
  activity: "cc_inv_activity_v1",
  comments: "cc_inv_comments_v1",
};
function lsGet<T>(k: string, fb: T): T {
  try {
    const raw = localStorage.getItem(k);
    return raw ? (JSON.parse(raw) as T) : fb;
  } catch {
    return fb;
  }
}
function lsSet(k: string, v: unknown) {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {
    /* ignore */
  }
}
const LOCAL_EMAIL = "local@dev";
const email0 = (email: string | null) => (email || LOCAL_EMAIL).toLowerCase();

// ── investor-side writes ────────────────────────────────────────────────────
export async function saveConfig(email: string | null, config: unknown): Promise<void> {
  const e = email0(email);
  if (live()) {
    await supabase!.from("investor_configs").upsert({ email: e, config, updated_at: new Date().toISOString() }).then();
    return;
  }
  lsSet(LS.config, { email: e, config, updated_at: new Date().toISOString() });
}

export async function logActivity(
  email: string | null,
  section: string,
  kind: ActivityRow["kind"],
  seconds: number,
): Promise<void> {
  const e = email0(email);
  const row: ActivityRow = { email: e, section, kind, seconds: Math.round(seconds), occurred_at: new Date().toISOString() };
  if (live()) {
    await supabase!.from("investor_activity").insert(row).then();
    return;
  }
  const all = lsGet<ActivityRow[]>(LS.activity, []);
  all.push(row);
  lsSet(LS.activity, all.slice(-2000));
}

export async function addComment(email: string | null, section: string, body: string): Promise<void> {
  const e = email0(email);
  if (live()) {
    await supabase!.from("investor_comments").insert({ email: e, section, body }).then();
    await logActivity(email, section, "comment", 0);
    return;
  }
  const all = lsGet<CommentRow[]>(LS.comments, []);
  all.unshift({
    id: `c${Date.now()}`,
    email: e,
    section,
    body,
    created_at: new Date().toISOString(),
    reply: null,
    replied_by: null,
    replied_at: null,
  });
  lsSet(LS.comments, all);
}

export async function recordExport(
  email: string | null,
  config: unknown,
  xlsxBase64?: string,
): Promise<void> {
  const e = email0(email);
  await logActivity(email, "export", "export", 0);
  if (live()) {
    // Email Chris a copy of the workbook + snapshot the config (best effort).
    await supabase!.functions
      .invoke("send-config", { body: { email: e, config, xlsx: xlsxBase64 } })
      .catch(() => {});
    await supabase!.from("investor_exports").insert({ email: e, config }).then();
  }
}

/** ArrayBuffer → base64 (for emailing the generated workbook). */
export function bufferToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(bin);
}

export async function myComments(email: string | null, section: string): Promise<CommentRow[]> {
  const e = email0(email);
  if (live()) {
    const { data } = await supabase!
      .from("investor_comments")
      .select("*")
      .eq("email", e)
      .eq("section", section)
      .order("created_at", { ascending: false });
    return (data as CommentRow[]) ?? [];
  }
  return lsGet<CommentRow[]>(LS.comments, []).filter((c) => c.email === e && c.section === section);
}

// ── admin-side reads ────────────────────────────────────────────────────────
export async function adminConfigs(): Promise<ConfigRow[]> {
  if (live()) {
    const { data } = await supabase!.from("investor_configs").select("*").order("updated_at", { ascending: false });
    return (data as ConfigRow[]) ?? [];
  }
  const c = lsGet<ConfigRow | null>(LS.config, null);
  return c ? [c] : [];
}
export async function adminActivity(): Promise<ActivityRow[]> {
  if (live()) {
    const { data } = await supabase!.from("investor_activity").select("*").order("occurred_at", { ascending: false }).limit(5000);
    return (data as ActivityRow[]) ?? [];
  }
  return lsGet<ActivityRow[]>(LS.activity, []);
}
export async function adminComments(): Promise<CommentRow[]> {
  if (live()) {
    const { data } = await supabase!.from("investor_comments").select("*").order("created_at", { ascending: false }).limit(2000);
    return (data as CommentRow[]) ?? [];
  }
  return lsGet<CommentRow[]>(LS.comments, []);
}
export async function adminReply(id: string, reply: string, by: string | null): Promise<void> {
  if (live()) {
    await supabase!
      .from("investor_comments")
      .update({ reply, replied_by: by, replied_at: new Date().toISOString() })
      .eq("id", id)
      .then();
    return;
  }
  const all = lsGet<CommentRow[]>(LS.comments, []);
  const next = all.map((c) => (c.id === id ? { ...c, reply, replied_by: by, replied_at: new Date().toISOString() } : c));
  lsSet(LS.comments, next);
}
