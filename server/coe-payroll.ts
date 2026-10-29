import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
const isD = (x: unknown) => typeof x === "string" && ISO.test(x);
async function loadTab(db: any, tab: string) {
  const v: any[][] = [];
  for (let from = 0; from < 50000; from += 1000) {   // the API returns at most 1000 rows at a time
    const { data, error } = await db.from("sheet_rows").select("r,data").eq("tab", tab).order("r", { ascending: true }).range(from, from + 999);
    if (error) throw new Error("db");
    for (const x of data || []) v[x.r - 1] = x.data || [];
    if (!data || data.length < 1000) break;
  }
  for (let i = 0; i < v.length; i++) if (!v[i]) v[i] = [];
  return v;
}
const cell = (r: any[], j: number) => r[j] === undefined || r[j] === null ? "" : r[j];
const num = (x: any) => { const n = Number(x); return isFinite(n) ? n : 0; };
const MONL = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const WDL = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
function dTok(iso: string) {
  const y = iso.slice(0, 4), mo = +iso.slice(5, 7), d = +iso.slice(8, 10), H = +iso.slice(11, 13), mi = iso.slice(14, 16), se = iso.slice(17, 19);
  const wd = new Date(Date.UTC(+y, mo - 1, d)).getUTCDay(), h12 = H % 12 || 12;
  return [["yyyy", y], ["MMMM", MONL[mo - 1]], ["EEEE", WDL[wd]], ["MMM", MONL[mo - 1].slice(0, 3)], ["EEE", WDL[wd].slice(0, 3)], ["yy", y.slice(2)],
    ["M", String(mo)], ["d", String(d)], ["H", String(H)], ["h", String(h12)],
    ["MM", String(mo).padStart(2, "0")], ["dd", String(d).padStart(2, "0")], ["HH", String(H).padStart(2, "0")], ["hh", String(h12).padStart(2, "0")],
    ["mm", mi], ["ss", se], ["a", H < 12 ? "AM" : "PM"]] as [string, string][];
}
function dTemplates(iso: string, disp: string) {
  const T = dTok(iso), out: string[][] = [];
  const go = (pos: number, acc: string[]) => { if (out.length > 60) return; if (pos >= disp.length) { out.push(acc); return; }
    let any = false; for (const [k, v] of T) if (v && disp.startsWith(v, pos)) { any = true; go(pos + v.length, acc.concat(["{" + k + "}"])); }
    if (!/[0-9A-Za-z]/.test(disp[pos]) || !any) go(pos + 1, acc.concat([disp[pos]])); };
  go(0, []); return out.map((a) => a.join(""));
}
const dApply = (tpl: string, iso: string) => { const T: Record<string, string> = Object.fromEntries(dTok(iso)); return tpl.replace(/\{(\w+)\}/g, (_m, k) => T[k] ?? ""); };
function nTemplate(disp: string) {
  const m = disp.match(/^(-?)([^\d\-.]*?)(-?)(\d{1,3}(?:,\d{3})+|\d+)(?:\.(\d+))?(%?)$/); if (!m) return null;
  return { pre: m[2], comma: m[4].indexOf(",") > -1, dec: m[5] ? m[5].length : 0, pct: m[6] === "%", negOut: m[1] === "-" };
}
function nApply(t: any, n: number, general: boolean) {
  let v = t.pct ? n * 100 : n; const neg = v < 0; v = Math.abs(v);
  let s = general ? String(Math.round(v * 1e9) / 1e9) : v.toFixed(t.dec);
  if (t.comma) { const [a, b] = s.split("."); s = a.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (b ? "." + b : ""); }
  s = t.pre + s + (t.pct ? "%" : ""); return neg ? (t.negOut ? "-" + s : s.replace(t.pre, t.pre + "-")) : s;
}
// rows: raw copy rows; brows: Google's displayed rows for the same records (same order) → formatter(row, j) or null.
// A column takes the format of its newest cell; older cells formatted differently by hand keep Google's own display
// as long as that row is unchanged.
const odd = (x: any) => typeof x === "string" && /^\d{5,}-\d{2}-\d{2}T00:00:00$/.test(x) ? x.slice(0, -9) : x;   // a typed date past year 9999 (20221-01-10)
const okTpl = (a: string, b: string) => dTemplates(a, b).some((t) => !/[0-9A-Za-z]/.test(t.replace(/\{\w+\}/g, "")));   // the shown date is this date (only the format differs)
const numOk = (b: string, a: number) => { const t = nTemplate(b); if (!t) return false; const v = Number(b.replace(/[^\d.\-]/g, "")) / (t.pct ? 100 : 1);   // the shown number is this number (rounded as shown)
  return Math.abs(Math.abs(v) - Math.abs(a)) <= 0.5 * Math.pow(10, -t.dec) / (t.pct ? 100 : 1) + 1e-9; };
function learnFmt(rows: any[][], brows: any[][], cols: number) {
  const fm: any[] = [], over: Record<string, string> = {}, rk = (r: any[]) => JSON.stringify(r);
  // a pair is only used when its words are the same in both (the same record, not a row that moved)
  const same = rows.map((r, i) => { const b = brows[i] || []; for (let j = 0; j < cols; j++) { const x = cell(r || [], j); if (typeof x === "string" && x !== "" && !isD(x) && String(b[j] ?? "").replace(/^Go →$/, "") !== odd(x).replace(/^Go →$/, "")) return false; } return !!brows[i]; });
  for (let j = 0; j < cols; j++) {
    const ds: [string, string, number][] = [], ns: [number, string, number][] = [];
    for (let i = 0; i < Math.min(rows.length, brows.length); i++) { if (!same[i]) continue; const x = cell(rows[i] || [], j), y = String((brows[i] || [])[j] ?? "");
      if (isD(x) && y) ds.push([x, y, i]); else if (typeof x === "number" && y) ns.push([x, y, i]); }
    const f: any = {};
    if (ds.length) {
      const C = dTemplates(ds[0][0], ds[0][1]);   // the newest record's format (new rows are written the same way)
      let best = "", bn = -1; C.forEach((t) => { const n = ds.filter(([a, b]) => dApply(t, a) === b).length; if (n > bn) { bn = n; best = t; } });
      if (!best || bn < Math.ceil(ds.length * 0.3)) return null; f.d = best;
      ds.forEach(([a, b, i]) => { if (dApply(best, a) !== b && okTpl(a, b)) over[rk(rows[i]) + "|" + j] = b; });   // a changed value is not kept from the old copy
    }
    if (ns.length) {
      const T = ns.map(([, b]) => nTemplate(b)); if (T.some((t) => !t)) { /* odd cells counted below */ }
      const ok = T.filter(Boolean) as any[]; if (!ok.length) return null;
      const pos = ns.map(([a], k) => [a, T[k]] as [number, any]).filter(([a, t]) => t && a >= 0).map(([, t]) => t);
      const preC: Record<string, number> = {}; (pos.length ? pos : ok).forEach((t: any) => preC[t.pre] = (preC[t.pre] || 0) + 1);
      const pre = Object.keys(preC).sort((x, y) => preC[y] - preC[x])[0];
      const dc: Record<number, number> = {}; ok.forEach((q: any) => dc[q.dec] = (dc[q.dec] || 0) + 1);
      const decs = Object.keys(dc).map(Number).sort((x, y) => dc[y] - dc[x]), negT = ns.map(([a], k) => [a, T[k]] as [number, any]).find(([a, t]) => a < 0 && t);
      const t = { pre, comma: ok.some((q: any) => q.comma), dec: decs[0], pct: ok.some((q: any) => q.pct), negOut: negT ? negT[1].negOut : true };
      const gen = !t.pre && !t.pct && (decs.length > 1 || t.dec === 0);
      const good = ns.filter(([a, b]) => nApply(t, a, gen) === b).length; if (good < Math.ceil(ns.length * 0.3)) return null;
      ns.forEach(([a, b, i]) => { if (nApply(t, a, gen) !== b && numOk(b, a)) over[rk(rows[i]) + "|" + j] = b; });
      f.n = t; f.gen = gen;
    }
    fm.push(f);
  }
  return (row: any[], j: number) => { const x = cell(row, j); if (x === "" || x == null) return ""; const o = over[rk(row) + "|" + j]; if (o !== undefined) return o;
    if (x === true) return "TRUE"; if (x === false) return "FALSE";
    const f = fm[j] || {}; if (isD(x)) { if (!f.d) throw new Error("fmt"); return dApply(f.d, x); }
    if (typeof x === "number") { if (!f.n) { if (Number.isInteger(x)) return String(x); throw new Error("fmt"); } return nApply(f.n, x, f.gen); } return String(odd(x)); };
}

// 29 Oct · release 1606 · Finance › Payroll from the database (the server's mgmtPayroll_ after the PAYROLL28 paste):
// rows of PAYROLL from row 4 with a name and any pay (units, lesson pay, base, bonus, gross or net), shown exactly as Google
// shows them (formats learnt from Google's last answer). Management only (pay is never shown to anyone else).
// Checked 29 Oct 10:06 against Google's answer: 633 rows, 0 differences.
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
const pn = (x: any) => typeof x === "number" ? x : Number(String(x ?? "").replace(/[^\d.\-]/g, "")) || 0;
Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || ""), out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: s } = await db.from("app_sessions").select("name,role,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
  if (s.mode !== "mgmt" || !/ops|operation|manag|admin|president/i.test(String(s.role || ""))) return out({ ok: false, error: "Management only" }, 403);
  try {
    const t0 = Date.now();
    const { data: B } = await db.from("docs").select("key,data,updated_at").in("key", ["pres:mgmtPayroll|[]", "mgmt:mgmtPayroll|[]"]);
    const base = (B || []).filter((x: any) => x.data && Array.isArray(x.data.rows) && Array.isArray(x.data.head)).sort((x: any, y: any) => Date.parse(y.updated_at) - Date.parse(x.updated_at))[0];
    if (!base) return out({ ok: false, fallback: true, why: "no Google copy to learn the format from" });
    const { data: st } = await db.from("sheet_tabs").select("synced_at").eq("tab", "PAYROLL").maybeSingle();
    const at = st ? Date.parse(st.synced_at) : 0;
    if (!at || Date.now() - at > 15 * 6e4) return out({ ok: false, fallback: true, why: "PAYROLL copy older than 15 min" });
    const v = await loadTab(db, "PAYROLL"), raw = v.slice(3).map((r) => r || []).filter((r) => cell(r, 1) !== "" && [3, 4, 5, 6, 8, 9, 15, 16].some((j) => pn(cell(r, j)) !== 0));
    const F = learnFmt(raw.slice(0, base.data.rows.length), base.data.rows, 18); if (!F) return out({ ok: false, fallback: true, why: "format" });
    let data: any; try { data = { head: Array.from({ length: 18 }, (_x, j) => F(v[0] || [], j)), rows: raw.map((r) => Array.from({ length: 18 }, (_x, j) => F(r, j))) }; }
    catch (_e) { return out({ ok: false, fallback: true, why: "format" }); }
    return out({ ok: true, data, at: new Date(at).toISOString(), ms: Date.now() - t0 });
  } catch (e) { return out({ ok: false, fallback: true, why: String((e as Error).message || e) }); }
});
