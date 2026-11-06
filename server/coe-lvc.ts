// coe-lvc v1 · 6 Nov 2026 · leave-card charge decisions, saved in the database first (table coe_leave_credit).
// POST { op: "set", token, leave_id, teacher, decision, lessons, total, tier, state, case_ids, id? } → { ok, id }
//   management only (app_sessions mode mgmt). With `id`, updates that row (state / case ids after the cases are created).
// The latest decision per notice is published in docs mgmt:feed1806 (dec) by coe_mgmt_feed_build(); this call rebuilds it at once.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
const DEC = new Set(["No charge", "Suggested", "All excused", "All unexcused"]);
Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: s } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!s || new Date(s.exp).getTime() < Date.now() || s.mode !== "mgmt") return out({ ok: false, error: "AUTH" }, 401);
  if (b.op !== "set") return out({ ok: false, error: "unknown op" }, 400);
  const str = (x: unknown, n = 60) => String(x == null ? "" : x).slice(0, n);
  const state = ["saving", "done", "partial"].includes(b.state) ? b.state : "done";
  const ids = (Array.isArray(b.case_ids) ? b.case_ids : []).map((x: unknown) => str(x, 20)).filter(Boolean).slice(0, 40);
  let id = Number(b.id) || 0;
  if (id) {
    const { error } = await db.from("coe_leave_credit").update({ state, case_ids: ids, updated_at: new Date().toISOString() }).eq("id", id).is("void_at", null);
    if (error) return out({ ok: false, error: "db" }, 500);
  } else {
    const decision = str(b.decision, 20); if (!DEC.has(decision)) return out({ ok: false, error: "decision" }, 400);
    const leave = str(b.leave_id, 40); if (!/^LV-\w+$/.test(leave)) return out({ ok: false, error: "leave_id" }, 400);
    const lessons = (Array.isArray(b.lessons) ? b.lessons : []).slice(0, 60).map((x: any) => ({ md: str(x.md, 8), hm: str(x.hm, 6), name: str(x.name, 60), k: str(x.k, 12), amount: Number(x.amount) || 0 }));
    const { data, error } = await db.from("coe_leave_credit").insert({ leave_id: leave, teacher: str(b.teacher, 40), decision, lessons, total: Number(b.total) || 0, tier: str(b.tier, 10), state, case_ids: ids, by_name: s.name || "" }).select("id").single();
    if (error || !data) return out({ ok: false, error: "db" }, 500);
    id = data.id;
  }
  try { await db.rpc("coe_mgmt_feed_build"); } catch (_e) { /* the minute job catches up */ }
  return out({ ok: true, id });
});
