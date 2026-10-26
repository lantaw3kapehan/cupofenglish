// CupOfEnglish · coe-trf (27 Oct 2026) · the trial report form opens from the database (Google's tTrialForm, same answer).
// POST { token, c: { date, student, code } } → { ok, form, done, levels, family } exactly as Google's tTrialForm:
//   form / levels     : the Google Form's questions, mirrored by the Google paste SERVER-TRIALPROPS27 into docs 'sys:trstate'
//   done              : Google's trDone_ (incl. the 22 Oct "moved trial, same student within 21 days" rule):
//                       redo asked and not redone → base null; else the app-sent record (trp:) ; else TR-DATA same date + name;
//                       base null → TR-DATA same student within 21 days (+ moved)
//   family            : Google's enqFamily_ (S-ENQUIRIES, TRIAL column "date|student"), mirrored with the same paste
// Until the paste has run (no 'sys:trstate'), or for a trial that is not the teacher's own, it answers { ok:false, fallback:1 } and the
// app asks Google exactly as before. POST { token, diff } logs a difference found by the app's daily check (coe_activity 'tTrialFormCheck').
// Read-only apart from that log line.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
const str = (x: unknown) => String(x ?? "").trim();
const ymd = (x: unknown) => { const m = String(x ?? "").match(/^(\d{4}-\d{2}-\d{2})/); return m ? m[1] : ""; };
const hm16 = (x: unknown) => { const m = String(x ?? "").match(/^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})/); return m ? m[1] + " " + m[2] : ""; };
const LEVELS = ["Pre-A1", "A1", "A2", "B1", "B2", "C1", "C2"];
Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: s } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
  const who = str(s.name).toLowerCase();
  if (b.diff) { try { await db.from("coe_activity").insert({ fn: "tTrialFormCheck", who: s.name, ok: false, detail: JSON.stringify(b.diff).slice(0, 4000), at: new Date().toISOString() }); } catch (_e) { /* log only */ } return out({ ok: true }); }
  const c = b.c || {}, day = str(c.date), student = str(c.student), code = str(c.code).toUpperCase();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !(student || code)) return out({ ok: false, msg: "Missing trial class." });
  const [{ data: M }, { data: C }, { data: T }] = await Promise.all([
    db.from("docs").select("data,updated_at").eq("key", "sys:trstate").maybeSingle(),
    db.from("classes").select("code,student,teachers").eq("day", day).limit(400),
    db.from("sheet_rows").select("r,data").eq("tab", "TR-DATA").gt("r", 1).order("r").limit(5000)]);
  const st = M && M.data;
  if (!st || !st.form || !Array.isArray(st.form.rate) || !st.trp || !st.trredo) return out({ ok: false, fallback: 1, why: "no mirror" });
  // Google's trialMine_: the teacher's own class that day (by code or name). Anything else → Google decides (it also knows the teacher's list).
  const hit = (x: any) => (code && str(x.code).toUpperCase() === code) || (student && str(x.student).toLowerCase() === student.toLowerCase());
  const mine = (C || []).some((x: any) => (Array.isArray(x.teachers) ? x.teachers : []).map((t: unknown) => str(t).toLowerCase()).indexOf(who) > -1 && hit(x));
  if (!mine) return out({ ok: false, fallback: 1, why: "not found in the teacher's classes" });
  const sl = student.toLowerCase(), k = day + "|" + sl, rows = (T || []).map((x: any) => x.data || []);
  const tr = (r: any[]) => ({ at: hm16(r[1]), total: r[18], cefr: r[23], pdf: !!str(r[30]) });
  let done: any = null, redoOpen = false;
  const RD = st.trredo[k]; if (RD && !RD.doneAt) redoOpen = true;
  if (!redoOpen) {
    if (st.trp[k]) done = st.trp[k];
    else { const r = rows.find((y) => ymd(y[2]) && ymd(y[2]) + "|" + str(y[5]).toLowerCase() === k); if (r) done = tr(r); }
  }
  if (!done && sl) {   // 22 Oct rule: the same student within 21 days counts (moved trials)
    const d0 = Date.parse(day + "T12:00:00+08:00");
    const x = rows.find((y) => ymd(y[2]) && str(y[5]).toLowerCase() === sl && Math.abs(Date.parse((String(y[2]).length > 10 ? String(y[2]).slice(0, 19) : ymd(y[2]) + "T00:00:00") + "+08:00") - d0) / 864e5 <= 21);
    if (x) done = Object.assign(tr(x), { moved: ymd(x[2]) });
  }
  const family = (st.fam && st.fam[k]) || null;
  return out({ ok: true, form: st.form, done, levels: st.levels || LEVELS, family, _db: { at: M!.updated_at } });
});
