// CupOfEnglish · coe-cases (1834, 7 Nov 2026; restored 8 Nov 1917): the Cases screen (mgmtActions) from the database,
// management only. coe_actions_screen() works it out from the database's case records (coe_rec_rows('ACTIONS')), so a case
// the database makes (late time-in, late class video, enrolment bonus) and every waive show at once.
// v6 (2539, 20 Nov): late-video cases management reviewed and kept (coe_ops_ok ref vidkeep:<case id>) come back with kept: true.
// POST { token } → { ok, data: { rows, lists, src: 'db' } }
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, st = 200) => new Response(JSON.stringify(o), { status: st, headers: { ...h, "Content-Type": "application/json" } });
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: ss } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!ss || new Date(ss.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
  if (ss.mode !== "mgmt") return out({ ok: false, error: "Management only" }, 403);
  const { data, error } = await db.rpc("coe_actions_screen");
  if (error || !data) return out({ ok: false, error: error ? error.message : "no data" }, 500);
  try {
    const { data: k } = await db.from("coe_ops_ok").select("ref").like("ref", "vidkeep:%");
    const K = new Set((k || []).map((x: any) => String(x.ref).slice(8)));
    if (K.size && Array.isArray(data.rows)) for (const r of data.rows) if (r && K.has(String(r.id))) r.kept = true;
  } catch (_e) { /* the list still works without it */ }
  return out({ ok: true, data });
});
