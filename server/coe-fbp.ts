// CupOfEnglish · coe-fbp (27 Oct 2026) · the monthly-feedback helper (Google's tFbPlus, ~6 s) straight from the database.
// POST { token, code } (a signed-in teacher who teaches that student) → the same shape as Google's tFbPlus:
//   { ok, monthKey, mine, tags, review, plan, db: true }
// Built exactly as Google's Code.gs does it (tFbPlus · gtTags_ · gtGoalsAll_ · gtActive_ · gtMine_ · fbMonth_), from the database
// copies of S-NOTE-TAGS and S-GOALS, plus tags / goal plans saved in the app that Google has not copied yet (writes tNoteTag,
// tGoalsSave newer than the tab's last copy). Read-only. A student this teacher has no class with → { ok:false, fallback:true }
// (the app then asks Google, which decides as before).
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
const S = (v: unknown) => String(v ?? "");
const day = (v: unknown) => { const s = S(v); return /^\d{4}-\d{2}-\d{2}T/.test(s) ? s.slice(0, 10) : s; };          // gtDay_
const mon = (v: unknown) => S(v).slice(0, 7);                                                                     // gtMon_
const txt = (v: unknown, n = 300) => String(v == null ? "" : v).replace(/\s+/g, " ").trim().slice(0, n);           // gtTxt_
const manila = (ms = Date.now()) => new Date(ms + 8 * 3600e3);
function fbMonthKey() {   // fbMonth_: FB_ROLLOVER_DAY 15 → from the 15th it is next month's feedback
  const n = manila(); let y = n.getUTCFullYear(), m = n.getUTCMonth() + (n.getUTCDate() >= 15 ? 1 : 0); if (m > 11) { m -= 12; y++; }
  return y + "-" + String(m + 1).padStart(2, "0");
}
async function rows(tab: string, max: number) {   // the database answers 1000 rows per call
  const all: any[] = []; for (let from = 0; from < max; from += 1000) {
    const { data, error } = await db.from("sheet_rows").select("r,data").eq("tab", tab).gt("r", 1).order("r").range(from, Math.min(max, from + 1000) - 1);
    if (error) throw error; all.push(...(data || [])); if (!data || data.length < 1000) break; }
  return all;
}
Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: s } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
  const code = String(b.code || "").trim().toUpperCase(); if (!/^ST-\d{4}-\d{3}$/.test(code)) return out({ ok: false, fallback: true });
  const name = String(s.name || ""), lc = name.trim().toLowerCase();
  if (s.mode === "mgmt" || !lc) return out({ ok: false, fallback: true });
  // teacherHas_: a class with this teacher (last 120 days or ahead), or the teacher's own package row → otherwise Google decides
  const [CL, PK] = await Promise.all([
    db.from("classes").select("teachers").eq("code", code).gte("starts_at", new Date(Date.now() - 120 * 864e5).toISOString()).limit(300),
    db.from("coe_packages").select("teacher").eq("code", code).is("removed_at", null)]);
  const mine = (CL.data || []).some((x: any) => (x.teachers || []).map((t: string) => String(t).trim().toLowerCase()).includes(lc))
    || (PK.data || []).some((x: any) => String(x.teacher || "").toLowerCase().split(/[,/&]/).map((t: string) => t.trim()).includes(lc));
  if (!mine) return out({ ok: false, fallback: true });

  let TB: any, TGd: any[], GLd: any[], W: any;
  try { [TB, TGd, GLd, W] = await Promise.all([
    db.from("sheet_tabs").select("tab,synced_at").in("tab", ["S-NOTE-TAGS", "S-GOALS"]), rows("S-NOTE-TAGS", 4000), rows("S-GOALS", 3000),
    db.from("writes").select("fn,who,args,status,created_at,done_at").in("fn", ["tNoteTag", "tGoalsSave"]).gte("created_at", new Date(Date.now() - 3 * 864e5).toISOString()).order("created_at").limit(1000)]); }
  catch (_e) { return out({ ok: false, fallback: true }); }
  if (TB.error || W.error || (TB.data || []).length < 2) return out({ ok: false, fallback: true });
  const synced: Record<string, number> = {}; (TB.data || []).forEach((x: any) => { synced[x.tab] = Date.parse(x.synced_at); });
  let tags: any[][] = TGd.map((x: any) => Array.isArray(x.data) ? x.data.slice() : []);
  let goals: any[][] = GLd.map((x: any) => Array.isArray(x.data) ? x.data.slice() : []);
  // saves Google has not copied yet (done after the last copy, or not done yet) — applied the way Google applies them
  (W.data || []).forEach((w: any) => {
    if (w.status === "error" || w.status === "test") return; const A = Array.isArray(w.args) ? w.args : [], who = String(w.who || "");
    const after = (tab: string) => !w.done_at || Date.parse(w.done_at) > (synced[tab] || 0);
    if (w.fn === "tNoteTag" && after("S-NOTE-TAGS")) { const t = A[1] || {}; if (!t.code) return;
      const c = String(t.code).trim().toUpperCase(), d = /^\d{4}-\d{2}-\d{2}$/.test(S(t.date)) ? S(t.date) : manila(Date.parse(w.created_at)).toISOString().slice(0, 10);
      const kind = (Array.isArray(t.kind) ? t.kind : [t.kind]).map(String).filter((k: string) => k === "Win" || k === "Work on").join(", ");
      const row = [w.created_at, d, who, c, txt(t.eventId, 120), kind, txt(t.goal, 200)];
      const i = tags.slice(0, 80).findIndex((r) => S(r[2]) === who && S(r[3]) === c && day(r[1]) === d && S(r[4] || "") === row[4]);
      if (i > -1) tags[i] = row; else tags.unshift(row); }
    if (w.fn === "tGoalsSave" && after("S-GOALS")) {
      const c = S(A[1]).trim().toUpperCase(); let mk = S(A[2]); if (!/^\d{4}-\d{2}$/.test(mk)) mk = fbMonthKey();
      const P = (Array.isArray(A[3]) ? A[3] : []).filter((g: any) => g && txt(g.goal)).slice(0, 2), R = Array.isArray(A[4]) ? A[4] : [];
      const student = S((goals.find((r) => S(r[2]) === c) || [])[3] || "") || "\u0000" + c;   // name filled below (Google takes it from the feedback index)
      goals = goals.filter((r) => !(S(r[2]) === c && mon(r[1]) === mk));
      const res: Record<string, string> = {}; R.forEach((x: any) => { if (x && x.month && x.no && /^(Met|Partly|Not yet)$/.test(x.result)) res[x.month + "|" + x.no] = x.result; });
      goals.forEach((r) => { const k = mon(r[1]) + "|" + (Number(r[5]) || 1); if (S(r[2]) === c && res[k]) { r[11] = res[k]; r[12] = mk; } });
      const add = P.map((g: any, j: number) => [w.created_at, mk, c, student, who, j + 1, txt(g.skill, 30), txt(g.goal), txt(g.cls), txt(g.home), txt(g.check), "", "", ""]);
      goals = add.concat(goals); }
  });
  const need = [...new Set(goals.filter((r) => /^\u0000/.test(S(r[3]))).map((r) => S(r[3]).slice(1)))];
  if (need.length) { const { data: N } = await db.from("sheet_rows").select("data").eq("tab", "DATABASE").in("data->>0", need).limit(50);
    const nm: Record<string, string> = {}; (N || []).forEach((x: any) => { const d = x.data || []; if (!nm[S(d[0])]) nm[S(d[0])] = S(d[2]).trim(); });
    goals.forEach((r) => { if (/^\u0000/.test(S(r[3]))) r[3] = nm[S(r[3]).slice(1)] || ""; }); }
  const mk = fbMonthKey(), since = manila(Date.now() - 75 * 864e5).toISOString().slice(0, 10);
  // gtTags_ (first 4000 rows) · gtGoalsAll_ (first 3000) · gtMine_ (first 1500)
  const T = tags.slice(0, 4000).filter((r) => S(r[3]) === code && day(r[1]) >= since)
    .map((r) => ({ date: day(r[1]), teacher: S(r[2]), eventId: S(r[4] || ""), kind: S(r[5] || ""), goal: S(r[6] || "") }));
  const all = goals.slice(0, 3000).filter((r) => S(r[2]) === code).map((r) => ({ month: mon(r[1]), teacher: S(r[4]), no: Number(r[5]) || 1, skill: S(r[6]), goal: S(r[7]),
    cls: S(r[8]), home: S(r[9]), check: S(r[10]), result: S(r[11] || ""), resultMonth: mon(r[12]) }));
  const before = all.filter((g) => g.month < mk), top = before.reduce((a, g) => g.month > a ? g.month : a, "");
  const review = before.length ? before.filter((g) => g.month === top).sort((a, z) => a.no - z.no) : [];
  const plan = all.filter((g) => g.month === mk).sort((a, z) => a.no - z.no);
  const mineL = goals.slice(0, 1500).filter((r) => S(r[4]) === name && mon(r[1]) === mk)
    .map((r) => ({ code: S(r[2]), student: S(r[3]), goal: S(r[7]), cls: S(r[8]), home: S(r[9]), check: S(r[10]) })).filter((x) => x.code !== code);
  return out({ ok: true, monthKey: mk, mine: mineL, tags: T, review, plan, db: true });
});
