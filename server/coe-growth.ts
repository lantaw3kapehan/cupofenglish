// CupOfEnglish · Growth page (tGrowth / mgmtGrowth) worked out from the database (27 Oct 2026, release 1361).
// A line-by-line port of the Apps Script tGrowth → growth_ / qaAll_ / career_ / attend_ / mgmtActions_ (praise) /
// liveCareer_ + liveUnits_ / visitsFor_, reading the database copies of the sheet tabs (sheet_rows) and the class table.
// Three parts stay on Google's last answer (stored in docs '<name>:tGrowth|[]'), labelled in _src:
//   peer reviews (peer.list, peer.titles) – read straight from a Google Form, not copied to the database;
//   monthly record (record) – needs the class-video links Google reads from Drive and the DAILY tabs;
//   class visits (peer.visits) – the app acknowledges a visit by its exact saved time (ms), which the sheet copy rounds to seconds.
// The pay ladder comes from docs 'sys:ranks' (editable data), else the built-in copy of CFG.RANKS.
// op 'growth' {token, name?}  → the page (teacher: own; management: any name)
// op 'check'  {token}         → management only: compare with Google's stored answers for every teacher
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const RANKS0 = [{ name: "Newly Hired", units: 0, rate: 150 }, { name: "Starting Teacher", units: 31, rate: 155 }, { name: "Newly Qualified", units: 101, rate: 160 },
  { name: "Junior Teacher", units: 501, rate: 170 }, { name: "Senior Teacher", units: 901, rate: 180 }, { name: "Master Teacher", units: 2001, rate: 200 }];
const QA_DOMAINS = ["Instructional Effectiveness & Critical Thinking", "Communication", "Learner Engagement & Collaboration", "Adaptability & Creativity", "Professional Practice"];
const QA_STD = ["", "Does Not Meet Standard", "Needs Improvement", "Developing", "Meets Standard", "Exceeds Standard"];
const MON = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MO3 = MON.map((m) => m.slice(0, 3));

// ── Manila time helpers (the sheet copy writes dates as Manila local 'yyyy-MM-ddTHH:mm:ss') ──
const isD = (x: any) => typeof x === "string" && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d$/.test(x);
const ms = (s: string) => Date.parse(s + "+08:00");
const loc = (t: number) => new Date(t + 8 * 3600e3).toISOString().slice(0, 19);   // Manila local string of a time
const p2 = (n: number) => ("0" + n).slice(-2);
const parts = (s: string) => ({ y: +s.slice(0, 4), m: +s.slice(5, 7), d: +s.slice(8, 10), H: s.slice(11, 13), M: s.slice(14, 16) });
const t = (x: any) => String(x == null ? "" : x).trim();
const num = (v: any) => { const n = Number(v); return isFinite(n) ? n : 0; };
const lcOf = (x: any) => String(x == null ? "" : x).trim().toLowerCase();

async function rows(tab: string, filt?: (q: any) => any) {   // all rows of a tab copy, in sheet order: [{r, v}]
  const out: any[] = [];
  for (let from = 0; ; from += 1000) {
    let q = db.from("sheet_rows").select("r,data").eq("tab", tab);
    if (filt) q = filt(q);
    const { data, error } = await q.order("r", { ascending: true }).range(from, from + 999);
    if (error) throw new Error(tab + ": " + error.message);
    (data || []).forEach((x: any) => out.push({ r: x.r, v: Array.isArray(x.data) ? x.data : [] }));
    if (!data || data.length < 1000) break;
  }
  return out;
}
const cell = (v: any[], j: number) => (j < v.length ? v[j] : "");

// table_(name, key): the header row is the first of the top 6 rows holding `key`; rows after it
function table(R: any[], key: string) {
  let h = 0; for (let i = 0; i < Math.min(6, R.length); i++) if (R[i].v.some((x: any) => String(x).trim() === key)) { h = i; break; }
  return R.slice(h + 1).map((x: any) => x.v);
}

// qaAll_
function qaAll(R: any[]) {
  const out = R.filter((x) => x.r >= 2).map((x) => { const r = x.v; while (r.length < 27) r.push(""); return r; }).filter((r) => t(r[2])).map((r) => {
    const sc = [7, 9, 11, 13, 15].map((j) => num(r[j]));
    const doms = QA_DOMAINS.map((n, i) => ({ name: n, score: sc[i], std: QA_STD[sc[i]] || "", comment: t(r[8 + i * 2]) }));
    const ok = sc.filter((x) => x > 0), avg = ok.length ? ok.reduce((a, b) => a + b, 0) / ok.length : 0;
    const per = isD(r[1]) ? MON[parts(r[1]).m - 1] + " " + parts(r[1]).y : t(r[1]);
    return {
      ts: isD(r[0]) ? ms(r[0]) : 0, period: per, teacher: t(r[2]),
      date: isD(r[3]) ? r[3].slice(0, 10) : t(r[3]), obsDate: isD(r[4]) ? r[4].slice(0, 10) : t(r[4]), observed: t(r[5]), evaluator: t(r[6]),
      domains: doms, avg: Math.round(avg * 10) / 10, pct: Math.round(avg / 5 * 100), decision: t(r[17]).split(" — ")[0], decisionFull: t(r[17]),
      cont: t(r[18]), dev: t(r[19]), next: t(r[20]), evidence: t(r[21]), progress: t(r[22]), progressEv: t(r[23]), rec: t(r[24]), direction: t(r[25]), final: t(r[26]),
    };
  }).sort((a, b) => b.ts - a.ts);
  return out;
}

const dtCareer = (x: any) => { if (isD(x)) { const p = parts(x); return MO3[p.m - 1] + " " + p.d + ", " + p.y; } return t(x); };   // 'MMM d, yyyy' or the cell text

// career_(name)
function career(TD: any[], MS: any[], lc: string, RANKS: any[]) {
  const v = TD.map((x) => x.v), hi = v.findIndex((r) => r.indexOf("TOTAL LIFETIME UNITS") > -1); if (hi < 0) return null;
  const ri = v.findIndex((r, i) => i > hi && lcOf(cell(r, 1)) === lc); if (ri < 0) return null;
  const r = v[ri], years: any[] = [];
  v[hi].forEach((h: any, j: number) => { if (/^20\d\d$/.test(t(h)) && t(cell(r, j)) !== "") years.push({ year: +h, units: num(cell(r, j)) }); });
  years.sort((a, b) => a.year - b.year);
  const lifetime = num(cell(r, 2)), rank = t(cell(r, 6)), ix = RANKS.findIndex((x: any) => String(x.name).toLowerCase() === rank.toLowerCase());
  const next = ix > -1 && ix < RANKS.length - 1 ? RANKS[ix + 1] : null;
  let hired = ""; try { const m = MS.map((x) => x.v).find((x, i) => i && lcOf(cell(x, 4)) === lc); if (m) hired = dtCareer(cell(m, 8)); } catch (_e) { /* */ }
  return {
    rank, rate: num(cell(r, 7)), lifetime, deductions: num(cell(r, 3)), rankDate: dtCareer(cell(r, 8)), prevRank: t(cell(r, 11)), prevRate: num(cell(r, 12)), prevDate: dtCareer(cell(r, 13)),
    hired, years, ladder: RANKS, index: ix, next: next ? { name: next.name, rate: next.rate, units: next.units, need: Math.max(0, Math.ceil((next.units - lifetime) * 10) / 10) } : null,
    from: ix > -1 ? RANKS[ix].units : 0,
  };
}

// mgmtActions_ shows display values: a date-time cell reads 'd-MMM-yyyy' (+ ' HH:mm' when it has a time)
const dispWhen = (x: any) => { if (!isD(x)) return t(x); const p = parts(x); return p.d + "-" + MO3[p.m - 1] + "-" + p.y + (p.H + p.M !== "0000" ? " " + p.H + ":" + p.M : ""); };
const disp = (x: any) => x === true ? "TRUE" : x === false ? "FALSE" : isD(x) ? dispWhen(x) : t(x);

function praiseOf(AC: any[], lc: string) {
  const out: any[] = [];
  AC.filter((x) => x.r >= 4 && x.r < 404).map((x) => x.v).filter((r) => disp(cell(r, 1)) || disp(cell(r, 7))).forEach((r) => {
    const a = { subject: disp(cell(r, 1)), when: disp(cell(r, 3)), type: disp(cell(r, 6)), employee: disp(cell(r, 7)), condition: disp(cell(r, 9)), incentive: disp(cell(r, 15)), amount: disp(cell(r, 16)), action: disp(cell(r, 17)) };
    if (lcOf(a.employee) !== lc) return;
    if (num(a.incentive) > 0 || /commend|praise|recogn|bonus|award|incentive|excellen/i.test(a.subject + " " + a.type + " " + a.action))
      out.push({ when: a.when, subject: a.subject, note: a.action || a.condition || "", amount: a.amount });
  });
  return out.slice(0, 12);
}

// attend_(name): last 6 months from T-HISTORY
function attend(TH: any[], lc: string, now: number) {
  const n = parts(loc(now)), m: Record<string, any> = {}, cur = n.y + "-" + p2(n.m);
  for (let k = 5; k >= 0; k--) { const d = new Date(Date.UTC(n.y, n.m - 1 - k, 15)), key = d.getUTCFullYear() + "-" + p2(d.getUTCMonth() + 1);
    m[key] = { m: key, label: MO3[d.getUTCMonth()], s: 0, c: 0, x: 0, u: 0, l: 0, cur: key === cur }; }
  const first = Object.keys(m).sort()[0];
  TH.filter((x: any) => x.r >= 2).map((x: any) => x.v).forEach((r: any) => {   // (header is row 1; the copy is pre-filtered by teacher)
    if (!isD(cell(r, 0)) || lcOf(cell(r, 2)) !== lc) return;
    const k = String(cell(r, 0)).slice(0, 7); if (k < first || !m[k]) return; const a = m[k];
    a.s += num(cell(r, 3)); a.x += num(cell(r, 4)); a.c += num(cell(r, 5)); a.u += num(cell(r, 8)); a.l += num(cell(r, 13));
  });
  return Object.keys(m).sort().map((k) => (m[k].u = Math.round(m[k].u * 10) / 10, m[k]));
}

// smonthlySync_: the newest "Last Synced" of this month's S-MONTHLY rows (not in the future), else today 00:00
function smSync(SM: any[], now: number) {
  const n = parts(loc(now)), mon = MON[n.m - 1] + " " + n.y; let sync = 0;
  SM.filter((x) => x.r >= 2).forEach((x) => { const r = x.v;
    const mm = isD(cell(r, 0)) ? MON[parts(cell(r, 0)).m - 1] + " " + parts(cell(r, 0)).y : t(cell(r, 0)); if (mm !== mon) return;
    let d = 0; const s = cell(r, 8);
    if (isD(s)) d = ms(s); else { const x2 = String(s).match(/(\d{1,2})-([A-Za-z]{3})-(\d{4})\s+(\d{1,2}):(\d{2})/); const mi = x2 ? MO3.indexOf(x2[2]) : -1; if (x2 && mi > -1) d = Date.parse(x2[3] + "-" + p2(mi + 1) + "-" + p2(+x2[1]) + "T" + p2(+x2[4]) + ":" + x2[5] + ":00+08:00"); }
    if (d && d <= now && (!sync || d > sync)) sync = d; });
  if (!sync) sync = ms(loc(now).slice(0, 10) + "T00:00:00");
  return sync;
}

// liveUnits_: classes since the S-MONTHLY sync that already ended (first teacher), cancelled never count
async function liveUnits(lc: string, sync: number, now: number) {
  const d0 = loc(sync).slice(0, 10), d3 = loc(ms(d0 + "T00:00:00") + 3 * 864e5).slice(0, 10);
  const { data } = await db.from("classes").select("starts_at,ends_at,teachers,cancelled,day").gte("day", d0).lte("day", d3).eq("cancelled", false);
  let u = 0, n = 0;
  (data || []).forEach((e: any) => { const tt = lcOf((e.teachers || [])[0]); if (tt !== lc) return;
    const en = Date.parse(e.ends_at), st = Date.parse(e.starts_at); if (ms(String(e.day) + "T00:00:00") > now) return;
    if (en <= sync || en > now) return; u += (en - st) / 6e4 <= 30 ? 0.5 : 1; n++; });
  const sp = parts(loc(sync)), np = parts(loc(now));
  return { units: Math.round(u * 10) / 10, classes: n, sync: sp.d + " " + MO3[sp.m - 1] + " " + sp.H + ":" + sp.M, at: np.H + ":" + np.M };
}

function liveCareer(g: any, L: any, now: number) {
  const cr = g && g.career; if (!cr || cr.lifetime == null) return g;
  const y = parts(loc(now)).y;
  cr.base = cr.lifetime; cr.lifetime = Math.round((cr.lifetime + L.units) * 10) / 10; cr.live = L;
  if (cr.next) cr.next.need = Math.max(0, Math.ceil((cr.next.units - cr.lifetime) * 10) / 10);
  if (L.units && cr.years) { const yy = cr.years.find((x: any) => x.year === y); if (yy) yy.units = Math.round((yy.units + L.units) * 10) / 10; }
  cr.liveNote = "Updated " + L.at + (L.units ? " · includes " + L.units + " unit" + (L.units === 1 ? "" : "s") + " from classes since " + L.sync : "") + " · cancelled classes never count";
  return g;
}

// visitsFor_: class visits (S-MONITOR) in the last 90 days, newest 20
function visits(MO: any[], lc: string, now: number) {
  const since = loc(now - 90 * 864e5).slice(0, 10), out: any[] = [];
  const dm = (s: any) => { if (!isD(s)) return t(s); const p = parts(s); return p.d + " " + MO3[p.m - 1] + " " + p.H + ":" + p.M; };
  MO.filter((x) => x.r >= 2 && x.r <= 1501).forEach((x) => { const r = x.v; const d = isD(cell(r, 1)) ? String(cell(r, 1)).slice(0, 10) : String(cell(r, 1) || "");
    if (lcOf(cell(r, 5)) !== lc || d < since) return;
    out.push({ date: d, time: isD(cell(r, 2)) ? String(cell(r, 2)).slice(11, 16) : String(cell(r, 2) || ""), code: String(cell(r, 3) || ""), student: String(cell(r, 4) || ""),
      checks: String(cell(r, 7) || ""), note: String(cell(r, 8) || ""), by: String(cell(r, 9) || ""), at: isD(cell(r, 0)) ? dm(cell(r, 0)) : "", id: isD(cell(r, 0)) ? String(ms(cell(r, 0))) : "",
      ack: isD(cell(r, 10)) ? dm(cell(r, 10)) : String(cell(r, 10) || ""), reply: String(cell(r, 11) || "") }); });
  return out.slice(0, 20);
}

async function growth(name: string, google: any) {
  const lc = lcOf(name), now = Date.now(), n = parts(loc(now)), ym = n.y + "-" + p2(n.m);
  const pd = new Date(Date.UTC(n.y, n.m - 2, 15)), pym = pd.getUTCFullYear() + "-" + p2(pd.getUTCMonth() + 1);
  const like = (col: string) => (q: any) => q.ilike(col, "%" + name.trim() + "%");
  const [QA, TI, HW, PR, TD, AC, TH, MO, MS, SM, RK] = await Promise.all([
    rows("QA-DATA"), rows("T-TIMEIN", like("data->>1")), rows("S-HOMEWORK", like("data->>2")), rows("PR-DATA"), rows("T-DASH"), rows("ACTIONS"),
    rows("T-HISTORY", like("data->>2")), Promise.resolve([] as any[]), rows("MASTERLIST"), rows("S-MONTHLY", (q: any) => q.like("data->>0", ym + "%")),
    db.from("docs").select("data").eq("key", "sys:ranks").maybeSingle().then((r: any) => r.data && Array.isArray(r.data.data) && r.data.data.length ? r.data.data : RANKS0),
  ]);
  const evals = qaAll(QA).filter((e) => e.teacher.toLowerCase() === lc);
  // the sheet copy keeps whole seconds; Google's answer carries the exact time the app uses to know an evaluation (keep it)
  const gev = (google && Array.isArray(google.evals) ? google.evals : []) as any[];
  evals.forEach((e: any) => { const m = gev.find((x: any) => Math.floor(num(x.ts) / 1000) === Math.floor(e.ts / 1000) && lcOf(x.teacher) === lc); if (m) e.ts = m.ts; });
  const z = () => ({ timeIns: 0, onTime: 0, classIns: 0, classOnTime: 0, homework: 0, feedback: 0 });
  const k: any = Object.assign(z(), { units: null, prev: z(), prevMonth: MON[pd.getUTCMonth()] });
  const bin = (m: string) => m === ym ? k : m === pym ? k.prev : null;
  TI.filter((x) => x.r >= 2 && x.r <= 1501).forEach((x) => { const r = x.v; const b = bin(String(cell(r, 0)).slice(0, 7)); if (!b || lcOf(cell(r, 1)) !== lc) return;
    if (cell(r, 13) === "Class") { b.classIns++; if (cell(r, 6) === "On time") b.classOnTime++; } else if (cell(r, 6) !== "No class today" && cell(r, 6) !== "Rest day") { b.timeIns++; if (cell(r, 6) === "On time") b.onTime++; } });
  HW.filter((x) => x.r >= 2 && x.r <= 3001).forEach((x) => { const r = x.v; const b = isD(cell(r, 0)) && bin(String(cell(r, 0)).slice(0, 7)); if (b && lcOf(cell(r, 2)) === lc) b.homework++; });
  table(PR, "Student code").forEach((r) => { const b = isD(cell(r, 2)) && bin(String(cell(r, 2)).slice(0, 7)); if (b && lcOf(cell(r, 3)) === lc) b.feedback++; });
  table(TD, "TOTAL LIFETIME UNITS").forEach((r) => { if (lcOf(cell(r, 1)) === lc) { k.units = num(cell(r, 18)) + num(cell(r, 19)) + num(cell(r, 20)); k.rank = String(cell(r, 6) || ""); k.lifetime = num(cell(r, 2)); } });
  const praise = praiseOf(AC, lc), gpr = (google && Array.isArray(google.praise) ? google.praise : []) as any[];
  praise.forEach((x: any) => { const m = gpr.find((y: any) => y.subject === x.subject && String(y.when).split(" ")[0] === String(x.when).split(" ")[0]); if (m) x.when = m.when; });   // the sheet's own date display for rows Google has shown
  const g: any = { name, month: MON[n.m - 1] + " " + n.y, evals, kpi: k, praise, career: career(TD, MS, lc, RK), attend: attend(TH, lc, now) };
  try { liveCareer(g, await liveUnits(lc, smSync(SM, now), now), now); } catch (_e) { /* Google's answer keeps working */ }
  // parts that stay on Google's last answer
  g.record = google && google.record !== undefined ? google.record : null;
  g.peer = { titles: (google && google.peer && google.peer.titles) || [], list: (google && google.peer && google.peer.list) || [], visits: (google && google.peer && google.peer.visits) || [] };
  g._src = { db: true, at: new Date(now).toISOString(), google: { peer: "Google Form (last copy)", visits: "Google (last copy; acknowledging needs the exact saved time)", record: "Google (last copy)", at: google ? google.__at || null : null } };
  return g;
}

async function googleCopy(name: string) {
  const { data } = await db.from("docs").select("data,updated_at").eq("key", lcOf(name) + ":tGrowth|[]").maybeSingle();
  if (!data || !data.data) return null; const g = data.data; try { g.__at = data.updated_at; } catch (_e) { /* */ } return g;
}

// field-by-field comparison; parts that depend on the moment of asking are reported separately
function diff(a: any, b: any, path: string, out: string[]) {
  if (out.length > 60) return;
  if (a === b) return;
  if (typeof a !== typeof b || a === null || b === null || typeof a !== "object") { out.push(path + ": db " + JSON.stringify(a)?.slice(0, 80) + " · google " + JSON.stringify(b)?.slice(0, 80)); return; }
  if (Array.isArray(a) !== Array.isArray(b)) { out.push(path + ": shape"); return; }
  if (Array.isArray(a)) { if (a.length !== b.length) out.push(path + ": length db " + a.length + " · google " + b.length); for (let i = 0; i < Math.min(a.length, b.length); i++) diff(a[i], b[i], path + "[" + i + "]", out); return; }
  const ks = new Set([...Object.keys(a), ...Object.keys(b)]); ks.forEach((k) => { if (k === "_src" || k === "__at") return; diff(a[k], b[k], path + "." + k, out); });
}

const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(x: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(x)); return Array.from(new Uint8Array(b)).map((c) => c.toString(16).padStart(2, "0")).join(""); }

Deno.serve(async (req) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  if (b.op === "check" && b.key) {   // the comparison run by the release check: a one-time key kept in docs 'sys:growthcheck'
    const { data: kk } = await db.from("docs").select("data").eq("key", "sys:growthcheck").maybeSingle();
    if (!kk || !kk.data || !kk.data.key || kk.data.key !== String(b.key)) return out({ ok: false, error: "AUTH" }, 401);
    return out(await check());
  }
  const token = String(b.token || "");
  if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: s } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
  try {
    if (b.op === "growth") {
      const name = s.mode === "mgmt" && b.name ? String(b.name) : String(s.name || "");
      if (!name) return out({ ok: false, error: "AUTH" }, 401);
      const { data: flag } = await db.from("docs").select("data").eq("key", "sys:growthdb").maybeSingle();
      if (!(flag && flag.data && flag.data.on) && !b.force) return out({ ok: false, fallback: true });
      const t0 = Date.now(), gc = await googleCopy(name), g = await growth(name, gc);
      return out({ ok: true, data: g, ms: Date.now() - t0 });
    }
    if (b.op === "check") { if (s.mode !== "mgmt") return out({ ok: false, error: "AUTH" }, 403); return out(await check()); }
    return out({ ok: false, error: "unknown op" }, 400);
  } catch (e) { return out({ ok: false, error: "db", why: String((e as Error).message || e) }, 500); }
});

async function check() {
      const { data: ks } = await db.from("docs").select("key").like("key", "%:tGrowth|[]");
      const res: any[] = [];
      for (const r of ks || []) {
        const nm = String(r.key).split(":")[0], gc = await googleCopy(nm); if (!gc) continue;
        const g = await growth(gc.name || nm, gc), d: string[] = [];
        // the moment-of-asking parts: live units (classes since the last sync) and the "Updated HH:mm" note
        const a = JSON.parse(JSON.stringify(g)), c = JSON.parse(JSON.stringify(gc));
        for (const x of [a, c]) if (x.career) { const lu = x.career.live ? num(x.career.live.units) : 0, yy = (x.career.years || []).find((q: any) => q.year === parts(loc(Date.now())).y);
          if (yy && lu) yy.units = Math.round((yy.units - lu) * 10) / 10;
          delete x.career.live; delete x.career.liveNote; if (x.career.base != null) x.career.lifetime = x.career.base; delete x.career.base; if (x.career.next) delete x.career.next.need; }
        diff(a, c, "", d);
        res.push({ teacher: gc.name || nm, google_at: gc.__at, diffs: d });
      }
      return { ok: true, teachers: res.length, same: res.filter((x) => !x.diffs.length).length, res };
}
