// CupOfEnglish · coe-stuext (2 Nov 2026): extra details about a student that the DATABASE sheet has no column for — for adults their
// occupation and industry (Misty: "for adult can we put on their profile their occupation and industry? like Mr David, Clothing Industry").
// Kept in the database only (docs `mgmt:stuext` = { "ST-…": { occ, ind, by, at } }); the sheet is not changed.
// POST { token, code } → { ok, x: { occ, ind, by, at } | null }   (management, or a teacher)
// POST { token, code, set: { occ, ind } } → { ok, x }             (management only; both empty = removed)
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
const clip = (x: unknown, n: number) => String(x ?? "").replace(/\s+/g, " ").trim().slice(0, n);
Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: s } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
  const code = clip(b.code, 20).toUpperCase(); if (!/^ST-\d{4}-\d{3}$/.test(code)) return out({ ok: false, error: "code" }, 400);
  for (let tries = 0; tries < 4; tries++) {
    const { data: row } = await db.from("docs").select("data,updated_at").eq("key", "mgmt:stuext").maybeSingle();
    const m: any = (row && row.data && typeof row.data === "object") ? Object.assign({}, row.data) : {};
    if (!b.set) return out({ ok: true, x: m[code] || null });
    if (s.mode !== "mgmt") return out({ ok: false, error: "Management only" }, 403);
    const occ = clip(b.set.occ, 80), ind = clip(b.set.ind, 80), now = new Date().toISOString();
    if (occ || ind) m[code] = { occ, ind, by: String(s.name || ""), at: now }; else delete m[code];
    if (!row) { const { error } = await db.from("docs").insert({ key: "mgmt:stuext", scope: "mgmt", data: m, updated_at: now }); if (!error) return out({ ok: true, x: m[code] || null }); continue; }
    const { data: up, error } = await db.from("docs").update({ data: m, updated_at: now }).eq("key", "mgmt:stuext").eq("updated_at", row.updated_at).select("key");
    if (!error && up && up.length) return out({ ok: true, x: m[code] || null });
  }
  return out({ ok: false, error: "busy", msg: "Someone else saved at the same moment · try again" }, 409);
});
