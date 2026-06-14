// Supabase Edge Function: send-bulk
// Sends a mass email to selected leads via Resend, then logs an interaction
// per recipient. Admin-only. Deploy with: supabase functions deploy send-bulk
//
// Required secrets (supabase secrets set ...):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, FROM_EMAIL
//
// deno-lint-ignore-file no-explicit-any
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const jwt = authHeader.replace("Bearer ", "");
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 1) Identify caller and confirm admin.
    const { data: userData } = await admin.auth.getUser(jwt);
    const email = userData?.user?.email?.toLowerCase();
    if (!email) return json({ error: "Not authenticated" }, 401);
    const { data: row } = await admin
      .from("allowlist").select("role").eq("email", email).maybeSingle();
    if (row?.role !== "admin") return json({ error: "Forbidden" }, 403);

    // 2) Read payload.
    const { leadIds, subject, body } = await req.json();
    if (!Array.isArray(leadIds) || !leadIds.length)
      return json({ error: "No recipients" }, 400);

    const { data: leads } = await admin
      .from("leads").select("id,email,dba,name").in("id", leadIds);
    const recipients = (leads ?? []).filter((l: any) => l.email);

    // 3) Send via Resend.
    const key = Deno.env.get("RESEND_API_KEY")!;
    const from = Deno.env.get("FROM_EMAIL") ?? "Cloud Cowboy <hello@cloudcowboy.us>";
    let sent = 0;
    for (const r of recipients) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from, to: r.email, subject, text: body }),
      });
      if (res.ok) {
        sent++;
        await admin.from("interactions").insert({
          lead_id: r.id, type: "email", author: email,
          summary: `Mass email — "${subject}"`,
        });
      }
    }
    return json({ sent, skipped: leadIds.length - sent });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}
