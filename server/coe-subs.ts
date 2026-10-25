// CupOfEnglish · coe-subs (25 Oct 2026) · substitute lessons per package, worked out by the DATABASE (function coe_pkg_subs),
// so lessons finished / left in the app no longer depend on the sheet's SUB CLASS formula.
// POST { token } (management) → { ok, at, rows: [{ r, code, teacher, start, sub_sheet, sub_db }] } for every ACTIVE package row.
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
  const token = String(b.token ?? ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: se } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!se || new Date(se.exp).getTime() < Date.now() || se.mode !== "mgmt") return out({ ok: false, error: "AUTH" }, 401);
  const { data, error } = await db.rpc("coe_pkg_subs");
  if (error) return out({ ok: false, error: "db" }, 500);
  const rows = (data || []).map((x: any) => ({ r: x.r, code: x.code, teacher: x.teacher, start: x.start_at, sub_sheet: Number(x.sub_sheet) || 0, sub_db: Number(x.sub_db) || 0 }));
  return out({ ok: true, at: Date.now(), rows });
});
