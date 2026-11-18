// CupOfEnglish · coe-lists (5 Nov 2026): screens that still made people wait on Google, worked out from the database.
// Each op answers the SAME JSON as the Google function it replaces ("data"); "src" says where parts came from.
// Round 1: schedule (mgmtSchedule) · tab (mgmtTab PAY/MONEY/TODAY) · bootstrap (getBootstrap, management) · tmsgs (tMsgs) · active (mgmtActive)
// Round 2: shadow {fn:'getBootstrap', google} → kept in docs sys:shadow:getBootstrap (last 20) · classinfo {ev} (mgmtClassInfo)
//          leave (mgmtLeave, coe_leave) · tleave {as?} (tLeave) · peer (mgmtPeer, coe_peer) · trials (mgmtTrials, coe_trials + TC&SUB)
//          (the database-first tables are read through coe_lists_rows(), a read-only SQL function)
// Round 3: trialfus (mgmtTrialFus) · reports {month} (mgmtReports) · reportswait {month} (mgmtReportsWait) · payready (mgmtPayReady) · tpayready {as?} (tPayReady)
//          feedback lists read the FB:FEEDBACK DATA / FB:REPORT FILES copies (sbSyncFb_), sys:fbs.done for app submissions not in the sheet yet
// { ok:false, fallback:true } → ask Google as before. Read-only except op shadow (writes its own docs row).
// op check {key, only?}: compares with Google's saved answers (one-time key in docs 'sys:listscheck').
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }

const MANAGERS = [{ email: "works@cupofenglishatph.com", name: "CupOfEnglish", role: "President" },
  { email: "operations@cupofenglishatph.com", name: "Celine", role: "Operations" },
  { email: "mistydotph@gmail.com", name: "Misty", role: "Teacher" }];
const SHIFTS: Record<string, { title: string; week: string[] }> = { "operations@cupofenglishatph.com": { title: "Operations Coordinator", week: ["10:00-19:00", "13:00-22:00", "13:00-22:00", "", "13:00-22:00", "13:00-22:00", "13:00-22:00"] } };
const MGMT_CLOCK_SKIP: string[] = [];
const VIDUP_FROM = "2026-10-22";

const MON = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DOW = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
const isD = (x: unknown) => typeof x === "string" && ISO.test(x);
const toUtc = (x: string) => new Date(x + "+08:00").toISOString();
const jv = (x: any) => isD(x) ? toUtc(x) : (x === undefined || x === null ? "" : x);
const dateStr = (x: string) => { const d = new Date(x.slice(0, 10) + "T00:00:00Z");
  return DOW[d.getUTCDay()] + " " + MON[+x.slice(5, 7) - 1] + " " + x.slice(8, 10) + " " + x.slice(0, 4) + " " + x.slice(11, 19) + " GMT+0800 (Standard na Oras sa Pilipinas)"; };
const sv = (x: any) => isD(x) ? dateStr(x) : String(x ?? "");
const manila = (d = new Date()) => new Date(d.getTime() + 8 * 3600e3).toISOString().slice(0, 19);
const hmOf = (iso: string) => manila(new Date(iso)).slice(11, 16);
const cell = (r: any[], j: number) => r[j] === undefined || r[j] === null ? "" : r[j];
const num = (x: any) => { const n = Number(x); return isFinite(n) ? n : 0; };
const or = (x: any) => (x === "" || x === 0 || x === false || x == null) ? "" : x;

async function loadTab(tab: string, lo = 1, hi = 1e9) {
  const v: any[][] = [];
  for (let from = 0; from < 50000; from += 1000) {
    const { data, error } = await db.from("sheet_rows").select("r,data").eq("tab", tab).gte("r", lo).lte("r", hi).order("r", { ascending: true }).range(from, from + 999);
    if (error) throw new Error("db " + tab);
    for (const x of data || []) v[x.r - 1] = Array.isArray(x.data) ? x.data : [];
    if (!data || data.length < 1000) break;
  }
  for (let i = 0; i < v.length; i++) if (!v[i]) v[i] = [];
  return v;
}
async function tabAt(tab: string) { const { data } = await db.from("sheet_tabs").select("synced_at").eq("tab", tab).maybeSingle(); return data ? String(data.synced_at) : null; }
async function doc(key: string) { const { data } = await db.from("docs").select("data,updated_at").eq("key", key).maybeSingle(); return data ? { data: data.data, at: String(data.updated_at) } : null; }

function users(M: any[][]) {
  const head = (M[0] || []).map((x: any) => sv(x).trim().toUpperCase());
  const iE = head.indexOf("APP EMAIL"), iR = head.indexOf("APP ROLE"), iF = head.indexOf("FIRST NAME");
  const iN = head.indexOf("TEACHER'S NAME") > -1 ? head.indexOf("TEACHER'S NAME") : 4, iS = head.indexOf("STATUS") > -1 ? head.indexOf("STATUS") : 10;
  const out: any[] = [];
  if (iE > -1) M.slice(1).forEach((r) => {
    const email = sv(or(cell(r, iE))).trim().toLowerCase();
    if (!email || !/active|regular/i.test(sv(r[iS]))) return;
    const name = sv(or(cell(r, iN))).replace(/^(coordinator|admin|support)\s+/i, "").trim() || sv(iF > -1 ? or(cell(r, iF)) : "").trim().split(/\s+/)[0];
    out.push({ email, name, code: sv(or(cell(r, 0))), role: sv((iR > -1 && or(cell(r, iR))) || "Teacher").trim() });
  });
  MANAGERS.forEach((m) => { const e = m.email.toLowerCase(), u = out.find((x) => x.email === e); if (u) { u.role = m.role; u.name = m.name; } else out.push({ email: e, name: m.name, code: "", role: m.role }); });
  return out;
}
const staffOn = (st: any) => { const s = sv(st); return /active|regular|permanent|probation|contract|part.?time|full.?time/i.test(s) && !/inactive|resign|terminat|discontinu|end of contract/i.test(s); };
function staff(M: any[][], U: any[]) {
  const head = (M[0] || []).map((x: any) => sv(x).trim().toUpperCase());
  const iR = head.indexOf("APP ROLE"), iS = head.indexOf("STATUS") > -1 ? head.indexOf("STATUS") : 10, iN = head.indexOf("TEACHER'S NAME") > -1 ? head.indexOf("TEACHER'S NAME") : 4;
  const seen: Record<string, number> = {}, out: any[] = [];
  M.slice(1).forEach((r) => {
    const n = sv(or(cell(r, iN))).trim() || sv(or(cell(r, 2))).trim().split(/\s+/)[0];
    if (!n || !staffOn(cell(r, iS)) || !/teacher/i.test(iR > -1 ? sv(cell(r, iR)) : "")) return;
    if (!seen[n.toLowerCase()]) { seen[n.toLowerCase()] = 1; out.push({ name: n, code: sv(or(cell(r, 0))) }); }
  });
  U.filter((u) => /teacher/i.test(u.role)).forEach((u) => { if (!seen[u.name.toLowerCase()]) { seen[u.name.toLowerCase()] = 1; out.push({ name: u.name, code: u.code }); } });
  return out;
}
const isMgr = (u: any) => /ops|operation|manag|admin|president/i.test(String(u.role || ""));
const isPres = (u: any) => /president/i.test(String(u.role || ""));

const isDecision = (v: any) => /^(Waived|Excused|Unexcused)\b/.test(sv(v).trim());
function logRec(r: any[]) {
  const dec = isDecision(cell(r, 8)) ? sv(cell(r, 8)) : "";
  return { time: isD(r[3]) ? String(r[3]).slice(11, 16) : sv(or(cell(r, 3))), status: jv(r[6]), mins: jv(r[5]), proof: jv(r[7]),
    flag: [dec ? "" : sv(or(cell(r, 8))), sv(or(cell(r, 17)))].filter(Boolean).join(" · "),
    out: isD(r[18]) ? String(r[18]).slice(11, 16) : "", hours: r.length <= 19 ? "" : jv(r[19]), outNote: sv(or(cell(r, 20))),
    decision: dec, device: jv(r[9]), ip: jv(r[10]), net: jv(r[11]), speed: jv(r[12]), place: jv(or(cell(r, 15))), map: jv(or(cell(r, 16))),
    start: isD(r[4]) ? String(r[4]).slice(11, 16) : "", code: sv(or(cell(r, 14))).split(" ")[0].toUpperCase() };
}
function todayLog(TI: any[][], ds: string) {
  const out: any = { day: {}, cls: {} };
  TI.slice(1, 401).forEach((r) => {
    if (!r || !r.length) return;
    const d = isD(r[0]) ? String(r[0]).slice(0, 10) : sv(r[0]); if (d !== ds) return;
    const who = sv(r[1]).trim().toLowerCase(), rec = logRec(r);
    if (r[13] === "Class") { const id = sv(r[14]).split(" · ").pop() as string, m = out.cls[who] || (out.cls[who] = {}); if (!m[id]) m[id] = rec; }
    else if (!out.day[who]) out.day[who] = rec;
  });
  return out;
}

const isSub = (t: string) => /\bsub\b/i.test(t) || /(^|-)\s*SC\s*(\s+X)?\s*$/i.test(t);
const isTrial = (t: string) => /trial|试听/i.test(t) || /(^|-)\s*TC\s*(\s+X)?\s*$/i.test(t);
const addDays = (d: string, k: number) => new Date(Date.parse(d + "T00:00:00Z") + k * 864e5).toISOString().slice(0, 10);
async function schedule(ymd: string, baseIn?: any) {
  const today = manila().slice(0, 10), ds = /^\d{4}-\d{2}-\d{2}$/.test(ymd || "") ? ymd : today;
  const past = ds <= today;
  const [clsQ, M, TI, vidQ, b0] = await Promise.all([
    db.from("classes").select("data").eq("day", ds).limit(1000),
    loadTab("MASTERLIST"),
    past ? loadTab("T-TIMEIN", 1, 401) : Promise.resolve([] as any[][]),
    past && ds >= VIDUP_FROM ? db.from("coe_class_video_days").select("event_id,code,teacher,url,proof,uploaded_at").eq("day", ds).limit(1000) : Promise.resolve({ data: [], error: null } as any),
    baseIn !== undefined ? Promise.resolve(baseIn) : db.from("docs").select("data,updated_at").eq("key", "mgmt:mgmtSchedule|" + JSON.stringify([ds])).maybeSingle().then((r: any) => r.data ? Object.assign({}, r.data.data, { __at: r.data.updated_at }) : null),
  ]);
  if (clsQ.error || vidQ.error) throw new Error("db");
  const base = b0 && Array.isArray(b0.events) ? b0 : null, src: any = { classes: "database", ci: past ? "T-TIMEIN copy" : "none (future day)", vids: { db: 0, googleCopy: 0 } };
  const U = users(M), names: Record<string, string> = {};
  staff(M, U).concat(U.filter((u) => /teacher/i.test(u.role))).forEach((t: any) => names[t.name.toLowerCase()] = t.name);
  const bpos: Record<string, number> = {}; (base ? base.events : []).forEach((x: any, i: number) => { if (!(x.id + "|" + x.start in bpos)) bpos[x.id + "|" + x.start] = i; });
  const ev = (clsQ.data || []).map((r: any) => r.data || {}).filter((e: any) => e && e.start)
    .sort((a: any, b: any) => String(a.start).localeCompare(String(b.start)) || ((bpos[a.id + "|" + a.start] ?? 1e9) - (bpos[b.id + "|" + b.start] ?? 1e9)) || String(a.id).localeCompare(String(b.id)));
  const log = past ? todayLog(TI, ds) : { cls: {}, day: {} } as any, ins: Record<string, any> = {};
  Object.keys(log.cls).forEach((t) => Object.keys(log.cls[t]).forEach((id) => ins[id] = log.cls[t][id]));
  const vids: Record<string, any> = {}, VA: Record<string, boolean> = {};
  if (past && base) base.events.forEach((x: any) => { if (!x.vid || !x.vid.url) return; const t0 = String(x.teacher || "").split(", ")[0].toLowerCase();
    const k = String(x.code).toUpperCase() + "|" + t0; if (!vids[k]) { const v = Object.assign({}, x.vid); delete v.app; vids[k] = v; vids[k]._g = 1; } });
  (vidQ.data || []).filter((x: any) => !x.proof && x.code && x.url).sort((a: any, b: any) => String(a.uploaded_at).localeCompare(String(b.uploaded_at))).forEach((x: any) => {
    const k = String(x.code).toUpperCase() + "|" + String(x.teacher || "").trim().toLowerCase(), g = vids[k];
    vids[k] = g && g.url === x.url ? Object.assign({}, g, { _g: 0 }) : { url: x.url, by: "daily" }; if (x.event_id) VA[x.event_id] = true; });
  const first: Record<string, string> = {};
  ev.filter((e: any) => !e.cancelled).slice().sort((a: any, b: any) => String(a.start).localeCompare(String(b.start))).forEach((e: any) => { const t = (e.teachers || [])[0]; if (t && !first[t]) first[t] = e.id; });
  const ciOf = (e: any) => {
    const t = (e.teachers || [])[0]; if (ins[e.id]) return ins[e.id];
    const hm = hmOf(e.start), alt = Object.values((log.cls as any)[t] || {}).find((x: any) => x.start === hm && e.code && x.code === String(e.code).toUpperCase()); if (alt) return alt;
    return first[t] === e.id && log.day[t] ? Object.assign({ first: true }, log.day[t]) : null;
  };
  const appCut = addDays(today, -59);
  const events = ev.map((e: any) => {
    const v0 = vids[String(e.code).toUpperCase() + "|" + (e.teachers || [])[0]] || null;
    let vid: any = null;
    if (v0) { const v = Object.assign({}, v0); if (v._g) src.vids.googleCopy++; else src.vids.db++; delete v._g;
      vid = Object.assign({}, v, VA[e.id] ? { app: true } : ds >= VIDUP_FROM && ds >= appCut ? { app: false } : {}); }
    return { ci: ciOf(e), first: first[(e.teachers || [])[0]] === e.id, vid,
      id: e.id, start: e.start, end: e.end, student: e.student, code: e.code, book: e.book, meet: e.meet, title: e.title, cancelled: e.cancelled, why: e.why || "", mv: e.mv || null,
      teacher: (e.teachers || []).filter((t: string, i: number, a: string[]) => a.indexOf(t) === i).map((t: string) => names[t] || String(t).replace(/\b\w/g, (c) => c.toUpperCase())).join(", ") || "—",
      type: isTrial(e.title) ? "Trial" : isSub(e.title) ? "Sub" : "" };
  });
  if (!events.length && base && base.events.length) return { data: null, src: { why: "no classes in the table for this day but Google had some" } };
  src.googleCopyAt = base ? base.__at || null : null;
  return { data: { date: ds, events }, src };
}

const VIEW: Record<string, { tab: string; r0: number; cols: number; max: number; pick?: boolean }> = {
  MONEY: { tab: "MONEY", r0: 2, cols: 10, max: 90 }, TODAY: { tab: "TODAY", r0: 2, cols: 9, max: 150 }, PAY: { tab: "PAY", r0: 1, cols: 11, max: 60 },
  TEACHERS: { tab: "TEACHERS", r0: 3, cols: 10, max: 60, pick: true }, PAYSLIP: { tab: "PAYSLIP", r0: 4, cols: 10, max: 38, pick: true },
  INDPKG: { tab: "IND-PKG", r0: 4, cols: 8, max: 45, pick: true }, PRREP: { tab: "PR-REPORT", r0: 9, cols: 7, max: 45, pick: true } };
async function googleTab(key: string, args: any[]) {
  const ks = [...new Set(["mgmt", "pres"].map((s) => s + ":mgmtTab|" + JSON.stringify(args)).concat(["mgmt", "pres"].map((s) => s + ":mgmtTab|" + JSON.stringify([key]))))];
  const R = await Promise.all(ks.map((k) => db.from("docs").select("key,data,updated_at").eq("key", k).maybeSingle().then((r: any) => r.data)));
  const L = R.filter((x: any) => x && x.data && Array.isArray(x.data.rows) && !x.data.db).sort((a: any, b: any) => String(b.updated_at).localeCompare(String(a.updated_at)));
  return L[0] ? { data: L[0].data, at: String(L[0].updated_at), key: L[0].key } : null;
}
const grp = (s: string) => { const [a, b] = s.split("."); return a.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (b ? "." + b : ""); };
const pMoney = (n: number) => n === 0 ? "—" : (n < 0 ? "-₱" : "₱") + grp(Math.abs(Math.round(n * 100) / 100).toFixed(2));
const pUnits = (n: number) => n === 0 ? "—" : (Math.round(n * 10) / 10).toFixed(1);
function payCell(r: any[], j: number) {
  const x = cell(r, j); if (x === "") return ""; if (x === true) return "TRUE"; if (x === false) return "FALSE";
  if (isD(x)) throw new Error("fmt");
  if (typeof x === "number") { const a = sv(cell(r, 0)).trim();
    if (/^Still to pay$/i.test(a) && (j === 1 || j === 4)) return pMoney(x);
    if (j === 1) return pUnits(x); if (j >= 3 && j <= 8) return pMoney(x); throw new Error("fmt"); }
  return String(x);
}
async function viewTab(key: string, pick: string, pick2: string, args: any[]) {
  const c = VIEW[key]; if (!c) return { data: null, src: { why: "Unknown tab" } };
  if (c.pick) return { data: null, src: { why: key + " is filled by the sheet's formulas after a pick (Google)" } };
  if (key === "MONEY") {
    const d = await doc("pres:mgmtTab|[\"MONEY\"]"); if (!d || !d.data || !Array.isArray(d.data.rows) || !d.data.db) return { data: null, src: { why: "no database MONEY yet" } };
    if (Date.now() - Date.parse(d.at) > 15 * 6e4) return { data: null, src: { why: "database MONEY older than 15 min" } };
    return { data: { rows: d.data.rows }, src: { rows: "database build (coe-money)", at: d.at, built: d.data.db } };
  }
  if (key === "TODAY") {
    const [d, on] = await Promise.all([doc("sys:todaydb"), doc("sys:todaylive")]);
    if (d && on && on.data && on.data.on && d.data && Array.isArray(d.data.rows) && Date.now() - Date.parse(d.at) <= 10 * 6e4) return { data: { rows: d.data.rows }, src: { rows: "database build (coe-today)", at: d.at } };
    return { data: null, src: { why: "database TODAY not fresh" } };
  }
  const [v, at] = await Promise.all([loadTab(c.tab), tabAt(c.tab)]);
  const hd = v.find((r) => sv(cell(r, 0)).trim() === "TEACHER");
  if (!hd || sv(cell(hd, 1)).trim() !== "UNITS" || sv(cell(hd, 3)).trim() !== "LESSON PAY" || sv(cell(hd, 8)).trim() !== "NET" || sv(cell(hd, 10)).trim() !== "✔ PAID") return { data: null, src: { why: "PAY layout changed" } };
  const n = Math.min(c.max, Math.max(1, v.length - c.r0 + 1)), raw = v.slice(c.r0 - 1, c.r0 - 1 + n).map((r) => Array.from({ length: c.cols }, (_x, j) => cell(r || [], j)));
  let rows: string[][]; try { rows = raw.map((r) => Array.from({ length: c.cols }, (_x, j) => payCell(r, j))); } catch (_e) { return { data: null, src: { why: "a PAY cell format is not known" } }; }
  while (rows.length && rows[rows.length - 1].every((x) => x === "")) rows.pop();
  rows = rows.map((r) => r.map((x) => String(x).replace(/^Go →$/, "")));
  const out: any = { rows };
  const pv = v.slice(0, Math.min(80, v.length)), paid: any[] = []; let on = false;
  for (let i = 0; i < pv.length; i++) { const a = sv(cell(pv[i], 0)).trim();
    if (/^TEACHER$/i.test(a)) { on = true; continue; } if (!on) continue;
    if (!a) { if (paid.length) break; else continue; }
    if (a === a.toUpperCase() || /^total/i.test(a)) break;
    paid.push({ name: a, row: i + 1, paid: cell(pv[i], 10) === true, net: num(cell(pv[i], 8)) }); }
  out.paid = paid;
  return { data: out, src: { rows: "PAY copy", copyAt: at } };
}

function shiftToday(email: string) {
  const S = SHIFTS[String(email || "").toLowerCase()]; if (!S) return null;
  const now = manila(), dow = new Date(now.slice(0, 10) + "T00:00:00Z").getUTCDay(), w = S.week[dow];
  if (!w) return { rest: true, label: "Rest day", title: S.title };
  const [a, b] = w.split("-"); return { start: a, end: b, label: a + "–" + b, title: S.title };
}
async function bootstrap(s: any) {
  const [M, TI] = await Promise.all([loadTab("MASTERLIST"), loadTab("T-TIMEIN", 1, 401)]);
  const U = users(M), email = String(s.email || "").trim().toLowerCase(), f = U.find((x) => x.email === email);
  if (!f) return { data: null, src: { why: "not in MASTERLIST copy" } };
  const u = Object.assign({}, f, { mode: s.mode || (isMgr(f) ? "mgmt" : "teacher") });
  if (!(u.mode === "mgmt" && isMgr(u))) return { data: null, src: { why: "teacher start screen stays on Google" } };
  const today = manila().slice(0, 10);
  const p: any = { me: {}, students: [], schedule: [], special: [], pay: [], adj: [], today };
  p.me = Object.assign(p.me, { name: u.name, code: u.code || "", role: u.role, email: u.email });
  p.mgr = true; p.pres = isPres(u);
  if (MGMT_CLOCK_SKIP.indexOf(String(u.email || "").toLowerCase()) < 0) {
    const sh: any = shiftToday(u.email) || { flex: true, title: u.role || "Management", label: "" };
    p.shift = { label: sh.label || "", rest: !!sh.rest, flex: !!sh.flex, title: sh.title, start: sh.start ? sh.start.padStart(5, "0") : "" };
    p.timeIn = todayLog(TI, today).day[u.name.toLowerCase()] || null;
  }
  return { data: p, src: { users: "MASTERLIST copy", timeIn: "T-TIMEIN copy", copyAt: await tabAt("T-TIMEIN") } };
}

function canon(x: any): any { if (Array.isArray(x)) return x.map(canon); if (x && typeof x === "object") { const o: any = {}; Object.keys(x).sort().forEach((k) => o[k] = canon(x[k])); return o; } return x; }
function diffs(a: any, b: any, path: string, out: any[]) {
  if (out.length > 400) return;
  if (JSON.stringify(canon(a)) === JSON.stringify(canon(b))) return;
  if (a === null || b === null || a === undefined || b === undefined || typeof a !== "object" || typeof b !== "object" || Array.isArray(a) !== Array.isArray(b)) { out.push({ path, db: a, google: b }); return; }
  if (Array.isArray(a)) { if (a.length !== b.length) out.push({ path: path + ".length", db: a.length, google: b.length }); for (let i = 0; i < Math.min(a.length, b.length); i++) diffs(a[i], b[i], path + "[" + i + "]", out); return; }
  new Set([...Object.keys(a), ...Object.keys(b)]).forEach((k) => diffs(a[k], b[k], path + "." + k, out));
}
function kinds(D: any[], label?: (d: any) => string) {
  const g: Record<string, any> = {};
  D.forEach((d) => { const k = label ? label(d) : d.path.replace(/\[\d+\]/g, "[]"); const x = g[k] || (g[k] = { n: 0, ex: [] }); x.n++; if (x.ex.length < 3) x.ex.push({ path: d.path, day: d.day, who: d.who, db: JSON.stringify(d.db)?.slice(0, 160), google: JSON.stringify(d.google)?.slice(0, 160) }); });
  return g;
}
const schedLabel = (d: any) => d.path.replace(/\[\d+\]/g, "[]").replace(/^event\.(ci|vid)\..*/, "event.$1.*");
function evDiffs(a: any, b: any) {
  const out: any[] = [], A: Record<string, any> = {}, B: Record<string, any> = {};
  (a.events || []).forEach((e: any) => A[e.id + "|" + e.start] = e); (b.events || []).forEach((e: any) => B[e.id + "|" + e.start] = e);
  Object.keys(B).forEach((k) => { if (!A[k]) out.push({ path: "event only in Google", db: null, google: B[k].title + " " + B[k].start }); });
  Object.keys(A).forEach((k) => { if (!B[k]) out.push({ path: "event only in database", db: A[k].title + " " + A[k].start, google: null }); else diffs(A[k], B[k], "event", out); });
  if (!out.length && JSON.stringify((a.events || []).map((e: any) => e.id + e.start)) !== JSON.stringify((b.events || []).map((e: any) => e.id + e.start))) out.push({ path: "event order", db: "", google: "" });
  return out;
}

// ═════ Round 2 (5 Nov 2026) ═════
const mf = (ts: any) => ts ? manila(new Date(ts)).slice(0, 16).replace("T", " ") : "";
const isoTxt = (x: any) => typeof x === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(x);
const ymd = (x: any) => String(x ?? "").slice(0, 10);
const numTxt = (x: any) => { const s = String(x ?? ""); return s !== "" && /^-?\d+(\.\d+)?$/.test(s) ? Number(s) : s; };
async function allRows(table: string, _cols?: string) {
  const { data, error } = await db.rpc("coe_lists_rows", { p_table: table });
  if (error) throw new Error("db " + table + ": " + error.message);
  return Array.isArray(data) ? data : [];
}

const LEAVE_TYPES = ["Sick leave", "Emergency leave", "Vacation leave", "Personal leave", "Bereavement leave", "Other"];
async function leaveRows() {
  const R = (await allRows("coe_leave")).slice(0, 1500).filter((r: any) => r.leave_id);
  return R.map((r: any, i: number) => { const from = ymd(r.from_d);
    return { id: String(r.leave_id), row: i + 2, at: mf(r.lodged_at), teacher: String(r.teacher || "").trim(), type: String(r.type ?? ""), from, to: ymd(r.to_d) || from,
      days: num(r.days), part: String(r.part || ""), classes: String(r.classes || ""), notice: String(r.notice || ""), reason: String(r.reason || ""), status: String(r.status || ""),
      by: String(r.lodged_by || ""), decidedBy: String(r.decided_by || ""), decidedAt: mf(r.decided_at), note: String(r.note || ""), ops: String(r.ops_check || ""),
      proof: String(r.proof || "").split("\n").filter(Boolean).map((x: string) => { const k = x.lastIndexOf("|"); return { name: k > -1 ? x.slice(0, k) : "Proof", id: k > -1 ? x.slice(k + 1) : x }; }),
      ask: String(r.asked || ""), thread: String(r.thread || "").split("\n").filter(Boolean), informed: String(r.informed || "").split("\n").filter(Boolean) }; });
}
async function mgmtLeave() {
  const [rows, M] = await Promise.all([leaveRows(), loadTab("MASTERLIST")]), since = manila(new Date(Date.now() - 400 * 864e5)).slice(0, 10);
  const U = users(M), office = U.filter((x) => x.name && !/teacher|president/i.test(x.role)).map((x) => x.name), seen: Record<string, number> = {};
  const people = staff(M, U).map((t) => t.name).concat(office).filter((n: string) => !seen[n.toLowerCase()] && (seen[n.toLowerCase()] = 1)).sort();
  return { data: { rows: rows.filter((r) => r.to >= since), teachers: people, office, types: LEAVE_TYPES, today: manila().slice(0, 10) }, src: { rows: "coe_leave" } };
}
async function tLeave(name: string) {
  const lc = name.toLowerCase(), rows = (await leaveRows()).filter((r) => r.teacher.toLowerCase() === lc), y = manila().slice(0, 4), by: Record<string, number> = {}; let total = 0;
  rows.filter((r) => r.status === "Approved" && r.from.slice(0, 4) === y).forEach((r) => { by[r.type] = (by[r.type] || 0) + r.days; total += r.days; });
  return { data: { rows: rows.slice(0, 40), summary: { year: y, total, byType: by }, types: LEAVE_TYPES, today: manila().slice(0, 10) }, src: { rows: "coe_leave" } };
}

const PEER_PICK_SINCE = "261009170000";
function peerYm(r: any) {
  const raw = String(r.month0 ?? ""), d = String(r.at || "").slice(0, 10), gid = (String(r.id || "").match(/^PR-(\d{12})/) || [])[1] || "";
  if (/^\d{4}-\d{2}$/.test(raw) && (gid >= PEER_PICK_SINCE || raw !== d.slice(0, 7))) return raw;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return raw;
  const y = +d.slice(0, 4), m = +d.slice(5, 7); return +d.slice(8, 10) < 15 ? new Date(Date.UTC(y, m - 2, 15)).toISOString().slice(0, 7) : d.slice(0, 7);
}
async function peerRows() {
  const R = (await allRows("coe_peer")).slice(0, 600).filter((r: any) => r.peer_id);
  return R.map((r: any, i: number) => { const x: any = { id: String(r.peer_id), row: i + 2, at: mf(r.assigned_at), month0: isoTxt(r.month) ? String(r.month).slice(0, 7) : String(r.month ?? ""),
      evaluator: String(r.evaluator ?? ""), teacher: String(r.teacher ?? ""), student: String(r.student ?? ""), code: String(r.st_code ?? ""), date: ymd(r.class_date),
      time: isoTxt(r.class_time) ? String(r.class_time).slice(11, 16) : String(r.class_time || ""), duration: String(r.duration ?? ""), video: String(r.video ?? ""), status: String(r.status ?? ""),
      by: String(r.assigned_by ?? ""), sub: isoTxt(r.submitted) ? String(r.submitted).slice(0, 16).replace("T", " ") : String(r.submitted || ""), total: numTxt(r.total), pct: numTxt(r.percent), note: String(r.note || "") };
    x.month = peerYm(x); return x; });
}
const MONL = ["January","February","March","April","May","June","July","August","September","October","November","December"];
async function mgmtPeer() {
  const [rows, M] = await Promise.all([peerRows(), loadTab("MASTERLIST")]), since = manila(new Date(Date.now() - 60 * 864e5)).slice(0, 10), n = manila();
  return { data: { rows: rows.filter((x) => x.at.slice(0, 10) >= since && x.status !== "Cancelled").sort((a, b) => b.at.localeCompare(a.at)),
    teachers: staff(M, users(M)).map((t) => t.name).sort(), month: MONL[+n.slice(5, 7) - 1] + " " + n.slice(0, 4) }, src: { rows: "coe_peer" } };
}

const bookN = (b: any) => String(b || "").replace(/[\s-]+/g, "").toUpperCase();
let FIDX: { t: number; L: any[] } | null = null;
async function folderIndex() {
  if (FIDX && Date.now() - FIDX.t < 10 * 6e4) return FIDX.L;
  const L: any[] = [];
  for (let from = 0; from < 5000; from += 500) {
    const { data, error } = await db.from("docs").select("key,data,updated_at").like("key", "mgmt:mgmtClassInfo|%").range(from, from + 499);
    if (error) break;
    (data || []).forEach((r: any) => { const f = r.data && r.data.vid && r.data.vid.folder; if (!f) return; let e: any = null; try { e = JSON.parse(String(r.key).slice(String(r.key).indexOf("|") + 1))[0]; } catch (_x) { return; }
      L.push({ code: String(e.code || "").toUpperCase(), t: String(e.teacher || "").trim().toLowerCase(), b: bookN(e.book), type: String(e.type || ""), folder: f, at: String(r.updated_at) }); });
    if (!data || data.length < 500) break;
  }
  L.sort((a, b) => b.at.localeCompare(a.at)); FIDX = { t: Date.now(), L }; return L;
}
async function vidFolder(code: string, teacher: string, book: string, type: string) {
  const L = await folderIndex(), C = String(code || "").toUpperCase(), tn = String(teacher || "").toLowerCase(), B = bookN(book);
  const own = C ? L.filter((x) => x.code === C && x.t === tn) : [];
  if (own.length) { const hit = B && own.find((x) => x.b && (x.b === B || x.b.indexOf(B) === 0 || B.indexOf(x.b) === 0)); return { f: (hit || own[0]).folder, how: hit ? "same class book" : "newest for this student" }; }
  for (const [re, nm] of [[/trial/i, "trial"], [/sub/i, "sub"]] as [RegExp, string][]) if (re.test(type || "")) {
    const cnt: Record<string, Set<string>> = {}; L.filter((x) => x.t === tn && re.test(x.type)).forEach((x) => (cnt[x.folder] = cnt[x.folder] || new Set()).add(x.code));
    const f = Object.keys(cnt).find((k) => cnt[k].size >= 2); if (f) return { f, how: "teacher's " + nm + " folder" };
  }
  return { f: "", how: "" };
}
async function dayVids(ds: string) {
  const today = manila().slice(0, 10), out: Record<string, any> = {}; if (ds > today) return out;
  const [b, q] = await Promise.all([doc("mgmt:mgmtSchedule|" + JSON.stringify([ds])), ds >= VIDUP_FROM ? db.from("coe_class_video_days").select("code,teacher,url,proof,uploaded_at").eq("day", ds).limit(1000) : Promise.resolve({ data: [] } as any)]);
  ((b && b.data && b.data.events) || []).forEach((x: any) => { if (!x.vid || !x.vid.url) return; const k = String(x.code).toUpperCase() + "|" + String(x.teacher || "").split(", ")[0].toLowerCase();
    if (!out[k]) { const v = Object.assign({}, x.vid); delete v.app; out[k] = v; } });
  (q.data || []).filter((x: any) => !x.proof && x.code && x.url).sort((a: any, c: any) => String(a.uploaded_at).localeCompare(String(c.uploaded_at))).forEach((x: any) => {
    const k = String(x.code).toUpperCase() + "|" + String(x.teacher || "").trim().toLowerCase(); if (!(out[k] && out[k].url === x.url)) out[k] = { url: x.url, by: "daily" }; });
  return out;
}
async function classInfo(ev: any) {
  if (!ev || !ev.start || isNaN(Date.parse(ev.start))) return { data: null, src: { why: "no class" } };
  const st = manila(new Date(ev.start)), ds = st.slice(0, 10), hm = st.slice(11, 16), t = String(ev.teacher || "").trim(), lc = t.toLowerCase();
  const [TI, V, F] = await Promise.all([loadTab("T-TIMEIN", 1, 401), dayVids(ds), vidFolder(ev.code, t, ev.book, ev.type)]);
  const log = todayLog(TI, ds), mine = log.cls[lc] || {};
  const ci = mine[ev.id] || Object.values(mine).find((x: any) => x.start === hm && ev.code && x.code === String(ev.code).toUpperCase()) || null;
  let vid: any = V[String(ev.code).toUpperCase() + "|" + lc] || null;
  if (F.f) { vid = vid ? Object.assign({}, vid) : {}; vid.folder = vid.folder || F.f; }
  return { data: { ok: true, ci, vid, day: log.day[lc] || null, now: manila().slice(11, 16) }, src: { ci: "T-TIMEIN copy", vid: "coe_class_video_days + Google's schedule copy", folder: F.how || "none known" } };
}

function sentOf(pics: string) {
  const re = /Report sent to parent (\d{4}-\d{2}-\d{2} \d{2}:\d{2})(?: \(([^)]*)\))? by (.+?)(?= · |$)/g; let m, last: any = null;
  while ((m = re.exec(pics))) last = { at: m[1], by: m[3], how: m[2] || "" };
  return last;
}
function tableOf(v: any[][], key: string) {
  let h = 0; for (let i = 0; i < Math.min(6, v.length); i++) if ((v[i] || []).some((x: any) => String(x ?? "").trim() === key)) { h = i; break; }
  return { head: (v[h] || []).map((x: any) => String(x ?? "").trim()), rows: v.slice(h + 1) };
}
async function trials() {
  const now = manila(), since = manila(new Date(Date.now() - 45 * 864e5)).slice(0, 10), s14 = manila(new Date(Date.now() - 14 * 864e5)).slice(0, 10);
  const [TR, TC, G] = await Promise.all([allRows("coe_trials"), loadTab("TC&SUB"), doc("mgmt:mgmtTrials|[]")]);
  const g = (G && G.data) || {}, gRows: any[] = Array.isArray(g.rows) ? g.rows : [];
  const S = (r: any[], j: number) => sv(or(cell(r, j)));
  const rows: any[] = [], have: Record<string, number> = {};
  TR.slice(0, 400).map((x: any) => Array.isArray(x.row) ? x.row : []).forEach((r: any[]) => {
    if (!isD(r[2]) || !r[0]) return; const ds = String(r[2]).slice(0, 10), stu = sv(r[5]).trim();
    have[ds + "|" + stu.toLowerCase()] = 1; if (ds < since) return;
    const sent = sentOf(S(r, 44)), zhMissing = (or(cell(r, 25)) && !or(cell(r, 27))) || (or(cell(r, 26)) && !or(cell(r, 28)));
    rows.push({ label: sv(r[0]), date: ds, time: isD(r[3]) ? String(r[3]).slice(11, 16) : S(r, 3).trim(), teacher: sv(cell(r, 4)), student: stu, code: S(r, 33), cn: S(r, 34),
      s: jv(r[15]), l: jv(r[16]), rd: jv(r[17]), total: jv(r[18]), cefr: S(r, 23), check: S(r, 24), comm: S(r, 25), next: S(r, 26), commZh: S(r, 27), nextZh: S(r, 28), pdf: S(r, 30), group: S(r, 32), enrolled: S(r, 38),
      sub: isD(r[1]) ? String(r[1]).slice(0, 16).replace("T", " ") : "", sent, pics: S(r, 44),
      status: sent ? "Sent" : or(cell(r, 30)) ? "Ready" : zhMissing ? "Translating" : "Making PDF" });
  });
  const key = (x: any) => x.date + "|" + String(x.student).trim().toLowerCase(), best: Record<string, any> = {};
  rows.forEach((x) => { const k = key(x); if (!best[k] || String(x.sub) > String(best[k].sub)) best[k] = x; });
  for (let i = rows.length - 1; i >= 0; i--) if (best[key(rows[i])] !== rows[i]) rows.splice(i, 1);
  const gBy: Record<string, any> = {}; gRows.forEach((x) => { if (x && x.date) gBy[key(x)] = x; });
  rows.forEach((x) => { const R = gBy[key(x)] && gBy[key(x)].redo; if (!R || String(x.sub) > String(R.at)) return; x.redo = R; x.status = R.doneAt ? "Redone · updating" : "Redo asked"; });
  const pend: Record<string, number> = {};
  gRows.filter((x) => x && x.status === "Sending").forEach((x) => { const k = key(x); pend[k] = 1; if (!have[k] && x.date >= since) rows.push(x); });
  const T = tableOf(TC, "ST CODE"), wait: any[] = [];
  T.rows.forEach((r: any[]) => {
    if (!isD(r[0]) || r[2] !== "Trial" || String(r[0]) > now || /cancel/i.test(sv(cell(r, 9)))) return;
    const ds = String(r[0]).slice(0, 10), k = ds + "|" + sv(r[4]).trim().toLowerCase(); if (ds < s14 || have[k] || pend[k]) return;
    wait.push({ date: ds, time: String(r[0]).slice(11, 16), student: sv(r[4]), code: S(r, 3), teacher: S(r, 5), status: S(r, 9) });
  });
  rows.sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time)); wait.sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
  return { data: { rows, wait, at: now.slice(11, 16) }, src: { rows: "coe_trials", wait: "TC&SUB copy", sent: "TR-DATA PICS column", redo: "Google's last answer " + (G ? G.at : "none") } };
}

const redact = (p: string, x: any) => /email/i.test(p) ? (x ? "(set)" : x) : x;
async function shadow(s: any, fn: string, google: any) {
  if (fn !== "getBootstrap") return { ok: false, error: "unknown fn" };
  if (!google || typeof google !== "object" || JSON.stringify(google).length > 300000) return { ok: false, error: "no google answer" };
  const t0 = Date.now(), r = await bootstrap(s), D: any[] = [];
  if (r.data) diffs(r.data, google, "", D); else D.push({ path: "(no database answer)", db: (r.src as any).why, google: "" });
  const entry = { at: new Date().toISOString(), who: s.name || "", same: !D.length, n: D.length, ms: Date.now() - t0,
    diffs: D.slice(0, 40).map((x) => ({ path: x.path, db: JSON.stringify(redact(x.path, x.db))?.slice(0, 200), google: JSON.stringify(redact(x.path, x.google))?.slice(0, 200) })) };
  const K = "sys:shadow:getBootstrap", old = await doc(K), entries = ((old && old.data && Array.isArray(old.data.entries)) ? old.data.entries : []).concat([entry]).slice(-20);
  const { error } = await db.from("docs").upsert({ key: K, scope: "mgmt", data: { entries, same: entries.filter((x: any) => x.same).length, of: entries.length }, updated_at: new Date().toISOString() });
  return { ok: !error, same: entry.same, n: entry.n };
}

// ═════ Round 3 (5 Nov 2026): follow-ups · reports · pay-ready ═════
// tfuMap_ (mgmtTrialFus): Google keeps it in script properties 'tfu:<date>|<first name>'. Rebuilt from the same save's two traces:
// the TR-DATA PICS column ("Follow-up: <status> (<note>) <at> by <who>" / "Follow-up cleared <at> by <who>") and the queued
// mgmtTrialFu saves in `writes` (their time = when the app queued them, as Google stamps it). Newest event per key wins; older than 120 days dropped.
const TFU_RE = /Follow-up(?:: (said yes, enrolling|Following up|Thinking it over|Unreachable|Not now)(?: \((.*?)\))?| cleared) (\d{4}-\d{2}-\d{2} \d{2}:\d{2}) by (.+?)(?= · |$)/g;
async function trialFus() {
  const [TR, W] = await Promise.all([allRows("coe_trials"),
    db.from("writes").select("args,who,status,created_at,done_at").eq("fn", "mgmtTrialFu").neq("status", "error").order("id", { ascending: true }).limit(5000)]);
  if (W.error) throw new Error("db writes");
  const ev: Record<string, any> = {}, put = (k: string, e: any) => { const o = ev[k]; if (!o || e.at > o.at || (e.at === o.at && e.src >= o.src)) ev[k] = e; };
  TR.map((x: any) => Array.isArray(x.row) ? x.row : []).forEach((r: any[]) => {
    if (!isD(r[2])) return; const k = String(r[2]).slice(0, 10) + "|" + sv(r[5]).trim().split(/\s+/)[0].toLowerCase(), pics = sv(or(cell(r, 44)));
    let m; TFU_RE.lastIndex = 0;
    while ((m = TFU_RE.exec(pics))) put(k, { at: m[3], by: m[4], st: m[1] ? (m[1] === "said yes, enrolling" ? "Enrolling" : m[1]) : "", note: m[2] || "", src: 1 });
  });
  (W.data || []).forEach((w: any) => { const a = Array.isArray(w.args) ? w.args : [], k = String(a[1] || "").trim().toLowerCase(); if (!/^\d{4}-\d{2}-\d{2}\|.{1,60}$/.test(k)) return;
    const st = String(a[2] || ""); put(k, { at: mf(w.created_at), by: String(w.who || ""), st, note: String(a[3] || "").replace(/\s+/g, " ").trim().slice(0, 120), src: 0 }); });
  const old = manila(new Date(Date.now() - 120 * 864e5)).slice(0, 10), out: Record<string, any> = {};
  Object.keys(ev).forEach((k) => { const e = ev[k]; if (!e.st || k.slice(0, 10) < old) return; out[k] = { st: e.st, note: e.note, by: e.by, at: e.at }; });
  return { data: out, src: { from: "TR-DATA PICS column + queued saves (writes)" } };
}

// feedback: the teacher's students and whose turn it is (the server's buildTeacher_ students + fbBy, as coe › teacherHomeLive)
const nameIn = (cell0: any, lc: string) => String(cell0 || "").toLowerCase().split(/[,/&+]| and /).some((x) => x.trim() === lc);
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
// the feedback spreadsheet's copies (Google › sbSyncFb_, every ≤10 min, display values, sheet row order): FB:FEEDBACK DATA (A–K) · FB:REPORT FILES (key column)
async function fbCols(tab: string, sel: string) {
  const out: any[] = [];
  for (let from = 0; from < 20000; from += 1000) {
    const { data, error } = await db.from("sheet_rows").select(sel).eq("tab", tab).gt("r", 1).order("r", { ascending: true }).range(from, from + 999);
    if (error) throw new Error("db " + tab); (data || []).forEach((x: any) => out.push(x)); if (!data || data.length < 1000) break;
  }
  return out;
}
async function fbBase() {
  const [A, tm, fb, fbs, M, FD, RO] = await Promise.all([loadTab("ACTIVE"), doc("sys:tmap"), doc("sys:fb"), doc("sys:fbs"), loadTab("MASTERLIST"),
    fbCols("FB:FEEDBACK DATA", "r,c:data->>1,t:data->>2,s:data->>3,m:data->>4,sub:data->>5,tot:data->>10"), fbCols("FB:REPORT FILES", "r,k:data->>0")]);
  const TM = (tm && tm.data && tm.data.tmap) || {}, dailyName = (tm && tm.data && tm.data.daily) || "";
  const DY = dailyName ? await loadTab(dailyName) : [];
  // feedback_(code) history: from the FEEDBACK DATA copy when there is one (else Google's sys:fb push)
  const fdOk = FD.length > 0, FB: Record<string, any[]> = fdOk ? {} : ((fb && fb.data) || {});
  if (fdOk) FD.forEach((x: any) => { const c = String(x.c || "").trim().toUpperCase(), o = { month: String(x.m ?? ""), submitted: String(x.sub ?? ""), teacher: String(x.t ?? ""), student: String(x.s ?? ""), total: num(x.tot) };
    if (c && (o.month || o.total)) (FB[c] = FB[c] || []).push(o); });
  const rpos: Record<string, number> = {}; RO.forEach((x: any) => { const k = String(x.k || ""); if (k && !(k in rpos)) rpos[k] = x.r; });
  return { A, TM, DY, FB, FD: fdOk ? FD : null, rpos, F: (fbs && fbs.data) || {}, Fat: fbs ? fbs.at : null, U: users(M), fbSrc: fdOk ? "FB:FEEDBACK DATA copy" : "sys:fb" };
}
function teacherStudents(B: any, lc: string) {
  const act = tableOf(B.A, "STUDENTS CODE"), H = act.head, ix = (k: string, d: number) => { const i = H.indexOf(k); return i > -1 ? i : d; };
  const iCode = ix("STUDENTS CODE", 0), iName = ix("NAME", 1), iT = ix("TEACHER", 3), iLeft = ix("TOTAL AVAILABLE", 46);
  const TN: Record<string, Record<string, number>> = {}, addTN = (c: string, t: any) => { t = String(t || "").trim().toLowerCase(); if (c && t) (TN[c] = TN[c] || {})[t] = 1; };
  B.DY.forEach((r: any[]) => { const c = String(cell(r, 0)).trim(); if (/^ST-/.test(c)) String(cell(r, 2) || "").split(/[,/&+]| and /).forEach((t) => addTN(c, t)); });
  Object.keys(B.TM).forEach((c) => Object.keys(B.TM[c] || {}).forEach((t) => addTN(c, t)));
  const leftByCode: Record<string, any> = {}; act.rows.forEach((r) => { if (/^ST-/.test(String(cell(r, iCode))) && cell(r, iLeft) !== "") leftByCode[String(cell(r, iCode))] = cell(r, iLeft); });
  const students: any[] = [], seen: Record<string, number> = {};
  act.rows.forEach((r) => {
    const code = String(cell(r, iCode)), cal = B.TM[code] && B.TM[code][lc]; if (!/^ST-/.test(code) || !(nameIn(cell(r, iT), lc) || (cal && cal.next))) return;
    const shared = cell(r, 50) || ""; let left = cell(r, iLeft); if (left === "" && shared) left = leftByCode[shared] !== undefined ? leftByCode[shared] : "";
    if (left !== "" && Number(left) <= 0) return; if (cell(r, 47) !== true && !(TN[code] && TN[code][lc])) return;
    if (seen[code]) return; seen[code] = 1; students.push({ code, name: String(cell(r, iName)) }); });
  students.sort((a, b) => a.name.localeCompare(b.name));
  const actT: Record<string, Record<string, number>> = {}, mo = fbMonthKey(manila());
  act.rows.forEach((r) => { const c = String(cell(r, iCode)); if (!/^ST-/.test(c)) return; String(cell(r, iT) || "").toLowerCase().split(/[,/&+]| and /).forEach((x) => { x = x.trim(); if (x) (actT[c] = actT[c] || {})[x] = 1; }); });
  if (Object.keys(B.TM).length) for (let i = students.length - 1; i >= 0; i--) { const s = students[i], mm = sameCourse(B.TM[s.code], lc), o = owner(mm, lc);
    if (o.gone) { students.splice(i, 1); continue; }
    const fh = Array.isArray(B.FB[s.code]) ? B.FB[s.code].slice().sort((a: any, b: any) => String(b.month).localeCompare(String(a.month)) || String(b.submitted).localeCompare(String(a.submitted))) : null; const g = fbTurn(mm, lc, o, actT[s.code] || {}, fh, mo); if (g && g.toLowerCase() !== lc) s.fbBy = g; }
  return students;
}
const TAUGHT: Record<string, { t: number; v: any }> = {};
async function taughtMap(ym: string) {
  if (TAUGHT[ym] && Date.now() - TAUGHT[ym].t < 60e3) return TAUGHT[ym].v;
  const mi = +ym.slice(5, 7) - 1, full = MONL[mi].toUpperCase() + "-DAILY", short = MONL[mi].slice(0, 3).toUpperCase() + "-DAILY";
  const { data } = await db.from("sheet_tabs").select("tab").in("tab", [full, short]); const names = (data || []).map((x: any) => x.tab);
  const nm = names.indexOf(full) > -1 ? full : names.indexOf(short) > -1 ? short : ""; const out: Record<string, Record<string, number>> = {};
  if (nm) (await loadTab(nm)).slice(2).forEach((r) => { const code = sv(cell(r, 0)).trim(); if (!/^ST-/.test(code)) return; let u = 0; for (let j = 4; j < 36; j++) u += Number(cell(r, j)) || 0; if (!u) return;
    sv(cell(r, 2) || "").split(/[,/&+]| and /).forEach((t) => { t = t.trim().toLowerCase(); if (t) (out[code] = out[code] || {})[t] = 1; }); });
  TAUGHT[ym] = { t: Date.now(), v: out }; return out;
}
const prevYm = (k: string) => new Date(Date.UTC(+k.slice(0, 4), +k.slice(5, 7) - 2, 15)).toISOString().slice(0, 7);
async function fbOwed(code: string, lc: string, key: string, TM: any) {
  const T = await taughtMap(prevYm(key)); if (!(T[code] && T[code][lc])) return false;
  const N = await taughtMap(key); if (N[code] && N[code][lc]) return true;
  if (!TM || Object.keys(TM).length < 20) return true; const x = (TM[code] || {})[lc]; return !!(x && x.next);
}
function fbDoneMap(B: any, RF: any[], key: string) {
  const done: Record<string, Record<string, any>> = {}, add = (t: string, c: string, x: any) => { const k = String(t || "").trim().toLowerCase(), cc = String(c || "").trim().toUpperCase(); if (!k || !cc) return; (done[k] = done[k] || {}); if (!done[k][cc]) done[k][cc] = x; };
  if (B.FD) {   // as fbDone_: FEEDBACK DATA rows of the month, then app submissions (fbp:, via sys:fbs) the sheet does not have yet
    B.FD.forEach((x: any) => { if (String(x.m) === key) add(x.t, x.c, { at: String(x.sub ?? ""), total: num(x.tot), via: "form" }); });
    if (B.F.mo && B.F.mo.key === key) Object.keys(B.F.done || {}).forEach((t) => Object.keys(B.F.done[t] || {}).forEach((c) => { const x = B.F.done[t][c]; if (x && x.via !== "form") add(t, c, x); }));
    return done;
  }
  if (B.F.mo && B.F.mo.key === key) Object.keys(B.F.done || {}).forEach((t) => Object.keys(B.F.done[t] || {}).forEach((c) => add(t, c, B.F.done[t][c])));
  Object.keys(B.FB).forEach((c) => (B.FB[c] || []).forEach((x: any) => { if (String(x.month) === key) add(x.teacher, c, { at: x.submitted, total: x.total, via: "form" }); }));
  RF.forEach((x: any) => { if (x.month === key) add(x.teacher, x.code, { at: x.submitted, total: x.total, via: "form" }); });
  return done;
}
async function fbPending(B: any, RF: any[], name: string, key: string, D?: any) {
  const lc = name.toLowerCase(), done = (D || fbDoneMap(B, RF, key))[lc] || {}, out: any[] = [];
  for (const s of teacherStudents(B, lc)) if (!s.fbBy && !done[s.code] && await fbOwed(s.code, lc, key, B.TM)) out.push({ code: s.code, name: s.name });
  return out;
}
const teachersOf = (U: any[]) => U.filter((u) => /teacher/i.test(u.role));
async function repWait(B: any, RF: any[], key: string) {
  const D = fbDoneMap(B, RF, key), out: any[] = [];
  for (const t of teachersOf(B.U)) (await fbPending(B, RF, t.name, key, D)).forEach((x) => out.push({ code: x.code, student: x.name, teacher: t.name }));
  out.sort((a, b) => a.teacher.localeCompare(b.teacher) || a.student.localeCompare(b.student)); return out;
}
async function rfRows(month: string) { const { data, error } = await db.rpc("coe_lists_rf", { p_month: month || "" }); if (error) throw new Error("db rf: " + error.message); return Array.isArray(data) ? data : []; }
const rfOut = (x: any) => ({ key: String(x.rf_key), code: String(x.code ?? ""), teacher: String(x.teacher ?? ""), student: String(x.student ?? ""), month: String(x.month ?? ""), submitted: String(x.submitted ?? ""),
  total: x.total === null || x.total === "" || x.total === undefined ? null : Number(x.total), file: !!x.has_file, status: String(x.status || "Ready"), by: String(x.by_name || ""), at: String(x.at_text || ""), note: String(x.note || "") });
async function reportsWait(month: string) {
  const B = await fbBase(); if (!B.F.mo || !B.F.mo.key) return { data: null, src: { why: "no feedback month (sys:fbs)" } };
  const key = /^\d{4}-\d{2}$/.test(String(month || "")) ? month : B.F.mo.key, RF = await rfRows("");
  return { data: { ok: true, month: key, waiting: await repWait(B, RF, key) }, src: { students: "ACTIVE copy + sys:tmap", done: B.fbSrc + " + sys:fbs (app)", owed: "DAILY tab copies", fbs: B.Fat } };
}
async function reports(month: string, B0?: any) {
  const B = B0 || await fbBase(), mo = B.F.mo; if (!mo || !mo.key) return { data: null, src: { why: "no feedback month (sys:fbs)" } };
  const key = /^\d{4}-\d{2}$/.test(String(month || "")) ? month : mo.key, y = +key.slice(0, 4), m = +key.slice(5, 7);
  const RFall = await rfRows(""), RF = RFall.filter((x: any) => x.month === key);
  const g = await doc("mgmt:mgmtReports|" + JSON.stringify([key === mo.key ? "" : key])) || await doc("mgmt:mgmtReports|" + JSON.stringify([key]));
  const pos: Record<string, number> = {}; ((g && g.data && g.data.rows) || []).forEach((x: any, i: number) => { if (!(x.key in pos)) pos[x.key] = i; });
  const rp = B.rpos || {}, rk = (x: any, i: number) => rp[x.rf_key] ?? (pos[x.rf_key] !== undefined ? 1e5 + pos[x.rf_key] : 1e6 + i);   // REPORT FILES sheet order (copy), else Google's last list
  const rows = RF.map((x: any, i: number) => ({ x, i })).sort((a: any, b: any) => rk(a.x, a.i) - rk(b.x, b.i)).map((o: any) => rfOut(o.x));
  const have: Record<string, number> = {}; rows.forEach((x: any) => have[x.code] = 1);
  const making: any[] = [], fd: any[] = [];
  Object.keys(B.FB).forEach((c) => (B.FB[c] || []).forEach((x: any) => { if (String(x.month) === key) fd.push({ c: String(c).trim().toUpperCase(), x }); }));
  const tsOf = (s: string) => { const q = String(s).match(/^(\d{2})-([A-Za-z]{3})-(\d{4}) (\d{2}):(\d{2})/); return q ? q[3] + String(MON.indexOf(q[2]) + 1).padStart(2, "0") + q[1] + q[4] + q[5] : String(s); };
  const mpos: Record<string, number> = {}; ((g && g.data && g.data.making) || []).forEach((x: any, i: number) => { if (!(x.code in mpos)) mpos[x.code] = i; });
  fd.sort((a, b) => tsOf(a.x.submitted).localeCompare(tsOf(b.x.submitted)) || a.c.localeCompare(b.c));
  const fo: Record<string, number> = {}; fd.forEach((o, i) => { if (!(o.c in fo)) fo[o.c] = i; });
  const inFd: Record<string, any> = {}; fd.forEach((o) => { inFd[o.c] = o.x; });
  if (B.FD) {   // exactly as reports_: FEEDBACK DATA rows of the month in sheet order (first row fixes the place, the last row's values win)
    for (const k of Object.keys(inFd)) delete inFd[k]; Object.keys(fo).forEach((k) => delete fo[k]); Object.keys(mpos).forEach((k) => delete mpos[k]);
    B.FD.forEach((x: any, i: number) => { if (String(x.m) !== key) return; const c = String(x.c || "").trim().toUpperCase(); if (!(c in fo)) fo[c] = i; inFd[c] = { teacher: String(x.t ?? ""), student: String(x.s ?? ""), total: x.tot, submitted: String(x.sub ?? "") }; });
  }
  Object.keys(inFd).sort((a, b) => ((mpos[a] ?? 1e6 + fo[a]) - (mpos[b] ?? 1e6 + fo[b]))).forEach((c) => { if (!have[c]) { const r = inFd[c]; making.push({ code: c, teacher: r.teacher, student: r.student, total: num(r.total), submitted: r.submitted, why: "PDF is being made (every hour)" }); have[c] = 1; } });
  if (key === mo.key) { const gm: Record<string, number> = {}; ((g && g.data && g.data.making) || []).forEach((x: any, i: number) => { if (!(x.code in gm)) gm[x.code] = i; });
    const app: any[] = []; Object.keys(B.F.done || {}).forEach((t) => Object.keys(B.F.done[t] || {}).forEach((c) => { const x = B.F.done[t][c]; if (x && x.via !== "form") app.push({ t, c, x }); }));
    app.sort((a, b) => ((gm[a.c] ?? 1e6) - (gm[b.c] ?? 1e6)) || (num(a.x.ts) - num(b.x.ts)));
    app.forEach(({ t, c, x }) => { if (have[c]) return;
      const st = teacherStudents(B, t).find((s: any) => s.code === c); making.push({ code: c, teacher: x.by || t, student: (st && st.name) || c, total: x.total, submitted: x.at, why: "Sent from the app · waiting for the form sync" }); have[c] = 1; }); }
  let waiting: any[] | null = [], waitLater = false;
  if (key === mo.key) { (await repWait(B, RFall, key)).forEach((x) => { if (!have[x.code]) (waiting as any[]).push(x); }); }
  const pm = new Date(Date.UTC(+mo.key.slice(0, 4), +mo.key.slice(5, 7) - 2, 15)).toISOString().slice(0, 7);
  return { data: { month: key, label: MONL[m - 1] + " " + y, months: [mo.key, pm], current: mo.key, due: mo.dueLabel, rows, making, waiting: waitLater ? null : waiting, waitLater },
    src: { rows: "coe_report_files" + (Object.keys(B.rpos || {}).length ? " in FB:REPORT FILES order" : ""), making: B.fbSrc + " + sys:fbs (app)", waiting: "worked out (Google: its 30-min cached list)", fbs: B.Fat } };
}
async function payReady() {
  const n = manila(), y = +n.slice(0, 4), mth = +n.slice(5, 7), pk = new Date(Date.UTC(y, mth - 2, 15)).toISOString().slice(0, 7), fk = n.slice(0, 7);
  const [B, RFall, P, G] = await Promise.all([fbBase(), rfRows(""), peerRows(), doc("mgmt:mgmtPayReady|[]")]);
  const g = (G && G.data) || {}, gt = g.t || {}, label = MONL[+pk.slice(5, 7) - 1] + " " + pk.slice(0, 4), gOk = g.month === label;
  const out: Record<string, any> = {}, get = (k: string) => out[k] || (out[k] = { fb: [], peer: [], vid: [] });
  const D = fbDoneMap(B, RFall, fk);
  for (const t of teachersOf(B.U)) (await fbPending(B, RFall, t.name, fk, D)).forEach((x) => get(String(t.name).toLowerCase()).fb.push(x.name));
  P.filter((r: any) => r.status === "Assigned" && peerYm(r) === pk).forEach((r: any) => get(String(r.evaluator).trim().toLowerCase()).peer.push(String(r.teacher || "")));
  if (gOk) Object.keys(gt).forEach((k) => { if (!gt[k].ops && (gt[k].vid || []).length) get(k).vid = gt[k].vid.slice(); });
  const ops = B.U.filter((u: any) => /operation|ops/i.test(String(u.role || "")));
  if (ops.length) {
    const R = (await reports(pk, B)).data, tr = ((await trials()).data.rows || []).filter((x: any) => String(x.date).slice(0, 7) === pk), pr = P.filter((x: any) => peerYm(x) === pk && x.status !== "Cancelled");
    const rep = ((R && R.rows) || []).filter((x: any) => !/^Sent/.test(x.status) && x.status !== "Returned").map((x: any) => x.student + " (" + x.teacher + ")");
    const trlX = tr.filter((x: any) => x.status !== "Sent"), trl = trlX.map((x: any) => x.student + " · trial " + x.date.slice(5)), trlIds = trlX.map((x: any) => x.label).filter(Boolean);
    const TI = await loadTab("T-TIMEIN", 1, 1501);
    ops.forEach((u: any) => { const lc = String(u.name).toLowerCase(), go = gOk && gt[lc] && gt[lc].ops ? gt[lc] : null;
      const auto = TI.slice(1, 1501).filter((r) => ymd(cell(r, 0)).slice(0, 7) === pk && sv(cell(r, 1)).trim().toLowerCase() === lc && cell(r, 13) !== "Class" && /^Auto/.test(sv(or(cell(r, 20))))).map((r) => ymd(cell(r, 0)).slice(5));
      out[lc] = { ops: true, rep, trl, trlIds, set: pr.length ? [] : ["No peer-review class set for " + MONL[+pk.slice(5, 7) - 1]],
        fol: go ? go.fol : [], ren: go ? go.ren : [], late: go ? go.late : [], info: { auto, fix: go && go.info ? go.info.fix : 0 }, fb: [], peer: [], vid: [] }; });
  }
  return { data: { month: label, fbMonth: label, at: n.slice(11, 16), t: out }, src: { fb: "ACTIVE + sys:tmap + DAILY copies + " + B.fbSrc + " + sys:fbs (app)", peer: "coe_peer", vid: "Google's last list " + (G ? G.at : "none"), ops: "reports/trials/peer/T-TIMEIN from the database; fol, ren, late, fix from Google's last list" } };
}
async function tPayReady(name: string) {
  const r = (await payReady()).data, lc = name.toLowerCase(), last = await doc(lc + ":tPayReady|[]"), nz = last && last.data && last.data.nudge;
  return { data: { month: r.month, at: r.at, me: r.t[lc] || { fb: [], peer: [], vid: [] }, nudge: nz && nz.month === r.month ? nz : null }, src: { nudge: "Google's last answer (script property pnudge:)" } };
}

async function check(only?: string) {
  const t0 = Date.now(), res: any = { at: new Date().toISOString() }, want = (k: string) => !only || only.split(",").indexOf(k) > -1;
  if (want("schedule")) { const { data } = await db.from("docs").select("key,data,updated_at").like("key", "mgmt:mgmtSchedule|%").order("key", { ascending: false });
    const days: any[] = [], all: any[] = [];
    for (const r of data || []) { const ds = JSON.parse(String(r.key).split("|")[1])[0], g = r.data;
      const t1 = Date.now(), m = await schedule(ds, Object.assign({}, g, { __at: r.updated_at })), ms = Date.now() - t1;
      const D = m.data ? evDiffs(m.data, g) : [{ path: "no answer", db: m.src, google: "" }]; D.forEach((x: any) => x.day = ds); all.push(...D);
      const kc: Record<string, number> = {}; D.forEach((x: any) => { const k = schedLabel(x); kc[k] = (kc[k] || 0) + 1; });
      days.push({ day: ds, googleAt: r.updated_at, events: [m.data ? m.data.events.length : 0, (g.events || []).length], same: !D.length, diffs: D.length, kinds: kc, ms, vids: m.src && m.src.vids }); }
    res.schedule = { days, same: days.filter((x) => x.same).length, of: days.length, kinds: kinds(all, schedLabel) }; }
  if (want("tmsgs")) { const { data } = await db.from("docs").select("key,data,updated_at").like("key", "%:tMsgs|[]");
    const L: any[] = [], all: any[] = [];
    for (const r of data || []) { const nm = String(r.key).split(":")[0];
      const [qa, qb] = await Promise.all([db.rpc("coe_lists_tmsgs", { p_name: nm, p_sheet_only: true }), db.rpc("coe_lists_tmsgs", { p_name: nm, p_sheet_only: false })]);
      if (qa.error || qb.error) throw new Error("tmsgs rpc: " + ((qa.error || qb.error) as any).message);
      const a = qa.data, b = qb.data;
      const D: any[] = []; const G = r.data || {}, byId = (x: any) => { const o: any = {}; (x.threads || []).forEach((t: any) => o[t.root.id] = t); return o; };
      const GA = byId(G), AA = byId(a || {}), BB = byId(b || {});
      Object.keys(GA).forEach((id) => { if (!AA[id]) D.push({ path: "thread only in Google", db: null, google: id }); else diffs(AA[id], GA[id], "thread", D); });
      Object.keys(AA).forEach((id) => { if (!GA[id]) D.push({ path: (Date.parse(AA[id].lastAt.replace(" ", "T") + ":00+08:00") > Date.parse(r.updated_at) ? "thread newer than Google's copy" : "thread not in Google's copy"), db: id + " " + AA[id].lastAt, google: null }); });
      const auto = Object.keys(BB).filter((id) => !AA[id]).length;
      D.forEach((x) => x.who = nm); all.push(...D);
      L.push({ who: nm, googleAt: r.updated_at, threads: [Object.keys(AA).length, Object.keys(GA).length], same: !D.filter((x) => !/newer than/.test(x.path)).length, diffs: D.length, autoOnlyInDb: auto, unread: [a && a.unread, G.unread] }); }
    res.tmsgs = { people: L, kinds: kinds(all, (d) => d.path.replace(/\[\d+\]/g, "[]")) }; }
  if (want("tab")) { const T: any[] = [];
    for (const [key, args] of [["PAY", ["PAY", "", ""]], ["MONEY", ["MONEY"]], ["TODAY", ["TODAY"]]] as any[]) {
      const t1 = Date.now(), m = await viewTab(key, "", "", args), g = await googleTab(key, args), ms = Date.now() - t1; if (!g) { T.push({ key, google: null, db: m.src }); continue; }
      const D: any[] = []; if (m.data) { diffs(m.data.rows, g.data.rows, "rows", D); if (key === "PAY") diffs(m.data.paid, g.data.paid, "paid", D); }
      T.push({ key, googleAt: g.at, googleKey: g.key, src: m.src, same: !!m.data && !D.length, diffs: D.length, kinds: kinds(D), ms }); }
    res.tab = T; }
  if (want("active")) { const t1 = Date.now(); const qa = await db.rpc("coe_lists_active"); const t2 = Date.now(); const qb = await db.rpc("coe_active_screen"); const t3 = Date.now();
    res.active = { same: !!qa.data && JSON.stringify(canon(qa.data)) === JSON.stringify(canon(qb.data)), rows: qa.data && qa.data.rows ? qa.data.rows.length : 0, ms: t2 - t1, msOld: t3 - t2 }; }
  const one = async (name: string, key: string, run: () => Promise<any>, prep?: (x: any) => any, extra?: (a: any, b: any) => any) => {
    const g = await doc(key); if (!g) return { name, google: null };
    const t1 = Date.now(), m = await run(), ms = Date.now() - t1, D: any[] = [];
    const a = m.data ? (prep ? prep(JSON.parse(JSON.stringify(m.data))) : m.data) : null, b = prep ? prep(JSON.parse(JSON.stringify(g.data))) : g.data;
    if (a) diffs(a, b, "", D); else D.push({ path: "no answer", db: m.src, google: "" });
    return Object.assign({ name, googleAt: g.at, same: !D.length, diffs: D.length, kinds: kinds(D), ms, src: m.src }, extra && a ? extra(a, b) : {});
  };
  const bySet = (A: any[], G: any[], tk: (x: any) => string, ik: (x: any) => string) => { const S: Record<string, any> = {}, add = (L: any[], w: string) => (L || []).forEach((x) => { const t = tk(x), o = S[t] || (S[t] = { db: [], google: [] }); o[w].push(ik(x)); });
    add(A, "db"); add(G, "google"); const out: Record<string, any> = {};
    Object.keys(S).sort().forEach((t) => { const o = S[t], od = o.db.filter((x: string) => o.google.indexOf(x) < 0), og = o.google.filter((x: string) => o.db.indexOf(x) < 0);
      out[t] = od.length || og.length ? { n: [o.db.length, o.google.length], onlyDb: od.slice(0, 30), onlyGoogle: og.slice(0, 30) } : { n: [o.db.length, o.google.length], same: true }; });
    return out; };
  const waitSets = (a: any, b: any) => ({ waitingSets: bySet(a.waiting || [], b.waiting || [], (x) => String(x.teacher).toLowerCase(), (x) => x.code), makingSet: a.making ? bySet(a.making, b.making || [], () => "all", (x) => x.code + " " + x.teacher) : undefined,
    rowsOrderSame: Array.isArray(a.rows) && Array.isArray(b.rows) ? JSON.stringify(a.rows.map((x: any) => x.key).filter((k: string) => b.rows.some((y: any) => y.key === k))) === JSON.stringify(b.rows.map((x: any) => x.key).filter((k: string) => a.rows.some((y: any) => y.key === k))) : undefined,
    makingOrderSame: Array.isArray(a.making) && Array.isArray(b.making) ? JSON.stringify(a.making.map((x: any) => x.code).filter((k: string) => b.making.some((y: any) => y.code === k))) === JSON.stringify(b.making.map((x: any) => x.code).filter((k: string) => a.making.some((y: any) => y.code === k))) : undefined });
  const fbSets = (a: any, b: any) => { const fl = (o: any) => Object.keys(o.t || {}).flatMap((t) => (o.t[t].fb || []).map((n: string) => ({ t, n }))); return { fbSets: bySet(fl(a), fl(b), (x) => x.t, (x) => x.n) }; };
  if (want("leave")) { const L: any[] = [await one("mgmtLeave", "mgmt:mgmtLeave|[]", mgmtLeave)];
    const { data } = await db.from("docs").select("key").like("key", "%:tLeave|[]"); const M = await loadTab("MASTERLIST"), U = users(M);
    for (const r of data || []) { const nm = String(r.key).split(":")[0], u = U.find((x) => x.name.toLowerCase() === nm);
      L.push(await one("tLeave " + nm, r.key, () => tLeave(u ? u.name : nm), (x) => { delete x.today; return x; })); }
    res.leave = L; }
  if (want("peer")) res.peer = await one("mgmtPeer", "mgmt:mgmtPeer|[]", mgmtPeer);
  if (want("trials")) res.trials = await one("mgmtTrials", "mgmt:mgmtTrials|[]", trials, (x) => { delete x.at; return x; });
  if (want("classinfo")) {
    const { data } = await db.from("docs").select("key,data,updated_at").like("key", "mgmt:mgmtClassInfo|%").order("updated_at", { ascending: false }).limit(150);
    const L: any[] = [], all: any[] = []; FIDX = null;
    for (const r of data || []) { let ev: any = null; try { ev = JSON.parse(String(r.key).slice(String(r.key).indexOf("|") + 1))[0]; } catch (_e) { continue; }
      const m = await classInfo(ev), a = m.data ? Object.assign({}, m.data, { now: "" }) : null, b = Object.assign({}, r.data, { now: "" }), D: any[] = [];
      if (a) diffs(a, b, "", D); else D.push({ path: "no answer", db: m.src, google: "" });
      const end = Date.parse(ev.end || ev.start), early = Date.parse(r.updated_at) < end + 6 * 3600e3;
      D.forEach((x: any) => { x.who = ev.teacher; x.day = String(ev.start).slice(0, 10); if (early && x.db != null && x.google == null) x.path = "[newer than Google's copy] " + x.path; });
      all.push(...D); L.push({ same: !D.length, newer: D.length > 0 && D.every((x: any) => /^\[newer/.test(x.path)) }); }
    res.classinfo = { of: L.length, same: L.filter((x) => x.same).length, onlyNewer: L.filter((x) => x.newer).length, kinds: kinds(all, (d) => d.path.replace(/\[\d+\]/g, "[]").replace(/\.(ci|day)\..*$/, ".$1.*")) }; }
  if (want("trialfus")) res.trialfus = await one("mgmtTrialFus", "mgmt:mgmtTrialFus|[]", trialFus);
  if (want("reports")) { const L: any[] = [];
    for (const [k, m] of [["mgmt:mgmtReports|[\"\"]", ""], ["mgmt:mgmtReports|[\"2026-10\"]", "2026-10"], ["mgmt:mgmtReports|[\"2026-11\"]", "2026-11"]] as any[]) L.push(await one("mgmtReports " + (m || "current"), k, () => reports(m), undefined, waitSets));
    for (const m of ["2026-11", "2026-10"]) L.push(await one("mgmtReportsWait " + m, "mgmt:mgmtReportsWait|" + JSON.stringify([m]), () => reportsWait(m), (x) => { delete x.stale; return x; }, waitSets));
    res.reports = L; }
  if (want("payready")) { const L: any[] = [await one("mgmtPayReady", "mgmt:mgmtPayReady|[]", payReady, (x) => { delete x.at; return x; }, fbSets)];
    const { data } = await db.from("docs").select("key").like("key", "%:tPayReady|[]"); const U = users(await loadTab("MASTERLIST"));
    for (const r of data || []) { const nm = String(r.key).split(":")[0], u = U.find((x) => x.name.toLowerCase() === nm); L.push(await one("tPayReady " + nm, r.key, () => tPayReady(u ? u.name : nm), (x) => { delete x.at; return x; })); }
    res.payready = L; }
  res.ms = Date.now() - t0;
  return res;
}

Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const t0 = Date.now();
  if (b.op === "check") {
    const k = await doc("sys:listscheck"); if (!k || !k.data || !k.data.key || String(k.data.key).length < 16 || k.data.key !== String(b.key || "")) return out({ ok: false, error: "AUTH" }, 401);
    try { return out({ ok: true, r: await check(b.only ? String(b.only) : "") }); } catch (e) { return out({ ok: false, error: "db", why: String((e as Error).message || e) }, 500); }
  }
  const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: s, error: se } = await db.from("app_sessions").select("name,role,mode,email,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (se) return out({ ok: false, error: "db" }, 500);
  if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
  const mgmt = s.mode === "mgmt", NO = () => out({ ok: false, error: "AUTH" }, 403);
  const ans = (r: any) => r && r.data != null ? out({ ok: true, data: r.data, src: r.src, ms: Date.now() - t0 }) : out({ ok: false, fallback: true, why: (r && r.src && r.src.why) || "not available", ms: Date.now() - t0 });
  try {
    if (b.op === "schedule") { if (!mgmt) return NO(); return ans(await schedule(String(b.date || ""))); }
    if (b.op === "tab") { if (!mgmt) return NO(); const key = String(b.key || ""), pick = String(b.pick || ""), pick2 = String(b.pick2 || "");
      return ans(await viewTab(key, pick, pick2, Array.isArray(b.args) ? b.args.slice(0, 5) : [key, pick, pick2])); }
    if (b.op === "bootstrap") return ans(await bootstrap(s));
    if (b.op === "tmsgs") { const who = mgmt && b.as ? String(b.as).trim().slice(0, 40) : String(s.name || "").trim(); if (!who || (mgmt && !b.as)) return ans({ data: null, src: { why: "management's own messages are mgmtMsgs" } });
      const { data, error } = await db.rpc("coe_lists_tmsgs", { p_name: who, p_sheet_only: !!b.sheetOnly }); if (error) throw new Error(error.message);
      return ans({ data, src: { messages: "coe_msgs", sheetOnly: !!b.sheetOnly } }); }
    if (b.op === "active") { if (!mgmt) return NO(); const { data, error } = await db.rpc("coe_lists_active"); if (error) throw new Error(error.message);
      return ans({ data, src: { rows: "ACTIVE copy + class table (coe_lists_active = coe_active_screen)" } }); }
    if (b.op === "shadow") { if (!mgmt) return NO(); return out(await shadow(s, String(b.fn || ""), b.google)); }
    if (b.op === "classinfo") { if (!mgmt) return NO(); return ans(await classInfo(b.ev)); }
    if (b.op === "leave") { if (!mgmt) return NO(); return ans(await mgmtLeave()); }
    if (b.op === "tleave") { const who = mgmt && b.as ? String(b.as).trim().slice(0, 40) : String(s.name || "").trim(); if (!who) return NO(); return ans(await tLeave(who)); }
    if (b.op === "peer") { if (!mgmt) return NO(); return ans(await mgmtPeer()); }
    if (b.op === "trials") { if (!mgmt) return NO(); return ans(await trials()); }
    if (b.op === "trialfus") { if (!mgmt) return NO(); return ans(await trialFus()); }
    if (b.op === "reports") { if (!mgmt) return NO(); return ans(await reports(String(b.month || ""))); }
    if (b.op === "reportswait") { if (!mgmt) return NO(); return ans(await reportsWait(String(b.month || ""))); }
    if (b.op === "payready") { if (!mgmt) return NO(); return ans(await payReady()); }
    if (b.op === "tpayready") { const who = mgmt && b.as ? String(b.as).trim().slice(0, 40) : String(s.name || "").trim(); if (!who) return NO(); return ans(await tPayReady(who)); }
    return out({ ok: false, error: "unknown op" }, 400);
  } catch (e) { return out({ ok: false, error: "db", fallback: true, why: String((e as Error).message || e) }, 500); }
});
