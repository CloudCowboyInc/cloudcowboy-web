import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MailCheck, Lock, AlertCircle } from "lucide-react";

export default function Login() {
  const { configured, signIn, email: sessionEmail, isAllowed, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const { error } = await signIn(email);
    setBusy(false);
    if (error) setErr(error);
    else setSent(true);
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-4 pt-20">
      <Helmet><title>Sign in · Cloud Cowboy</title><meta name="robots" content="noindex" /></Helmet>
      <Card className="w-full border-border/60 bg-card/70 p-8">
        <div className="mb-5 flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          <h1 className="font-display text-2xl font-bold">Member sign in</h1>
        </div>

        {!configured && (
          <div className="mb-4 flex items-start gap-2 rounded-md border border-primary/30 bg-primary/5 p-3 text-xs text-muted-foreground">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            Backend not configured yet. Add Supabase keys (see CRM_SETUP.md) to enable sign in.
          </div>
        )}

        {!loading && sessionEmail && !isAllowed && (
          <div className="mb-4 rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-muted-foreground">
            You're signed in as <span className="text-foreground">{sessionEmail}</span> but
            not yet approved. Request access below — an admin will review it.
          </div>
        )}

        {sent ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <MailCheck className="h-10 w-10 text-primary" />
            <p className="font-display text-lg">Check your email</p>
            <p className="text-sm text-muted-foreground">
              We sent a one-time sign-in link to <span className="text-foreground">{email}</span>.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <Input
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {err && <p className="text-xs text-destructive">{err}</p>}
            <Button type="submit" className="w-full" disabled={busy || !configured}>
              {busy ? "Sending…" : "Send magic link"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              No password. We email you a secure one-time link.
            </p>
          </form>
        )}

        <div className="mt-6 border-t border-border pt-4 text-center text-xs text-muted-foreground">
          Need access?{" "}
          <a href="/investors" className="text-primary hover:underline">Request it here</a>
        </div>
      </Card>
    </div>
  );
}
