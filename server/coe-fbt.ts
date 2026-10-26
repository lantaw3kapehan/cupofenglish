// CupOfEnglish · coe-fbt (26 Oct 2026) · one teacher's monthly feedback for a student, straight from the database (management only).
// POST { token, code, teacher } → { ok, course (book the student takes with that teacher, from the calendar), book, hist: [ per cycle,
// latest submission wins: the app's save (writes tFbSubmit) or Google's FEEDBACK DATA copy ] } — SQL function coe_fb_teacher. Read-only.
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
  const code = String(b.code || "").trim().toUpperCase(), teacher = String(b.teacher || "").trim().slice(0, 60);
  if (!/^ST-\d{4}-\d{3}$/.test(code) || !teacher) return out({ ok: false, error: "bad request" }, 400);
  const { data, error } = await db.rpc("coe_fb_teacher", { p_code: code, p_teacher: teacher });
  if (error) return out({ ok: false, error: "db" }, 500);
  return out(data || { ok: false });
});
