// CupOfEnglish · coe-pkc (27 Oct 2026) · "Checking the package…" from the database (read-only).
// POST { token, op: "renew", code, teacher?, date? }  → the same answer as Google's mgmtRenewPaid({ dry: true })
// POST { token, op: "enrol", code }                  → the same answer as Google's mgmtEnrolPaid({ dry: true })
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

// ── shared logic (keep identical to tools/pkc-core.js) ──
const MS_DAY = 864e5;
const num = (v: any) => { const n = Number(v); return isFinite(n) ? n : 0; };
const ymdManila = (t: number) => new Date(t + 8 * 3600e3).toISOString().slice(0, 10);
const monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const monShort = monthName.map((m) => m.slice(0, 3));
function renewDry(L: any, f: any, nextClassYmd: (code: string, fromYmd: string) => string) {
  const code = String(f.code || "").trim().toUpperCase(), tch = String(f.teacher || "").trim().toLowerCase();
  if (!/^ST-\d{4}-\d{3}$/.test(code)) return { ok: false, msg: "No student code." };
  let cand = (L.act || []).filter((a: any) => a.c === code && a.j !== "");
  if (!cand.length) return { ok: false, msg: code + " has no package row in ACTIVE." };
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
// ── end shared logic ──

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
  if (op !== "renew" && op !== "enrol") return out({ ok: false, error: "op" }, 400);
  const [{ data: doc }, { data: W }] = await Promise.all([
    db.from("docs").select("data").eq("key", "sys:pkglink").maybeSingle(),
    db.from("writes").select("fn,status,args,done_at,created_at").in("fn", ["mgmtEnrolPaid", "mgmtRenewPaid"]).gte("created_at", new Date(Date.now() - 2 * MS_DAY).toISOString()).limit(200)]);
  const L: any = doc && doc.data; const at = L && Date.parse(L.at || "");
  if (!L || !at || Date.now() - at > 5 * 6e4) return out({ ok: false, fallback: 1, why: "copy" });
  // a payment saved in the app that the copy may not contain yet → ask Google
  const late = (W || []).some((w: any) => { const a = (w.args || [])[1] || {}; if (String(a.code || "").trim().toUpperCase() !== code && op === "renew") return false;
    if (w.status === "error" || w.status === "test") return false; if (w.status !== "done") return true; return !w.done_at || Date.parse(w.done_at) > at - 5000; });
  if (late) return out({ ok: false, fallback: 1, why: "pending" });
  if (op === "enrol") return out(Object.assign(enrolDry(L, { code }, Date.now()), { src: "db", at: L.at }));
  const nextClass = async (c: string, from: string) => {
    const { data } = await db.from("classes").select("starts_at,cancelled,data").eq("code", c).gte("starts_at", from + "T00:00:00+08:00").order("starts_at").limit(40);
    const x = (data || []).find((e: any) => !e.cancelled && !/-TC\s*$/i.test(String((e.data && e.data.title) || "").replace(/\s+X$/i, "")));
    return x ? ymdManila(Date.parse(x.starts_at)) : "";
  };
  const ymd = /^\d{4}-\d{2}-\d{2}$/.test(String(b.date || "")) ? String(b.date) : ymdManila(Date.now());
  const nc = await nextClass(code, ymd);
  return out(Object.assign(renewDry(L, { code, teacher: b.teacher, date: ymd }, () => nc), { src: "db", at: L.at }));
});
