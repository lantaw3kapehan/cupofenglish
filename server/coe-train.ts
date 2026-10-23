// CupOfEnglish · coe-train (23 Oct 2026): Trainings (Addendum No. 1, Clause 3.6) + presence + part_remove — the path, videos with watch tracking, quizzes,
// sessions and permanent records. Records are never deleted (database triggers); progress only grows; quiz attempts never change.
// POST { token, action, ... }
//   my        { teacher? }  → { ok, trainings, parts, sessions, records, progress, quiz }   (teacher: own; management: any teacher)
//   all       {}            → same for everyone (management)
//   video_url { part_id }   → { ok, url }   (signed, 2 hours; private bucket "trainings")
//   tick      { part_id, seen, secs, view } → { ok, p }    (teacher: every ~30 s while the video plays)
//   quiz      { part_id, answers:[i…] }     → { ok, score, total, passed, review }  (teacher; graded here)
//   reflect   { part_id, text }             → { ok }
//   approve   { teacher, part_id, ver, ok, note } (management) · rec_add { teacher, training_id, status, via, note, done_at } (management)
//   sess_set  { s } · sess_attend { id, present:[names] } (management) · part_set { p } · upload_url { part_id, name } (management)
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
const str = (x: unknown, n = 200) => String(x == null ? "" : x).trim().slice(0, n);
const BUCKET = "trainings", STEP = 10;   // watch map: one character per 10 seconds of video
const orSeen = (a: string, b: string) => { const n = Math.max(a.length, b.length); let s = ""; for (let i = 0; i < n; i++) s += a[i] === "1" || b[i] === "1" ? "1" : "0"; return s; };
const strip = (p: any) => ({ ...p, quiz: (Array.isArray(p.quiz) ? p.quiz : []).map((q: any) => ({ q: q.q, choices: q.choices })) });

Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: s } = await db.from("app_sessions").select("name,role,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
  const mgmt = s.mode === "mgmt", me = String(s.name || ""), a = String(b.action || ""), now = new Date().toISOString();
  const need = () => { if (!mgmt) throw new Error("Management only"); };
  const part = async (id: number) => { const { data } = await db.from("coe_training_parts").select("*").eq("id", id).maybeSingle(); return data; };
  // a training with parts is done when every active part is done (and approved where needed)
  async function maybeDone(teacher: string, tid: string) {
    if (tid !== "way") return false;   // (Misty) every other training is done only when management ticks it (live, or recording + reflection)
    const { data: P } = await db.from("coe_training_parts").select("id,ver,approve").eq("training_id", tid).eq("active", true); if (!P || !P.length) return false;
    const { data: G } = await db.from("coe_training_progress").select("part_id,ver,done_at,approved_at").eq("teacher", teacher).in("part_id", P.map((x) => x.id));
    const ok = P.every((p) => (G || []).some((g) => g.part_id === p.id && g.ver === p.ver && g.done_at && (!p.approve || g.approved_at))); if (!ok) return false;
    const { data: R } = await db.from("coe_training_records").select("status").eq("teacher", teacher).eq("training_id", tid).order("created_at", { ascending: false }).limit(1);
    if (R && R[0] && R[0].status === "done") return true;
    await db.from("coe_training_records").insert({ teacher, training_id: tid, status: "done", via: "online", done_at: now, by_who: "app" });
    return true;
  }
  // a part is done when ≥90% watched (or no video), the quiz is passed (if any) — approval is separate
  async function checkPart(teacher: string, p: any) {
    const { data: g } = await db.from("coe_training_progress").select("*").eq("teacher", teacher).eq("part_id", p.id).eq("ver", p.ver).maybeSingle(); if (!g || g.done_at) return g;
    const watched = !p.video_path || g.pct >= 90, quiz = Array.isArray(p.quiz) && p.quiz.length;
    let passed = !quiz; if (quiz) { const { data: Q } = await db.from("coe_training_quiz").select("id").eq("teacher", teacher).eq("part_id", p.id).eq("ver", p.ver).eq("passed", true).limit(1); passed = !!(Q && Q.length); }
    if (watched && passed && (!p.approve || g.reflection)) { await db.from("coe_training_progress").update({ done_at: now }).eq("teacher", teacher).eq("part_id", p.id).eq("ver", p.ver); g.done_at = now; await maybeDone(teacher, p.training_id); }
    return g;
  }
  try {
    if (a === "ping") {   // 23 Oct · who is using the app now (every signed-in device, once a minute while the app is open and visible)
      const dev = str(b.dev, 20) || "web"; const { data: o } = await db.from("coe_presence").select("at,since").eq("name", me).eq("dev", dev).maybeSingle();
      const fresh = o && Date.now() - new Date(o.at).getTime() < 5 * 60e3;
      const { error } = await db.from("coe_presence").upsert({ name: me, mode: String(s.mode || ""), dev, view: str(b.view, 30) || null, v: +b.v || null, at: now, since: fresh ? o!.since : now });
      return out({ ok: !error, error: error && error.message });
    }
    if (a === "online") {
      need(); const { data, error } = await db.from("coe_presence").select("*").gte("at", new Date(Date.now() - 24 * 3600e3).toISOString()).order("at", { ascending: false });
      return out({ ok: !error, error: error && error.message, now, rows: data || [] });
    }
    if (a === "my" || a === "all") {
      if (a === "all") need(); const who = a === "my" ? (mgmt && b.teacher ? str(b.teacher, 60) : me) : null;
      const [T, P, S, R, G, Q] = await Promise.all([
        db.from("coe_trainings").select("*").eq("active", true).order("sort"),
        db.from("coe_training_parts").select("*").eq("active", true).order("training_id").order("sort"),
        db.from("coe_training_sessions").select("*").neq("status", "cancelled").gte("starts_at", new Date(Date.now() - 60 * 864e5).toISOString()).order("starts_at"),
        who ? db.from("coe_training_records").select("*").eq("teacher", who).order("created_at") : db.from("coe_training_records").select("*").order("created_at"),
        who ? db.from("coe_training_progress").select("teacher,part_id,ver,seen,pct,secs,views,first_at,last_at,done_at,reflection,approved_by,approved_at").eq("teacher", who)
            : db.from("coe_training_progress").select("teacher,part_id,ver,pct,secs,views,first_at,last_at,done_at,reflection,approved_by,approved_at"),
        who ? db.from("coe_training_quiz").select("teacher,part_id,ver,score,total,passed,at").eq("teacher", who).order("at") : db.from("coe_training_quiz").select("teacher,part_id,ver,score,total,passed,at").order("at")]);
      const err = [T, P, S, R, G, Q].find((x) => x.error); if (err) return out({ ok: false, error: err.error!.message });
      let sessions = S.data || []; if (who && !mgmt) sessions = sessions.filter((x: any) => x.facilitator === who || (x.invited || []).includes(who));
      return out({ ok: true, me: who || me, trainings: T.data, parts: mgmt ? P.data : (P.data || []).map(strip), sessions, records: R.data, progress: G.data, quiz: Q.data });
    }
    if (a === "lates") {   // 23 Oct · a teacher's own late time-ins / late-to-class (last 40 days) with the decision, + the POLICY amounts
      const who = mgmt && b.teacher ? str(b.teacher, 60) : me, since = new Date(Date.now() + 8 * 3600e3 - 40 * 864e5).toISOString().slice(0, 10);
      const { data, error } = await db.from("log_rows").select("data").eq("tab", "T-TIMEIN").in("data->>6", ["Late", "Late to class"]).gte("data->>0", since).ilike("data->>1", who).limit(200);
      if (error) return out({ ok: false, error: error.message });
      const { data: P } = await db.from("sheet_rows").select("data").eq("tab", "POLICY");
      const pol = (P || []).map((x: any) => x.data).filter((r: any) => Array.isArray(r) && /^Teacher Late (Time-in|to Class)$/.test(String(r[2])) && /Active/.test(String(r[12] || ""))).map((r: any) => ({ subject: r[2], condition: r[4], tier: r[5], amount: +r[7] || 0 }));
      const rows = (data || []).map((x: any) => x.data).map((r: any) => ({ day: String(r[0]).slice(0, 10), at: r[3], first: r[4], mins: r[5], kind: r[6], note: r[8] || "", cls: String(r[14] || "").split(" · ")[0] })).sort((p: any, q: any) => String(q.at).localeCompare(String(p.at)));
      return out({ ok: true, rows, policy: pol, now });
    }
    if (a === "video_url") {
      const p = await part(+b.part_id); if (!p || !p.video_path) return out({ ok: false, error: "No video yet" });
      const { data, error } = await db.storage.from(BUCKET).createSignedUrl(p.video_path, 7200); if (error) return out({ ok: false, error: error.message });
      return out({ ok: true, url: data.signedUrl });
    }
    if (a === "tick") {
      const p = await part(+b.part_id); if (!p) return out({ ok: false, error: "Not found" }, 404);
      const seen = str(b.seen, 2000).replace(/[^01]/g, ""), secs = Math.max(0, Math.min(120, Math.round(+b.secs || 0)));
      const { data: g } = await db.from("coe_training_progress").select("*").eq("teacher", me).eq("part_id", p.id).eq("ver", p.ver).maybeSingle();
      const all = orSeen(g ? g.seen : "", seen), n = Math.max(1, Math.ceil((p.dur_sec || all.length * STEP) / STEP)), pct = Math.min(100, Math.round(all.slice(0, n).split("").filter((c) => c === "1").length / n * 100));
      const row = { teacher: me, part_id: p.id, ver: p.ver, seen: all, pct, secs: (g ? g.secs : 0) + secs, views: (g ? g.views : 0) + (b.view ? 1 : 0), last_at: now };
      const { error } = g ? await db.from("coe_training_progress").update(row).eq("teacher", me).eq("part_id", p.id).eq("ver", p.ver) : await db.from("coe_training_progress").insert(row);
      if (error) return out({ ok: false, error: error.message });
      return out({ ok: true, p: await checkPart(me, p) });
    }
    if (a === "quiz") {
      const p = await part(+b.part_id); if (!p) return out({ ok: false, error: "Not found" }, 404);
      const Qs = Array.isArray(p.quiz) ? p.quiz : [], ans = Array.isArray(b.answers) ? b.answers : []; if (!Qs.length) return out({ ok: false, error: "No quiz" });
      const review = Qs.map((q: any, i: number) => ({ ok: +ans[i] === +q.answer, answer: +q.answer, why: q.why || "" })), score = review.filter((x: any) => x.ok).length, passed = score / Qs.length >= 0.8;
      const { error } = await db.from("coe_training_quiz").insert({ teacher: me, part_id: p.id, ver: p.ver, score, total: Qs.length, passed, answers: ans.slice(0, 50) });
      if (error) return out({ ok: false, error: error.message });
      const { data: g } = await db.from("coe_training_progress").select("teacher").eq("teacher", me).eq("part_id", p.id).eq("ver", p.ver).maybeSingle();
      if (!g) await db.from("coe_training_progress").insert({ teacher: me, part_id: p.id, ver: p.ver });
      await checkPart(me, p); return out({ ok: true, score, total: Qs.length, passed, review });
    }
    if (a === "reflect") {
      const p = await part(+b.part_id); if (!p) return out({ ok: false, error: "Not found" }, 404); const text = str(b.text, 3000); if (text.length < 10) return out({ ok: false, error: "Write 2–3 lines." });
      const { data: g } = await db.from("coe_training_progress").select("teacher").eq("teacher", me).eq("part_id", p.id).eq("ver", p.ver).maybeSingle();
      const { error } = g ? await db.from("coe_training_progress").update({ reflection: text, last_at: now }).eq("teacher", me).eq("part_id", p.id).eq("ver", p.ver)
                          : await db.from("coe_training_progress").insert({ teacher: me, part_id: p.id, ver: p.ver, reflection: text });
      if (error) return out({ ok: false, error: error.message }); await checkPart(me, p); return out({ ok: true });
    }
    if (a === "approve") {
      need(); const p = await part(+b.part_id); if (!p) return out({ ok: false, error: "Not found" }, 404); const t = str(b.teacher, 60);
      if (b.ok === false) { const { error } = await db.from("coe_training_progress").update({ reflection: null, last_at: now }).eq("teacher", t).eq("part_id", p.id).eq("ver", +b.ver || p.ver); return out({ ok: !error, error: error && error.message }); }
      const { error } = await db.from("coe_training_progress").update({ approved_by: me, approved_at: now }).eq("teacher", t).eq("part_id", p.id).eq("ver", +b.ver || p.ver);
      if (error) return out({ ok: false, error: error.message }); await maybeDone(t, p.training_id); return out({ ok: true });
    }
    if (a === "rec_add") {
      need(); const r = { teacher: str(b.teacher, 60), training_id: str(b.training_id, 40), status: str(b.status, 20) || "done", via: str(b.via, 20) || "manual",
        note: str(b.note, b.training_id === "coach" ? 4000 : 500) || null, done_at: b.done_at && !isNaN(Date.parse(b.done_at)) ? new Date(b.done_at).toISOString() : (b.status === "done" || !b.status ? now : null), by_who: me };
      if (!r.teacher || !r.training_id) return out({ ok: false, error: "Teacher and training needed" });
      const { data, error } = await db.from("coe_training_records").insert(r).select().single(); return out({ ok: !error, error: error && error.message, record: data });
    }
    if (a === "sess_set") {
      need(); const x = b.s || {}; const row: any = { training_id: str(x.training_id, 40), starts_at: x.starts_at && !isNaN(Date.parse(x.starts_at)) ? new Date(x.starts_at).toISOString() : null,
        mins: Math.max(10, Math.min(480, +x.mins || 60)), facilitator: str(x.facilitator, 60) || null, meet_url: str(x.meet_url, 500) || null,
        invited: (Array.isArray(x.invited) ? x.invited : []).map((n: any) => str(n, 60)).filter(Boolean).slice(0, 80), note: str(x.note, 1000) || null };
      if (x.status && ["scheduled", "done", "cancelled"].includes(x.status)) row.status = x.status;
      if (x.recording_path !== undefined) row.recording_path = str(x.recording_path, 300) || null;
      if (!row.training_id || !row.starts_at) return out({ ok: false, error: "Training and date needed" });
      const q = x.id ? db.from("coe_training_sessions").update(row).eq("id", +x.id).select().single() : db.from("coe_training_sessions").insert({ ...row, created_by: me }).select().single();
      const { data, error } = await q; return out({ ok: !error, error: error && error.message, session: data });
    }
    if (a === "sess_attend") {
      need(); const { data: S } = await db.from("coe_training_sessions").select("*").eq("id", +b.id).maybeSingle(); if (!S) return out({ ok: false, error: "Not found" }, 404);
      const present = (Array.isArray(b.present) ? b.present : []).map((n: any) => str(n, 60)).filter(Boolean);
      const { data: R } = await db.from("coe_training_records").select("teacher").eq("session_id", S.id).in("status", ["done", "completed"]); const had = new Set((R || []).map((x) => x.teacher));
      // 702: a book / specialization session makes it "Training completed"; management then marks "Qualified to teach"
      const { data: TK } = await db.from("coe_trainings").select("kind").eq("id", S.training_id).maybeSingle(); const st = TK && TK.kind === "unlock" ? "completed" : "done";
      const rows = present.filter((n: string) => !had.has(n)).map((n: string) => ({ teacher: n, training_id: S.training_id, status: st, via: "live", session_id: S.id, done_at: S.starts_at, by_who: me }));
      if (S.facilitator && !had.has(S.facilitator) && !present.includes(S.facilitator) && b.facil !== false) rows.push({ teacher: S.facilitator, training_id: "facil", status: "done", via: "live", session_id: S.id, done_at: S.starts_at, by_who: me, note: "Facilitated " + S.training_id } as any);
      if (rows.length) { const { error } = await db.from("coe_training_records").insert(rows); if (error) return out({ ok: false, error: error.message }); }
      await db.from("coe_training_sessions").update({ status: "done" }).eq("id", S.id); return out({ ok: true, n: rows.length });
    }
    if (a === "part_set") {
      need(); const x = b.p || {}; const row: any = {}; ["title", "video_path"].forEach((k) => { if (x[k] !== undefined) row[k] = str(x[k], 300) || null; });
      if (x.dur_sec !== undefined) row.dur_sec = Math.max(0, Math.round(+x.dur_sec || 0)); if (x.approve !== undefined) row.approve = !!x.approve; if (x.active !== undefined) row.active = !!x.active;
      if (x.quiz !== undefined) row.quiz = (Array.isArray(x.quiz) ? x.quiz : []).slice(0, 10).map((q: any) => ({ q: str(q.q, 400), choices: (q.choices || []).slice(0, 5).map((c: any) => str(c, 200)), answer: +q.answer || 0, why: str(q.why, 400) }));
      if (x.newver) { const p = await part(+x.id); if (p) row.ver = p.ver + 1; }
      row.updated_at = now;
      const q = x.id ? db.from("coe_training_parts").update(row).eq("id", +x.id).select().single() : db.from("coe_training_parts").insert({ training_id: str(x.training_id, 40), sort: +x.sort || 1, title: row.title || "Part", ...row }).select().single();
      const { data, error } = await q; return out({ ok: !error, error: error && error.message, part: data });
    }
    if (a === "part_remove") {   // 23 Oct · delete a video (file removed from storage) or the whole part (hidden); watch/quiz history is kept
      need(); const p = await part(+b.id); if (!p) return out({ ok: false, error: "Not found" }, 404);
      if (p.video_path) { await db.storage.from(BUCKET).remove([p.video_path]); }
      const row: any = { video_path: null, dur_sec: 0, updated_at: now }; if (b.what === "part") row.active = false;
      const { data, error } = await db.from("coe_training_parts").update(row).eq("id", p.id).select().single(); return out({ ok: !error, error: error && error.message, part: data });
    }
    // 23 Oct · coaching recordings: uploaded into the private bucket under coach/<teacher>/…; the record keeps "§file:<path>" in its note.
    if (a === "coach_upload_url") {
      need(); const t = str(b.teacher, 60); if (!t) return out({ ok: false, error: "Teacher needed" });
      const ext = (str(b.name, 100).match(/\.(mp4|webm|mov|m4v)$/i) || [".mp4"])[0].toLowerCase(), path = "coach/" + t.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "/" + Date.now() + ext;
      const { data, error } = await db.storage.from(BUCKET).createSignedUploadUrl(path); if (error) return out({ ok: false, error: error.message });
      return out({ ok: true, path, url: data.signedUrl, token: data.token });
    }
    if (a === "coach_video") {   // the teacher watches their own coaching recording; management any
      const { data: r } = await db.from("coe_training_records").select("id,teacher,note").eq("id", +b.id).eq("training_id", "coach").maybeSingle();
      if (!r || (!mgmt && r.teacher !== me)) return out({ ok: false, error: "Not found" }, 404);
      const path = ((String(r.note || "").match(/\n§file:(.*)/) || [])[1] || "").trim(); if (!path.startsWith("coach/")) return out({ ok: false, error: "No recording" }, 404);
      const { data, error } = await db.storage.from(BUCKET).createSignedUrl(path, 7200); return out({ ok: !error, error: error && error.message, url: data && data.signedUrl });
    }
    if (a === "coach_attach") {   // management adds or replaces the recording of a coaching already logged
      need(); const { data: r } = await db.from("coe_training_records").select("id,note").eq("id", +b.id).eq("training_id", "coach").maybeSingle(); if (!r) return out({ ok: false, error: "Not found" }, 404);
      let n = String(r.note || "").replace(/\n§(file|video):.*/g, ""); const f = str(b.path, 300), v = str(b.url, 500);
      if (f.startsWith("coach/")) n += "\n§file:" + f; else if (/^https?:\/\//.test(v)) n += "\n§video:" + v;
      const { data, error } = await db.from("coe_training_records").update({ note: n.slice(0, 4000) }).eq("id", r.id).select().single(); return out({ ok: !error, error: error && error.message, record: data });
    }
    // 23 Oct · video checks: management's OK / Needs action is saved here at once (Google can take a minute); every manager sees it right away
    if (a === "vf_dec" || a === "vf_decs") {
      need(); const { data: d0 } = await db.from("docs").select("data").eq("key", "mgmt:vfdec").maybeSingle(); let dec: any = (d0 && d0.data && typeof d0.data === "object") ? d0.data : {};
      if (a === "vf_dec") {
        const k = str(b.k, 140), st = str(b.st, 10); if (!k || !["ok", "action", "open"].includes(st)) return out({ ok: false, error: "Choose OK or Needs action" });
        const cut = Date.now() - 60 * 864e5; dec = Object.fromEntries(Object.entries(dec).filter(([, v]: any) => (v && v.at) > cut));
        dec[k] = { st, by: me, at: Date.now(), note: str(b.note, 300) };
        const { error } = await db.from("docs").upsert({ key: "mgmt:vfdec", scope: "mgmt", data: dec, updated_at: now }); if (error) return out({ ok: false, error: error.message });
      }
      return out({ ok: true, dec });
    }
    if (a === "upload_url") {
      need(); const p = await part(+b.part_id); if (!p) return out({ ok: false, error: "Not found" }, 404);
      const ext = (str(b.name, 100).match(/\.(mp4|webm|mov|m4v)$/i) || [".mp4"])[0].toLowerCase(), path = p.training_id + "/" + p.id + "-v" + (p.ver + (p.video_path ? 1 : 0)) + "-" + Date.now() + ext;
      const { data: bk } = await db.storage.getBucket(BUCKET); if (!bk) await db.storage.createBucket(BUCKET, { public: false, fileSizeLimit: 2147483648 });   // private: no public links
      const { data, error } = await db.storage.from(BUCKET).createSignedUploadUrl(path); if (error) return out({ ok: false, error: error.message });
      return out({ ok: true, path, url: data.signedUrl, token: data.token });
    }
    return out({ ok: false, error: "Unknown action" }, 400);
  } catch (e) { return out({ ok: false, error: String((e as Error).message || e) }, (e as Error).message === "Management only" ? 403 : 500); }
});
