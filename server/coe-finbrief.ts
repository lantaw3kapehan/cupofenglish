// CupOfEnglish · coe-finbrief v3 (2086 · op "growth": coe_fin_growth()) · v2 (2085 · the President's finance figures: op "settings" / "set", e.g. phpBank, rate) · v1 (11 Nov 2026, 2084 · Misty: Finance for the President "like an accounting manager and president POV").
// The President's Finance briefing: approvals (a paper trail only, nothing is blocked) and the manager's notes.
// POST { token, op: "get" }                                   → { ok, rows: [{ id, kind, ref, label, body, by, at }] } (last 200)
// POST { token, op: "add", kind, ref, label, body }           → { ok, row }   kind: note | approve | notyet | noted
// POST { token, op: "remove", id }                            → { ok }        (a note only; kept, marked removed)
// President only (a signed-in management session whose role is President), same rule as the President-only copies.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
const shape = (r: any) => ({ id: r.id, kind: r.kind, ref: r.ref, label: r.label, body: r.body, by: r.by_name, at: r.at });
Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: s } = await db.from("app_sessions").select("name,mode,role,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
  if (s.mode !== "mgmt" || !/president/i.test(String(s.role || ""))) return out({ ok: false, error: "President only" }, 403);
  const op = String(b.op || "");
  if (op === "get") {
    const { data, error } = await db.from("coe_fin_brief").select("*").is("removed_at", null).order("at", { ascending: false }).limit(200);
    if (error) return out({ ok: false, error: "db" }, 500);
    return out({ ok: true, rows: (data || []).map(shape) });
  }
  if (op === "add") {
    const kind = String(b.kind || "");
    if (!/^(note|approve|notyet|noted)$/.test(kind)) return out({ ok: false, error: "not allowed" }, 400);
    const row = { kind, ref: String(b.ref || "").slice(0, 80), label: String(b.label || "").slice(0, 300), body: String(b.body || "").slice(0, 4000), by_name: String(s.name || "") };
    if (kind === "note" && !row.body.trim()) return out({ ok: false, error: "Write a note first" }, 400);
    const { data, error } = await db.from("coe_fin_brief").insert(row).select("*").single();
    if (error || !data) return out({ ok: false, error: "not saved" }, 500);
    return out({ ok: true, row: shape(data) });
  }
  if (op === "remove") {
    const id = Number(b.id || 0); if (!id) return out({ ok: false, error: "not allowed" }, 400);
    const { error } = await db.from("coe_fin_brief").update({ removed_at: new Date().toISOString() }).eq("id", id).eq("kind", "note");
    if (error) return out({ ok: false, error: "not saved" }, 500);
    return out({ ok: true });
  }
  if (op === "growth") {   // v3 (2086): trials → students, renewals, what a lesson earns and costs, teacher room
    const { data, error } = await db.rpc("coe_fin_growth");
    if (error) return out({ ok: false, error: "db" }, 500);
    return out({ ok: true, growth: data });
  }
  if (op === "settings") {   // v2 (2085)
    const { data, error } = await db.from("coe_fin_settings").select("key,value,by_name,at");
    if (error) return out({ ok: false, error: "db" }, 500);
    const o: Record<string, any> = {}; for (const r of data || []) o[r.key] = { value: r.value, by: r.by_name, at: r.at };
    return out({ ok: true, settings: o });
  }
  if (op === "set") {   // v2 (2085): one figure at a time; a number, or { amount, date } and similar small objects
    const key = String(b.key || "");
    if (!/^(phpBank|rate|cushionMonths|items13|bir)$/.test(key)) return out({ ok: false, error: "not allowed" }, 400);
    const value = b.value; const txt = JSON.stringify(value === undefined ? null : value);
    if (txt.length > 4000) return out({ ok: false, error: "too big" }, 400);
    const { error } = await db.from("coe_fin_settings").upsert({ key, value: value === undefined ? null : value, by_name: String(s.name || ""), at: new Date().toISOString() }, { onConflict: "key" });
    if (error) return out({ ok: false, error: "not saved" }, 500);
    await db.from("coe_fin_brief").insert({ kind: "noted", ref: "set:" + key, label: "Updated " + key + " · " + txt.slice(0, 120), by_name: String(s.name || "") });
    return out({ ok: true });
  }
  return out({ ok: false, error: "unknown op" }, 400);
});
