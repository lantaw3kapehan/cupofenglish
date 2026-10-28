// 27 Oct · 1356 · renewal month guard (shared by coe-student and coe-partner; keep both copies identical).
// A package's carry-over is what was left ON the renewal day, so its renewal month may only count lessons taught on/after
// the renewal date. A current package that started after the 1st is "being checked" (核对中) when its renewal month counts a
// different number than the units taught from the renewal date (DAILY tabs), unless a kept sheet fix (fin_adj) already
// takes the difference off. It clears by itself once ACTIVE is corrected (SERVER-RENEWSTART27 paste).
// Read-only: coe_packages, coe_pkg_mon, sheet_rows (<MONTH>-DAILY tabs), coe_renew_at, coe_cls_days (1540).
// 1546 · held only where the numbers really disagree: from Oct 2026 the taught units come from the calendar (coe_cls_days, the
// counter's own source), a teacher row is split at its own start day, a row with no DAILY record that month is not compared
// (nothing to compare with), and with no payment time recorded the start-day classes may sit on either side.
let RF: { at: number; p: Promise<Map<string, any>> } | null = null;
async function pages(q: (a: number, b: number) => any) {
  const out: any[] = []; for (let a = 0; ; a += 1000) { const { data, error } = await q(a, a + 999); if (error) throw new Error(error.message); out.push(...(data || [])); if (!data || data.length < 1000) break; } return out;
}
const num = (x: unknown) => { const s = String(x ?? "").replace(/[^0-9.\-]/g, ""); return /^-?[0-9]*\.?[0-9]+$/.test(s) ? Number(s) : 0; };
const ymd = (d: Date) => d.toISOString().slice(0, 10);
async function build(db: any) {
  const today = new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10);
  const P = await pages((a, b) => db.from("coe_packages").select("id,code,name,teacher,buy,enrolled,active,shared,fin_adj").is("removed_at", null).order("id").range(a, b));
  const own = P.filter((p) => p.enrolled != null && p.active && p.buy && +p.buy.slice(8, 10) > 1 && p.buy <= today);
  const mem = new Map<string, any[]>();
  const pk = (c: any) => String(c.shared || "").trim() || c.code;
  own.forEach((o) => mem.set(o.id, P.filter((c) => c.id === o.id || (c.enrolled == null && pk(c) === o.code))
    .filter((c) => c.id === o.id || !P.some((z) => z.code === c.code && String(z.teacher).toLowerCase() === String(c.teacher).toLowerCase() && z.id !== c.id && z.buy && z.buy > o.buy))));
  const ids = new Set<string>(); mem.forEach((l) => l.forEach((c) => ids.add(c.id)));
  const M = await pages((a, b) => db.from("coe_pkg_mon").select("id,m,v").order("id").order("m").range(a, b));
  const mon = new Map<string, number>(); M.forEach((x: any) => { if (ids.has(x.id)) mon.set(x.id + "|" + x.m, (mon.get(x.id + "|" + x.m) || 0) + (Number(x.v) || 0)); });
  // DAILY tabs: row 1 col 4 = the 1st of the month; day columns 4..34; col 0 code, col 2 teacher
  const D = await pages((a, b) => db.from("sheet_rows").select("tab,r,data").ilike("tab", "%DAILY").order("tab").order("r").range(a, b));
  const head = new Map<string, string>(); D.forEach((x: any) => { if (x.r === 1) { const s = String(x.data?.[4] || "").slice(0, 10); if (/^\d{4}-\d{2}-01$/.test(s)) head.set(x.tab, s); } });
  const units = new Map<string, [string, number][]>();   // code|teacher → [yyyy-mm-dd, units]
  D.forEach((x: any) => { const m0 = head.get(x.tab); if (!m0 || x.r < 3 || !/^ST-/.test(String(x.data?.[0] || ""))) return;
    const code = String(x.data[0]).trim().toUpperCase(), t = String(x.data[2] || "").trim().toLowerCase(), base = new Date(m0 + "T00:00:00Z");
    for (let j = 4; j <= 34; j++) { const v = num(x.data[j]); if (v <= 0) continue; const d = new Date(base.getTime() + (j - 4) * 864e5); if (ymd(d).slice(0, 7) !== m0.slice(0, 7)) continue;
      const k = code + "|" + t; if (!units.has(k)) units.set(k, []); units.get(k)!.push([ymd(d), v]); } });
  // 1540 · a class on the start day that ended before the renewal was recorded belongs to the OLD package (coe_cls_days.hb)
  const RA = await pages((a, b) => db.from("coe_renew_at").select("code,buy").order("code").order("buy").range(a, b));
  const PAID = new Set<string>(RA.map((x: any) => String(x.code).toUpperCase() + "|" + String(x.buy).slice(0, 10)));
  const HB = new Map<string, number>(), cal = new Map<string, [string, number][]>(), CAL = "2026-10";   // 1546: calendar months
  const CD = await pages((a, b) => db.from("coe_cls_days").select("code,t,day,h,hb").order("code").order("t").order("day").range(a, b));
  CD.forEach((x: any) => { const k = String(x.code).toUpperCase() + "|" + String(x.t || "").toLowerCase(), d = String(x.day).slice(0, 10);
    if (!cal.has(k)) cal.set(k, []); cal.get(k)!.push([d, Number(x.h) || 0]); if (Number(x.hb) > 0) HB.set(k + "|" + d, Number(x.hb)); });
  const out = new Map<string, any>();
  own.forEach((o) => { const mo = o.buy.slice(0, 7), m1 = mo + "-01"; let c = 0, pre = 0, post = 0, bd = 0, fa = 0; const codes = new Set<string>([o.code]);
    const paid = PAID.has(String(o.code).toUpperCase() + "|" + String(o.buy).slice(0, 10));
    (mem.get(o.id) || []).forEach((r) => { codes.add(r.code); fa += Number(r.fin_adj) || 0; const t = String(r.teacher || "").trim().toLowerCase(), k = String(r.code).toUpperCase() + "|" + t;
      const U = ((mo >= CAL ? cal : units).get(k) || []).filter(([d]) => d.slice(0, 7) === mo && d <= today);   // 1540: planned (future) DAILY days are not taught yet
      if (!U.length && mo < CAL) return;   // 1546: no DAILY record for this teacher row that month: nothing to compare with
      c += mon.get(r.id + "|" + m1) || 0;
      const sb = r.buy && String(r.buy).slice(0, 7) === mo ? String(r.buy).slice(0, 10) : o.buy;   // 1546: the row's counter starts at its own start day
      U.forEach(([d, v]) => { if (d < sb) pre += v; else { post += v; if (d === sb) bd += v; } });
      const hb = HB.get(k + "|" + sb) || 0; if (hb) { pre += hb; post -= hb; bd -= hb; } });
    const r1 = (x: number) => Math.round(x * 10) / 10; c = r1(c); pre = r1(pre); post = r1(post); bd = r1(bd); fa = r1(fa);
    // 1546: with no payment time recorded, start-day classes count on either side (RULES-renewals: the payment time decides)
    const fits = (x: number) => Math.abs(x - post) <= 0.01 || (!paid && x >= post - bd - 0.01 && x <= post + 0.01);
    if (pre > 0 && !fits(c) && !fits(c + fa))
      codes.forEach((cd) => out.set(cd, { owner: o.code, buy: o.buy, counted: c, before: pre, from: post, adj: fa })); });
  return out;
}
// code → { owner, buy, counted, before, from, adj } for every code whose current package's renewal month is not yet from the renewal date
export function renewFlags(db: any): Promise<Map<string, any>> {
  if (!RF || Date.now() - RF.at > 120e3) { const p = build(db); RF = { at: Date.now(), p }; p.catch(() => { RF = null; }); }
  return RF.p;
}
