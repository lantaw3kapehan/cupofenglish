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
// 27 Oct (privacy fix, Misty 14:35): membership comes ONLY from the student record — every DATABASE row for the code must carry one
// of the partner's sources. Match is tolerant only to dash / space variants and a leading "Partner – " (e.g. "Jinan – Dr. Spring" =
// "Partner – Jinan – Dr. Spring" = "Jinan - Dr. Spring"). If an ACTIVE package (coe_packages) carries a different source, or DATABASE
// rows disagree, or the code is only in ACTIVE, the student is EXCLUDED and reported as a conflict. No records are changed.
const canon = (x: unknown) => norm(x).replace(/[–—]/g, "-").replace(/\s*-\s*/g, " - ").toLowerCase().replace(/^partner - /, "");
async function partnerScan(sources: string[]) {
  const S = new Set(sources.map(canon).filter(Boolean)); const out: Record<string, { code: string; name: string; cn: string }> = {}, conflicts: any[] = [];
  if (!S.size) return { PS: out, conflicts, overrides: [] as any[] };
  const [DB, PK] = await Promise.all([rows("DATABASE"), pages(() => db.from("coe_packages").select("code,name,cn,source").is("removed_at", null).order("code"))]);
  const dbs: Record<string, { srcs: Set<string>; raw: Set<string>; name: string; cn: string }> = {};
  DB.forEach((r: any[]) => { const k = norm(c(r, 0)).toUpperCase(); if (!/^ST-\d{4}-\d{3}$/.test(k)) return; const o = dbs[k] = dbs[k] || { srcs: new Set(), raw: new Set(), name: "", cn: "" };
    const sv = norm(c(r, 22)); if (sv) { o.srcs.add(canon(sv)); o.raw.add(sv); } o.name = o.name || norm(c(r, 2)); o.cn = o.cn || norm(c(r, 1)); });
  const pks: Record<string, { srcs: Set<string>; raw: Set<string>; name: string; cn: string }> = {};
  (PK || []).forEach((p: any) => { const k = norm(p.code).toUpperCase(); if (!/^ST-\d{4}-\d{3}$/.test(k)) return; const o = pks[k] = pks[k] || { srcs: new Set(), raw: new Set(), name: norm(p.name), cn: norm(p.cn) };
    const sv = norm(p.source); if (sv) { o.srcs.add(canon(sv)); o.raw.add(sv); } });
  const codes = new Set([...Object.keys(dbs), ...Object.keys(pks)]);
  codes.forEach((k) => { const d = dbs[k], p = pks[k], dIn = !!d && [...d.srcs].some((x) => S.has(x)), pIn = !!p && [...p.srcs].some((x) => S.has(x));
    if (!dIn && !pIn) return;
    const dOk = !!d && d.srcs.size > 0 && [...d.srcs].every((x) => S.has(x)), pOk = !p || [...p.srcs].every((x) => S.has(x));
    if (dOk && pOk) { out[k] = { code: k, name: d!.name || (p ? p.name : ""), cn: d!.cn || (p ? p.cn : "") }; return; }
    conflicts.push({ code: k, name: (d && d.name) || (p && p.name) || "", cn: (d && d.cn) || (p && p.cn) || "", database: d ? [...d.raw].join(" | ") || "(empty)" : "(no DATABASE row)", active: p ? [...p.raw].join(" | ") || "(empty)" : "(no package)" }); });
  // Misty 15:00 · per-partner manual list, applied AFTER the source rule: "Always include" / "Always exclude" (partner_overrides).
  const { data: OV } = await db.from("partner_overrides").select("partner,code,mode,note,marked_by,marked_at");
  const ov = ((OV || []) as any[]).filter((o) => S.has(canon(o.partner)));
  ov.filter((o) => o.mode === "include").forEach((o) => { const k = norm(o.code).toUpperCase(), d = dbs[k], p = pks[k]; if (!d && !p) return;
    out[k] = { code: k, name: (d && d.name) || (p && p.name) || "", cn: (d && d.cn) || (p && p.cn) || "" }; });
  ov.filter((o) => o.mode === "exclude").forEach((o) => { delete out[norm(o.code).toUpperCase()]; });
  conflicts.forEach((x) => { const o = ov.find((y) => norm(y.code).toUpperCase() === x.code); if (o) x.resolved = o.mode; });
  return { PS: out, conflicts, overrides: ov };
}
async function partnerSet(sources: string[]) { return (await partnerScan(sources)).PS; }
// 27 Oct · lessons = the ONE shared SQL definition (coe_portal_pkgs: management's Lesson summary, also used by the student portal).
// No ACTIVE row → null → the page shows "核对中 · Being checked" (never a guess). Shared packages: the family's package numbers.
async function lessonsOf(codes: string[]) {
  const out: Record<string, any> = {}; if (!codes.length) return out;
  for (let i = 0; i < codes.length; i += 400) { const { data, error } = await db.rpc("coe_portal_pkgs", { p_codes: codes.slice(i, i + 400) }); if (error) { console.error("coe_portal_pkgs", error.message); break; }
    (data || []).forEach((x: any) => { const p = x.pkg; out[x.code] = p ? { total: Number(p.total) || 0, used: Number(p.used) || 0, left: Number(p.left) || 0, over: Number(p.over) || 0, valid: p.valid || "", start: p.start || "",
      active: !!p.active, shared: !!p.shared, renew: !!p.active && (Number(p.left) || 0) <= 4 } : null; }); }
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
// ── 1343 · payments at the partner price (amounts only: never the normal price, margin, RMB paid or remittance status) ──
// Source of truth: the SALES copy (sheet_rows tab SALES · every payment row since Jan 2023, with lesson package, free lessons and the
// PARTNERSHIP label). A login's rows = SALES rows whose label is in partner_accounts.sales_labels. Logins without labels fall back to the
// ACTIVE copy (coe_packages: current packages of their students only). Rates: partner_rates for the login's sources; no rate → null ("—").
const lbl = (x: unknown) => norm(x).replace(/[–—]/g, "-").toLowerCase();
const PKG: Record<number, [number, number]> = { 15: [15, 0], 33: [30, 3], 68: [60, 8] };
function ageAt(r: any[], date: string): number | null { const b = ymd(c(r, 5)); if (b && date) { let a = +date.slice(0, 4) - +b.slice(0, 4); if (date.slice(5) < b.slice(5)) a--; return a >= 0 && a < 100 ? a : null; }
  const n = Number(c(r, 6)); return n > 0 && n < 100 ? n : null; }
function whoOf(inv: string): string[] { const t = String(inv || "").replace(/\.(pdf|png|jpe?g)$/i, "").replace(/^.*_/, "").replace(/^(students?)\s+/i, "").replace(/[.\s]+$/, "").trim();
  return t ? t.split(/\s*[&,+、和]\s*/).map((x) => x.trim()).filter(Boolean) : []; }
// program from the SALES PARTNERSHIP label: Adult / IELTS / TOEFL / PET / KET / Reading Program; a plain partner label = young learners
const progOf = (L: string) => /adult/.test(L) ? "adult" : /ielts/.test(L) ? "ielts" : /toefl/.test(L) ? "toefl" : /\bpet\b/.test(L) ? "pet" : /\bket\b/.test(L) ? "ket" : /reading/.test(L) ? "reading" : "yl";
const cap = (x: string) => x.replace(/\b[a-z]/g, (m) => m.toUpperCase());
async function payFor(acc: any, PS: Record<string, { code: string; name: string; cn: string }>, withWhy = false) {
  const labels = new Set(((acc.sales_labels || []) as string[]).map(lbl).filter(Boolean));
  const [{ data: RT }, DB, { data: DC0 }, { data: DP }] = await Promise.all([db.from("partner_rates").select("source,program,learner,lessons,amount,valid_from,confirmed").in("source", (acc.sources || []).length ? acc.sources : ["-"]), rows("DATABASE"),
    db.from("partner_discounts").select("source,per_lesson,valid_from").in("source", (acc.sources || []).length ? acc.sources : ["-"]),
    db.from("partner_program_discounts").select("source,program,per_lesson,valid_from").in("source", (acc.sources || []).length ? acc.sources : ["-"])]);
  const DC = [...(DC0 || []), ...(DP || [])];
  // Misty 15:28 · partner earnings per PAID lesson (free / bonus lessons earn nothing); the latest valid_from on or before the sale date
  // Misty 16:05 · earnings per paid lesson can differ by program (Dr. Spring: IELTS ¥30, everything else ¥20): a program row
  // (partner_program_discounts) wins over the all-programs row (partner_discounts)
  const disc = (date: string, program = "") => { const L = DC.filter((x: any) => (!x.program || x.program === program) && (!x.valid_from || !date || x.valid_from <= date))
      .sort((a: any, b: any) => (+!!b.program - +!!a.program) || String(b.valid_from || "").localeCompare(String(a.valid_from || ""))); return L.length ? Number(L[0].per_lesson) : null; };
  const age: Record<string, any[]> = {}; DB.forEach((r: any[]) => { const k = norm(c(r, 0)).toUpperCase(); if (PS[k]) age[k] = r; });
  // Misty 15:30 · rates per program × package size; only CONFIRMED rates are used (derived ones wait for Misty → "—")
  const rateRow = (program: string, lessons: number, date: string, conf: boolean) => (RT || []).filter((x: any) => (x.program || (x.learner === "adult" ? "adult" : "yl")) === program && +x.lessons === lessons && (!conf || x.confirmed !== false) && (!x.valid_from || !date || x.valid_from <= date))
      .sort((a: any, b: any) => (+(b.confirmed !== false) - +(a.confirmed !== false)) || String(b.valid_from || "").localeCompare(String(a.valid_from || "")))[0];
  const rate = (program: string, lessons: number, date: string) => { const x = rateRow(program, lessons, date, true); return x ? Number(x.amount) : null; };
  // names on invoices: English name, or the pinyin / Chinese name, spaces ignored ("GaoSongbo" = "Gao Songbo"; "Irene.pdf" = "Irene")
  const nk = (x: string) => String(x || "").toLowerCase().replace(/\.(pdf|png|jpe?g)$/g, "").replace(/[\s.]+/g, "");
  const byName: Record<string, string[]> = {}; Object.values(PS).forEach((p) => { [p.name, p.cn].map(nk).filter(Boolean).forEach((k) => { const L = byName[k] = byName[k] || []; if (!L.includes(p.code)) L.push(p.code); }); });
  const out: any[] = [], unclear: any[] = [], dropped: any[] = []; let src = "SALES";
  if (labels.size) {
    const [SA, { data: LK }] = await Promise.all([pages(() => db.from("sheet_rows").select("r,data").eq("tab", "SALES").gte("r", 3).order("r")), db.from("docs").select("data").eq("key", "sys:pkglink").maybeSingle()]);
    const link: Record<number, string> = {}; (((LK as any)?.data?.act) || []).forEach((a: any) => { if (+a.link > 0 && PS[norm(a.c).toUpperCase()]) link[+a.link] = norm(a.c).toUpperCase(); });
    const one = async (x: any) => { const r = x.data || [], L = lbl(c(r, 4)), date = ymd(c(r, 0)); if (!labels.has(L) || !date) return;
      const pkg = Number(c(r, 2)) || 0, free = Number(c(r, 3)) || 0; if (!pkg && !free) return;
      const names = whoOf(String(c(r, 1))).map((n) => { const cs = byName[nk(n)] || []; return { name: cap(n.replace(/\.(pdf|png|jpe?g)$/i, "")), code: cs.length === 1 ? cs[0] : "" }; });
      if (link[x.r]) { const lc = link[x.r], i = names.findIndex((n) => n.name.toLowerCase() === PS[lc].name.toLowerCase()); if (i >= 0) names[i].code = lc; else if (names.length <= 1) names.splice(0, 1, { name: PS[lc].name, code: lc }); }
      // Misty 15:35 · a SALES label alone never qualifies: the row must name at least one of this partner's own students
      // (same membership as the student list: DATABASE + ACTIVE agree, plus Always include, minus Always exclude)
      if (!names.some((n) => n.code || (byName[nk(n.name)] || []).length > 0)) { if (withWhy) dropped.push({ date, invoice: String(c(r, 1)), lessons: pkg, label: norm(c(r, 4)), sheetRow: x.r }); return; }
      let program = progOf(L), learner = program === "adult" ? "adult" : program === "yl" ? "young" : program;
      const ages = names.filter((n) => n.code && age[n.code]).map((n) => ageAt(age[n.code], date)).filter((a) => a != null) as number[];
      if (program === "yl" && ages.some((a) => a >= 18)) { program = "unclear"; learner = "unclear"; }
      if (program === "adult" && ages.length && ages.every((a) => a < 18)) { program = "unclear"; learner = "unclear"; }
      const amount = program !== "unclear" && program !== "other" ? (pkg ? rate(program, pkg, date) : 0) : null;
      const mineName = (n: any) => n.code || (byName[nk(n.name)] || []).length > 0;   // only names of this partner's own students
      const row: any = { date, names: names.map((n) => mineName(n) ? { name: n.code ? PS[n.code].name : n.name, cn: n.code ? PS[n.code].cn : "", code: n.code } : { name: "", cn: "", code: "", hidden: true }), lessons: pkg, free, learner, program, amount,
        why: amount != null ? "" : program === "unclear" ? "unclear" : program === "other" ? "program" : "norate" };
      if (withWhy) { const d = pkg ? rateRow(program, pkg, date, false) : null; row.derived = d && d.confirmed === false ? Number(d.amount) : null; row.rmb = c(r, 6) === "" ? null : Number(c(r, 6)); row.label = norm(c(r, 4)); }
      row.ref = "SALES:" + (await sha([0, 1, 2, 3, 4].map((j) => r[j] == null ? "" : typeof r[j] === "object" ? JSON.stringify(r[j]) : String(r[j])).join("|"))).slice(0, 32); row.sheetRow = x.r;
      out.push(row); if (withWhy && learner === "unclear") unclear.push({ ...row, label: norm(c(r, 4)), ages, sheetRow: x.r }); }
    for (const x of SA) await one(x);
  } else {
    src = "ACTIVE"; const codes = Object.keys(PS);
    const P = codes.length ? await pages(() => db.from("coe_packages").select("code,buy,enrolled").in("code", codes).is("removed_at", null).not("enrolled", "is", null).order("buy")) : [];
    P.forEach((p: any) => { const code = norm(p.code).toUpperCase(), date = p.buy || "", e = Number(p.enrolled) || 0; if (!date || !e) return; const [pkg, free] = PKG[e] || [e, 0];
      const a = age[code] ? ageAt(age[code], date) : null, learner = a == null ? "unclear" : a >= 18 ? "adult" : "young", program = learner === "adult" ? "adult" : learner === "young" ? "yl" : "unclear", amount = program === "unclear" ? null : rate(program, pkg, date);
      const row: any = { date, names: [{ name: PS[code].name, cn: PS[code].cn, code }], lessons: pkg, free, learner, program, amount, why: amount != null ? "" : learner === "unclear" ? "unclear" : "norate" };
      row.ref = "PKG:" + code + "|" + date + "|" + e; out.push(row); if (withWhy && learner === "unclear") unclear.push({ ...row, ages: [] }); });
  }
  out.sort((a, b) => b.date.localeCompare(a.date));
  // remitted = partner price (amount); earnings = discount × paid lessons; student price = remitted + earnings. Unknown → null ("—"), never guessed.
  out.forEach((r) => { const d = r.amount != null ? disc(r.date, r.program) : null; r.earn = r.amount != null && d != null ? Math.round(d * (r.lessons || 0) * 100) / 100 : null; r.student = r.earn != null ? r.amount + r.earn : null; });
  // Misty 14:55 · paid status (partner_payments, per partner source). No record: "topay" when the login tracks payments, else null ("—").
  const { data: PP } = await db.from("partner_payments").select("partner,ref,status,marked_by,marked_at,note").in("partner", (acc.sources || []).length ? acc.sources : ["-"]);
  const st: Record<string, any> = {}; (PP || []).forEach((x: any) => { if (!st[x.ref] || x.marked_at > st[x.ref].marked_at) st[x.ref] = x; });
  out.forEach((r) => { const m = st[r.ref]; r.status = m ? m.status : acc.pay_tracking ? "topay" : null; if (withWhy && m) { r.markedBy = m.marked_by; r.markedAt = m.marked_at; r.note = m.note || ""; } });
  const months: Record<string, { m: string; total: number; n: number; none: number }> = {};
  out.forEach((r) => { const m = r.date.slice(0, 7), o = months[m] = months[m] || { m, total: 0, n: 0, none: 0 }; o.n++; if (r.amount == null) o.none++; else o.total += r.amount; });
  const M = Object.values(months).sort((a, b) => b.m.localeCompare(a.m));
  const sum = (s: string) => out.filter((r) => r.status === s && r.amount != null).reduce((a, r) => a + r.amount, 0), cnt = (s: string) => out.filter((r) => r.status === s).length;
  M.forEach((m: any) => { const R = out.filter((r) => r.date.slice(0, 7) === m.m); m.earn = R.reduce((a, r) => a + (r.earn || 0), 0); m.student = R.reduce((a, r) => a + (r.student || 0), 0); m.paid = R.filter((r) => r.status === "paid" && r.amount != null).reduce((a, r) => a + r.amount, 0); m.topay = R.filter((r) => r.status === "topay" && r.amount != null).reduce((a, r) => a + r.amount, 0); m.topayN = R.filter((r) => r.status === "topay").length; });
  return { src, rows: out, months: M, total: M.reduce((a, x) => a + x.total, 0), none: M.reduce((a, x) => a + x.none, 0), count: out.length, unclear, dropped, mismatch: withWhy ? out.filter((r) => r.rmb != null && r.amount != null && Math.abs(r.rmb - r.amount) > 0.5).map((r) => ({ date: r.date, sheetRow: r.sheetRow, lessons: r.lessons, program: r.program, rate: r.amount, rmb: r.rmb, names: r.names.filter((n: any) => !n.hidden).map((n: any) => n.name) })) : [],
    programs: Object.values(out.reduce((o: any, r) => { const k = r.program || "yl", x = o[k] = o[k] || { program: k, n: 0, priced: 0, remitted: 0, earn: 0, student: 0, none: 0 }; x.n++; if (r.amount == null) x.none++; else { x.priced++; x.remitted += r.amount; x.earn += r.earn || 0; x.student += r.student || 0; } return o; }, {})),
    earn: out.reduce((a, r) => a + (r.earn || 0), 0), student: out.reduce((a, r) => a + (r.student || 0), 0), earnN: out.filter((r) => r.earn != null).length, discount: disc(new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10)), discounts: DC.map((x: any) => ({ program: x.program || "", per_lesson: Number(x.per_lesson), valid_from: x.valid_from || "" })),
    tracking: !!acc.pay_tracking, paid: sum("paid"), topay: sum("topay"), paidN: cnt("paid"), topayN: cnt("topay"), unmarkedN: out.filter((r) => !r.status).length };
}
Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const op = String(b.op || "");
  const ip = String(req.headers.get("x-forwarded-for") || "").split(",")[0].trim().slice(0, 60);

  // ───────── management: create / reset / deactivate partner logins ─────────
  if (/^p(List|Save|Active|Rates|RateSet|Labels|Pay|Conflicts|PaySet|PayAll|PayTrack|Over|OverSet|DiscSet)$/.test(op)) {
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
    if (op === "pRates") {   // 1343 · partner prices + SALES labels
      const [{ data: R }, SA, { data: A }] = await Promise.all([db.from("partner_rates").select("id,source,program,learner,lessons,amount,valid_from,confirmed,note,updated_at,updated_by").order("source").order("program").order("lessons"),
        pages(() => db.from("sheet_rows").select("data").eq("tab", "SALES").gte("r", 3).order("r")), db.from("partner_accounts").select("id,username,display_name,sources,sales_labels").order("created_at")]);
      const L: Record<string, { label: string; n: number; last: string }> = {}; SA.forEach((x: any) => { const r = x.data || [], k = norm(c(r, 4)); if (!k || !ymd(c(r, 0))) return; const o = L[k] = L[k] || { label: k, n: 0, last: "" }; o.n++; const d = ymd(c(r, 0)); if (d > o.last) o.last = d; });
      const [{ data: DS }, { data: NP }] = await Promise.all([db.from("partner_discounts").select("id,source,per_lesson,valid_from,updated_at,updated_by").order("source").then(async (r: any) => { const { data: P } = await db.from("partner_program_discounts").select("id,source,program,per_lesson,valid_from,updated_at,updated_by").order("source"); return { data: [...(r.data || []), ...(P || [])] }; }), db.from("program_prices").select("program,lessons,price,valid_from,source_note").order("program").order("lessons")]);
      return out({ ok: true, rates: R || [], discounts: DS || [], normal: NP || [], labels: Object.values(L).sort((a, b) => b.n - a.n), accounts: A || [] });
    }
    if (op === "pRateSet") {
      const source = norm(b.source), program = String(b.program || (b.learner === "adult" ? "adult" : b.learner === "young" ? "yl" : "")), lessons = Math.round(Number(b.lessons) || 0), vf = ymd(b.valid_from) || null;
      if (!source || !/^(yl|adult|ielts|toefl|pet|ket|reading)$/.test(program) || lessons <= 0 || lessons > 500) return out({ ok: false, msg: "Choose a source, program and lesson count" });
      const learner = program === "adult" ? "adult" : program === "yl" ? "young" : null;
      if (b.confirm) { let q = db.from("partner_rates").update({ confirmed: true, note: "confirmed by " + s.name, updated_by: s.name, updated_at: new Date().toISOString() }).eq("source", source).eq("program", program).eq("lessons", lessons); q = vf ? q.eq("valid_from", vf) : q.is("valid_from", null); const { error } = await q; return out({ ok: !error }); }
      let q = db.from("partner_rates").delete().eq("source", source).eq("program", program).eq("lessons", lessons); q = vf ? q.eq("valid_from", vf) : q.is("valid_from", null); await q;
      if (b.amount === null || b.amount === "" || b.amount === undefined) return out({ ok: true });
      const amount = Number(b.amount); if (!(amount >= 0) || amount > 100000) return out({ ok: false, msg: "Amount: a number of yuan" });
      const { error } = await db.from("partner_rates").insert({ source, program, learner, lessons, amount, valid_from: vf, confirmed: true, note: "set by " + s.name, updated_by: s.name }); return out({ ok: !error, msg: error ? "Not saved" : "" });
    }
    if (op === "pDiscSet") {   // Misty 15:28 · partner earnings per paid lesson (¥), optional valid-from; empty amount removes it
      const source = norm(b.source), vf = ymd(b.valid_from) || null, program = /^(yl|adult|ielts|toefl|pet|ket|reading)$/.test(String(b.program || "")) ? String(b.program) : ""; if (!source) return out({ ok: false, msg: "Choose a source" });
      const TBL = program ? "partner_program_discounts" : "partner_discounts";
      let q = db.from(TBL).delete().eq("source", source); q = vf ? q.eq("valid_from", vf) : q.is("valid_from", null); if (program) q = q.eq("program", program); await q;
      if (b.per_lesson === null || b.per_lesson === "" || b.per_lesson === undefined) return out({ ok: true });
      const v = Number(b.per_lesson); if (!(v >= 0) || v > 1000) return out({ ok: false, msg: "Yuan per paid lesson" });
      const { error } = await db.from(TBL).insert(program ? { source, program, per_lesson: v, valid_from: vf, updated_by: s.name } : { source, per_lesson: v, valid_from: vf, updated_by: s.name }); return out({ ok: !error, msg: error ? "Not saved" : "" });
    }
    if (op === "pLabels") {
      const labels = (Array.isArray(b.labels) ? b.labels : []).map(norm).filter(Boolean).slice(0, 20);
      const { error } = await db.from("partner_accounts").update({ sales_labels: labels, updated_at: new Date().toISOString(), updated_by: s.name }).eq("id", String(b.id || "")); return out({ ok: !error });
    }
    if (op === "pConflicts") {   // students excluded because DATABASE and ACTIVE sources disagree (for Ops to correct)
      const srcs = Array.isArray(b.sources) && b.sources.length ? b.sources.map(norm) : null; let list: string[] = srcs || [];
      if (!srcs) { const { data: A } = await db.from("partner_accounts").select("sources"); list = [...new Set(((A || []) as any[]).flatMap((a) => a.sources || []))]; }
      const R = await partnerScan(list); return out({ ok: true, sources: list, included: Object.keys(R.PS).length, conflicts: R.conflicts });
    }
    if (op === "pOver" || op === "pOverSet") {   // Misty 15:00 · "Always include" / "Always exclude" student codes per login (who / when / note)
      const { data: A } = await db.from("partner_accounts").select("id,display_name,sources").eq("id", String(b.id || "")).maybeSingle(); if (!A) return out({ ok: false, msg: "No such login" });
      const partner = (A.sources || [])[0]; if (!partner) return out({ ok: false, msg: "This login has no source" });
      if (op === "pOverSet") { const code = norm(b.code).toUpperCase(), mode = String(b.mode || "");
        if (!/^ST-\d{4}-\d{3}$/.test(code)) return out({ ok: false, msg: "Student code like ST-2024-117" });
        const S = new Set((A.sources || []).map(canon)); const { data: OV } = await db.from("partner_overrides").select("id,partner,code"); const ids = ((OV || []) as any[]).filter((o) => S.has(canon(o.partner)) && norm(o.code).toUpperCase() === code).map((o) => o.id);
        if (ids.length) { const { error } = await db.from("partner_overrides").delete().in("id", ids); if (error) return out({ ok: false, msg: "Not saved" }); }
        if (mode === "include" || mode === "exclude") { const { error } = await db.from("partner_overrides").insert({ partner, code, mode, note: norm(b.note).slice(0, 200) || null, marked_by: s.name }); if (error) return out({ ok: false, msg: "Not saved" }); } }
      const R = await partnerScan(A.sources || []);
      return out({ ok: true, overrides: R.overrides.map((o: any) => ({ ...o, name: (R.PS[norm(o.code).toUpperCase()] || {} as any).name || "" })), included: Object.keys(R.PS).length, conflicts: R.conflicts });
    }
    if (op === "pPaySet" || op === "pPayAll" || op === "pPayTrack") {   // Misty 14:55 · mark paid / undo / bulk "all up to date as paid" / turn tracking on-off
      const { data: A } = await db.from("partner_accounts").select("id,display_name,sources,sales_labels,pay_tracking").eq("id", String(b.id || "")).maybeSingle(); if (!A) return out({ ok: false, msg: "No such login" });
      const partner = (A.sources || [])[0]; if (!partner) return out({ ok: false, msg: "This login has no source" });
      if (op === "pPayTrack") { const { error } = await db.from("partner_accounts").update({ pay_tracking: !!b.on, updated_at: new Date().toISOString(), updated_by: s.name }).eq("id", A.id); return out({ ok: !error }); }
      const P = await partnerSet(A.sources || []), all = await payFor(A, P, true), byRef: Record<string, any> = {}; all.rows.forEach((r: any) => { byRef[r.ref] = r; });
      let refs: string[] = [], status: string | null = null; const note = norm(b.note).slice(0, 200) || null;
      if (op === "pPayAll") { const upto = ymd(b.upto) || new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10); refs = all.rows.filter((r: any) => r.date <= upto && r.status !== "paid").map((r: any) => r.ref); status = "paid"; }
      else { refs = (Array.isArray(b.refs) ? b.refs : [b.ref]).map(String).filter((r: string) => byRef[r]); status = b.status === "paid" || b.status === "topay" ? b.status : null; }
      if (!refs.length) return out({ ok: true, n: 0 });
      const { error: de } = await db.from("partner_payments").delete().in("partner", A.sources).in("ref", refs); if (de) return out({ ok: false, msg: "Not saved" });
      if (status) { const { error } = await db.from("partner_payments").insert(refs.map((r) => ({ partner, ref: r, sale_date: byRef[r].date, sales_row: byRef[r].sheetRow || null, status, note, marked_by: s.name })));
        if (error) return out({ ok: false, msg: "Not saved" }); }
      return out({ ok: true, n: refs.length });
    }
    if (op === "pPay") {   // management preview of a login's Payments tab, plus the rows whose learner type is unclear
      const { data: A } = await db.from("partner_accounts").select("id,display_name,sources,sales_labels,pay_tracking").eq("id", String(b.id || "")).maybeSingle(); if (!A) return out({ ok: false, msg: "No such login" });
      const P = await partnerSet(A.sources || []); return out({ ok: true, partner: A.display_name, ...(await payFor(A, P, true)) });
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
    const [LS, { data: UP }, TR, PR, DB] = await Promise.all([lessonsOf(codes),
      codes.length ? pages(() => db.from("classes").select("code,starts_at").in("code", codes).gte("starts_at", nowIso).lte("starts_at", new Date(Date.now() + 21 * 864e5).toISOString()).eq("cancelled", false).not("id", "like", "pend-%").order("starts_at")).then((d) => ({ data: d })) : Promise.resolve({ data: [] as any[] }),
      rows("TR-DATA"), rows("PR-DATA"), rows("DATABASE")]);
    const R: Record<string, any[][]> = {}, T: Record<string, any[]> = {}, P: Record<string, any[]> = {}, next: Record<string, string> = {};
    DB.forEach((r: any[]) => { const k = norm(c(r, 0)).toUpperCase(); if (PS[k]) (R[k] = R[k] || []).push(r); });
    TR.forEach((r: any[]) => { const k = norm(c(r, 33)).toUpperCase(); if (PS[k]) (T[k] = T[k] || []).push(trOf(r)); });
    PR.forEach((r: any[]) => { const k = norm(c(r, 4)).toUpperCase(); if (PS[k]) (P[k] = P[k] || []).push(prOf(r)); });
    ((UP as any[]) || []).forEach((x: any) => { if (!next[x.code]) next[x.code] = x.starts_at; });
    const students = codes.map((k) => { const L = LS[k];
      return { code: k, name: PS[k].name, cn: PS[k].cn, level: R[k] ? nowOf(R[k], T[k] || [], P[k] || []) : "", active: L ? L.active : !!next[k], checking: !L && !!next[k], nopkg: !L && !next[k],
        pk: L ? { total: L.total, used: L.used, left: L.left, over: L.over, valid: L.valid, renew: L.renew, shared: L.shared } : null, next: next[k] ? mnl(next[k]) : null }; })
      .sort((a, b) => (+b.active - +a.active) || String(a.name).localeCompare(String(b.name)));
    return out({ ok: true, partner: { name: acc.display_name }, students, at: nowIso });
  }

  if (op === "student") {
    const code = norm(b.code).toUpperCase(); if (!PS[code]) return out({ ok: false, error: "not your student" }, 403);
    const since = new Date(Date.now() - 120 * 864e5).toISOString();
    const [LS, { data: UP }, { data: PAST }, R, TRr, PRr, { data: RL }, { data: FB }, { data: TT }] = await Promise.all([
      lessonsOf([code]),
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
    return out({ ok: true, student: { code, name: PS[code].name, cn: PS[code].cn }, packages: LS[code] ? [{ ...LS[code], buy: LS[code].start }] : [], checking: !LS[code], upcoming: ((UP as any[]) || []).map(cls), attendance: past, journey, reports });
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
  if (op === "payments") {   // 1343
    const { data: A } = await db.from("partner_accounts").select("sources,sales_labels,pay_tracking").eq("id", acc.id).maybeSingle();
    const r = await payFor({ ...acc, ...(A || {}) }, PS, false); delete (r as any).unclear;
    r.rows.forEach((x: any) => { x.names.forEach((n: any) => delete n.code); delete x.ref; delete x.sheetRow; delete x.rmb; delete x.derived; delete x.label; });   delete (r as any).dropped; delete (r as any).mismatch;   // codes are not needed on the page
    return out({ ok: true, ...r });
  }
  // 27 Oct (1341) · weekly schedule: Mon–Sun this week + next 2 weeks, Beijing time, 25-min slots every 30 min.
  //   open  = the teacher's open hours (management availability) minus booked classes, from now + 2 h; no open slots on approved whole-day leave
  //   booked = start/end only; the partner's OWN students carry their names, every other booking is just "booked" (no names, no codes)
  //   mine  = the partner's own students' classes in those 3 weeks, any teacher
  if (op === "week") {
    const LEN = 25, now = Date.now(), soon = now + 2 * 3600e3, today = new Date(now + 8 * 3600e3).toISOString().slice(0, 10);
    const wd = (d: string) => (new Date(Date.parse(d + "T12:00:00+08:00") + 8 * 3600e3).getUTCDay() + 6) % 7;
    const dayAt = (d: string, n: number) => new Date(Date.parse(d + "T12:00:00+08:00") + n * 864e5 + 8 * 3600e3).toISOString().slice(0, 10);
    const mon = dayAt(today, -wd(today)), dates = Array.from({ length: 21 }, (_, n) => dayAt(mon, n));
    const t0 = new Date(Date.parse(mon + "T00:00:00+08:00")).toISOString(), t1 = new Date(Date.parse(dates[20] + "T23:59:59+08:00")).toISOString();
    const [{ data: AV }, CL, { data: LV }, { data: TT }] = await Promise.all([
      db.from("docs").select("key,updated_at,data").like("key", "mgmt:mgmtAvailAll|%").order("updated_at", { ascending: false }).limit(30),
      pages(() => db.from("classes").select("code,starts_at,ends_at,teachers,data").gte("starts_at", t0).lte("starts_at", t1).eq("cancelled", false).not("id", "like", "pend-%").order("starts_at")),
      db.from("docs").select("data").eq("key", "mgmt:mgmtLeave|[]").maybeSingle(),
      db.from("coe_book_titles").select("code,title").limit(500)]);
    const BT: Record<string, string> = {}; (TT || []).forEach((x: any) => { BT[String(x.code).toLowerCase()] = x.title; });
    const book = (x: string) => BT[String(x || "").toLowerCase()] || String(x || "").replace(/([a-z])([A-Z0-9])/g, "$1 $2");
    const hours: Record<string, { name: string; days: string[]; at: number }> = {};
    (AV || []).forEach((d: any) => ((d.data && d.data.teachers) || []).forEach((t: any) => { const k = String(t.name || "").toLowerCase(); if (!k) return;
      const at = Number(t.at) || Date.parse(d.updated_at) || 0; if (!hours[k] || at > hours[k].at) hours[k] = { name: String(t.name), days: (t.days || []).slice(0, 7).map((x: any) => String(x || "")), at }; }));
    const leave: Record<string, Set<string>> = {};
    (((LV as any)?.data?.rows) || []).forEach((r: any) => { if (!/^approved/i.test(String(r.status || "")) || !/whole/i.test(String(r.part || "whole"))) return;
      const k = String(r.teacher || "").toLowerCase(), f = ymd(r.from), t = ymd(r.to) || f; if (!k || !f) return;
      for (let d = f, n = 0; d <= t && n < 60; d = dayAt(d, 1), n++) (leave[k] = leave[k] || new Set()).add(d); });
    const hm = (ms: number) => new Date(ms + 8 * 3600e3).toISOString().slice(11, 16), dOf = (ms: number) => new Date(ms + 8 * 3600e3).toISOString().slice(0, 10);
    const bk: Record<string, Record<string, { s: number; e: number; m: Set<string> }>> = {}, names: Record<string, string> = {}, mine: any[] = [];
    (CL || []).forEach((x: any) => { const k = String((x.teachers || [])[0] || "").toLowerCase(); const s = Date.parse(x.starts_at), e = Date.parse(x.ends_at || x.data?.end || x.starts_at) || s + LEN * 6e4;
      const code = norm(x.code).toUpperCase(), own = !!PS[code], title = String((x.data && x.data.title) || "");
      if (own) mine.push({ date: dOf(s), t: hm(s), e: hm(e), teacher: String((x.teachers || [])[0] || ""), code, name: PS[code].name, cn: PS[code].cn,
        book: book((x.data && x.data.book) || ""), kind: isTrial(title) ? "trial" : isSub(title) ? "sub" : "class" });
      if (!k) return; names[k] = names[k] || String((x.teachers || [])[0]);
      const o = (bk[k] = bk[k] || {}), key = String(s); (o[key] = o[key] || { s, e, m: new Set() }); if (e > o[key].e) o[key].e = e; if (own) o[key].m.add(code); });
    const keys = new Set([...Object.keys(hours), ...Object.keys(bk).filter((k) => Object.values(bk[k]).some((b) => b.m.size))]);
    const teachers = [...keys].map((k) => { const H = hours[k] || { name: names[k] || k, days: [], at: 0 }, B = Object.values(bk[k] || {}).sort((a, b) => a.s - b.s);
      const days = dates.map((d) => { const w = wd(d), spec = String(H.days[w] || "").trim(), off = !!leave[k]?.has(d), open: string[] = [];
        if (!off && spec && spec !== "full") spec.split(",").map((x) => x.trim()).filter(Boolean).forEach((x) => { const p = x.split("-"); if (p.length !== 2) return;
          const s0 = Date.parse(d + "T" + p[0].trim().padStart(5, "0") + ":00+08:00"), e0 = Date.parse(d + "T" + p[1].trim().padStart(5, "0") + ":00+08:00"); if (isNaN(s0) || isNaN(e0)) return;
          for (let t = s0; t + LEN * 6e4 <= e0; t += 30 * 6e4) { const te = t + LEN * 6e4; if (t >= soon && !B.some((y) => y.s < te && y.e > t)) open.push(hm(t)); } });
        const booked = B.filter((b) => dOf(b.s) === d).map((b) => { const r: any = { t: hm(b.s), e: hm(b.e) }; if (b.m.size) r.m = [...b.m].map((cd) => ({ code: cd, name: PS[cd].name, cn: PS[cd].cn })); return r; });
        return { date: d, w, hours: off ? "" : spec, full: spec === "full", off, open: [...new Set(open)].sort(), booked }; });
      const pf = PROF[k] || null;
      return { name: H.name, sub: pf ? pf.sub : "", hours: H.days, days, open: days.reduce((a, x) => a + x.open.length, 0), mine: days.reduce((a, x) => a + x.booked.filter((b: any) => b.m).length, 0) }; })
      .filter((t) => t.open > 0 || t.mine > 0 || t.days.some((d) => d.booked.length)).sort((a, b) => (b.mine - a.mine) || (b.open - a.open) || a.name.localeCompare(b.name));
    return out({ ok: true, from: mon, today, dates, teachers, mine: mine.sort((a, b) => (a.date + a.t).localeCompare(b.date + b.t)), tz: "Asia/Shanghai (UTC+8)" });
  }
  return out({ ok: false, error: "unknown op" }, 400);
});
