// CupOfEnglish · coe-student (27 Oct 2026; v2 1352: inclusive Student portal, adult flag; v3 1353: lessons = management's Lesson summary incl. shared packages, history, payments) · student / parent access (mostly mainland China, phones, WeChat browser). Never calls Google.
// Sign-in (Misty's rule): username = the student's ST code, password = the student's English name (case-insensitive, trimmed; any
// DATABASE row's English name or the ACTIVE package name for that code). If the parent set their own password, only that works.
// Protections: 5 wrong tries per code → 15 min lock; 30 wrong tries per connection per hour; sessions 30 days; sign-ins logged;
// management can switch a student's access off and clear an own password. Parents see only their own child:
//   home (next class, lessons left, valid-until, renewal reminder), schedule (upcoming / past with status), homework & class notes
//   (the parent-facing lesson-summary fields: where the class ended, homework, observation, next plan), homework "done" ticks,
//   progress (CEFR journey — same rule as coe-cj, monthly reports SENT to parents, attendance).
// v3: lessons (management's Lesson summary), history since joining, payments (issued Payment Confirmations; SALES amounts for direct students only —
// partner-referred students never see an amount or a partner name). Never: phone/WeChat/addresses, teacher internal info, other students (a sibling
// on a shared package: first name + code only), class videos (Google Drive).
// Management (app_sessions mode mgmt): op sList / sActive / sClearPw.
// v22 (1530, 28 Oct 2026): Philippine-market learners. Management marks a student PH in Student access (op sMarket → docs sys:ph_learners,
//   default = not PH, the China portal unchanged). For a PH learner, login/all also return market 'ph' and `ph` = the programme + track
//   from docs sys:pricing_ph (the PH price list; prices are NOT sent to the portal). Sign-in, lessons, 核对中 rules: unchanged.
// v23 (1533, 28 Oct 2026): PH learners sign in with the FIRST WORD of their English name only ("Maria" for "Maria Santos"; case-insensitive,
//   trimmed; the full name is not accepted for them); China families unchanged; same rate limits and lockout. Management op sPhPay:
//   UnionBank payment details + QR for the Philippine price list (docs sys:pricing_ph.payment).
// v24 (1535, 28 Oct 2026): `ph.cancelHours` = docs sys:pricing_ph.cancel_hours (4) for the PH portal's cancellation notice. China: unchanged.
// v25 (1545, 29 Oct 2026): Market › Philippines accepts the Young Learners (yle) and Teens (teens) programmes. Nothing else changed.
// (edge-runtime type import removed 28 Oct: the bundler could not reach jsr.io; EdgeRuntime is declared below)
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
import { activeRows, lessonsOf, historyOf, paymentsOf, partnerish } from "./pkg.ts";
import { buildSandbox, buildJourney, buildPicture, mgmtApp, mgmtData, mgmtSummary } from "./mgmt.ts";
import { parseHTML } from "npm:linkedom@0.18.5";
import { renewFlags } from "./renew.ts";
const PIC: Record<string, any> = {};
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
const hex = (b: ArrayBuffer | Uint8Array) => [...new Uint8Array(b as ArrayBuffer)].map((x) => x.toString(16).padStart(2, "0")).join("");
async function sha(t: string) { return hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))); }
async function pbkdf2(pw: string, salt: string, iter: number) {
  const k = await crypto.subtle.importKey("raw", new TextEncoder().encode(pw), "PBKDF2", false, ["deriveBits"]);
  return hex(await crypto.subtle.deriveBits({ name: "PBKDF2", salt: new TextEncoder().encode(salt), iterations: iter, hash: "SHA-256" }, k, 256));
}
const rnd = (n: number) => hex(crypto.getRandomValues(new Uint8Array(n)));
const eqT = (a: string, b: string) => { if (a.length !== b.length) return false; let x = 0; for (let i = 0; i < a.length; i++) x |= a.charCodeAt(i) ^ b.charCodeAt(i); return x === 0; };
const norm = (s: unknown) => String(s ?? "").replace(/\s+/g, " ").trim();
const nameKey = (s: unknown) => norm(s).toLowerCase();
const c = (r: any[], j: number) => (Array.isArray(r) && r[j] != null ? r[j] : "");
function codeOf(x: unknown) { const t = String(x ?? "").toUpperCase().replace(/[\s_–—-]+/g, ""); const m = t.match(/^ST(\d{4})(\d{3})$/); return m ? "ST-" + m[1] + "-" + m[2] : ""; }
const MON3: Record<string, string> = { jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06", jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12" };
function ymd(v: any): string { const t = String(v ?? "").trim(); let m = t.match(/^(\d{4}-\d{2}-\d{2})/); if (m) return m[1];
  m = t.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/); if (m && MON3[m[2].toLowerCase()]) return m[3] + "-" + MON3[m[2].toLowerCase()] + "-" + m[1].padStart(2, "0"); return ""; }
// ── CEFR: the same rule as coe-cj / coe-partner / the app's journey (1221) ──
const CJ_L = ["Pre-A1", "A1", "A1+", "A2", "A2+", "B1", "B1+", "B2", "B2+", "C1", "C2"];
function lv(x: any): number { const m = String(x ?? "").match(/(pre-?\s*a1|[abc][12])\s*(\+)?/i); if (!m) return -1; const b = /pre/i.test(m[1]) ? "Pre-A1" : m[1].toUpperCase(); return CJ_L.indexOf(b + (m[2] && b !== "Pre-A1" ? "+" : "")); }
function merge(R: any[][]) {
  const k = (r: any[]) => ymd(c(r, 16)) || ymd(c(r, 10)) || "9999-12-31";
  const S = R.slice().sort((a, b) => k(a).localeCompare(k(b))), s0 = S[0], segs: string[] = [];
  S.forEach((r) => String(c(r, 19)).split(/→|->/).map((x) => x.trim()).filter(Boolean).forEach((x) => { if (segs[segs.length - 1] !== x) segs.push(x); }));
  return { first: ymd(c(s0, 16)), td: ymd(c(s0, 10)) || String(c(s0, 10)), tb: String(c(s0, 12)), tc: String(c(s0, 13)), cb: segs.join(" → ") };
}
const plus7 = (d: string) => { const t = Date.parse(d + "T12:00:00Z"); return isNaN(t) ? "" : new Date(t + 7 * 864e5).toISOString().slice(0, 10); };
function nowOf(R: any[][], T: any[], P: any[]) {
  const m = merge(R), st = m.first || ymd(m.td) || (T.map((t) => t.date).sort()[0] || ""), lim = st ? plus7(st) : "";
  const chain = m.cb.split(/→|->/).map(lv).filter((i) => i >= 0), tr = lv(m.tc), base = chain.length ? chain[chain.length - 1] : tr;
  const A = P.filter((p) => p.date && (!st || p.date >= st) && lv(p.cefr) >= 0).concat(T.filter((t) => t.date && lim && t.date > lim && lv(t.cefr) >= 0 && lv(t.cefr) >= base))
    .sort((a, b) => b.date.localeCompare(a.date));
  if (A.length) return CJ_L[lv(A[0].cefr)];
  return base >= 0 ? CJ_L[base] : "";
}
const trOf = (r: any[]) => ({ date: ymd(c(r, 2)), teacher: String(c(r, 4)), cefr: String(c(r, 23)), total: Number(c(r, 18)) || 0 });
const prOf = (r: any[]) => ({ date: ymd(c(r, 2)), cefr: String(c(r, 22) || c(r, 20)) });
async function rowsBy(tab: string, col: number, val: string) {
  const { data } = await db.from("sheet_rows").select("data").eq("tab", tab).filter("data->>" + col, "eq", val).limit(1000);
  return (data || []).map((x: any) => x.data || []);
}
const isTrial = (t: string) => /trial|试听|\bTC\b/i.test(t);
const isSub = (t: string) => /\bSUB\b|\bSC\b|代课/i.test(t);
const isAbsent = (t: string) => /absent|no[\s-]?show|缺席|缺课/i.test(t);
const bj = (iso: string) => { const d = new Date(Date.parse(iso) + 8 * 3600e3).toISOString(); return { day: d.slice(0, 10), time: d.slice(11, 16) }; };
const prevMonth = (m: string) => { const x = String(m || "").match(/^(\d{4})-(\d{2})$/); if (!x) return m; let y = +x[1], mo = +x[2] - 1; if (mo < 1) { mo = 12; y--; } return y + "-" + String(mo).padStart(2, "0"); };
const cap = (s: string) => String(s || "").replace(/\b[a-z]/g, (x) => x.toUpperCase());
async function bookTitles() { const { data } = await db.from("coe_book_titles").select("code,title").limit(500); const BT: Record<string, string> = {}; (data || []).forEach((x: any) => { BT[String(x.code).toLowerCase()] = x.title; }); return BT; }
const bookOf = (BT: Record<string, string>, x: string) => BT[String(x || "").toLowerCase()] || String(x || "").replace(/([a-z])([A-Z0-9])/g, "$1 $2");
// adult learner: the same rule as the app's isAdult / coe mgmtStudents (DATABASE school grade WA/UM/U#/PhD/ADULT, or age ≥ 20 and not a G# grade)
const adultRow = (r: any[]) => { const gr = String(c(r, 8)).trim(); return /^(WA|UM|U\d|PhD|ADULT)$/i.test(gr) || (+c(r, 6) >= 20 && !/^(G\d+|GK)$/i.test(gr)); };
async function namesOf(code: string) {
  const [R, { data: PK }] = await Promise.all([rowsBy("DATABASE", 0, code), db.from("coe_packages").select("name,cn").eq("code", code).is("removed_at", null).limit(20)]);
  const en = new Set<string>(), cn: string[] = []; let first = "";
  R.forEach((r: any[]) => { const n = norm(c(r, 2)); if (n) { en.add(nameKey(n)); first = first || n; } const z = norm(c(r, 1)); if (z && !cn.includes(z)) cn.push(z); });
  (PK || []).forEach((p: any) => { const n = norm(p.name); if (n) { en.add(nameKey(n)); first = first || n; } const z = norm(p.cn); if (z && !cn.includes(z)) cn.push(z); });
  return { en, name: first, cn: cn[0] || "", rows: R, adult: R.some(adultRow) };
}
const cls = (BT: Record<string, string>, x: any) => { const t = String((x.data && x.data.title) || ""), a = bj(x.starts_at);
  return { day: a.day, time: a.time, mins: Math.round((Date.parse(x.ends_at || x.data?.end || x.starts_at) - Date.parse(x.starts_at)) / 6e4) || 25,
    teacher: cap(String((x.teachers || [])[0] || "")), book: bookOf(BT, (x.data && x.data.book) || ""), kind: isTrial(t) ? "trial" : isSub(t) ? "sub" : "class" }; };

// ── Lesson summary by management's own code (mgmt.ts), with a second independent calculation (pkg.ts) as a guard ──
const ENV: Record<string, any> = {}; let DATA: { at: number; p: Promise<any> } | null = null; const APPLIED = new WeakMap<any, Promise<any>>();
const JENV: Record<string, any> = {};
// the CEFR journey exactly as management's student page draws it (cjHtml + 1221), from the same pieces mgmtStudent sends
// 28 Oct · paid-date rule (management 1422): a Renewed / New date is the PAYMENT date = the SALES row linked from ACTIVE column J
//   (docs sys:pkglink: act[].link → sales[].row), matched by the package start (ACTIVE AW). The package start stays the first class.
let PKL: { at: number; m: Record<string, { st: string; paid: string }[]> } | null = null;
async function paidMap() { if (PKL && Date.now() - PKL.at < 20e3) return PKL.m;
  const { data } = await db.from("docs").select("data").eq("key", "sys:pkglink").maybeSingle(); const d: any = (data as any)?.data || {}, S: Record<number, string> = {}, m: Record<string, { st: string; paid: string }[]> = {};
  (d.sales || []).forEach((x: any) => { if (x && x.row) S[+x.row] = String(x.d || "").slice(0, 10); });
  (d.act || []).forEach((a: any) => { if (!a || !a.c) return; const k = String(a.c).trim().toUpperCase(); (m[k] = m[k] || []).push({ st: a.aw ? new Date(+a.aw + 8 * 3600e3).toISOString().slice(0, 10) : "", paid: a.link && S[+a.link] ? S[+a.link] : "" }); });
  PKL = { at: Date.now(), m }; return m; }
async function paidOf(code: string, start: string): Promise<string> { const s = String(start || "").slice(0, 10); if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return "";
  const L = (await paidMap().catch(() => ({} as any)))[String(code || "").trim().toUpperCase()] || []; const hit = L.find((x: any) => x.st === s) || (L.length === 1 ? L[0] : null); return hit ? hit.paid : ""; }
// 28 Oct · 1443 rule (management): a previous teacher = no upcoming class with this student (sys:tmap) or deactivated (staff, role
//   teacher, status not active); current teachers first, previous ones last with a light tag. Only when at least one teacher stays current.
let TMC: { at: number; tm: any; off: Record<string, number> } | null = null;
async function tmapOff() { if (TMC && Date.now() - TMC.at < 60e3) return TMC;
  const [{ data: T }, { data: S }] = await Promise.all([db.from("docs").select("tm:data->tmap").eq("key", "sys:tmap").maybeSingle(), db.from("staff").select("name,role,status").limit(500)]);
  const off: Record<string, number> = {}; ((S as any[]) || []).forEach((x: any) => { if (x.role === "teacher" && x.status !== "active") off[String(x.name || "").trim().toLowerCase()] = 1; });
  TMC = { at: Date.now(), tm: (T as any)?.tm || {}, off }; return TMC; }
async function prevOf(code: string, names: string[]): Promise<string[]> {
  const L = (names || []).map(String).filter(Boolean); if (!L.length) return [];
  const { tm: TM, off } = await tmapOff().catch(() => ({ tm: {}, off: {} } as any)); const lc = (x: string) => String(x || "").trim().toLowerCase(), tm = TM[String(code || "").trim().toUpperCase()];
  let cur: Record<string, number> = {};
  if (tm) { Object.keys(tm).forEach((t) => { if (tm[t] && tm[t].next) cur[t] = 1; });
    if (!Object.keys(cur).length) { let best = ""; Object.keys(tm).forEach((t) => { const l = String((tm[t] || {}).last || ""); if (l > best) { best = l; cur = {}; cur[t] = 1; } else if (l && l === best) cur[t] = 1; }); } }
  const known = Object.keys(cur).length > 0 && L.some((n) => cur[lc(n)]);
  const P = L.filter((n) => off[lc(n)] || (known && !cur[lc(n)])); return P.length < L.length ? P : []; }
// management's student-page teacher list (coe.ts studentsFromTables): ACTIVE rows of the code with lessons left (own or the shared
//   package's), ticked active or a teacher seen in sys:tmap / the current DAILY tab; teachers from column D (split on , / &), first seen first
async function mgmtTeachersOf(code: string, R: any[]): Promise<string[]> {
  const { data: T } = await db.from("docs").select("tm:data->tmap,daily:data->daily").eq("key", "sys:tmap").maybeSingle();
  const TN: Record<string, number> = {}, lc = (x: any) => String(x || "").trim().toLowerCase(), C = String(code || "").trim().toUpperCase();
  Object.keys(((T as any)?.tm || {})[C] || {}).forEach((t) => { TN[lc(t)] = 1; });
  const dn = String((T as any)?.daily || ""); if (dn) { const { data: D } = await db.from("sheet_rows").select("data").eq("tab", dn).filter("data->>0", "eq", C).limit(50);
    ((D as any[]) || []).forEach((x: any) => String((x.data || [])[2] || "").split(/[,/&+]| and /).forEach((t) => { if (lc(t)) TN[lc(t)] = 1; })); }
  const leftBy: Record<string, any> = {}; R.forEach((r: any) => { if (r.available !== "" && leftBy[r.code] === undefined) leftBy[r.code] = r.available; });
  const out: string[] = [];
  R.filter((r: any) => r.code === C).forEach((r: any) => { const pk = String(r.shared || "").trim(), sw = pk && pk.toUpperCase() !== C ? pk.toUpperCase() : "";
    let left = r.available; if (left === "" && sw && leftBy[sw] !== undefined) left = leftBy[sw]; if (left !== "" && Number(left) <= 0) return;
    if (r.active !== true && !String(r.teacher || "").split(/[,/&+]| and /).some((t: string) => TN[lc(t)])) return;
    String(r.teacher || "").split(/[,/&]/).map((x: string) => x.trim()).filter(Boolean).forEach((t: string) => { if (!out.includes(t)) out.push(t); }); });
  return out; }
// the lesson summary picture's teacher cell (same match as 1443's tagCell), Chinese-first tag
function tagPrev(html: string, prev: string[]) { if (!prev.length || !html) return html; const P: Record<string, number> = {}; prev.forEach((n) => P[n.trim().toLowerCase()] = 1); let done = false;
  return html.replace(/(font-size:14px">)([^<]*(?:<br>[^<]*)*)(?=<div|<\/td>)/g, (m, a, T) => { if (done) return m; const names = T.split("<br>").map((x: string) => x.trim()).filter(Boolean);
    if (!names.some((n: string) => P[n.toLowerCase()])) return m; done = true; if (names.every((n: string) => P[n.toLowerCase()])) return m;
    return a + names.map((n: string) => P[n.toLowerCase()] ? n + ' <span style="font-weight:400;opacity:.65">（曾任）</span>' : n).join("<br>"); }); }
async function journeyFor(code: string, N: any, TRr: any[][], PRr: any[][], LSn: any, PK?: any) {
  const a = await mgmtApp(); if (!JENV[a.hash]) JENV[a.hash] = buildJourney(a.src);
  const { S, X } = await journeyInputs(code, N, TRr, PRr, LSn, PK);
  const r = JENV[a.hash].run(S, X); if (!r) return null; const { html, ...rest } = r;
  for (const x of (rest.steps || [])) if (x && /^Renew/.test(String(x.en || "")) && /^\d{4}-\d{2}-\d{2}/.test(String(x.d || ""))) { const p = await paidOf(code, x.d); if (p) { x.pkgStart = String(x.d).slice(0, 10); x.d = p; x.paid = 1; } }
  return rest;
}
async function journeyInputs(code: string, N: any, TRr: any[][], PRr: any[][], LSn: any, PK?: any) {
  const [{ data: parts }, { data: daily }, { data: cl }, SM, NO] = await Promise.all([db.rpc("student_parts", { p_code: code }), db.rpc("coe_stu_daily", { p_code: code }),
    db.rpc("coe_stu_classes", { p_code: code, p_teacher: "" }), rowsBy("S-MONTHLY", 1, code), rowsBy("S-NOTES", 3, code)]);
  const d = parts && parts.db && parts.db.data, rows = d ? (d.rows || []).filter((r: any[]) => r[0] === code) : [];
  const profile = rows.length ? { head: d.head, row: rows[0].slice(0, -1), packages: rows.length } : null;
  const isD = (x: any) => /^\d{4}-\d{2}-\d{2}T/.test(String(x || ""));
  let trial: any = null; TRr.forEach((r) => { if (isD(c(r, 2))) trial = { date: String(c(r, 2)).slice(0, 10), teacher: c(r, 4), cefr: c(r, 23), total: Number(c(r, 18)) || 0 }; });
  const checks = PRr.filter((r) => isD(c(r, 2))).map((r) => ({ date: String(c(r, 2)).slice(0, 10), teacher: c(r, 3), cefr: c(r, 22) || c(r, 20), total: Number(c(r, 19)) || 0 })).sort((x, y) => y.date.localeCompare(x.date));
  const base = SM.map((r) => ({ m: String(c(r, 0)).slice(0, 7), t: String(c(r, 3) || ""), c: String(c(r, 4) || ""), n: Number(c(r, 5)) || 0, u: Number(c(r, 6)) || 0 })).filter((x) => /^\d{4}-\d{2}$/.test(x.m));
  const D = Array.isArray(daily) ? daily : [], have: Record<string, number> = {}; D.forEach((x: any) => { have[x.m] = 1; });
  const monthly = D.map((x: any) => ({ m: x.m, t: x.t, c: x.c, u: Number(x.u) || 0, n: 0, lv: x.lv })).concat(base.filter((x) => !have[x.m]));
  const notes = NO.map((r: any[]) => ({ date: ymd(c(r, 1)), teacher: String(c(r, 2) || ""), ended: String(c(r, 5) || "") })).filter((n: any) => n.date);   // 1355b: the class notes' book per class
  const pk = PK || LSn, S = { code, pk: pk && pk.course != null ? { course: pk.course, start: pk.start } : null, r: { profile, trial, monthly, checks, notes }, s: { left: LSn && LSn.left != null ? LSn.left : null, shared: !!(LSn && LSn.shared), name: N.name, cn: N.cn }, cls: Array.isArray(cl) ? cl : [] };
  const m = N.rows.length ? merge(N.rows) : null;
  const X = { at: Date.now(), cj: m ? { first: m.first, td: m.td, tb: m.tb, tc: m.tc, cb: m.cb } : null, trials: TRr.map(trOf).filter((t) => t.date) };
  return { S, X };
}
// 1355 · preview a journey rule change: management's live code vs a branch of the app, for every active student → docs sys:cjdiff
async function cjDiff(branch: string, sample: string[] = []) {
  const a = await mgmtApp(); if (!JENV[a.hash]) JENV[a.hash] = buildJourney(a.src);
  const r = await fetch("https://raw.githubusercontent.com/lantaw3kapehan/cupofenglish/" + branch + "/app.html?t=" + Date.now()); if (!r.ok) throw new Error("branch " + r.status);
  const B = buildJourney(await r.text()), A = JENV[a.hash];
  const [{ env }, d] = await Promise.all([mgmtEnv(), mgmtDataCached()]); const at = await appliedAT(env, d);
  const C: Record<string, number> = {}; (d.AT.cols as string[]).forEach((x, i) => C[x] = i);
  const codes = [...new Set((d.AT.rows as any[]).filter((x) => x[C.active]).map((x) => String(x[C.code]).toUpperCase()))].sort();
  const short = (j: any) => j ? (j.steps || []).map((x: any) => [x.d ? (x.dd ? x.d : x.d.slice(0, 7)) : (x.chk ? "being-checked" : ""), x.en.replace(/ .*/, ""), x.lv, x.bk, x.u].filter((v) => v !== "" && v != null).join(" ")).join(" | ") + " · now " + j.now + " · " + j.tk : "—";
  const changed: any[] = [], html: Record<string, any> = {}; let n = 0, err = 0;
  for (let i = 0; i < codes.length; i += 6) await Promise.all(codes.slice(i, i + 6).map(async (code) => { try {
    const [N, TRr, PRr] = await Promise.all([namesOf(code), rowsBy("TR-DATA", 33, code), rowsBy("PR-DATA", 4, code)]);
    const m = await mgmtSummary(env, at, d.mon, code, true), LSn = m ? { left: m.c.left, shared: m.shared, course: m.c.course, start: m.c.start } : null;
    const inp = await journeyInputs(code, N, TRr, PRr, LSn), x = short(A.run(JSON.parse(JSON.stringify(inp.S)), JSON.parse(JSON.stringify(inp.X)))), y = short(B.run(JSON.parse(JSON.stringify(inp.S)), JSON.parse(JSON.stringify(inp.X))));
    n++; if (x !== y) changed.push({ code, name: N.name, before: x, after: y });
    if (sample.includes(code)) { const jb = B.run(JSON.parse(JSON.stringify(inp.S)), JSON.parse(JSON.stringify(inp.X))); html[code] = { mgmt: jb && jb.html, steps: jb && jb.steps, now: jb && jb.now, tk: jb && jb.tk, up: jb && jb.up, since: jb && jb.since, next: jb && jb.next }; } } catch (e) { err++; } }));
  changed.sort((p, q) => p.code.localeCompare(q.code));
  const res = { at: new Date().toISOString(), branch, students: codes.length, done: n, errors: err, changed, html };
  await db.from("docs").upsert({ key: "sys:cjdiff", scope: "mgmt", data: res, updated_at: res.at }, { onConflict: "key" });
  return res;
}
async function mgmtEnv() { const a = await mgmtApp(); if (!ENV[a.hash]) ENV[a.hash] = buildSandbox(a.src); return { env: ENV[a.hash], hash: a.hash }; }
function mgmtDataCached() { if (!DATA || Date.now() - DATA.at > 60e3) { const p = mgmtData(db); DATA = { at: Date.now(), p }; p.catch(() => { DATA = null; }); } return DATA!.p; }
// patch 1196 applied once per data copy (management applies it to its ACTIVE rows the same way)
function appliedAT(env: any, d: any) { let p = APPLIED.get(d); if (!p) { const at = JSON.parse(JSON.stringify(d.AT)); p = env.run1196(d.mon, at).then(() => at); APPLIED.set(d, p!); } return p!; }
const r1 = (x: any) => Math.round((Number(x) || 0) * 10) / 10;
const firstName = (s: unknown) => String(s ?? "").trim().split(/\s+/)[0] || "";
// the numbers management's Lesson summary shows, in the portal's shape; checks decide whether they can be shown (else 核对中)
async function lessonsFor(code: string, L2: any, opts: { pkgcheck?: any; pend?: Set<string>; au?: Record<number, any>; rf?: Map<string, any> | null; keep?: Set<string> } = {}) {
  let m: any = null, why: string[] = [];
  try { const [{ env }, d] = await Promise.all([mgmtEnv(), mgmtDataCached()]); m = await mgmtSummary(env, await appliedAT(env, d), d.mon, code, true); }
  catch (e) { why.push("management summary unavailable: " + String((e as any)?.message || e).slice(0, 80)); }
  if (!m) return { ok: false, none: why.length === 0, why };
  const c = m.c, shared = m.shared;
  const out: any = shared
    ? { shared: true, total: r1(c.tot), used: r1(c.done), left: r1(c.left), over: 0, enrolled: r1(c.enrolled), carry: r1(c.carry), transfer: r1(c.trf), free: r1(c.inc), pct: c.pct, teachers: c.T,
        start: c.start, valid: c.deadline, course: c.course, book: c.book || "", owner: c.owner,
        kids: c.kids.map((k: any) => ({ code: k.code, name: firstName(k.name), used: r1(k.finished), me: k.code === code })),
        months: c.hist.map((h: any) => ({ m: h.ym, v: r1(h.v.reduce((a: number, x: number) => a + (+x || 0), 0)), mine: r1(h.v[c.kids.findIndex((k: any) => k.code === code)] || 0) })) }
    : { shared: false, total: r1(c.total), used: r1(c.done), left: r1(c.left), over: r1(c.over), enrolled: r1(c.enrolled), carry: r1(c.carry), free: r1(c.inc), pct: c.pct, teachers: c.T,
        start: c.start, valid: c.deadline, course: c.course, book: c.book || "", owner: c.owner, sub: r1(c.sub), months: c.hist.map((h: any) => ({ m: h.ym, v: r1(h.v) })) };
  // guard 1 · a second, independent calculation (pkg.ts on the sheet copy of ACTIVE) must agree
  const cu = L2 && L2.cur;
  if (!cu) why.push("second calculation missing");
  else { const a = shared ? [out.used, out.left, out.total] : [out.used, out.over ? -out.over : out.left, out.total], b = [cu.used, cu.over ? -cu.over : cu.left, cu.total];
    if (a.some((x, i) => Math.abs(x - b[i]) > 0.05)) why.push("second calculation differs: " + JSON.stringify({ mgmt: a, check: b })); }
  // guard 2 · a package record waiting for calibration / a sheet difference on these packages
  const codes: string[] = shared ? out.kids.map((k: any) => k.code) : [code];
  if (opts.pend && codes.some((k) => opts.pend!.has(k))) why.push("package waiting for calibration (pend)");
  const W = (opts.pkgcheck && Array.isArray(opts.pkgcheck.wrong)) ? opts.pkgcheck.wrong.filter((w: any) => codes.includes(String(w.code))) : [];
  if (W.length) { const f = W.reduce((a: number, w: any) => a + (Number(w.fin) || 0), 0), sf = W.reduce((a: number, w: any) => a + (Number(w.s_fin) || 0), 0);
    const av = W.reduce((a: number, w: any) => a + (Number(w.avail) || 0), 0), sav = W.reduce((a: number, w: any) => a + (Number(w.s_avail) || 0), 0);
    if (Math.abs(f - sf) > 0.05 || Math.abs(av - sav) > 0.05) why.push("database and sheet totals differ (sys:pkgcheck)"); }
  // guard 3 · Google's sheet (sys:pkglink, copied every 2 min) shows the same lessons left on the package row
  if (opts.au) { try { const d = await mgmtDataCached(), C: Record<string, number> = {}; (d.AT.cols as string[]).forEach((x, i) => C[x] = i);
    const own = (d.AT.rows as any[]).find((r) => String(r[C.code]).toUpperCase() === out.owner && r[C.enrolled] !== "" && r[C.start] === out.start);
    const g = own ? opts.au[own[C.row]] : undefined;
    if (own && g !== undefined && g !== "" && own[C.available] !== "" && Math.abs(Number(g) - Number(own[C.available])) > 0.05) why.push("Google sheet shows " + g + " left, database " + own[C.available]); } catch (_) { why.push("sheet check unavailable"); } }
  // guard 4 · 1356 · the renewal month must count only lessons from the renewal date (renew.ts; clears once ACTIVE is fixed)
  if (opts.rf === null) why.push("renewal-month check unavailable");
  if (opts.rf) { const f = codes.map((k) => opts.rf!.get(k)).find(Boolean) || opts.rf.get(code);
    if (f) why.push("renewal month counts lessons before the renewal date (" + f.buy + ": counted " + f.counted + ", from the renewal date " + f.from + ")"); }
  // 1443 · previous teachers last (current first), tagged on the picture
  const pv = await prevOf(code, out.teachers || []).catch(() => [] as string[]);
  if (pv.length) { const P: Record<string, number> = {}; pv.forEach((n) => P[n.toLowerCase()] = 1); out.teachers = out.teachers.filter((n: string) => !P[String(n).toLowerCase()]).concat(out.teachers.filter((n: string) => P[String(n).toLowerCase()])); out.prev = pv; }
  // the picture: management's own HTML; a sibling's Chinese name is left out (first name + code only)
  let html = tagPrev(m.html as string, pv); if (shared) c.kids.forEach((k: any) => { if (k.code !== code && k.cn && !(opts.keep && opts.keep.has(k.code))) html = html.split(k.cn).join(""); });
  return { ok: why.length === 0, why, n: out, html };
}
// sign-off for every active student: management's numbers vs the independent calculation vs Google's sheet (sys:pkglink AU)
async function checkAll() {
  const t0 = Date.now(); const [{ env, hash }, d, R, { data: PC }, { data: PL }, { data: PE }] = await Promise.all([mgmtEnv(), mgmtData(db), activeRows(db),
    db.from("docs").select("data").eq("key", "sys:pkgcheck").maybeSingle(), db.from("docs").select("act:data->act,at:data->at").eq("key", "sys:pkglink").maybeSingle(),
    db.from("coe_packages").select("code").not("pend", "is", null).is("removed_at", null)]);
  DATA = { at: Date.now(), p: Promise.resolve(d) };
  const pend = new Set<string>(((PE as any[]) || []).map((x: any) => String(x.code).toUpperCase()));
  const cols: string[] = d.AT.cols, C: Record<string, number> = {}; cols.forEach((c, i) => C[c] = i);
  const codes = [...new Set((d.AT.rows as any[]).filter((r) => r[C.active]).map((r) => String(r[C.code]).toUpperCase()))].sort();
  const au: Record<number, any> = {}; (((PL as any) && (PL as any).act) || []).forEach((a: any) => { au[+a.r] = a.au; });
  const rf = await renewFlags(db).catch((e) => { console.error("renewFlags", String(e)); return null; });
  const bad: any[] = [], sheet: any[] = []; let ok = 0, checking = 0;
  for (const code of codes) {
    let L2: any = null; try { L2 = await lessonsOf(db, code, R); } catch (_) { /* counted below */ }
    const x = await lessonsFor(code, L2, { pkgcheck: PC && (PC as any).data, pend, au, rf });
    if (!x.n) { if (!x.none) bad.push({ code, why: x.why }); continue; }
    if (x.ok) ok++; else { checking++; bad.push({ code, shows: "核对中", why: x.why, mgmt: { used: x.n.used, left: x.n.left, total: x.n.total, valid: x.n.valid } }); }
    const ownerRow = (d.AT.rows as any[]).find((r) => String(r[C.code]).toUpperCase() === x.n.owner && r[C.enrolled] !== "" && r[C.start] === x.n.start);
    const g = ownerRow ? au[ownerRow[C.row]] : undefined;
    if (ownerRow && g !== undefined && g !== "" && Math.abs(Number(g) - Number(ownerRow[C.available])) > 0.05) sheet.push({ code, owner: x.n.owner, db: ownerRow[C.available], sheet: g });
  }
  const { data: M1 } = await db.rpc("coe_pkg_mon_rows");   // what one unpaged call returns (management's coe-mon makes one call)
  const res = { at: new Date().toISOString(), app: hash, monRows: d.mon.length, monRowsOneCall: (M1 || []).length, students: codes.length, shown: ok, checking, renewFlagged: rf ? rf.size : null, mismatches: bad, sheetDiff: sheet, pkglinkAt: (PL as any)?.at || null, ms: Date.now() - t0 };
  await db.from("docs").upsert({ key: "sys:portalcheck", scope: "mgmt", data: res, updated_at: res.at }, { onConflict: "key" });
  return res;
}

// 1356t · one hold snapshot (Misty: the partner Students list and the card must always agree). Every code on management's ACTIVE screen
// goes through lessonsFor with the same guards; held = any guard fails. Shared by all instances via docs sys:portalholds and refreshed
// when older than 60 s (the previous snapshot is served while a new one is computed in the background).
declare const EdgeRuntime: any;
let HRUN: Promise<any> | null = null, HMEM: { at: number; snap: any } | null = null;
function holdsRun() {
  if (HRUN) return HRUN;
  HRUN = (async () => { const t0 = Date.now();
    const [{ env }, d, R, { data: PC }, { data: PL }, { data: PE }, { data: OLD }] = await Promise.all([mgmtEnv(), mgmtData(db), activeRows(db),
      db.from("docs").select("data").eq("key", "sys:pkgcheck").maybeSingle(), db.from("docs").select("act:data->act").eq("key", "sys:pkglink").maybeSingle(),
      db.from("coe_packages").select("code").not("pend", "is", null).is("removed_at", null), db.from("docs").select("data").eq("key", "sys:portalholds").maybeSingle()]);
    if (OLD && (OLD as any).data) await db.from("docs").update({ data: { ...(OLD as any).data, run: new Date().toISOString() } }).eq("key", "sys:portalholds");
    DATA = { at: Date.now(), p: Promise.resolve(d) }; await appliedAT(env, d);
    const pend = new Set<string>(((PE as any[]) || []).map((x: any) => String(x.code).toUpperCase()));
    const C: Record<string, number> = {}; (d.AT.cols as string[]).forEach((x, i) => C[x] = i);
    const codes = [...new Set((d.AT.rows as any[]).map((r) => String(r[C.code]).toUpperCase()).filter((k) => /^ST-/.test(k)))].sort();
    const au: Record<number, any> = {}; (((PL as any) && (PL as any).act) || []).forEach((a: any) => { au[+a.r] = a.au; });
    const rf = await renewFlags(db).catch(() => null);
    const hold: string[] = [], ok: string[] = [];
    for (let i = 0; i < codes.length; i += 8) await Promise.all(codes.slice(i, i + 8).map(async (code) => {
      let L2: any = null; try { L2 = await lessonsOf(db, code, R); } catch (_) { /* guard 1 fails */ }
      let x: any; try { x = await lessonsFor(code, L2, { pkgcheck: PC && (PC as any).data, pend, au, rf }); } catch (_) { x = { ok: false }; }
      if (x.none) return; (x.ok ? ok : hold).push(code); }));   // no Lesson summary at all = "no package", not held
    const snap = { at: new Date().toISOString(), codes: hold.sort(), ok: ok.sort(), ms: Date.now() - t0 };
    await db.from("docs").upsert({ key: "sys:portalholds", scope: "mgmt", data: snap, updated_at: snap.at }, { onConflict: "key" });
    HMEM = { at: Date.now(), snap }; return snap; })().finally(() => { HRUN = null; });
  return HRUN;
}
async function holds(force = false): Promise<{ at: string; hold: Set<string>; seen: Set<string> }> {
  let snap: any = HMEM && Date.now() - HMEM.at < 10e3 ? HMEM.snap : null;
  if (!snap) { const { data } = await db.from("docs").select("data").eq("key", "sys:portalholds").maybeSingle(); snap = data && (data as any).data; if (snap && snap.at) HMEM = { at: Date.now(), snap }; }
  if (!snap || !snap.at) snap = await holdsRun();
  else { const age = Date.now() - Date.parse(snap.at), run = snap.run ? Date.now() - Date.parse(snap.run) : 1e9;
    if ((force || age > 60e3) && run > 120e3) { const p = holdsRun().catch((e) => console.error("holds", String(e))); try { EdgeRuntime.waitUntil(p); } catch (_) { /* best effort */ } } }
  return { at: snap.at, hold: new Set<string>(snap.codes || []), seen: new Set<string>([...(snap.codes || []), ...(snap.ok || [])]) };
}
// the snapshot decides; a live guard that fails also holds (and asks for a fresh snapshot so the list catches up)
async function applyHold(code: string, LS: any) {
  if (!LS || !LS.n) return LS;
  const H = await holds().catch(() => null), codes: string[] = LS.n.shared ? (LS.n.kids || []).map((k: any) => k.code) : [code];
  if (!H) { LS.ok = false; LS.why.push("hold snapshot unavailable"); return LS; }
  if (codes.some((k) => H.hold.has(k))) { if (LS.ok) LS.why.push("held in snapshot " + H.at); LS.ok = false; }
  else if (!LS.ok && H.seen.has(code)) holds(true).catch(() => null);
  return LS;
}

// 1355b · the monthly report picture parents receive (management's picture code); held back unless the tracker says Sent / Ready
async function fbPicFor(code: string, mo: string, tc: string) {
  const [{ data: FB }, { data: RL }, { data: CN }, N] = await Promise.all([db.from("docs").select("v:data->" + code).eq("key", "sys:fb").maybeSingle(),
    db.from("docs").select("key,data").like("key", "mgmt:mgmtReports|%").limit(40), db.from("docs").select("data").eq("key", "fbcn:" + code + "|" + mo).maybeSingle(), namesOf(code)]);
  let held = false; (RL || []).forEach((d: any) => ((d.data && d.data.rows) || []).forEach((r: any) => { if (codeOf(r.code) === code && r.month === mo && String(r.teacher).toLowerCase() === tc && !/^(sent|ready)/i.test(String(r.status || ""))) held = true; }));
  const fbs: any[] = Array.isArray(FB && (FB as any).v) ? (FB as any).v : [], e = fbs.filter((f) => f && f.month === mo && String(f.teacher || "").toLowerCase() === tc).pop();
  if (!e || held) return { ok: false, msg: "no report" };
  const c0 = (CN && (CN as any).data) || {}, fb = { ...e, cn: Object.assign({}, e.cn || {}, ...["strengths", "areas", "next"].filter((k) => c0[k]).map((k) => ({ [k]: c0[k] }))) };
  const hist = fbs.filter((f) => f && String(f.teacher || "").toLowerCase() === tc).map((f) => ({ month: f.month, total: f.total, l: f.l, s: f.s, r: f.r, w: f.w, items: f.items }));
  try { const a = await mgmtApp(); if (!PIC[a.hash]) PIC[a.hash] = buildPicture(a.src, parseHTML);
    const html = await PIC[a.hash]({ code, month: mo, student: e.student || N.name, teacher: e.teacher }, fb, hist); return { ok: !!html, html }; }
  catch (x) { console.error("fbpic", x); return { ok: false }; }
}
// 1356r · progress evidence for a partner's own student (same sources as the Student portal): journey (confirmed steps), monthly
// reports (Sent / Ready only, reviewed Chinese), last class notes (parent-facing fields), attendance per month (last 6 months)
async function progFor(code: string) {
  const since = new Date(Date.now() - 200 * 864e5).toISOString(), nowIso = new Date().toISOString();
  const [N, R, TRr, PRr, NO, { data: RL }, { data: FB }, BT, { data: PAST }] = await Promise.all([namesOf(code), activeRows(db), rowsBy("TR-DATA", 33, code), rowsBy("PR-DATA", 4, code), rowsBy("S-NOTES", 3, code),
    db.from("docs").select("key,data").like("key", "mgmt:mgmtReports|%").limit(40), db.from("docs").select("v:data->" + code).eq("key", "sys:fb").maybeSingle(), bookTitles(),
    db.from("classes").select("starts_at,cancelled,data").eq("code", code).lt("starts_at", nowIso).gte("starts_at", since).not("id", "like", "pend-%").limit(400)]);
  const L = await lessonsOf(db, code, R).catch(() => null);
  const LSn = L && L.cur ? { left: null, shared: L.cur.shared, course: L.cur.course, start: L.cur.start } : null;   // the journey needs the package's course/start only
  const J: any = await journeyFor(code, N, TRr, PRr, null, LSn).catch(() => null);
  const cj = J ? { ...J, steps: (J.steps || []).filter((x: any) => !x.chk) } : null;
  const track: Record<string, string> = {};
  (RL || []).forEach((d: any) => ((d.data && d.data.rows) || []).forEach((r: any) => { if (codeOf(r.code) === code) track[String(r.teacher).toLowerCase() + "|" + r.month] = String(r.status || ""); }));
  const fbs: any[] = Array.isArray(FB && (FB as any).v) ? (FB as any).v : [], byK: Record<string, any> = {};
  fbs.forEach((f: any) => { if (!f || !/^\d{4}-\d{2}$/.test(String(f.month || ""))) return; const k = String(f.teacher || "").toLowerCase() + "|" + f.month; if (track[k] !== undefined && !/^(sent|ready)/i.test(track[k])) return; byK[k] = f; });
  const reports = Object.keys(byK).map((k) => { const mo = k.split("|")[1], e = byK[k];
    return { month: mo, classMonth: prevMonth(mo), teacher: cap(String(e.teacher || "")), total: Number(e.total) || 0, l: e.l, r: e.r, s: e.s, w: e.w, course: bookOf(BT, e.course || ""), items: Array.isArray(e.items) ? e.items : null }; })
    .sort((a: any, b: any) => b.month.localeCompare(a.month) || a.teacher.localeCompare(b.teacher));
  const first = (t: string) => { const x = String(t || "").replace(/\s+/g, " ").trim(); const m = x.match(/^.*?[.!?。！？](\s|$)/); return (m ? m[0] : x).trim().slice(0, 160); };
  const notes = NO.map((r: any[]) => ({ date: ymd(c(r, 1)), teacher: cap(String(c(r, 2) || "")), ended: norm(c(r, 5)), obs: String(c(r, 9) || "").trim() }))
    .filter((n: any) => n.date && (n.ended || n.obs)).sort((a: any, b: any) => b.date.localeCompare(a.date)).slice(0, 10)
    .map((n: any) => ({ date: n.date, teacher: n.teacher, text: [n.ended, first(n.obs)].filter(Boolean).join(" · ") }));
  const A: Record<string, any> = {}; const m0 = new Date(Date.now() + 8 * 3600e3); m0.setUTCDate(1); m0.setUTCMonth(m0.getUTCMonth() - 5); const from = m0.toISOString().slice(0, 7);
  ((PAST as any[]) || []).forEach((x: any) => { const t = String((x.data && x.data.title) || ""); if (isTrial(t)) return; const m = bj(x.starts_at).day.slice(0, 7); if (m < from) return;
    const o = A[m] = A[m] || { m, done: 0, cancelled: 0, absent: 0, late: null }; if (x.cancelled) o.cancelled++; else if (isAbsent(t)) o.absent++; else o.done++; });
  const att = Object.values(A).sort((a: any, b: any) => a.m.localeCompare(b.m));
  return { cj, reports, notes, att };
}
// 1356q · partner membership = coe-partner's own `student` op (its rules, not a copy): 200 + ok → this partner's student
async function partnerMine(ptok: string, k: string) {
  const r = await fetch(Deno.env.get("SUPABASE_URL") + "/functions/v1/coe-partner", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ op: "student", token: ptok, code: k }) });
  let j: any = null; try { j = await r.json(); } catch (_) { /* below */ } return { status: r.status, ok: r.status === 200 && !!(j && j.ok) };
}
const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], MONS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// management's student header card fields (stuRender · 358 "With us" chip · 739/746 WeChat group · pf29 journey), for a partner's own student
async function cardFor(code: string, ptok: string, LS: any) {
  const [N, TRr, PRr, { data: parts }, { data: WX }, { data: FB }, { data: UP }, { data: PK }, R] = await Promise.all([namesOf(code), rowsBy("TR-DATA", 33, code), rowsBy("PR-DATA", 4, code),
    db.rpc("student_parts", { p_code: code }), db.from("docs").select("data").eq("key", "mgmt:wxgroup").maybeSingle(), db.from("docs").select("v:data->" + code).eq("key", "sys:fb").maybeSingle(),
    db.from("classes").select("starts_at,ends_at,teachers,data").eq("code", code).gte("starts_at", new Date().toISOString()).lte("starts_at", new Date(Date.now() + 15 * 864e5).toISOString()).eq("cancelled", false).not("id", "like", "pend-%").order("starts_at").limit(40),
    db.from("coe_packages").select("active").eq("code", code).is("removed_at", null).limit(20), activeRows(db)]);
  const d = parts && parts.db && parts.db.data, row: any[] = d ? ((d.rows || []).find((r: any[]) => r[0] === code) || []) : [];
  const v = (j: number) => String(row[j] == null ? "" : row[j]).trim();
  let cycle = ""; for (let j = 25; j < Math.min(row.length, 41); j++) if (/^\d+$/.test(v(j))) cycle = v(j);   // pf29: the last filled RENEWAL CYCLE column
  const firsts = N.rows.map((r: any[]) => ymd(c(r, 16))).filter(Boolean).sort(), first = firsts[0] || ymd(v(16));
  let since = ""; if (first) { const t = new Date(Date.now() + 8 * 3600e3); let mo = (t.getUTCFullYear() - +first.slice(0, 4)) * 12 + (t.getUTCMonth() + 1 - +first.slice(5, 7)); if (t.getUTCDate() < +first.slice(8, 10)) mo--;
    if (mo >= 0) { const y = Math.floor(mo / 12), m = mo % 12; since = (mo < 1 ? "New this month" : "With us " + (y ? y + " yr" + (y > 1 ? "s" : "") : "") + (y && m ? " " : "") + (m ? m + " mo" : "")) + " · since " + MONS[+first.slice(5, 7) - 1] + " " + first.slice(0, 4); } }
  // WeChat family group (746): the manual link (mgmt:wxgroup) else ACTIVE's shared column; names of children who are not this partner's are left out
  const up = (x: unknown) => String(x ?? "").trim().toUpperCase(), M0: any = (WX && (WX as any).data) || {};
  let main = (M0[code] && M0[code].to) || code, fam = [main].concat(Object.keys(M0).filter((k) => M0[k] && M0[k].to === main && k !== main));
  if (fam.length < 2) { const S: string[] = []; R.forEach((r: any) => { const a = up(r.code), b = (up(r.shared).match(/ST-\d{4}-\d{3}/) || [""])[0]; if (!b || a === b || r.enrolled === "") return; if (a === code || b === code) S.push(a + ">" + b); });
    if (S.length) { const [hold] = S[0].split(">"); main = hold; fam = [hold].concat(S.map((x) => x.split(">")[1]).filter((x, i, a) => a.indexOf(x) === i)); } else fam = [code]; }
  const en = (n: string) => String(n || "").replace(/[　-鿿＀-￯].*$/, "").trim() || String(n || "").trim();
  const nameOf = (k: string) => { const r = R.find((x: any) => up(x.code) === k); return r ? r.name : ""; };
  const ok = new Set<string>([code]); (await Promise.all(fam.filter((k) => k !== code).map(async (k) => ({ k, ok: (await partnerMine(ptok, k)).ok })))).forEach((x) => { if (x.ok) ok.add(x.k); });
  const wechat = "一杯英语 " + fam.filter((k) => ok.has(k)).map((k) => en(k === code ? N.name : nameOf(k))).join(" & ") + " (" + main + ")";
  const shares = fam.filter((k) => k !== code && ok.has(k)).map((k) => ({ code: k, name: en(nameOf(k)) }));
  // KPIs: lessons left (only when every Lesson summary check passed), CEFR now (management's journey code), latest monthly feedback /100
  const n = LS && LS.ok ? LS.n : null;
  const CJ = await journeyFor(code, N, TRr, PRr, n, LS && LS.n).catch(() => null);
  const fbs: any[] = Array.isArray(FB && (FB as any).v) ? (FB as any).v : [], f0 = fbs.filter((f) => f && /^\d{4}-\d{2}$/.test(String(f.month || ""))).sort((a, b) => String(b.month).localeCompare(String(a.month)))[0];
  // fixed weekly times: weekday + time + teacher seen in the next 15 days (Beijing time)
  const W: Record<string, any> = {}; let next: any = null;
  ((UP as any[]) || []).forEach((x: any) => { const t = String((x.data && x.data.title) || ""); if (isTrial(t)) return; const a = bj(x.starts_at), w = WD[new Date(Date.parse(a.day + "T12:00:00Z")).getUTCDay()];
    const len = Math.round((Date.parse(x.ends_at || x.data?.end || x.starts_at) - Date.parse(x.starts_at)) / 6e4) || 25, te = cap(String((x.teachers || [])[0] || ""));
    if (!next) next = { date: a.day, time: a.time, teacher: te, len };
    const k = w + "|" + a.time + "|" + te; W[k] = W[k] || { d: w, t: a.time, len, teacher: te, n: 0 }; W[k].n++; });
  const order = (x: any) => ((WD.indexOf(x.d) + 6) % 7) * 1440 + (+x.t.slice(0, 2)) * 60 + (+x.t.slice(3, 5));
  const WV = Object.values(W), fixed = WV.filter((x: any) => x.n >= 2);   // seen twice in 15 days = a fixed weekly time
  const weekly = (fixed.length ? fixed : WV).sort((a: any, b: any) => order(a) - order(b)).map(({ n: _n, ...x }: any) => x);
  // 1443 · the card's teachers = management's student-page list, current first, previous last
  const MT = await mgmtTeachersOf(code, R).catch(() => [] as string[]), MP = MT.length ? await prevOf(code, MT).catch(() => [] as string[]) : [];
  const MTo = MT.filter((t) => !MP.includes(t)).concat(MT.filter((t) => MP.includes(t)));
  return { name: N.name, cn: N.cn, active: ((PK as any[]) || []).some((p: any) => p.active), wechat, shares,
    age: v(6), city: v(9), since, teachers: MTo.length ? MTo : (n ? n.teachers || [] : (LS && LS.n ? LS.n.teachers || [] : [])), prevTeachers: MTo.length ? MP : ((n || (LS && LS.n) || {}).prev || []), book: (LS && LS.n && LS.n.book) || "", level: v(19),
    left: n ? n.left : null, checking: !n && !(LS && LS.none), nopkg: !!(LS && LS.none), cefr: (CJ && CJ.now) || "", latest: f0 ? Number(f0.total) || 0 : null,
    weekly, next, journey: { len: v(15), trial: ymd(v(10)), first: ymd(v(16)), renewed: (await paidOf(code, ymd(v(24)))) || ymd(v(24)), renewStart: ymd(v(24)), cycle } };
}

// ── 1530 · Philippine market ──
async function phMarks(): Promise<Record<string, any>> { const { data } = await db.from("docs").select("data").eq("key", "sys:ph_learners").maybeSingle(); return ((data as any) && (data as any).data && (data as any).data.codes) || {}; }
async function phOf(code: string) {
  const [M, { data: PD }] = await Promise.all([phMarks(), db.from("docs").select("data").eq("key", "sys:pricing_ph").maybeSingle()]);
  const m = M[code]; if (!m) return null;
  const doc: any = (PD as any) && (PD as any).data, P = ((doc && doc.programs) || []).find((x: any) => x.id === m.prog) || null;
  const cancelHours = Number(doc && doc.cancel_hours) > 0 ? Number(doc.cancel_hours) : 4;   // v24 (1535): the PH cancellation notice
  if (!P) return { prog: null, track: null, cancelHours };
  const T = (P.tracks || []).find((t: any) => t.id === m.track) || null, tid = T ? T.id : "";
  const strip = (t: any) => t ? { id: t.id, name: t.name, lessons: t.lessons, extra: t.extra || "", hours: t.hours, target: t.target, gain: t.gain || "", goal: t.goal, outcome: t.outcome } : null;   // never a price
  const sys = P.system || {};
  return { prog: { id: P.id, name: P.name, short: P.short, tagline: P.tagline, lessonMins: P.lessonMins, measure: P.measure, small: P.small, method: P.method, closing: P.closing,
      flyers: (P.flyers || []).filter((f: any) => !/-program$/.test(f.id)).map((f: any) => ({ id: f.id, title: f.title })),   // the learning-system and roadmap pictures; not the price flyer
      system: { title: sys.title, sub: sys.sub, footer: sys.footer || [], skills: (sys.skills || []).map((k: any) => ({ name: k.name, aim: k.aim, core: k.core || [], result: k.result, all: k.all || "", coach: k.coach || [], focus: tid && k.focus ? (k.focus[tid] || []) : [] })) },
      tracks: (P.tracks || []).map(strip) }, track: strip(T), cancelHours };
}

Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const op = String(b.op || "");
  const ip = String(req.headers.get("x-forwarded-for") || "").split(",")[0].trim().slice(0, 60);

  // ───────── management: list / switch off / clear own password ─────────
  if (/^s(List|Active|ClearPw|Market|PhPay)$/.test(op)) {
    const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
    const { data: s } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
    if (!s || new Date(s.exp).getTime() < Date.now() || s.mode !== "mgmt") return out({ ok: false, error: "AUTH" }, 401);
    if (op === "sList") {
      const [{ data: A }, { data: PK }, DBR, PHM] = await Promise.all([
        db.from("student_access").select("code,active,pw_set_at,last_login,logins").limit(5000),
        db.from("coe_packages").select("code,name,cn,active").is("removed_at", null).limit(5000),
        (async () => { const o: any[] = []; for (let f = 0; f < 20000; f += 1000) { const { data, error } = await db.from("sheet_rows").select("data").eq("tab", "DATABASE").order("r").range(f, f + 999); if (error || !data) break; o.push(...data); if (data.length < 1000) break; } return o; })(), phMarks()]);
      const AD: Record<string, boolean> = {}; (DBR || []).forEach((x: any) => { const r = x.data || [], k = codeOf(c(r, 0)); if (k && adultRow(r)) AD[k] = true; });
      const m: Record<string, any> = {};
      (PK || []).forEach((p: any) => { const k = codeOf(p.code); if (!k) return; const o = m[k] = m[k] || { code: k, name: norm(p.name), cn: norm(p.cn), active: false }; if (p.active) o.active = true; if (!o.name) o.name = norm(p.name); if (!o.cn) o.cn = norm(p.cn); });
      (A || []).forEach((a: any) => { const o = m[a.code] = m[a.code] || { code: a.code, name: "", cn: "", active: false }; o.access = a.active; o.own = !!a.pw_set_at; o.last = a.last_login; o.logins = a.logins; });
      const list = Object.values(m).map((o: any) => ({ code: o.code, name: o.name, cn: o.cn, adult: !!AD[o.code], enrolled: o.active, access: o.access !== false, own: !!o.own, last: o.last || null, logins: o.logins || 0, ph: PHM[o.code] ? { prog: PHM[o.code].prog || "", track: PHM[o.code].track || "" } : null }))
        .sort((a: any, b: any) => (+b.enrolled - +a.enrolled) || a.code.localeCompare(b.code));
      return out({ ok: true, students: list });
    }
    if (op === "sPhPay") {   // 1533 · Philippine payment details (UnionBank account / QR) in docs sys:pricing_ph.payment; management only
      const t = (v: unknown, n: number) => String(v ?? "").replace(/\s+/g, " ").trim().slice(0, n);
      const qr = b.qr === undefined ? undefined : String(b.qr || "");
      if (qr && !/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(qr) && !/^ph\/[\w.-]{1,60}\.(png|jpg|webp)$/.test(qr)) return out({ ok: false, msg: "The QR must be a PNG, JPEG or WebP picture" });   // an uploaded picture, or a picture hosted with the app (ph/…)
      if (qr && qr.length > 600000) return out({ ok: false, msg: "The QR picture is too large" });
      for (let i = 0; i < 3; i++) {
        const { data: cur } = await db.from("docs").select("data,updated_at").eq("key", "sys:pricing_ph").maybeSingle();
        if (!cur) return out({ ok: false, msg: "Price list missing" });
        const d: any = (cur as any).data || {}, old = d.payment || {};
        d.payment = { bank: t(b.bank, 60) || "UnionBank", name: t(b.name, 120), number: t(b.number, 60), method: t(b.method, 60), note: t(b.note, 160), qr: qr === undefined ? (old.qr || "") : qr, at: new Date().toISOString(), by: s.name };
        const { data: up, error } = await db.from("docs").update({ data: d, updated_at: new Date().toISOString() }).eq("key", "sys:pricing_ph").eq("updated_at", (cur as any).updated_at).select("key");
        if (!error && up && up.length) return out({ ok: true, payment: { ...d.payment, qr: d.payment.qr ? "set" : "" } });
      }
      return out({ ok: false, msg: "Busy · try again" });
    }
    const code = codeOf(b.code); if (!code) return out({ ok: false, msg: "No student code" });
    if (op === "sMarket") {   // 1530 · mark / unmark a Philippine-market learner (+ programme and track); docs sys:ph_learners only
      const prog = String(b.prog || ""), track = String(b.track || "");
      if (b.ph && !/^(adult|ielts|yle|teens)$/.test(prog)) return out({ ok: false, msg: "Pick the programme" });
      if (b.ph && track && !/^(foundation|professional|mastery)$/.test(track)) return out({ ok: false, msg: "Unknown track" });
      for (let i = 0; i < 3; i++) {   // read-modify-write, retried if someone else saved in between
        const { data: cur } = await db.from("docs").select("data,updated_at").eq("key", "sys:ph_learners").maybeSingle();
        const d: any = (cur && (cur as any).data) || { codes: {} }; d.codes = d.codes || {};
        if (b.ph) d.codes[code] = { prog, track, at: new Date().toISOString(), by: s.name }; else delete d.codes[code];
        const at = new Date().toISOString();
        if (!cur) { const { error } = await db.from("docs").insert({ key: "sys:ph_learners", scope: "mgmt", data: d, updated_at: at }); if (!error) return out({ ok: true }); continue; }
        const { data: up, error } = await db.from("docs").update({ data: d, updated_at: at }).eq("key", "sys:ph_learners").eq("updated_at", (cur as any).updated_at).select("key");
        if (!error && up && up.length) return out({ ok: true });
      }
      return out({ ok: false, msg: "Busy · try again" });
    }
    if (op === "sActive") {
      const { error } = await db.from("student_access").upsert({ code, active: !!b.active, updated_at: new Date().toISOString(), updated_by: s.name }, { onConflict: "code" });
      if (!b.active) await db.from("student_sessions").delete().eq("code", code);
      return out({ ok: !error });
    }
    // sClearPw: back to the English name; signs the family out
    const { error } = await db.from("student_access").upsert({ code, pw_hash: null, pw_salt: null, pw_iter: null, pw_set_at: null, updated_at: new Date().toISOString(), updated_by: s.name }, { onConflict: "code" });
    await db.from("student_sessions").delete().eq("code", code);
    return out({ ok: !error });
  }

  if (op === "check") {   // daily reconciliation (pg_cron) → docs sys:portalcheck; the reply carries counts only
    const { data: last } = await db.from("docs").select("updated_at").eq("key", "sys:portalcheck").maybeSingle();
    if (last && Date.now() - Date.parse(last.updated_at) < 120e3) return out({ ok: true, skipped: "ran in the last 2 minutes" });
    try { const r = await checkAll(); return out({ ok: true, students: r.students, shown: r.shown, checking: r.checking, renewFlagged: (r as any).renewFlagged, mismatches: r.mismatches.length, sheetDiff: r.sheetDiff.length, ms: r.ms }); }
    catch (e) { return out({ ok: false, error: String((e as any)?.message || e).slice(0, 120) }, 500); }
  }

  if (op === "cjdiff") {   // 1355 preview (counts only in the reply; the list goes to docs sys:cjdiff for management)
    const br = String(b.branch || ""); if (!/^test-[\w.-]{1,30}$/.test(br)) return out({ ok: false, error: "branch" }, 400);
    const { data: last } = await db.from("docs").select("updated_at").eq("key", "sys:cjdiff").maybeSingle();
    if (last && Date.now() - Date.parse(last.updated_at) < 120e3) return out({ ok: true, skipped: "ran in the last 2 minutes" });
    try { const r = await cjDiff(br, (Array.isArray(b.sample) ? b.sample : []).map((x: any) => codeOf(x)).filter(Boolean).slice(0, 5)); return out({ ok: true, students: r.students, done: r.done, errors: r.errors, changed: r.changed.length }); }
    catch (e) { return out({ ok: false, error: String((e as any)?.message || e).slice(0, 120) }, 500); }
  }

  if (op === "pholds") {   // 1356t · the hold snapshot for THIS partner's students (membership = coe-partner's own list)
    const ptok = String(b.token || ""); if (ptok.length < 32) return out({ ok: false, error: "AUTH" }, 401);
    const [r, H] = await Promise.all([fetch(Deno.env.get("SUPABASE_URL") + "/functions/v1/coe-partner", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ op: "list", token: ptok }) }), holds()]);
    if (r.status === 401) return out({ ok: false, error: "AUTH" }, 401);
    let j: any = null; try { j = await r.json(); } catch (_) { /* below */ } if (!r.ok || !j || !j.ok) return out({ ok: false }, 502);
    const mine = ((j.students || []) as any[]).map((x) => codeOf(x.code)).filter(Boolean);
    return out({ ok: true, at: H.at, codes: mine.filter((k) => H.hold.has(k)), nopkg: mine.filter((k) => !H.seen.has(k)) });
  }

  // 1356q · Dr. Spring's partner portal: management's Lesson summary picture for one of HER students (partner session token).
  // Auth + membership = coe-partner's own `student` op (no rules duplicated here). Same lessons path and guards as the student
  // portal; numbers + html only when every check passes, else 核对中. A sibling's Chinese name stays only if that sibling is hers too.
  if (op === "plsum" || op === "pcard" || op === "pprog" || op === "pfbpic") {
    const ptok = String(b.token || ""), code = codeOf(b.code); if (ptok.length < 32 || !code) return out({ ok: false, error: "AUTH" }, 401);
    const mine = (k: string) => partnerMine(ptok, k);
    const me = await mine(code);
    if (me.status === 401) return out({ ok: false, error: "AUTH" }, 401);
    if (me.status === 403) return out({ ok: false, error: "not your student" }, 403);
    if (!me.ok) return out({ ok: false, checking: true });
    if (op === "pfbpic") { const mo = String(b.month || ""), tc = String(b.teacher || "").trim().toLowerCase(); if (!/^\d{4}-\d{2}$/.test(mo) || !tc) return out({ ok: false }, 400); return out(await fbPicFor(code, mo, tc)); }
    if (op === "pprog") { try { return out({ ok: true, ...(await progFor(code)), at: new Date().toISOString() }); } catch (e) { console.error("pprog", e); return out({ ok: false }); } }
    try {
      const [R, { data: PC }, { data: PLK }, { data: PE }] = await Promise.all([activeRows(db), db.from("docs").select("data").eq("key", "sys:pkgcheck").maybeSingle(),
        db.from("docs").select("act:data->act").eq("key", "sys:pkglink").maybeSingle(), db.from("coe_packages").select("code").not("pend", "is", null).is("removed_at", null)]);
      const L2 = await lessonsOf(db, code, R);
      const au: Record<number, any> = {}; (((PLK as any) && (PLK as any).act) || []).forEach((a: any) => { au[+a.r] = a.au; });
      const pend = new Set<string>(((PE as any[]) || []).map((x: any) => String(x.code).toUpperCase()));
      const rf = await renewFlags(db).catch((e) => { console.error("renewFlags", String(e)); return null; });
      const sib = L2 && L2.cur && L2.cur.shared ? (L2.cur.kids || []).map((k: any) => k.code).filter((k: string) => k !== code) : [];
      const keep = new Set<string>(); (await Promise.all(sib.map(async (k: string) => ({ k, ok: (await mine(k)).ok })))).forEach((x) => { if (x.ok) keep.add(x.k); });
      const LS = await lessonsFor(code, L2, { pkgcheck: PC && (PC as any).data, pend, au, rf, keep }); await applyHold(code, LS);
      if (op === "pcard") return out({ ok: true, card: await cardFor(code, ptok, LS), at: new Date().toISOString() });
      if (!LS.ok || !LS.n) { if (LS.n) console.warn("plsum checking", code, JSON.stringify(LS.why)); return out({ ok: false, checking: true }); }
      const n = LS.n;
      return out({ ok: true, html: LS.html, n: { total: n.total, used: n.used, left: n.left, over: n.over, valid: n.valid, start: n.start, shared: n.shared, kids: n.kids || [] }, at: new Date().toISOString() });
    } catch (e) { console.error(op, e); return out({ ok: false, checking: true }); }
  }

  // ───────── sign-in: ST code + English name (or own password) ─────────
  if (op === "login") {
    const code = codeOf(b.code), pw = String(b.password || "").slice(0, 200);
    const t15 = new Date(Date.now() - 15 * 6e4).toISOString(), t60 = new Date(Date.now() - 60 * 6e4).toISOString();
    const [{ count: fc }, { count: fi }] = await Promise.all([
      db.from("student_login_attempts").select("id", { count: "exact", head: true }).eq("code", code || "?").eq("ok", false).gte("at", t15),
      db.from("student_login_attempts").select("id", { count: "exact", head: true }).eq("ip", ip || "?").eq("ok", false).gte("at", t60)]);
    if ((code && (fc || 0) >= 5) || (ip && (fi || 0) >= 30)) return out({ ok: false, msg: "尝试次数过多，请15分钟后再试 · Too many tries — please try again in 15 minutes" }, 429);
    let ok = false, nm: any = null, PHL: Record<string, any> = {};
    if (code) {
      const [{ data: acc }, N, PM] = await Promise.all([db.from("student_access").select("active,pw_hash,pw_salt,pw_iter").eq("code", code).maybeSingle(), namesOf(code), phMarks().catch(() => ({} as Record<string, any>))]);
      nm = N; PHL = PM;
      if (!acc || acc.active !== false) {
        if (acc && acc.pw_hash && acc.pw_salt) ok = eqT(await pbkdf2(pw, acc.pw_salt, acc.pw_iter || 120000), acc.pw_hash);
        else { const k = nameKey(pw); ok = !!k && (PHL[code] ? new Set([...N.en].map((n) => n.split(" ")[0])).has(k) : N.en.has(k)); }   // 1533 · PH: first word only
      }
    }
    await db.from("student_login_attempts").insert({ code: code || String(b.code || "").slice(0, 20), ip, ok });
    if (!ok) return out({ ok: false, msg: "学号或密码不正确 · Wrong student code or password" }, 401);
    const token = rnd(32);
    await db.from("student_sessions").insert({ token_hash: await sha(token), code, exp: new Date(Date.now() + 30 * 864e5).toISOString(), ua: String(req.headers.get("user-agent") || "").slice(0, 160) });
    const { data: cur } = await db.from("student_access").select("logins").eq("code", code).maybeSingle();
    await db.from("student_access").upsert({ code, last_login: new Date().toISOString(), logins: ((cur && cur.logins) || 0) + 1 }, { onConflict: "code" });
    return out({ ok: true, token, code, name: nm.name, cn: nm.cn, adult: !!nm.adult, market: PHL[code] ? "ph" : "cn" });
  }

  // ───────── signed-in reads ─────────
  const token = String(b.token || ""); if (token.length < 32) return out({ ok: false, error: "AUTH" }, 401);
  const th = await sha(token);
  const { data: ss } = await db.from("student_sessions").select("code,exp").eq("token_hash", th).maybeSingle();
  if (!ss || new Date(ss.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
  const code = ss.code as string;
  const { data: acc } = await db.from("student_access").select("active").eq("code", code).maybeSingle();
  if (acc && acc.active === false) { await db.from("student_sessions").delete().eq("code", code); return out({ ok: false, error: "AUTH" }, 401); }
  if (op === "logout") { await db.from("student_sessions").delete().eq("token_hash", th); return out({ ok: true }); }
  const nowIso = new Date().toISOString();

  if (op === "setpw") {   // optional own password; the English name then stops working
    const pw = String(b.password || ""); if (pw.length < 6 || pw.length > 64) return out({ ok: false, msg: "密码至少6位 · At least 6 characters" });
    const salt = rnd(16), hash = await pbkdf2(pw, salt, 120000);
    const { error } = await db.from("student_access").upsert({ code, pw_hash: hash, pw_salt: salt, pw_iter: 120000, pw_set_at: nowIso, updated_at: nowIso, updated_by: "parent" }, { onConflict: "code" });
    await db.from("student_sessions").delete().eq("code", code).neq("token_hash", th);   // other phones sign in again with the new password
    return out({ ok: !error });
  }

  if (op === "hwDone") {
    const day = ymd(b.day), ev = String(b.event || "").slice(0, 120); if (!day || !ev) return out({ ok: false }, 400);
    if (b.done) { const { error } = await db.from("student_hw_done").upsert({ code, day, event_id: ev, done_at: nowIso }, { onConflict: "code,day,event_id" }); return out({ ok: !error }); }
    const { error } = await db.from("student_hw_done").delete().eq("code", code).eq("day", day).eq("event_id", ev); return out({ ok: !error });
  }

  if (op === "fbpic") {   // 1355b · the monthly report picture, made by management's own picture code (same as the one sent to parents)
    const mo = String(b.month || ""), tc = String(b.teacher || "").trim().toLowerCase(); if (!/^\d{4}-\d{2}$/.test(mo) || !tc) return out({ ok: false }, 400);
    const r = await fbPicFor(code, mo, tc); return out(r);
  }

  if (op === "all" || op === "notes") {   // one call for the whole page (fewer round trips from China)
    const since = new Date(Date.now() - 120 * 864e5).toISOString(), to = new Date(Date.now() + 28 * 864e5).toISOString(), since60 = new Date(Date.now() - 60 * 864e5).toISOString().slice(0, 10);
    const [N, L, { data: SRC }, { data: UP }, { data: PAST }, TRr, PRr, NO, HW, { data: WN }, { data: DONE }, { data: RL }, { data: FB }, BT, { data: SA }, PHX] = await Promise.all([
      namesOf(code), activeRows(db).then((R) => lessonsOf(db, code, R)).catch((e) => { console.error("lessons", e); return null; }),
      db.from("coe_packages").select("source,pend,shared").eq("code", code).limit(50),
      db.from("classes").select("starts_at,ends_at,teachers,data").eq("code", code).gte("starts_at", nowIso).lte("starts_at", to).eq("cancelled", false).not("id", "like", "pend-%").order("starts_at").limit(60),
      db.from("classes").select("starts_at,ends_at,teachers,cancelled,data").eq("code", code).lt("starts_at", nowIso).gte("starts_at", since).not("id", "like", "pend-%").order("starts_at", { ascending: false }).limit(80),
      rowsBy("TR-DATA", 33, code), rowsBy("PR-DATA", 4, code), rowsBy("S-NOTES", 3, code), rowsBy("S-HOMEWORK", 3, code),
      db.from("writes").select("fn,args,status,created_at").in("fn", ["saveNote", "markHomework"]).neq("status", "error").neq("status", "test").gte("created_at", new Date(Date.now() - 14 * 864e5).toISOString()).filter("args->1->>code", "eq", code).order("id").limit(200),
      db.from("student_hw_done").select("day,event_id,done_at").eq("code", code).limit(3000),
      db.from("docs").select("key,data").like("key", "mgmt:mgmtReports|%").limit(40),
      db.from("docs").select("v:data->" + code).eq("key", "sys:fb").maybeSingle(),
      bookTitles(),
      db.from("student_access").select("pw_set_at").eq("code", code).maybeSingle(), phOf(code).catch((e) => { console.error("ph", e); return null; })]);
    // 1355b · this week (Beijing today … +7 days) with cancelled and moved classes, for the Home "本周课表" list
    const bjDay0 = new Date(Date.parse(new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10) + "T00:00:00+08:00")).toISOString();
    const { data: WK } = await db.from("classes").select("starts_at,ends_at,teachers,cancelled,data").eq("code", code).gte("starts_at", bjDay0).lte("starts_at", new Date(Date.parse(bjDay0) + 8 * 864e5).toISOString()).not("id", "like", "pend-%").order("starts_at").limit(40);
    const mvOf = (x: any) => { let m = x.data && x.data.mv; if (typeof m === "string") { try { m = JSON.parse(m); } catch { m = null; } } return m && m.start ? bj(m.start) : null; };
    const week = ((WK as any[]) || []).map((x: any) => { const t = String((x.data && x.data.title) || ""), mv = x.cancelled ? mvOf(x) : null;
      return { ...cls(BT, x), status: x.cancelled ? (mv ? "moved" : "cancelled") : Date.parse(x.starts_at) < Date.now() ? (isAbsent(t) ? "absent" : "done") : "up", to: mv }; });
    const up = ((UP as any[]) || []).map((x: any) => cls(BT, x));
    const past = ((PAST as any[]) || []).map((x: any) => { const t = String((x.data && x.data.title) || ""); return { ...cls(BT, x), status: x.cancelled ? "cancelled" : isAbsent(t) ? "absent" : "done" }; });
    // homework & class notes: sheet copies + saves not copied yet (newest wins), last 60 days
    const notes: Record<string, any> = {};
    const key = (d: string, ev: string) => d + "|" + ev;
    const put = (d: string, ev: string, o: any) => { if (!d) return; const k = key(d, ev || ""); notes[k] = Object.assign(notes[k] || { day: d, event: ev || "" }, Object.fromEntries(Object.entries(o).filter(([, v]) => v != null && String(v).trim() !== ""))); };
    NO.forEach((r: any[]) => put(ymd(c(r, 1)), String(c(r, 8)), { teacher: cap(String(c(r, 2))), ended: norm(c(r, 5)), next: String(c(r, 6) || "").trim(), homework: String(c(r, 7) || "").trim(), obs: String(c(r, 9) || "").trim() }));
    HW.forEach((r: any[]) => put(ymd(c(r, 1)), String(c(r, 6)), { teacher: cap(String(c(r, 2))), homework: String(c(r, 5) || "").trim() }));
    ((WN as any[]) || []).forEach((w: any) => { const a = (w.args || [])[1] || {}; if (codeOf(a.code) !== code) return;
      if (w.fn === "saveNote") put(ymd(a.date), String(a.eventId || ""), { ended: norm(a.ended), next: String(a.next || "").trim(), homework: String(a.homework || "").trim(), obs: String(a.obs || "").trim() });
      else put(ymd(a.date), String(a.eventId || ""), { homework: String(a.homework || a.text || "").trim() }); });
    const dn: Record<string, string> = {}; ((DONE as any[]) || []).forEach((x: any) => { dn[key(String(x.day), x.event_id)] = x.done_at; });
    const tByDay: Record<string, string> = {}; past.forEach((p) => { if (!tByDay[p.day]) tByDay[p.day] = p.teacher; });
    const hw = Object.values(notes).filter((n: any) => n.homework || n.obs || n.next).map((n: any) => ({ day: n.day, event: n.event, teacher: n.teacher || tByDay[n.day] || "", ended: n.ended || "", homework: n.homework || "", obs: n.obs || "", next: n.next || "", done: dn[key(n.day, n.event)] || null }))
      .sort((a: any, b: any) => b.day.localeCompare(a.day));
    // the management Notes tab's cards: this month's notes and homework, the last page reached, pages over time (by book)
    const ym0 = nowIso.slice(0, 7), pg = (t: string) => { const m = String(t || "").match(/^\s*([^·]+?)\s*·.*?\bSB\s*p\.?\s*(\d+)/i); return m ? { book: m[1].trim(), p: +m[2] } : null; };
    const pages = hw.slice().reverse().map((n: any) => { const q = pg(n.ended); return q ? { d: n.day, book: q.book, p: q.p } : null; }).filter(Boolean) as any[];
    const lastP = pages[pages.length - 1] || null;
    const notesKpi = { month: hw.filter((n: any) => n.day.slice(0, 7) === ym0).length, hwMonth: hw.filter((n: any) => n.day.slice(0, 7) === ym0 && n.homework).length,
      last: lastP, pages: lastP ? pages.filter((x) => x.book === lastP.book).slice(-20) : [], total: hw.length };
    if (op === "notes") { const from = Math.max(0, Number(b.from) || 0); return out({ ok: true, hw: hw.slice(from, from + 30), hwTotal: hw.length }); }
    // progress
    const T = TRr.map(trOf), P = PRr.map(prOf), m = N.rows.length ? merge(N.rows) : null;
    const journey = m ? { start: { date: m.first || m.td, level: CJ_L[lv(m.tc)] || "", book: bookOf(BT, m.tb) }, path: m.cb.split(/→|->/).map((x) => x.trim()).filter(Boolean), now: nowOf(N.rows, T, P), trial: m.td ? { date: ymd(m.td), level: CJ_L[lv(m.tc)] || "" } : null, first: m.first,
      checks: P.filter((p) => p.date && lv(p.cefr) >= 0).map((p) => ({ date: p.date, level: CJ_L[lv(p.cefr)] })).sort((a, b) => a.date.localeCompare(b.date)) } : null;
    // monthly class feedback (1355b): every report the teacher wrote for the family (sys:fb, the same source as management's monthly feedback),
    // newest first; a report the October tracker (mgmtReports) still holds back (not "Sent" yet) is left out. Family-facing fields only.
    const track: Record<string, string> = {};
    (RL || []).forEach((d: any) => ((d.data && d.data.rows) || []).forEach((r: any) => { if (codeOf(r.code) === code) track[String(r.teacher).toLowerCase() + "|" + r.month] = String(r.status || ""); }));
    const fbs: any[] = Array.isArray(FB && (FB as any).v) ? (FB as any).v : [], byK: Record<string, any> = {}, cnOver: Record<string, any> = {};
    fbs.forEach((f: any) => { if (!f || !/^\d{4}-\d{2}$/.test(String(f.month || ""))) return; const k = String(f.teacher || "").toLowerCase() + "|" + f.month; if (track[k] !== undefined && !/^(sent|ready)/i.test(track[k])) return; byK[k] = f; });
    const keys = Object.keys(byK);
    if (keys.length) { const { data: CN } = await db.from("docs").select("key,data").in("key", [...new Set(keys.map((k) => "fbcn:" + code + "|" + k.split("|")[1]))]); (CN || []).forEach((x: any) => { cnOver[x.key.split("|")[1]] = x.data; }); }
    const reports = keys.map((k) => { const mo = k.split("|")[1], e = byK[k], cn = Object.assign({}, e.cn || {}, cnOver[mo] || {});
      return { month: mo, classMonth: prevMonth(mo), teacher: cap(String(e.teacher || "")), total: Number(e.total) || 0, l: e.l, r: e.r, s: e.s, w: e.w, course: bookOf(BT, e.course || ""), items: Array.isArray(e.items) ? e.items : null,
        cn: { strengths: cn.strengths || "", areas: cn.areas || "", next: cn.next || "" }, en: { strengths: e.strengths || "", areas: e.areas || "", next: e.next || "" } }; })
      .sort((a: any, b: any) => b.month.localeCompare(a.month) || a.teacher.localeCompare(b.teacher));
    // lessons: exactly management's Lesson summary (shared packages: the owner's package, lessons left for the whole family)
    const today0 = nowIso.slice(0, 10), [{ data: PC }, { data: PLK }] = await Promise.all([db.from("docs").select("data").eq("key", "sys:pkgcheck").maybeSingle(), db.from("docs").select("act:data->act").eq("key", "sys:pkglink").maybeSingle()]);
    const au: Record<number, any> = {}; (((PLK as any) && (PLK as any).act) || []).forEach((a: any) => { au[+a.r] = a.au; });
    const pendC = new Set<string>(((SRC as any[]) || []).filter((x: any) => x.pend != null).map(() => code));
    const rf = await renewFlags(db).catch((e) => { console.error("renewFlags", String(e)); return null; });
    const LS = await lessonsFor(code, L, { pkgcheck: PC && (PC as any).data, pend: pendC, au, rf }); await applyHold(code, LS);
    const n = LS.n;   // management's Lesson summary numbers; not shown (核对中) unless every check passes
    const pkg = n && !LS.ok ? { checking: true } : n ? { checking: false, total: n.total, used: n.used, left: n.left, over: n.over, valid: n.valid, start: n.start, shared: n.shared, kids: n.kids || [], teachers: n.teachers, prev: n.prev || [],
      expired: !!(n.valid && n.valid < today0 && n.left > 0),
      renew: LS.ok && n.left <= 4 && !(n.left <= 0 && up.length > 0) } : null;   // never a renewal nudge from a zero while classes are booked
    if (!LS.ok && n) console.warn("checking", code, JSON.stringify(LS.why));
    const partnerStudent = ((SRC as any[]) || []).some((x: any) => partnerish(x.source)) || N.rows.some((r: any[]) => partnerish(c(r, 22)));
    const [H, PAY, CJ] = await Promise.all([historyOf(db, code, N.rows).catch(() => null), paymentsOf(db, code, L, partnerStudent, N.name, N.cn).catch((e) => { console.error("pay", e); return null; }),
      journeyFor(code, N, TRr, PRr, LS.ok ? n : null, n).catch((e) => { console.error("cj", e); return null; })]);
    const lessons = n ? { ok: LS.ok, cur: LS.ok ? n : null, html: LS.ok ? LS.html : "", packages: LS.ok && L ? L.packages.map((p: any) => { const { row, ...rest } = p; return rest; }) : [] } : null;
    return out({ ok: true, student: { code, name: N.name, cn: N.cn, adult: !!N.adult }, own: !!(SA && (SA as any).pw_set_at), market: PHX ? "ph" : "cn", ph: PHX || undefined,
      pkg, lessons, history: H, pay: PAY, cj: CJ, upcoming: up, week, past, hw: hw.slice(0, 20), hwTotal: hw.length, notesKpi, journey, reports, at: nowIso, tz: "Asia/Shanghai (UTC+8)" });
  }
  return out({ ok: false, error: "unknown op" }, 400);
});
