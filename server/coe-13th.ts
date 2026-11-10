// coe-13th v3 (rates per month split by rate with days and amount; holiday premium shown, not counted) · v2 (fixed monthly pay: estimate = last month's pay) · v1 · 10 Nov 2026 (Misty 15:45: "13th month pay … PRESIDENT ACCESS ONLY so I could see and edit · aligned with DOLE ·
//   Celine should not have access of it yet"). PRESIDENT ONLY (mgmt session named CupOfEnglish) — everyone else gets 403.
// DOLE rule (PD 851, Revised Guidelines): 13th month = total BASIC salary actually earned in the calendar year ÷ 12, paid on or
//   before 24 December. Basic = days worked × daily rate (from coe_staff_day). Not counted: incentives, allowances, holiday/OT
//   premiums, employer-paid SSS/Pag-IBIG/PhilHealth, rent/utilities. Penalties are NOT deducted. Unpaid days/hours are simply not earned.
// POST { token, op }:
//   get  { year } → { ok, year, today, people: [{ person, rate, months: [{m, days, actual, basic, src}], penalties, saved, total, pay }] }
//   save { year, person, est{}, ovr{}, adj, adj_note, note, paid_on } → same as get (every save is also written to coe_13th_log)
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
  if (!(s.mode === "mgmt" && me.toLowerCase() === "cupofenglish")) return out({ ok: false, error: "President only" }, 403);
  const today = new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10), curY = +today.slice(0, 4), curM = +today.slice(5, 7);
  const year = Math.trunc(num(b.year)) || curY; if (year < 2024 || year > curY + 1) return out({ ok: false, error: "year" }, 400);
  const op = str(b.op, 10);
  if (op === "save") {
    const person = str(b.person, 60); if (!person) return out({ ok: false, error: "person" }, 400);
    const clean = (o: any, max: number) => { const r: Record<string, number> = {}; for (const k of Object.keys(o || {})) { const m = +k, v = num(o[k]); if (m >= 1 && m <= 12 && String(o[k]).trim() !== "" && isFinite(v) && v >= 0 && v <= max) r[String(m)] = r2(v); } return r; };
    const adj = num(b.adj);
    const row = { year, person, est: clean(b.est, 31), ovr: clean(b.ovr, 200000), adj: isFinite(adj) ? r2(adj) : 0, adj_note: str(b.adj_note, 300), note: str(b.note, 600),
      paid_on: /^\d{4}-\d{2}-\d{2}$/.test(str(b.paid_on, 10)) ? str(b.paid_on, 10) : null, updated_by: me, updated_at: new Date().toISOString() };
    const { error } = await db.from("coe_13th").upsert(row); if (error) return out({ ok: false, error: "not saved" }, 500);
    await db.from("coe_13th_log").insert({ year, person, row, by_name: me });
  } else if (op !== "get") return out({ ok: false, error: "unknown op" }, 400);
  const [{ data: days }, { data: saved }, { data: act }] = await Promise.all([
    db.from("coe_staff_day").select("day,name,base,pay,fixed,holiday").gte("day", year + "-01-01").lte("day", year + "-12-31").is("removed_at", null).order("day"),
    db.from("coe_13th").select("*").eq("year", year),
    db.from("docs").select("data").eq("key", "pres:mgmtActions|[]").maybeSingle()]);
  const names = [...new Set((days || []).map((d: any) => String(d.name)))].concat((saved || []).map((x: any) => x.person)).filter((v, i, a) => a.indexOf(v) === i).sort();
  const rows: any[] = ((act && act.data && act.data.rows) || []);
  const people = names.map((person) => {
    const D = (days || []).filter((d: any) => d.name === person), S: any = (saved || []).find((x: any) => x.person === person) || {};
    const fixed = D.length > 0 && D.every((d: any) => d.fixed);   // a fixed monthly pay (one row a month), not a daily rate
    let rate = 0; D.forEach((d: any) => { const v = fixed ? +d.pay : +d.base; if (v > 0) rate = v; });
    const months = [];
    for (let m = 1; m <= 12; m++) {
      const M = D.filter((d: any) => +String(d.day).slice(5, 7) === m && +d.pay > 0), actual = r2(M.reduce((a: number, d: any) => a + +d.pay, 0));
      const rates: any[] = []; M.forEach((d: any) => { const r = +d.base; let x = rates.find((y) => y.r === r); if (!x) rates.push(x = { r, d: 0, amt: 0 }); x.d = r2(x.d + (+d.pay >= r ? 1 : r ? +d.pay / r : 0)); x.amt = r2(x.amt + +d.pay); });
      const prem = r2(M.reduce((a: number, d: any) => a + (+d.holiday || 0), 0));   // holiday premium on payroll: not basic (DOLE), shown only
      const done = year < curY || (year === curY && m < curM), part = year === curY && m === curM;
      const ov = S.ovr && S.ovr[String(m)] != null ? +S.ovr[String(m)] : null, ed = S.est && S.est[String(m)] != null ? +S.est[String(m)] : 26;
      let basic = actual, src = "records";
      if (ov != null) { basic = ov; src = "typed"; } else if (!done) { basic = r2(fixed ? rate : ed * rate); src = "estimate"; }
      months.push({ m, days: M.length, actual, rates, prem, done, part, est: ed, ovr: ov, basic, src });
    }
    const penalties = rows.filter((r) => String(r.employee || "").toLowerCase() === person.toLowerCase() && String(r.type) !== "Deductions" && num(r.amount) > 0 && String(r.when || "").includes(String(year)))
      .map((r) => ({ when: str(r.when, 20), what: str(r.action || r.type, 120), amount: num(r.amount) }));
    const total = r2(months.reduce((a, x) => a + x.basic, 0) + (+S.adj || 0));
    return { person, fixed, rate, months, penalties, penaltyTotal: r2(penalties.reduce((a, p) => a + p.amount, 0)),
      saved: { adj: +S.adj || 0, adj_note: S.adj_note || "", note: S.note || "", paid_on: S.paid_on || "", updated_by: S.updated_by || "", updated_at: S.updated_at || "" },
      estimated: months.some((x) => x.src === "estimate"), total, pay: r2(total / 12) };
  });
  return out({ ok: true, year, today, people });
});
