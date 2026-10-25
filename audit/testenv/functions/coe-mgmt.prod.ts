// CupOfEnglish · management saves through the database that are not in the main function (16 Oct 2026):
// Enrolled · paid and Renewed · paid (no invoice file, no transfer), and a renewal status (Reminder sent, Renewing, Paused, Not renewing). Queued in `writes`; Google writes them into
// SALES / ACTIVE / DATABASE within a minute (sbDrain › SB_REPLAY), with all its own checks. Same sign-in check as `coe`.
// POST { op: "trialsAhead", token } → trial classes booked in the calendar (for the Trials screen).
// POST { op: "newCode", token } → 16 Oct: the next free student code (a new student is saved through the database at once).
// POST { op: "books", token, code } or { op: "books", token, list: true } (the library), { agree: v } (I understand the books rule), { check: v } (already agreed?), { agrees: v } (management: who agreed) → 16 Oct: the course book files for a book code (OD1, RE2, RazAa…), a teacher only the books of their own students' classes, management all.
// POST { op: "overview", token } → 17 Oct: the Overview screen from the database (teachers, payroll, today's team and Ops, late time-ins).
// POST { op: "screen", token, fn, args } → 17 Oct: mgmtOverview / mgmtRenewals / mgmtPerformance worked out by the database; 19 Oct: + enquiries, agreements, reminders, teaching hours, leave classes, week summary; mgmtKpi (Teacher Excellence: full for the President, light for the rest of management); QA read receipts.
// POST { op: "teacherCard", token, name } → 17 Oct: the teacher card (management) from the database.
// POST { op: "stuClasses", token, code } → 18 Oct: a student's class list from the class table (teachers: only their own students).
// POST { op: "classEdit", token, id, f, rid } → 19 Oct: cancel / restore / move one class in the class table at once, Google Calendar follows (writes + direct call). { op: "writeStatus", token, id }. { op: "setBook", token, args: [code, book, from, teacher] }: Change book the same way.
// POST { op: "classAdd", token, f, rid } → 20 Oct: Add class (one class or a weekly package, regular or trial) in the class table at once; Google Calendar makes the events in the background.
// 20 Oct v39 · screen: management may pass `as` (teacher view) for a teacher's own read-only screens (setup check, Excellence, videos, QA receipts, first 90 days, open times).
// 20 Oct v38 · Add class › Substitute (SC) in the class table at once (the regular class at that time cancelled here; Google lodges the absence case).
// 20 Oct v38 · classEdit cancel + make-up in the class table at once (Google's make-up rule; the make-up row is pending until Google's event arrives).
// 20 Oct v37 · classEdit move + forward: the later classes of the weekly schedule move at once (same shift, new teacher), returned as fwd { n, until }.
// POST { op: "trialData", token, date, student } → 20 Oct: a trial report's data (TR-DATA / the app submission, learner type, TR-CEFR, TR-PATH) to draw it in the app.
// POST { op: "lateDone", token, row, cond } → 16 Oct: a late time-in decided (Excused / Unexcused / Waive) is hidden for everyone (docs mgmt:lateDone).
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const GAS_URL = "https://script.google.com/a/cupofenglishatph.com/macros/s/AKfycbyqAYrjEQ3CdeTzogP8mZ8tMRx59nV0vMvOHtoQ0wudTBNNXV7YeE_mJPYcqIRhmRbu/exec";   // the app's Google web app (same address as app.html)
const FNS = new Set(["mgmtRenewPaid", "mgmtEnrolPaid", "mgmtRenewal"]);
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
async function sweepPend() {   // 20 Oct · Add class rows saved here first (id "pend-<writes id>-n") are removed once Google's copy has the real event (same student, same start)
  const { data: P } = await db.from("classes").select("id,code,starts_at,updated_at,data").like("id", "pend-%").limit(500);
  if (!P || !P.length) return;
  const wids = [...new Set(P.map((x: any) => Number(String(x.id).split("-")[1]) || 0))];   // a save Google refused later (minute job): its pending rows go
  const { data: bad } = await db.from("writes").select("id").in("id", wids).eq("status", "error");
  if (bad && bad.length) { for (const z of bad) await db.from("classes").delete().like("id", "pend-" + z.id + "-%"); }
  const codes = [...new Set(P.map((x: any) => x.code))];
  const { data: R } = await db.from("classes").select("code,starts_at,data").in("code", codes).eq("cancelled", false).not("id", "like", "pend-%").gte("starts_at", P.reduce((m: string, x: any) => x.starts_at < m ? x.starts_at : m, P[0].starts_at)).limit(20000);
  const key = (x: any) => x.code + "|" + new Date(x.starts_at).getTime() + "|" + (/-SC$/i.test(String((x.data || {}).title || "").trim()) ? 1 : 0);   // a substitute only matches a substitute
  const have = new Set((R || []).map(key));
  const gone = P.filter((x: any) => have.has(key(x))).map((x: any) => x.id);
  for (let i = 0; i < gone.length; i += 100) await db.from("classes").delete().in("id", gone.slice(i, i + 100));
}
Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  if (b.op === "newCode") {   // 16 Oct · a new student's code, handed out by the database (never twice)
    const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
    const { data: s } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
    if (!s || new Date(s.exp).getTime() < Date.now() || s.mode !== "mgmt") return out({ ok: false, error: "AUTH" }, 401);
    const { data, error } = await db.rpc("coe_new_code", { p_by: s.name || "" });
    return error || !data ? out({ ok: false, error: "db" }, 500) : out({ ok: true, code: data });
  }
  if (b.op === "books") {   // 16 Oct · course books for a book code (teachers and management): Drive file ids from Drive › COURSEWARE_Used in Class
    const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
    const { data: s } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
    if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
    if (b.agree) {   // 16 Oct 20:56 · "I understand" on the books rule, kept with the rule version (management sees who and when)
      const v = Math.max(1, Math.min(99, Number(b.agree) || 1));
      const { error } = await db.from("coe_book_agree").insert({ name: s.name || "", v, ua: String(req.headers.get("user-agent") || "").slice(0, 160) });
      return out({ ok: !error });
    }
    if (b.check) {   // has this teacher already agreed to this rule version (any device)?
      const { data } = await db.from("coe_book_agree").select("id").ilike("name", s.name || "").eq("v", Math.max(1, Number(b.check) || 1)).limit(1);
      return out({ ok: true, agreed: !!(data && data.length) });
    }
    if (b.agrees && s.mode === "mgmt") { const { data, error } = await db.rpc("coe_book_agree_list", { p_v: Math.max(1, Number(b.agrees) || 1) }); return error ? out({ ok: false, error: "db" }, 500) : out({ ok: true, agrees: data || [] }); }
    // 16 Oct 20:31 (Misty): a teacher opens only the books of the students in their own classes (coe_teacher_books); management opens all
    let allow: Record<string, string[]> | null = null;
    if (s.mode !== "mgmt") {
      const { data: tb, error: te } = await db.rpc("coe_teacher_books", { p_name: s.name || "" }); if (te) return out({ ok: false, error: "db" }, 500);
      const { data: M } = await db.from("coe_book_map").select("code,label"); const lab: Record<string, string> = {}; (M || []).forEach((m: any) => lab[m.code] = m.label);
      allow = {}; (tb || []).forEach((x: any) => { const l = lab[x.code]; if (l) allow![l] = [...new Set([...(allow![l] || []), ...(x.students || [])])]; });
      (b as any)._lab = lab;
    }
    if (b.list) { const { data, error } = await db.rpc("coe_book_catalog"); if (error) return out({ ok: false, error: "db" }, 500);
      const all = data || []; if (!allow) return out({ ok: true, list: all });
      const mine = all.filter((x: any) => allow![x.label]).map((x: any) => ({ ...x, who: allow![x.label] }));
      return out({ ok: true, list: mine, mine: true, others: all.length - mine.length }); }   // the Books library
    const code = String(b.code || "").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 60);
    if (allow && !allow[(b as any)._lab[code] || "\u0000"]) return out({ ok: true, book: null, locked: true });
    const { data, error } = await db.rpc("coe_books_for", { p_code: code });
    return error ? out({ ok: false, error: "db" }, 500) : out({ ok: true, book: data || null });
  }
  if (b.op === "overview") {   // 17 Oct · the Overview screen worked out by the database (coe_overview_live), management only
    const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
    const { data: s } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
    if (!s || new Date(s.exp).getTime() < Date.now() || s.mode !== "mgmt") return out({ ok: false, error: "AUTH" }, 401);
    const { data, error } = await db.rpc("coe_overview_live");
    return error || !data ? out({ ok: false, error: "db" }, 500) : out({ ok: true, data, at: new Date().toISOString() });
  }
  if (b.op === "screen") {   // 17 Oct · management screens worked out by the database (each checked equal to Google's first)
    const RPC: Record<string, string> = { mgmtOverview: "coe_overview_live", mgmtRenewals: "coe_renewals_map", mgmtPerformance: "coe_performance_live",
      // 19 Oct · checked equal to Google's copies first (enquiries, agreements, reminders, teaching hours, leave classes, week summary)
      mgmtEnqList: "coe_enq_list", mgmtAgreeMap: "coe_agree_map", mgmtReminders: "coe_reminders", tReminders: "coe_reminders", mgmtAvail: "coe_avail", tAvail: "coe_avail",
      mgmtAvailAll: "coe_avail_all", mgmtLeaveClasses: "coe_leave_classes", tLeaveClasses: "coe_leave_classes", mgmtWeekSum: "coe_week_sum", mgmtVisitCoverage: "coe_visit_coverage", mgmtHours: "coe_mgmt_hours",
      stuDaily: "coe_stu_daily", nextBooks: "coe_next_books", mgmtKpi: "coe_kpi", tKpi: "coe_kpi_me", tPcDone: "coe_pc_done", tVidMine: "coe_vid_mine", mgmtQaHist: "coe_qa_hist",
      tQaAck: "coe_qa_ack_put", tQaAckMe: "coe_qa_ack_me", mgmtQaSent: "coe_qa_ack_sent", mgmtQaAcks: "coe_qa_ack_all", mgmtQaRow: "coe_qa_row_put",
      mgmtQaNext: "coe_qa_next", mgmtQaCheck: "coe_qa_check_put", mgmtRenewSig: "coe_renew_signals", tSetupMe: "coe_setup_me", mgmtSetupAll: "coe_setup_all", mgmtSetupReview: "coe_setup_review", mgmtTrialStats: "coe_trial_stats", tFirst90: "coe_first90", mgmtFirst90: "coe_first90",
      mgmtActive: "coe_active_screen", mgmtMonRow: "coe_mon_row_put" };   // 19 Oct v32 · Active from the database (patch 339) · class visits into S-MONITOR at once (patch 329) — restored 20 Oct (v33 was deployed without them)   // 19 Oct · QA next actions in visits, renewal warning, setup check, trial results, first 90 days   // 19 Oct · QA read receipts (a teacher confirms she has read each new QA)   // 19 Oct · a student's months from the -DAILY tabs · book changes already in the calendar · Teacher Excellence preview (President only)
    const fn = String(b.fn || ""); if (!RPC[fn]) return out({ ok: false, error: "unknown screen" }, 400);
    const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
    const { data: s } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
    const teacherFn = fn[0] === "t";   // a teacher's own screens (their own name, never someone else's)
    if (!s || new Date(s.exp).getTime() < Date.now() || (!teacherFn && s.mode !== "mgmt")) return out({ ok: false, error: "AUTH" }, 401);
    const A: any[] = Array.isArray(b.args) ? b.args : [], str = (x: unknown, n = 40) => String(x == null ? "" : x).slice(0, n);
    const me = s.mode === "mgmt" && teacherFn && b.as ? String(b.as).trim().slice(0, 40) : (s.name || "");   // 20 Oct v39 · management's teacher view: the teacher being viewed (read-only screens)
    const ymd = (x: unknown) => /^\d{4}-\d{2}-\d{2}$/.test(String(x || "")) ? String(x) : "", hm = (x: unknown) => /^\d\d:\d\d$/.test(String(x || "")) ? String(x) : "";
    const today = new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10);
    let P: Record<string, unknown> | undefined;
    if (fn === "mgmtReminders" || fn === "tReminders") P = { p_day: ymd(String(A[0] || "").slice(0, 10)) || today };
    else if (fn === "mgmtAvail") P = { p_teacher: str(A[0]), p_days: Number(A[1]) || 21 };
    else if (fn === "tAvail") P = { p_teacher: me, p_days: Number(A[0]) || 21 };
    else if (fn === "mgmtHours") P = { p_ym: /^\d{4}-\d{2}$/.test(String(A[0] || "")) ? String(A[0]) : "", p_viewer: s.name || "" };   // the pay base only for the President or the person herself
    else if (fn === "stuDaily") P = { p_code: str(A[0], 20) };
    else if (fn === "tKpi") P = { p_name: me };
    else if (fn === "tVidMine") P = { p_name: me };
    else if (fn === "mgmtQaHist") P = { p_teacher: str(A[0]) };   // 19 Oct · QA form: her earlier QA scores, the team average, this month's class visits   // 19 Oct · her own class videos, today and yesterday (video check log)   // 19 Oct · her own Teacher Excellence months + the top 3 (docs sys:kpiOn decides who sees it)
    else if (fn === "tQaAck") P = { p_name: s.name || "", p_period: str(A[0]), p_what: A[1] === "ack" ? "ack" : "seen", p_ua: String(req.headers.get("user-agent") || "").slice(0, 160) };   // 19 Oct · she opened / confirmed her QA
    else if (fn === "tQaAckMe") P = { p_name: me };
    else if (fn === "mgmtQaSent") P = { p_teacher: str(A[0]), p_period: str(A[1]), p_by: s.name || "" };   // 19 Oct · a QA was just sent: start waiting for her confirmation
    else if (fn === "mgmtQaRow") P = { p_row: (Array.isArray(A[0]) ? A[0] : []).slice(0, 27).map((x: unknown) => typeof x === "number" ? x : String(x == null ? "" : x).slice(0, 20000)) };   // 19 Oct · the QA just sent, into the database copy of QA-DATA at once
    else if (fn === "mgmtQaNext") P = { p_teacher: str(A[0]) };
    else if (fn === "mgmtQaCheck") P = { p_teacher: str(A[0]), p_period: str(A[1]), p_rows: (Array.isArray(A[2]) ? A[2] : []).slice(0, 12), p_event: str(A[3], 160), p_day: ymd(A[4]), p_by: s.name || "" };
    else if (fn === "tSetupMe") P = { p_name: me };
    else if (fn === "mgmtSetupAll") P = { p_ym: /^\d{4}-\d{2}$/.test(String(A[0] || "")) ? String(A[0]) : today.slice(0, 7) };
    else if (fn === "mgmtSetupReview") P = { p_teacher: str(A[0]), p_ym: str(A[1], 7), p_status: str(A[2], 12), p_note: str(A[3], 300), p_by: s.name || "" };
    else if (fn === "mgmtTrialStats") P = { p_days: Number(A[0]) || 120 };
    else if (fn === "tFirst90") P = { p_name: me };
    else if (fn === "mgmtFirst90") P = { p_name: str(A[0]) };
    else if (fn === "mgmtMonRow") P = { p_row: (Array.isArray(A[0]) ? A[0] : []).slice(0, 14).map((x: unknown) => String(x == null ? "" : x).slice(0, 4000)) };
    else if (fn === "mgmtKpi") {   // 19 Oct · full for the President; light for the rest of management
      const { data: au } = await db.from("auth_users").select("role").ilike("name", s.name || "-").limit(1).maybeSingle();
      P = { p_ym: /^\d{4}-\d{2}$/.test(String(A[0] || "")) ? String(A[0]) : "", p_min: 20 };
      if (!au || !/president/i.test(String(au.role || ""))) {   // 19 Oct · light view for the rest of management (Celine): place, level, total and the four parts, not the facts behind them
        const { data, error } = await db.rpc("coe_kpi", P);
        if (error || data == null) return out({ ok: false, error: "db" }, 500);
        const d = Object.assign({}, data, { light: true, teachers: ((data as any).teachers || []).map((t: any) => ({ name: t.name, rank: t.rank, total: t.total, level: t.level, pillars: t.pillars })) });
        return out({ ok: true, data: d, at: new Date().toISOString() });
      }
    }
    else if (fn === "mgmtAvailAll") P = { p_names: (Array.isArray(A[0]) ? A[0] : []).slice(0, 60).map((x: unknown) => str(x)) };
    else if (fn === "mgmtLeaveClasses" || fn === "tLeaveClasses") {
      const o = fn === "tLeaveClasses" ? 0 : 1, from = ymd(A[o]); if (!from) return out({ ok: true, data: [], at: new Date().toISOString() });
      P = { p_teacher: o ? str(A[0]) : me, p_from: from, p_to: ymd(A[o + 1]) || from, p_tfrom: hm(A[o + 2]), p_tto: hm(A[o + 3]) };
    } else if (fn === "mgmtWeekSum") { const w = ymd(String(A[0] || "").slice(0, 10)); if (!w) return out({ ok: true, data: { ok: false, msg: "Bad week" }, at: new Date().toISOString() });
      const dd = (Date.parse(w) - Date.parse(today)) / 864e5; if (dd < -44 || dd > 115) return out({ ok: false, error: "outside the class copy" }, 503); P = { p_from: w }; }
    if (/LeaveClasses/.test(fn) && P) { const dd = (Date.parse(String(P.p_to)) - Date.parse(today)) / 864e5, d0 = (Date.parse(String(P.p_from)) - Date.parse(today)) / 864e5; if (d0 < -44 || dd > 115) return out({ ok: false, error: "outside the class copy" }, 503); }
    if (fn === "mgmtWeekSum" || fn === "mgmtAvail" || fn === "mgmtAvailAll" || fn === "tAvail" || /LeaveClasses/.test(fn)) {   // class lists: only while the long class copy (CL18) is fresh
      const { data: cl } = await db.from("docs").select("data").eq("key", "sys:cl18").maybeSingle();
      if (!cl || !cl.data || Date.now() - Date.parse(cl.data.at) > 16 * 3600e3) return out({ ok: false, error: "not ready" }, 503);
    }
    const { data, error } = P ? await db.rpc(RPC[fn], P) : await db.rpc(RPC[fn]);
    return error || data == null ? out({ ok: false, error: "db" }, 500) : out({ ok: true, data, at: new Date().toISOString() });
  }
  if (b.op === "setupUpload" || b.op === "setupUrl") {   // 19 Oct · teaching setup check: a teacher's monthly screenshot (private bucket "setup"); management or the teacher herself can view it
    const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
    const { data: s } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
    if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
    const slug = String(s.name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    if (b.op === "setupUrl") {
      const path = String(b.path || "").slice(0, 200); if (!/^\d{4}-\d{2}\/[a-z0-9]+-\d+\.(jpg|png)$/.test(path)) return out({ ok: false, error: "bad path" }, 400);
      if (s.mode !== "mgmt" && path.split("/")[1].split("-")[0] !== slug) return out({ ok: false, error: "AUTH" }, 401);
      const { data, error } = await db.storage.from("setup").createSignedUrl(path, 900);
      return error || !data ? out({ ok: false, error: "storage" }, 500) : out({ ok: true, url: data.signedUrl });
    }
    if (s.mode === "mgmt" || !slug) return out({ ok: false, error: "teachers only" }, 403);
    const b64 = String(b.b64 || "").replace(/^data:[^,]*,/, ""); if (b64.length < 1000 || b64.length > 6000000) return out({ ok: false, error: "size" }, 413);
    const png = /png/i.test(String(b.type || "")), bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const ym = new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 7), path = ym + "/" + slug + "-" + Date.now() + (png ? ".png" : ".jpg");
    const { error: ue } = await db.storage.from("setup").upload(path, bytes, { contentType: png ? "image/png" : "image/jpeg", upsert: false });
    if (ue) return out({ ok: false, error: "storage" }, 500);
    const { data, error } = await db.rpc("coe_setup_put", { p_name: s.name || "", p_ym: ym, p_path: path });
    return error ? out({ ok: false, error: "db" }, 500) : out({ ok: true, data });
  }
  if (b.op === "teacherCard") {   // 17 Oct · management's teacher card: staff list, profile, 6 months of attendance (coe_teacher_card_meta)
    // + her pay, extras and students from her home screen as the main function works it out (coe › calc getBootstrap as her)
    const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
    const { data: s } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
    if (!s || new Date(s.exp).getTime() < Date.now() || s.mode !== "mgmt") return out({ ok: false, error: "AUTH" }, 401);
    const { data: meta, error } = await db.rpc("coe_teacher_card_meta", { p_name: String(b.name || "") });
    if (error || !meta || !meta.name) return out({ ok: false, error: "db" }, 500);
    const r = await fetch(Deno.env.get("SUPABASE_URL") + "/functions/v1/coe", { method: "POST", headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ op: "calc", fn: "getBootstrap", args: [], as: meta.name, token }) }).then((x) => x.json()).catch(() => null);
    const d = r && r.ok && r.data; if (!d || !d.me) return out({ ok: false, error: "home" }, 500);
    const me = Object.assign({}, d.me); delete me.role; delete me.email;
    return out({ ok: true, data: Object.assign({}, meta, { me, pay: d.pay || [], adj: d.adj || [], students: (d.students || []).length }), at: new Date().toISOString() });
  }
  if (b.op === "stuClasses") {   // 18 Oct · a student's class list (Google's stuClasses_, 45 days back to 120 ahead) from the class table (CL18)
    const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
    const { data: s } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
    if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
    const { data: cl } = await db.from("docs").select("data").eq("key", "sys:cl18").maybeSingle();   // only once the whole range has been copied (CL18, every 6 h by day, 12 h at night)
    if (!cl || !cl.data || Date.now() - Date.parse(cl.data.at) > 16 * 3600e3) return out({ ok: false, error: "not ready" }, 503);
    try { await sweepPend(); } catch (_e) { }
    const { data, error } = await db.rpc("coe_stu_classes", { p_code: String(b.code || ""), p_teacher: s.mode === "mgmt" ? "" : String(s.name || "") });
    if (error) return out({ ok: false, error: "db" }, 500);
    return data == null ? out({ ok: false, error: "not found" }, 404) : out({ ok: true, data, at: new Date().toISOString() });
  }
  if (b.op === "lateDone") {   // 16 Oct · one person decides a late time-in, it leaves everyone's list
    const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
    const { data: s } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
    if (!s || new Date(s.exp).getTime() < Date.now() || s.mode !== "mgmt") return out({ ok: false, error: "AUTH" }, 401);
    const row = String(b.row || "").slice(0, 20), cond = String(b.cond || "").slice(0, 20);
    if (!/^\d+$/.test(row) || !/^(Excused|Unexcused|Waive)$/.test(cond)) return out({ ok: false, error: "bad request" }, 400);
    const { error } = await db.rpc("coe_late_done", { p_row: row, p_cond: cond, p_by: s.name || "" });
    return out({ ok: !error });
  }
  if (b.op === "classEdit") {   // 19 Oct · CE19: cancel / restore / move one class, saved in the class table at once; Google Calendar follows in seconds
    // (the same editClass called on Google right away; if that call does not get through, Google's minute job replays it from `writes`).
    // A change Google refuses is put back as it was (trigger coe_class_edit_revert; the later / make-up rows here). 20 Oct: later classes and make-ups too.
    const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
    const { data: s } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
    if (!s || new Date(s.exp).getTime() < Date.now() || s.mode !== "mgmt") return out({ ok: false, error: "AUTH" }, 401);
    const id = String(b.id || "").slice(0, 120), f = (b.f && typeof b.f === "object") ? b.f : {}, act = String(f.action || "");
    const stopAll = act === "cancel" && !!f.forward;   // 19 Oct · "Stop this schedule": this class and every later one on the same weekday and time, saved here at once
    const moveAll = act === "move" && !!f.forward;     // 20 Oct · "Moving forward · also move the later classes": the same shift, new time and teacher, up to 80 classes (Google's rule)
    if (!id || !/^(cancel|restore|move)$/.test(act) || (f.forward && !stopAll && !moveAll) || (act === "cancel" && f.makeup && f.forward)) return out({ ok: false, error: "google" }, 400);
    const { data: row } = await db.from("classes").select("*").eq("id", id + "|" + String(f.start || "")).maybeSingle();
    if (!row || !row.data) return out({ ok: false, error: "google" }, 404);
    const d = JSON.parse(JSON.stringify(row.data)), now = new Date(), hm = (x: Date) => new Date(x.getTime() + 8 * 3600e3).toISOString().slice(11, 16);
    const md = now.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "Asia/Manila" });
    let nrow: any = null, note = "";
    const t0 = String(d.title || "").trim().replace(/\s+X$/i, "");
    if (act !== "move") {
      const cancel = act === "cancel", rs = String(f.reason || "").replace(/\s+/g, " ").trim().slice(0, 120);
      d.cancelled = cancel; d.title = t0 + (cancel ? " X" : ""); d.why = cancel ? (rs ? rs + " · " + s.name + " · " + md : "") : "";
      nrow = { ...row, cancelled: cancel, data: d, updated_at: now.toISOString() };
      note = (cancel ? "Cancelled " : "Restored ") + t0 + " · " + String(row.day) + " " + hm(new Date(row.starts_at)) + (cancel && rs ? " · " + rs : "");
      if (cancel && f.makeup && row.code) {   // 20 Oct · Google's make-up rule: one more class after the last booked class with the same title, next day of the weekly pattern, same time and length
        const st0 = new Date(row.starts_at), en0 = new Date(row.ends_at), M8 = (x: Date) => new Date(x.getTime() + 8 * 3600e3);
        const { data: L } = await db.from("classes").select("starts_at,data").eq("code", row.code).eq("cancelled", false).gte("starts_at", new Date(st0.getTime() - 28 * 864e5).toISOString()).lte("starts_at", new Date(Date.now() + 240 * 864e5).toISOString()).limit(400);
        const starts = (L || []).filter((x: any) => String((x.data || {}).title || "").trim() === t0).map((x: any) => new Date(x.starts_at)).concat([st0]).sort((a: Date, b2: Date) => a.getTime() - b2.getTime());
        const last = starts[starts.length - 1], days: Record<number, number> = {};
        if (last.getTime() - Date.now() > 100 * 864e5) note += " · make-up: Google Calendar checks the weekly class";   // the class copy reaches 120 days ahead: a weekly class with no end date looks like it ends there
        else {
          starts.forEach((x: Date) => days[M8(x).getUTCDay()] = 1);
          const hh = M8(last).toISOString().slice(11, 16), mins = Math.round((en0.getTime() - st0.getTime()) / 6e4);
          for (let k = 1; k <= 60; k++) { const x = new Date(last.getTime() + k * 864e5); if (!days[M8(x).getUTCDay()]) continue;
            const day = M8(x).toISOString().slice(0, 10), a1 = new Date(day + "T" + hh + ":00+08:00"), a2 = new Date(a1.getTime() + mins * 6e4);
            (b as any)._mk = { day, hh, a1: a1.toISOString(), a2: a2.toISOString() }; note += " · make-up added " + day + " " + hh; break; }
        }
      }
    } else {
      const tm = String(f.time || "").trim();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(String(f.date || "")) || !/^([01]?\d|2[0-3]):[0-5]\d$/.test(tm)) return out({ ok: true, data: { ok: false, msg: "Date and 24h time, e.g. 19:30." } });
      const st0 = new Date(row.starts_at), en0 = new Date(row.ends_at), mins = Math.max(10, Math.min(180, Number(f.mins) || Math.round((en0.getTime() - st0.getTime()) / 6e4)));
      const ns = new Date(f.date + "T" + (tm.length === 4 ? "0" + tm : tm) + ":00+08:00"), ne = new Date(ns.getTime() + mins * 6e4);
      const oldT = String((row.teachers || [])[0] || ""), nt = String(f.teacher || "").trim(), tch = nt || oldT, lc = tch.toLowerCase();
      if (!f.force && lc) {   // the same check Google makes: only a double booking stops it
        const { data: cl } = await db.from("classes").select("id,student,starts_at,ends_at,data").eq("day", f.date).eq("cancelled", false).contains("teachers", JSON.stringify([lc])).lt("starts_at", ne.toISOString()).gt("ends_at", ns.toISOString()).limit(5);
        const hit = (cl || []).find((x: any) => String((x.data || {}).id || "") !== String(d.id || ""));
        if (hit) return out({ ok: true, data: { ok: false, conflict: true, msg: f.date + " " + tm + " · Teacher " + tch + " already has " + (hit.student || (hit.data || {}).title || "a class") + " " + hm(new Date(hit.starts_at)) + "–" + hm(new Date(hit.ends_at)) + " · change the time, or save anyway" } });
      }
      const sIso = ns.toISOString(), eIso = ne.toISOString();
      if (ns.getTime() !== st0.getTime()) d.mv = { start: st0.toISOString(), end: en0.toISOString() };   // Google keeps the old time ("Moved from") for the Rescheduled picture
      d.start = sIso; d.end = eIso;
      let teachers = row.teachers || [];
      if (nt && nt.toLowerCase() !== oldT.toLowerCase()) { teachers = [nt.toLowerCase()]; d.teachers = teachers; if (d.code && d.student) d.title = [d.code, d.student, d.book, nt].filter(Boolean).join("-") + (row.cancelled ? " X" : ""); }
      nrow = { ...row, id: String(d.id) + "|" + sIso, day: f.date, starts_at: sIso, ends_at: eIso, teachers, data: d, updated_at: now.toISOString() };
      note = "Moved " + t0 + " (" + String(row.day) + " " + hm(st0) + ") to " + f.date + " " + tm;
      if (moveAll && row.code) {   // the later classes of this weekly schedule move by the same shift
        const k = (x: any) => { const t = new Date(new Date(x.starts_at).getTime() + 8 * 3600e3); return t.getUTCDay() + "|" + t.toISOString().slice(11, 16); }, k0 = k(row), t0s = JSON.stringify(row.teachers || []), shift = ns.getTime() - st0.getTime();
        const { data: L } = await db.from("classes").select("*").eq("code", row.code).eq("cancelled", false).gt("starts_at", row.starts_at).order("starts_at").limit(400);
        const M = (L || []).filter((x: any) => x.id !== row.id && k(x) === k0 && JSON.stringify(x.teachers || []) === t0s && !/-(TC|SC)$/i.test(String((x.data || {}).title || "").trim())).slice(0, 80);
        const moved: any[] = [], clash: string[] = [];
        for (const x of M) {
          const a0 = new Date(x.starts_at), a1 = new Date(a0.getTime() + shift), a2 = new Date(a1.getTime() + mins * 6e4), dd = new Date(a1.getTime() + 8 * 3600e3).toISOString().slice(0, 10);
          if (!f.force && lc) { const { data: cl } = await db.from("classes").select("id,student,starts_at,ends_at,data").eq("day", dd).eq("cancelled", false).contains("teachers", JSON.stringify([lc])).lt("starts_at", a2.toISOString()).gt("ends_at", a1.toISOString()).limit(5);
            const hit = (cl || []).find((y: any) => y.id !== x.id && String((y.data || {}).id || "") !== String(d.id || "")); if (hit) clash.push(dd + " " + hm(a1) + " · " + (hit.student || (hit.data || {}).title || "a class")); }
          const x2 = JSON.parse(JSON.stringify(x.data || {})); if (shift) x2.mv = { start: x.starts_at, end: x.ends_at }; x2.start = a1.toISOString(); x2.end = a2.toISOString();
          if (nt && nt.toLowerCase() !== oldT.toLowerCase()) { x2.teachers = teachers; if (x2.code && x2.student) x2.title = [x2.code, x2.student, x2.book, nt].filter(Boolean).join("-"); }
          moved.push({ before: x, after: { ...x, id: String(x2.id || String(x.id).split("|")[0]) + "|" + a1.toISOString(), day: dd, starts_at: a1.toISOString(), ends_at: a2.toISOString(), teachers, data: x2, updated_at: now.toISOString() } });
        }
        if (clash.length) return out({ ok: true, data: { ok: false, conflict: true, msg: "Later classes · Teacher " + tch + " already has " + clash.slice(0, 3).join(" · ") + (clash.length > 3 ? " · +" + (clash.length - 3) + " more" : "") + " · change the time, or save anyway" } });
        (b as any)._moved = moved;
        if (moved.length) { note += " and " + moved.length + " later"; (b as any)._fwd = { n: moved.length, until: moved[moved.length - 1].after.day }; }
      }
    }
    const later: any[] = [];
    if (stopAll && row.code) {   // the later classes of the same weekly schedule (same student, teacher, weekday and time)
      const k = (x: any) => { const t = new Date(new Date(x.starts_at).getTime() + 8 * 3600e3); return t.getUTCDay() + "|" + t.toISOString().slice(11, 16); }, k0 = k(row), t0s = JSON.stringify(row.teachers || []);
      const { data: L } = await db.from("classes").select("*").eq("code", row.code).eq("cancelled", false).gt("starts_at", row.starts_at).limit(400);
      for (const x of (L || [])) if (x.id !== row.id && k(x) === k0 && JSON.stringify(x.teachers || []) === t0s && !/-(TC|SC)$/i.test(String((x.data || {}).title || "").trim())) later.push(x);
      note += later.length ? " and " + later.length + " later" : "";
    }
    const rid = b.rid ? String(b.rid).slice(0, 80) : null;
    if (rid) { const { data: old } = await db.from("writes").select("id").eq("rid", rid).maybeSingle(); if (old) return out({ ok: true, queued: old.id, dup: true, note }); }
    const moved: any[] = (b as any)._moved || [];
    const { data: w, error: we } = await db.from("writes").insert({ rid, fn: "editClass", args: [token, id, f, { before: row, newid: nrow.id, later: later.map((x: any) => ({ id: x.id, data: x.data, cancelled: x.cancelled })), moved: moved.map((m: any) => ({ before: m.before, newid: m.after.id })) }], who: s.name, mode: s.mode, status: "busy" }).select("id").single();
    if (we || !w) return out({ ok: false, error: "google" }, 500);
    for (const x of later) { const d2 = JSON.parse(JSON.stringify(x.data || {})); d2.cancelled = true; d2.title = String(d2.title || "").trim().replace(/\s+X$/i, "") + " X"; d2.why = d.why;
      await db.from("classes").update({ cancelled: true, data: d2, updated_at: now.toISOString() }).eq("id", x.id); }
    for (const m of moved) { if (m.after.id !== m.before.id) await db.from("classes").delete().eq("id", m.before.id); await db.from("classes").upsert(m.after, { onConflict: "id" }); }
    if (nrow.id !== row.id) { await db.from("classes").delete().eq("id", row.id); }
    const { error: ue } = await db.from("classes").upsert(nrow, { onConflict: "id" });
    if (ue) { await db.from("writes").update({ status: "new" }).eq("id", w.id); return out({ ok: true, queued: w.id, note }); }
    const mk = (b as any)._mk, mkId = mk ? "pend-" + w.id + "-m|" + mk.a1 : "";
    if (mk) { const md2 = { ...JSON.parse(JSON.stringify(row.data)), id: "pend-" + w.id + "-m", pend: w.id, mv: null, why: "", cancelled: false, title: t0, start: mk.a1, end: mk.a2, makeup: true };
      const { error: me } = await db.from("classes").insert({ id: mkId, day: mk.day, starts_at: mk.a1, ends_at: mk.a2, code: row.code, student: row.student, teachers: row.teachers, cancelled: false, data: md2, updated_at: now.toISOString() });
      if (me) console.warn("makeup row", me.message); }
    const google = (async () => {
      let st = "new", result: any = null, err = "";
      try {
        const ac = new AbortController(), tid = setTimeout(() => ac.abort(), 120000);
        const r = await fetch(GAS_URL, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ fn: "editClass", args: [token, id, f], rid: "ce" + w.id }), signal: ac.signal, redirect: "follow" }).then((x) => x.json()).finally(() => clearTimeout(tid));
        if (r && r.ok && r.data && r.data.ok) { st = "done"; result = r.data; }
        else if (r && r.ok && r.data && r.data.ok === false) { st = "error"; result = r.data; err = String(r.data.msg || "refused").slice(0, 300); }
        else if (r && r.ok === false && !/lock|timed? ?out|busy|service|internal|try again|too many/i.test(String(r.error || ""))) { st = "error"; err = String(r.error || "refused").slice(0, 300); }
      } catch (_e) { st = "new"; }   // no answer: Google's minute job replays it
      if (st === "error") {   // Google refused: the later classes go back too (the database trigger puts back the first one)
        try {
          for (const m of moved) { if (m.after.id !== m.before.id) await db.from("classes").delete().eq("id", m.after.id); await db.from("classes").upsert({ ...m.before, updated_at: new Date().toISOString() }, { onConflict: "id" }); }
          for (const x of later) await db.from("classes").update({ cancelled: x.cancelled, data: x.data, updated_at: new Date().toISOString() }).eq("id", x.id);
          if (mkId) await db.from("classes").delete().eq("id", mkId);
        } catch (_e) { }
      }
      if (st === "done" && mkId) {   // Google picked its own make-up day (it also sees the Ops calendar): the row here follows it
        try { const m = String((result && result.note) || "").match(/make-up added (\d{4}-\d{2}-\d{2}) (\d{1,2}:\d{2})/);
          if (!m) await db.from("classes").delete().eq("id", mkId);
          else if (m[1] + " " + m[2] !== mk.day + " " + mk.hh) { const a1 = new Date(m[1] + "T" + (m[2].length === 4 ? "0" + m[2] : m[2]) + ":00+08:00"), a2 = new Date(a1.getTime() + (Date.parse(mk.a2) - Date.parse(mk.a1)));
            const { data: o } = await db.from("classes").select("*").eq("id", mkId).maybeSingle();
            if (o) { await db.from("classes").delete().eq("id", mkId); await db.from("classes").insert({ ...o, id: "pend-" + w.id + "-m|" + a1.toISOString(), day: m[1], starts_at: a1.toISOString(), ends_at: a2.toISOString(), data: { ...o.data, start: a1.toISOString(), end: a2.toISOString() } }); } }
        } catch (_e) { }
      }
      await db.from("writes").update(st === "new" ? { status: "new" } : { status: st, result, error: err || null, done_at: new Date().toISOString() }).eq("id", w.id).eq("status", "busy");
    })();
    try { (globalThis as any).EdgeRuntime.waitUntil(google); } catch (_e) { await google; }
    return out({ ok: true, queued: w.id, note, title: d.title, fwd: (b as any)._fwd || null });
  }
  if (b.op === "classAdd") {   // 20 Oct · AC20: Add class (one class or a weekly package, regular or trial) saved in the class table at once; Google Calendar
    // makes the events in the background (the same addClass, with its referral / source saving and invites). The rows here are marked `pend` (= the writes id)
    // until Google's own day copy brings the real events; then they are removed. Refused by Google → they are removed and the person is told.
    const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
    const { data: s } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
    if (!s || new Date(s.exp).getTime() < Date.now() || s.mode !== "mgmt") return out({ ok: false, error: "AUTH" }, 401);
    const f = (b.f && typeof b.f === "object") ? b.f : {};
    const code = String(f.code || "").trim().toUpperCase(), student = String(f.student || "").trim().replace(/-/g, " "), book = String(f.book || "").trim().replace(/-/g, " ");
    const teacher = String(f.teacher || "").trim().replace(/^teacher\s+/i, ""), kind = String(f.kind || ""), mins = Math.max(10, Math.min(180, Number(f.mins) || 50)), time = String(f.time || "").trim();
    const sc = kind === "SC";   // 20 Oct v38 · a substitute: the SC class and the regular class cancelled here at once; Google lodges the absence case (subOut_)
    if (sc && ((Array.isArray(f.days) && f.days.length) || Number(f.count) > 1)) return out({ ok: true, data: { ok: false, msg: "A substitute is for one class · untick Weekly package" } });
    try { await sweepPend(); } catch (_e) { }
    if (!/^ST-\d{4}-\d{3}$/.test(code) || !student) return out({ ok: true, data: { ok: false, msg: "Choose a student." } });
    if (!teacher) return out({ ok: true, data: { ok: false, msg: "Choose a teacher." } });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(f.date || "")) || !/^([01]?\d|2[0-3]):[0-5]\d$/.test(time)) return out({ ok: true, data: { ok: false, msg: "Date and 24h time, e.g. 19:30." } });
    const days = (Array.isArray(f.days) ? f.days : []).map(Number).filter((d: number) => d >= 0 && d <= 6), count = Math.max(1, Math.min(60, Number(f.count) || 1));
    const dates: string[] = [];
    if (days.length && count > 1) { const d0 = Date.parse(f.date + "T12:00:00Z"); for (let k = 0; dates.length < count && k < 400; k++) { const x = new Date(d0 + k * 864e5); if (days.indexOf(x.getUTCDay()) >= 0) dates.push(x.toISOString().slice(0, 10)); } }
    else dates.push(String(f.date));
    const hh = time.length === 4 ? "0" + time : time, lc = teacher.toLowerCase(), hm = (x: Date) => new Date(x.getTime() + 8 * 3600e3).toISOString().slice(11, 16);
    const slots = dates.map((day) => { const st = new Date(day + "T" + hh + ":00+08:00"); return { day, st, en: new Date(st.getTime() + mins * 6e4) }; });
    const from = slots[0].st.toISOString(), to = slots[slots.length - 1].en.toISOString();
    const cols = "id,code,student,starts_at,ends_at,teachers,data";
    const [{ data: e1 }, { data: e2 }] = await Promise.all([db.from("classes").select(cols).eq("cancelled", false).eq("code", code).gte("ends_at", from).lte("starts_at", to).limit(2000),
      db.from("classes").select(cols).eq("cancelled", false).contains("teachers", JSON.stringify([lc])).gte("ends_at", from).lte("starts_at", to).limit(5000)]);
    const E = [...(e1 || []), ...(e2 || [])], skip = new Set<string>(), clash: string[] = [];
    for (const z of slots) {
      if (E.some((x: any) => String(x.code || "").toUpperCase() === code && new Date(x.starts_at).getTime() === z.st.getTime() && (!sc || /-SC$/i.test(String((x.data || {}).title || "").trim())))) { skip.add(z.day); continue; }   // Google's rule: the same student at the same start is already there (an SC only clashes with another SC)
      if (!f.force) { const hit = E.find((x: any) => (x.teachers || []).includes(lc) && new Date(x.starts_at).getTime() < z.en.getTime() && new Date(x.ends_at).getTime() > z.st.getTime());
        if (hit) clash.push(z.day + " " + hm(z.st) + " · Teacher " + teacher + " already has " + (hit.student || (hit.data || {}).title || "a class") + " " + hm(new Date(hit.starts_at)) + "–" + hm(new Date(hit.ends_at))); }
    }
    if (clash.length) return out({ ok: true, data: { ok: false, conflict: true, msg: clash.slice(0, 3).join(" · ") + (clash.length > 3 ? " · +" + (clash.length - 3) + " more" : "") + " · change the time, or add anyway" } });
    const make = slots.filter((z) => !skip.has(z.day));
    if (!make.length) return out({ ok: true, data: { ok: false, msg: student + " already has " + (slots.length === 1 ? "a class at " + time + " that day." : "these classes.") } });
    const title = [code, student, book, teacher].filter(Boolean).join("-") + (kind === "TC" ? "-TC" : sc ? "-SC" : "");
    const rid = b.rid ? String(b.rid).slice(0, 80) : null;
    if (rid) { const { data: old } = await db.from("writes").select("id").eq("rid", rid).maybeSingle(); if (old) return out({ ok: true, data: { ok: true, dup: true, queued: old.id, title, dates: make.map((z) => z.day), mins, kind } }); }
    const g = { ...f, teacher };   // Google gets the teacher's plain name
    const { data: w, error: we } = await db.from("writes").insert({ rid, fn: "addClass", args: [token, g, { pend: true, days: make.map((z) => z.day) }], who: s.name, mode: s.mode, status: "busy" }).select("id").single();
    if (we || !w) return out({ ok: false, error: "google" }, 500);
    const rows = make.map((z, i) => { const pid = "pend-" + w.id + "-" + i, sI = z.st.toISOString(), eI = z.en.toISOString();
      return { id: pid + "|" + sI, day: z.day, starts_at: sI, ends_at: eI, code, student, teachers: [lc], cancelled: false, updated_at: new Date().toISOString(),
        data: { id: pid, pend: w.id, mv: null, why: "", book, code, meet: "", start: sI, end: eI, title, student, teachers: [lc], cancelled: false, type: kind === "TC" ? "Trial" : "" } }; });
    const { error: ie } = await db.from("classes").insert(rows);
    if (ie) console.warn("classAdd rows", ie.message);   // Google still makes the classes; its day copy brings them
    let off: any[] = [];
    if (sc) {   // the regular class at that time: cancelled here at once (Google: " X", RSVP No, "Cancelled: Sub · …", no make-up)
      const ab = (f.abs && typeof f.abs === "object") ? f.abs : {}, why = String(ab.why || "");
      const md = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "Asia/Manila" });
      const rs = "Sub · Teacher " + teacher + " · " + (why === "leave" ? "approved leave" : why === "coe" ? "CupOfEnglish reason" : why === "none" ? "no notice" : "informed " + String(ab.told || "?")) + " · " + s.name + " · " + md;
      const { data: O } = await db.from("classes").select("*").eq("code", code).eq("cancelled", false).eq("starts_at", make[0].st.toISOString()).limit(5);
      off = (O || []).filter((x: any) => !String(x.id).startsWith("pend-") && !/-SC$/i.test(String((x.data || {}).title || "").trim()));
      for (const x of off) { const d2 = JSON.parse(JSON.stringify(x.data || {})); d2.cancelled = true; d2.title = String(d2.title || "").trim().replace(/\s+X$/i, "") + " X"; d2.why = rs;
        await db.from("classes").update({ cancelled: true, data: d2, updated_at: new Date().toISOString() }).eq("id", x.id); }
      if (off.length) await db.from("writes").update({ args: [token, g, { pend: true, days: make.map((z) => z.day), off: off.map((x: any) => ({ id: x.id, data: x.data })) }] }).eq("id", w.id);
    }
    const google = (async () => {
      let st = "done", result: any = null, err = "";
      try {
        const ac = new AbortController(), tid = setTimeout(() => ac.abort(), 380000);
        const r = await fetch(GAS_URL, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ fn: "addClass", args: [token, g], rid: "ac" + w.id }), signal: ac.signal, redirect: "follow" }).then((x) => x.json()).finally(() => clearTimeout(tid));
        if (r && r.ok && r.data && r.data.ok) result = r.data;
        else if (r && r.ok && r.data && r.data.ok === false) { st = /already has/i.test(String(r.data.msg || "")) ? "done" : "error"; result = r.data; err = String(r.data.msg || "refused").slice(0, 300); }   // "already has" = Google made them on an earlier try
        else { st = "error"; err = String((r && r.error) || "Google did not answer").slice(0, 300); }
      } catch (_e) { st = "done"; result = { slow: true }; }   // Google took over 6 min: it is still making them (its day copy brings the real rows)
      await db.from("writes").update({ status: st, result, error: err || null, done_at: new Date().toISOString() }).eq("id", w.id);
      if (st === "error") { await db.from("classes").delete().like("id", "pend-" + w.id + "-%");
        for (const x of off) await db.from("classes").update({ cancelled: false, data: x.data, updated_at: new Date().toISOString() }).eq("id", x.id); }   // the regular class is back
      else { const { data: real } = await db.from("classes").select("starts_at,data").eq("code", code).eq("cancelled", false).not("id", "like", "pend-%").in("starts_at", rows.map((x) => x.starts_at));
        const have = new Set((real || []).filter((x: any) => /-SC$/i.test(String((x.data || {}).title || "").trim()) === sc).map((x: any) => new Date(x.starts_at).getTime()));
        const gone = rows.filter((x) => have.has(new Date(x.starts_at).getTime())).map((x) => x.id);
        for (let i = 0; i < gone.length; i += 100) await db.from("classes").delete().in("id", gone.slice(i, i + 100)); }
    })();
    try { (globalThis as any).EdgeRuntime.waitUntil(google); } catch (_e) { await google; }
    const D = make.map((z) => z.day), single = D.length === 1;
    return out({ ok: true, data: { ok: true, queued: w.id, title, dates: D, date: D[0], mins, kind, note: (single ? D[0] + " " + time : D.length + " classes from " + D[0] + " · " + time) + " · Teacher " + teacher + (skip.size ? " · " + skip.size + " already there" : "") + (sc ? (off.length ? " · the regular class is cancelled" : " · no regular class at that time") + " · the absence case follows from Google" : "") + " · Google Calendar follows" } });
  }
  if (b.op === "trialData") {   // 20 Oct · TR20: everything to draw a trial report in the app at once — the teacher's answers (TR-DATA row, or her app submission
    // before Google copies it), the learner type pick, and the CEFR can-do and roadmap tables (TR-CEFR, TR-PATH). Management only.
    const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
    const { data: s } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
    if (!s || new Date(s.exp).getTime() < Date.now() || s.mode !== "mgmt") return out({ ok: false, error: "AUTH" }, 401);
    const day = String(b.date || "").slice(0, 10), stu = String(b.student || "").trim().toLowerCase();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !stu) return out({ ok: false, error: "bad request" }, 400);
    const [{ data: T }, { data: W }, { data: K }, { data: C }, { data: P }] = await Promise.all([
      db.from("sheet_rows").select("r,data").eq("tab", "TR-DATA").lte("r", 160).order("r").limit(160),   // newest at the top of TR-DATA
      db.from("writes").select("id,who,created_at,args,status").eq("fn", "tTrialSubmit").gte("created_at", new Date(Date.now() - 40 * 864e5).toISOString()).order("id", { ascending: false }).limit(300),
      db.from("sheet_rows").select("data").eq("tab", "TR-PICK").limit(400),
      b.tables === false ? Promise.resolve({ data: null }) : db.from("sheet_rows").select("r,data").eq("tab", "TR-CEFR").order("r").limit(200),
      b.tables === false ? Promise.resolve({ data: null }) : db.from("sheet_rows").select("r,data").eq("tab", "TR-PATH").order("r").limit(200)]);
    const tr = (T || []).filter((x: any) => String((x.data || [])[5] || "").trim().toLowerCase() === stu && String((x.data || [])[2] || "").slice(0, 10) === day)[0];
    const w = (W || []).find((x: any) => { const c = (x.args || [])[1] || {}; return String(c.student || "").trim().toLowerCase() === stu && String(c.date || "") === day; });
    const pk = (K || []).map((x: any) => x.data || []).find((d: any) => String(d[0] || "").toLowerCase() === day + "|" + stu);
    return out({ ok: true, tr: tr ? { r: tr.r, data: tr.data } : null,
      sub: w ? { id: w.id, who: w.who, at: w.created_at, status: w.status, c: (w.args || [])[1] || {}, f: (w.args || [])[2] || {} } : null,
      pick: pk ? String(pk[3] || "") : "", cefr: C ? C.map((x: any) => x.data) : null, path: P ? P.map((x: any) => x.data) : null });
  }
  if (b.op === "setBook") {   // 19 Oct · SB19: Change book in the class table at once (coe_set_book, Google's own rule); Google Calendar follows (mgmtSetBook)
    const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
    const { data: s } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
    if (!s || new Date(s.exp).getTime() < Date.now() || s.mode !== "mgmt") return out({ ok: false, error: "AUTH" }, 401);
    const A: any[] = Array.isArray(b.args) ? b.args.slice(0, 4).map((x: unknown) => String(x == null ? "" : x).slice(0, 60)) : [];
    const { data: cl } = await db.from("docs").select("data").eq("key", "sys:cl18").maybeSingle();   // the class table must cover the whole range
    if (!cl || !cl.data || Date.now() - Date.parse(cl.data.at) > 16 * 3600e3) return out({ ok: false, error: "google" }, 503);
    const { data: r, error } = await db.rpc("coe_set_book", { p_code: A[0] || "", p_book: A[1] || "", p_from: A[2] || "", p_teacher: A[3] || "" });
    if (error || !r) return out({ ok: false, error: "google" }, 400);
    const rows = r.rows || []; delete r.rows;
    const { data: w } = await db.from("writes").insert({ fn: "mgmtSetBook", args: [token, A[0], A[1], A[2], A[3] || "", { rows }], who: s.name, mode: s.mode, status: "busy" }).select("id").single();
    if (!w) { for (const y of rows) await db.from("classes").update({ data: y.data }).eq("id", y.id); return out({ ok: false, error: "google" }, 500); }
    const google = (async () => {
      let st = "new", result: any = null, err = "";
      try {
        const ac = new AbortController(), tid = setTimeout(() => ac.abort(), 120000);
        const g = await fetch(GAS_URL, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ fn: "mgmtSetBook", args: [token, A[0], A[1], A[2], A[3] || ""], rid: "sb" + w.id }), signal: ac.signal, redirect: "follow" }).then((x) => x.json()).finally(() => clearTimeout(tid));
        if (g && g.ok && g.data && g.data.ok) { st = "done"; result = g.data; }
        else if (g && g.ok && g.data && g.data.ok === false) { st = "error"; result = g.data; err = String(g.data.msg || "refused").slice(0, 300); }
        else if (g && g.ok === false && !/lock|timed? ?out|busy|service|internal|try again|too many/i.test(String(g.error || ""))) { st = "error"; err = String(g.error || "refused").slice(0, 300); }
      } catch (_e) { st = "new"; }
      await db.from("writes").update(st === "new" ? { status: "new" } : { status: st, result, error: err || null, done_at: new Date().toISOString() }).eq("id", w.id).eq("status", "busy");
    })();
    try { (globalThis as any).EdgeRuntime.waitUntil(google); } catch (_e) { await google; }
    return out({ ok: true, data: Object.assign({}, r, { queued: w.id }) });
  }
  if (b.op === "writeStatus") {   // 19 Oct · how a save queued by this person went (done / error / still waiting)
    const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
    const { data: s } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
    if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
    const { data: w } = await db.from("writes").select("id,fn,status,error,result,who,created_at").eq("id", Number(b.id) || 0).maybeSingle();
    if (!w || String(w.who || "") !== String(s.name || "")) return out({ ok: false, error: "not found" }, 404);
    if (w.status === "busy" && w.fn !== "addClass" && Date.now() - Date.parse(w.created_at) > 180e3) { await db.from("writes").update({ status: "new" }).eq("id", w.id).eq("status", "busy"); w.status = "new"; }   // the direct call never reported back: Google's minute job takes it
    return out({ ok: true, status: w.status, error: w.error || "", result: w.status === "done" || w.status === "error" ? w.result : null });
  }
  if (b.op === "trialsAhead") {   // 16 Oct · trial classes booked in the calendar (title …-TC), 4 days back to 30 days ahead (management)
    const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
    const { data: s, error: se } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
    if (se) return out({ ok: false, error: "db" }, 500);
    if (!s || new Date(s.exp).getTime() < Date.now() || s.mode !== "mgmt") return out({ ok: false, error: "AUTH" }, 401);
    const from = new Date(Date.now() - 4 * 864e5).toISOString(), to = new Date(Date.now() + 30 * 864e5).toISOString();
    const { data: C, error: ce } = await db.from("classes").select("id,starts_at,ends_at,code,student,teachers,cancelled,data").gte("starts_at", from).lte("starts_at", to).eq("cancelled", false).order("starts_at", { ascending: true }).limit(3000);
    if (ce) return out({ ok: false, error: "db" }, 500);
    const rows = (C || []).filter((c: any) => { const d = c.data || {}; return d.type === "Trial" || /-TC$/i.test(String(d.title || "").trim()); }).map((c: any) => { const d = c.data || {};
      return { id: c.id, start: c.starts_at, end: c.ends_at, code: c.code || "", student: c.student || d.student || "", teacher: (c.teachers || [])[0] || "", book: d.book || "", moved: d.mv && d.mv.start ? d.mv.start : "" }; });
    const codes = [...new Set(rows.map((r: any) => String(r.code || "").toUpperCase()).filter((c: string) => /^ST-\d{4}-\d{3}$/.test(c)))];
    if (codes.length) { const { data: P } = await db.from("coe_packages").select("code,enrolled,buy,active").in("code", codes).is("removed_at", null);
      const by: Record<string, any> = {}; (P || []).forEach((p: any) => { if (Number(p.enrolled) > 0 && (!by[p.code] || String(p.buy || "") > String(by[p.code].first || ""))) by[p.code] = { lessons: Number(p.enrolled), first: p.buy || "" }; });
      rows.forEach((r: any) => { const p = by[String(r.code || "").toUpperCase()]; if (p) r.pkg = p; }); }   // already enrolled (a package in ACTIVE)
    return out({ ok: true, rows, at: new Date().toISOString() });
  }
  if (b.op !== "write") return out({ ok: false, error: "unknown op" }, 400);
  const fn = String(b.fn || ""), args = b.args;
  if (!FNS.has(fn) || !Array.isArray(args)) return out({ ok: false, error: "not allowed" }, 400);
  if (fn === "mgmtRenewal") {   // (token, code, status, note, until)
    if (args.length < 3 || args.length > 5 || !/^ST-\d{4}-\d{3}$/.test(String(args[1] || "").trim().toUpperCase()) || ["Reminder sent", "Renewing", "Paused", "Not renewing", ""].indexOf(String(args[2] ?? "")) < 0) return out({ ok: false, error: "not allowed" }, 400);
  } else {
    if (args.length !== 2 || !args[1] || typeof args[1] !== "object") return out({ ok: false, error: "not allowed" }, 400);
    const f = args[1];
    if (f.dry || f.file || f.transfer || !/^ST-\d{4}-\d{3}$/.test(String(f.code || ""))) return out({ ok: false, error: "not allowed" }, 400);   // these go to Google directly
  }
  const token = String(args[0] || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: s, error: se } = await db.from("app_sessions").select("name,role,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (se) return out({ ok: false, error: "db" }, 500);
  if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
  if (s.mode !== "mgmt") return out({ ok: false, error: "not allowed" }, 403);
  const rid = b.rid ? String(b.rid).slice(0, 80) : null;
  if (rid) { const { data: old } = await db.from("writes").select("id").eq("rid", rid).maybeSingle(); if (old) return out({ ok: true, queued: true, id: old.id, dup: true }); }
  const { data: w, error: we } = await db.from("writes").insert({ rid, fn, args, who: s.name, mode: s.mode }).select("id").single();
  if (we) { if (rid && /duplicate/i.test(we.message)) return out({ ok: true, queued: true, dup: true }); return out({ ok: false, error: "not saved" }, 500); }
  return out({ ok: true, queued: true, id: w.id });
});
