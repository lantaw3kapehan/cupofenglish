// CupOfEnglish · coe-fbform v1 (11 Nov 2026, 2064 · Misty: "Fully off Google" · "ensure everything goes directly to the app now and that no google").
// The monthly feedback form, from the database only (no Google fallback). Same answer shape as Google's tFbForm and coe-train "fbform":
// the form layout (docs sys:fbtemplate, the same for every student), this month (sys:fbs: open date, done, returned), the last feedback
// (student_parts), class notes of the last 45 days (S-NOTES copy). A teacher opens only her own students (ACTIVE copy or classes in the
// last 75 / next 45 days); management any student. POST { token, code } → { ok, db, code, student, month, monthKey, due, form, last, done, fix, obs }
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
const str = (x: unknown, n = 200) => String(x == null ? "" : x).trim().slice(0, n);
const mn = (ms: number) => new Date(ms + 8 * 3600e3).toISOString();
Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const token = str(b.token, 200); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: s } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
  const mgmt = s.mode === "mgmt", me = String(s.name || "").trim(), lc = me.toLowerCase();
  const code = str(b.code, 20).toUpperCase(); if (!/^ST-\d{4}-\d{3}$/.test(code)) return out({ ok: false, msg: "Student code missing." });
  try {
    const [FS, TP, P, DBR, ACT, CL, NO, WR] = await Promise.all([
      db.from("docs").select("data").eq("key", "sys:fbs").maybeSingle(),
      db.from("docs").select("data").eq("key", "sys:fbtemplate").maybeSingle(),
      db.rpc("student_parts", { p_code: code }),
      db.from("sheet_rows").select("data").eq("tab", "DATABASE").eq("data->>0", code).limit(1),
      db.from("sheet_rows").select("data").eq("tab", "ACTIVE").eq("data->>0", code),
      db.from("classes").select("teachers").eq("code", code).gte("starts_at", new Date(Date.now() - 75 * 864e5).toISOString()).lte("starts_at", new Date(Date.now() + 45 * 864e5).toISOString()).limit(200),
      db.from("sheet_rows").select("data").eq("tab", "S-NOTES").eq("data->>3", code),
      db.from("writes").select("args,status,created_at").eq("fn", "tFbSubmit").ilike("who", me).neq("status", "error").neq("status", "test").gte("created_at", new Date(Date.now() - 40 * 864e5).toISOString()).order("created_at", { ascending: false }).limit(50)]);
    const F: any = FS.data && FS.data.data, T: any = TP.data && TP.data.data;
    if (!F || !F.mo || !T || !Array.isArray(T.grids)) return out({ ok: false, msg: "The feedback form could not be loaded. Please try again in a minute." });
    if (!mgmt) {
      const mine = (ACT.data || []).some((x: any) => String((x.data || [])[3] || "").toLowerCase().split(/[,/&]/).map((t: string) => t.trim()).includes(lc))
        || (CL.data || []).some((x: any) => (x.teachers || []).map((t: string) => String(t).toLowerCase()).includes(lc));
      if (!mine) return out({ ok: false, msg: "Only your own students." });
    }
    const mo = F.mo, fix = ((F.fix || {})[lc] || {})[code] || null; let done = ((F.done || {})[lc] || {})[code] || null;
    const today = mn(Date.now()).slice(0, 10);
    if (mo.opens && today < mo.opens && !fix) return out({ ok: false, notYet: true, msg: "Monthly feedback opens on " + (mo.opensLabel || mo.opens) + ", so it covers the whole month of classes. Keep adding class notes until then." });
    if (!done && mo.opens) { const w = (WR.data || []).find((x: any) => String((x.args || [])[1] || "").toUpperCase() === code && mn(Date.parse(x.created_at)).slice(0, 10) >= mo.opens);
      if (w) { const sc = ((w.args || [])[2] || {}).scores || []; const tot = sc.reduce((a: number, r: any) => a + (Array.isArray(r) ? r.reduce((p: number, q: any) => p + (+q || 0), 0) : 0), 0);
        done = { at: mn(Date.parse(w.created_at)).slice(0, 16).replace("T", " "), total: tot || null, via: "app" }; } }
    const fbAll = (P.data && P.data.fb && Array.isArray(P.data.fb.data)) ? P.data.fb.data : [];
    const last = fbAll.slice().sort((p: any, q: any) => String(q.month || "").localeCompare(String(p.month || "")))[0] || null;
    const drow = ((DBR.data || [])[0] || {}).data || [], name = String(drow[2] || (last && last.student) || code).trim();
    const course = String((last && last.course) || drow[12] || "").trim();
    const since = mn(Date.now() - 45 * 864e5).slice(0, 10);
    const obs = (NO.data || []).map((x: any) => x.data || []).map((r: any[]) => ({ date: String(r[1] || "").slice(0, 10), teacher: String(r[2] || ""), ended: String(r[5] || ""), next: String(r[6] || ""), homework: String(r[7] || ""), obs: String(r[9] || ""), skills: String(r[10] || "") }))
      .filter((n: any) => n.date >= since && (n.obs || n.ended)).sort((p: any, q: any) => q.date.localeCompare(p.date)).slice(0, 30);
    return out({ ok: true, db: true, code, student: name, formTeacher: "", month: mo.label, monthKey: mo.key, due: mo.dueLabel,
      form: { grids: T.grids, texts: T.texts, date: T.date || null, header: "", help: "STUDENT: " + name.toUpperCase() + (course ? "\nCOURSEWARE: " + course.toUpperCase() : "") },
      last, done, fix, obs });
  } catch (_e) { return out({ ok: false, msg: "The feedback form could not be loaded. Please try again in a minute." }); }
});
