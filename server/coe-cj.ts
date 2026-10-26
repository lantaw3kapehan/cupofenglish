// CupOfEnglish · coe-cj (26 Oct 2026 · patch 1221) · "the CEFR level now", one rule for every screen. Read-only.
// A student can have several DATABASE rows (a second teacher or course: Alice ST-2024-029 — Kat since Mar 2024, Dezza since
// Sep 2026), and a later trial report by a second teacher (Alice ST-2024-101 — Julia, 24 Oct, A2). The app's student box, the
// CEFR journey and the Students list each read only part of this, so they disagreed. This function reads every row:
//   start  = the row with the earliest first class (its trial date / book / CEFR); CEFR & BOOKS of every row, oldest first
//   now    = the latest dated assessment after the start (progress check, or a trial report dated > start + 7 days that is not
//            lower than the course level — a second teacher's placement for another course never lowers it)
//            → else the last course level in CEFR & BOOKS → else the trial CEFR.
// POST { token, op: "one", code } → { ok, code, cj: {first?, td, tb, tc, cb} | null, trials: [{date, teacher, cefr, total}], now }
//      (teachers: only their own students, and no first-class date)
// POST { token, op: "list" } (management) → { ok, lv: { code: level } }
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
const MON3: Record<string, string> = { jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06", jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12" };
function ymd(v: any): string { const t = String(v ?? "").trim(); let m = t.match(/^(\d{4}-\d{2}-\d{2})/); if (m) return m[1];
  m = t.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/); if (m && MON3[m[2].toLowerCase()]) return m[3] + "-" + MON3[m[2].toLowerCase()] + "-" + m[1].padStart(2, "0"); return ""; }
const CJ_L = ["Pre-A1", "A1", "A1+", "A2", "A2+", "B1", "B1+", "B2", "B2+", "C1", "C2"];
function lv(x: any): number { const m = String(x ?? "").match(/(pre-?\s*a1|[abc][12])\s*(\+)?/i); if (!m) return -1; const b = /pre/i.test(m[1]) ? "Pre-A1" : m[1].toUpperCase(); return CJ_L.indexOf(b + (m[2] && b !== "Pre-A1" ? "+" : "")); }
const c = (r: any[], j: number) => (Array.isArray(r) && r[j] != null ? r[j] : "");
function merge(R: any[][]) {   // DATABASE columns: 10 trial date · 12 trial book · 13 trial CEFR · 16 first class · 19 CEFR & BOOKS
  const k = (r: any[]) => ymd(c(r, 16)) || ymd(c(r, 10)) || "9999-12-31";
  const S = R.slice().sort((a, b) => k(a).localeCompare(k(b))), s0 = S[0], segs: string[] = [];
  S.forEach((r) => String(c(r, 19)).split(/→|->/).map((x) => x.trim()).filter(Boolean).forEach((x) => { if (segs[segs.length - 1] !== x) segs.push(x); }));
  return { first: ymd(c(s0, 16)), td: ymd(c(s0, 10)) || String(c(s0, 10)), tb: String(c(s0, 12)), tc: String(c(s0, 13)), cb: segs.join(" → ") };
}
const plus7 = (d: string) => { const t = Date.parse(d + "T12:00:00Z"); return isNaN(t) ? "" : new Date(t + 7 * 864e5).toISOString().slice(0, 10); };
function nowOf(R: any[][], T: any[], P: any[]) {   // the same rule as the app's CEFR journey (cjHtml + 1221)
  const m = merge(R), st = m.first || ymd(m.td) || (T.map((t) => t.date).sort()[0] || ""), lim = st ? plus7(st) : "";
  const chain = m.cb.split(/→|->/).map(lv).filter((i) => i >= 0), tr = lv(m.tc), base = chain.length ? chain[chain.length - 1] : tr;
  // a later trial report (another teacher's placement for a new course) can raise the level shown, never lower it; progress checks can
  const A = P.filter((p) => p.date && (!st || p.date >= st) && lv(p.cefr) >= 0).concat(T.filter((t) => t.date && lim && t.date > lim && lv(t.cefr) >= 0 && lv(t.cefr) >= base))
    .sort((a, b) => b.date.localeCompare(a.date));
  if (A.length) return CJ_L[lv(A[0].cefr)];
  return base >= 0 ? CJ_L[base] : "";
}
async function rows(tab: string, col?: number, code?: string) {
  let q = db.from("sheet_rows").select("data").eq("tab", tab);
  if (col != null && code) q = q.filter("data->>" + col, "eq", code);
  const { data } = await q.limit(6000); return (data || []).map((x: any) => x.data || []);
}
const trOf = (r: any[]) => ({ date: ymd(c(r, 2)), teacher: String(c(r, 4)), cefr: String(c(r, 23)), total: Number(c(r, 18)) || 0 });
const prOf = (r: any[]) => ({ date: ymd(c(r, 2)), cefr: String(c(r, 22) || c(r, 20)) });
Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: s } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
  const mgmt = s.mode === "mgmt";
  if (b.op === "list") {
    if (!mgmt) return out({ ok: false, error: "AUTH" }, 401);
    const [DB, TR, PR] = await Promise.all([rows("DATABASE"), rows("TR-DATA"), rows("PR-DATA")]);
    const R: Record<string, any[][]> = {}, T: Record<string, any[]> = {}, P: Record<string, any[]> = {};
    DB.forEach((r: any[]) => { const k = String(c(r, 0)).trim(); if (/^ST-/.test(k)) (R[k] = R[k] || []).push(r); });
    TR.forEach((r: any[]) => { const k = String(c(r, 33)).trim(); if (/^ST-/.test(k)) (T[k] = T[k] || []).push(trOf(r)); });
    PR.forEach((r: any[]) => { const k = String(c(r, 4)).trim(); if (/^ST-/.test(k)) (P[k] = P[k] || []).push(prOf(r)); });
    const lvOut: Record<string, string> = {};
    Object.keys(R).forEach((k) => { const v = nowOf(R[k], T[k] || [], P[k] || []); if (v) lvOut[k] = v; });
    return out({ ok: true, lv: lvOut });
  }
  const code = String(b.code || "").trim().toUpperCase(); if (!/^ST-\d{4}-\d{3}$/.test(code)) return out({ ok: false, error: "code" }, 400);
  if (!mgmt) {   // a teacher: only a student whose ACTIVE row names her
    const who = String(s.name || "").trim().toLowerCase(), A = await rows("ACTIVE", 0, code);
    if (!A.some((r: any[]) => String(c(r, 3)).split(/[,/&+]| and /).map((x) => x.trim().toLowerCase()).indexOf(who) > -1)) return out({ ok: true, code, cj: null, trials: [], now: "" });
  }
  const [R, TR, PR] = await Promise.all([rows("DATABASE", 0, code), rows("TR-DATA", 33, code), rows("PR-DATA", 4, code)]);
  if (!R.length) return out({ ok: true, code, cj: null, trials: TR.map(trOf), now: "" });
  const T = TR.map(trOf), cj: any = R.length > 1 ? merge(R) : null;
  const now = nowOf(R, T, PR.map(prOf));
  if (cj && !mgmt) delete cj.first;
  return out({ ok: true, code, cj, trials: T, now });
});
