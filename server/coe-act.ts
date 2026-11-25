// CupOfEnglish · coe-act v1 (25 Nov 2026 · 2895, Misty: "more professional, historical, traceable and accountable")
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

    if (op === "day") {
      const day = String(b.day || ""); if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return out({ ok: false, error: "day" }, 400);
      const T = mgmt ? String(b.teacher || "").trim() : name; if (!T) return out({ ok: false, error: "teacher" }, 400);
      const tl = T.toLowerCase(), from = PH(day), to = PH(day, 48), alertTo = PH(day, 30);
      const [cQ, wQ, vQ, lQ, pQ, mQ, sQ] = await Promise.all([
        db.from("classes").select("id,data,starts_at,ends_at,cancelled,code,student,teachers").eq("day", day).contains("teachers", [tl]).order("starts_at"),
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
      for (const l of lQ.data || []) { const c = byCode(l.code, l.starts_at); if (c) c.ev.push({ at: PH(day, 23 + 59 / 60), k: "due", t: "Video deadline 23:59", s: l.found_at ? "a video was found" : "no video found · checked " + (l.checks || 0) + " times", miss: !l.found_at }); }
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
