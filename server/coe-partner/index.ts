// CupOfEnglish · coe-partner (27 Oct 2026) · partner access (e.g. "Jinan – Dr. Spring"). Read-only for partners; never calls Google
// (partners are in mainland China). Partner sign-in: own username + password (PBKDF2-SHA256), sessions in partner_sessions.
// Partners see ONLY students whose DATABASE / ACTIVE "source" is one of their partner source strings:
//   lessons & package (taught-only counts from coe_pkg_calc), upcoming classes, valid-until, renewal due, CEFR journey (same rule as
//   coe-cj), monthly parent reports that were SENT to parents (reviewed Chinese), attendance; and a Teachers tab: open slots
//   (teacher hours from the management availability copy, minus booked classes, from now + 2 h, 3 weeks), public profile text,
//   books taught, an anonymous student count and the partner's OWN students with that teacher.
// Never: money/remittance, teacher pay/rank/warnings/notes/homework, other families' names, phone/WeChat/addresses.
// Management (app_sessions mode mgmt): op pList / pSave / pActive.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
import { PROF } from "./prof.ts";
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
const c = (r: any[], j: number) => (Array.isArray(r) && r[j] != null ? r[j] : "");
const MON3: Record<string, string> = { jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06", jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12" };
function ymd(v: any): string { const t = String(v ?? "").trim(); let m = t.match(/^(\d{4}-\d{2}-\d{2})/); if (m) return m[1];
  m = t.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/); if (m && MON3[m[2].toLowerCase()]) return m[3] + "-" + MON3[m[2].toLowerCase()] + "-" + m[1].padStart(2, "0"); return ""; }
// ── CEFR: the same rule as coe-cj / the app's journey (1221) ──
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
// PostgREST answers at most 1000 rows per request: read in pages
async function pages(mk: () => any, max = 30000) { const out: any[] = []; for (let f = 0; f < max; f += 1000) { const { data, error } = await mk().range(f, f + 999); if (error || !data) break; out.push(...data); if (data.length < 1000) break; } return out; }
async function rows(tab: string, col?: number, val?: string) {
  let q = db.from("sheet_rows").select("data").eq("tab", tab);
  if (col != null && val) q = q.filter("data->>" + col, "eq", val);
  if (col != null && val) { const { data } = await q.limit(1000); return (data || []).map((x: any) => x.data || []); }
  return (await pages(() => db.from("sheet_rows").select("data").eq("tab", tab).order("r"))).map((x: any) => x.data || []);
}
// ── the partner's students ──
async function partnerSet(sources: string[]) {
  const S = new Set(sources.map(norm).filter(Boolean)); const out: Record<string, { code: string; name: string; cn: string }> = {};
  if (!S.size) return out;
  const [DB, { data: PK }] = await Promise.all([rows("DATABASE"), pages(() => db.from("coe_packages").select("code,name,cn,source").is("removed_at", null).order("code")).then((d) => ({ data: d }))]);
  DB.forEach((r: any[]) => { const k = norm(c(r, 0)).toUpperCase(); if (!/^ST-\d{4}-\d{3}$/.test(k) || !S.has(norm(c(r, 22)))) return;
    out[k] = out[k] || { code: k, name: norm(c(r, 2)), cn: norm(c(r, 1)) }; });
  (PK || []).forEach((p: any) => { const k = norm(p.code).toUpperCase(); if (!/^ST-\d{4}-\d{3}$/.test(k) || !S.has(norm(p.source))) return;
    out[k] = out[k] || { code: k, name: norm(p.name), cn: norm(p.cn) }; });
  // names from DATABASE when a code came from ACTIVE only
  DB.forEach((r: any[]) => { const k = norm(c(r, 0)).toUpperCase(); const o = out[k]; if (o && !o.name) { o.name = norm(c(r, 2)); o.cn = o.cn || norm(c(r, 1)); } });
  return out;
}
async function packagesOf(codes: string[]) {
  if (!codes.length) return {} as Record<string, any[]>;
  const { data: P } = await db.from("coe_packages").select("id,code,active,removed_at").in("code", codes).is("removed_at", null).eq("active", true).limit(3000);
  const ids = (P || []).map((p: any) => p.id); const out: Record<string, any[]> = {};
  if (!ids.length) return out;
  const { data: C } = await db.from("coe_pkg_calc").select("id,code,buy,fin,avail,deadline").in("id", ids).limit(3000);
  (C || []).forEach((x: any) => { const used = Math.max(0, Number(x.fin) || 0), left = Number(x.avail) || 0;
    (out[x.code] = out[x.code] || []).push({ total: used + left, used, left, buy: x.buy || "", valid: x.deadline || "", renew: left <= 4 }); });
  return out;
}
const isTrial = (t: string) => /trial|试听|\bTC\b/i.test(t);
const isSub = (t: string) => /\bSUB\b|\bSC\b|代课/i.test(t);
const mnl = (iso: string) => { const d = new Date(Date.parse(iso) + 8 * 3600e3).toISOString(); return { day: d.slice(0, 10), time: d.slice(11, 16) }; };
const prevMonth = (m: string) => { const x = String(m || "").match(/^(\d{4})-(\d{2})$/); if (!x) return m; let y = +x[1], mo = +x[2] - 1; if (mo < 1) { mo = 12; y--; } return y + "-" + String(mo).padStart(2, "0"); };
Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const op = String(b.op || "");
  const ip = String(req.headers.get("x-forwarded-for") || "").split(",")[0].trim().slice(0, 60);

  // ───────── management: create / reset / deactivate partner logins ─────────
  if (/^p(List|Save|Active)$/.test(op)) {
    const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
    const { data: s } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
    if (!s || new Date(s.exp).getTime() < Date.now() || s.mode !== "mgmt") return out({ ok: false, error: "AUTH" }, 401);
    if (op === "pList") {
      const [{ data: A }, DB, { data: PK }] = await Promise.all([
        db.from("partner_accounts").select("id,username,display_name,sources,active,created_at,created_by,last_login,pw_set_at").order("created_at"),
        rows("DATABASE"), pages(() => db.from("coe_packages").select("code,source,active").is("removed_at", null).order("code")).then((d) => ({ data: d }))]);
      const src: Record<string, { codes: Set<string>; act: Set<string> }> = {};
      const add = (sv: string, code: string, act: boolean) => { const k = norm(sv); if (!k || /^ST-\d{4}-\d{3}/i.test(k) || /^\d{4}-\d{2}-\d{2}/.test(k) || /^(N\/A|None|#REF!)$/i.test(k)) return;
        const o = src[k] = src[k] || { codes: new Set(), act: new Set() }; o.codes.add(code); if (act) o.act.add(code); };
      DB.forEach((r: any[]) => { const k = norm(c(r, 0)).toUpperCase(); if (/^ST-\d{4}-\d{3}$/.test(k)) add(c(r, 22), k, false); });
      (PK || []).forEach((p: any) => add(p.source, norm(p.code).toUpperCase(), !!p.active));
      const list = Object.keys(src).map((k) => ({ source: k, students: src[k].codes.size, active: src[k].act.size, partnerLike: /\s[–-]\s/.test(k) && !/^COE\b/i.test(k) }))
        .sort((a, b) => (+b.partnerLike - +a.partnerLike) || b.students - a.students);
      return out({ ok: true, accounts: A || [], sources: list });
    }
    if (op === "pSave") {
      const username = norm(b.username).toLowerCase(), display = norm(b.display).slice(0, 80), sources = (Array.isArray(b.sources) ? b.sources : []).map(norm).filter(Boolean).slice(0, 10);
      const pw = String(b.password || "");
      if (!/^[a-z0-9][a-z0-9._-]{2,39}$/.test(username)) return out({ ok: false, msg: "Username: 3–40 letters, numbers, . _ - (e.g. jinanpartner)" });
      if (!sources.length) return out({ ok: false, msg: "Choose at least one partner source" });
      if (pw && pw.length < 8) return out({ ok: false, msg: "Password: at least 8 characters" });
      const row: any = { username, display_name: display || username, sources, updated_at: new Date().toISOString(), updated_by: s.name };
      if (pw) { const salt = rnd(16); row.pw_salt = salt; row.pw_iter = 120000; row.pw_hash = await pbkdf2(pw, salt, 120000); row.pw_set_at = row.updated_at; }
      if (b.id) {
        const { error } = await db.from("partner_accounts").update(row).eq("id", String(b.id)); if (error) return out({ ok: false, msg: /duplicate/i.test(error.message) ? "That username is taken" : "Not saved" });
        if (pw) await db.from("partner_sessions").delete().eq("partner_id", String(b.id));   // a new password signs the partner out everywhere
        return out({ ok: true });
      }
      if (!pw) return out({ ok: false, msg: "Set a password for the new login" });
      row.created_by = s.name;
      const { error } = await db.from("partner_accounts").insert(row); if (error) return out({ ok: false, msg: /duplicate/i.test(error.message) ? "That username is taken" : "Not saved" });
      return out({ ok: true });
    }
    // pActive
    const { error } = await db.from("partner_accounts").update({ active: !!b.active, updated_at: new Date().toISOString(), updated_by: s.name }).eq("id", String(b.id || ""));
    if (!b.active) await db.from("partner_sessions").delete().eq("partner_id", String(b.id || ""));
    return out({ ok: !error });
  }

  // ───────── partner sign-in ─────────
  if (op === "login") {
    const username = norm(b.username).toLowerCase().slice(0, 40), pw = String(b.password || "").slice(0, 200);
    const since = new Date(Date.now() - 15 * 6e4).toISOString();
    const [{ count: fu }, { count: fi }] = await Promise.all([
      db.from("partner_login_attempts").select("id", { count: "exact", head: true }).eq("username", username).eq("ok", false).gte("at", since),
      db.from("partner_login_attempts").select("id", { count: "exact", head: true }).eq("ip", ip).eq("ok", false).gte("at", since)]);
    if ((fu || 0) >= 8 || (ip && (fi || 0) >= 30)) return out({ ok: false, msg: "尝试次数过多，请15分钟后再试 · Too many attempts, try again in 15 minutes" }, 429);
    const { data: a } = await db.from("partner_accounts").select("id,display_name,pw_hash,pw_salt,pw_iter,active").eq("username", username).maybeSingle();
    let ok = false;
    if (a && a.active && a.pw_hash && a.pw_salt) ok = eqT(await pbkdf2(pw, a.pw_salt, a.pw_iter || 120000), a.pw_hash);
    else await pbkdf2(pw, "x", 120000);   // same time either way
    await db.from("partner_login_attempts").insert({ username, ip, ok });
    if (!ok) return out({ ok: false, msg: "用户名或密码不正确 · Wrong username or password" }, 401);
    const token = rnd(32);
    await db.from("partner_sessions").insert({ token_hash: await sha(token), partner_id: a!.id, exp: new Date(Date.now() + 30 * 864e5).toISOString(), ua: String(req.headers.get("user-agent") || "").slice(0, 160) });
    await db.from("partner_accounts").update({ last_login: new Date().toISOString() }).eq("id", a!.id);
    return out({ ok: true, token, name: a!.display_name });
  }

  // ───────── partner reads ─────────
  const token = String(b.token || ""); if (token.length < 32) return out({ ok: false, error: "AUTH" }, 401);
  const th = await sha(token);
  const { data: ss } = await db.from("partner_sessions").select("partner_id,exp").eq("token_hash", th).maybeSingle();
  if (!ss || new Date(ss.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
  if (op === "logout") { await db.from("partner_sessions").delete().eq("token_hash", th); return out({ ok: true }); }
  const { data: acc } = await db.from("partner_accounts").select("id,display_name,sources,active").eq("id", ss.partner_id).maybeSingle();
  if (!acc || !acc.active) return out({ ok: false, error: "AUTH" }, 401);
  const PS = await partnerSet(acc.sources || []), codes = Object.keys(PS);
  const nowIso = new Date().toISOString();

  if (op === "list") {
    const [PK, { data: UP }, TR, PR, DB] = await Promise.all([packagesOf(codes),
      codes.length ? pages(() => db.from("classes").select("code,starts_at").in("code", codes).gte("starts_at", nowIso).lte("starts_at", new Date(Date.now() + 21 * 864e5).toISOString()).eq("cancelled", false).not("id", "like", "pend-%").order("starts_at")).then((d) => ({ data: d })) : Promise.resolve({ data: [] as any[] }),
      rows("TR-DATA"), rows("PR-DATA"), rows("DATABASE")]);
    const R: Record<string, any[][]> = {}, T: Record<string, any[]> = {}, P: Record<string, any[]> = {}, next: Record<string, string> = {};
    DB.forEach((r: any[]) => { const k = norm(c(r, 0)).toUpperCase(); if (PS[k]) (R[k] = R[k] || []).push(r); });
    TR.forEach((r: any[]) => { const k = norm(c(r, 33)).toUpperCase(); if (PS[k]) (T[k] = T[k] || []).push(trOf(r)); });
    PR.forEach((r: any[]) => { const k = norm(c(r, 4)).toUpperCase(); if (PS[k]) (P[k] = P[k] || []).push(prOf(r)); });
    ((UP as any[]) || []).forEach((x: any) => { if (!next[x.code]) next[x.code] = x.starts_at; });
    const students = codes.map((k) => { const pk = PK[k] || [], sum = pk.reduce((a: any, p: any) => ({ total: a.total + p.total, used: a.used + p.used, left: a.left + p.left }), { total: 0, used: 0, left: 0 });
      const valid = pk.map((p: any) => p.valid).filter(Boolean).sort().pop() || "";
      return { code: k, name: PS[k].name, cn: PS[k].cn, level: R[k] ? nowOf(R[k], T[k] || [], P[k] || []) : "", active: pk.length > 0,
        pk: pk.length ? { ...sum, valid, renew: pk.some((p: any) => p.renew) } : null, next: next[k] ? mnl(next[k]) : null }; })
      .sort((a, b) => (+b.active - +a.active) || String(a.name).localeCompare(String(b.name)));
    return out({ ok: true, partner: { name: acc.display_name }, students, at: nowIso });
  }

  if (op === "student") {
    const code = norm(b.code).toUpperCase(); if (!PS[code]) return out({ ok: false, error: "not your student" }, 403);
    const since = new Date(Date.now() - 120 * 864e5).toISOString();
    const [PK, { data: UP }, { data: PAST }, R, TRr, PRr, { data: RL }, { data: FB }, { data: TT }] = await Promise.all([
      packagesOf([code]),
      db.from("classes").select("starts_at,ends_at,data").eq("code", code).gte("starts_at", nowIso).eq("cancelled", false).not("id", "like", "pend-%").order("starts_at").limit(12),
      db.from("classes").select("starts_at,ends_at,cancelled,data").eq("code", code).lt("starts_at", nowIso).gte("starts_at", since).not("id", "like", "pend-%").order("starts_at", { ascending: false }).limit(60),
      rows("DATABASE", 0, code), rows("TR-DATA", 33, code), rows("PR-DATA", 4, code),
      db.from("docs").select("key,data").like("key", "mgmt:mgmtReports|%").limit(40),
      db.from("docs").select("v:data->" + code).eq("key", "sys:fb").maybeSingle(),
      db.from("coe_book_titles").select("code,title").limit(500)]);
    const BT: Record<string, string> = {}; (TT || []).forEach((x: any) => { BT[String(x.code).toLowerCase()] = x.title; });
    const book = (x: string) => BT[String(x || "").toLowerCase()] || String(x || "").replace(/([a-z])([A-Z0-9])/g, "$1 $2");
    const T = TRr.map(trOf), P = PRr.map(prOf), m = R.length ? merge(R) : null;
    const journey = m ? { start: { date: m.first || m.td, level: CJ_L[lv(m.tc)] || "", book: book(m.tb) }, path: m.cb.split(/→|->/).map((x) => x.trim()).filter(Boolean), now: nowOf(R, T, P),
      checks: P.filter((p) => p.date && lv(p.cefr) >= 0).map((p) => ({ date: p.date, level: CJ_L[lv(p.cefr)] })).sort((a, b) => a.date.localeCompare(b.date)) } : null;
    // reports SENT to the parents (management marked "Sent"), newest first; Chinese = reviewed copy when there is one
    const sent: Record<string, any> = {};
    (RL || []).forEach((d: any) => ((d.data && d.data.rows) || []).forEach((r: any) => { if (norm(r.code).toUpperCase() === code && /^sent/i.test(String(r.status || ""))) sent[String(r.teacher).toLowerCase() + "|" + r.month] = r; }));
    const fbs: any[] = Array.isArray(FB && (FB as any).v) ? (FB as any).v : [];
    const keys = Object.keys(sent);
    const cnOver: Record<string, any> = {};
    if (keys.length) { const { data: CN } = await db.from("docs").select("key,data").in("key", [...new Set(keys.map((k) => "fbcn:" + code + "|" + k.split("|")[1]))]); (CN || []).forEach((x: any) => { cnOver[x.key.split("|")[1]] = x.data; }); }
    const reports = keys.map((k) => { const [t, mo] = k.split("|"), e = fbs.filter((f) => String(f.teacher || "").toLowerCase() === t && f.month === mo).pop(); if (!e) return null;
      const cn = Object.assign({}, e.cn || {}, cnOver[mo] || {});
      return { month: mo, classMonth: prevMonth(mo), teacher: String(e.teacher || sent[k].teacher || ""), total: Number(e.total) || 0, l: e.l, r: e.r, s: e.s, w: e.w, course: book(e.course || ""),
        cn: { strengths: cn.strengths || "", areas: cn.areas || "", next: cn.next || "" }, en: { strengths: e.strengths || "", areas: e.areas || "", next: e.next || "" } }; })
      .filter(Boolean).sort((a: any, b: any) => b.month.localeCompare(a.month));
    const cls = (x: any) => { const t = String((x.data && x.data.title) || ""); const a = mnl(x.starts_at); return { day: a.day, time: a.time, mins: Math.round((Date.parse(x.ends_at || x.data?.end || x.starts_at) - Date.parse(x.starts_at)) / 6e4) || 25, book: book((x.data && x.data.book) || ""), kind: isTrial(t) ? "trial" : isSub(t) ? "sub" : "class" }; };
    const past = ((PAST as any[]) || []).map((x: any) => ({ ...cls(x), status: x.cancelled ? "cancelled" : "done" }));
    return out({ ok: true, student: { code, name: PS[code].name, cn: PS[code].cn }, packages: PK[code] || [], upcoming: ((UP as any[]) || []).map(cls), attendance: past, journey, reports });
  }

  if (op === "teachers") {
    const to = new Date(Date.now() + 21 * 864e5).toISOString(), back = new Date(Date.now() - 30 * 864e5).toISOString();
    const [{ data: AV }, { data: CL }, { data: TT }] = await Promise.all([
      db.from("docs").select("key,updated_at,data").like("key", "mgmt:mgmtAvailAll|%").order("updated_at", { ascending: false }).limit(30),
      pages(() => db.from("classes").select("code,starts_at,ends_at,teachers,data").gte("starts_at", back).lte("starts_at", to).eq("cancelled", false).not("id", "like", "pend-%").order("starts_at")).then((d) => ({ data: d })),
      db.from("coe_book_titles").select("code,title").limit(500)]);
    const BT: Record<string, string> = {}; (TT || []).forEach((x: any) => { BT[String(x.code).toLowerCase()] = x.title; });
    const book = (x: string) => BT[String(x || "").toLowerCase()] || String(x || "").replace(/([a-z])([A-Z0-9])/g, "$1 $2");
    const hours: Record<string, { name: string; days: string[]; at: number }> = {};
    (AV || []).forEach((d: any) => ((d.data && d.data.teachers) || []).forEach((t: any) => { const k = String(t.name || "").toLowerCase(); if (!k) return;
      const at = Number(t.at) || Date.parse(d.updated_at) || 0; if (!hours[k] || at > hours[k].at) hours[k] = { name: String(t.name), days: (t.days || []).slice(0, 7), at }; }));
    const now = Date.now(), soon = now + 2 * 3600e3, busy: Record<string, [number, number][]> = {}, stu: Record<string, Set<string>> = {}, mine: Record<string, Set<string>> = {}, books: Record<string, Record<string, number>> = {};
    ((CL as any[]) || []).forEach((x: any) => { const k = String((x.teachers || [])[0] || "").toLowerCase(); if (!k) return; const s = Date.parse(x.starts_at), e = Date.parse(x.ends_at || x.data?.end || x.starts_at) || s + 25 * 6e4;
      if (s >= now - 3600e3) (busy[k] = busy[k] || []).push([s, e]);
      const code = norm(x.code).toUpperCase(); if (/^ST-/.test(code)) { (stu[k] = stu[k] || new Set()).add(code); if (PS[code]) (mine[k] = mine[k] || new Set()).add(code); }
      const bk = String((x.data && x.data.book) || ""); if (bk && !/^(REF|Freetalk|Trial)$/i.test(bk)) { const o = books[k] = books[k] || {}; o[bk] = (o[bk] || 0) + 1; } });
    const LEN = 25, today = new Date(now + 8 * 3600e3).toISOString().slice(0, 10);
    const dayAt = (d: string, n: number) => new Date(Date.parse(d + "T12:00:00+08:00") + n * 864e5 + 8 * 3600e3).toISOString().slice(0, 10);
    const teachers = Object.keys(hours).map((k) => { const H = hours[k], B = busy[k] || [], days: any[] = [];
      for (let n = 0; n < 21; n++) { const d = dayAt(today, n), w = (new Date(Date.parse(d + "T12:00:00+08:00") + 8 * 3600e3).getUTCDay() + 6) % 7, spec = String(H.days[w] || "").trim(), slots: string[] = [];
        if (spec && spec !== "full") spec.split(",").map((x) => x.trim()).filter(Boolean).forEach((x) => { const p = x.split("-"); if (p.length !== 2) return;
          const s0 = Date.parse(d + "T" + p[0].trim().padStart(5, "0") + ":00+08:00"), e0 = Date.parse(d + "T" + p[1].trim().padStart(5, "0") + ":00+08:00"); if (isNaN(s0) || isNaN(e0)) return;
          for (let t = s0; t + LEN * 6e4 <= e0; t += 30 * 6e4) { const te = t + LEN * 6e4; if (t >= soon && !B.some((y) => y[0] < te && y[1] > t)) slots.push(new Date(t + 8 * 3600e3).toISOString().slice(11, 16)); } });
        days.push({ date: d, w, slots: [...new Set(slots)].sort(), full: spec === "full" }); }
      const pf = PROF[k] || null, bk = Object.entries(books[k] || {}).sort((a, b) => b[1] - a[1]).slice(0, 8).map((x) => book(x[0]));
      return { name: H.name, sub: pf ? pf.sub : "", creds: pf ? pf.creds : "", skills: pf ? pf.skills : "", style: pf ? pf.style : "", books: bk,
        students: (stu[k] || new Set()).size, mine: [...(mine[k] || new Set())].map((cd) => ({ code: cd, name: PS[cd].name, cn: PS[cd].cn })), days,
        open: days.reduce((a, x) => a + x.slots.length, 0) }; })
      .filter((t) => t.open > 0 || t.mine.length || t.sub).sort((a, b) => (b.mine.length - a.mine.length) || (b.open - a.open));
    return out({ ok: true, teachers, from: today, tz: "Asia/Shanghai (UTC+8)" });
  }
  return out({ ok: false, error: "unknown op" }, 400);
});
