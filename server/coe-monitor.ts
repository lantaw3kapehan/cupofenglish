// CupOfEnglish · coe-monitor (25 Oct 2026) · management "Monitor": every teacher's day on one screen, from the database.
// POST { token, day?: "yyyy-MM-dd" (Manila, default today) } → {
//   ok, day, now,
//   teachers: [{ name, timeIn: { time, status, mins, out, hours } | null,
//                classes: [{ id, start, end, code, student, book, type, cancelled, ci: { time, status, mins } | null, vid, hw, note }] }],
//   feed: [{ t, time, who, fn, kind, tab, student, status, error }] }   (app saves: writes + coe_activity, newest first)
// Management only.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
const s = (x: unknown) => String(x ?? "");
const hm = (x: unknown) => { const m = s(x).match(/T(\d{2}:\d{2})/); return m ? m[1] : ""; };
const TAB: Record<string, [string, string]> = {
  timeIn: ["Time-ins", "Time-in"], timeOut: ["Time-ins", "Time-out"], decideLate: ["Time-ins", "Late review"],
  classIn: ["Classes", "I'm in"], tSetMeet: ["Classes", "Meeting ID"], tNotMine: ["Classes", "Not my student"], mgmtTagClass: ["Classes", "Class tagged"],
  tVidStart: ["Videos", "Video upload"], tVidDone: ["Videos", "Class video"], tVidExplain: ["Videos", "Video explanation"], mgmtVidFlagSet: ["Videos", "Video review"],
  saveNote: ["Homework & notes", "Class note"], markHomework: ["Homework & notes", "Homework"], tNoteTag: ["Homework & notes", "Note tag"], tHwFlag: ["Homework & notes", "Homework flag"], tGoalsSave: ["Homework & notes", "Learning goals"],
  tFbSubmit: ["Reports", "Monthly feedback"], tPcSubmit: ["Reports", "Progress check"], tTrialSubmit: ["Reports", "Trial report"], tPeerSubmit: ["Reports", "Peer review"],
  mgmtTrialSent: ["Reports", "Trial report sent"], mgmtTrialGroup: ["Reports", "Learner type"], mgmtTrialFu: ["Reports", "Trial follow-up"], mgmtReportSent: ["Reports", "Report sent"],
  tRemindLog: ["Classes", "Reminder"], mgmtRemindLog: ["Classes", "Reminder"],
  tLeaveRequest: ["Leave & cases", "Leave"], tLeaveCancel: ["Leave & cases", "Leave"], tLeaveReply: ["Leave & cases", "Leave"], mgmtLeaveSave: ["Leave & cases", "Leave"], setCaseDone: ["Leave & cases", "Case"],
  mgmtRenewal: ["Students", "Renewal"], mgmtRenewPaid: ["Students", "Renewed · paid"], mgmtEnrolPaid: ["Students", "Enrolled · paid"], saveStudent: ["Students", "Student record"], mgmtPkgFix: ["Students", "Package fix"],
  addSale: ["Money", "Sale"], addExpense: ["Money", "Expense"], tPayVerify: ["Money", "Pay check"],
  tMsgSend: ["Messages", "Message"], mgmtMsgSend: ["Messages", "Message"], mgmtMsgReply: ["Messages", "Message"] };
const SKIP = /^(tMsgSeen|mgmtMsgSeen|tVisitAck|tMsgAck)$/;
Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, st = 200) => new Response(JSON.stringify(o), { status: st, headers: { ...h, "Content-Type": "application/json" } });
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const token = s(b.token); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: se } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!se || new Date(se.exp).getTime() < Date.now() || se.mode !== "mgmt") return out({ ok: false, error: "AUTH" }, 401);
  const today = new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10), day = /^\d{4}-\d{2}-\d{2}$/.test(s(b.day)) ? s(b.day) : today;
  const from = new Date(day + "T00:00:00+08:00").toISOString(), to = new Date(Date.parse(day + "T00:00:00+08:00") + 864e5).toISOString();
  const [C, W, X, V, VD, TI, HW, NO] = await Promise.all([
    db.from("classes").select("data").eq("day", day).limit(1000),
    db.from("writes").select("fn,who,args,status,error,created_at").gte("created_at", from).lt("created_at", to).neq("status", "test").order("created_at", { ascending: false }).limit(1500),
    db.from("coe_activity").select("fn,who,ok,detail,at").gte("at", from).lt("at", to).order("at", { ascending: false }).limit(600),
    db.from("coe_class_videos").select("event_id,teacher").eq("day", day).limit(1000),
    db.from("docs").select("data").eq("key", "sys:vids").maybeSingle(),
    db.from("log_rows").select("data").eq("tab", "T-TIMEIN").like("data->>0", day + "%").limit(1500),
    db.from("sheet_rows").select("data").eq("tab", "S-HOMEWORK").like("data->>1", day + "%").limit(1500),
    db.from("sheet_rows").select("data").eq("tab", "S-NOTES").like("data->>1", day + "%").limit(1500)]);
  if (C.error) return out({ ok: false, error: "db" }, 500);
  const evHas = (rows: any[], j: number) => new Set((rows || []).map((x: any) => s((x.data || [])[j])).filter(Boolean));
  const hwEv = evHas(HW.data || [], 6), noteEv = evHas(NO.data || [], 8), vidEv = new Set((V.data || []).map((x: any) => s(x.event_id)));
  const vdays = (VD.data && VD.data.data && VD.data.data.days && VD.data.data.days[day]) || {};
  const W0 = (W.data || []).filter((w: any) => w.status !== "error"), wtxt = W0.map((w: any) => ({ fn: w.fn, j: JSON.stringify(w.args || []) }));
  const inW = (fn: RegExp, id: string) => wtxt.some((x) => fn.test(x.fn) && x.j.indexOf(id) > -1);
  // time-ins and "I'm in" from the T-TIMEIN copy (+ the ones still in the queue)
  const tin: Record<string, any> = {}, cin: Record<string, any> = {};
  (TI.data || []).forEach((x: any) => { const r = x.data || [], t = s(r[1]).trim().toLowerCase(); if (!t) return;
    const rec = { time: hm(r[3]), status: s(r[6]), mins: r[5] === "" ? null : r[5], out: hm(r[18]), hours: r[19] ?? "" };
    if (s(r[13]) === "Class") { const id = s(r[14]).split(" · ").pop() || ""; if (id && !cin[id]) cin[id] = rec; } else if (!tin[t] || rec.time < tin[t].time) tin[t] = rec; });
  W0.filter((w: any) => w.fn === "timeIn").forEach((w: any) => { const t = s(w.who).trim().toLowerCase(); if (!tin[t]) tin[t] = { time: new Date(Date.parse(w.created_at) + 8 * 3600e3).toISOString().slice(11, 16), status: "", mins: null, out: "", hours: "", q: 1 }; });
  const T: Record<string, any> = {};
  (C.data || []).map((x: any) => x.data || {}).forEach((e: any) => {
    const t = s((e.teachers || [])[0]).trim().toLowerCase(); if (!t) return;
    const o = T[t] || (T[t] = { name: t.replace(/\b\w/g, (c) => c.toUpperCase()), timeIn: tin[t] || null, classes: [] });
    const code = s(e.code).toUpperCase(), id = s(e.id), title = s(e.title);
    const ci = cin[id] || (inW(/^classIn$/, id) ? { time: "", status: "queued", mins: null } : null);
    o.classes.push({ id, start: e.start, end: e.end, code, student: s(e.student), book: s(e.book), cancelled: !!e.cancelled,
      type: /trial|试听|(^|-)\s*TC\s*(\s+X)?\s*$/i.test(title) ? "Trial" : (/\bsub\b|(^|-)\s*SC\s*(\s+X)?\s*$/i.test(title) ? "Sub" : ""),
      ci, vid: vidEv.has(id) || !!vdays[code + "|" + t], hw: hwEv.has(id) || inW(/^(markHomework|saveNote)$/, id), note: noteEv.has(id) || inW(/^saveNote$/, id) }); });
  Object.keys(tin).forEach((t) => { if (!T[t]) T[t] = { name: t.replace(/\b\w/g, (c) => c.toUpperCase()), timeIn: tin[t], classes: [] }; });
  // the teacher's first class of the day: the time-in is its check-in (as on Schedule) — no separate "I'm in"
  const teachers = Object.values(T).map((o: any) => { o.classes.sort((a: any, z: any) => s(a.start).localeCompare(s(z.start)));
    const f = o.classes.find((c: any) => !c.cancelled); if (f && !f.ci && o.timeIn) f.ci = { time: o.timeIn.time, status: o.timeIn.status, mins: o.timeIn.mins, first: 1 }; return o; }).sort((a: any, z: any) => a.name.localeCompare(z.name));
  const mn = (iso: string) => new Date(Date.parse(iso) + 8 * 3600e3).toISOString().slice(11, 16);
  const feed: any[] = [];
  (W.data || []).forEach((w: any) => { if (SKIP.test(w.fn)) return; const A = Array.isArray(w.args) ? w.args : [], o = A[1] && typeof A[1] === "object" ? A[1] : {};
    const k = TAB[w.fn] || ["Other", w.fn]; feed.push({ t: Date.parse(w.created_at), time: mn(w.created_at), who: s(w.who), fn: w.fn, tab: k[0], kind: k[1],
      student: s(o.student || o.name || (typeof A[1] === "string" && /^ST-/.test(A[1]) ? A[1] : "") || o.code).slice(0, 40), status: s(w.status), error: s(w.error).slice(0, 140) }); });
  (X.data || []).forEach((x: any) => { if (SKIP.test(x.fn)) return; const k = TAB[x.fn] || ["Other", x.fn];
    feed.push({ t: Date.parse(x.at), time: mn(x.at), who: s(x.who), fn: x.fn, tab: k[0], kind: k[1], student: s(x.detail).slice(0, 60), status: x.ok === false ? "error" : "done", error: x.ok === false ? s(x.detail).slice(0, 140) : "" }); });
  feed.sort((p, q) => q.t - p.t);
  return out({ ok: true, day, today, now: new Date(Date.now() + 8 * 3600e3).toISOString().slice(11, 16), teachers, feed: feed.slice(0, 800) });
});
