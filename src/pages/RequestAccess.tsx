import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function RequestAccess() {
  const [form, setForm] = useState({ email: "", name: "", org: "", note: "" });
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!isSupabaseConfigured || !supabase) {
      setErr("Backend not configured yet. Please email hello@cloudcowboy.us.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("access_requests").insert({
      email: form.email.trim().toLowerCase(),
      name: form.name.trim() || null,
      org: form.org.trim() || null,
      note: form.note.trim() || null,
    });
    setBusy(false);
    if (error) setErr(error.message);
    else setDone(true);
  };

  return (
    <div className="mx-auto max-w-lg px-4 pb-24 pt-28">
      <Helmet><title>Investor Access · Cloud Cowboy</title></Helmet>
      <h1 className="font-display text-3xl font-bold md:text-4xl">
        <span className="text-gradient-primary">Investor</span> Access
      </h1>
      <p className="mt-2 text-muted-foreground">
        Our investor materials are private. Request access and we'll review it —
        once approved, you'll sign in with a one-time email link.
      </p>

      <Card className="mt-6 border-border/60 bg-card/70 p-6">
        {done ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="h-10 w-10 text-primary" />
            <p className="font-display text-lg">Request received</p>
            <p className="text-sm text-muted-foreground">
              Thanks — we'll review your request and email you when you're approved.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <Input type="email" required placeholder="Email *" value={form.email} onChange={set("email")} />
            <Input placeholder="Full name" value={form.name} onChange={set("name")} />
            <Input placeholder="Firm / organization" value={form.org} onChange={set("org")} />
            <Textarea placeholder="Anything we should know? (optional)" rows={3} value={form.note} onChange={set("note")} />
            {err && (
              <p className="flex items-center gap-1.5 text-xs text-destructive">
                <AlertCircle className="h-3.5 w-3.5" /> {err}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Submitting…" : "Request access"}
            </Button>
          </form>
        )}
      </Card>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Already approved? <a href="/login" className="text-primary hover:underline">Sign in</a>
      </p>
    </div>
  );
}
