// CupOfEnglish · coe-mon (26 Oct 2026) · lessons per package per month, worked out by the database (coe_pkg_mon:
// October 2026 on = calendar classes that have ended; earlier months = S-MONTHLY; + month adjustments). Management only.
// POST { token } → { ok, at, rows: [[sheet_r, code, teacher, 'yyyy-mm', units], …] } — the same numbers that add up to
// lessons completed (coe_pkg_calc), so the Lesson summary history always matches the totals. Read-only.
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
  const { data, error } = await db.rpc("coe_pkg_mon_rows");
  if (error) return out({ ok: false, error: "db" }, 500);
  const rows = (data || []).map((x: any) => [x.sheet_r ?? null, x.code, x.teacher, x.m, Math.round(Number(x.v) * 10) / 10]);
  return out({ ok: true, at: Date.now(), rows });
});
