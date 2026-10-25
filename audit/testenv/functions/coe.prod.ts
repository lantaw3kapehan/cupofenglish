// CupOfEnglish app · the one door to the fast layer (14 Oct 2026).
// The app keeps its own sign-in (Apps Script). Apps Script copies each sign-in here (app_sessions, SHA-256 of the token),
// so this function checks the same token the app already sends. verify_jwt is off on purpose: auth is the token check below.
// op 'ping'   → who am I (test)
// op 'write'  → a save lands in the inbox (writes) at once; Apps Script replays it into the sheet every minute
//               (time-ins and forms are replayed at the time they were tapped: writes.created_at)
// op 'mine'   → this person's saves the sheet refused in the last 3 days (the app shows "Not sent · …")
// op 'docs'   → ready-made screens (docs). Who may read which scope:
//               'all' → everyone · '<name>' → that person · 'mgmt' → management · 'pres' → the President only
//               v12: some screens are worked out from the database tables at the moment they are asked for
//               (LIVE_FNS: ACTIVE, Students list, a student's page), marked live: true.
// op 'calc'   → the same worked-out screen for a check against Google (management only)
// op 'active' / 'students' → kept for the checks of 14 Oct
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const WRITE_FNS = new Set(["saveNote", "markHomework", "tNoteTag", "tGoalsSave", "timeIn", "classIn", "timeOut",
  "tFbSubmit", "tPcSubmit", "tTrialSubmit", "tPeerSubmit", "tSetMeet", "tMsgAck", "tVisitAck", "tMsgSeen", "tHwFlag",
  "tMsgSend", "tLeaveRequest", "tPayVerify",
  "mgmtMsgSeen", "mgmtReportSent", "mgmtTrialFu", "setCaseDone", "mgmtPkgFix", "mgmtMsgSend", "mgmtMsgReply", "saveStudent", "addExpense", "addSale"]);   // from mgmtMsgSeen on: management only (mgmtPkgFix → trigger writes_pkgfix; messages → trigger writes_msgs)
const MGMT_W = /^(mgmt|set|saveStudent$|addExpense$|addSale$)/;   // 16 Oct: Add expense / Add sale (no invoice file) through the database; Google writes them within a minute
// Screens the database answers itself (each one checked against Google before it was added here).
// Switched on per screen by the docs row 'sys:live' (e.g. {"mgmtStudent": true}), read at most once a minute.
let LIVE_FNS: Record<string, boolean> = {}, LIVE_AT = 0;
async function liveFns(db: any) {
  if (Date.now() - LIVE_AT < 60000) return LIVE_FNS;
  const { data } = await db.from("docs").select("data").eq("key", "sys:live").maybeSingle();
  LIVE_FNS = (data && data.data) || {}; LIVE_AT = Date.now(); return LIVE_FNS;
}

const cors = (o: string) => ({
  "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0],
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
});
async function sha(t: string) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
}
function mayRead(s: any, scope: string) {
  const me = String(s.name || "").toLowerCase();
  if (scope === "all" || scope === me) return true;
  if (s.mode !== "mgmt") return false;
  if (scope === "mgmt") return true;
  if (scope === "pres") return /president/i.test(String(s.role || ""));
  return false;
}

// ── sheet values as the server sees them ────────────────────────────────────────────────────────────────────────────────────────────────
const MON = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DOW = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
const isD = (x: unknown) => typeof x === "string" && ISO.test(x);
const n1 = (x: any) => x === "" || x == null ? "" : Math.round(Number(x) * 10) / 10;
const dd = (x: any) => isD(x) ? String(x).slice(0, 10) : String(x ?? "");
const toUtc = (x: string) => new Date(x + "+08:00").toISOString();                  // a sheet date (Manila) as the server sends it
const jv = (x: any) => isD(x) ? toUtc(x) : (x === undefined || x === null ? "" : x);   // any cell as the server's JSON shows it
// String(date) on the server (Filipino locale), e.g. "Tue May 05 2026 00:00:00 GMT+0800 (Standard na Oras sa Pilipinas)"
const dateStr = (x: string) => { const d = new Date(x.slice(0, 10) + "T00:00:00Z");
  return DOW[d.getUTCDay()] + " " + MON[+x.slice(5, 7) - 1] + " " + x.slice(8, 10) + " " + x.slice(0, 4) + " " + x.slice(11, 19) + " GMT+0800 (Standard na Oras sa Pilipinas)"; };
const sv = (x: any) => isD(x) ? dateStr(x) : String(x ?? "");                       // String(cell)
const manila = (d = new Date()) => new Date(d.getTime() + 8 * 3600e3).toISOString().slice(0, 19);   // "yyyy-MM-ddTHH:mm:ss" now in Manila

async function loadTab(db: any, tab: string) {
  const v: any[][] = [];
  for (let from = 0; from < 50000; from += 1000) {   // the API returns at most 1000 rows at a time
    const { data, error } = await db.from("sheet_rows").select("r,data").eq("tab", tab).order("r", { ascending: true }).range(from, from + 999);
    if (error) throw new Error("db");
    for (const x of data || []) v[x.r - 1] = x.data || [];
    if (!data || data.length < 1000) break;
  }
  for (let i = 0; i < v.length; i++) if (!v[i]) v[i] = [];
  return v;
}
const TABS: Record<string, Promise<any[][]>> = {};   // one read per tab per request
const KEEP: Record<string, { t: number; p: Promise<any[][]>; v: string }> = {};   // and kept for 60 s for the next requests on this server
let VER: Promise<Record<string, string>> | null = null;   // 15 Oct night: each tab's copy time, read once per request; a kept tab that changed since is read again
const vers = (db: any) => VER || (VER = db.from("sheet_tabs").select("tab,synced_at").then((r: any) => { const o: Record<string, string> = {}; (r.data || []).forEach((x: any) => o[x.tab] = String(x.synced_at)); return o; }, () => ({})));
const tab = (db: any, t: string) => TABS[t] || (TABS[t] = vers(db).then((V) => {
  const k = KEEP[t], v = V[t] || ""; if (k && Date.now() - k.t < 60000 && k.v === v) return k.p;
  const p = loadTab(db, t); KEEP[t] = { t: Date.now(), p, v }; p.catch(() => { delete KEEP[t]; }); return p; }));
function tableOf(v: any[][], key: string) {
  let h = 0; for (let i = 0; i < Math.min(6, v.length); i++) if ((v[i] || []).some((x: any) => String(x ?? "").trim() === key)) { h = i; break; }
  return { head: (v[h] || []).map((x: any) => String(x ?? "").trim()), rows: v.slice(h + 1) };
}
const cell = (r: any[], j: number) => r[j] === undefined || r[j] === null ? "" : r[j];
const num = (x: any) => { const n = Number(x); return isFinite(n) ? n : 0; };

// ── today's classes that ended but are not in S-MONTHLY yet (the server's liveGap_) ────────────
async function smonthly(db: any) {
  const v = await tab(db, "S-MONTHLY"); if (v.length < 2) throw new Error("no S-MONTHLY");
  return v;
}
async function liveGap(db: any) {
  const S = await smonthly(db), now = new Date(), nowM = manila(now), mon = MONTHS[+nowM.slice(5, 7) - 1] + " " + nowM.slice(0, 4);
  let sync = "";
  S.slice(1).forEach((r) => {
    const m0 = cell(r, 0), m = isD(m0) ? MONTHS[+String(m0).slice(5, 7) - 1] + " " + String(m0).slice(0, 4) : String(m0).trim(); if (m !== mon) return;
    let d = ""; const c8 = cell(r, 8);
    if (isD(c8)) d = c8; else { const x = String(c8).match(/(\d{1,2})-([A-Za-z]{3})-(\d{4})\s+(\d{1,2}):(\d{2})/); const mi = x ? MON.indexOf(x[2].slice(0, 1).toUpperCase() + x[2].slice(1, 3).toLowerCase()) : -1;
      if (x && mi > -1) d = x[3] + "-" + String(mi + 1).padStart(2, "0") + "-" + x[1].padStart(2, "0") + "T" + x[4].padStart(2, "0") + ":" + x[5] + ":00"; }
    if (d && d <= nowM && (!sync || d > sync)) sync = d;
  });
  if (!sync) sync = nowM.slice(0, 10) + "T00:00:00";
  const syncT = new Date(sync + "+08:00").getTime(), out: Record<string, number> = {};
  const { data: cls, error } = await db.from("classes").select("day,data").gte("day", sync.slice(0, 10)).lte("day", nowM.slice(0, 10)).order("day").limit(2000);
  if (error) throw new Error("db");
  const days = [...new Set((cls || []).map((x: any) => x.day))].slice(0, 4);
  (cls || []).forEach((x: any) => {
    const e = x.data || {}; if (days.indexOf(x.day) < 0) return;
    if (e.cancelled || !e.code || /trial|试听/i.test(String(e.title || "")) || /(^|-)\s*TC\s*(\s+X)?\s*$/i.test(String(e.title || ""))) return;
    const en = new Date(e.end).getTime(); if (!(en > syncT) || en > now.getTime()) return;
    const u = (en - new Date(e.start).getTime()) / 6e4 <= 30 ? 0.5 : 1, c = String(e.code).toUpperCase(), t = String((e.teachers || [])[0] || "").toLowerCase();
    out[c] = (out[c] || 0) + u; out[c + "|" + t] = (out[c + "|" + t] || 0) + u;
  });
  return out;
}

// ── ACTIVE (the server's mgmtActive_ + mgmtActive) ─────────────────────────────────────────────
async function activeFromTables(db: any) {
  const v = await tab(db, "ACTIVE");
  const mrow = v[1] || [], head = (v[0] || []).map((x: any) => String(x ?? "").trim().toUpperCase()), cc = head.indexOf("COURSE");
  let last = 43; for (let j = 43; j > 10; j--) if (isD(mrow[j])) { last = j; break; }
  const mcols: number[] = []; for (let j = 10; j <= last; j++) if (isD(mrow[j])) mcols.push(j);
  const out: any[] = [];
  for (let i = 4; i < v.length; i++) {
    const r = v[i]; if (!/^ST-/.test(String(r[0] ?? ""))) continue;
    const g = (j: number) => r[j] === undefined || r[j] === null ? "" : r[j];
    out.push([i + 1, String(r[0]), String(g(1)), String(g(2) || ""), String(g(3) || ""), n1(g(9)), n1(g(45)), n1(g(46)), g(47) === true,
      dd(g(48)), dd(g(49)), String(g(50) || ""), (g(52) ? sv(g(52)) : "").slice(0, 60), mcols.map((j) => n1(g(j)) || 0), n1(g(44)), n1(g(5)), n1(g(4)),
      cc > -1 ? String(g(cc) || "").trim() : "", g(8) === "" || g(8) == null ? "" : (typeof g(8) === "number" ? n1(g(8)) : String(g(8)).trim())]);
  }
  const months = mcols.map((j) => { const s = String(mrow[j]); return MON[+s.slice(5, 7) - 1] + " " + s.slice(2, 4); });
  const { data: t } = await db.from("sheet_tabs").select("synced_at").eq("tab", "ACTIVE").maybeSingle();
  return { months, rows: out, full: 1, at: t ? t.synced_at : null,
    cols: ["row", "code", "name", "cn", "teacher", "enrolled", "finished", "available", "active", "start", "deadline", "shared", "source", "months", "sub", "carry", "transfer", "course", "incentive"] };
}
async function activeLive(db: any) {
  const [A, G] = await Promise.all([activeFromTables(db), liveGap(db)]);
  const per: Record<string, number> = {}; A.rows.forEach((r: any[]) => per[r[1]] = (per[r[1]] || 0) + 1);
  const rows = A.rows.map((r: any[]) => {
    const code = String(r[1]).toUpperCase(), ts = String(r[4] || "").split(/[,/&+]| and /).map((x) => x.trim().toLowerCase()).filter(Boolean);
    let g = ts.reduce((a, t) => a + (G[code + "|" + t] || 0), 0); if (!g && per[r[1]] === 1) g = G[code] || 0;
    if (!g) return r.concat([0]); const x = r.slice(); x[6] = x[6] === "" ? g : Math.round((Number(x[6]) + g) * 10) / 10; if (x[7] !== "") x[7] = Math.max(0, Math.round((Number(x[7]) - g) * 10) / 10); return x.concat([g]);
  });
  return { months: A.months, rows, cols: A.cols.concat(["today"]) };
}

// ── Students list (the server's mgmtStudents_ + mgmtStudents) ──────────────────────────────────
async function studentsFromTables(db: any) {
  const { data: tdoc } = await db.from("docs").select("data").eq("key", "sys:tmap").maybeSingle();
  const TM = (tdoc && tdoc.data && tdoc.data.tmap) || {}, dailyName = (tdoc && tdoc.data && tdoc.data.daily) || "";
  const [A, DB, PR, DY] = await Promise.all([tab(db, "ACTIVE"), tab(db, "DATABASE"), tab(db, "PR-DATA"), dailyName ? tab(db, dailyName) : Promise.resolve([])]);
  const books: Record<string, string> = {}, TN: Record<string, Record<string, number>> = {};
  const add = (c: string, t: any) => { t = String(t || "").trim().toLowerCase(); if (c && t) (TN[c] = TN[c] || {})[t] = 1; };
  DY.forEach((r) => { const c = String(cell(r, 0)); if (/^ST-/.test(c) && cell(r, 3)) books[c] = String(cell(r, 3)); });
  DY.forEach((r) => { const c = String(cell(r, 0)).trim(); if (/^ST-/.test(c)) String(cell(r, 2) || "").split(/[,/&+]| and /).forEach((t) => add(c, t)); });
  Object.keys(TM).forEach((c) => Object.keys(TM[c] || {}).forEach((t) => add(c, t)));
  const act = tableOf(A, "STUDENTS CODE"), out: Record<string, any> = {}, leftBy: Record<string, any> = {}, nameBy: Record<string, string> = {};
  act.rows.forEach((r) => { const c = String(cell(r, 0)); if (!/^ST-/.test(c)) return; nameBy[c] = String(cell(r, 1)); if (cell(r, 46) !== "" && leftBy[c] === undefined) leftBy[c] = cell(r, 46); });
  act.rows.forEach((r) => {
    const code = String(cell(r, 0)); if (!/^ST-/.test(code)) return;
    const pkg = String(cell(r, 51) || cell(r, 50) || "").trim(), sharedWith = pkg && pkg !== code ? pkg : "";
    let left = cell(r, 46);
    if (left === "" && sharedWith && leftBy[sharedWith] !== undefined) left = leftBy[sharedWith];
    if (left !== "" && Number(left) <= 0) return;
    if (cell(r, 47) !== true && !String(cell(r, 3) || "").split(/[,/&+]| and /).some((t) => TN[code] && TN[code][t.trim().toLowerCase()])) return;
    const o = out[code] || (out[code] = { code, name: String(cell(r, 1)), cn: String(cell(r, 2) || ""), teachers: [], left: null, book: books[code] || "" });
    String(cell(r, 3) || "").split(/[,/&]/).map((x) => x.trim()).filter(Boolean).forEach((t) => { if (o.teachers.indexOf(t) < 0) o.teachers.push(t); });
    if (left !== "") o.left = Number(left);
    if (sharedWith) { o.shared = true; o.sharedWith = sharedWith; o.sharedName = nameBy[sharedWith] || ""; }
  });
  const seenDb: Record<string, number> = {};
  DB.slice(3).filter((r) => cell(r, 0) !== "" || cell(r, 2) !== "").forEach((r) => {
    const c = String(cell(r, 0)).trim(); if (!out[c] || seenDb[c]) return; seenDb[c] = 1;
    const gr = String(cell(r, 8)).trim(); if (/^(WA|UM|U\d|PhD|ADULT)$/i.test(gr) || (+cell(r, 6) >= 20 && !/^(G\d+|GK)$/i.test(gr))) out[c].adult = true;
    const cb = String(cell(r, 19)), lvl = cb.indexOf(",") > 0 ? cb.split(",")[0].trim() : (cell(r, 13) || "");
    if (lvl) { out[c].cefr = lvl; out[c].cefrFrom = cb ? "enrolment" : "trial"; }
  });
  tableOf(PR, "Student code").rows.forEach((r) => {
    const o = out[cell(r, 4)]; const d0 = cell(r, 2); if (!o || !isD(d0)) return;
    const d = String(d0).slice(0, 10); if (o.lastCheck && o.lastCheck > d) return;
    o.lastCheck = d; o.cefr = cell(r, 22) || cell(r, 20) || o.cefr; o.cefrFrom = "check"; o.total = num(cell(r, 19)); o.trialTotal = num(cell(r, 32)); o.trialCefr = cell(r, 33);
  });
  return Object.keys(out).map((k) => out[k]).sort((a, b) => a.name.localeCompare(b.name));
}
// 15 Oct night · lessons a week from each student's own history (S-MONTHLY), worked out exactly as on the parent picture
// (last 6 full months, counted from the first class; half-lesson steps) → { v, cw: classes a week, mins: usual length, n: months }
async function weeklyAll(db: any) {
  const [SM, DB] = await Promise.all([smonthly(db), tab(db, "DATABASE")]);
  const first: Record<string, string> = {};
  DB.slice(3).forEach((r) => { const c = String(cell(r, 0)).trim(); if (!/^ST-/.test(c) || c in first) return; const f = cell(r, 16), t = cell(r, 10); first[c] = isD(f) ? String(f).slice(0, 10) : isD(t) ? String(t).slice(0, 10) : ""; });
  const by: Record<string, any> = {};
  SM.slice(1).forEach((r) => {
    const code = String(cell(r, 1) || "").trim().toUpperCase(); if (!/^ST-/.test(code)) return;
    const m0 = cell(r, 0); let m = "";
    if (isD(m0)) m = String(m0).slice(0, 7); else { const d = new Date("1 " + String(m0)); if (isNaN(d.getTime())) return; m = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0"); }
    const v = num(cell(r, 6)) || num(cell(r, 5)), n = num(cell(r, 5)); if (!(v > 0)) return;
    const o = by[code] || (by[code] = { L: {}, Lu: {}, N: {}, Nu: {} }), um = /unmatched/i.test(String(cell(r, 3) || "")), B = um ? o.Lu : o.L, C = um ? o.Nu : o.N;
    B[m] = (B[m] || 0) + v; C[m] = (C[m] || 0) + n;
  });
  const nowM = manila(), cur = nowM.slice(0, 7), today = +nowM.slice(8, 10), out: Record<string, any> = {};
  Object.keys(by).forEach((code) => {
    const { L, Lu, N, Nu } = by[code]; Object.keys(Lu).forEach((k) => { if (!L[k]) { L[k] = Lu[k]; N[k] = Nu[k]; } });
    const all = Object.keys(L).sort(), past = all.filter((k) => k < cur), ks = (past.length >= 2 ? past : all).slice(-6); if (!ks.length) return;
    const f0 = first[code] || "", fm = f0.slice(0, 7), fd = +f0.slice(8, 10) || 1;
    const wks = ks.reduce((a, k) => { const p = k.split("-").map(Number), e = k === cur ? today : new Date(Date.UTC(p[0], p[1], 0)).getUTCDate(), st = k === fm ? Math.min(fd, e) : 1; return a + Math.max(7, e - st + 1) / 7; }, 0);
    const tot = ks.reduce((a, k) => a + L[k], 0), raw = tot / wks, v = raw > 0 ? Math.max(0.5, Math.round(raw * 2) / 2) : 0, cn = ks.reduce((a, k) => a + (N[k] || 0), 0);
    const cw = cn ? Math.max(1, Math.round(cn / wks)) : 0, mins = cn ? Math.round(tot / cn * 50 / 5) * 5 : 0;
    if (v > 0) out[code] = { v, cw, mins, n: ks.length };
  });
  return out;
}
async function studentsLive(db: any) {
  const [L, G, W] = await Promise.all([studentsFromTables(db), liveGap(db), weeklyAll(db).catch(() => ({} as Record<string, any>))]);
  return L.map((s: any) => { const g = G[s.code], w = W[s.code]; const x = w ? Object.assign({}, s, { wk: w }) : s; if (!g || s.left == null || s.shared) return x; return Object.assign({}, x, { left: Math.max(0, Math.round((s.left - g) * 10) / 10), today: g }); });
}

// ── a student's page (the server's mgmtStudent_): progress checks, class notes, trial report and monthly lessons from the
//    tables; profile (DATABASE as shown), monthly feedback and progress-check names from the copies Google sends every 30 min
//    (sys:db, sys:fb, sys:prl). Without those copies the last page Google made is used for these parts.
const SYS: Record<string, Promise<any>> = {};
async function studentLive(db: any, code: string, base: any) {
  const [PR, NO, TR, SM, parts] = await Promise.all([tab(db, "PR-DATA"), tab(db, "S-NOTES"), tab(db, "TR-DATA"), smonthly(db),
    db.rpc("student_parts", { p_code: code }).then((r: any) => r.data || {})]);   // only this student's part of the big copies
  const sdb = parts.db || null, sfb = parts.fb || null, sprl = parts.prl || null;
  if (!base && !sdb) return null;
  let profile = base ? base.profile : null;
  if (sdb && sdb.data) { const d = sdb.data, rows = (d.rows || []).filter((r: any[]) => r[0] === code); profile = rows.length ? { head: d.head, row: rows[0].slice(0, -1), packages: rows.length } : null; }
  const feedback = sfb && sfb.data ? (Array.isArray(sfb.data) ? sfb.data : []) : (base ? base.feedback || [] : []);
  const checks: any[] = [];
  tableOf(PR, "Student code").rows.forEach((r) => {
    if (cell(r, 4) !== code || !isD(cell(r, 2))) return;
    checks.push({ date: String(cell(r, 2)).slice(0, 10), teacher: jv(cell(r, 3)), cefr: jv(cell(r, 22) || cell(r, 20)), total: num(cell(r, 19)), speaking: num(cell(r, 16)), listening: num(cell(r, 17)),
      reading: num(cell(r, 18)), book: jv(cell(r, 23)), progress: sv(cell(r, 24) || ""), next: sv(cell(r, 25) || ""), lessons: jv(cell(r, 35)), trialTotal: num(cell(r, 32)), trialCefr: jv(cell(r, 33)), pdf: jv(cell(r, 39)), r: [7, 8, 9, 10, 11, 12, 13, 14, 15].map((j) => num(cell(r, j))) });
  });
  checks.sort((a, b) => b.date.localeCompare(a.date));
  if (sprl && Array.isArray(sprl.data)) {
    const L: string[] = sprl.data, nm = profile ? String(profile.row[2] || "").toLowerCase() : "";
    checks.forEach((c) => { const m = L.filter((x) => x.indexOf(c.date + " · ") === 0 && x.slice(-(" · " + c.teacher).length) === " · " + c.teacher);
      c.pr = m.length > 1 ? (m.find((x) => x.toLowerCase().indexOf(nm) >= 0) || m[0]) : (m[0] || ""); });
  } else if (base) { const prOf: Record<string, string> = {}; (base.checks || []).forEach((c: any) => { if (c && c.pr) prOf[c.date + "|" + c.teacher] = c.pr; }); checks.forEach((c) => { c.pr = prOf[c.date + "|" + c.teacher] || ""; }); }
  const rows = NO.slice(1, 6001).map((r, i) => ({ r, i })).sort((a, b) => {
    const ta = isD(a.r[0]) ? Date.parse(a.r[0] + "+08:00") : 0, tb = isD(b.r[0]) ? Date.parse(b.r[0] + "+08:00") : 0; return (tb - ta) || (a.i - b.i); });
  const notes: any[] = [];
  rows.forEach(({ r }) => { if (cell(r, 3) === code) notes.push({ date: isD(cell(r, 1)) ? String(cell(r, 1)).slice(0, 10) : sv(cell(r, 1)), teacher: jv(cell(r, 2)), ended: jv(cell(r, 5)), next: jv(cell(r, 6)), homework: jv(cell(r, 7)), obs: sv(cell(r, 9) || ""), skills: sv(cell(r, 10) || "") }); });
  let trial: any = null;
  tableOf(TR, "Trial date").rows.forEach((r) => {
    if (cell(r, 33) === code && isD(cell(r, 2)))
      trial = { date: String(cell(r, 2)).slice(0, 10), teacher: jv(cell(r, 4)), cefr: jv(cell(r, 23)), total: num(cell(r, 18)), comments: sv(cell(r, 25) || ""), next: sv(cell(r, 26) || "") };
  });
  const monthly: any[] = [];
  SM.slice(1).forEach((r) => {
    const id = String(cell(r, 1) || "").trim().toUpperCase(); if (id !== code) return;
    const m0 = cell(r, 0); let m = "";
    if (isD(m0)) m = String(m0).slice(0, 7); else { const d = new Date("1 " + String(m0)); if (isNaN(d.getTime())) return; m = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0"); }
    monthly.push({ m, t: String(cell(r, 3) || ""), c: String(cell(r, 4) || ""), n: num(cell(r, 5)), u: num(cell(r, 6)) });
  });
  const full = !!(sdb && sfb && sprl);
  return { data: { code, checks, notes: notes.slice(0, 60), trial, feedback, profile, monthly }, full,
    at: full ? [sdb.updated_at, sfb.updated_at, sprl.updated_at].map((x: string) => new Date(Math.max(Date.parse(x), Date.now() - 30 * 6e4)).toISOString()) : [] };   // Google re-sends these only when they change (checked every 30 min)
}

// ── a student's classes (the server's stuClasses_): the class table covers 7 days back to 6 weeks ahead; outside that
//    the last list Google made is kept.
function parseTeacher(t: string) {
  const m = String(t).replace(/[‐-―−]/g, "-").match(/^\s*(ST-\d{4}-\d{3})\s*-\s*(.+?)\s*$/i); if (!m) return { teacher: "", book: "" };
  let rest = m[2]; if (/\s+X$/i.test(rest)) rest = rest.replace(/\s+X$/i, "");
  const parts = rest.split("-").map((s) => s.trim()).filter(Boolean);
  while (parts.length >= 3 && /^(TC|TRIAL|试听|SC|SUB)$/i.test(parts[parts.length - 1])) parts.pop();
  if (parts.length < 2) return { teacher: "", book: "" };
  return { teacher: parts[parts.length - 1], book: parts.slice(1, -1).join("-") };
}
async function stuClassesLive(db: any, code: string, base: any) {
  const now = manila(), d0 = new Date(Date.parse(now.slice(0, 10) + "T00:00:00Z") - 7 * 864e5).toISOString().slice(0, 10), d1 = new Date(Date.parse(now.slice(0, 10) + "T00:00:00Z") + 42 * 864e5).toISOString().slice(0, 10);
  const { data: cls, error } = await db.from("classes").select("day,data").eq("code", code).gte("day", d0).lte("day", d1).limit(500);
  if (error) throw new Error("db");
  const { data: cov } = await db.from("classes").select("day").gte("day", d0).lte("day", d1).order("day", { ascending: true }).limit(1);
  if (!cov || !cov.length) return null;   // no class table yet
  const lo = Date.parse(d0 + "T00:00:00+08:00"), hi = Date.parse(d1 + "T00:00:00+08:00") + 864e5;
  const old: Record<string, any> = {}; (Array.isArray(base) ? base : []).forEach((x: any) => { old[x.id + "|" + x.start] = x; });
  const keep = (Array.isArray(base) ? base : []).filter((x: any) => { const t = Date.parse(x.start); return t < lo || t >= hi; });
  const mine = (cls || []).map((r: any) => { const e = r.data || {}, p = parseTeacher(e.title || ""), o = old[e.id + "|" + e.start];
    return { id: e.id, start: e.start, end: e.end, title: e.title, teacher: p.teacher, book: p.book, cancelled: !!e.cancelled, makeup: o ? !!o.makeup : false, why: e.why || "", mv: e.mv || null }; });
  return keep.concat(mine).sort((a: any, b: any) => String(a.start).localeCompare(String(b.start)));
}

// ── a day's schedule (the server's mgmtSchedule): the classes from the class table; check-ins and class videos (today and
//    earlier) are taken from the last schedule Google made for that day.
const isSub = (t: string) => /\bsub\b/i.test(t) || /(^|-)\s*SC\s*(\s+X)?\s*$/i.test(t);
const isTrial = (t: string) => /trial|试听/i.test(t) || /(^|-)\s*TC\s*(\s+X)?\s*$/i.test(t);
async function scheduleLive(db: any, ymd: string, base: any) {
  const today = manila().slice(0, 10), ds = /^\d{4}-\d{2}-\d{2}$/.test(ymd) ? ymd : today;
  const lo = new Date(Date.parse(today + "T00:00:00Z") - 7 * 864e5).toISOString().slice(0, 10), hi = new Date(Date.parse(today + "T00:00:00Z") + 42 * 864e5).toISOString().slice(0, 10);
  if (ds < lo || ds > hi) return null;   // outside the class table
  const [{ data: cls, error }, M] = await Promise.all([db.from("classes").select("data").eq("day", ds).limit(500), tab(db, "MASTERLIST")]);
  if (error) throw new Error("db");
  if (!(cls || []).length && !(base && base.events && base.events.length === 0)) return null;   // an empty day is only believed when Google also had none
  const names: Record<string, string> = {}; M.slice(1).forEach((r) => { const n = String(cell(r, 4) || "").trim(); if (n) names[n.toLowerCase()] = n; });
  const old: Record<string, any> = {}; ((base && base.events) || []).forEach((x: any) => { old[x.id + "|" + x.start] = x; String(x.teacher || "").split(", ").forEach((t: string) => { if (t && t !== "—") names[t.toLowerCase()] = names[t.toLowerCase()] || t; }); });
  const ev = (cls || []).map((r: any) => r.data || {});
  const first: Record<string, string> = {}; ev.filter((e: any) => !e.cancelled).slice().sort((a: any, b: any) => String(a.start).localeCompare(String(b.start))).forEach((e: any) => { const t = (e.teachers || [])[0]; if (t && !first[t]) first[t] = e.id; });
  const events = ev.map((e: any) => { const o = old[e.id + "|" + e.start] || null, t0 = (e.teachers || [])[0];
    return { ci: ds <= today && o ? o.ci : null, first: first[t0] === e.id, vid: o ? o.vid : null,
      id: e.id, start: e.start, end: e.end, student: e.student, code: e.code, book: e.book, meet: e.meet, title: e.title, cancelled: e.cancelled, why: e.why || "", mv: e.mv || null,
      teacher: (e.teachers || []).filter((t: string, i: number, a: string[]) => a.indexOf(t) === i).map((t: string) => names[String(t).toLowerCase()] || String(t).replace(/\b\w/g, (c) => c.toUpperCase())).join(", ") || "—",
      type: isTrial(e.title) ? "Trial" : isSub(e.title) ? "Sub" : "" }; }).sort((a: any, b: any) => String(a.start).localeCompare(String(b.start)));
  const { data: lastc } = await db.from("classes").select("updated_at").eq("day", ds).order("updated_at", { ascending: false }).limit(1);
  return { data: { date: ds, events }, full: ds > today, at: lastc && lastc[0] ? Date.parse(lastc[0].updated_at) : 0 };
}

// ── a teacher's classes over some days (the server's teacherWeek_, used by tSchedule and mgmtTeacherWeek) ──────────
//    From the class table (1st of this month or today −7 … end of next month or +42). Days outside it come from Google's last copy (base).
async function teacherWeekLive(db: any, name: string, fromYmd: string, days: number, base: any) {
  name = String(name || "").trim(); if (!name) return null; const lc = name.toLowerCase();
  const today = manila().slice(0, 10), add = (d: string, k: number) => new Date(Date.parse(d + "T00:00:00Z") + k * 864e5).toISOString().slice(0, 10);
  days = Math.max(1, Math.min(42, Number(days) || 8));
  const from = /^\d{4}-\d{2}-\d{2}$/.test(fromYmd || "") ? fromYmd : add(today, -1), to = add(from, days - 1);
  const y = +today.slice(0, 4), mo = +today.slice(5, 7), eonm = new Date(Date.UTC(y, mo + 1, 0)).toISOString().slice(0, 10);   // end of next month
  const lo0 = add(today, -7), hi0 = add(today, 42), lo = today.slice(0, 8) + "01" < lo0 ? today.slice(0, 8) + "01" : lo0, hi = eonm > hi0 ? eonm : hi0, qa = from > lo ? from : lo, qb = to < hi ? to : hi;
  let rows: any[] = [];
  if (qa <= qb) { const { data, error } = await db.from("classes").select("day,data").contains("teachers", JSON.stringify([lc])).gte("day", qa).lte("day", qb).limit(2000); if (error) throw new Error("db"); rows = data || []; }
  const outside = (from < lo) || (to > hi), bev = (base && Array.isArray(base.events)) ? base.events : null;
  if (outside && !bev) return { data: null, full: false };
  const keep = outside ? bev.filter((x: any) => x.day < lo || x.day > hi) : [];
  const ev = rows.map((r: any) => { const e = r.data || {};
    return { id: e.id, title: e.title, code: e.code, student: e.student, book: e.book, meet: e.meet, start: e.start, end: e.end, day: r.day, teacher: name, cancelled: !!e.cancelled, why: e.why || "", mv: e.mv || null,
      type: isTrial(e.title || "") ? "Trial" : isSub(e.title || "") ? "Sub" : "" }; });
  const events = keep.concat(ev).sort((a: any, b: any) => String(a.day).localeCompare(String(b.day)) || String(a.start).localeCompare(String(b.start)));
  return { data: { days, from, name, today, events }, full: !outside || !!bev };
}

// ── a teacher's home screen (the server's buildTeacher_ + getBootstrap for teachers) ─────────────────────────────
//    Everything from the tables; class videos, video folders, record fixes and peer visits come from Google's last copy
//    (base), so the page is marked complete only when that copy exists.
const nameIn = (cell0: any, lc: string) => String(cell0 || "").toLowerCase().split(/[,/&+]| and /).some((x) => x.trim() === lc);
const hasWord = (t: string, w: string[]) => { const T = String(t).toUpperCase(); return w.some((x) => new RegExp("(^|[^A-Z])" + x.toUpperCase() + "([^A-Z]|$)").test(T)); };
const hm = (x: any) => isD(x) ? String(x).slice(11, 16) : String(x ?? "");
const ymdOf = (x: any) => isD(x) ? String(x).slice(0, 10) : "";
function fbMonthKey(nowM: string) { const y = +nowM.slice(0, 4), m = +nowM.slice(5, 7), d = +nowM.slice(8, 10);
  const dt = new Date(Date.UTC(y, m - 1 + (d >= 15 ? 1 : 0), 1)); return dt.toISOString().slice(0, 7); }
function sameCourse(m: any, lc: string) {
  const me = m && m[lc]; if (!me || !me.next) return m; const mine = Object.keys(me.books || {}); if (!mine.length) return m;
  const out: any = {}; Object.keys(m).forEach((k) => { const b = Object.keys(m[k].books || {}); if (k === lc || !m[k].next || !b.length || b.some((x) => mine.indexOf(x) > -1)) out[k] = m[k]; }); return out; }
function owner(m: any, lc: string) {
  const ks = Object.keys(m || {}); if (!ks.length) return { mine: true } as any;
  const main = ks.slice().sort((a, b) => (m[b].past - m[a].past) || String(m[b].last).localeCompare(String(m[a].last)) || String(m[a].next || "9").localeCompare(String(m[b].next || "9")))[0];
  const me = m[lc], gone = main !== lc && !(me && me.next); return { mine: main === lc, gone, by: m[main].name, lastMine: me ? me.last : "" }; }
function fbTurn(m: any, lc: string, o: any, inActive: any, H: any[] | null, mo: string) {
  const dflt = o.mine ? "" : o.by; const act = Object.keys(m || {}).filter((k) => (m[k].next || m[k].past > 0) && inActive[k]);
  if (act.length < 2 || act.indexOf(lc) < 0 || !H) return dflt;
  const first = (s: any) => String(s || "").trim().split(/\s+/)[0].toLowerCase();
  const cur = H.find((x: any) => String(x.month) === mo && x.teacher); if (cur) { const t = first(cur.teacher); return act.indexOf(t) > -1 ? m[t].name : dflt; }
  const last = H.find((x: any) => String(x.month) < mo && x.teacher); if (!last) return dflt;
  const lt = first(last.teacher), others = act.filter((k) => k !== lt); if (act.indexOf(lt) < 0 || !others.length) return dflt;
  others.sort((a, b) => m[b].past - m[a].past); return m[others[0]].name; }
function mergePay(pay: any[]) { const by: any = {}, out: any[] = [];
  pay.forEach((p) => { const q = by[p.m]; if (!q) { by[p.m] = Object.assign({}, p, { parts: [{ units: p.units, rate: p.rate }], allPaid: !!p.paidOn }); out.push(by[p.m]); return; }
    ["units", "lessonPay", "bonus", "deduct", "gov", "base", "net"].forEach((k) => q[k] = Math.round((q[k] + p[k]) * 100) / 100);
    q.parts.push({ units: p.units, rate: p.rate }); q.allPaid = q.allPaid && !!p.paidOn; if (p.paidOn && (!q.paidOn || p.paidOn > q.paidOn)) q.paidOn = p.paidOn; });
  out.forEach((q) => { if (!q.allPaid) { q.paidOn = null; q.status = "Pending"; } else q.status = "Paid"; if (q.parts.length < 2) delete q.parts; delete q.allPaid; }); return out; }
function logRec(r: any[]) {
  const dec = /^(Waived|Excused|Unexcused)\b/.test(String(cell(r, 8)).trim()) ? String(cell(r, 8)) : "";
  return { time: hm(cell(r, 3)), status: cell(r, 6), mins: cell(r, 5), proof: cell(r, 7), flag: [dec ? "" : String(cell(r, 8) || ""), String(cell(r, 17) || "")].filter(Boolean).join(" · "),
    out: isD(cell(r, 18)) ? hm(cell(r, 18)) : "", hours: r[19] === undefined ? "" : cell(r, 19), outNote: String(cell(r, 20) || ""), decision: dec, device: cell(r, 9), ip: cell(r, 10), net: cell(r, 11), speed: cell(r, 12),
    place: cell(r, 15) || "", map: cell(r, 16) || "", start: isD(cell(r, 4)) ? hm(cell(r, 4)) : "", code: String(cell(r, 14) || "").split(" ")[0].toUpperCase() };
}
async function teacherHomeLive(db: any, who: any, base: any) {
  const name = String(who.name || "").trim(), lc = name.toLowerCase(); if (!lc) return null;
  const nowM = manila(), today = nowM.slice(0, 10), monthStart = today.slice(0, 8) + "01", addD = (d: string, k: number) => new Date(Date.parse(d + "T00:00:00Z") + k * 864e5).toISOString().slice(0, 10);
  const { data: tdoc } = await db.from("docs").select("data").eq("key", "sys:tmap").maybeSingle();
  const TM = (tdoc && tdoc.data && tdoc.data.tmap) || {}, dailyName = (tdoc && tdoc.data && tdoc.data.daily) || "";
  const [A, NO, PR, TC, TR, TD, PY, AC, TI, HW, DY, G, U, CL, FB] = await Promise.all([tab(db, "ACTIVE"), tab(db, "S-NOTES"), tab(db, "PR-DATA"), tab(db, "TC&SUB"), tab(db, "TR-DATA"), tab(db, "T-DASH"), tab(db, "PAYROLL"), tab(db, "ACTIONS"),
    tab(db, "T-TIMEIN"), tab(db, "S-HOMEWORK"), dailyName ? tab(db, dailyName) : Promise.resolve([]), liveGap(db),
    db.from("auth_users").select("email,name,role,code").ilike("name", name).limit(1).then((r: any) => (r.data || [])[0] || null),
    db.from("classes").select("day,data").contains("teachers", JSON.stringify([lc])).gte("day", today).lte("day", addD(today, 6)).limit(1000).then((r: any) => { if (r.error) throw new Error("db"); return r.data || []; }),
    db.from("docs").select("data").eq("key", "sys:fb").maybeSingle().then((r: any) => (r.data && r.data.data) || {})]);
  const act = tableOf(A, "STUDENTS CODE"), H = act.head, ix = (k: string, d: number) => { const i = H.indexOf(k); return i > -1 ? i : d; };
  const iCode = ix("STUDENTS CODE", 0), iName = ix("NAME", 1), iCn = ix("CHINESE NAME", 2), iT = ix("TEACHER", 3), iLeft = ix("TOTAL AVAILABLE", 46), iDone = ix("TOTAL FINISHED LESSONS", 45);
  const TN: Record<string, Record<string, number>> = {}, addTN = (c: string, t: any) => { t = String(t || "").trim().toLowerCase(); if (c && t) (TN[c] = TN[c] || {})[t] = 1; };
  const books: Record<string, string> = {};
  DY.forEach((r) => { const c = String(cell(r, 0)).trim(); if (/^ST-/.test(c)) { String(cell(r, 2) || "").split(/[,/&+]| and /).forEach((t) => addTN(c, t)); if (cell(r, 3)) books[c] = String(cell(r, 3)); } });
  Object.keys(TM).forEach((c) => Object.keys(TM[c] || {}).forEach((t) => addTN(c, t)));
  const leftByCode: Record<string, any> = {}; act.rows.forEach((r) => { if (/^ST-/.test(String(cell(r, iCode))) && cell(r, iLeft) !== "") leftByCode[String(cell(r, iCode))] = cell(r, iLeft); });
  const students: any[] = [], seen: Record<string, number> = {};
  act.rows.forEach((r) => {
    const code = String(cell(r, iCode)), cal = TM[code] && TM[code][lc]; if (!/^ST-/.test(code) || !(nameIn(cell(r, iT), lc) || (cal && cal.next))) return;
    const shared = cell(r, 50) || ""; let left = cell(r, iLeft); if (left === "" && shared) left = leftByCode[shared] !== undefined ? leftByCode[shared] : "";
    if (left !== "" && Number(left) <= 0) return; if (cell(r, 47) !== true && !(TN[code] && TN[code][lc])) return;
    if (seen[code]) return; seen[code] = 1;
    const gp = shared ? 0 : (G[code.toUpperCase() + "|" + lc] || 0);
    students.push({ code, name: String(cell(r, iName)), cn: String(cell(r, iCn) || ""), left: left === "" ? null : Math.max(0, Math.round((Number(left) - gp) * 10) / 10), shared: !!shared,
      done: Math.round(((Number(cell(r, iDone)) || 0) + gp) * 10) / 10, start: ymdOf(cell(r, 48)) || null, deadline: ymdOf(cell(r, 49)) || null, today: gp });
  });
  students.forEach((s) => { if (books[s.code]) s.book = books[s.code]; });
  const nrows = NO.slice(1).filter((r) => r.length).map((r, i) => ({ r, i })).sort((a, b) => { const ta = isD(a.r[0]) ? a.r[0] : "", tb = isD(b.r[0]) ? b.r[0] : ""; return ta < tb ? -1 : ta > tb ? 1 : (a.i - b.i); });
  const lastNote: Record<string, any> = {};
  for (let k = nrows.length - 1; k >= 0; k--) { const r = nrows[k].r, c = cell(r, 3); if (!c || lastNote[c]) continue;
    lastNote[c] = { by: cell(r, 2), date: ymdOf(cell(r, 1)) || sv(cell(r, 1)), ended: cell(r, 5), next: cell(r, 6), homework: cell(r, 7), eventId: String(cell(r, 8) || ""), obs: String(cell(r, 9) || ""), skills: String(cell(r, 10) || ""), at: isD(cell(r, 0)) ? hm(cell(r, 0)) : "" }; }
  students.forEach((s) => { s.note = lastNote[s.code] || null; });
  const lastCheck: Record<string, string> = {}; tableOf(PR, "Student code").rows.forEach((r) => { const c = cell(r, 4), dt = ymdOf(cell(r, 2)); if (c && dt && (!lastCheck[c] || dt > lastCheck[c])) lastCheck[c] = dt; });
  students.forEach((s) => { const l = lastCheck[s.code]; s.lastCheck = l || null; const since = l ? Date.parse(l + "T00:00:00+08:00") : s.start ? Date.parse(s.start + "T00:00:00Z") : 0; s.feedbackDue = !!since && (Date.parse(today + "T00:00:00+08:00") - since) / 864e5 >= 30; });   // as the server: a start date counts from 08:00
  students.sort((a, b) => a.name.localeCompare(b.name));
  const moved: any[] = [], actT: Record<string, Record<string, number>> = {}, mo = fbMonthKey(nowM);
  act.rows.forEach((r) => { const c = String(cell(r, iCode)); if (!/^ST-/.test(c)) return; String(cell(r, iT) || "").toLowerCase().split(/[,/&+]| and /).forEach((x) => { x = x.trim(); if (x) (actT[c] = actT[c] || {})[x] = 1; }); });
  if (Object.keys(TM).length) for (let i = students.length - 1; i >= 0; i--) { const s = students[i], mm = sameCourse(TM[s.code], lc), o = owner(mm, lc);
    if (o.gone) { s.nowWith = o.by; s.lastMine = o.lastMine; moved.unshift(s); students.splice(i, 1); }
    else { const fh = Array.isArray(FB[s.code]) ? FB[s.code].slice().sort((a: any, b: any) => String(b.month).localeCompare(String(a.month))) : null; const g = fbTurn(mm, lc, o, actT[s.code] || {}, fh, mo); if (g && g.toLowerCase() !== lc) s.fbBy = g; } }
  const tc = tableOf(TC, "ST CODE"), trows = tableOf(TR, "Trial date").rows, reported: Record<string, number> = {};
  trows.forEach((r) => { const d = ymdOf(cell(r, 2)); if (d) reported[d + "|" + String(cell(r, 5)).trim().toLowerCase()] = 1; });
  ((base && base.special) || []).forEach((x: any) => { if (x && x.type === "Trial" && !x.reportMissing) reported[x.date + "|" + String(x.student).trim().toLowerCase()] = 1; });
  const special: any[] = [], typeByEvent: Record<string, any> = {};
  tc.rows.forEach((r) => { if (cell(r, 12)) typeByEvent[String(cell(r, 12))] = cell(r, 2); const d = ymdOf(cell(r, 0)); if (!d || !nameIn(cell(r, 5), lc) || d < monthStart) return;
    special.push({ date: d, time: hm(cell(r, 0)), type: cell(r, 2), code: cell(r, 3), student: cell(r, 4), book: cell(r, 6), cefr: cell(r, 7), units: cell(r, 8), status: cell(r, 9),
      reportMissing: cell(r, 2) === "Trial" && !/cancel/i.test(String(cell(r, 9))) && !reported[d + "|" + String(cell(r, 4)).trim().toLowerCase()] }); });
  special.sort((a, b) => b.date.localeCompare(a.date));
  const nameByCode: Record<string, string> = {}, teacherByCode: Record<string, string> = {}; students.forEach((s) => nameByCode[s.code] = s.name);
  act.rows.forEach((r) => { const c = String(cell(r, iCode)); if (!/^ST-/.test(c)) return; if (!nameByCode[c]) nameByCode[c] = String(cell(r, iName)); teacherByCode[c] = (teacherByCode[c] ? teacherByCode[c] + "," : "") + String(cell(r, iT) || ""); });
  const schedule = CL.map((x: any) => { const e = x.data || {}, code = e.code || ((String(e.title || "").match(/ST-\d{4}-\d{3}/) || [""])[0]);
    let type = typeByEvent[e.id] || (hasWord(e.title || "", ["TRIAL", "试听"]) || isTrial(e.title || "") ? "Trial" : hasWord(e.title || "", ["SUB", "SC"]) ? "Sub" : "");
    if (!type) type = (teacherByCode[code] && !nameIn(teacherByCode[code], lc)) ? "Sub" : (!teacherByCode[code] && code) ? "Trial" : "Regular";
    return { id: e.id, day: x.day, start: e.start, end: e.end, title: e.title, code, student: e.student || nameByCode[code] || "", book: e.book, meet: e.meet, type, cancelled: e.cancelled, why: e.why || "", mv: e.mv || null }; })
    .sort((a: any, b: any) => String(a.start).localeCompare(String(b.start)));
  const me: any = { name }; tableOf(TD, "TOTAL LIFETIME UNITS").rows.forEach((r) => { if (String(cell(r, 1)).trim().toLowerCase() === lc) Object.assign(me, {
    code: cell(r, 0), lifetime: num(cell(r, 2)), activeStudents: num(cell(r, 4)), rank: cell(r, 6), rate: num(cell(r, 7)), rankDate: ymdOf(cell(r, 8)) || null, nowReg: num(cell(r, 18)), nowTrial: num(cell(r, 19)), nowSub: num(cell(r, 20)), nowPay: num(cell(r, 22)) }); });
  let pay: any[] = []; tableOf(PY, "TEACHER NAME").rows.forEach((r) => { const m0 = ymdOf(cell(r, 2)); if (String(cell(r, 1)).trim().toLowerCase() !== lc || !m0 || m0 > today) return;
    pay.push({ month: MON[+m0.slice(5, 7) - 1] + " " + m0.slice(0, 4), m: m0.slice(0, 7), units: num(cell(r, 4)) + num(cell(r, 5)) + num(cell(r, 6)), rate: num(cell(r, 7)), lessonPay: num(cell(r, 8)), bonus: num(cell(r, 9)), deduct: num(cell(r, 10)),
      gov: num(cell(r, 11)) + num(cell(r, 12)) + num(cell(r, 13)) + num(cell(r, 14)), base: num(cell(r, 3)), net: num(cell(r, 16)), status: cell(r, 17), paidOn: ymdOf(cell(r, 0)) || null }); });
  pay.sort((a, b) => b.m.localeCompare(a.m)); pay = mergePay(pay);
  const adj: any[] = [], since90 = addD(today, -90); let monthBonus = 0, monthDeduct = 0;
  tableOf(AC, "Case ID").rows.forEach((r) => { const dt = ymdOf(cell(r, 3)); if (!dt || dt < since90 || String(cell(r, 7)).trim().toLowerCase() !== lc) return;
    const plus = num(cell(r, 15)), minus = num(cell(r, 16)); if (dt >= monthStart) { monthBonus += plus; monthDeduct += minus; }
    const by = (String(cell(r, 17) || "").match(/via app by (.+)$/) || [])[1] || "";
    adj.push({ date: dt, type: cell(r, 6), subject: cell(r, 1), student: String(cell(r, 8)).replace(/\n/g, " · "), plus, minus, points: num(cell(r, 14)), cond: String(cell(r, 9) || ""), by, detail: String(cell(r, 17) || "").replace(/ · (PEN|INC)-\d+.*$/, ""), id: cell(r, 0) }); });
  adj.sort((a, b) => b.date.localeCompare(a.date)); me.monthBonus = monthBonus; me.monthDeduct = monthDeduct;
  Object.assign(me, { name: (U && U.name) || name, code: (U && U.code) || me.code || "", role: (U && U.role) || "", email: (U && U.email) || "" });
  let timeIn: any = null; const classIns: Record<string, any> = {};
  TI.slice(1, 401).forEach((r) => { if (ymdOf(cell(r, 0)) !== today || String(cell(r, 1)).trim().toLowerCase() !== lc) return; const rec = logRec(r);
    if (cell(r, 13) === "Class") { const id = String(cell(r, 14)).split(" · ").pop() as string; if (!classIns[id]) classIns[id] = rec; } else if (!timeIn) timeIn = rec; });
  const hw: Record<string, any> = {};
  HW.slice(1, 401).filter((r) => isD(cell(r, 0)) && String(cell(r, 0)).slice(0, 10) === today && String(cell(r, 2)).trim().toLowerCase() === lc)
    .sort((a, b) => String(a[0]).localeCompare(String(b[0]))).forEach((r) => { hw[String(cell(r, 6))] = { time: hm(cell(r, 0)), text: String(cell(r, 5) || "") }; });
  const { data: txd } = await db.from("docs").select("data,updated_at").eq("key", lc + ":tx").maybeSingle();
  const tx = txd && Date.now() - Date.parse(txd.updated_at) < 40 * 6e4 ? txd.data : null; if (tx) base = tx;
  const data: any = { me, students, moved, peer: (base && base.peer) || [], special: special.slice(0, 40), schedule, pay: pay.slice(0, 12), adj: adj.slice(0, 30), built: new Date().toISOString(), today,
    timeIn, classIns, hw, vids: (base && base.vids) || {}, vfold: (base && base.vfold) || {}, forms: (base && base.forms) || { progress: "", trial: "" }, fix: (base && base.fix) || [] };
  return { data, full: !!tx, at: tx ? Date.parse(txd.updated_at) : 0 };
}

// ── a teacher's monthly-feedback list (the server's tFbStatus): who still needs this month's feedback. The parts only Google
//    has (feedback already written, reports returned, which students have a form, who owes feedback) come in 'sys:fbs'
//    every 30 min; the teacher's students (and whose turn it is) come from teacherHomeLive.
async function fbStatusLive(db: any, name: string) {
  const { data: d } = await db.from("docs").select("data,updated_at").eq("key", "sys:fbs").maybeSingle();
  if (!d || !d.data || Date.now() - Date.parse(d.updated_at) > 75 * 6e4) return null;
  const F = d.data, lc = String(name || "").trim().toLowerCase(), mo = F.mo || {}; if (!lc || !mo.key) return null;
  const home = await teacherHomeLive(db, { name }, null); if (!home) return null;
  const ix: Record<string, number> = {}; (F.ix || []).forEach((c: string) => ix[c] = 1);
  const done = (F.done || {})[lc] || {}, fix = (F.fix || {})[lc] || {}, owed: Record<string, number> = {}; ((F.owed || {})[lc] || []).forEach((c: string) => owed[c] = 1);
  const list = (home.data.students || []).filter((s: any) => done[s.code] || (!s.fbBy && owed[s.code]))
    .map((s: any) => ({ code: s.code, name: s.name, form: !!ix[s.code], done: done[s.code] || null, fix: fix[s.code] || null, early: false }));
  const today = manila().slice(0, 10);
  return { data: { month: mo.key, label: mo.label, due: mo.due, dueLabel: mo.dueLabel, opens: mo.opens, opensLabel: mo.opensLabel, open: !mo.opens || today >= mo.opens,
    students: list, done: list.filter((x: any) => x.done).length, total: list.length, fix: list.filter((x: any) => x.fix).length }, at: Math.min(Date.parse(d.updated_at), home.at || Date.parse(d.updated_at)), full: !!home.full };
}

// ── a teacher's page on the management side (the server's mgmtTeacher): her home screen plus her last 30 time-ins and
//    last 40 class notes.
async function teacherPageLive(db: any, name: string) {
  name = String(name || "").trim(); const lc = name.toLowerCase(); if (!lc) return null;
  const [home, TI, NO] = await Promise.all([teacherHomeLive(db, { name }, null), tab(db, "T-TIMEIN"), tab(db, "S-NOTES")]); if (!home) return null;
  const p: any = Object.assign({}, home.data); ["timeIn", "classIns", "hw", "vids", "vfold", "forms", "fix"].forEach((k) => delete p[k]);
  p.me = Object.assign({}, p.me); delete p.me.role; delete p.me.email;
  const tms = (x: any) => isD(x) ? Date.parse(x + "+08:00") : 0;
  const timeIns: any[] = [];
  TI.slice(1, 401).map((r, i) => ({ r, i })).sort((a, b) => (tms(cell(b.r, 3)) - tms(cell(a.r, 3))) || (a.i - b.i)).forEach(({ r }) => {
    if (String(cell(r, 1)).trim().toLowerCase() !== lc || timeIns.length >= 30) return;
    timeIns.push({ date: ymdOf(cell(r, 0)) || String(cell(r, 0)), time: isD(cell(r, 3)) ? hm(cell(r, 3)) : "", status: cell(r, 6), mins: cell(r, 5), proof: cell(r, 7), note: jv(cell(r, 8)), device: cell(r, 9), ip: cell(r, 10), net: cell(r, 11), speed: cell(r, 12),
      type: cell(r, 13) || "Day", cls: String(cell(r, 14) || "").split(" · ")[0], place: cell(r, 15) || "", map: cell(r, 16) || "" }); });
  const notes: any[] = [];
  NO.slice(1, 601).map((r, i) => ({ r, i })).sort((a, b) => (tms(cell(b.r, 0)) - tms(cell(a.r, 0))) || (a.i - b.i)).forEach(({ r }) => {
    if (String(cell(r, 2)).trim().toLowerCase() !== lc || notes.length >= 40) return;
    notes.push({ date: ymdOf(cell(r, 1)) || String(cell(r, 1)), code: cell(r, 3), student: cell(r, 4), ended: cell(r, 5), next: cell(r, 6), homework: cell(r, 7) }); });
  p.timeIns = timeIns; p.notes = notes;
  return { data: p, full: home.full, at: home.at };
}

// ── Open times (the server's mgmtAvailAll): each teacher's weekly hours (T-AVAIL) and her classes for the next 21 days
//    (class table). Only when T-AVAIL has been copied to the database.
async function availAllLive(db: any, names: any) {
  const { data: tt } = await db.from("sheet_tabs").select("synced_at").eq("tab", "T-AVAIL").maybeSingle(); if (!tt) return null;
  const V = await tab(db, "T-AVAIL"), av: Record<string, any> = {};
  V.slice(1).forEach((r) => { const t = String(cell(r, 0)).trim(); if (!t) return; const at = cell(r, 8);
    av[t.toLowerCase()] = { days: [1, 2, 3, 4, 5, 6, 7].map((j) => String(cell(r, j)).replace(/\s+/g, "")), at: isD(at) ? Date.parse(at + "+08:00") : null }; });
  const today = manila().slice(0, 10), last = new Date(Date.parse(today + "T00:00:00Z") + 20 * 864e5).toISOString().slice(0, 10);
  const rows: any[] = [];
  for (let from = 0; from < 20000; from += 1000) {
    const { data, error } = await db.from("classes").select("day,starts_at,data").gte("day", today).lte("day", last).order("day").order("starts_at").order("id").range(from, from + 999);
    if (error) throw new Error("db"); rows.push(...(data || [])); if (!data || data.length < 1000) break;
  }
  const list = (Array.isArray(names) ? names : []).map((n: any) => String(n || "").replace(/^teacher\s+/i, "").trim()).filter((n: string, i: number, a: string[]) => n && a.indexOf(n) === i).slice(0, 40);
  const teachers = list.map((n: string) => { const lc = n.toLowerCase(), busy: any[] = [];
    rows.forEach((x: any) => { const e = x.data || {}; if (!e.cancelled && (e.teachers || []).indexOf(lc) >= 0) busy.push({ s: e.start, e: e.end, who: e.student || e.title }); });
    const a = av[lc]; return { name: n, days: a ? a.days : null, at: a ? a.at : null, busy }; });
  return { ok: true, from: today, teachers };
}

// ── 15 Oct · more screens from the database: simple look-ups in tabs Apps Script copies (S-HOMEWORK, S-NOTE-COMMENTS,
//    S-GOALS, S-MONITOR, REMINDERS). Each one is the server's own function, step by step, on the copy.
const gd = (x: any) => isD(x) ? String(x).slice(0, 10) : String(x || "");                       // gtDay_
const gm = (x: any) => isD(x) ? String(x).slice(0, 7) : String(x || "").slice(0, 7);             // gtMon_
const hm2 = (x: any) => String(x).slice(11, 16);   // fmt_(d, 'HH:mm')
const dMH = (x: any) => +String(x).slice(8, 10) + " " + MON[+String(x).slice(5, 7) - 1] + " " + hm2(x);   // 'd MMM HH:mm'
const sinceDays = (n: number) => manila(new Date(Date.now() - n * 864e5)).slice(0, 10);
async function hwHistLive(db: any, code: string) {
  const v = await tab(db, "S-HOMEWORK"), out: any[] = [];
  const rows = v.slice(1, 3001);
  for (let i = 0; i < rows.length && out.length < 8; i++) { const r = rows[i] || [];
    if (sv(cell(r, 3)).toUpperCase() !== code || !sv(cell(r, 5)).trim()) continue;
    out.push({ date: isD(r[1]) ? dd(r[1]) : sv(cell(r, 1)), teacher: sv(cell(r, 2)), text: sv(cell(r, 5)), eventId: sv(cell(r, 6)) }); }
  return { ok: true, list: out };
}
async function noteCommentsLive(db: any, code: string) {
  const v = await tab(db, "S-NOTE-COMMENTS"), since = sinceDays(75), out: any[] = [];
  v.slice(1, 2001).forEach((r) => { r = r || []; const d = gd(cell(r, 1));
    if (sv(cell(r, 2)) === code && d >= since) out.push({ date: d, teacher: sv(cell(r, 4)), eventId: sv(cell(r, 5)), text: sv(cell(r, 6)), by: sv(cell(r, 7)), at: isD(r[0]) ? dMH(r[0]) : "" }); });
  return { ok: true, comments: out };
}
async function myCommentsLive(db: any, name: string) {
  const v = await tab(db, "S-NOTE-COMMENTS"), since = sinceDays(14), out: any[] = [];
  v.slice(1, 601).forEach((r) => { r = r || []; const day = isD(r[1]) ? dd(r[1]) : sv(cell(r, 1));
    if (sv(cell(r, 4)) !== name || day < since) return;
    out.push({ id: (isD(r[0]) ? Date.parse(r[0] + "+08:00") : sv(cell(r, 0))) + "|" + sv(cell(r, 2)), at: isD(r[0]) ? String(r[0]).slice(5, 7) + "/" + String(r[0]).slice(8, 10) + " " + hm2(r[0]) : "",
      date: day, code: sv(cell(r, 2)), student: sv(cell(r, 3)), eventId: sv(cell(r, 5)), text: sv(cell(r, 6)), by: sv(cell(r, 7)) }); });
  return { ok: true, comments: out };
}
async function goalsLive(db: any, code: string) {
  const v = await tab(db, "S-GOALS"), L: any[] = [];
  v.slice(1, 3001).forEach((r) => { r = r || []; if (sv(cell(r, 2)) !== code) return;
    L.push({ month: gm(cell(r, 1)), teacher: sv(cell(r, 4)), no: Number(cell(r, 5)) || 1, skill: sv(cell(r, 6)), goal: sv(cell(r, 7)), cls: sv(cell(r, 8)), home: sv(cell(r, 9)), check: sv(cell(r, 10)), result: sv(cell(r, 11)), resultMonth: gm(cell(r, 12)) }); });
  if (!L.length) return { ok: true, goals: [] };
  const m = L.reduce((a, g) => g.month > a ? g.month : a, "");
  return { ok: true, goals: L.filter((g) => g.month === m).sort((a, b) => a.no - b.no) };
}
async function myVisitsLive(db: any, name: string) {
  const lc = String(name).trim().toLowerCase(), v = await tab(db, "S-MONITOR"), since = sinceDays(90), out: any[] = [];
  v.slice(1, 1501).forEach((r) => { r = r || []; const d = gd(cell(r, 1));
    if (sv(cell(r, 5)).trim().toLowerCase() !== lc || d < since) return;
    out.push({ date: d, time: isD(r[2]) ? hm2(r[2]) : sv(cell(r, 2)), code: sv(cell(r, 3)), student: sv(cell(r, 4)), checks: sv(cell(r, 7)), note: sv(cell(r, 8)), by: sv(cell(r, 9)),
      at: isD(r[0]) ? dMH(r[0]) : "", id: isD(r[0]) ? String(Date.parse(r[0] + "+08:00")) : "", ack: isD(r[10]) ? dMH(r[10]) : sv(cell(r, 10)), reply: sv(cell(r, 11)) }); });
  return { ok: true, visits: out.slice(0, 20) };
}
async function monDayLive(db: any, date: string) {
  date = /^\d{4}-\d{2}-\d{2}$/.test(String(date || "")) ? date : manila().slice(0, 10);
  const v = await tab(db, "S-MONITOR"), out: Record<string, any> = {};
  v.slice(1, 1501).forEach((r) => { r = r || []; if (gd(cell(r, 1)) !== date) return;
    const tt = isD(r[2]) ? hm2(r[2]) : sv(cell(r, 2)), id = sv(cell(r, 6)) || (sv(cell(r, 3)) + "|" + tt);
    if (!out[id]) out[id] = { by: sv(cell(r, 9)), at: isD(r[0]) ? hm2(r[0]) : "", checks: sv(cell(r, 7)), note: sv(cell(r, 8)), ack: isD(r[10]) ? dMH(r[10]) : sv(cell(r, 10)), reply: sv(cell(r, 11)) }; });
  return { ok: true, date, visits: out };
}
async function remindersLive(db: any, day: string) {
  day = String(day || manila().slice(0, 10)).slice(0, 10);
  const v = await tab(db, "REMINDERS"), n = v.length, out: Record<string, any> = {};
  if (n > 1) v.slice(Math.max(1, n - 1500), n).forEach((r) => { r = r || []; const d = isD(r[1]) ? dd(r[1]) : sv(cell(r, 1)); if (d !== day || !cell(r, 8)) return;
    out[sv(r[8])] = { by: sv(cell(r, 7)), at: isD(r[0]) ? hm2(r[0]) : sv(cell(r, 0)) }; });
  return { ok: true, day, rem: out };
}
async function leaveLive(db: any, name: string) {   // the server's tLeave (leaveRows_ + leaveSummary_)
  const v = await tab(db, "T-LEAVE"), ymd = (x: any) => isD(x) ? String(x).slice(0, 10) : String(x || "").slice(0, 10), lc = String(name).toLowerCase();
  const all = v.slice(1, 1501).map((r) => r || []).filter((r) => cell(r, 0) !== "" && cell(r, 0) !== false && cell(r, 0) !== 0).map((r, i) => ({
    id: sv(cell(r, 0)), row: i + 2, at: isD(r[1]) ? String(r[1]).slice(0, 10) + " " + hm2(r[1]) : sv(cell(r, 1)), teacher: sv(cell(r, 2)).trim(), type: sv(cell(r, 3)), from: ymd(cell(r, 4)), to: ymd(cell(r, 5)) || ymd(cell(r, 4)),
    days: num(cell(r, 6)), part: sv(cell(r, 7)), classes: sv(cell(r, 8)), notice: sv(cell(r, 9)), reason: sv(cell(r, 10)), status: sv(cell(r, 11)),
    by: sv(cell(r, 12)), decidedBy: sv(cell(r, 13)), decidedAt: isD(r[14]) ? String(r[14]).slice(0, 10) + " " + hm2(r[14]) : sv(cell(r, 14)), note: sv(cell(r, 15)), ops: sv(cell(r, 16)),
    proof: sv(cell(r, 17)).split("\n").filter(Boolean).map((x: string) => { const k = x.lastIndexOf("|"); return { name: k > -1 ? x.slice(0, k) : "Proof", id: k > -1 ? x.slice(k + 1) : x }; }),
    ask: sv(cell(r, 18)), thread: sv(cell(r, 19)).split("\n").filter(Boolean), informed: sv(cell(r, 20)).split("\n").filter(Boolean) }));
  const rows = all.filter((r) => r.teacher.toLowerCase() === lc), y = manila().slice(0, 4), by: Record<string, number> = {}; let total = 0;
  rows.filter((r) => r.teacher.toLowerCase() === lc && r.status === "Approved" && r.from.slice(0, 4) === y).forEach((r) => { by[r.type] = (by[r.type] || 0) + r.days; total += r.days; });
  if (name === "\u0000all") return { all } as any;
  return { rows: rows.slice(0, 40), summary: { year: y, total, byType: by }, types: ["Sick leave", "Emergency leave", "Vacation leave", "Personal leave", "Bereavement leave", "Other"], today: manila().slice(0, 10) };
}
// ── 15 Oct · screens Google builds from the sheet's DISPLAYED values (₱300, 15-Oct-2026, November//2026 …).
//    The database copy holds the raw values, so the display format of each column is learned from Google's own last copy
//    of the same screen (base): only a format that reproduces every matching cell is used; anything unsure → Google answers.
const MONL = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const WDL = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
function dTok(iso: string) {
  const y = iso.slice(0, 4), mo = +iso.slice(5, 7), d = +iso.slice(8, 10), H = +iso.slice(11, 13), mi = iso.slice(14, 16), se = iso.slice(17, 19);
  const wd = new Date(Date.UTC(+y, mo - 1, d)).getUTCDay(), h12 = H % 12 || 12;
  return [["yyyy", y], ["MMMM", MONL[mo - 1]], ["EEEE", WDL[wd]], ["MMM", MONL[mo - 1].slice(0, 3)], ["EEE", WDL[wd].slice(0, 3)], ["yy", y.slice(2)],
    ["M", String(mo)], ["d", String(d)], ["H", String(H)], ["h", String(h12)],
    ["MM", String(mo).padStart(2, "0")], ["dd", String(d).padStart(2, "0")], ["HH", String(H).padStart(2, "0")], ["hh", String(h12).padStart(2, "0")],
    ["mm", mi], ["ss", se], ["a", H < 12 ? "AM" : "PM"]] as [string, string][];
}
function dTemplates(iso: string, disp: string) {
  const T = dTok(iso), out: string[][] = [];
  const go = (pos: number, acc: string[]) => { if (out.length > 60) return; if (pos >= disp.length) { out.push(acc); return; }
    let any = false; for (const [k, v] of T) if (v && disp.startsWith(v, pos)) { any = true; go(pos + v.length, acc.concat(["{" + k + "}"])); }
    if (!/[0-9A-Za-z]/.test(disp[pos]) || !any) go(pos + 1, acc.concat([disp[pos]])); };
  go(0, []); return out.map((a) => a.join(""));
}
const dApply = (tpl: string, iso: string) => { const T: Record<string, string> = Object.fromEntries(dTok(iso)); return tpl.replace(/\{(\w+)\}/g, (_m, k) => T[k] ?? ""); };
function nTemplate(disp: string) {
  const m = disp.match(/^(-?)([^\d\-.]*?)(-?)(\d{1,3}(?:,\d{3})+|\d+)(?:\.(\d+))?(%?)$/); if (!m) return null;
  return { pre: m[2], comma: m[4].indexOf(",") > -1, dec: m[5] ? m[5].length : 0, pct: m[6] === "%", negOut: m[1] === "-" };
}
function nApply(t: any, n: number, general: boolean) {
  let v = t.pct ? n * 100 : n; const neg = v < 0; v = Math.abs(v);
  let s = general ? String(Math.round(v * 1e9) / 1e9) : v.toFixed(t.dec);
  if (t.comma) { const [a, b] = s.split("."); s = a.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (b ? "." + b : ""); }
  s = t.pre + s + (t.pct ? "%" : ""); return neg ? (t.negOut ? "-" + s : s.replace(t.pre, t.pre + "-")) : s;
}
// rows: raw copy rows; brows: Google's displayed rows for the same records (same order) → formatter(row, j) or null.
// A column takes the format of its newest cell; older cells formatted differently by hand keep Google's own display
// as long as that row is unchanged.
const odd = (x: any) => typeof x === "string" && /^\d{5,}-\d{2}-\d{2}T00:00:00$/.test(x) ? x.slice(0, -9) : x;   // a typed date past year 9999 (20221-01-10)
const okTpl = (a: string, b: string) => dTemplates(a, b).some((t) => !/[0-9A-Za-z]/.test(t.replace(/\{\w+\}/g, "")));   // the shown date is this date (only the format differs)
const numOk = (b: string, a: number) => { const t = nTemplate(b); if (!t) return false; const v = Number(b.replace(/[^\d.\-]/g, "")) / (t.pct ? 100 : 1);   // the shown number is this number (rounded as shown)
  return Math.abs(Math.abs(v) - Math.abs(a)) <= 0.5 * Math.pow(10, -t.dec) / (t.pct ? 100 : 1) + 1e-9; };
function learnFmt(rows: any[][], brows: any[][], cols: number) {
  const fm: any[] = [], over: Record<string, string> = {}, rk = (r: any[]) => JSON.stringify(r);
  // a pair is only used when its words are the same in both (the same record, not a row that moved)
  const same = rows.map((r, i) => { const b = brows[i] || []; for (let j = 0; j < cols; j++) { const x = cell(r || [], j); if (typeof x === "string" && x !== "" && !isD(x) && String(b[j] ?? "").replace(/^Go →$/, "") !== odd(x).replace(/^Go →$/, "")) return false; } return !!brows[i]; });
  for (let j = 0; j < cols; j++) {
    const ds: [string, string, number][] = [], ns: [number, string, number][] = [];
    for (let i = 0; i < Math.min(rows.length, brows.length); i++) { if (!same[i]) continue; const x = cell(rows[i] || [], j), y = String((brows[i] || [])[j] ?? "");
      if (isD(x) && y) ds.push([x, y, i]); else if (typeof x === "number" && y) ns.push([x, y, i]); }
    const f: any = {};
    if (ds.length) {
      const C = dTemplates(ds[0][0], ds[0][1]);   // the newest record's format (new rows are written the same way)
      let best = "", bn = -1; C.forEach((t) => { const n = ds.filter(([a, b]) => dApply(t, a) === b).length; if (n > bn) { bn = n; best = t; } });
      if (!best || bn < Math.ceil(ds.length * 0.3)) return null; f.d = best;
      ds.forEach(([a, b, i]) => { if (dApply(best, a) !== b && okTpl(a, b)) over[rk(rows[i]) + "|" + j] = b; });   // a changed value is not kept from the old copy
    }
    if (ns.length) {
      const T = ns.map(([, b]) => nTemplate(b)); if (T.some((t) => !t)) { /* odd cells counted below */ }
      const ok = T.filter(Boolean) as any[]; if (!ok.length) return null;
      const pos = ns.map(([a], k) => [a, T[k]] as [number, any]).filter(([a, t]) => t && a >= 0).map(([, t]) => t);
      const preC: Record<string, number> = {}; (pos.length ? pos : ok).forEach((t: any) => preC[t.pre] = (preC[t.pre] || 0) + 1);
      const pre = Object.keys(preC).sort((x, y) => preC[y] - preC[x])[0];
      const dc: Record<number, number> = {}; ok.forEach((q: any) => dc[q.dec] = (dc[q.dec] || 0) + 1);
      const decs = Object.keys(dc).map(Number).sort((x, y) => dc[y] - dc[x]), negT = ns.map(([a], k) => [a, T[k]] as [number, any]).find(([a, t]) => a < 0 && t);
      const t = { pre, comma: ok.some((q: any) => q.comma), dec: decs[0], pct: ok.some((q: any) => q.pct), negOut: negT ? negT[1].negOut : true };
      const gen = !t.pre && !t.pct && (decs.length > 1 || t.dec === 0);
      const good = ns.filter(([a, b]) => nApply(t, a, gen) === b).length; if (good < Math.ceil(ns.length * 0.3)) return null;
      ns.forEach(([a, b, i]) => { if (nApply(t, a, gen) !== b && numOk(b, a)) over[rk(rows[i]) + "|" + j] = b; });
      f.n = t; f.gen = gen;
    }
    fm.push(f);
  }
  return (row: any[], j: number) => { const x = cell(row, j); if (x === "" || x == null) return ""; const o = over[rk(row) + "|" + j]; if (o !== undefined) return o;
    if (x === true) return "TRUE"; if (x === false) return "FALSE";
    const f = fm[j] || {}; if (isD(x)) { if (!f.d) throw new Error("fmt"); return dApply(f.d, x); }
    if (typeof x === "number") { if (!f.n) { if (Number.isInteger(x)) return String(x); throw new Error("fmt"); } return nApply(f.n, x, f.gen); } return String(odd(x)); };
}
async function viewTabLive(db: any, key: string, base: any) {   // the server's tabRead_ for MONEY-like views without a pick (TODAY, PAY)
  const cfg: Record<string, any> = { TODAY: { tab: "TODAY", r0: 2, cols: 9, max: 150 }, PAY: { tab: "PAY", r0: 1, cols: 11, max: 60 } }, c = cfg[key];
  if (!c || !base || !Array.isArray(base.rows)) return null;
  const v = await tab(db, c.tab), n = Math.min(c.max, Math.max(1, v.length - c.r0 + 1)), raw = v.slice(c.r0 - 1, c.r0 - 1 + n).map((r) => Array.from({ length: c.cols }, (_x, j) => cell(r || [], j)));
  const F = learnFmt(raw, base.rows, c.cols); if (!F) return null;
  let out: string[][]; try { out = raw.map((r) => Array.from({ length: c.cols }, (_x, j) => F(r, j))); } catch (_e) { return null; }
  while (out.length && out[out.length - 1].every((x) => x === "")) out.pop();
  return Object.assign({}, base, { rows: out.map((r) => r.map((x) => String(x).replace(/^Go →$/, ""))) });
}
async function actionsLive(db: any, base: any) {   // the server's mgmtActions_
  if (!base || !Array.isArray(base.rows) || !base.lists) return null;
  const v = await tab(db, "ACTIONS"), raw = v.slice(3, 403).map((r) => Array.from({ length: 18 }, (_x, j) => j === 2 || j === 13 ? "" : cell(r || [], j)));   // C and N are not shown
  const keys = ["id", "subject", "", "when", "source", "assigned", "type", "employee", "student", "condition", "status", "tier", "done", "", "demerit", "incentive", "amount", "action"];
  const asRow = (b: any) => keys.map((k, j) => j === 12 ? (b.done ? "TRUE" : "FALSE") : k ? b[k] : "");
  const fr = raw.filter((r) => sv(cell(r, 1)) || sv(cell(r, 7))), pr: any[][] = [], pb: any[][] = [];
  if (fr.length === base.rows.length && fr.every((r, i) => sv(cell(r, 0)) === String(base.rows[i].id || ""))) fr.forEach((r, i) => { pr.push(r); pb.push(asRow(base.rows[i])); });   // same records in the same order
  else { const n: Record<string, number> = {}, bid: Record<string, any> = {}; base.rows.forEach((x: any) => { n[x.id] = (n[x.id] || 0) + 1; bid[x.id] = x; });
    raw.forEach((r) => { const id = sv(cell(r, 0)); if (id && n[id] === 1) { pr.push(r); pb.push(asRow(bid[id])); } }); }   // otherwise only rows with a unique case ID
  const F = learnFmt(pr, pb, 18); if (!F) return null;
  let rows: any[];
  try { rows = raw.map((r) => Array.from({ length: 18 }, (_x, j) => F(r, j))).filter((r) => r[1] || r[7]).map((r) => ({
    id: r[0], subject: r[1], when: r[3], source: r[4], assigned: r[5], type: r[6], employee: r[7], student: r[8], condition: r[9], status: r[10], tier: r[11], done: r[12] === "TRUE", demerit: r[14], incentive: r[15], amount: r[16], action: r[17] })); }
  catch (_e) { return null; }
  return { rows, lists: base.lists };
}
async function payrollLive(db: any, base: any) {   // the server's mgmtPayroll_
  if (!base || !Array.isArray(base.rows) || !Array.isArray(base.head)) return null;
  const v = await tab(db, "PAYROLL"), raw = v.slice(3).map((r) => r || []).filter((r) => cell(r, 1) !== "" && num(cell(r, 16)) !== 0);
  const F = learnFmt(raw.slice(0, base.rows.length), base.rows, 18); if (!F) return null;
  try { const head = Array.from({ length: 18 }, (_x, j) => F(v[0] || [], j));
    const rows = raw.map((r) => Array.from({ length: 18 }, (_x, j) => F(r, j)));
    return { head, rows }; } catch (_e) { return null; }
}
async function leaveAllLive(db: any, base: any) {   // the server's mgmtLeave (people lists from Google's last copy)
  if (!base || !Array.isArray(base.teachers)) return null;
  const all = (await leaveLive(db, "\u0000all")).all, since = manila(new Date(Date.now() - 400 * 864e5)).slice(0, 10);
  return { rows: all.filter((r: any) => r.to >= since), teachers: base.teachers, office: base.office || [], types: ["Sick leave", "Emergency leave", "Vacation leave", "Personal leave", "Bereavement leave", "Other"], today: manila().slice(0, 10) };
}
// teacher lists with IDs to the millisecond: the copy keeps seconds, so IDs Google already gave are taken from its last copy
function keepIds(d: any, base: any, list: string) {
  const B = (base && base[list]) || [], by: Record<string, string> = {};
  B.forEach((x: any) => { if (x && x.id) by[String(Math.floor(Number(String(x.id).split("|")[0]) / 1000)) + "|" + (x.code || "")] = x.id; });
  (d[list] || []).forEach((x: any) => { const n = Number(String(x.id).split("|")[0]); if (!n) return; const k = String(Math.floor(n / 1000)) + "|" + (x.code || ""); if (by[k]) x.id = by[k]; });
  return d;
}

// ── 15 Oct · messages from the database (coe_msgs, the original since 15 Oct night): the server's msgThreads_ / tMsgs / mgmtMsgs
const MSGF = (x: any) => x ? new Date(Date.parse(x) + 8 * 3600e3).toISOString().slice(0, 16).replace("T", " ") : "";
async function msgRowsLive(db: any) {
  const rows: any[] = [];
  for (let from = 0; from < 20000; from += 1000) {
    const { data, error } = await db.from("coe_msgs").select("*").eq("gone", false).order("at", { ascending: true }).order("id", { ascending: true }).range(from, from + 999);
    if (error) throw new Error("db"); rows.push(...(data || [])); if (!data || data.length < 1000) break;
  }
  rows.sort((x: any, y: any) => String(x.at).localeCompare(String(y.at)) || String(x.id).localeCompare(String(y.id), "en", { numeric: true }));   // same second: in the order Google wrote them
  return rows.slice(-1500).map((m: any) => ({ id: m.id, row: 0, at: MSGF(m.at), from: m.from_name, to: m.to_name, text: m.body, parent: m.parent, seen: MSGF(m.seen), ack: MSGF(m.ack), need: !!m.need,
    role: m.role, kind: m.kind, subject: m.subject, memoNo: m.memo_no, signed: m.signed, react: m.react }));
}
function msgThreads(R: any[], lc: string) {
  const roots: Record<string, any> = {}, kids: Record<string, any[]> = {};
  R.forEach((r) => { if (r.parent) (kids[r.parent] = kids[r.parent] || []).push(r); else roots[r.id] = r; });
  const who = (r: any) => String(r.role === "mgmt" ? r.to : r.from).toLowerCase();
  return Object.keys(roots).map((id) => { const r = roots[id], k = kids[id] || [], last = k.length ? k[k.length - 1] : r; return { root: r, replies: k, teacher: r.role === "mgmt" ? r.to : r.from, lastAt: last.at }; })
    .filter((t) => !lc || who(t.root) === lc).sort((a, b) => b.lastAt.localeCompare(a.lastAt)).slice(0, 150);
}

// ── 15 Oct night · the DATABASE tab (student records) from the copy: the list as the sheet shows it (mgmtDatabase_),
//    one record for the edit form (dbRecord) and the form's lists with the next free code (dbLists).
const DB_COLS: Record<string, number> = { cn: 2, en: 3, birth: 6, gender: 8, grade: 9, city: 10, trialDate: 11, trialTime: 12, trialBook: 13, trialCefr: 14,
  trialTeacher: 15, firstClass: 17, lessons: 18, cefrBooks: 20, ended: 21, recommended: 22, source: 23, free: 24 };
async function databaseLive(db: any, base: any) {
  if (!base || !Array.isArray(base.head) || !Array.isArray(base.rows)) return null;
  const v = await tab(db, "DATABASE"), W = base.head.length;
  const r1 = Array.from({ length: W }, (_x, j) => sv(cell(v[0] || [], j))), r2 = Array.from({ length: W }, (_x, j) => { const x = cell(v[1] || [], j); return typeof x === "string" && /^[A-Z][A-Z &\/.-]{1,30}$/.test(x) ? x : ""; });
  let grp = ""; const head = r1.map((x, i) => { if (x) grp = x; const sub = r2[i]; return sub && sub !== x ? (grp && grp !== sub ? grp + " · " + sub : sub) : (x || grp); });
  if (JSON.stringify(head) !== JSON.stringify(base.head)) return null;
  const raw = v.slice(3).map((r) => Array.from({ length: W }, (_x, j) => cell(r || [], j)));
  const occ = (rows: any[][], get: (r: any[]) => string) => { const n: Record<string, number> = {}; return rows.map((r) => { const c = get(r); n[c] = (n[c] || 0) + 1; return c + "#" + n[c]; }); };
  const bk = occ(base.rows, (r) => String(r[0] || "") + "|" + String(r[2] || "")), bi: Record<string, any[]> = {}; bk.forEach((k, i) => bi[k] = base.rows[i]);
  const keep = raw.map((r, i) => ({ r, i })).filter(({ r }) => sv(r[0]) !== "" || sv(r[2]) !== "");
  const rk = occ(keep.map((x) => x.r), (r) => sv(r[0]) + "|" + sv(r[2])), pr: any[][] = [], pb: any[][] = [];
  keep.forEach((x, k) => { const b = bi[rk[k]]; if (b) { pr.push(x.r); pb.push(b.slice(0, W)); } });
  if (pr.length < keep.length * 0.8) return null;
  const F = learnFmt(pr, pb, W); if (!F) return null;
  try { const rows = keep.map(({ r, i }) => { const o: any[] = Array.from({ length: W }, (_x, j) => F(r, j)); o.push(i + 4); return o; }).filter((r) => r[0] || r[2]);
    return { head, rows }; } catch (_e) { return null; }
}
async function dbRecordLive(db: any, row: number, code: string) {
  const v = await tab(db, "DATABASE"), r = v[row - 1] || [];
  if (String(cell(r, 0)) !== code) return { ok: false, msg: "The DATABASE tab changed. Refresh and try again." };
  const out: any = { ok: true, row, code };
  Object.keys(DB_COLS).forEach((k) => { const x = cell(r, DB_COLS[k] - 1); out[k] = isD(x) ? (k === "trialTime" ? String(x).slice(11, 16) : String(x).slice(0, 10)) : String(x).trim(); });
  return out;
}
async function dbListsLive(db: any, base: any) {
  if (!base || !Array.isArray(base.gender)) return null;
  const v = await tab(db, "DATABASE"), yr = manila().slice(0, 4), re = new RegExp("^ST-" + yr + "-(\\d+)$", "i");
  const n = v.slice(3).reduce((m, r) => { const k = String(cell(r || [], 0)).trim().match(re); return k ? Math.max(m, +k[1]) : m; }, 0) + 1;
  return Object.assign({}, base, { nextCode: "ST-" + yr + "-" + String(n).padStart(3, "0") });
}

const LOOKUP_TABS: Record<string, string> = { tHwHist: "S-HOMEWORK", tNoteComments: "S-NOTE-COMMENTS", tMyComments: "S-NOTE-COMMENTS", tGoals: "S-GOALS", tMyVisits: "S-MONITOR", mgmtMonDay: "S-MONITOR", tReminders: "REMINDERS", tLeave: "T-LEAVE", mgmtActions: "ACTIONS", mgmtPayroll: "PAYROLL", mgmtLeave: "T-LEAVE" };

async function tabsAt(db: any, tabs: string[]) {   // the oldest copy time of the tabs a screen is made from
  const { data } = await db.from("sheet_tabs").select("tab,synced_at").in("tab", tabs);
  const t = (data || []).map((x: any) => Date.parse(x.synced_at)).filter((x: number) => x > 0);
  return t.length === tabs.length ? Math.min(...t) : 0;
}
// → { data, at, full }. at = how old the oldest part is. A page that is not complete gets at = 1 hour ago, so the app
//   shows it at once but still asks Google for the full one (and does not keep it as a finished copy).
const T_HIDE = /PRICE|FEE|AMOUNT|PAY|PAID|PESO|RMB|CNY|SOURCE|AGENT|PARENT|PHONE|MOBILE|WECHAT|EMAIL|CONTACT|ACCOUNT|DISCOUNT|SALE/i;
// 22 Oct · Misty: teachers see only the teaching columns of DATABASE (no birthdate, city, source, enrolment or renewal data), so students can't be poached
const T_KEEP = /^(STUDENT ID|CHINESE NAME|ENGLISH NAME|STUDENT TYPE|AGE|GENDER|SCHOOL GRADE|TRIAL CLASS · (DATE|BOOK|CEFR|TEACHER)|ENROLLMENT · (LENGTH|CEFR & BOOKS|ENDED CLASS))$/i;
function teacherSafe(d: any) {
  if (!d || typeof d !== "object") return d;
  const x = JSON.parse(JSON.stringify(d));
  if (x.profile && Array.isArray(x.profile.head) && Array.isArray(x.profile.row)) {
    const keep = x.profile.head.map((h: any) => T_KEEP.test(String(h || "").trim()));
    x.profile.row = x.profile.row.map((v: any, j: number) => keep[j] ? v : "");
    delete x.profile.packages;
  }
  return x;
}
async function calc(db: any, fn: string, args: any[], base?: any, ctx?: any) {
  const partial = Date.now() - 3600e3;
  if (fn === "mgmtActive") return { data: await activeLive(db), at: await tabsAt(db, FN_TABS[fn]), full: true };
  if (fn === "mgmtStudents") return { data: await studentsLive(db), at: await tabsAt(db, FN_TABS[fn]), full: true };
  if (fn === "mgmtStudent") {
    const r = await studentLive(db, String(args[0] || "").trim().toUpperCase(), base); if (!r) return null;
    const t = await tabsAt(db, FN_TABS[fn]), at = r.full && t ? Math.min(t, ...r.at.map((x: string) => Date.parse(x))) : partial;
    return { data: r.data, at, full: r.full && !!t };
  }
  if (fn === "tStudent") {   // a teacher's view of her own student: the same page with money/contact columns emptied (server T_HIDE)
    const code = String(args[0] || "").trim().toUpperCase(), who = String((ctx && ctx.name) || "").trim().toLowerCase(); if (!who) return null;
    if (!base) { const L = await studentsFromTables(db), st = L.find((x: any) => x.code === code);
      if (!st || !st.teachers.some((t: string) => t.toLowerCase() === who)) return null; }   // only her own students
    const r = await studentLive(db, code, null); if (!r || !r.full) return null;
    const d = JSON.parse(JSON.stringify(r.data));
    Object.assign(d, teacherSafe(d));
    d.ok = true;
    const t = await tabsAt(db, FN_TABS.mgmtStudent);
    return { data: d, at: t ? Math.min(t, ...r.at.map((x: string) => Date.parse(x))) : partial, full: !!t };
  }
  if (fn === "mgmtSchedule") {   // future days: complete from the class table; today and earlier: Google's check-ins kept
    const r = await scheduleLive(db, String(args[0] || ""), base); if (!r) return null;
    return { data: r.data, at: r.full ? Math.max(r.at, Date.now() - 600e3) : partial, full: r.full };
  }
  if (fn === "tSchedule" || fn === "mgmtTeacherWeek") {
    const who = fn === "tSchedule" ? String((ctx && ctx.name) || "") : String(args[0] || ""), a = fn === "tSchedule" ? args : args.slice(1);
    const r = await teacherWeekLive(db, who, String(a[0] || ""), fn === "tSchedule" ? Math.min(42, Number(a[1]) || 7) : Math.min(14, Number(a[1]) || 8), base); if (!r || !r.data) return null;
    const { data: lastc } = await db.from("classes").select("updated_at").order("updated_at", { ascending: false }).limit(1);
    const at = lastc && lastc[0] ? Math.max(Date.parse(lastc[0].updated_at), Date.now() - 600e3) : partial;
    return { data: r.data, at: r.full ? at : partial, full: r.full };
  }
  if (fn === "getBootstrap") {   // a teacher's home screen (teachers only; management's own start screen stays on Google)
    if (!ctx || ctx.mode === "mgmt" && !ctx.as) return null;
    const r = await teacherHomeLive(db, ctx.as ? { name: ctx.as } : ctx, base); if (!r) return null;
    const t = await tabsAt(db, ["ACTIVE", "S-NOTES", "T-TIMEIN", "S-HOMEWORK"]);
    return { data: r.data, at: r.full && t ? Math.max(Math.min(t, r.at), Date.now() - 4 * 6e4) : partial, full: r.full };
  }
  if (fn === "tFbStatus") {   // a teacher's monthly-feedback list
    const who = String((ctx && (ctx.as || ctx.name)) || ""); if (!who || (ctx.mode === "mgmt" && !ctx.as)) return null;
    const r = await fbStatusLive(db, who); if (!r) return null;
    return { data: r.data, at: r.full ? Math.max(r.at, Date.now() - 10 * 6e4) : partial, full: r.full };
  }
  if (fn === "mgmtTeacher") {   // a teacher's page (management)
    const r = await teacherPageLive(db, String(args[0] || "")); if (!r) return null;
    const t = await tabsAt(db, ["ACTIVE", "S-NOTES", "T-TIMEIN"]);
    return { data: r.data, at: r.full && t ? Math.max(Math.min(t, r.at), Date.now() - 4 * 6e4) : partial, full: r.full };
  }
  if (fn === "mgmtAvailAll") {   // Open times
    const d = await availAllLive(db, args[0]); if (!d) return null;
    return { data: d, at: Date.now() - 60e3, full: true };
  }
  if (fn === "mgmtStuClasses") {
    const d = await stuClassesLive(db, String(args[0] || "").trim().toUpperCase(), base); if (!d) return null;
    return { data: d, at: partial, full: false };
  }
  if (fn === "mgmtTab") {   // To do (TODAY) and teacher pay (PAY) as displayed in the sheet
    if (args.length !== 1 || !/^(TODAY|PAY)$/.test(String(args[0]))) return null;
    const t = await tabsAt(db, [String(args[0])]); if (!t) return null;
    const d = await viewTabLive(db, String(args[0]), base); return d ? { data: d, at: t, full: true } : null;
  }
  if (fn === "tMsgs" || fn === "mgmtMsgs") {   // 15 Oct night · messages
    if (!(await liveFns(db)).msgs) return null;
    const R = await msgRowsLive(db);
    if (fn === "tMsgs") { const who = String((ctx && (ctx.as || ctx.name)) || "").trim(); if (!who || (ctx.mode === "mgmt" && !ctx.as)) return null; const T = msgThreads(R, who.toLowerCase());
      return { data: { threads: T, unread: T.reduce((a: number, t: any) => a + [t.root].concat(t.replies).filter((r: any) => r.role === "mgmt" && !r.seen).length, 0) }, at: Date.now(), full: true }; }
    if (!ctx || ctx.mode !== "mgmt" || !base || !Array.isArray(base.teachers)) return null;
    const me = String(ctx.name || ""), pres = /president/i.test(String(ctx.role || ""));
    const T = msgThreads(R, "").filter((t: any) => !(t.root.role === "teacher" && t.root.to === "President" && !pres));
    const nf = (r: any) => !r.seen && (r.role !== "mgmt" || String(r.to).toLowerCase() === me.toLowerCase());
    const unread = T.reduce((a: number, t: any) => a + [t.root].concat(t.replies).filter(nf).length, 0);
    let leave: any[] = base.leave || [];
    try { leave = (await leaveLive(db, "\u0000all")).all.filter((r: any) => r.status === "Pending").slice(0, 30).map((r: any) => ({ id: r.id, teacher: r.teacher, type: r.type, from: r.from, to: r.to, at: r.at, ops: r.ops })); } catch (_e) { /* Google's list */ }
    return { data: { threads: T, unread, leave, teachers: base.teachers, mgmt: base.mgmt, mgmtAll: base.mgmtAll, me: base.me || me }, at: Date.now(), full: true };
  }
  if (fn === "mgmtDatabase" || fn === "dbRecord" || fn === "dbLists") {   // 15 Oct night · the DATABASE tab
    if (!ctx || ctx.mode !== "mgmt") return null;
    const t = await tabsAt(db, ["DATABASE"]); if (!t) return null;
    const d = fn === "mgmtDatabase" ? await databaseLive(db, base) : fn === "dbLists" ? await dbListsLive(db, base) : await dbRecordLive(db, Number(args[0]) || 0, String(args[1] || ""));
    return d ? { data: d, at: Math.max(t, Date.now() - 60e3), full: true } : null;
  }
  if (LOOKUP_TABS[fn]) {   // 15 Oct · simple look-ups (see above)
    const t = await tabsAt(db, [LOOKUP_TABS[fn]]); if (!t) return null;
    const who = String((ctx && (ctx.as || ctx.name)) || ""), a0 = String(args[0] || "");
    let d: any = null;
    if (fn === "tHwHist") d = await hwHistLive(db, a0.trim().toUpperCase());
    else if (fn === "tNoteComments") d = await noteCommentsLive(db, a0.trim().toUpperCase());
    else if (fn === "tGoals") d = await goalsLive(db, a0.trim().toUpperCase());
    else if (fn === "tReminders") d = await remindersLive(db, a0);
    else if (fn === "mgmtMonDay") d = await monDayLive(db, a0);
    else if (fn === "tMyComments") { if (!who) return null; d = keepIds(await myCommentsLive(db, who), base, "comments"); }
    else if (fn === "tMyVisits") { if (!who) return null; d = keepIds(await myVisitsLive(db, who), base, "visits"); }
    else if (fn === "mgmtActions") d = await actionsLive(db, base);
    else if (fn === "mgmtPayroll") d = await payrollLive(db, base);
    else if (fn === "mgmtLeave") d = await leaveAllLive(db, base);
    else if (fn === "tLeave") { if (!who) return null; d = await leaveLive(db, who); }
    return d ? { data: d, at: t, full: true } : null;
  }
  return null;
}
const SAME_FOR_ALL = /^(mgmt|pres):(mgmtTab\|\["(TODAY|ACTIVE|DATABASE)"\]|mgmtTrialFus\|\[\]|mgmtFixIgnored\|\[\]|mgmtDatabase\|\[\]|dbLists\|\[\]|dbRecord\||mgmtStudents\|\[\]|mgmtStudent\||mgmtStuClasses\|)/;
const FN_TABS: Record<string, string[]> = { mgmtActive: ["ACTIVE", "S-MONTHLY"], mgmtStudents: ["ACTIVE", "DATABASE", "PR-DATA", "S-MONTHLY"], mgmtStudent: ["PR-DATA", "S-NOTES", "TR-DATA", "S-MONTHLY"], mgmtStuClasses: [] };

// ── sign-in (step 4, approved by Misty 14 Oct 20:26): the same check as the server's passwordLogin, on the copies Apps
//    Script sends (auth_users, auth_pw, auth_secret). Any "no" is answered with fallback: true, so the app asks Google,
//    which decides as before (nobody can be locked out by this). 6 wrong passwords → no answer here for 15 minutes.
async function pwHash(salt: string, pw: string, pep: string) {
  const enc = new TextEncoder(), sb = enc.encode(salt);
  let d = new Uint8Array(await crypto.subtle.digest("SHA-256", enc.encode(salt + "|" + pw + "|" + pep)));
  for (let i = 0; i < 400; i++) { const x = new Uint8Array(d.length + sb.length); x.set(d); x.set(sb, d.length); d = new Uint8Array(await crypto.subtle.digest("SHA-256", x)); }
  let bin = ""; d.forEach((c) => bin += String.fromCharCode(c)); return btoa(bin);
}
async function login(b: any) {
  const email = String(b.email || "").trim().toLowerCase(), pw = String(b.pw || ""), mode = b.mode === "mgmt" ? "mgmt" : "teacher", no = { ok: false, fallback: true };
  if (!email || !pw || pw.length > 200) return no;
  if (!(await liveFns(db)).login) return no;   // switched on/off in docs 'sys:live' (no app update needed)
  const [{ data: u }, { data: p }, { data: f }, { data: sec }] = await Promise.all([
    db.from("auth_users").select("email,name,role").eq("email", email).maybeSingle(), db.from("auth_pw").select("salt,hash").eq("email", email).maybeSingle(),
    db.from("auth_fails").select("n,until").eq("email", email).maybeSingle(), db.from("auth_secret").select("v").eq("k", "pepper").maybeSingle()]);
  if (!u || !p || !sec) return no;
  const mgr = /ops|operation|manag|admin|president/i.test(u.role || "");
  if (mode === "mgmt" ? !mgr : !/teacher/i.test(u.role || "")) return no;
  const live = f && f.until && Date.parse(f.until) > Date.now();
  if (live && f.n >= 6) return no;
  if (await pwHash(p.salt, pw, sec.v) !== p.hash) {
    await db.from("auth_fails").upsert({ email, n: live ? f.n + 1 : 1, until: new Date(Date.now() + 15 * 6e4).toISOString() });
    return no;
  }
  if (f) await db.from("auth_fails").delete().eq("email", email);
  const token = crypto.randomUUID(), exp = new Date(Date.now() + 60 * 864e5).toISOString();
  const { error } = await db.from("app_sessions").insert({ token_hash: await sha(token), email, name: u.name || "", role: u.role || "", mode, exp, src: "db", updated_at: new Date().toISOString() });
  if (error) return no;
  return { ok: true, token, mode, via: "db" };
}

Deno.serve(async (req: Request) => {
  for (const k of Object.keys(TABS)) delete TABS[k];
  VER = null;
  for (const k of Object.keys(SYS)) delete SYS[k];
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);

  let b: any;
  try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  if (b.op === "login") { try { return out(await login(b)); } catch (_e) { return out({ ok: false, fallback: true }); } }
  const token = String(b.token || (Array.isArray(b.args) ? b.args[0] : "") || "");
  if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);

  const { data: s, error: se } = await db.from("app_sessions").select("email,name,role,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (se) return out({ ok: false, error: "db" }, 500);
  if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);

  if (b.op === "ping") return out({ ok: true, name: s.name, mode: s.mode });

  if (b.op === "write") {
    const fn = String(b.fn || "");
    if (!WRITE_FNS.has(fn) || !Array.isArray(b.args)) return out({ ok: false, error: "not allowed" }, 400);
    if (MGMT_W.test(fn) && s.mode !== "mgmt") return out({ ok: false, error: "not allowed" }, 403);
    const rid = b.rid ? String(b.rid).slice(0, 80) : null;
    if (rid) {
      const { data: old } = await db.from("writes").select("id,status").eq("rid", rid).maybeSingle();
      if (old) return out({ ok: true, queued: true, id: old.id, dup: true });
    }
    const { data: w, error: we } = await db.from("writes").insert({ rid, fn, args: b.args, who: s.name, mode: s.mode }).select("id").single();
    if (we) {
      if (rid && /duplicate/i.test(we.message)) return out({ ok: true, queued: true, dup: true });
      return out({ ok: false, error: "not saved" }, 500);
    }
    return out({ ok: true, queued: true, id: w.id });
  }

  if (b.op === "mine") {
    const since = new Date(Date.now() - 3 * 864e5).toISOString();
    const { data: rows, error: me } = await db.from("writes").select("id,fn,args,error,created_at").eq("who", s.name).eq("status", "error").gte("created_at", since).order("id", { ascending: false }).limit(10);
    if (me) return out({ ok: false, error: "db" }, 500);
    return out({ ok: true, failed: (rows || []).map((r: any) => ({ id: r.id, fn: r.fn, a1: Array.isArray(r.args) ? r.args[1] : null, error: r.error, at: r.created_at })) });
  }

  if (b.op === "active" || b.op === "students" || b.op === "calc") {
    if (s.mode !== "mgmt") return out({ ok: false, error: "AUTH" }, 403);
    const fn = b.op === "active" ? "mgmtActive" : b.op === "students" ? "mgmtStudents" : String(b.fn || ""), args = Array.isArray(b.args) ? b.args : [];
    try {
      let base = null;
      const scope = (fn === "tStudent" || fn === "tSchedule" || fn === "getBootstrap" || fn === "tFbStatus" || fn === "tMyVisits" || fn === "tMyComments") ? String(b.as || "").toLowerCase() : (b.scope === "pres" ? "pres" : "mgmt");   // b.as: check a teacher's view (management only)
      if (/^(mgmtStudent|mgmtStuClasses|tStudent|mgmtSchedule|tSchedule|mgmtTeacherWeek|mgmtActions|mgmtPayroll|mgmtLeave|tMyVisits|tMyComments|mgmtTab|mgmtMsgs|mgmtDatabase|dbLists)$/.test(fn) && !b.nobase) { const { data: d } = await db.from("docs").select("data").eq("key", scope + ":" + fn + "|" + JSON.stringify(args)).maybeSingle(); base = d ? d.data : null; }
      const t0 = Date.now(), r = await calc(db, fn, args, base, (fn === "tStudent" || fn === "tSchedule" || fn === "tMyComments" || fn === "tMyVisits" || fn === "tLeave" || fn === "tMsgs") ? { name: b.as } : (fn === "getBootstrap" || fn === "tFbStatus") ? { as: b.as, mode: "mgmt" } : s);
      return out({ ok: true, data: r ? r.data : null, full: r ? r.full : false, ms: Date.now() - t0, at: r && r.at ? new Date(r.at).toISOString() : null });
    } catch (e) { return out({ ok: false, error: "db", why: String((e as Error).message || e) }, 500); }
  }

  if (b.op === "docs") {
    const keys = (Array.isArray(b.keys) ? b.keys : []).map(String).slice(0, 60);
    if (!keys.length) return out({ ok: true, docs: {} });
    const { data: rows, error: de } = await db.from("docs").select("key,scope,data,updated_at").in("key", keys);
    if (de) return out({ ok: false, error: "db" }, 500);
    const docs: Record<string, any> = {};
    for (const r of rows || []) if (mayRead(s, r.scope)) docs[r.key] = { data: r.data, at: r.updated_at };
    // screens that are the same for everyone in management: the President's copy serves the others, and the other way round
    if (s.mode === "mgmt") {
      const miss = keys.filter((k: string) => !docs[k] && SAME_FOR_ALL.test(k)).map((k: string) => k.replace(/^(mgmt|pres):/, (_x, p) => p === "mgmt" ? "pres:" : "mgmt:"));
      if (miss.length) { const { data: alt } = await db.from("docs").select("key,data,updated_at").in("key", miss);
        for (const r of alt || []) { const k = r.key.replace(/^(mgmt|pres):/, (_x: string, p: string) => p === "mgmt" ? "pres:" : "mgmt:"); if (keys.indexOf(k) > -1 && mayRead(s, k.split(":")[0])) docs[k] = { data: r.data, at: r.updated_at }; } }
    }
    // screens the database works out itself: fresher than the stored copy
    const LIVE = await liveFns(db), me = String(s.name || "").trim().toLowerCase();
    await Promise.all(keys.map(async (k: string) => {
      const m = k.match(/^([^:]+):(\w+)\|(.*)$/); if (!m || !LIVE[m[2]] || !mayRead(s, m[1])) return;
      if (/^t[A-Z]|^getBootstrap$/.test(m[2]) ? (m[1] !== me || (m[2] === "getBootstrap" && s.mode === "mgmt")) : s.mode !== "mgmt") return;   // teacher screens: only her own
      try {
        const args = JSON.parse(m[3]); const base = docs[k] ? docs[k].data : null;
        const r = await calc(db, m[2], args, base, s); if (!r || !r.data || !r.at) return;
        if (r.full && docs[k] && Date.parse(docs[k].at) > r.at && m[2] !== "mgmtStudent" && m[2] !== "mgmtStudents") { docs[k].live = true; return; }   // (the Students list carries lessons a week, which only the database works out)   // Google's own copy is newer: use it as it is
        const at = !r.full && docs[k] ? Math.max(r.at, Date.parse(docs[k].at)) : r.at;   // with Google's last copy filling the rest, it is as fresh as that copy
        docs[k] = { data: r.data, at: new Date(at).toISOString(), live: !!r.full };
      } catch (_e) { /* keep the stored copy */ }
    }));
    if (s.mode !== "mgmt") for (const k of Object.keys(docs)) if (/:tStudent\|/.test(k) && docs[k]) docs[k].data = teacherSafe(docs[k].data);   // every route to a teacher's student page
    return out({ ok: true, docs });
  }

  return out({ ok: false, error: "unknown op" }, 400);
});
