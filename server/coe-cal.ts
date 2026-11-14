// CupOfEnglish · coe-cal (14 Nov 2026): management Schedule › Month. POST { token, from: 'YYYY-MM-DD', days } → per-day totals
// from the database function coe_month_overview (classes, cancelled, teachers, minutes, busiest hour, teachers on approved leave).
// Management sessions only (same session check as coe-invoice).
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
  const { data: s } = await db.from("app_sessions").select("mode,exp,name").eq("token_hash", await sha(token)).maybeSingle();
  if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
  // 14 Nov (2213): China dates list. cnGet = everyone signed in (teachers see the dates); cnSet = management only.
  if (b.action === "cnGet") { const { data } = await db.from("docs").select("data,updated_at").eq("key", "sys:cndates").maybeSingle(); return out({ ok: true, rows: data?.data?.rows || null, at: data?.updated_at || null, by: data?.data?.by || null }); }
  if (s.mode !== "mgmt") return out({ ok: false, error: "Management only." }, 403);
  if (b.action === "cnSet") {
    const R = Array.isArray(b.rows) ? b.rows.slice(0, 80) : null; if (!R) return out({ ok: false, error: "rows" }, 400);
    const D = /^\d{4}-\d{2}-\d{2}$/, rows = R.map((x: any) => ({ a: String(x.a || ""), b: String(x.b || x.a || ""), k: String(x.k || ""), n: String(x.n || "").slice(0, 80), t: String(x.t || "").slice(0, 160) }))
      .filter((x: any) => D.test(x.a) && D.test(x.b) && x.a <= x.b && /^[hxiw]$/.test(x.k) && x.n);
    const { error } = await db.from("docs").upsert({ key: "sys:cndates", scope: "mgmt", data: { rows, by: s.name || "", at: new Date().toISOString() }, updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (error) return out({ ok: false, error: error.message }, 500);
    return out({ ok: true, rows });
  }
  const from = String(b.from || ""); if (!/^\d{4}-\d{2}-\d{2}$/.test(from)) return out({ ok: false, error: "from" }, 400);
  const days = Math.max(1, Math.min(62, +b.days || 42));
  const { data, error } = await db.rpc("coe_month_overview", { p_from: from, p_days: days });
  if (error) return out({ ok: false, error: error.message }, 500);
  return out({ ok: true, days: data || [] });
});
