// CupOfEnglish · 20 Oct 2026 · a teacher's trial reports already made (TR-DATA copy + reports sent in the app), last 60 days.
// The app uses it to clear "Write report" for a trial that was moved to another day (the old rule matched only the same date + name).
// 29 Oct v11 · POST { token, recon: days } (management, read-only) → { sessions: Trial log rows (TC&SUB) grouped by calendar event id + day, each with
//   cal = where that event is now { day, x: cancelled, mv: moved from }, reports: TR-DATA { d, code, s, label }, next: docs sys:trial_next items }.
//   POST { token, op: 'setNext', k, what, owner, due, note } (management) → one trial's next step in docs `sys:trial_next` (empty = back to automatic).
// 25 Oct v10 · n = the teacher's note per skill. v9 · each report also carries its progress for the teacher's "Report sent" card: at (sent), t (total /36), cefr, pdf, sent (sent to the parent line),
//   enr (Enrolled? auto), fc (first class), fu (follow-up), q: 1 = sent in the app, Google has not copied it into TR-DATA yet.
// POST { token, tall: true } → v8: every trial in DATABASE { m: yyyy-MM, e: enrolled 1/0, t: trial teacher, c: trial CEFR, s: source }.
// POST { token, ops: true } → v7: student flow per month (trials, converted, new, renewals, stopped) with the students in each (L).
// POST { token, tpunct: 'yyyy-MM' } → v5: teachers' time-ins day by day (minutes before class, status).
// POST { token, names: true } → v4: { bad: ACTIVE rows carrying another student's name, with the DATABASE name }.
// POST { token, find: { date, student } } → v3: { code (from the calendar booking), list: students with that name }.
// POST { token, as?, form? } (form: true → also the trial form's questions, v2) → { ok, list: [{ d: "yyyy-MM-dd", s: "student name (lower case)", c: "ST-…", … }] }. Same sign-in check as `coe`; management may pass `as` (teacher view).
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
const ymd = (x: unknown) => { const m = String(x ?? "").match(/^(\d{4}-\d{2}-\d{2})/); return m ? m[1] : ""; };
Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: s } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
  const who = String(s.mode === "mgmt" && b.as ? b.as : s.name || "").trim().toLowerCase(); if (!who) return out({ ok: false, error: "AUTH" }, 401);
  if (b.ops) {   // 20 Oct v6 · student flow per month for the Overview (DATABASE copy): trials, converted, new students, renewals, stopped
    if (s.mode !== "mgmt") return out({ ok: false, error: "AUTH" }, 401);
    const { data: S } = await db.from("coe_students").select("code,data").is("removed_at", null).limit(6000);
    const M: Record<string, any> = {}, now = new Date(Date.now() + 8 * 3600e3), months: string[] = [];
    for (let k = 6; k >= 0; k--) { const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - k, 15)); const m = d.toISOString().slice(0, 7); months.push(m); M[m] = { m, trials: 0, conv: 0, fresh: 0, ren: 0, stop: 0, L: { trials: [], conv: [], fresh: [], ren: [], stop: [] } }; }
    (S || []).forEach((x: any) => { const d = x.data || [], tr = ymd(d[10]).slice(0, 7), fc = ymd(d[16]), en = ymd(d[20]).slice(0, 7), rn = ymd(d[24]).slice(0, 7);
      const p = (k: string, day: string) => ({ c: x.code, n: String(d[2] || "").trim(), cn: String(d[1] || "").trim(), d: day, t: String(d[14] || "").trim(), ty: String(d[3] || "").trim() });
      if (M[tr]) { M[tr].trials++; M[tr].L.trials.push(p("t", ymd(d[10]))); if (fc && fc >= ymd(d[10])) { M[tr].conv++; M[tr].L.conv.push(p("c", fc)); } }
      if (M[fc.slice(0, 7)]) { M[fc.slice(0, 7)].fresh++; M[fc.slice(0, 7)].L.fresh.push(p("f", fc)); }
      if (M[rn] && rn !== fc.slice(0, 7)) { M[rn].ren++; M[rn].L.ren.push(p("r", ymd(d[24]))); }
      if (M[en]) { M[en].stop++; M[en].L.stop.push(p("s", ymd(d[20]))); } });
    return out({ ok: true, day: now.getUTCDate(), months: months.map((m) => M[m]) });
  }
  if (b.tall) {   // 20 Oct v8 · all-time trial standing (DATABASE copy): per month since the first trial, with trial teacher, trial CEFR and source
    if (s.mode !== "mgmt") return out({ ok: false, error: "AUTH" }, 401);
    const { data: S } = await db.from("coe_students").select("code,data").is("removed_at", null).limit(8000);
    const L: any[] = [];
    (S || []).forEach((x: any) => { const d = x.data || [], tr = ymd(d[10]); if (!tr) return; const fc = ymd(d[16]);
      L.push({ m: tr.slice(0, 7), e: fc && fc >= tr ? 1 : 0, t: String(d[14] || "").trim(), c: String(d[13] || "").trim(), s: String(d[22] || "").trim() }); });
    return out({ ok: true, list: L });
  }
  if (b.tpunct) {   // 20 Oct v5 · teachers' time-ins day by day for a month (T-TIMEIN copy): minutes before class and status
    if (s.mode !== "mgmt") return out({ ok: false, error: "AUTH" }, 401);
    const m = /^\d{4}-\d{2}$/.test(String(b.tpunct)) ? String(b.tpunct) : new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 7);
    const { data: R } = await db.from("sheet_rows").select("data").eq("tab", "T-TIMEIN").gt("r", 1).limit(5000);
    const by: Record<string, any[]> = {};
    (R || []).forEach((x: any) => { const d = x.data || [], day = ymd(d[0]); if (!day.startsWith(m)) return; const t = String(d[1] || "").trim(); if (!t) return;
      const typ = String(d[13] || ""); const st = String(d[6] || ""); const min = d[5] === "" || d[5] == null ? NaN : Number(d[5]);
      (by[t] = by[t] || []).push({ day, min: isNaN(min) ? null : min, st, typ, out: String(d[18] || ""), h: Number(d[19]) || null }); });
    return out({ ok: true, month: m, list: Object.keys(by).sort().map((t) => ({ name: t, days: by[t].sort((a, z) => a.day.localeCompare(z.day)) })) });
  }
  if (b.names) {   // 20 Oct v4 · ACTIVE rows whose name was copied from another student (Google's enrolment copies the top row: Elsa ST-2024-028 showed "Eric / Sun Yuchen")
    if (s.mode !== "mgmt") return out({ ok: false, error: "AUTH" }, 401);
    const [{ data: A }, { data: S }] = await Promise.all([db.from("sheet_rows").select("r,data").eq("tab", "ACTIVE").gte("r", 5).order("r").limit(3000),
      db.from("coe_students").select("code,data").is("removed_at", null).limit(5000)]);
    const n = (x: unknown) => String(x ?? "").toLowerCase().replace(/[^a-z0-9一-鿿]/g, "");
    const DB: Record<string, { en: string; cn: string }> = {}; (S || []).forEach((x: any) => { const d = x.data || []; DB[String(x.code).toUpperCase()] = { en: String(d[2] || "").trim(), cn: String(d[1] || "").trim() }; });
    const byName: Record<string, string[]> = {}; Object.keys(DB).forEach((c) => { const k = n(DB[c].en) + "|" + n(DB[c].cn); if (n(DB[c].en)) (byName[k] = byName[k] || []).push(c); });
    const bad: any[] = [];
    (A || []).forEach((x: any) => { const d = x.data || [], code = String(d[0] || "").toUpperCase().trim(); if (!/^ST-\d{4}-\d{3}$/.test(code) || !DB[code]) return;
      const en = String(d[1] || "").trim(), cn = String(d[2] || "").trim(), own = DB[code]; if (!n(en) || !n(own.en) || n(en) === n(own.en)) return;
      const from = (byName[n(en) + "|" + n(cn)] || []).filter((c) => c !== code);   // the name belongs to another student = copied
      if (from.length) bad.push({ code, row: x.r, active: { en, cn }, db: own, from: from[0] }); });
    return out({ ok: true, bad });
  }
  if (b.find && typeof b.find === "object") {   // 20 Oct v3 · a trial with no student code: the code from its calendar booking, else the students with that name (management)
    if (s.mode !== "mgmt") return out({ ok: false, error: "AUTH" }, 401);
    const day = String(b.find.date || "").slice(0, 10), nm = String(b.find.student || "").trim();
    let code = "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(day) && nm) { const lo = new Date(Date.parse(day + "T00:00:00Z") - 4 * 864e5).toISOString().slice(0, 10), hi = new Date(Date.parse(day + "T00:00:00Z") + 4 * 864e5).toISOString().slice(0, 10);
      const { data: C } = await db.from("classes").select("code,student,day,data").gte("day", lo).lte("day", hi).ilike("student", nm).limit(50);
      const tc = (C || []).filter((x: any) => x.code && /-TC(\s+X)?$/i.test(String((x.data || {}).title || "").trim())).sort((a: any, z: any) => Math.abs(Date.parse(a.day) - Date.parse(day)) - Math.abs(Date.parse(z.day) - Date.parse(day)));
      if (tc.length) code = String(tc[0].code).toUpperCase(); }
    const { data: S2 } = nm ? await db.from("coe_students").select("code,data").ilike("data->>2", nm).is("removed_at", null).limit(30) : { data: [] };
    return out({ ok: true, code, list: (S2 || []).map((x: any) => ({ code: x.code, cn: String((x.data || [])[1] || ""), trial: String((x.data || [])[10] || "").slice(0, 10), teacher: String((x.data || [])[14] || "") })).sort((a: any, z: any) => z.code.localeCompare(a.code)) });
  }
  if (b.recon) {   // 29 Oct v11 · trial sessions by calendar event id (management, read-only), so a moved or re-logged trial is matched to its report by the session, not the date
    if (s.mode !== "mgmt") return out({ ok: false, error: "AUTH" }, 401);
    const days = Math.min(400, Math.max(7, Number(b.recon) || 75)), now = Date.now() + 8 * 3600e3;
    const since = new Date(now - days * 864e5).toISOString().slice(0, 10), rsince = new Date(now - (days + 30) * 864e5).toISOString().slice(0, 10);
    const [{ data: L, error: le }, { data: T }] = await Promise.all([
      db.from("sheet_rows").select("r,data").eq("tab", "TC&SUB").gt("r", 1).order("r").limit(5000),
      db.from("sheet_rows").select("data").eq("tab", "TR-DATA").gt("r", 1).order("r").limit(5000)]);
    if (le) return out({ ok: false, error: "db" }, 500);
    const str = (x: unknown) => String(x ?? "").trim(), hm = (x: unknown) => { const m = str(x).match(/T(\d{2}:\d{2})/); return m ? m[1] : ""; };
    const S: Record<string, any> = {};
    (L || []).forEach((x: any) => { const d = x.data || [], day = ymd(d[0]); if (!day || day < since || !/trial/i.test(str(d[2]))) return;
      const ev = str(d[12]).replace(/@google\.com$/i, ""), k = (ev || "r" + x.r) + "|" + day;
      if (S[k]) { S[k].n++; return; }
      S[k] = { ev, d: day, tm: hm(d[1]) || hm(d[0]), code: str(d[3]).toUpperCase(), s: str(d[4]), t: str(d[5]), n: 1, cal: null }; });
    const evs = [...new Set(Object.values(S).map((x: any) => x.ev).filter(Boolean))], C: Record<string, any[]> = {};
    for (let i = 0; i < evs.length; i += 80) {
      const { data: K } = await db.from("classes").select("day,data").in("data->>id", evs.slice(i, i + 80)).limit(4000);
      (K || []).forEach((c: any) => { const id = str((c.data || {}).id); (C[id] = C[id] || []).push({ day: String(c.day).slice(0, 10), x: (c.data || {}).cancelled ? 1 : 0, mv: ymd(((c.data || {}).mv || {}).start) }); }); }
    Object.values(S).forEach((x: any) => { const K = C[x.ev] || []; if (!K.length) return;
      const same = K.find((c) => c.day === x.d);
      if (same) { x.cal = same; return; }
      const t0 = Date.parse(x.d), near = K.filter((c) => !c.x && Math.abs(Date.parse(c.day) - t0) <= 45 * 864e5).sort((a, z) => Math.abs(Date.parse(a.day) - t0) - Math.abs(Date.parse(z.day) - t0));
      x.cal = near[0] || K.find((c) => c.mv === x.d) || null; });
    const reports: any[] = [];
    (T || []).forEach((x: any) => { const r = x.data || [], d = ymd(r[2]); if (!d || d < rsince) return; reports.push({ d, code: str(r[33]).toUpperCase(), s: str(r[5]).toLowerCase(), label: str(r[0]) }); });
    const { data: NX } = await db.from("docs").select("data").eq("key", "sys:trial_next").maybeSingle();
    return out({ ok: true, since, sessions: Object.values(S).sort((a: any, z: any) => z.d.localeCompare(a.d)), reports, next: ((NX && NX.data) || {}).items || {} });
  }
  if (b.op === "setNext") {   // 29 Oct v11 · a trial's next step (what, owner, follow-up date) in docs `sys:trial_next` (management; one item per trial key)
    if (s.mode !== "mgmt") return out({ ok: false, error: "AUTH" }, 401);
    const k = String(b.k || "").trim().slice(0, 140); if (!k) return out({ ok: false, error: "key" }, 400);
    const clip = (x: unknown, n: number) => String(x ?? "").trim().slice(0, n), due = clip(b.due, 10);
    if (due && !/^\d{4}-\d{2}-\d{2}$/.test(due)) return out({ ok: false, error: "date" }, 400);
    const item = { what: clip(b.what, 80), owner: clip(b.owner, 40), due, note: clip(b.note, 300), by: String(s.name || ""), at: new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 16).replace("T", " ") };
    for (let tries = 0; tries < 4; tries++) {
      const { data: row } = await db.from("docs").select("data,updated_at").eq("key", "sys:trial_next").maybeSingle();
      const items = Object.assign({}, ((row && row.data) || {}).items || {});
      if (!item.what && !item.owner && !item.due && !item.note) delete items[k]; else items[k] = item;
      const data = { items, updated: new Date().toISOString() }, now = new Date().toISOString();
      if (!row) { const { error } = await db.from("docs").insert({ key: "sys:trial_next", scope: "mgmt", data, updated_at: now }); if (!error) return out({ ok: true, item: items[k] || null }); continue; }
      const { data: up, error } = await db.from("docs").update({ data, updated_at: now }).eq("key", "sys:trial_next").eq("updated_at", row.updated_at).select("key");
      if (!error && up && up.length) return out({ ok: true, item: items[k] || null });
    }
    return out({ ok: false, error: "busy", msg: "Someone else saved at the same moment · try again" }, 409);
  }
  const since = new Date(Date.now() + 8 * 3600e3 - 60 * 864e5).toISOString().slice(0, 10), list: any[] = [];
  const [{ data: T, error: te }, { data: W }] = await Promise.all([
    db.from("sheet_rows").select("data").eq("tab", "TR-DATA").order("r").limit(3000),
    db.from("writes").select("args,created_at").eq("fn", "tTrialSubmit").ilike("who", who).gte("created_at", new Date(Date.now() - 60 * 864e5).toISOString()).limit(300)]);
  if (te) return out({ ok: false, error: "db" }, 500);
  if (b.form) {   // 20 Oct v2 · the trial form's questions (the same for every trial): Google's last answer, so the form opens at once
    const { data: F } = await db.from("docs").select("data").like("key", "%:tTrialForm|%").order("updated_at", { ascending: false }).limit(5);
    const f = (F || []).map((x: any) => x.data).find((d: any) => d && d.ok && d.form && Array.isArray(d.form.rate));
    if (f) (b as any)._form = { ok: true, form: f.form, levels: f.levels || null, done: null, family: null };
  }
  const str = (x: unknown) => String(x ?? "").trim();
  (T || []).forEach((x: any) => { const r = x.data || [], d = ymd(r[2]); if (!d || d < since || str(r[4]).toLowerCase() !== who) return;
    const sent = (str(r[44]).match(/Report sent to parent[^\n]*/i) || [""])[0], pdf = /^https:\/\//.test(str(r[30])) ? str(r[30]) : "";
    list.push({ d, s: str(r[5]).toLowerCase(), c: str(r[33]).toUpperCase(), at: str(r[1]).replace("T", " ").slice(0, 16), t: str(r[18]), cefr: str(r[23]), pdf, sent, enr: str(r[38]), fc: ymd(r[39]), fu: str(r[43]) }); });
  // 25 Oct v10 · the teacher's own note per skill (n: 9 short lines, sent with the report in the app) for the report's skill breakdown
  (W || []).slice().sort((p: any, q: any) => String(p.created_at).localeCompare(String(q.created_at))).forEach((w: any) => { const c = (w.args || [])[1] || {}, f = (w.args || [])[2] || {}; const d = ymd(c.date); if (!d) return; const sl = String(c.student || "").trim().toLowerCase(), cc = String(c.code || "").trim().toUpperCase();
    const n = Array.isArray(f.notes) && f.notes.some((x: any) => String(x || "").trim()) ? f.notes.slice(0, 9).map((x: any) => String(x || "").trim().slice(0, 300)) : null;
    const hit = list.filter((x) => x.d === d && (x.s === sl || (cc && x.c === cc)));
    if (hit.length) { if (n) hit.forEach((x) => { x.n = n; }); if (hit.some((x) => !x.q)) return; }
    if (hit.length) return;
    list.push({ d, s: sl, c: cc, q: 1, n: n || undefined, at: new Date(Date.parse(w.created_at) + 8 * 3600e3).toISOString().replace("T", " ").slice(0, 16) }); });
  return out({ ok: true, list, form: (b as any)._form || null });
});
