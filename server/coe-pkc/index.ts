// CupOfEnglish · coe-pkc v7 (26 Nov 2026: + pkgcheck; v6 lessons left from the database renewal) · first 27 Oct 2026 · "Checking the package…" from the database (read-only).
// POST { token, op: "renew", code, teacher?, date?, row? }  → the same answer as Google's mgmtRenewPaid({ dry: true })
// POST { token, op: "enrol", code }                  → the same answer as Google's mgmtEnrolPaid({ dry: true })
// 2249 (15 Nov): "row" picks one ACTIVE row when a student has two packages with the same teacher (Merlin: Reading / Writing);
//   the renew answer also lists "alts" (every package of the student: row, course, teacher, lessons left) for the app's chooser.
// Management only. Built from docs sys:pkglink (Google copies ACTIVE incl. column-J SALES links, recent SALES and DATABASE names
// every ~2 min and right after every Enrolled · paid / Renewed · paid save — paste SERVER-PKGLINK27). Answers { ok:false, fallback:1 }
// (the app then asks Google exactly as before) when the copy is older than 5 minutes, or when an Enrolled · paid / Renewed · paid
// save is still waiting in the queue / was finished after the copy. The deadline uses the database calendar copy (classes).
// Checked before release (27 Oct 13:15) against Google's own dry runs for all 236 ACTIVE students (309 code+teacher pairs): identical.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }

const MS_DAY = 864e5;
const num = (v: any) => { const n = Number(v); return isFinite(n) ? n : 0; };
const ymdManila = (t: number) => new Date(t + 8 * 3600e3).toISOString().slice(0, 10);
const monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const monShort = monthName.map((m) => m.slice(0, 3));
function renewDry(L: any, f: any, nextClassYmd: (code: string, fromYmd: string) => string) {
  const code = String(f.code || "").trim().toUpperCase(), tch = String(f.teacher || "").trim().toLowerCase(), row = num(f.row);
  if (!/^ST-\d{4}-\d{3}$/.test(code)) return { ok: false, msg: "No student code." };
  let cand = (L.act || []).filter((a: any) => a.c === code && a.j !== "");
  if (!cand.length) return { ok: false, msg: code + " has no package row in ACTIVE." };
  if (row > 0) { const r = cand.filter((a: any) => num(a.r) === row); if (r.length) cand = r; }   // 2249
  if (tch && cand.length > 1) { const t = cand.filter((a: any) => String(a.t).trim().toLowerCase() === tch); if (t.length) cand = t; }
  const ti = cand.filter((a: any) => a.av === true);
  const pick = (ti.length ? ti : cand).map((a: any, i: number) => [a, i]).sort((x: any, y: any) => (y[0].aw || 0) - (x[0].aw || 0) || x[1] - y[1])[0][0];
  const ymd = /^\d{4}-\d{2}-\d{2}$/.test(String(f.date || "")) ? String(f.date) : ymdManila(Date.now());
  const ym = ymd.slice(0, 7), mi = (L.hdr || []).indexOf(ym), y = +ymd.slice(0, 4), mo = +ymd.slice(5, 7);
  if (mi < 0) return { ok: false, msg: "ACTIVE has no " + monthName[mo - 1] + " " + y + " column yet. Add the month column first, then try again." };
  const avail = num(pick.au), monthSoFar = num((pick.m || [])[mi]);
  const s = pick.link ? (L.sales || []).find((x: any) => x.row === pick.link) : null;
  const old = s ? [s.d, s.inv, s.pkg, s.free, s.partner, s.method] : ["", "", "", "", "", ""];
  const pkg = f.pkg === "" || f.pkg == null ? num(old[2]) : num(f.pkg), free = f.free === "" || f.free == null ? num(old[3]) : num(f.free), tot = pkg + free;
  const nc = nextClassYmd(code, ymd) || ymd, months = tot < 30 ? 4 : tot < 60 ? 8 : 12;
  const dl = new Date(Date.UTC(+nc.slice(0, 4), +nc.slice(5, 7) - 1 + months, +nc.slice(8, 10))).toISOString().slice(0, 10);
  return {
    ok: true, row: pick.r, teacher: String(pick.t), name: String(pick.n), left: avail, pkg, free, total: Math.round((avail + tot) * 10) / 10,
    deadline: dl, partner: String(f.partner != null && f.partner !== "" ? f.partner : old[4] || ""), method: String(f.method != null && f.method !== "" ? f.method : old[5] || ""),
    prev: { pkg: num(old[2]), free: num(old[3]), date: s ? String(s.d || "") : "", invoice: String(old[1] || "") }, monthSoFar, month: monShort[mo - 1] + " " + y,
  };
}
function enrolDry(L: any, f: any, now: number) {
  const code = String(f.code || "").trim().toUpperCase();
  if (!/^ST-\d{4}-\d{3}$/.test(code)) return { ok: false, msg: "No student code." };
  const linked: Record<number, number> = {}; (L.act || []).forEach((a: any) => { if (a.link) linked[a.link] = 1; }); (L.linkTop || []).forEach((r: number) => { linked[r] = 1; });
  const since = now - 45 * MS_DAY;
  let sales = (L.sales || []).filter((x: any) => x.d && Date.parse(x.d + "T00:00:00+08:00") >= since && !linked[x.row] && num(x.pkg) > 0)
    .map((x: any) => ({ row: x.row, date: x.d, invoice: String(x.inv || ""), pkg: num(x.pkg), free: num(x.free), partner: String(x.partner || ""), method: String(x.method || "") }));
  sales = sales.map((x: any, i: number) => [x, i]).sort((a: any, b: any) => b[0].date.localeCompare(a[0].date) || a[1] - b[1]).map((p: any) => p[0]).slice(0, 12);
  const d = (L.db || {})[code];
  return { ok: true, code, name: d ? d.name : "", cn: d ? d.cn : "", sales, firstClass: d ? d.fc : "", dbRow: d ? d.row : 0 };
}

Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: s } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!s || new Date(s.exp).getTime() < Date.now() || s.mode !== "mgmt") return out({ ok: false, error: "AUTH" }, 401);
  const op = String(b.op || ""), code = String(b.code || "").trim().toUpperCase();
  if (op !== "renew" && op !== "enrol" && op !== "pkgcheck") return out({ ok: false, error: "op" }, 400);
  const [{ data: doc }, { data: W }] = await Promise.all([
    db.from("docs").select("data").eq("key", "sys:pkglink").maybeSingle(),
    db.from("writes").select("fn,status,args,done_at,created_at").in("fn", ["mgmtEnrolPaid", "mgmtRenewPaid"]).gte("created_at", new Date(Date.now() - 2 * MS_DAY).toISOString()).limit(200)]);
  const L: any = doc && doc.data; const at = L && Date.parse(L.at || "");
  if (!L || !at || Date.now() - at > 5 * 6e4) return out({ ok: false, fallback: 1, why: "copy" });
  const late = (W || []).some((w: any) => { const a = (w.args || [])[1] || {}; if (String(a.code || "").trim().toUpperCase() !== code && op === "renew") return false;
    if (w.status === "error" || w.status === "test") return false; if (w.status !== "done") return true; return !w.done_at || Date.parse(w.done_at) > at - 5000; });
  if (late) return out({ ok: false, fallback: 1, why: "pending" });
  if (op === "enrol") return out(Object.assign(enrolDry(L, { code }, Date.now()), { src: "db", at: L.at }));
  if (op === "pkgcheck") {   // v7 (26 Nov · app 3058): Google's mgmtPkgCheck from the database copy — a package whose linked payment is in a later month than its start
    const ym = (t: number) => t ? new Date(t + 8 * 3600e3).toISOString().slice(0, 7) : "", H: string[] = L.hdr || [], rows: any[] = [];
    (L.act || []).forEach((a: any) => { if (!a.link || !a.c) return; const sale = (L.sales || []).find((x: any) => x.row === a.link); if (!sale || !sale.d) return;
      const sy = String(sale.d).slice(0, 7), ty = ym(num(a.aw)); if (!ty || sy <= ty) return;
      let pre = 0; H.forEach((y: string, j: number) => { if (y && y >= "2025-01" && y >= ty && y < sy) pre += num((a.m || [])[j]); });
      rows.push({ row: a.r, code: a.c, name: a.n, teacher: a.t, invoice: String(sale.inv || ""), paid: String(sale.d).slice(0, 10), start: new Date(num(a.aw) + 8 * 3600e3).toISOString().slice(0, 10), pre: Math.round(pre * 10) / 10, available: a.au }); });
    return out({ ok: true, rows, src: "db", at: L.at });
  }
  const nextClass = async (c: string, from: string) => {
    const { data } = await db.from("classes").select("starts_at,cancelled,data").eq("code", c).gte("starts_at", from + "T00:00:00+08:00").order("starts_at").limit(40);
    const x = (data || []).find((e: any) => !e.cancelled && !/-TC\s*$/i.test(String((e.data && e.data.title) || "").replace(/\s+X$/i, "")));
    return x ? ymdManila(Date.parse(x.starts_at)) : "";
  };
  const ymd = /^\d{4}-\d{2}-\d{2}$/.test(String(b.date || "")) ? String(b.date) : ymdManila(Date.now());
  const [nc, { data: P }] = await Promise.all([nextClass(code, ymd),
    db.from("coe_packages").select("sheet_r,course,teacher,active").eq("code", code).is("removed_at", null).not("enrolled", "is", null).order("sheet_r")]);
  const leftOf = (r: number) => { const a = (L.act || []).find((x: any) => x.c === code && num(x.r) === r); return a ? num(a.au) : null; };
  const alts = (P || []).map((p: any) => ({ row: p.sheet_r, course: String(p.course || ""), teacher: String(p.teacher || ""), active: !!p.active, left: leftOf(num(p.sheet_r)) }));
  const A: any = renewDry(L, { code, teacher: b.teacher, date: ymd, row: b.row }, () => nc);
  // 26 Nov (v6 · app 3054, Misty: "isn't everything on the database?"): the renewal itself is saved by the database (coe_renew_db ›
  // coe_renew_preview), so the form now shows the database's own "lessons left" — the number that will be saved as carried over —
  // not the sheet copy's (Yoyo: the copy said 3.5 and the save gave 4). The rest (name, last sale, partner, method) still comes from the copy.
  if (A && A.ok) { try {
    const { data: pv } = await db.rpc("coe_renew_preview", { p_code: code, p_teacher: String(A.teacher || b.teacher || "") + (A.row ? "|" + A.row : ""), p_date: ymd, p_pkg: null, p_free: null, p_at: new Date().toISOString() });
    if (pv && pv.ok && pv.left != null && isFinite(Number(pv.left))) { const dl = Number(pv.left); if (Math.abs(dl - num(A.left)) > 0.01) A.sheetLeft = A.left; A.left = dl; A.total = Math.round((dl + num(A.pkg) + num(A.free)) * 10) / 10; A.dbLeft = true; }
  } catch (_e) { /* keep the copy's answer */ } }
  return out(Object.assign(A, { alts, src: "db", at: L.at }));
});
