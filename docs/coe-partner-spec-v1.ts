// CupOfEnglish · coe-partner-spec (1640 · 29 Oct 2026) · teacher specialties for the partner portal's Who's free / Teachers / pictures.
// One source of truth: staff.specialties (edited on the teacher's page in management · Misty 29 Oct 10:05–10:09).
//   { status: confirmed | left | draft, bands: [yl | kids | teens | adults], level: adv | "", books: [OD1, OD2, ODF, REF, IELTS, …], subj, line, by, at }
// Partners (op "spec", partner session token) get CONFIRMED specialties only, plus the names NOT to list (staff not active, or status
// "left"; their past lessons keep the name). Suggestions are computed for management only (op "list") and never leave management.
// Management (app_sessions mode mgmt): op "list" (active teachers + saved specialty + read-only suggestion) and "set" (save one).
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
const hex = (b: ArrayBuffer) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
const sha = async (t: string) => hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)));
const norm = (s: unknown) => String(s ?? "").replace(/\s+/g, " ").trim();
const c = (r: any[], j: number) => (Array.isArray(r) && r[j] != null ? r[j] : "");
const BANDS = ["yl", "kids", "teens", "adults"];
const pub = (s: any) => !s || s.status !== "confirmed" ? null : { bands: (Array.isArray(s.bands) ? s.bands : []).filter((x: string) => BANDS.includes(x)),
  level: s.level === "adv" ? "adv" : "", books: (Array.isArray(s.books) ? s.books : []).map(norm).filter(Boolean).slice(0, 6), subj: norm(s.subj).slice(0, 60), line: norm(s.line).slice(0, 80) };
async function rows(tab: string) { const out: any[] = []; for (let f = 0; f < 30000; f += 1000) { const { data, error } = await db.from("sheet_rows").select("data").eq("tab", tab).order("r").range(f, f + 999);
  if (error || !data) break; out.push(...data.map((x: any) => x.data || [])); if (data.length < 1000) break; } return out; }
// read-only suggestion from the teacher's active students (ACTIVE col D teacher, BD course · DATABASE G age) — management only
async function suggest(): Promise<Record<string, any>> { const [A, DB] = await Promise.all([rows("ACTIVE"), rows("DATABASE")]); const age: Record<string, number> = {};
  DB.forEach((r: any[]) => { const k = norm(c(r, 0)).toUpperCase(), a = parseInt(String(c(r, 6)), 10); if (/^ST-/.test(k) && a > 1 && a < 90) age[k] = a; });
  const T: Record<string, { n: number; b: Record<string, number>; k: Record<string, number> }> = {};
  A.forEach((r: any[]) => { const code = norm(c(r, 0)).toUpperCase(); if (!/^ST-/.test(code)) return; const a = age[code], band = !a ? "" : a < 8 ? "yl" : a <= 12 ? "kids" : a <= 17 ? "teens" : "adults";
    String(c(r, 3)).split(/[,/&]+/).map((x) => norm(x).toLowerCase()).filter(Boolean).forEach((t) => { const o = T[t] = T[t] || { n: 0, b: {}, k: {} }; o.n++; if (band) o.b[band] = (o.b[band] || 0) + 1;
      String(c(r, 55)).split(/[,\s]+/).map(norm).filter((x) => /^(OD\d|ODF|RE\d|REF|IELTS|TOEFL)$/i.test(x)).forEach((x) => { o.k[x.toUpperCase()] = (o.k[x.toUpperCase()] || 0) + 1; }); }); });
  const out: Record<string, any> = {}; Object.keys(T).forEach((t) => { const o = T[t], nb = Object.values(o.b).reduce((a, x) => a + x, 0);
    out[t] = { students: o.n, ages: o.b, bands: BANDS.filter((b) => (o.b[b] || 0) >= Math.max(1, nb * 0.25)), books: Object.entries(o.k).sort((a, b) => b[1] - a[1]).slice(0, 3).map((x) => x[0]) }; });
  return out; }
Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const op = String(b.op || ""), token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const th = await sha(token);
  if (op === "spec") {   // partner portal
    const { data: ss } = await db.from("partner_sessions").select("partner_id,exp").eq("token_hash", th).maybeSingle();
    if (!ss || new Date(ss.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
    const { data: acc } = await db.from("partner_accounts").select("active").eq("id", ss.partner_id).maybeSingle(); if (!acc || !acc.active) return out({ ok: false, error: "AUTH" }, 401);
    const { data } = await db.from("staff").select("name,role,status,specialties,spec_at");
    const spec: Record<string, any> = {}, act = new Set<string>(), off = new Set<string>(); let v = "";
    (data || []).forEach((r: any) => { const k = norm(r.name).toLowerCase(); if (!k) return; const s = r.specialties || {}; if (r.spec_at && String(r.spec_at) > v) v = String(r.spec_at);
      if (r.status === "active" && s.status !== "left") { act.add(k); const p = pub(s); if (p) spec[k] = p; } else if (r.role === "teacher" || s.status === "left") off.add(k); });
    act.forEach((k) => off.delete(k));   // a name that is active on any staff row is never hidden
    return out({ ok: true, v: v + "/" + act.size, spec, off: [...off].sort() });
  }
  const { data: s } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", th).maybeSingle();
  if (!s || new Date(s.exp).getTime() < Date.now() || s.mode !== "mgmt") return out({ ok: false, error: "AUTH" }, 401);
  if (op === "list") {
    const [{ data: ST }, SG] = await Promise.all([db.from("staff").select("id,name,role,status,specialties").eq("status", "active").in("role", ["teacher", "admin", "ops"]).order("name"), suggest()]);
    return out({ ok: true, teachers: (ST || []).filter((t: any) => t.role === "teacher" || t.specialties).map((t: any) => ({ id: t.id, name: t.name, role: t.role, spec: t.specialties || null, suggest: SG[norm(t.name).toLowerCase()] || null })) });
  }
  if (op === "set") {
    const id = Number(b.id), x = b.spec || {}, st = ["confirmed", "left", "draft"].includes(x.status) ? x.status : "";
    if (!id) return out({ ok: false, msg: "No teacher" });
    const books = (Array.isArray(x.books) ? x.books : []).map((y: any) => norm(y).toUpperCase()).filter((y: string) => /^[A-Z0-9][A-Z0-9 .-]{0,15}$/.test(y)).slice(0, 6);
    const now = new Date().toISOString();
    const spec = st ? { status: st, bands: (Array.isArray(x.bands) ? x.bands : []).filter((y: string) => BANDS.includes(y)), level: x.level === "adv" ? "adv" : "", books, subj: norm(x.subj).slice(0, 60), line: norm(x.line).slice(0, 80), by: s.name, at: now } : null;
    const { error } = await db.from("staff").update({ specialties: spec, spec_at: now }).eq("id", id);
    return out({ ok: !error, spec, msg: error ? "Not saved" : undefined });
  }
  return out({ ok: false, error: "unknown op" }, 400);
});
