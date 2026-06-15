// notify-access-request — emails all admins when someone requests access.
// Deploy WITHOUT jwt verification (requesters are anonymous):
//   supabase functions deploy notify-access-request --no-verify-jwt
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
    const { email, name, org, note } = await req.json();
    if (!email) return json({ error: "email required" }, 400);

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: admins } = await admin
      .from("allowlist").select("email").eq("role", "admin");
    const to = (admins ?? []).map((a: { email: string }) => a.email);
    if (!to.length) return json({ sent: 0 });

    const site = Deno.env.get("SITE_URL") ?? "";
    const html = `
      <h2>New investor access request</h2>
      <p><b>Email:</b> ${email}<br/>
      <b>Name:</b> ${name ?? "—"}<br/>
      <b>Firm:</b> ${org ?? "—"}<br/>
      <b>Note:</b> ${note ?? "—"}</p>
      <p><a href="${site}/admin">Review in the admin portal →</a></p>`;
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: Deno.env.get("FROM_EMAIL"), to, subject: `New access request: ${email}`, html }),
    });
    return json({ sent: res.ok ? to.length : 0 });
  } catch (e) { return json({ error: String(e) }, 500); }
});
function json(o: unknown, s = 200) {
  return new Response(JSON.stringify(o), { status: s, headers: { ...cors, "Content-Type": "application/json" } });
}
