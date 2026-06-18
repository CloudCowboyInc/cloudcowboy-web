import { useEffect, useMemo, useState, useCallback } from "react";
import { Clock, FileSpreadsheet, MessageSquare, Send, CornerDownRight, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import {
  adminConfigs, adminActivity, adminComments, adminReply,
  type ConfigRow, type ActivityRow, type CommentRow,
} from "@/lib/investor/backend";
import { compactUSD } from "@/lib/model/format";
import { cn } from "@/lib/utils";

function dur(seconds: number): string {
  const s = Math.round(seconds);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ${s % 60}s`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}
function ago(iso: string): string {
  const d = (Date.now() - new Date(iso).getTime()) / 1000;
  if (d < 60) return "just now";
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return `${Math.floor(d / 86400)}d ago`;
}

interface Investor {
  email: string;
  totalTime: number;
  perSection: Record<string, number>;
  lastActive: string | null;
  exports: number;
  config: ConfigRow | null;
  comments: CommentRow[];
}

export default function InvestorsBoard() {
  const { email: adminEmail } = useAuth();
  const [configs, setConfigs] = useState<ConfigRow[]>([]);
  const [activity, setActivity] = useState<ActivityRow[]>([]);
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    const [c, a, m] = await Promise.all([adminConfigs(), adminActivity(), adminComments()]);
    setConfigs(c);
    setActivity(a);
    setComments(m);
    setLoading(false);
  }, []);

  // Auto-refresh so investor activity shows live as they browse — not only when
  // they export. Silent refresh every 15s, plus an immediate one when the admin
  // tab regains focus.
  useEffect(() => {
    void load();
    const iv = setInterval(() => void load(), 15000);
    const onVis = () => { if (document.visibilityState === "visible") void load(); };
    document.addEventListener("visibilitychange", onVis);
    return () => { clearInterval(iv); document.removeEventListener("visibilitychange", onVis); };
  }, [load]);

  const investors = useMemo<Investor[]>(() => {
    const emails = new Set<string>();
    configs.forEach((c) => emails.add(c.email));
    activity.forEach((a) => emails.add(a.email));
    comments.forEach((m) => emails.add(m.email));
    return Array.from(emails)
      .map((email) => {
        const acts = activity.filter((a) => a.email === email);
        const perSection: Record<string, number> = {};
        let totalTime = 0;
        let lastActive: string | null = null;
        let exports = 0;
        for (const a of acts) {
          if (a.kind === "time") {
            perSection[a.section] = (perSection[a.section] ?? 0) + a.seconds;
            totalTime += a.seconds;
          }
          if (a.kind === "export") exports++;
          if (!lastActive || a.occurred_at > lastActive) lastActive = a.occurred_at;
        }
        return {
          email,
          totalTime,
          perSection,
          lastActive,
          exports,
          config: configs.find((c) => c.email === email) ?? null,
          comments: comments.filter((m) => m.email === email),
        };
      })
      .sort((a, b) => b.totalTime - a.totalTime);
  }, [configs, activity, comments]);

  const current = investors.find((i) => i.email === selected) ?? investors[0] ?? null;

  const sendReply = async (id: string) => {
    const text = (replyText[id] ?? "").trim();
    if (!text) return;
    await adminReply(id, text, adminEmail);
    setReplyText((p) => ({ ...p, [id]: "" }));
    toast.success("Reply saved");
    load();
  };

  if (loading) return <p className="text-sm text-muted-foreground">Loading investor activity…</p>;
  if (investors.length === 0)
    return <p className="text-sm text-muted-foreground">No investor activity yet. Configs, time-on-section, exports and feedback will appear here as investors use the data room.</p>;

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      {/* Investor list — ranked by engagement */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold uppercase tracking-wide text-primary">Investors · by time spent</div>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground" title="Auto-refreshing every 15s">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Live
          </span>
        </div>
        {investors.map((inv) => {
          const activeNow = !!inv.lastActive && Date.now() - new Date(inv.lastActive).getTime() < 60000;
          return (
          <button
            key={inv.email}
            type="button"
            onClick={() => setSelected(inv.email)}
            className={cn(
              "w-full rounded-lg border p-3 text-left transition-colors",
              current?.email === inv.email ? "border-primary/50 bg-primary/10" : "border-border/60 bg-card/40 hover:bg-card/70",
            )}
          >
            <div className="flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4 text-muted-foreground" /> <span className="truncate">{inv.email}</span>
              {activeNow && (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-medium text-emerald-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> active now
                </span>
              )}
            </div>
            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {dur(inv.totalTime)}</span>
              <span className="inline-flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {inv.comments.length}</span>
              {inv.exports > 0 && <span className="inline-flex items-center gap-1"><FileSpreadsheet className="h-3 w-3" /> {inv.exports}</span>}
              {inv.lastActive && <span>· {ago(inv.lastActive)}</span>}
            </div>
          </button>
          );
        })}
      </div>

      {/* Selected investor profile */}
      {current && (
        <div className="space-y-5">
          <div>
            <h3 className="font-display text-lg font-bold">{current.email}</h3>
            <p className="text-xs text-muted-foreground">
              {dur(current.totalTime)} total · {current.exports} export(s)
              {current.lastActive ? ` · last active ${ago(current.lastActive)}` : ""}
            </p>
          </div>

          {/* Time per section */}
          <Card className="border-border/60 bg-card/50 p-4">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary">Time per section</div>
            {Object.keys(current.perSection).length === 0 ? (
              <p className="text-sm text-muted-foreground">No section time recorded yet.</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(current.perSection).sort((a, b) => b[1] - a[1]).map(([section, secs]) => {
                  const max = Math.max(...Object.values(current.perSection));
                  return (
                    <div key={section}>
                      <div className="mb-0.5 flex justify-between text-xs">
                        <span className="text-foreground/90">{section}</span>
                        <span className="text-muted-foreground tabular-nums">{dur(secs)}</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${(secs / max) * 100}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Current configuration */}
          <Card className="border-border/60 bg-card/50 p-4">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary">Current configuration</div>
            {current.config ? <ConfigSummary config={current.config} /> : <p className="text-sm text-muted-foreground">No saved configuration yet.</p>}
          </Card>

          {/* Feedback + reply */}
          <Card className="border-border/60 bg-card/50 p-4">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary">Feedback ({current.comments.length})</div>
            {current.comments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No notes yet.</p>
            ) : (
              <div className="space-y-3">
                {current.comments.map((c) => (
                  <div key={c.id} className="rounded-lg border border-border/50 bg-background/40 p-3">
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="font-medium text-primary">{c.section}</span>
                      <span className="text-muted-foreground">{ago(c.created_at)}</span>
                    </div>
                    <p className="text-sm text-foreground/90">{c.body}</p>
                    {c.reply ? (
                      <p className="mt-2 flex gap-1.5 rounded bg-primary/10 p-2 text-xs text-primary">
                        <CornerDownRight className="h-3.5 w-3.5 shrink-0" /> {c.reply}
                      </p>
                    ) : (
                      <div className="mt-2 flex gap-2">
                        <Textarea
                          value={replyText[c.id] ?? ""}
                          onChange={(e) => setReplyText((p) => ({ ...p, [c.id]: e.target.value }))}
                          placeholder="Reply to this note…"
                          className="min-h-[38px] text-sm"
                        />
                        <Button size="sm" className="shrink-0 gap-1.5" onClick={() => sendReply(c.id)}>
                          <Send className="h-4 w-4" /> Reply
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function ConfigSummary({ config }: { config: ConfigRow }) {
  const cfg = config.config as any;
  const m = cfg?.metrics ?? {};
  const base = cfg?.base ?? {};
  const tiles: { k: string; v: string }[] = [
    { k: "ARR 2031", v: m.arr5 != null ? compactUSD(m.arr5) : "—" },
    { k: "Year 5 valuation", v: m.valuation != null ? compactUSD(m.valuation) : "—" },
    { k: "Peak cash need", v: m.peakCashNeed != null ? compactUSD(m.peakCashNeed) : "—" },
    { k: "MOIC", v: m.moic != null ? `${Math.round(m.moic)}×` : "—" },
    { k: "Raise", v: base.raiseAmount != null ? compactUSD(base.raiseAmount) : "—" },
    { k: "Dilution", v: base.dilution != null ? `${Math.round(base.dilution * 100)}%` : "—" },
  ];
  return (
    <div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {tiles.map((t) => (
          <div key={t.k} className="rounded-lg border border-border/50 bg-background/40 p-2.5">
            <div className="font-display text-base font-bold">{t.v}</div>
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{t.k}</div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">
        Customers 2031: {base.customersEOY?.[5] ?? "—"} · saved {cfg?.savedAt ? ago(cfg.savedAt) : "—"}
      </p>
    </div>
  );
}
/* eslint-enable @typescript-eslint/no-explicit-any */
