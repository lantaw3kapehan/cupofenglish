// CupOfEnglish · coe-partner-fix v1 (12 Nov 2026, 2140) · partner portal "每周固定 · Every week" view.
// Misty 15:40: "WHEN THEY CHECK SCHEDULE SHE ONLY SEES THE CURRENT WEEK? SO SHE HAS TO ASK THE WHOLE EVERYTIME THERE'S A SUCCESSFUL TRIAL CLASS"
// For each teacher and weekday (Mon..Sun from tomorrow), every 30-min slot inside the teacher's hours is checked on the same weekday for
// the next N weeks:  open = free every week · later = booked now but free every week from a date (e.g. a package ending) · booked = otherwise.
// Same sources as coe-partner's week op: teaching hours + calendar busy times management last loaded (docs mgmtAvailAll / mgmtAvail),
// approved whole-day leave (a leave day does not make a slot busy), and the classes table (not cancelled, pending adds count).
// Nothing private: no student names or codes, only times. Partner session token required.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
const hex = (b: ArrayBuffer) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
const sha = async (t: string) => hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)));
const N = 8, LEN = 25;
const MON3: Record<string, string> = { jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06", jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12" };
function ymd(v: any): string { const t = String(v ?? "").trim(); let m = t.match(/^(\d{4}-\d{2}-\d{2})/); if (m) return m[1];
  m = t.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/); if (m && MON3[m[2].toLowerCase()]) return m[3] + "-" + MON3[m[2].toLowerCase()] + "-" + m[1].padStart(2, "0"); return ""; }
const wd = (d: string) => (new Date(Date.parse(d + "T12:00:00+08:00") + 8 * 3600e3).getUTCDay() + 6) % 7;
const dayAt = (d: string, n: number) => new Date(Date.parse(d + "T12:00:00+08:00") + n * 864e5 + 8 * 3600e3).toISOString().slice(0, 10);
const toMin = (x: string) => { const q = String(x || "").trim().match(/^(\d{1,2}):(\d{2})$/); return q ? +q[1] * 60 + +q[2] : null; };
const hhmm = (m: number) => String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0");
async function pages(mk: () => any, max = 30000) { const out: any[] = []; for (let f = 0; f < max; f += 1000) { const { data, error } = await mk().range(f, f + 999); if (error || !data) break; out.push(...data); if (data.length < 1000) break; } return out; }
async function availDocs() {   // same rule as coe-partner: per teacher the most recently fetched copy wins
  const [{ data: A }, { data: O }] = await Promise.all([
    db.from("docs").select("key,updated_at,data").like("key", "mgmt:mgmtAvailAll|%").order("updated_at", { ascending: false }).limit(30),
    db.from("docs").select("key,updated_at,data").like("key", "mgmt:mgmtAvail|%").order("updated_at", { ascending: false }).limit(80)]);
  const H: Record<string, { name: string; days: string[]; busy: [number, number][]; at: number }> = {};
  const add = (name: string, days: any, busy: any, at: number) => { const k = String(name || "").toLowerCase(); if (!k || !Array.isArray(days) || (H[k] && H[k].at >= at)) return;
    H[k] = { name: String(name), days: days.slice(0, 7).map((x: any) => String(x || "")), busy: (Array.isArray(busy) ? busy : []).map((b: any) => [Date.parse(b.s), Date.parse(b.e)] as [number, number]).filter((b) => !isNaN(b[0]) && !isNaN(b[1])), at }; };
  (A || []).forEach((d: any) => ((d.data && d.data.teachers) || []).forEach((t: any) => add(t.name, t.days, t.busy, Date.parse(d.updated_at) || 0)));
  (O || []).forEach((d: any) => { let nm = ""; try { nm = JSON.parse(String(d.key).slice("mgmt:mgmtAvail|".length))[0]; } catch { return; } if (d.data && d.data.days) add(nm, d.data.days, d.data.busy, Date.parse(d.updated_at) || 0); });
  return H; }
let CACHE: { at: number; v: any } | null = null;
async function build() {
  const now = Date.now(), today = new Date(now + 8 * 3600e3).toISOString().slice(0, 10), tom = dayAt(today, 1);
  const dates = Array.from({ length: 7 }, (_, n) => dayAt(tom, n)).sort((a, b) => wd(a) - wd(b));
  const t0 = new Date(Date.parse(tom + "T00:00:00+08:00")).toISOString(), t1 = new Date(Date.parse(dayAt(tom, 7 * N) + "T23:59:59+08:00")).toISOString();
  const [H, CL, { data: LV }] = await Promise.all([availDocs(),
    pages(() => db.from("classes").select("starts_at,ends_at,teachers,data").gte("starts_at", t0).lte("starts_at", t1).eq("cancelled", false).order("starts_at")),
    db.from("docs").select("data").eq("key", "mgmt:mgmtLeave|[]").maybeSingle()]);
  const leave: Record<string, Set<string>> = {};
  (((LV as any)?.data?.rows) || []).forEach((r: any) => { if (!/^approved/i.test(String(r.status || "")) || !/whole/i.test(String(r.part || "whole"))) return;
    const k = String(r.teacher || "").toLowerCase(), f = ymd(r.from), t = ymd(r.to) || f; if (!k || !f) return;
    for (let d = f, n = 0; d <= t && n < 60; d = dayAt(d, 1), n++) (leave[k] = leave[k] || new Set()).add(d); });
  const B: Record<string, [number, number][]> = {};
  (CL || []).forEach((x: any) => { const k = String((x.teachers || [])[0] || "").toLowerCase(); if (!k) return; const s = Date.parse(x.starts_at), e = Date.parse(x.ends_at || x.data?.end || x.starts_at) || s + LEN * 6e4;
    (B[k] = B[k] || []).push([s, e > s ? e : s + LEN * 6e4]); });
  Object.keys(H).forEach((k) => H[k].busy.forEach((b) => { if (b[0] >= Date.parse(t0) && b[0] <= Date.parse(t1) + 864e5) (B[k] = B[k] || []).push(b); }));
  const teachers = [...new Set([...Object.keys(H), ...Object.keys(B)])].map((k) => { const days = (H[k] && H[k].days) || [], BB = B[k] || [];
    const fix = dates.map((d0) => { const w = wd(d0), spec = String(days[w] || "").trim(), open: string[] = [], later: any[] = [], booked: any[] = [];
      if (spec && spec !== "full") spec.split(",").map((x) => x.trim()).filter(Boolean).forEach((x) => { const p = x.split("-"); if (p.length !== 2) return;
        const a0 = toMin(p[0]), a1 = toMin(p[1]); if (a0 == null || a1 == null) return;
        for (let m = a0; m + LEN <= a1; m += 30) { const tt = hhmm(m), occ = Array.from({ length: N }, (_, n) => dayAt(d0, 7 * n));
          const busy = occ.map((d) => { if (leave[k]?.has(d)) return false; const s = Date.parse(d + "T" + tt + ":00+08:00"), e = s + LEN * 6e4; return BB.some((y) => y[0] < e && y[1] > s); });
          if (!busy.some(Boolean)) { open.push(tt); continue; }
          let j = N; while (j > 0 && !busy[j - 1]) j--;
          if (N - j >= 2) later.push({ t: tt, from: occ[j] }); else booked.push({ t: tt, e: hhmm(m + LEN) }); } });
      const o = [...new Set(open)].sort(); return { date: d0, w, hours: spec, full: spec === "full", off: false, open: o, later, booked }; });
    return { k, fix }; });
  return { ok: true, n: N, from: tom, asOf: new Date(now).toISOString(), teachers }; }
Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: ss } = await db.from("partner_sessions").select("partner_id,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!ss || new Date(ss.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
  const { data: acc } = await db.from("partner_accounts").select("active").eq("id", ss.partner_id).maybeSingle(); if (!acc || !acc.active) return out({ ok: false, error: "AUTH" }, 401);
  try { if (!CACHE || b.fresh || Date.now() - CACHE.at > 30e3) CACHE = { at: Date.now(), v: await build() }; return out(CACHE.v); }
  catch (_) { return out({ ok: false, error: "not ready" }, 500); }
});
