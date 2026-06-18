// Supabase Edge Function: send-config
// When an investor exports their model, email a copy of the workbook to Chris
// and snapshot the configuration to investor_exports for later reference.
// Deploy with: supabase functions deploy send-config
//
// Required secrets (supabase secrets set ...):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, FROM_EMAIL
//   TEAM_EMAIL (defaults to chris@cloudcowboy.us)
//
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-api-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const jwt = authHeader.replace("Bearer ", "");
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Identify the caller from their JWT.
    const { data: userData } = await admin.auth.getUser(jwt);
    const caller = userData?.user?.email?.toLowerCase();
    if (!caller) return json({ error: "Not authenticated" }, 401);

    const { config, xlsx } = await req.json().catch(() => ({}));
    if (!config) return json({ error: "Missing config" }, 400);

    // Snapshot the configuration (so the team can reference exact numbers).
    await admin.from("investor_exports").insert({ email: caller, config });

    // Email a copy to the team.
    const key = Deno.env.get("RESEND_API_KEY");
    const from = Deno.env.get("FROM_EMAIL") ?? "Cloud Cowboy <hello@cloudcowboy.us>";
    const team = Deno.env.get("TEAM_EMAIL") ?? "chris@cloudcowboy.us";
    const m = (config as { metrics?: Record<string, unknown> }).metrics ?? {};
    const stamp = new Date().toISOString().slice(0, 10);

    if (key) {
      const attachments = xlsx
        ? [{ filename: `cloud-cowboy-model-${caller}-${stamp}.xlsx`, content: xlsx }]
        : [];
      const summary = `
        <h2>Investor model export</h2>
        <p><strong>${caller}</strong> exported their configuration.</p>
        <ul>
          <li>ARR 2031: ${m.arr5 ?? "—"}</li>
          <li>Year-5 valuation: ${m.valuation ?? "—"}</li>
          <li>Peak cash need: ${m.peakCashNeed ?? "—"}</li>
          <li>MOIC: ${m.moic ?? "—"}</li>
        </ul>
        <p>The workbook is attached; the full configuration is saved in investor_exports.</p>
      `;
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from, to: [team], subject: `Investor export — ${caller}`, html: summary, attachments }),
      });
      if (!res.ok) {
        const t = await res.text();
        return json({ ok: true, emailed: false, note: `snapshot saved; email failed: ${t}` });
      }
    }

    return json({ ok: true, emailed: !!key });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
