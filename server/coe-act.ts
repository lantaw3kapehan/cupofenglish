// CupOfEnglish · coe-act v5 (2908 growth · 2898 guide views) · v1 (25 Nov 2026 · 2895, Misty: "more professional, historical, traceable and accountable")
// The class-by-class history of one teacher's day, from the records the app already keeps, plus what her Today card showed.
// POST { token, op, ... }:
//   seen { day, cards: [{ id, st }] }   teacher → saves what her Today card shows (st = 4 letters In/H/N/V: d done, n to do, l later)
//                                       only when it changed since the last save for that class
//   day  { teacher?, day }              management: any teacher · teacher: herself → { classes: [{ id, start, end, student, code, book,
//                                       cancelled, ev: [{ at, k, t, s }] }], other: [...], seen: { classId: [{ at, st }] } }
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
const PH = (d: string, h = 0) => new Date(Date.parse(d + "T00:00:00+08:00") + h * 3600e3).toISOString();
const dOfPH = (iso: string) => new Date(Date.parse(iso) + 8 * 3600e3).toISOString().slice(0, 10);
const hmPH = (iso: string) => new Date(Date.parse(iso) + 8 * 3600e3).toISOString().slice(11, 16);

Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const token = String(b.token || ""), op = String(b.op || "");
  if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: s } = await db.from("app_sessions").select("name,role,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
  const name = String(s.name || ""), role = String(s.role || ""), mgmt = role === "President" || role === "Operations";
  try {
    if (op === "seen") {
      if (mgmt) return out({ ok: true, skipped: true });
      const day = String(b.day || ""); if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return out({ ok: false, error: "day" }, 400);
      const cards = (Array.isArray(b.cards) ? b.cards : []).slice(0, 30).filter((c: any) => c && typeof c.id === "string" && c.id.length < 200 && /^[dnl]{4}$/.test(String(c.st || "")));
      if (!cards.length) return out({ ok: true, n: 0 });
      const { data: last } = await db.from("coe_card_seen").select("class_id,st,at").eq("teacher", name).eq("day", day).in("class_id", cards.map((c: any) => c.id)).order("at", { ascending: false }).limit(300);
      const prev: Record<string, string> = {}; (last || []).forEach((r: any) => { if (!(r.class_id in prev)) prev[r.class_id] = r.st; });
      const rows = cards.filter((c: any) => prev[c.id] !== c.st).map((c: any) => ({ teacher: name, day, class_id: c.id, st: c.st, dev: String(b.dev || "").slice(0, 80) || null }));
      if (rows.length) { const { error } = await db.from("coe_card_seen").insert(rows); if (error) throw new Error(error.message); }
      return out({ ok: true, n: rows.length });
    }

    if (op === "gview") {   // 2898: a guide was opened
      const g = String(b.id || ""); if (!/^[a-z0-9-]{2,40}$/.test(g)) return out({ ok: false, error: "id" }, 400);
      const since = new Date(Date.now() - 10 * 60e3).toISOString();
      const { data: rec } = await db.from("coe_guide_views").select("id").eq("guide", g).eq("name", name).gte("at", since).limit(1);
      if (!rec || !rec.length) { const { error } = await db.from("coe_guide_views").insert({ guide: g, name, role }); if (error) throw new Error(error.message); }
      return out({ ok: true });
    }
    if (op === "gstats") {   // 2898: views per guide; management also sees who opened it and who has not
      const [vQ, tQ] = await Promise.all([
        db.from("coe_guide_views").select("guide,name,role,at").order("at").limit(5000),
        db.from("app_sessions").select("name").eq("role", "Teacher").gte("exp", new Date(Date.now() - 14 * 864e5).toISOString()).limit(2000),
      ]);
      if (vQ.error) throw new Error(vQ.error.message);
      const team = [...new Set((tQ.data || []).map((r: any) => String(r.name)).filter((n: string) => n && !/^(misty|cupofenglish)$/i.test(n)))].sort();
      const per: Record<string, any> = {};
      for (const v of vQ.data || []) { if (v.role !== "Teacher" || /^(misty|cupofenglish)$/i.test(v.name)) continue; const o = per[v.guide] ||= { views: 0, who: {} as Record<string, { n: number; last: string }> }; o.views++; const w = o.who[v.name] ||= { n: 0, last: v.at }; w.n++; w.last = v.at; }
      const res: Record<string, any> = {};
      for (const [g, o] of Object.entries(per) as any) { const names = Object.keys(o.who); res[g] = { views: o.views, teachers: names.length, ...(mgmt ? { who: names.map((n) => ({ name: n, n: o.who[n].n, last: o.who[n].last })).sort((x, y) => y.last.localeCompare(x.last)), not: team.filter((t) => !names.some((n) => n.toLowerCase() === t.toLowerCase())) } : {}) }; }
      return out({ ok: true, team: team.length, mgmt, g: res, ...(mgmt ? { teamNames: team } : {}) });
    }

    if (op === "cxpic") {   // 2910: a cancellation picture was made (copied or saved) for these classes
      if (!mgmt) return out({ ok: true, skipped: true });
      const ids = (Array.isArray(b.ids) ? b.ids : []).map((x: any) => String(x || "").slice(0, 120)).filter((x: string) => x).slice(0, 20);
      if (!ids.length) return out({ ok: false, error: "ids" }, 400);
      const { error } = await db.from("coe_cx_pics").insert({ class_ids: ids, code: String(b.code || "").slice(0, 20) || null, by_name: name });
      if (error) throw new Error(error.message);
      return out({ ok: true });
    }
    if (op === "deadlines") {   // 2911: management › Deadlines · dated items for one month (fixed monthly dates are added on the screen)
      if (!mgmt) return out({ ok: false, error: "not allowed" }, 403);
      const m = String(b.month || ""); if (!/^\d{4}-\d{2}$/.test(m)) return out({ ok: false, error: "month" }, 400);
      const from = m + "-01", y = +m.slice(0, 4), mo = +m.slice(5, 7), to = (mo === 12 ? (y + 1) + "-01" : y + "-" + String(mo + 1).padStart(2, "0")) + "-01";
      const [gQ, tQ, trQ, mQ, pQ, sQ] = await Promise.all([
        db.from("coe_gov").select("month,paid_on,sss,pagibig,philhealth,bir,sec,charges,status").gte("month", from).lt("month", to),
        db.from("coe_training_sessions").select("id,training_id,starts_at,mins,facilitator,invited,note,status").gte("starts_at", PH(from)).lt("starts_at", PH(to)).order("starts_at"),
        db.from("coe_trainings").select("id,title"),
        db.from("coe_msgs").select("at,subject,memo_no").eq("kind", "memo").gte("at", PH(from)).lt("at", PH(to)).order("at"),
        db.from("coe_packages").select("code,name,teacher,deadline,active,renewal_status").is("removed_at", null).eq("active", true).gte("deadline", from).lt("deadline", to).order("deadline"),
        db.from("docs").select("data").eq("key", "sys:sunbonus").maybeSingle(),
      ]);
      for (const q of [gQ, tQ, trQ, mQ, pQ]) if (q.error) throw new Error(q.error.message);
      const T: Record<string, string> = {}; for (const r of trQ.data || []) T[r.id] = r.title;
      const memos: any[] = []; const seenM = new Set<string>();
      for (const r of mQ.data || []) { const subj = String(r.subject || "").trim(); if (!subj || /test/i.test(subj)) continue; const d = dOfPH(r.at), k = d + "|" + subj; if (seenM.has(k)) continue; seenM.add(k); memos.push({ day: d, subject: subj, no: r.memo_no || null }); }
      const pk: Record<string, any> = {}; for (const r of pQ.data || []) { const k = r.code + "|" + r.deadline; if (!pk[k]) pk[k] = { day: r.deadline, code: r.code, name: r.name, teachers: [], status: r.renewal_status || "" }; if (r.teacher && !pk[k].teachers.includes(r.teacher)) pk[k].teachers.push(r.teacher); }
      return out({ ok: true, month: m,
        gov: (gQ.data || []).map((r: any) => ({ month: String(r.month).slice(0, 7), due: String(r.month).slice(0, 7) + "-15", paid: r.paid_on || null, status: r.status || "", amount: (+r.sss || 0) + (+r.pagibig || 0) + (+r.philhealth || 0) + (+r.bir || 0) + (+r.sec || 0) + (+r.charges || 0), parts: { sss: +r.sss || 0, pagibig: +r.pagibig || 0, philhealth: +r.philhealth || 0, bir: +r.bir || 0 } })),
        trainings: (tQ.data || []).filter((r: any) => r.status !== "cancelled").map((r: any) => ({ at: r.starts_at, mins: r.mins, title: T[r.training_id] || (r.training_id === "coach" ? "Coaching" : r.training_id), who: r.facilitator, invited: r.invited || [], note: r.note || "", status: r.status })),
        memos, expiries: Object.values(pk), sunbonus: (sQ.data && (sQ.data as any).data && (sQ.data as any).data.from) || null });
    }
    if (op === "famlinks") {   // 2911: management › Families · which students are one family (shared package, or one WeChat group)
      if (!mgmt) return out({ ok: false, error: "not allowed" }, 403);
      const [sQ, wQ] = await Promise.all([db.from("coe_packages").select("code,shared").is("removed_at", null).not("shared", "is", null), db.from("docs").select("data").eq("key", "mgmt:wxgroup").maybeSingle()]);
      if (sQ.error) throw new Error(sQ.error.message);
      const L: string[][] = []; for (const r of sQ.data || []) { const a2 = String(r.code || "").toUpperCase(), b2 = String(r.shared || "").toUpperCase(); if (/^ST-\d{4}-\d{3}$/.test(a2) && /^ST-\d{4}-\d{3}$/.test(b2) && a2 !== b2) L.push([a2, b2]); }
      const W: any = (wQ.data && (wQ.data as any).data) || {}; for (const k of Object.keys(W)) { const t = String((W[k] && W[k].to) || "").toUpperCase(); if (/^ST-\d{4}-\d{3}$/.test(t) && t !== k.toUpperCase()) L.push([k.toUpperCase(), t]); }
      return out({ ok: true, links: L });
    }
    if (op === "family") {   // 2911: one family's packages, payments, reports, trials and the parent's messages (class cancellations they asked for)
      if (!mgmt) return out({ ok: false, error: "not allowed" }, 403);
      const codes = (Array.isArray(b.codes) ? b.codes : []).map((x: any) => String(x || "").toUpperCase()).filter((x: string) => /^ST-\d{4}-\d{3}$/.test(x)).slice(0, 8);
      if (!codes.length) return out({ ok: false, error: "codes" }, 400);
      const since = new Date(Date.now() - 120 * 864e5).toISOString();
      const [pQ, iQ, fQ, tQ, cQ, nQ] = await Promise.all([
        db.from("coe_packages").select("code,name,cn,teacher,buy,deadline,active,source,renewal_status,enrolled,gift,carry,course,shared").is("removed_at", null).in("code", codes).order("buy", { ascending: false }),
        db.from("coe_invoices").select("no,day,code,total,currency,partner,method,status,items").in("code", codes).order("day", { ascending: false }).limit(40),
        db.from("coe_fb_reports").select("code,month,teacher,total,submitted").in("code", codes).order("month", { ascending: false }).limit(40),
        db.from("coe_trials").select("trial_date,teacher,student,student_code,cefr_teacher,pdf").is("removed_at", null).in("student_code", codes).order("trial_date", { ascending: false }).limit(10),
        db.from("classes").select("id,code,student,starts_at,cancelled,teachers,data").in("code", codes).eq("cancelled", true).gte("starts_at", since).order("starts_at", { ascending: false }).limit(60),
        db.from("classes").select("code,starts_at,teachers").in("code", codes).eq("cancelled", false).gte("starts_at", new Date().toISOString()).order("starts_at").limit(40),
      ]);
      for (const q of [pQ, iQ, fQ, tQ, cQ, nQ]) if (q.error) throw new Error(q.error.message);
      const next: Record<string, any> = {}; for (const r of nQ.data || []) if (!next[r.code]) next[r.code] = { at: r.starts_at, t: (r.teachers || [])[0] || "" };
      const asks = (cQ.data || []).map((r: any) => { const d = r.data || {}; const why = String(d.why || d.reason || ""); return { code: r.code, student: r.student, at: r.starts_at, t: (r.teachers || [])[0] || "", why }; }).filter((x: any) => /from the parent/i.test(x.why)).slice(0, 20);
      return out({ ok: true, codes, packages: pQ.data || [], payments: (iQ.data || []).filter((r: any) => r.status !== "void"), reports: fQ.data || [], trials: tQ.data || [], asks, next });
    }

    if (op === "growth") {   // 2908: management › Growth (trials → students, new and renewed packages, sources, renewals coming up)
      if (!mgmt) return out({ ok: false, error: "not allowed" }, 403);
      const [g, f] = await Promise.all([db.rpc("coe_growth", { nm: 6 }), db.rpc("coe_fin_growth")]);
      if (g.error) throw new Error(g.error.message);
      const fm: any = (f.data || {}) as any, more = fm.more || {};
      return out({ ok: true, g: g.data, pipe: more.pipe || null, owe: more.owe || [], renewing: fm.renewing || null, capacity: fm.capacity || null, price: fm.price || null });
    }

    if (op === "day") {
      const day = String(b.day || ""); if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return out({ ok: false, error: "day" }, 400);
      const T = mgmt ? String(b.teacher || "").trim() : name; if (!T) return out({ ok: false, error: "teacher" }, 400);
      const tl = T.toLowerCase(), from = PH(day), to = PH(day, 48), alertTo = PH(day, 30);
      const [cQ, wQ, vQ, lQ, pQ, mQ, sQ] = await Promise.all([
        db.from("classes").select("id,data,starts_at,ends_at,cancelled,code,student,teachers").eq("day", day).filter("teachers", "cs", JSON.stringify([tl])).order("starts_at"),
        db.from("writes").select("id,fn,args,status,created_at").ilike("who", T).gte("created_at", from).lt("created_at", to).in("fn", ["classIn", "saveNote", "markHomework", "tTrialSubmit", "timeIn"]).order("created_at").limit(500),
        db.from("coe_class_video_days").select("event_id,code,name,via,late,case_id,uploaded_at,size_bytes,dur_sec,proof").eq("day", day).ilike("teacher", T),
        db.from("coe_vid_log").select("code,starts_at,checks,found_at,last_check").eq("day", day).eq("teacher", tl),
        db.from("coe_push_queue").select("title,body,created_at,sent_at,result").ilike("to_name", T).gte("created_at", from).lt("created_at", alertTo).order("created_at").limit(200),
        db.from("coe_msgs").select("id,body,at,seen,ack,from_name,role").ilike("to_name", T).eq("role", "mgmt").gte("at", from).lt("at", alertTo).order("at").limit(100),
        db.from("coe_card_seen").select("class_id,st,at,dev").ilike("teacher", T).eq("day", day).order("at").limit(1000),
      ]);
      for (const q of [cQ, wQ, vQ, lQ, pQ, mQ, sQ]) if (q.error) throw new Error(q.error.message);
      const cls = (cQ.data || []).map((c: any) => { const d = c.data || {}; return { id: String(d.id || c.id), key: c.id, start: c.starts_at, end: c.ends_at, student: c.student || d.student || "", code: String(c.code || d.code || "").toUpperCase(), book: d.book || "", cancelled: !!c.cancelled, title: d.title || "", ev: [] as any[] }; });
      const other: any[] = [];
      const byCode = (code: string, at?: string) => { const L = cls.filter((c) => c.code && c.code === String(code || "").toUpperCase()); if (L.length <= 1 || !at) return L[0] || null; return L.slice().sort((a, b2) => Math.abs(Date.parse(a.start) - Date.parse(at)) - Math.abs(Date.parse(b2.start) - Date.parse(at)))[0]; };
      const byText = (t: string) => cls.find((c) => c.student && new RegExp("\\b" + c.student.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i").test(t) && t.includes(hmPH(c.start))) || cls.find((c) => c.student && t.includes(c.student) && cls.filter((x) => x.student === c.student).length === 1) || null;
      const add = (c: any, e: any) => (c ? c.ev : other).push(e);
      for (const w of wQ.data || []) { const a = Array.isArray(w.args) ? (w.args[1] || {}) : {}; if (w.status && w.status !== "done") continue;
        if (w.fn === "classIn") { const c = cls.find((x) => x.id === a.id || x.key === a.id) || byCode(a.code, a.start); add(c, { at: w.created_at, k: "in", t: "Tapped “I’m in”", ref: w.id }); }
        else if (w.fn === "saveNote") { if (a.date && String(a.date).slice(0, 10) !== day) continue; const c = cls.find((x) => x.id === a.eventId || x.key === a.eventId) || byCode(a.code);
          add(c, { at: w.created_at, k: "note", t: "Class note saved", s: String(a.obs || "").slice(0, 140), ref: w.id });
          if (String(a.homework || "").trim() && !/^no homework/i.test(String(a.homework))) add(c, { at: w.created_at, k: "hw", t: "Homework saved", s: String(a.homework).slice(0, 120), ref: w.id }); }
        else if (w.fn === "markHomework") { const c = byCode(a.code || (Array.isArray(w.args) ? w.args[1] : ""), undefined); add(c, { at: w.created_at, k: "hw", t: "Homework marked", ref: w.id }); }
        else if (w.fn === "tTrialSubmit") { const c = byCode(a.code) || cls.find((x) => x.student && x.student === a.student); add(c, { at: w.created_at, k: "note", t: "Trial report sent", ref: w.id }); }
        else if (w.fn === "timeIn") { other.push({ at: w.created_at, k: "in", t: "Time in for the day", ref: w.id }); } }
      for (const v of vQ.data || []) { const c = cls.find((x) => x.id === v.event_id || x.key === v.event_id) || byCode(v.code, v.uploaded_at);
        add(c, { at: v.uploaded_at, k: "vid", t: (v.proof ? "Screen proof uploaded" : "Video uploaded") + (v.via ? " (" + v.via + ")" : ""), s: [v.dur_sec ? Math.round(v.dur_sec / 60) + " min" : "", v.size_bytes ? (v.size_bytes / 1e6).toFixed(1) + " MB" : "", v.late ? "late" + (v.case_id ? " · case " + v.case_id : "") : "on time"].filter(Boolean).join(" · "), late: !!v.late }); }
      const dl = PH(day, 23 + 59 / 60), fmt = (iso: string) => new Date(Date.parse(iso) + 8 * 3600e3).toISOString().slice(5, 16).replace("T", " ");
      for (const l of lQ.data || []) { const c = byCode(l.code, l.starts_at); if (!c) continue; const ok = !!l.found_at && l.found_at <= dl;
        c.ev.push({ at: dl, k: "due", t: "Video deadline 23:59", s: ok ? "video in by the deadline" : "no video by the deadline · folder checked " + (l.checks || 0) + " times" + (l.found_at ? " · first found " + fmt(l.found_at) : ""), miss: !ok }); }
      /* homework pictures made for this teacher's students that evening (Give homework / Check homework) */
      try { const codes = [...new Set(cls.filter((c) => c.code && !c.cancelled).map((c) => c.code))];
        await Promise.all(codes.map(async (code) => { const { data: F } = await db.storage.from("homework").list(code, { limit: 40, sortBy: { column: "created_at", order: "desc" } });
          for (const f of F || []) { const at = (f as any).created_at; if (!at || at < from || at > PH(day, 30) || !/\.(jpg|jpeg|png|webp)$/i.test(f.name)) continue; const c = byCode(code, at); if (c && at >= c.start) c.ev.push({ at, k: "hwpic", t: "Homework picture saved" }); } })); } catch (_e) { /* pictures are extra */ }
      for (const p of pQ.data || []) { const txt = String(p.title || "") + " " + String(p.body || ""); add(byText(txt), { at: p.sent_at || p.created_at, k: "alert", t: "Phone alert: " + String(p.title || "").replace(/^[^\w一-鿿"']+/, ""), s: String(p.body || "").replace(/\s+/g, " ").slice(0, 160) + (p.result ? " · " + String(p.result).slice(0, 40) : "") }); }
      for (const m of mQ.data || []) add(byText(String(m.body || "")), { at: m.at, k: "msg", t: "App message from " + (m.from_name || "CupOfEnglish"), s: String(m.body || "").replace(/\s+/g, " ").slice(0, 180) + (m.seen ? " · seen " + new Date(Date.parse(m.seen) + 8 * 3600e3).toISOString().slice(5, 16).replace("T", " ") : " · not seen yet") });
      const seen: Record<string, any[]> = {}; for (const r of sQ.data || []) (seen[r.class_id] = seen[r.class_id] || []).push({ at: r.at, st: r.st, dev: r.dev });
      cls.forEach((c) => { (seen[c.id] || seen[c.key] || []).forEach((r: any) => c.ev.push({ at: r.at, k: "seen", st: r.st, t: "Her Today card showed", dev: r.dev })); c.ev.sort((a: any, b2: any) => String(a.at).localeCompare(String(b2.at))); });
      other.sort((a, b2) => String(a.at).localeCompare(String(b2.at)));
      return out({ ok: true, teacher: T, day, classes: cls.map(({ key: _k, ...c }) => c), other, at: new Date().toISOString() });
    }
    return out({ ok: false, error: "unknown op" }, 400);
  } catch (e) { return out({ ok: false, error: String((e as Error).message || e) }, 500); }
});
