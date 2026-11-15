// coe-13th v6 (15 Nov 2026, Misty 20:00): "only celine will have 13th month pay no need katherine and the computation would be
//   December 2025 to November 2026 minus penalties (most penalties of celine are administrative, dont include the Government and
//   rent, utilities in penalties only those related to administrative work) by 12".
//   → people: Celine only · months: December of the year before + January–November · total = basic − administrative penalties
//     (Actions rows that are not "Deductions" and do not mention rent / bills / government) · ÷ 12.
//   December of the year before comes from the daily records when they exist, else from that month's PAYROLL row (days × rate).
// v5 "Show to <person>" (op "mine") · v4 upto · v3 rates per month · v2 fixed pay · v1 President only (10 Nov).
// POST { token, op }: get { year } · save { year, person, est{}, ovr{}, adj, adj_note, note, paid_on, shared } · mine { year }
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
const str = (x: unknown, n = 200) => String(x == null ? "" : x).trim().slice(0, n);
const r2 = (n: number) => Math.round(n * 100) / 100;
const num = (x: unknown) => { const n = Number(String(x == null ? "" : x).replace(/[₱,\s]/g, "")); return isFinite(n) ? n : NaN; };
const MON: Record<string, number> = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
const PEOPLE = ["celine"];   // Misty 15 Nov: only Celine has a 13th month pay
const NOT_ADMIN = /rent|electric|water|bill|utilit|internet|wifi|sss|pag-?ibig|philhealth|bir|government|tax/i;
const ymdOf = (w: string) => { const m = String(w || "").match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})/); if (!m || !MON[m[2].toLowerCase()]) return ""; return m[3] + "-" + String(MON[m[2].toLowerCase()]).padStart(2, "0") + "-" + m[1].padStart(2, "0"); };
Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const token = str(b.token, 200); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: s } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
  const me = String(s.name || "").trim();
  const isPres = s.mode === "mgmt" && me.toLowerCase() === "cupofenglish", opIn = str(b.op, 10);
  if (!isPres && opIn !== "mine") return out({ ok: false, error: "President only" }, 403);
  const today = new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10), curY = +today.slice(0, 4), curM = +today.slice(5, 7);
  const year = Math.trunc(num(b.year)) || curY; if (year < 2024 || year > curY + 1) return out({ ok: false, error: "year" }, 400);
  const from = (year - 1) + "-12-01", to = year + "-11-30";
  const op = str(b.op, 10);
  if (op === "save") {
    const person = str(b.person, 60); if (!person || PEOPLE.indexOf(person.toLowerCase()) < 0) return out({ ok: false, error: "person" }, 400);
    const clean = (o: any, max: number) => { const r: Record<string, number> = {}; for (const k of Object.keys(o || {})) { const m = +k, v = num(o[k]); if (m >= 1 && m <= 12 && String(o[k]).trim() !== "" && isFinite(v) && v >= 0 && v <= max) r[String(m)] = r2(v); } return r; };
    const adj = num(b.adj);
    const row = { year, person, shared: !!b.shared, upto: 11, est: clean(b.est, 31), ovr: clean(b.ovr, 200000), adj: isFinite(adj) ? r2(adj) : 0, adj_note: str(b.adj_note, 300), note: str(b.note, 600),
      paid_on: /^\d{4}-\d{2}-\d{2}$/.test(str(b.paid_on, 10)) ? str(b.paid_on, 10) : null, updated_by: me, updated_at: new Date().toISOString() };
    const { error } = await db.from("coe_13th").upsert(row); if (error) return out({ ok: false, error: "not saved" }, 500);
    await db.from("coe_13th_log").insert({ year, person, row, by_name: me });
  } else if (op !== "get" && op !== "mine") return out({ ok: false, error: "unknown op" }, 400);
  const [{ data: days }, { data: saved }, { data: act }, { data: pr }] = await Promise.all([
    db.from("coe_staff_day").select("day,name,base,pay,fixed,holiday").gte("day", from).lte("day", to).is("removed_at", null).order("day"),
    db.from("coe_13th").select("*").eq("year", year),
    db.from("docs").select("data").eq("key", "pres:mgmtActions|[]").maybeSingle(),
    db.from("sheet_rows").select("data").eq("tab", "PAYROLL").range(0, 4999)]);
  let names = PEOPLE.map((p) => { const d: any = (days || []).find((x: any) => String(x.name).toLowerCase() === p); const v: any = (saved || []).find((x: any) => String(x.person).toLowerCase() === p); return d ? String(d.name) : v ? String(v.person) : p.charAt(0).toUpperCase() + p.slice(1); });
  if (op === "mine") { const sv: any = (saved || []).find((x: any) => String(x.person).toLowerCase() === me.toLowerCase()); if (!sv || !sv.shared || PEOPLE.indexOf(me.toLowerCase()) < 0) return out({ ok: true, year, shown: false }); names = [sv.person]; }
  const rows: any[] = ((act && act.data && act.data.rows) || []);
  const people = names.map((person) => {
    const lc = person.toLowerCase(), D = (days || []).filter((d: any) => String(d.name).toLowerCase() === lc), S: any = (saved || []).find((x: any) => String(x.person).toLowerCase() === lc) || {};
    const fixed = D.length > 0 && D.every((d: any) => d.fixed);
    let rate = 0; D.forEach((d: any) => { const v = fixed ? +d.pay : +d.base; if (v > 0) rate = v; });
    const months = [];
    for (const [y, m] of [[year - 1, 12], ...Array.from({ length: 11 }, (_, i) => [year, i + 1])]) {
      const M = D.filter((d: any) => +String(d.day).slice(0, 4) === y && +String(d.day).slice(5, 7) === m && +d.pay > 0);
      let actual = r2(M.reduce((a: number, d: any) => a + +d.pay, 0));
      const rates: any[] = []; M.forEach((d: any) => { const r = +d.base; let x = rates.find((z) => z.r === r); if (!x) rates.push(x = { r, d: 0, amt: 0 }); x.d = r2(x.d + (+d.pay >= r ? 1 : r ? +d.pay / r : 0)); x.amt = r2(x.amt + +d.pay); });
      let src0 = "records";
      if (!M.length && y === year - 1) {   // the month before the daily records: that month's PAYROLL row (days × rate = basic)
        const p: any = (pr || []).map((x: any) => x.data).find((x: any) => Array.isArray(x) && String(x[1] || "").trim().toLowerCase() === lc && String(x[2] || "").startsWith((year - 1) + "-12"));
        if (p && num(p[8]) > 0) { actual = r2(num(p[8])); rates.push({ r: num(p[7]) || 0, d: num(p[4]) || 0, amt: actual }); src0 = "payroll"; }
      }
      const prem = r2(M.reduce((a: number, d: any) => a + (+d.holiday || 0), 0));
      const done = y < curY || (y === curY && m < curM), part = y === curY && m === curM;
      const ov = S.ovr && S.ovr[String(m)] != null ? +S.ovr[String(m)] : null, ed = S.est && S.est[String(m)] != null ? +S.est[String(m)] : 26;
      let basic = actual, src = src0;
      if (ov != null) { basic = ov; src = "typed"; } else if (!done) { basic = r2(fixed ? rate : ed * rate); src = "estimate"; }
      months.push({ m, y, days: M.length || (rates[0] ? rates[0].d : 0), actual, rates, prem, done, part, est: ed, ovr: ov, basic, src });
    }
    const all = rows.filter((r) => String(r.employee || "").toLowerCase() === lc && num(r.amount) > 0).map((r) => ({ when: str(r.when, 20), day: ymdOf(r.when), type: str(r.type, 40), what: str(r.action || r.type, 160), amount: num(r.amount) }))
      .filter((r) => r.day >= from && r.day <= to);
    const penalties = all.filter((r) => r.type !== "Deductions" && !NOT_ADMIN.test(r.type + " " + r.what)).sort((a, z) => a.day.localeCompare(z.day));
    const excluded = all.filter((r) => penalties.indexOf(r) < 0);
    const penaltyTotal = r2(penalties.reduce((a, p) => a + p.amount, 0));
    const basicTotal = r2(months.reduce((a, x) => a + x.basic, 0) + (+S.adj || 0));
    const total = r2(basicTotal - penaltyTotal);
    return { person, fixed, rate, upto: 11, period: { from, to }, months, penalties, penaltyTotal, excludedTotal: r2(excluded.reduce((a, p) => a + p.amount, 0)),
      saved: { adj: +S.adj || 0, adj_note: S.adj_note || "", note: S.note || "", paid_on: S.paid_on || "", updated_by: S.updated_by || "", updated_at: S.updated_at || "" },
      estimated: months.some((x) => x.src === "estimate"), basicTotal, total, pay: r2(total / 12) };
  });
  if (op === "mine") { const p: any = people[0]; return out({ ok: true, year, shown: true, me: { person: p.person, fixed: p.fixed, rate: p.rate, upto: 11, period: p.period, basicTotal: p.basicTotal, penaltyTotal: p.penaltyTotal, total: p.total, pay: p.pay, estimated: p.estimated, adj: p.saved.adj, paid_on: p.saved.paid_on,
    months: p.months.map((m: any) => ({ m: m.m, y: m.y, rates: m.rates, basic: m.basic, src: m.src === "typed" || m.src === "payroll" ? "records" : m.src, est: m.est })) } }); }
  people.forEach((p: any) => { const sv: any = (saved || []).find((x: any) => String(x.person).toLowerCase() === p.person.toLowerCase()); p.shared = !!(sv && sv.shared); });
  return out({ ok: true, year, today, people });
});
