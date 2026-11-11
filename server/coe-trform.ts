// CupOfEnglish · coe-trform v4 (a lower score shows no growth mark, like the tab; checked cell for cell against 13 Google copies) · v3 (op "prrows": the PR-REPORT page values built from the database, cell for cell like the Google tab, so the app draws the same design) · v2 (dates as yyyy-mm-dd; "since" only when the first lesson is inside the year looked at) · v1 (11 Nov 2026, 2065 · Misty: "LET US DO ALL NOW" · trial reports and progress checks off Google).
// From the database only (never Google):
//   op "trial"    { token, c: { code, student, date, time } } → the trial report form (Google's tTrialForm shape): { ok, form, levels, family, done, redo }
//   op "pc"       { token, code } → the progress check form (Google's tPcForm shape): { ok, done, rate, fb, ended, notes, trial, levels, student }
//   op "prrows"   { token, label } or { token, code } → { ok, pick, rows } (45 × 9, the PR-REPORT tab layout); management any, a teacher only her own checks
//   op "pcreport" { token, code } → the newest progress check of a student for the parent report (management): { ok, pc, trial, student, journey }
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
const str = (x: unknown, n = 200) => String(x == null ? "" : x).trim().slice(0, n);
const mn = (ms: number) => new Date(ms + 8 * 3600e3).toISOString();
const LEVELS = ["Pre-A1", "A1", "A2", "B1", "B2", "C1", "C2"];
const num = (x: unknown) => { const n = Number(x); return isFinite(n) ? n : 0; };
function trialOf(t: any) { if (!t) return null; const r = t.row || [];
  return { r: r.slice(6, 15).map((x: any) => { const v = String(x); return v.match(/^\d+$/) ? +v : num(v); }), spk: num(r[15]), lis: num(r[16]), rd: num(r[17]), cefr: String(r[23] || r[21] || ""), date: String(t.trial_date || ""),
    group: String(r[32] || ""), label: String(t.label || ""), total: num(r[18]), teacher: String(t.teacher || "") }; }
function pcOf(p: any) { if (!p) return null; const d = p.data || [];
  return { at: String(d[1] || "").slice(0, 16).replace("T", " "), row: p.seq || p.id, cefr: String(d[22] || d[20] || ""), date: String(d[2] || p.check_day || "").slice(0, 10), label: String(d[0] || ""), total: num(d[19]), teacher: String(d[3] || p.teacher || ""),
    r: (d.slice(7, 16) as any[]).map(num), spk: num(d[16]), lis: num(d[17]), rd: num(d[18]), book: String(d[23] || ""), progress: String(d[24] || ""), next: String(d[25] || ""), progressZh: String(d[26] || ""), nextZh: String(d[27] || "") }; }

const LV = ["Pre-A1", "A1", "A2", "B1", "B2", "C1", "C2"];
const CRIT: [string, string, string][] = [["S1", "Fluency and Coherence", "流利度与连贯性"], ["S2", "Pronunciation", "发音"], ["S3", "Grammatical Accuracy and Range", "语法准确性与丰富度"], ["S4", "Vocabulary Range and Appropriacy", "词汇丰富度与得体性"], ["S5", "Interaction and Communication", "互动交流"],
  ["L1", "Comprehension", "听力理解"], ["L2", "Response to Spoken Prompts", "听后应答"], ["R1", "Comprehension", "阅读理解"], ["R2", "Discussing and Responding to Texts", "阅读讨论与回应"]];
const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], MOL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const fmtN = (n: number) => String(Math.round(n * 100) / 100);
const dots = (v: any) => { const n = Math.max(0, Math.min(4, Math.round(+v || 0))); return n ? "●".repeat(n) + "○".repeat(4 - n) : "—"; };
const grow = (a: number | null, b: number) => a == null ? "" : b > a ? "▲ +" + fmtN(b - a) : b < a ? "" : "=  steady  稳定"   /* like the Google tab: a lower score shows no arrow */;
const zhKey = async (t: string) => "zh:" + (await sha(String(t).replace(/^[ \t\r\n]+|[ \t\r\n]+$/g, ""))).slice(0, 40);
async function prRows(d: any[]) {
  const R = (n: number) => Array(9).fill(""), rows: string[][] = []; for (let i = 0; i < 46; i++) rows.push(R(i));
  const set = (r: number, c: number, v: unknown) => { rows[r][c] = String(v == null ? "" : v); };
  const [{ data: CF }, { data: PA }] = await Promise.all([db.from("sheet_rows").select("data").eq("tab", "TR-CEFR"), db.from("sheet_rows").select("data").eq("tab", "TR-PATH")]);
  const cf: Record<string, any[]> = {}, pa: Record<string, any[]> = {}; (CF || []).forEach((x: any) => cf[String(x.data[0])] = x.data); (PA || []).forEach((x: any) => pa[String(x.data[0])] = x.data);
  const grp = /^teen/i.test(String(d[37] || "")) ? "Teen|" : /^adult/i.test(String(d[37] || "")) ? "Adult|" : "";
  const path = (l: string) => pa[grp + l] || pa[l] || [];
  const lvl = String(d[22] || d[20] || ""), tl = String(d[33] || ""), hasT = !!tl && String(d[32] || "") !== "";
  const nowS = [num(d[16]), num(d[17]), num(d[18]), num(d[19])], trS = hasT ? [num(d[29]), num(d[30]), num(d[31]), num(d[32])] : [null, null, null, null];
  const tr9 = hasT ? String(d[34] || "").split(",").map((x) => +x || 0) : [], now9 = d.slice(7, 16).map(num);
  const dt = new Date(String(d[2]).slice(0, 10) + "T12:00:00Z"), now = new Date(Date.now() + 8 * 3600e3);
  const hm = String(now.getUTCHours()).padStart(2, "0") + ":" + String(now.getUTCMinutes()).padStart(2, "0");
  const lessons = fmtN(num(d[35])), book = String(d[23] || ""), jr = String(d[36] || "").split("\n");
  set(0, 1, "① PROGRESS CHECK  学习进展 ▸"); set(0, 2, d[0]);
  set(5, 1, "PROGRESS REPORT\n学习进展报告");
  set(6, 1, "Report generated  " + MOL[now.getUTCMonth()] + " " + now.getUTCDate() + ", " + now.getUTCFullYear() + "  ·  " + hm + "H   ·   报告生成：" + now.getUTCFullYear() + "年" + (now.getUTCMonth() + 1) + "月" + now.getUTCDate() + "日 " + hm + "H");
  set(7, 1, "Aligned with the Common European Framework of Reference for Languages (CEFR)\n依据《欧洲语言共同参考框架》（CEFR）进行评估与定级");
  rows[8] = ["", "STUDENT  学生  ·  " + d[4], "", "CHECK DATE  评估日期", "LESSONS  已上课时", "", "TEACHER  教师", "", ""];
  rows[9] = ["", String(d[5] || "") + (d[6] ? "  " + d[6] : ""), "", isNaN(dt.getTime()) ? String(d[2]) : MO[dt.getUTCMonth()] + " " + dt.getUTCDate() + ", " + dt.getUTCFullYear(), lessons + "  lessons  节", "", String(d[3] || ""), "", ""];
  rows[10] = ["", "CEFR LEVEL NOW  当前CEFR级别", "", "SINCE THE TRIAL  自试听以来", "", "CAMBRIDGE ENGLISH ≈  对应剑桥英语", "", "", ""];
  const a = LV.indexOf(tl), b = LV.indexOf(lvl), up = b - a;
  const since = !tl ? "Current level  当前水平" : tl + "  →  " + lvl + "\n" + (a < 0 || b < 0 ? "" : up > 0 ? "▲ up " + up + " level" + (up > 1 ? "s" : "") + "  提升" + up + "级" : up === 0 ? "Building strong foundations  稳步巩固" : "");
  rows[11] = ["", lvl, "", since, "", String(path(lvl)[13] || ""), "", "", ""];
  set(12, 1, path(lvl)[3] ? path(lvl)[3] + "\n" + (path(lvl)[4] || "") : "");
  set(13, 1, "SKILL GROWTH  能力成长");
  rows[14] = ["", "SKILL  技能", "TRIAL  试听", "NOW  现在", "GROWTH  进步", "PROFILE NOW  当前能力", "", "", ""];
  const SN: [string, number][] = [["Speaking  口语", 20], ["Listening  听力", 8], ["Reading  阅读", 8], ["Total  总分", 36]];
  const sk = (i: number) => ["", SN[i][0], trS[i] == null ? "—" : trS[i] + " / " + SN[i][1], nowS[i] + " / " + SN[i][1], grow(trS[i], nowS[i]), "", "", "", ""];
  for (let i = 0; i < 4; i++) rows[15 + i] = sk(i);
  let pz = String(d[26] || ""), nz = String(d[27] || "");
  if ((!pz && d[24]) || (!nz && d[25])) { const ks = [await zhKey(String(d[24] || "")), await zhKey(String(d[25] || ""))];
    const { data: Z } = await db.from("docs").select("key,data").in("key", ks); const m: Record<string, string> = {}; (Z || []).forEach((z: any) => m[z.key] = String((z.data || {}).zh || ""));
    pz = pz || (d[24] ? m[ks[0]] || "" : ""); nz = nz || (d[25] ? m[ks[1]] || "" : ""); }
  set(19, 1, "PROGRESS & HIGHLIGHTS  进步与亮点"); set(20, 1, d[24]); set(21, 1, pz);
  set(22, 1, "NEXT FOCUS  下一阶段重点"); set(23, 1, d[25]); set(24, 1, nz);
  set(25, 1, "LEARNING JOURNEY  学习历程");
  set(26, 1, "Lessons completed with CupOfEnglish: " + lessons + (book ? "   ·   Now: " + book : "") + (jr[0] ? "\nCourses: " + jr[0] : "") + (jr[1] ? "\n" + jr[1] : "") + "\n在一杯英语已完成课时：" + lessons + "节" + (book ? "   ·   当前进度：" + book : ""));
  set(27, 1, "NEXT STAGE  下一阶段");
  const nx = b >= 0 && b < LV.length - 1 ? LV[b + 1] : "";
  if (nx) { const s1 = cf["S1|" + nx] || [], r1 = cf["R1|" + nx] || [], lc = (t: string) => t ? t[0].toLowerCase() + t.slice(1) : "";
    set(28, 1, "NEXT CEFR GOAL → " + nx + ":  " + s1[3] + "; " + lc(String(r1[3] || "")) + ".\n下一阶段CEFR目标 → " + nx + "：" + s1[4] + "；" + r1[4] + "。"); }
  set(29, 1, "Steady, regular lessons are what turn progress into lasting ability. Your teacher will keep building on these results — and we are happy to plan the next stage around your family’s schedule.\n规律、持续的学习，才能让进步真正转化为扎实的能力。老师会在现有基础上继续帮助孩子提升，我们也会根据您家的时间，安排好下一阶段的学习。");
  rows[30] = ["", "SKILL BREAKDOWN  分项能力评估", "", "", "", "", "●○○○ 1  …  ●●●● 4", "", ""];
  rows[31] = ["", "CRITERION  评估维度", "TRIAL  试听", "NOW  现在", "WHAT " + lvl + " LOOKS LIKE (CEFR)  " + lvl + "级别能力表现", "", "", "", ""];
  const cr = (i: number) => { const c = CRIT[i], x = cf[c[0] + "|" + lvl] || []; return ["", c[1] + "\n" + c[2], hasT ? dots(tr9[i]) : "—", dots(now9[i]), x[3] ? x[3] + "\n" + (x[4] || "") : "", "", "", "", ""]; };
  rows[32] = sk(0); for (let i = 0; i < 5; i++) rows[33 + i] = cr(i);
  rows[38] = sk(1); rows[39] = cr(5); rows[40] = cr(6);
  rows[41] = sk(2); rows[42] = cr(7); rows[43] = cr(8);
  set(44, 1, "About this report — Your teacher rated the same nine CEFR-based skills (1–4) used in the trial class, so “Trial” and “Now” can be compared directly. Levels follow the Council of Europe’s CEFR and its 2020 Companion Volume; Cambridge English equivalents are indicative.\n关于本报告——老师采用与试听课相同的九项CEFR能力标准（1–4分）进行评分，因此“试听”与“现在”可直接对比。级别参照欧洲委员会CEFR标准及其2020年增补版；剑桥英语对应仅供参考。");
  return rows.slice(0, 45);
}
Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const token = str(b.token, 200); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: s } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
  const mgmt = s.mode === "mgmt", me = String(s.name || "").trim(), op = str(b.op, 20);
  try {
    const { data: TS } = await db.from("docs").select("data").eq("key", "sys:trstate").maybeSingle();
    const form: any = TS && TS.data && TS.data.form;
    if (!form || !Array.isArray(form.rate) || form.rate.length !== 9) return out({ ok: false, msg: "The form could not be loaded. Please try again in a minute." });
    if (op === "prrows") {
      const label = str(b.label, 120), code0 = str(b.code, 20).toUpperCase();
      let q = db.from("coe_progress_checks").select("data,teacher,check_day,id").order("check_day", { ascending: false }).order("id", { ascending: false }).limit(1);
      q = label ? q.eq("data->>0", label) : /^ST-\d{4}-\d{3}$/.test(code0) ? q.eq("code", code0) : q.eq("id", -1);
      const { data: PR } = await q; const p: any = (PR || [])[0];
      if (!p) return out({ ok: false, msg: "This progress check was not found." });
      if (!mgmt && String(p.teacher || (p.data || [])[3] || "").toLowerCase() !== me.toLowerCase()) return out({ ok: false, msg: "Only your own progress checks." });
      const rows = await prRows(p.data || []);
      return out({ ok: true, db: true, pick: String((p.data || [])[0] || ""), pick2: "", rows, at: mn(Date.now()).slice(11, 16) });
    }
    if (op === "trial") {
      const c = b.c || {}, date = str(c.date, 10), student = str(c.student, 80);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !student) return out({ ok: false, msg: "Trial class not found. Please open it again from Today." });
      const lbl = date + " · " + student + " · " + me;
      const { data: T } = await db.from("coe_trials").select("label,row,redo,trial_date,teacher,student,cefr_on_report,pdf,created_at,db_at").eq("label", lbl).is("removed_at", null).limit(1);
      const t: any = (T || [])[0] || null;
      let done = null, redo = null;
      if (t && t.redo) redo = { note: String(t.redo.note || ""), by: String(t.redo.by || ""), at: String(t.redo.at || "") };
      else if (t) done = { at: mn(Date.parse(t.db_at || t.created_at)).slice(0, 16).replace("T", " "), total: num((t.row || [])[18]), cefr: String(t.cefr_on_report || ""), pdf: !!t.pdf };
      return out({ ok: true, db: true, form, levels: LEVELS, family: null, done, redo });
    }
    const code = str(b.code, 20).toUpperCase(); if (!/^ST-\d{4}-\d{3}$/.test(code)) return out({ ok: false, msg: "Student code missing." });
    const [P, DBR, NO, TR, PC] = await Promise.all([
      db.rpc("student_parts", { p_code: code }),
      db.from("sheet_rows").select("data").eq("tab", "DATABASE").eq("data->>0", code).limit(1),
      db.from("sheet_rows").select("data").eq("tab", "S-NOTES").eq("data->>3", code),
      db.from("coe_trials").select("label,row,trial_date,teacher,created_at").eq("student_code", code).is("removed_at", null).order("trial_date", { ascending: false }).limit(5),
      db.from("coe_progress_checks").select("id,seq,code,check_day,teacher,data,created_at").eq("code", code).order("check_day", { ascending: false }).order("id", { ascending: false }).limit(10)]);
    const drow: any[] = ((DBR.data || [])[0] || {}).data || [];
    const student = { cn: String(drow[1] || ""), book: String(drow[19] || ""), code, done: num(drow[18]), name: String(drow[2] || code) };
    const trial = trialOf(((TR.data || []) as any[]).slice().sort((p: any, q: any) => String(p.trial_date).localeCompare(String(q.trial_date)))[0]);
    if (op === "pc") {
      const since = mn(Date.now() - 45 * 864e5).slice(0, 10);
      const notes = (NO.data || []).map((x: any) => x.data || []).map((r: any[]) => ({ obs: String(r[9] || ""), date: String(r[1] || "").slice(0, 10), kind: "", ended: String(r[5] || ""), skills: String(r[10] || ""), teacher: String(r[2] || "") }))
        .filter((n: any) => n.date >= since && (n.obs || n.ended)).sort((p: any, q: any) => q.date.localeCompare(p.date)).slice(0, 30);
      const fbAll = (P.data && P.data.fb && Array.isArray(P.data.fb.data)) ? P.data.fb.data : [];
      const fb = fbAll.slice().sort((p: any, q: any) => String(q.month || "").localeCompare(String(p.month || ""))).slice(0, 4)
        .map((x: any) => ({ next: x.next || "", areas: x.areas || "", month: x.month || "", total: x.total, teacher: x.teacher || "", strengths: x.strengths || "" }));
      const mine = ((PC.data || []) as any[]).find((p: any) => String(p.teacher || "").toLowerCase() === me.toLowerCase() && String(p.check_day) >= since);
      const d = pcOf(mine);
      const rate = form.rate.map((x: any) => ({ pts: [4, 3, 2, 1], sec: x.sec, help: x.help, title: x.title, choices: x.choices }));
      return out({ ok: true, db: true, done: d ? { at: d.at, row: d.row, cefr: d.cefr, date: d.date, label: d.label, total: d.total, teacher: d.teacher } : null,
        rate, fb, ended: notes.length ? notes[0].ended : "", notes, trial, levels: LEVELS, student });
    }
    if (op === "pcreport") {
      if (!mgmt) return out({ ok: false, error: "Management only" }, 403);
      const pc = pcOf(((PC.data || []) as any[])[0]); if (!pc) return out({ ok: false, msg: "No progress check yet for this student." });
      const { data: C } = await db.from("classes").select("starts_at,ends_at,teachers,cancelled").eq("code", code).lte("starts_at", new Date().toISOString()).gte("starts_at", new Date(Date.now() - 400 * 864e5).toISOString()).order("starts_at", { ascending: true }).limit(2000);
      const L = ((C || []) as any[]).filter((x: any) => !x.cancelled);
      let journey = "";
      if (L.length) { const first = L[0], mins = Math.round((Date.parse(first.ends_at) - Date.parse(first.starts_at)) / 6e4) || 25;
        const recent = L.filter((x: any) => Date.parse(x.starts_at) > Date.now() - 28 * 864e5).length, perWeek = Math.max(1, Math.round(recent / 4));
        journey = (pc.book.split("·")[0] || "").trim() + " · " + mins + "-min lessons, " + perWeek + " a week" + (Date.parse(first.starts_at) > Date.now() - 380 * 864e5 ? " · since " + new Date(first.starts_at).toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "Asia/Manila" }) : ""); }
      return out({ ok: true, db: true, pc, trial, student, journey, lessons: L.length });
    }
    return out({ ok: false, error: "unknown op" }, 400);
  } catch (_e) { return out({ ok: false, msg: "Could not load. Please try again in a minute." }); }
});
