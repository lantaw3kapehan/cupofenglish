// CupOfEnglish · coe-done (26 Oct 2026) · what this teacher has already done, from the database's confirmed saves (read-only).
// POST { token } (a teacher; management may pass { as }) → { ok, at, ack: [message ids], visit: [visit ids], trial: [{ d, s, c }], pc: [{ c, at }], peer: [ids] }
// Confirmed = writes rows with status "done" in the last 45 days. The app uses it so a to-do the teacher has finished does not
// stay on Today when Google's copy lags or skipped the step (e.g. a "Got it" recorded in the database only, a trial report dated
// a day after the calendar entry, a progress check sent before Google copied it).
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
  if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
  const who = String(s.mode === "mgmt" && b.as ? b.as : s.name || "").trim(); if (!who) return out({ ok: true, ack: [], visit: [], trial: [], pc: [], peer: [] });
  const { data: W, error } = await db.from("writes").select("fn,args,created_at").ilike("who", who).eq("status", "done")
    .in("fn", ["tMsgAck", "tVisitAck", "tTrialSubmit", "tPcSubmit", "tPeerSubmit"]).gte("created_at", new Date(Date.now() - 45 * 864e5).toISOString()).limit(2000);
  if (error) return out({ ok: false, error: "db" }, 500);
  const r = { ok: true, at: Date.now(), ack: [] as string[], visit: [] as string[], trial: [] as any[], pc: [] as any[], peer: [] as string[] };
  (W || []).forEach((w: any) => { const a = Array.isArray(w.args) ? w.args : [];
    if (w.fn === "tMsgAck" && a[1]) r.ack.push(String(a[1]));
    else if (w.fn === "tVisitAck" && a[1]) r.visit.push(String(a[1]));
    else if (w.fn === "tPeerSubmit" && a[1]) r.peer.push(String(a[1]));
    else if (w.fn === "tPcSubmit" && a[1]) r.pc.push({ c: String(a[1]).toUpperCase(), at: String(w.created_at) });
    else if (w.fn === "tTrialSubmit" && a[1] && typeof a[1] === "object") r.trial.push({ d: String(a[1].date || "").slice(0, 10), s: String(a[1].student || "").trim().toLowerCase(), c: String(a[1].code || "").trim().toUpperCase() }); });
  return out(r);
});
