// CupOfEnglish · coe-student (27 Oct 2026; v2 1352: inclusive Student portal, adult flag) · student / parent access (mostly mainland China, phones, WeChat browser). Never calls Google.
// Sign-in (Misty's rule): username = the student's ST code, password = the student's English name (case-insensitive, trimmed; any
// DATABASE row's English name or the ACTIVE package name for that code). If the parent set their own password, only that works.
// Protections: 5 wrong tries per code → 15 min lock; 30 wrong tries per connection per hour; sessions 30 days; sign-ins logged;
// management can switch a student's access off and clear an own password. Parents see only their own child:
//   home (next class, lessons left, valid-until, renewal reminder), schedule (upcoming / past with status), homework & class notes
//   (the parent-facing lesson-summary fields: where the class ended, homework, observation, next plan), homework "done" ticks,
//   progress (CEFR journey — same rule as coe-cj, monthly reports SENT to parents, attendance).
// Never: prices, payments, phone/WeChat/addresses, teacher internal info, other students, class videos (Google Drive).
// Management (app_sessions mode mgmt): op sList / sActive / sClearPw.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
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
async function packagesOf(code: string) {
  const { data: P } = await db.from("coe_packages").select("id").eq("code", code).is("removed_at", null).eq("active", true).limit(50);
  const ids = (P || []).map((p: any) => p.id); if (!ids.length) return [] as any[];
  const { data: C } = await db.from("coe_pkg_calc").select("id,buy,fin,avail,deadline").in("id", ids).limit(50);
  return (C || []).map((x: any) => { const used = Math.max(0, Number(x.fin) || 0), left = Number(x.avail) || 0;
    return { total: used + left, used, left, buy: x.buy || "", valid: x.deadline || "", renew: left <= 4 }; }).sort((a: any, b: any) => String(a.buy).localeCompare(String(b.buy)));
}
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

Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const op = String(b.op || "");
  const ip = String(req.headers.get("x-forwarded-for") || "").split(",")[0].trim().slice(0, 60);

  // ───────── management: list / switch off / clear own password ─────────
  if (/^s(List|Active|ClearPw)$/.test(op)) {
    const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
    const { data: s } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
    if (!s || new Date(s.exp).getTime() < Date.now() || s.mode !== "mgmt") return out({ ok: false, error: "AUTH" }, 401);
    if (op === "sList") {
      const [{ data: A }, { data: PK }, DBR] = await Promise.all([
        db.from("student_access").select("code,active,pw_set_at,last_login,logins").limit(5000),
        db.from("coe_packages").select("code,name,cn,active").is("removed_at", null).limit(5000),
        (async () => { const o: any[] = []; for (let f = 0; f < 20000; f += 1000) { const { data, error } = await db.from("sheet_rows").select("data").eq("tab", "DATABASE").order("r").range(f, f + 999); if (error || !data) break; o.push(...data); if (data.length < 1000) break; } return o; })()]);
      const AD: Record<string, boolean> = {}; (DBR || []).forEach((x: any) => { const r = x.data || [], k = codeOf(c(r, 0)); if (k && adultRow(r)) AD[k] = true; });
      const m: Record<string, any> = {};
      (PK || []).forEach((p: any) => { const k = codeOf(p.code); if (!k) return; const o = m[k] = m[k] || { code: k, name: norm(p.name), cn: norm(p.cn), active: false }; if (p.active) o.active = true; if (!o.name) o.name = norm(p.name); if (!o.cn) o.cn = norm(p.cn); });
      (A || []).forEach((a: any) => { const o = m[a.code] = m[a.code] || { code: a.code, name: "", cn: "", active: false }; o.access = a.active; o.own = !!a.pw_set_at; o.last = a.last_login; o.logins = a.logins; });
      const list = Object.values(m).map((o: any) => ({ code: o.code, name: o.name, cn: o.cn, adult: !!AD[o.code], enrolled: o.active, access: o.access !== false, own: !!o.own, last: o.last || null, logins: o.logins || 0 }))
        .sort((a: any, b: any) => (+b.enrolled - +a.enrolled) || a.code.localeCompare(b.code));
      return out({ ok: true, students: list });
    }
    const code = codeOf(b.code); if (!code) return out({ ok: false, msg: "No student code" });
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

  // ───────── sign-in: ST code + English name (or own password) ─────────
  if (op === "login") {
    const code = codeOf(b.code), pw = String(b.password || "").slice(0, 200);
    const t15 = new Date(Date.now() - 15 * 6e4).toISOString(), t60 = new Date(Date.now() - 60 * 6e4).toISOString();
    const [{ count: fc }, { count: fi }] = await Promise.all([
      db.from("student_login_attempts").select("id", { count: "exact", head: true }).eq("code", code || "?").eq("ok", false).gte("at", t15),
      db.from("student_login_attempts").select("id", { count: "exact", head: true }).eq("ip", ip || "?").eq("ok", false).gte("at", t60)]);
    if ((code && (fc || 0) >= 5) || (ip && (fi || 0) >= 30)) return out({ ok: false, msg: "尝试次数过多，请15分钟后再试 · Too many tries — please try again in 15 minutes" }, 429);
    let ok = false, nm: any = null;
    if (code) {
      const [{ data: acc }, N] = await Promise.all([db.from("student_access").select("active,pw_hash,pw_salt,pw_iter").eq("code", code).maybeSingle(), namesOf(code)]);
      nm = N;
      if (!acc || acc.active !== false) {
        if (acc && acc.pw_hash && acc.pw_salt) ok = eqT(await pbkdf2(pw, acc.pw_salt, acc.pw_iter || 120000), acc.pw_hash);
        else { const k = nameKey(pw); ok = !!k && N.en.has(k); }
      }
    }
    await db.from("student_login_attempts").insert({ code: code || String(b.code || "").slice(0, 20), ip, ok });
    if (!ok) return out({ ok: false, msg: "学号或密码不正确 · Wrong student code or password" }, 401);
    const token = rnd(32);
    await db.from("student_sessions").insert({ token_hash: await sha(token), code, exp: new Date(Date.now() + 30 * 864e5).toISOString(), ua: String(req.headers.get("user-agent") || "").slice(0, 160) });
    const { data: cur } = await db.from("student_access").select("logins").eq("code", code).maybeSingle();
    await db.from("student_access").upsert({ code, last_login: new Date().toISOString(), logins: ((cur && cur.logins) || 0) + 1 }, { onConflict: "code" });
    return out({ ok: true, token, code, name: nm.name, cn: nm.cn, adult: !!nm.adult });
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

  if (op === "all") {   // one call for the whole page (fewer round trips from China)
    const since = new Date(Date.now() - 120 * 864e5).toISOString(), to = new Date(Date.now() + 28 * 864e5).toISOString(), since60 = new Date(Date.now() - 60 * 864e5).toISOString().slice(0, 10);
    const [N, PK, { data: UP }, { data: PAST }, TRr, PRr, NO, HW, { data: WN }, { data: DONE }, { data: RL }, { data: FB }, BT, { data: SA }] = await Promise.all([
      namesOf(code), packagesOf(code),
      db.from("classes").select("starts_at,ends_at,teachers,data").eq("code", code).gte("starts_at", nowIso).lte("starts_at", to).eq("cancelled", false).not("id", "like", "pend-%").order("starts_at").limit(60),
      db.from("classes").select("starts_at,ends_at,teachers,cancelled,data").eq("code", code).lt("starts_at", nowIso).gte("starts_at", since).not("id", "like", "pend-%").order("starts_at", { ascending: false }).limit(80),
      rowsBy("TR-DATA", 33, code), rowsBy("PR-DATA", 4, code), rowsBy("S-NOTES", 3, code), rowsBy("S-HOMEWORK", 3, code),
      db.from("writes").select("fn,args,status,created_at").in("fn", ["saveNote", "markHomework"]).neq("status", "error").neq("status", "test").gte("created_at", new Date(Date.now() - 14 * 864e5).toISOString()).filter("args->1->>code", "eq", code).order("id").limit(200),
      db.from("student_hw_done").select("day,event_id,done_at").eq("code", code).gte("day", since60).limit(500),
      db.from("docs").select("key,data").like("key", "mgmt:mgmtReports|%").limit(40),
      db.from("docs").select("v:data->" + code).eq("key", "sys:fb").maybeSingle(),
      bookTitles(),
      db.from("student_access").select("pw_set_at").eq("code", code).maybeSingle()]);
    const up = ((UP as any[]) || []).map((x: any) => cls(BT, x));
    const past = ((PAST as any[]) || []).map((x: any) => { const t = String((x.data && x.data.title) || ""); return { ...cls(BT, x), status: x.cancelled ? "cancelled" : isAbsent(t) ? "absent" : "done" }; });
    // homework & class notes: sheet copies + saves not copied yet (newest wins), last 60 days
    const notes: Record<string, any> = {};
    const key = (d: string, ev: string) => d + "|" + ev;
    const put = (d: string, ev: string, o: any) => { if (!d || d < since60) return; const k = key(d, ev || ""); notes[k] = Object.assign(notes[k] || { day: d, event: ev || "" }, Object.fromEntries(Object.entries(o).filter(([, v]) => v != null && String(v).trim() !== ""))); };
    NO.forEach((r: any[]) => put(ymd(c(r, 1)), String(c(r, 8)), { teacher: cap(String(c(r, 2))), ended: norm(c(r, 5)), next: String(c(r, 6) || "").trim(), homework: String(c(r, 7) || "").trim(), obs: String(c(r, 9) || "").trim() }));
    HW.forEach((r: any[]) => put(ymd(c(r, 1)), String(c(r, 6)), { teacher: cap(String(c(r, 2))), homework: String(c(r, 5) || "").trim() }));
    ((WN as any[]) || []).forEach((w: any) => { const a = (w.args || [])[1] || {}; if (codeOf(a.code) !== code) return;
      if (w.fn === "saveNote") put(ymd(a.date), String(a.eventId || ""), { ended: norm(a.ended), next: String(a.next || "").trim(), homework: String(a.homework || "").trim(), obs: String(a.obs || "").trim() });
      else put(ymd(a.date), String(a.eventId || ""), { homework: String(a.homework || a.text || "").trim() }); });
    const dn: Record<string, string> = {}; ((DONE as any[]) || []).forEach((x: any) => { dn[key(String(x.day), x.event_id)] = x.done_at; });
    const tByDay: Record<string, string> = {}; past.forEach((p) => { if (!tByDay[p.day]) tByDay[p.day] = p.teacher; });
    const hw = Object.values(notes).filter((n: any) => n.homework || n.obs || n.next).map((n: any) => ({ day: n.day, event: n.event, teacher: n.teacher || tByDay[n.day] || "", ended: n.ended || "", homework: n.homework || "", obs: n.obs || "", next: n.next || "", done: dn[key(n.day, n.event)] || null }))
      .sort((a: any, b: any) => b.day.localeCompare(a.day)).slice(0, 40);
    // progress
    const T = TRr.map(trOf), P = PRr.map(prOf), m = N.rows.length ? merge(N.rows) : null;
    const journey = m ? { start: { date: m.first || m.td, level: CJ_L[lv(m.tc)] || "", book: bookOf(BT, m.tb) }, path: m.cb.split(/→|->/).map((x) => x.trim()).filter(Boolean), now: nowOf(N.rows, T, P),
      checks: P.filter((p) => p.date && lv(p.cefr) >= 0).map((p) => ({ date: p.date, level: CJ_L[lv(p.cefr)] })).sort((a, b) => a.date.localeCompare(b.date)) } : null;
    const sent: Record<string, any> = {};
    (RL || []).forEach((d: any) => ((d.data && d.data.rows) || []).forEach((r: any) => { if (codeOf(r.code) === code && /^sent/i.test(String(r.status || ""))) sent[String(r.teacher).toLowerCase() + "|" + r.month] = r; }));
    const fbs: any[] = Array.isArray(FB && (FB as any).v) ? (FB as any).v : [], keys = Object.keys(sent), cnOver: Record<string, any> = {};
    if (keys.length) { const { data: CN } = await db.from("docs").select("key,data").in("key", [...new Set(keys.map((k) => "fbcn:" + code + "|" + k.split("|")[1]))]); (CN || []).forEach((x: any) => { cnOver[x.key.split("|")[1]] = x.data; }); }
    const reports = keys.map((k) => { const [t, mo] = k.split("|"), e = fbs.filter((f) => String(f.teacher || "").toLowerCase() === t && f.month === mo).pop(); if (!e) return null;
      const cn = Object.assign({}, e.cn || {}, cnOver[mo] || {});
      return { month: mo, classMonth: prevMonth(mo), teacher: String(e.teacher || sent[k].teacher || ""), total: Number(e.total) || 0, l: e.l, r: e.r, s: e.s, w: e.w, course: bookOf(BT, e.course || ""),
        cn: { strengths: cn.strengths || "", areas: cn.areas || "", next: cn.next || "" }, en: { strengths: e.strengths || "", areas: e.areas || "", next: e.next || "" } }; })
      .filter(Boolean).sort((a: any, b: any) => b.month.localeCompare(a.month));
    const pk = PK, left = pk.reduce((a: number, p: any) => a + p.left, 0), total = pk.reduce((a: number, p: any) => a + p.total, 0), used = pk.reduce((a: number, p: any) => a + p.used, 0);
    const valid = pk.map((p: any) => p.valid).filter(Boolean).sort().pop() || "";
    return out({ ok: true, student: { code, name: N.name, cn: N.cn, adult: !!N.adult }, own: !!(SA && (SA as any).pw_set_at),
      pkg: pk.length ? { total, used, left, valid, renew: left <= 4 } : null, upcoming: up, past, hw, journey, reports, at: nowIso, tz: "Asia/Shanghai (UTC+8)" });
  }
  return out({ ok: false, error: "unknown op" }, 400);
});
