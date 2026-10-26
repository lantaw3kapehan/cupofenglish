// CupOfEnglish · coe-db (26 Oct 2026) · management screens that only Google answered, now straight from the database. Read-only.
// POST { token, op, ... } — management sign-in only (the same people who could call Google's versions).
//   op "agree"     { code, key, name } → the same shape as Google's mgmtAgree  { ok, code, name, cn, pkg, city?, list[] }   (SQL coe_agree)
//                  from S-AGREE (agreements), ACTIVE (name, Chinese name, package) and DATABASE (city).
//   op "classinfo" { ev: { id, start, teacher, ... } } → Google's mgmtClassInfo { ok, ci, day, now, vid, db: true }   (SQL coe_class_info)
//                  ci / day from T-TIMEIN (the sheet's copy, which carries management's decisions, else the app's own log row);
//                  vid only for videos uploaded in the app (Google still adds Drive-found videos and the student's folder behind).
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: s } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!s || new Date(s.exp).getTime() < Date.now() || s.mode !== "mgmt") return out({ ok: false, error: "AUTH" }, 401);
  const t0 = Date.now();
  if (b.op === "agree") {
    const { data, error } = await db.rpc("coe_agree", { p_code: String(b.code || "").slice(0, 20), p_key: String(b.key || "").slice(0, 200), p_name: String(b.name || "").slice(0, 120) });
    if (error || !data) return out({ ok: false, error: "db" }, 500);
    return out(Object.assign(data, { ms: Date.now() - t0 }));
  }
  if (b.op === "classinfo") {
    const ev = b.ev && typeof b.ev === "object" ? b.ev : null;
    if (!ev || !ev.id || !ev.start || !ev.teacher) return out({ ok: false, error: "bad request" }, 400);
    const { data, error } = await db.rpc("coe_class_info", { p_ev: { id: String(ev.id).slice(0, 120), start: String(ev.start).slice(0, 40), teacher: String(ev.teacher).slice(0, 60) } });
    if (error || !data) return out({ ok: false, error: "db" }, 500);
    return out(Object.assign(data, { ms: Date.now() - t0 }));
  }
  return out({ ok: false, error: "unknown op" }, 400);
});
