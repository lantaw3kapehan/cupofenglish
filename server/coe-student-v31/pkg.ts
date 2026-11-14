// coe-student v3 (1353) · lessons, history and payments for the Student portal.
// Lesson numbers = management's Lesson summary exactly: the app's ACTIVE rows (sheet_rows ACTIVE, rebuilt from coe_packages /
// coe_pkg_calc every few minutes) grouped with the app's pkgGroup rule (shared packages, a second teacher on one package,
// renewals), shLeft / lsHtml totals, and the monthly history from coe_pkg_mon (patch 1196). Read-only. No prices except
// what the student was given: issued Payment Confirmations (coe_invoices, emailed to the family) and, for direct
// students only, the amount recorded in SALES. Partner-referred students: never an amount, never a partner name.
const n1 = (x: number) => Math.round((+x || 0) * 10) / 10;
const up = (s: unknown) => String(s ?? "").trim().toUpperCase();
const cd = (s: unknown) => (up(s).match(/ST-\d{4}-\d{3}/) || [""])[0];
const d10 = (x: unknown) => { const m = String(x ?? "").match(/^(\d{4}-\d{2}-\d{2})/); return m ? m[1] : ""; };
const blank = (x: unknown) => x === "" || x == null;
const num = (x: unknown) => blank(x) ? 0 : (Number(x) || 0);
const capF = (s: unknown) => { const t = String(s ?? "").trim().split(/\s+/)[0] || ""; return t ? t[0].toUpperCase() + t.slice(1) : ""; };
// partner sources look like "Jinan – Dr. Spring" (city – person); a student referral is "ST-2026-048 – Mandy"; "COE – Misty" is us
export const partnerish = (s: unknown) => { const t = String(s ?? "").trim(); return !!t && ((/\s[–-]\s/.test(t) && !/^(COE|ST-)/i.test(t)) || /universit|partner/i.test(t)); };
const DIRECT = /^(CupOfEnglish|IELTS|TOEFL|Adult English|Adult English - Ph|Reading Program|COE)?$/i;

async function pages(q: () => any) { const o: any[] = []; for (let f = 0; f < 30000; f += 1000) { const { data, error } = await q().range(f, f + 999); if (error || !data) break; o.push(...data); if (data.length < 1000) break; } return o; }

type Row = { row: number; code: string; name: string; cn: string; teacher: string; transfer: number; carry: number; inc: any; enrolled: any;
  months: Record<string, number>; sub: number; finished: number; available: any; active: boolean; start: string; deadline: string; shared: string; course: string };

export async function activeRows(db: any) {
  const A = await pages(() => db.from("sheet_rows").select("r,data").eq("tab", "ACTIVE").order("r"));
  const hdr = ((A.find((x: any) => x.r === 2) || {}).data || []) as any[];
  const ym: Record<number, string> = {}; for (let j = 10; j <= 43; j++) { const d = d10(hdr[j]); if (d) ym[j] = d.slice(0, 7); }
  const rows: Row[] = [];
  A.forEach((x: any) => { if (x.r < 5) return; const r = x.data || []; const code = up(r[0]); if (!/^ST-/.test(code)) return;
    const months: Record<string, number> = {}; Object.keys(ym).forEach((j) => { const v = num(r[+j]); if (v) months[ym[+j]] = v; });
    rows.push({ row: x.r, code, name: String(r[1] ?? ""), cn: String(r[2] ?? ""), teacher: String(r[3] ?? ""), transfer: num(r[4]), carry: num(r[5]), inc: r[8] ?? "", enrolled: blank(r[9]) ? "" : num(r[9]),
      months, sub: num(r[44]), finished: num(r[45]), available: blank(r[46]) ? "" : num(r[46]), active: r[47] === true || String(r[47]).toLowerCase() === "true",
      start: d10(r[48]), deadline: d10(r[49]), shared: String(r[50] ?? ""), course: String(r[55] ?? "") }); });
  return rows;
}

// the app's pkgGroup (app.html) — same grouping as the sheet's AU formula
function pkgGroup(R: Row[], r: Row) {
  const own = (x: Row) => x.enrolled !== "", st = (x: Row) => x.start, key = (x: Row) => cd(x.shared) || x.code;
  const RS = R.slice().sort((p, q) => p.row - q.row);
  const blockOf = (x: Row) => { const i = RS.indexOf(x); for (let j = i - 1; j >= 0; j--) { const y = RS[j]; if (key(y) !== key(x)) return null; if (own(y)) return y; } return null; };
  const ownerOf = (x: Row): Row => { if (own(x)) return x; const bo = blockOf(x); if (bo) return bo; const k = key(x), c = R.filter((y) => own(y) && key(y) === k); if (!c.length) return x;
    const s0 = st(x), same = c.filter((y) => st(y) === s0), before = c.filter((y) => st(y) && st(y) <= s0);
    const latest = (a: Row[]) => a.slice().sort((p, q) => (+q.active - +p.active) || st(q).localeCompare(st(p)))[0];
    return latest(same.length ? same : before.length ? before : c); };
  const owner = ownerOf(r), k = key(owner), M = R.filter((x) => x === owner || (key(x) === k && ownerOf(x) === owner));
  const seen: Record<number, number> = {}, out = M.filter((x) => { if (seen[x.row]) return false; seen[x.row] = 1; return true; });
  let extra = R.filter((x) => !own(x) && key(x) === k && ownerOf(x) !== owner).reduce((a, x) => a + x.finished, 0);
  if (extra && owner.available !== "") { const est = num(owner.enrolled) + owner.carry + owner.transfer - out.filter((x) => key(x) === k).reduce((a, x) => a + x.finished, 0); if (Math.abs(est - num(owner.available)) < 0.05) extra = 0; }
  const unlinked = out.filter((x) => x !== owner && key(x) !== k);
  return { owner, unlinked, extra, members: out.sort((a, b) => a === owner ? -1 : b === owner ? 1 : a.code.localeCompare(b.code)) };
}
type G = ReturnType<typeof pkgGroup>;
const shLeft = (G: G) => { const o = G.owner, others = G.unlinked.reduce((a, x) => a + x.finished, 0);
  if (o.available === "") return Math.max(0, n1(num(o.enrolled) + o.carry + o.transfer + num(o.inc) - G.members.reduce((a, x) => a + x.finished, 0)));
  return Math.max(0, n1(num(o.available) - others + (G.extra || 0))); };

// one package (group) in the Lesson summary's numbers
function summary(G: G, code: string, todayYm: string) {
  const o = G.owner, codes = [...new Set(G.members.map((x) => x.code))], shared = codes.length > 1;
  const rows0 = shared ? G.members : G.members.filter((x) => x.code === code);
  const months: Record<string, number> = {}; const mine: Record<string, number> = {};
  rows0.forEach((x) => Object.keys(x.months).forEach((m) => { months[m] = n1((months[m] || 0) + x.months[m]); if (x.code === code) mine[m] = n1((mine[m] || 0) + x.months[m]); }));
  const done = n1(rows0.reduce((a, x) => a + x.finished, 0)), enrolled = num(o.enrolled), carry = o.carry, trf = o.transfer, inc = num(o.inc);
  let total: number, left: number, over = 0;
  if (shared) { total = n1(enrolled + carry + trf + inc); left = shLeft(G); }
  else { left = o.available === "" ? n1(enrolled + carry - done) : n1(num(o.available) + (G.extra || 0)); over = left < 0 ? n1(-left) : 0; total = over ? n1(done - over) : n1(done + left); }
  const startYm = o.start.slice(0, 7), live = o.active && !(o.available !== "" && num(o.available) <= 0);
  let endYm = live ? todayYm : ""; Object.keys(months).forEach((m) => { if (months[m] > 0 && m > endYm) endYm = m; });
  const hist: { m: string; v: number; mine: number }[] = [];
  if (startYm && endYm) { let y = +startYm.slice(0, 4), mo = +startYm.slice(5, 7); for (let i = 0; i < 60; i++) { const m = y + "-" + String(mo).padStart(2, "0"); if (m > endYm) break; hist.push({ m, v: months[m] || 0, mine: mine[m] || 0 }); mo++; if (mo > 12) { mo = 1; y++; } } }
  const kids = shared ? codes.map((c) => { const R = G.members.filter((x) => x.code === c); return { code: c, name: capF(R[0].name), used: n1(R.reduce((a, x) => a + x.finished, 0)), me: c === code }; }) : [];
  const teachers = [...new Set(rows0.filter((x) => !shared || x.code === code).map((x) => capF(x.teacher)).filter(Boolean))];
  return { owner: o.code, row: o.row, shared, kids, teachers, course: o.course, start: o.start, valid: o.deadline, active: o.active,
    enrolled, carry: n1(carry), transfer: n1(trf), free: inc, total, used: done, left: over ? 0 : left, over, sub: n1(rows0.reduce((a, x) => a + x.sub, 0)),
    mine: n1(rows0.filter((x) => x.code === code).reduce((a, x) => a + x.finished, 0)), months: hist.reverse() };
}

export async function lessonsOf(db: any, code: string, R0?: Row[]) {
  const R = R0 || await activeRows(db), mine = R.filter((x) => x.code === code); if (!mine.length) return null;
  const pk = mine.filter((x) => x.enrolled !== "");
  const r = pk.filter((x) => x.active).sort((a, b) => b.start.localeCompare(a.start))[0] || pk.slice().sort((a, b) => b.start.localeCompare(a.start))[0] || mine.find((x) => x.active) || mine[0];
  const G = pkgGroup(R, r);
  // patch 1196: the monthly history from the database (coe_pkg_mon), matched by ACTIVE row + code + teacher, else code + teacher
  const codes = [...new Set([code, ...G.members.map((x) => x.code), ...pk.flatMap((p) => pkgGroup(R, p).members.map((x) => x.code))])];
  const { data: P } = await db.from("coe_packages").select("id,code,teacher,sheet_r").in("code", codes).is("removed_at", null).limit(200);
  const ids = (P || []).map((p: any) => p.id), byId: Record<string, any> = {}; (P || []).forEach((p: any) => byId[p.id] = p);
  if (ids.length) { const { data: M } = await db.from("coe_pkg_mon").select("id,m,v").in("id", ids).limit(5000);
    const byR: Record<number, Record<string, number>> = {}, byK: Record<string, Record<string, number>> = {};
    (M || []).forEach((x: any) => { const p = byId[x.id]; if (!p) return; const m = String(x.m).slice(0, 7), v = n1(Number(x.v));
      if (p.sheet_r != null) (byR[p.sheet_r] = byR[p.sheet_r] || {})[m] = v; const kk = up(p.code) + "|" + String(p.teacher || "").trim().toLowerCase(); (byK[kk] = byK[kk] || {})[m] = v; });
    const P2: Record<number, any> = {}; (P || []).forEach((p: any) => { if (p.sheet_r != null) P2[p.sheet_r] = p; });
    R.filter((x) => codes.includes(x.code)).forEach((x) => { const p = P2[x.row]; let k = p && up(p.code) === x.code && String(p.teacher || "").trim().toLowerCase() === x.teacher.trim().toLowerCase() ? byR[x.row] : null;
      if (!k) k = byK[x.code + "|" + x.teacher.trim().toLowerCase()] || null; if (k) Object.keys(k).forEach((m) => { x.months[m] = k![m]; }); });
  }
  const todayYm = new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 7);
  const cur = summary(G, code, todayYm);
  // every package of this student, oldest first (renewals, older teachers' packages, the shared one)
  const seen = new Set<number>(), list: any[] = [];
  [...pk, ...(cur.shared && !pk.includes(G.owner) ? [G.owner] : [])].forEach((p) => { const g = pkgGroup(R, p); if (seen.has(g.owner.row)) return; seen.add(g.owner.row); const s = summary(g, code, todayYm);
    list.push({ start: s.start, valid: s.valid, enrolled: s.enrolled, carry: s.carry, transfer: s.transfer, free: s.free, total: s.total, used: s.used, left: s.left, over: s.over, teachers: s.teachers, course: s.course, shared: s.shared, active: s.active, current: g.owner.row === G.owner.row, row: g.owner.row }); });
  list.sort((a, b) => a.start.localeCompare(b.start));
  return { cur, packages: list, groupCodes: codes, ownerRows: [...new Set(list.map((x) => x.row))] };
}

// since joining: first class / trial, all lessons taught (S-MONTHLY before Oct 2026, ended calendar classes from Oct 2026), teachers
export async function historyOf(db: any, code: string, dbRows: any[][]) {
  const [SM, { data: CU }] = await Promise.all([
    pages(() => db.from("sheet_rows").select("data").eq("tab", "S-MONTHLY").filter("data->>1", "eq", code).order("r")),
    db.from("coe_cls_units").select("t,m,h").eq("code", code).limit(500)]);
  const T: Record<string, number> = {}, Y: Record<string, number> = {}; let all = 0;
  SM.forEach((x: any) => { const r = x.data || [], m = d10(r[0]).slice(0, 7); if (!m || m >= "2026-10") return; const h = num(r[6]); if (!h) return; all += h; Y[m.slice(0, 4)] = (Y[m.slice(0, 4)] || 0) + h; const t = capF(r[3]); if (t) T[t] = (T[t] || 0) + h; });
  (CU || []).forEach((x: any) => { const m = String(x.m).slice(0, 7); if (m < "2026-10") return; const h = Number(x.h) || 0; if (!h) return; all += h; Y[m.slice(0, 4)] = (Y[m.slice(0, 4)] || 0) + h; const t = capF(x.t); if (t) T[t] = (T[t] || 0) + h; });
  let trial = "", trialT = "", first = "";
  dbRows.forEach((r) => { const t = d10(r[10]); if (t && (!trial || t < trial)) { trial = t; trialT = capF(r[14]); } const f = d10(r[16]); if (f && (!first || f < first)) first = f; });
  return { trial, trialTeacher: trialT, first, total: n1(all), years: Object.keys(Y).sort().map((y) => ({ y, v: n1(Y[y]) })),
    teachers: Object.keys(T).map((t) => ({ name: t, v: n1(T[t]) })).sort((a, b) => b.v - a.v) };
}

// payments: issued Payment Confirmations (what the family received) + SALES rows linked from this student's packages
export async function paymentsOf(db: any, code: string, L: any, partnerStudent: boolean, name: string, cn: string) {
  const codes: string[] = L ? L.groupCodes : [code];
  const [{ data: INV }, { data: PL }] = await Promise.all([
    db.from("coe_invoices").select("no,day,code,bill_name,items,total,paid,currency,method,status,ver").in("code", codes).neq("status", "void").order("no").limit(100),
    db.from("docs").select("act:data->act").eq("key", "sys:pkglink").maybeSingle()]);
  const act: any[] = Array.isArray(PL && (PL as any).act) ? (PL as any).act : [];
  // links from this student's own package rows and the rows of the shared package(s) they use
  const rowsWanted = new Set<number>(L ? L.ownerRows : []);
  const links = act.filter((a) => up(a.c) === code || rowsWanted.has(+a.r)).filter((a) => +a.link > 0);
  const lr = [...new Set(links.map((a) => +a.link))];
  const { data: LED } = lr.length ? await db.from("coe_ledger").select("sheet_r,data").eq("kind", "sale").is("removed_at", null).in("sheet_r", lr) : { data: [] };
  const invNos = new Set((INV || []).map((x: any) => +x.no)), out: any[] = [];
  (INV || []).forEach((x: any) => { const items = (Array.isArray(x.items) ? x.items : []).map((i: any) => ({ name: String(i.name || ""), zh: String(i.zh || ""), descr: String(i.descr || ""), qty: Number(i.qty) || 0, amt: Number(i.amt) || 0, bonus: /^BONUS/i.test(String(i.pcode || "")) || !(Number(i.amt) > 0) }));
    const lessons = items.filter((i: any) => !i.bonus).reduce((a: number, i: any) => a + i.qty, 0), free = items.filter((i: any) => i.bonus).reduce((a: number, i: any) => a + i.qty, 0);
    out.push({ kind: "confirmation", no: x.no, day: x.day, lessons, free, items, amount: Number(x.paid ?? x.total) || 0, total: Number(x.total) || 0, cur: x.currency === "PHP" ? "PHP" : "CNY",
      method: String(x.method || ""), bill: String(x.bill_name || ""), shared: x.code !== code, verify: x.ver ? "https://app.cupofenglishatph.com/verify/?no=" + x.no + "&c=" + x.ver : "" }); });
  (LED || []).forEach((x: any) => { const r = x.data || [], m = String(r[1] || "").match(/(\d{3,5})/), inv = m ? +m[1] : 0; if (inv && invNos.has(inv)) return;
    const a = links.find((l) => +l.link === +x.sheet_r), hide = partnerStudent || partnerish(r[4]) || !DIRECT.test(String(r[4] || "").trim());
    const rmb = num(r[6]), php = num(r[7]);
    out.push({ kind: "sale", no: hide ? null : (inv || null), day: d10(r[0]), lessons: num(r[2]), free: num(r[3]), amount: hide ? null : (rmb || php || null), cur: rmb ? "CNY" : "PHP",
      method: hide ? "" : String(r[5] || ""), shared: a ? up(a.c) !== code : false, transfer: false }); });
  // packages that came by transfer (no payment of their own)
  (L ? L.packages : []).forEach((p: any) => { if (p.transfer && !out.some((o) => o.day && p.start && Math.abs(Date.parse(o.day) - Date.parse(p.start)) < 3 * 864e5)) out.push({ kind: "transfer", day: p.start, lessons: Math.abs(p.transfer), free: 0, amount: null, transferIn: p.transfer > 0 }); });
  out.sort((a, b) => String(b.day).localeCompare(String(a.day)));
  const tot: Record<string, number> = {}; if (!partnerStudent) out.forEach((o) => { if (o.amount) tot[o.cur] = n1((tot[o.cur] || 0) + o.amount); });
  return { rows: out, total: tot, partner: partnerStudent, student: { name, cn } };
}
