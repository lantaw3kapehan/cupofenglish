// CupOfEnglish · coe-pcf (26 Oct 2026) · the progress-check form, straight from the database (Google's tPcForm took ~14 s).
// POST { token, code } (a signed-in teacher who teaches that student, or management) → the same shape as Google's tPcForm:
// { ok, rate, levels, student: { code }, trial, done, notes, ended, fb, db: true } — SQL function coe_pc_form. Read-only.
// trial = TR-DATA, done = PR-DATA (+ progress checks sent in the app after Google's last copy of PR-DATA), notes = S-NOTES
// (+ kinds from S-NOTE-TAGS), fb = the last two monthly feedbacks (FEEDBACK DATA copy), rate/levels = the form's fixed questions.
// The app fills the student's name, Chinese name, book and lessons from the teacher's own list, as before.
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
  const code = String(b.code || "").trim().toUpperCase(); if (!/^ST-\d{4}-\d{3}$/.test(code)) return out({ ok: false, error: "bad request" }, 400);
  if (s.mode !== "mgmt") {   // a teacher: only a student they teach (a class with them in the last 120 days or ahead)
    const who = String(s.name || "").trim().toLowerCase(), since = new Date(Date.now() - 120 * 864e5).toISOString();
    if (!who) return out({ ok: false, error: "NOT_MINE" });
    const { data: cl } = await db.from("classes").select("id").eq("code", code).gte("starts_at", since).eq("teachers->>0", who).limit(1);
    if (!(cl || []).length) return out({ ok: false, error: "NOT_MINE" });
  }
  const { data, error } = await db.rpc("coe_pc_form", { p_code: code, p_until: null });
  if (error || !data || !Array.isArray(data.rate)) return out({ ok: false, error: "db" }, 500);
  return out(data);
});
