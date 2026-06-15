// notify-decision — emails a requester when an admin approves or denies them.
// Deploy normally (admin-only):  supabase functions deploy notify-decision
// Secrets: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, FROM_EMAIL, SITE_URL
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-api-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const jwt = (req.headers.get("Authorization") ?? "").replace("Bearer ", "");
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    // Confirm caller is an admin.
    const { data: userData } = await admin.auth.getUser(jwt);
    const caller = userData?.user?.email?.toLowerCase();
    if (!caller) return json({ error: "Not authenticated" }, 401);
    const { data: row } = await admin.from("allowlist").select("role").eq("email", caller).maybeSingle();
    if (row?.role !== "admin") return json({ error: "Forbidden" }, 403);

    const { email, decision } = await req.json();
    if (!email || !["approved", "denied"].includes(decision))
      return json({ error: "email + decision required" }, 400);

    const site = Deno.env.get("SITE_URL") ?? "";
    const html = decision === "approved"
      ? `<h2>You're approved 🎉</h2><p>Your Cloud Cowboy investor access is approved.</p>
         <p><a href="${site}/login">Sign in here →</a> — enter this email and we'll send you a one-time link.</p>`
      : `<h2>Access request update</h2><p>Thank you for your interest in Cloud Cowboy. We're unable to grant access at this time.</p>`;
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: Deno.env.get("FROM_EMAIL"), to: email,
        subject: decision === "approved" ? "You're approved — Cloud Cowboy" : "Cloud Cowboy access request",
        html,
      }),
    });
    return json({ sent: res.ok ? 1 : 0 });
  } catch (e) { return json({ error: String(e) }, 500); }
});
function json(o: unknown, s = 200) {
  return new Response(JSON.stringify(o), { status: s, headers: { ...cors, "Content-Type": "application/json" } });
}
