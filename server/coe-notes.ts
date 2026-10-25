// CupOfEnglish · coe-notes (25 Oct 2026) · class notes for students shared by two teachers (e.g. Eleven: Julia ShortVowels + Kat OD1).
// POST { token, codes: ["ST-…"], teacher? } → { ok, notes: { CODE: { mine: last note by this teacher, ev: { eventId: note } (last 4 days, any teacher) } } }
// Teacher: own notes (teacher = me). Management may pass teacher.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
const s = (x: unknown) => String(x ?? "");
Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, st = 200) => new Response(JSON.stringify(o), { status: st, headers: { ...h, "Content-Type": "application/json" } });
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const token = s(b.token); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: se } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!se || new Date(se.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
  const lc = s(se.mode === "mgmt" && b.teacher ? b.teacher : se.name).trim().toLowerCase();
  const codes = (Array.isArray(b.codes) ? b.codes : []).map((c: any) => s(c).trim().toUpperCase()).filter((c: string) => /^ST-\d{4}-\d{3}$/.test(c)).slice(0, 80);
  if (!codes.length) return out({ ok: true, notes: {} });
  const { data, error } = await db.from("sheet_rows").select("data").eq("tab", "S-NOTES").in("data->>3", codes).limit(5000);
  if (error) return out({ ok: false, error: "db" }, 500);
  const recent = new Date(Date.now() + 8 * 3600e3 - 4 * 864e5).toISOString().slice(0, 10);
  const rows = (data || []).map((x: any) => x.data || []).filter((r: any[]) => r[3]).sort((p: any[], q: any[]) => s(q[0]).localeCompare(s(p[0])));   // newest saved first
  const notes: Record<string, any> = {};
  rows.forEach((r: any[]) => { const c = s(r[3]).toUpperCase(), by = s(r[2]).trim().toLowerCase(), ev = s(r[8]), dt = ISO.test(s(r[1])) ? s(r[1]).slice(0, 10) : s(r[1]);
    const o = { by: s(r[2]), date: dt, ended: s(r[5]), next: s(r[6]), homework: s(r[7]), eventId: ev, obs: s(r[9]), skills: s(r[10]), at: ISO.test(s(r[0])) ? s(r[0]).slice(11, 16) : "" };
    const n = notes[c] || (notes[c] = { mine: null, ev: {} });
    if (by === lc && !n.mine) n.mine = o;
    if (ev && dt >= recent && !n.ev[ev]) n.ev[ev] = o; });
  return out({ ok: true, notes });
});
