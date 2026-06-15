import { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface AccessRequest {
  id: string; email: string; name: string | null; org: string | null;
  note: string | null; status: string; requested_at: string;
}
interface AllowRow { email: string; role: string; created_at: string; }

export default function Admin() {
  const { email: adminEmail } = useAuth();
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [allow, setAllow] = useState<AllowRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!supabase) return;
    const [{ data: reqs }, { data: rows }] = await Promise.all([
      supabase.from("access_requests").select("*").order("requested_at", { ascending: false }),
      supabase.from("allowlist").select("*").order("created_at", { ascending: false }),
    ]);
    setRequests((reqs as AccessRequest[]) ?? []);
    setAllow((rows as AllowRow[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const approve = async (r: AccessRequest, role: "investor" | "admin") => {
    if (!supabase) return;
    const e1 = await supabase.from("allowlist")
      .upsert({ email: r.email.toLowerCase(), role, approved_by: adminEmail });
    const e2 = await supabase.from("access_requests")
      .update({ status: "approved" }).eq("id", r.id);
    if (e1.error || e2.error) return toast.error(e1.error?.message || e2.error?.message);
    supabase.functions.invoke("notify-decision", { body: { email: r.email, decision: "approved" } }).catch(() => {});
    toast.success(`Approved ${r.email} as ${role}`);
    load();
  };

  const deny = async (r: AccessRequest) => {
    if (!supabase) return;
    const { error } = await supabase.from("access_requests")
      .update({ status: "denied" }).eq("id", r.id);
    if (error) return toast.error(error.message);
    supabase.functions.invoke("notify-decision", { body: { email: r.email, decision: "denied" } }).catch(() => {});
    toast.success(`Denied ${r.email}`);
    load();
  };

  const revoke = async (row: AllowRow) => {
    if (!supabase) return;
    const { error } = await supabase.from("allowlist").delete().eq("email", row.email);
    if (error) return toast.error(error.message);
    toast.success(`Revoked ${row.email}`);
    load();
  };

  const pending = requests.filter((r) => r.status === "pending");

  return (
    <div className="relative z-10 mx-auto max-w-5xl px-4 pb-24 pt-28 md:px-8">
      <Helmet><title>Admin · Access Requests</title><meta name="robots" content="noindex" /></Helmet>
      <h1 className="mb-6 font-display text-3xl font-bold">
        <span className="text-gradient-primary">Access</span> Admin
      </h1>

      <h2 className="mb-3 font-display text-lg">Pending requests ({pending.length})</h2>
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : pending.length === 0 ? (
        <p className="text-sm text-muted-foreground">No pending requests.</p>
      ) : (
        <div className="space-y-3">
          {pending.map((r) => (
            <Card key={r.id} className="flex flex-wrap items-center justify-between gap-3 border-border/60 bg-card/60 p-4">
              <div className="text-sm">
                <div className="font-medium text-foreground">{r.email}</div>
                <div className="text-muted-foreground">
                  {[r.name, r.org].filter(Boolean).join(" · ") || "—"}
                </div>
                {r.note && <div className="mt-1 text-xs italic text-muted-foreground">"{r.note}"</div>}
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => approve(r, "investor")}>Approve</Button>
                <Button size="sm" variant="outline" onClick={() => approve(r, "admin")}>Approve as admin</Button>
                <Button size="sm" variant="ghost" onClick={() => deny(r)}>Deny</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <h2 className="mb-3 mt-10 font-display text-lg">Approved members ({allow.length})</h2>
      <div className="space-y-2">
        {allow.map((row) => (
          <div key={row.email} className="flex items-center justify-between rounded-md border border-border/60 bg-card/40 px-4 py-2 text-sm">
            <span className="flex items-center gap-2">
              <span className="text-foreground">{row.email}</span>
              <Badge variant={row.role === "admin" ? "default" : "outline"}>{row.role}</Badge>
            </span>
            <Button size="sm" variant="ghost" className="text-destructive" onClick={() => revoke(row)}>
              Revoke
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
