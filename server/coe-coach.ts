// CupOfEnglish · coe-coach (7 Nov 2026, 1826): the coach's side of 1:1 coaching, and the trainer's side of a training session.
// A teacher who is the coach of a booked coaching (coe_training_sessions.facilitator, training_id 'coach') writes the notes and
// adds the recording herself; management can do the same. Saving makes the coached teacher's record(s) (same note format as
// management's "Coaching done") with §coach and §mins, and closes the session. The ₱200/h coaching pay follows from the record
// (database trigger coe_trainpay_rec).
// POST { token, action, ... }
//   given       { teacher? } → { ok, upcoming:[sessions I coach], given:[records where I'm the coach], trains:[training sessions I lead] }
//   upload_url  { sid, name } → { ok, path, url, token }   (coach / trainer of that session, or management)
//   done        { sid, notes, video, path } → { ok, n }   (coaching)
//   tnotes      { sid, notes, video, path } → { ok }      (a training session's trainer: notes + recording; attendance stays with management)
//   watch       { sid } → { ok, url }                     (recording of a training session: management, the trainer, or an invited teacher)
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
const str = (x: unknown, n = 200) => String(x == null ? "" : x).trim().slice(0, n);
const BUCKET = "trainings";

Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: s } = await db.from("app_sessions").select("name,role,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
  const mgmt = s.mode === "mgmt", me = String(s.name || ""), a = String(b.action || "");
  const sess = async (id: number) => { const { data } = await db.from("coe_training_sessions").select("*").eq("id", id).maybeSingle(); return data; };
  const mine = (S: any) => S && (mgmt || String(S.facilitator || "").toLowerCase() === me.toLowerCase());
  try {
    if (a === "given") {
      const who = mgmt && b.teacher ? str(b.teacher, 60) : me;
      const [U, G, TR] = await Promise.all([
        db.from("coe_training_sessions").select("id,starts_at,mins,facilitator,invited,note,meet_url,status").eq("training_id", "coach").eq("status", "scheduled").ilike("facilitator", who).order("starts_at"),
        db.from("coe_training_records").select("id,teacher,done_at,note").eq("training_id", "coach").eq("status", "done").ilike("note", "%\n§coach:" + who + "%").order("done_at", { ascending: false }).limit(200),
        db.from("coe_training_sessions").select("id,training_id,starts_at,mins,facilitator,invited,note,meet_url,status,recording_path,trainer_notes,trainer_notes_at,coe_trainings(title)").neq("training_id", "coach").neq("status", "cancelled").ilike("facilitator", who)
          .gte("starts_at", new Date(Date.now() - 90 * 864e5).toISOString()).order("starts_at", { ascending: false })]);
      if (U.error || G.error || TR.error) return out({ ok: false, error: (U.error || G.error || TR.error)!.message });
      const re = new RegExp("\\n§coach:" + who.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*(\\n|$)", "i");
      const given = (G.data || []).filter((r: any) => re.test(String(r.note || ""))).map((r: any) => {
        const n = String(r.note || "").replace(/\n§(coach|video|file|mins):.*/g, ""), m = n.split(" — ");
        return { id: r.id, teacher: r.teacher, done_at: r.done_at, topic: m[0] || "Coaching", notes: m.slice(1).join(" — "), mins: +((String(r.note).match(/\n§mins:(\d+)/) || [])[1] || 0) || null };
      });
      return out({ ok: true, who, upcoming: U.data || [], given, trains: TR.data || [] });
    }
    if (a === "upload_url") {
      const S = await sess(+b.sid); if (!mine(S)) return out({ ok: false, error: "Only the coach of this session can add its recording" }, 403);
      const t = str((S.invited || [])[0] || "coach", 60), ext = (str(b.name, 100).match(/\.(mp4|webm|mov|m4v)$/i) || [".mp4"])[0].toLowerCase();
      const path = S.training_id === "coach" ? "coach/" + t.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "/" + Date.now() + ext : "sessions/" + S.id + "/" + Date.now() + ext;
      const { data, error } = await db.storage.from(BUCKET).createSignedUploadUrl(path); if (error) return out({ ok: false, error: error.message });
      return out({ ok: true, path, url: data.signedUrl, token: data.token });
    }
    if (a === "done") {
      const S = await sess(+b.sid); if (!S || S.training_id !== "coach") return out({ ok: false, error: "Not found" }, 404);
      if (!mine(S)) return out({ ok: false, error: "Only the coach of this session can write its notes" }, 403);
      if (S.status !== "scheduled") return out({ ok: false, error: "This coaching is already saved" });
      const notes = str(b.notes, 3500); if (notes.length < 10) return out({ ok: false, error: "Write what you worked on and the next steps (2–3 lines)" });
      const path = str(b.path, 300), video = str(b.video, 500), coach = str(S.facilitator, 60) || me;
      const note = (str(S.note, 300) || "Coaching") + " — " + notes + "\n§coach:" + coach + "\n§mins:" + (S.mins || 60)
        + (path.startsWith("coach/") ? "\n§file:" + path : /^https?:\/\//.test(video) ? "\n§video:" + video : "");
      const rows = (S.invited || []).map((t: string) => ({ teacher: t, training_id: "coach", status: "done", via: "live", session_id: S.id, done_at: S.starts_at, note: note.slice(0, 4000), by_who: me }));
      if (!rows.length) return out({ ok: false, error: "No teacher on this coaching" });
      const { error } = await db.from("coe_training_records").insert(rows); if (error) return out({ ok: false, error: error.message });
      await db.from("coe_training_sessions").update({ status: "done" }).eq("id", S.id);
      return out({ ok: true, n: rows.length });
    }
    if (a === "tnotes") {
      const S = await sess(+b.sid); if (!S || S.training_id === "coach") return out({ ok: false, error: "Not found" }, 404);
      if (!mine(S)) return out({ ok: false, error: "Only the trainer of this session can write its notes" }, 403);
      const notes = str(b.notes, 3500), path = str(b.path, 300), video = str(b.video, 500), row: any = {};
      if (notes) { row.trainer_notes = notes; row.trainer_notes_at = new Date().toISOString(); row.trainer_notes_by = me; }
      if (path.startsWith("sessions/" + S.id + "/")) row.recording_path = path; else if (/^https?:\/\//.test(video)) row.recording_path = video;
      if (!Object.keys(row).length) return out({ ok: false, error: "Write the notes or add the recording" });
      const { error } = await db.from("coe_training_sessions").update(row).eq("id", S.id); return out({ ok: !error, error: error && error.message });
    }
    if (a === "watch") {
      const S = await sess(+b.sid); if (!S || !S.recording_path) return out({ ok: false, error: "No recording yet" }, 404);
      const lc = me.toLowerCase(); if (!(mine(S) || (S.invited || []).some((n: string) => String(n).toLowerCase() === lc))) return out({ ok: false, error: "Not found" }, 404);
      if (/^https?:\/\//.test(S.recording_path)) return out({ ok: true, url: S.recording_path, link: true });
      const { data, error } = await db.storage.from(BUCKET).createSignedUrl(S.recording_path, 7200); return out({ ok: !error, error: error && error.message, url: data && data.signedUrl });
    }
    return out({ ok: false, error: "Unknown action" }, 400);
  } catch (e) { return out({ ok: false, error: String((e as Error).message || e) }, 500); }
});
