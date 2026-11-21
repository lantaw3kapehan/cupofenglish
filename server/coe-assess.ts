// CupOfEnglish · coe-assess (5 Nov 2026) · walk-in IELTS-aligned assessment (Speaking 3 parts + Academic Writing Task 2).
// Management (app session token):  list · new {name,contact,purpose} · get {id} · save {id, patch} · share {id} · unshare {id} · del {id}
// Candidate essay link (wkey):       cget {wkey, start?} · csave {wkey, essay, submit?}   — open while not submitted, up to 60 min after start
// Student screen (wkey):             sget {wkey}   — the question / cue card the assessor shows, and the timer
// Result link (rkey):                result {rkey}   — only after management taps Share result
// Bands are counted by the database (trigger coe_assess_calc): criteria averaged and rounded down to the half band; both skills → nearest half.
// v4 (5 Nov 2026): save {patch.student_code} links the assessment to a student (ST code, normalised; "" un-links). The student portal
//   (coe-student) reads linked rows live, so later edits show there on its next refresh.
// v5 (7 Nov 2026, release 1854): online IELTS trial classes. IELTS teachers (docs sys:ielts_teachers) use the same assessment as the trial's
//   report: tnew {date,time,student,code} finds or makes it (kind 'trial'); tlist = mine; get/save/share/unshare on their own. The database
//   (trigger coe_assess_trial) writes the trial's report row (coe_trials) so Management › Trials shows it and "Write report" clears.
// v6 (7 Nov 2026, release 1855): lists include cefr_sp (Speaking CEFR) so a speaking-only trial shows "IELTS 6.0 · B2".
// v7 (7 Nov 2026, release 1858): any teacher can open the IELTS assessment from a trial booked with an IELTS book (own rows only);
//   tlist also returns ielts (on the IELTS teachers list = choice on every trial).
// v8 (7 Nov 2026, release 1859): KET (A2 Key) and PET (B1 Preliminary). exam = ielts | ket | pet (new {exam}, tnew {exam}, save {patch.exam}).
//   Cambridge criteria are 0–5: Speaking gv, dm (PET), p, ic, ga; Writing per part c1/ca1/o1/l1 and c2/ca2/o2/l2 (ca = PET only). The database
//   averages them (coe_assess_calc). sget also returns sx (the text the assessor put on the student screen) and exam; cget and result return exam.
// v9 (7 Nov 2026, release 1859): op portal {stoken} — the student portal reads the student's linked assessments with exam and criteria.
// v10 (7 Nov 2026, release 1861): cget also returns set (KET / PET topic set 0–2, notes.set) so the writing page shows that set's tasks.
// v11 (21 Nov 2026, audit QA-28 · 2583): get/save return ver_changed_at (set by the database when what the student sees changes after
//   sharing); op versions {id} lists the kept versions (coe_assessment_versions: the shared version, and the version before each change).
// essay_facts (paragraphs, sentences, linkers, opinion / conclusion / both views) are counted by the database too.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
const isMgr = (role: string) => /ops|operation|manag|admin|president/i.test(role || "");
const LIST = "id,name,contact,purpose,assess_date,assessor,status,sp_band,wr_band,combined,cefr,essay_words,essay_started_at,essay_submitted_at,shared_at,updated_at,student_code,kind,trial_date,trial_time,teacher,trial_code,cefr_sp,exam";
const FULL = LIST + ",created_by,wkey,rkey,essay,essay_facts,sp,wr,notes,strengths,improve,pathway,cefr_wr,ver_changed_at";
const TXT = ["name", "contact", "purpose", "assessor", "strengths", "improve", "pathway", "essay"];
const ESSAY_MIN = 60;
const EXAMS = ["ielts", "ket", "pet"];
const exOf = (x: unknown) => EXAMS.includes(String(x || "")) ? String(x) : "ielts";
function codeOf(x: unknown) { const t = String(x ?? "").toUpperCase().replace(/[\s_–—-]+/g, ""); const m = t.match(/^ST(\d{4})(\d{3})$/); return m ? "ST-" + m[1] + "-" + m[2] : ""; }   // the same rule as coe-student
Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const op = String(b.op || "");
  const key = (k: any) => /^[0-9a-f]{32}$/.test(String(k || "")) ? String(k) : "";
  // ---------- candidate essay link ----------
  if (op === "sget") {   // the student screen (shared on a call): only what the assessor chose to show, and the timer
    const wk = key(b.wkey); if (!wk) return out({ ok: false, msg: "This link is not valid." });
    const { data: a } = await db.from("coe_assessments").select("name,notes,deleted_at,exam").eq("wkey", wk).maybeSingle();
    if (!a || a.deleted_at) return out({ ok: false, msg: "This link is not valid." });
    const n: any = a.notes || {};
    return out({ ok: true, name: String(a.name || "").split(" ")[0], show: n.show || "", sx: n.sx || "", exam: a.exam || "ielts", tend: n.tend || "", tlab: n.tlab || "", now: Date.now() });
  }
  if (op === "cget" || op === "csave") {
    const wk = key(b.wkey); if (!wk) return out({ ok: false, msg: "This link is not valid." });
    const { data: a } = await db.from("coe_assessments").select("id,name,status,essay,essay_started_at,essay_submitted_at,deleted_at,exam,notes").eq("wkey", wk).maybeSingle();
    if (!a || a.deleted_at) return out({ ok: false, msg: "This link is not valid." });
    const started = a.essay_started_at ? Date.parse(a.essay_started_at) : 0;
    const closed = !!a.essay_submitted_at || a.status === "final" || (started && Date.now() > started + ESSAY_MIN * 60000);
    if (op === "cget") {
      let st = a.essay_started_at;
      if (b.start && !st && !closed) { st = new Date().toISOString(); await db.from("coe_assessments").update({ essay_started_at: st }).eq("id", a.id).is("essay_started_at", null); }
      const setN = String(((a as any).notes || {}).set || "");
      return out({ ok: true, name: String(a.name || "").split(" ")[0], started_at: st, submitted_at: a.essay_submitted_at, closed, essay: a.essay || "", exam: a.exam || "ielts", set: /^[0-2]$/.test(setN) ? +setN : 0, now: new Date().toISOString() });
    }
    if (closed) return out({ ok: false, closed: true, msg: a.essay_submitted_at ? "Your essay has already been submitted." : "The writing time has ended." });
    const essay = String(b.essay == null ? "" : b.essay).slice(0, 20000);
    const up: any = { essay }; if (!started) up.essay_started_at = new Date().toISOString(); if (b.submit) up.essay_submitted_at = new Date().toISOString();
    const { data: r, error } = await db.from("coe_assessments").update(up).eq("id", a.id).select("essay_words,essay_submitted_at").single();
    if (error) return out({ ok: false, msg: "Not saved. Check the connection." }, 500);
    return out({ ok: true, words: r.essay_words, submitted_at: r.essay_submitted_at });
  }
  // ---------- result link ----------
  if (op === "result") {
    const rk = key(b.rkey); if (!rk) return out({ ok: false, msg: "This link is not valid." });
    const { data: a } = await db.from("coe_assessments").select("name,assess_date,assessor,sp,wr,sp_band,wr_band,combined,cefr_sp,cefr_wr,cefr,strengths,improve,pathway,essay_words,shared_at,deleted_at,exam").eq("rkey", rk).maybeSingle();
    if (!a || a.deleted_at || !a.shared_at) return out({ ok: false, msg: "This result is not available." });
    delete (a as any).deleted_at; return out({ ok: true, a });
  }
  // ---------- v9 · student portal (student session token): the student's linked assessments with the test and its criteria ----------
  if (op === "portal") {
    const t = String(b.stoken || ""); if (t.length < 32) return out({ ok: false, error: "AUTH" }, 401);
    const { data: ss } = await db.from("student_sessions").select("code,exp").eq("token_hash", await sha(t)).maybeSingle();
    if (!ss || new Date(ss.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
    const { data: acc } = await db.from("student_access").select("active").eq("code", ss.code).maybeSingle();
    if (acc && acc.active === false) return out({ ok: false, error: "AUTH" }, 401);
    const { data } = await db.from("coe_assessments").select("assess_date,assessor,sp,wr,sp_band,wr_band,combined,cefr_sp,cefr_wr,cefr,strengths,improve,pathway,essay_words,updated_at,exam")
      .eq("student_code", ss.code).is("deleted_at", null).order("assess_date", { ascending: false }).order("created_at", { ascending: false }).limit(10);
    const num = (o: any) => { const r: any = {}; Object.keys(o || {}).forEach((k) => { if (typeof o[k] === "number") r[k] = o[k]; }); return r; };
    return out({ ok: true, list: ((data as any[]) || []).map((a) => ({ date: String(a.assess_date || "").slice(0, 10), assessor: a.assessor || "", exam: a.exam || "ielts", sp: num(a.sp), wr: num(a.wr),
      sp_band: a.sp_band == null ? null : Number(a.sp_band), wr_band: a.wr_band == null ? null : Number(a.wr_band), combined: a.combined == null ? null : Number(a.combined), cefr_sp: a.cefr_sp || "", cefr_wr: a.cefr_wr || "", cefr: a.cefr || "",
      strengths: a.strengths || "", improve: a.improve || "", pathway: a.pathway || "", essay_words: a.essay_words, updated: a.updated_at })) });
  }
  // ---------- management ----------
  const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: s } = await db.from("app_sessions").select("email,name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
  const { data: me } = await db.from("auth_users").select("email,name,role").eq("email", String(s.email || "").toLowerCase()).maybeSingle();
  const mgr = s.mode === "mgmt" && !!me && isMgr(me.role), lc = String(s.name || "").trim().toLowerCase();
  let tch = false;
  if (!mgr) { const { data: it } = await db.from("docs").select("data").eq("key", "sys:ielts_teachers").maybeSingle();
    tch = !!(it && it.data && Array.isArray(it.data.names) && it.data.names.map((x: any) => String(x).toLowerCase()).includes(lc)); }
  // v7: any teacher may use their own online trial assessments (a trial booked with an IELTS book); the list decides who gets the choice on every trial
  const id = String(b.id || "");
  if (op === "tnew") {   // the online IELTS trial: one assessment per trial (date, student, teacher), made the first time it is opened
    const d = String(b.date || "").slice(0, 10), st = String(b.student || "").trim().slice(0, 120), tm = String(b.time || "").slice(0, 8), cd = codeOf(b.code);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d) || !st) return out({ ok: false, msg: "Open it from the trial class." });
    const who = String(s.name || (me && me.name) || "").trim();
    const { data: ex } = await db.from("coe_assessments").select(FULL).eq("trial_date", d).ilike("name", st).ilike("teacher", who).is("deleted_at", null).limit(1);
    if (ex && ex.length) return out({ ok: true, a: ex[0] });
    const row: any = { name: st, purpose: "Online IELTS trial class", assessor: who, created_by: String(s.email || (me && me.email) || ""), kind: "trial", trial_date: d, trial_time: tm, teacher: who, trial_code: cd || null, student_code: cd || null, exam: exOf(b.exam) };
    if (row.exam !== "ielts") row.purpose = "Online " + row.exam.toUpperCase() + " trial class";
    const { data, error } = await db.from("coe_assessments").insert(row).select(FULL).single();
    if (error) return out({ ok: false, msg: "Not saved. Try again." }, 500);
    return out({ ok: true, a: data });
  }
  if (op === "tlist") {
    const { data } = await db.from("coe_assessments").select(LIST).is("deleted_at", null).ilike("teacher", String(s.name || "").trim()).order("created_at", { ascending: false }).limit(100);
    return out({ ok: true, list: data || [], ielts: mgr || tch });
  }
  if (!mgr && (op === "list" || op === "new" || op === "del")) return out({ ok: false, error: "Management only" }, 403);
  if (op === "list") {
    const { data } = await db.from("coe_assessments").select(LIST).is("deleted_at", null).order("created_at", { ascending: false }).limit(200);
    return out({ ok: true, list: data || [] });
  }
  if (op === "new") {
    const row = { name: String(b.name || "").trim().slice(0, 120), contact: String(b.contact || "").slice(0, 200), purpose: String(b.purpose || "").slice(0, 200), assessor: String(me.name || s.name || ""), created_by: me.email, exam: exOf(b.exam) };
    if (!row.name) return out({ ok: false, msg: "Type the student's name first." });
    const { data, error } = await db.from("coe_assessments").insert(row).select(FULL).single();
    if (error) return out({ ok: false, msg: "Not saved. Try again." }, 500);
    return out({ ok: true, a: data });
  }
  if (!/^[0-9a-f-]{36}$/.test(id)) return out({ ok: false, error: "id" }, 400);
  const { data: cur } = await db.from("coe_assessments").select(FULL + ",deleted_at").eq("id", id).maybeSingle();
  if (!cur || cur.deleted_at) return out({ ok: false, msg: "Not found." }, 404);
  delete (cur as any).deleted_at;
  if (!mgr && String((cur as any).teacher || "").trim().toLowerCase() !== lc) return out({ ok: false, error: "Not yours" }, 403);
  if (op === "get") return out({ ok: true, a: cur });
  if (op === "versions") {   // v11: the kept versions (the shared one, and the one before each change after sharing), newest first
    const { data } = await db.from("coe_assessment_versions").select("at,kind,by_name,snap").eq("assessment_id", id).order("at", { ascending: false }).limit(30);
    return out({ ok: true, list: data || [] });
  }
  let up: any = {};
  if (op === "save") {
    const p = b.patch || {};
    TXT.forEach((k) => { if (p[k] !== undefined) up[k] = String(p[k] == null ? "" : p[k]).slice(0, k === "essay" ? 20000 : 4000); });
    if (p.exam !== undefined && EXAMS.includes(String(p.exam))) up.exam = String(p.exam);
    const ex = up.exam || (cur as any).exam || "ielts", cam = ex !== "ielts", top = cam ? 5 : 9;
    const band = (o: any, keys: string[]) => { const r: any = {}; keys.forEach((k) => { if (o && o[k] !== undefined) { const v = String(o[k] == null ? "" : o[k]); if (v === "" || (/^[0-9]$/.test(v) && +v <= top)) r[k] = v === "" ? null : +v; } }); return r; };
    if (p.sp) up.sp = { ...(cur.sp || {}), ...band(p.sp, cam ? ["gv", "dm", "p", "ic", "ga"] : ["fc", "lr", "gra", "p"]) };
    if (p.wr) up.wr = { ...(cur.wr || {}), ...band(p.wr, cam ? ["c1", "ca1", "o1", "l1", "c2", "ca2", "o2", "l2"] : ["tr", "cc", "lr", "gra"]) };
    if (p.notes && typeof p.notes === "object") { const n: any = { ...(cur.notes || {}) }; Object.keys(p.notes).slice(0, 40).forEach((k) => { if (/^[a-z0-9_]{1,20}$/.test(k)) n[k] = String(p.notes[k] == null ? "" : p.notes[k]).slice(0, 4000); }); up.notes = n; }
    if (p.status === "draft" || p.status === "final") up.status = p.status;
    if (p.student_code !== undefined) { const raw = String(p.student_code == null ? "" : p.student_code).trim(), sc = codeOf(raw);
      if (raw && !sc) return out({ ok: false, msg: "Student code looks like ST-2026-001." }); up.student_code = sc || null; }
    if (p.essay_open) { up.essay_submitted_at = null; up.essay_started_at = null; }
    if (p.essay_close) up.essay_submitted_at = new Date().toISOString();
  } else if (op === "share") up = { shared_at: new Date().toISOString(), status: "final" };
  else if (op === "unshare") up = { shared_at: null };
  else if (op === "del") up = { deleted_at: new Date().toISOString() };
  else return out({ ok: false, error: "unknown op" }, 400);
  if (!Object.keys(up).length) return out({ ok: true, a: cur });
  const { data, error } = await db.from("coe_assessments").update(up).eq("id", id).select(FULL).single();
  if (error) return out({ ok: false, msg: "Not saved. Try again." }, 500);
  return out({ ok: true, a: data });
});
