// CupOfEnglish · coe-wct (27 Oct 2026, release 1270) · time-in picture for the WeChat corner.
// POST { token, op, day, ... }
//   op "post" (teacher): the teacher ticked "Posted in WeChat" → { ok }      args: time ("09:14" Manila), ti (time-in time)
//   op "net"  (teacher): the full time-in internet test finished → { ok }    args: speed ("↓ x Mbps · ↑ y Mbps · z ms · jitter j ms"), net, ip, ti
//   op "mine" (teacher): { ok, posted: { time } | null, speed }
//   op "day"  (management): { ok, rows: [...posts], redo: [...redo requests with a 1-hour signed proof link] }
//   op "ask"  (management): ask a teacher to redo the time-in check { teacher, reason }
//   op "redo" (teacher): the redone check { id, time, speed, net, ip, device, loc, shot (jpeg base64 → private bucket timein-redo) }
//   op "redoPost" (teacher): ticked "Posted in WeChat" for the redo card { id, time }
//   The original time-in (time, On time / Late) is never changed by a redo.
// Table public.coe_wechat_posts (service role only). Nothing is sent to Google.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
const manilaDay = (ms: number) => new Date(ms + 8 * 3600e3).toISOString().slice(0, 10);
const str = (v: unknown, n: number) => String(v == null ? "" : v).slice(0, n);
Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: s } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
  const op = String(b.op || ""), day = /^\d{4}-\d{2}-\d{2}$/.test(String(b.day || "")) ? String(b.day) : manilaDay(Date.now());
  const near = [manilaDay(Date.now() - 864e5), manilaDay(Date.now()), manilaDay(Date.now() + 864e5)].includes(day);
  const name = String(s.name || "").trim();
  if (op === "day") {
    if (s.mode !== "mgmt") return out({ ok: false, error: "AUTH" }, 403);
    const [{ data, error }, { data: R }] = await Promise.all([
      db.from("coe_wechat_posts").select("teacher,ti,posted_time,posted_at,speed,net,ip,measured_at").eq("day", day).limit(500),
      db.from("coe_timein_redo").select("id,teacher,asked_by,asked_at,reason,done_at,done_time,speed,net,ip,device,loc,proof_path,posted_at,posted_time").eq("day", day).order("id").limit(500)]);
    if (error) return out({ ok: false, error: "db" }, 500);
    const redo = await Promise.all((R || []).map(async (r: any) => { let proof = ""; if (r.proof_path) { const { data: u } = await db.storage.from("timein-redo").createSignedUrl(r.proof_path, 3600); proof = (u && u.signedUrl) || ""; } const o = { ...r, proof }; delete o.proof_path; return o; }));
    return out({ ok: true, day, rows: data || [], redo });
  }
  if (op === "ask") {   // management asks a teacher to redo the time-in check
    if (s.mode !== "mgmt") return out({ ok: false, error: "AUTH" }, 403);
    const teacher = str(b.teacher, 80).trim(), reason = str(b.reason, 300).trim(); if (!teacher || !reason || !near) return out({ ok: false, error: "teacher and reason" }, 400);
    const { data: open } = await db.from("coe_timein_redo").select("id").eq("day", day).eq("teacher_lc", teacher.toLowerCase()).is("done_at", null).maybeSingle();
    if (open) { await db.from("coe_timein_redo").update({ reason, asked_by: name, asked_at: new Date().toISOString() }).eq("id", open.id); return out({ ok: true, id: open.id, same: true }); }
    const { data: w, error } = await db.from("coe_timein_redo").insert({ day, teacher, asked_by: name, reason }).select("id").single();
    return error ? out({ ok: false, error: "not saved" }, 500) : out({ ok: true, id: w.id });
  }
  if (s.mode === "mgmt" || !name) return out({ ok: false, error: "teachers only" }, 403);
  if (op === "mine") {
    const [{ data }, { data: R }] = await Promise.all([db.from("coe_wechat_posts").select("posted_time,posted_at,speed").eq("day", day).eq("teacher_lc", name.toLowerCase()).maybeSingle(),
      db.from("coe_timein_redo").select("id,asked_at,reason,done_at,done_time,posted_at,speed").eq("day", day).eq("teacher_lc", name.toLowerCase()).order("id")]);
    const L = R || [], open = L.filter((r: any) => !r.done_at).pop() || null, last = L.filter((r: any) => r.done_at).pop() || null;
    return out({ ok: true, posted: data && data.posted_at ? { time: data.posted_time || "" } : null, speed: (data && data.speed) || "", redo: open, redone: last });
  }
  if (!near) return out({ ok: false, error: "day" }, 400);
  if (op === "redo") {   // the teacher sends the redone check (the original time-in is never touched)
    const id = +b.id; const { data: r } = await db.from("coe_timein_redo").select("id,teacher_lc,done_at").eq("id", id).maybeSingle();
    if (!r || r.teacher_lc !== name.toLowerCase()) return out({ ok: false, error: "not found" }, 404);
    if (r.done_at) return out({ ok: true, dup: true });
    let proof_path: string | null = null; const b64 = String(b.shot || "");
    if (b64 && b64.length < 6e6) { try { const bin = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)); proof_path = day + "/" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + id + "-" + Date.now() + ".jpg";
      const { error: ue } = await db.storage.from("timein-redo").upload(proof_path, bin, { contentType: "image/jpeg", upsert: true }); if (ue) proof_path = null; } catch (_e) { proof_path = null; } }
    const { error } = await db.from("coe_timein_redo").update({ done_at: new Date().toISOString(), done_time: str(b.time, 10), speed: str(b.speed, 200), net: str(b.net, 200), ip: str(b.ip, 60), device: str(b.device, 120), loc: str(b.loc, 200), proof_path }).eq("id", id);
    return error ? out({ ok: false, error: "not saved" }, 500) : out({ ok: true, proof: !!proof_path });
  }
  if (op === "redoPost") {
    const id = +b.id; const { data: r } = await db.from("coe_timein_redo").select("id,teacher_lc,posted_at").eq("id", id).maybeSingle();
    if (!r || r.teacher_lc !== name.toLowerCase()) return out({ ok: false, error: "not found" }, 404);
    if (!r.posted_at) await db.from("coe_timein_redo").update({ posted_at: new Date().toISOString(), posted_time: str(b.time, 10) }).eq("id", id);
    return out({ ok: true });
  }
  if (op === "post") {
    const row = { day, teacher: name, ti: str(b.ti, 10), posted_at: new Date().toISOString(), posted_time: str(b.time, 10), updated_at: new Date().toISOString() };
    const { data: old } = await db.from("coe_wechat_posts").select("posted_at").eq("day", day).eq("teacher_lc", name.toLowerCase()).maybeSingle();
    if (old && old.posted_at) return out({ ok: true, dup: true });
    const { error } = await db.from("coe_wechat_posts").upsert(row, { onConflict: "day,teacher_lc" });
    return error ? out({ ok: false, error: "not saved" }, 500) : out({ ok: true });
  }
  if (op === "net") {
    const speed = str(b.speed, 200); if (!/Mbps/.test(speed)) return out({ ok: false, error: "no result" }, 400);
    const row: any = { day, teacher: name, speed, net: str(b.net, 200), ip: str(b.ip, 60), measured_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    if (b.ti) row.ti = str(b.ti, 10);
    const { error } = await db.from("coe_wechat_posts").upsert(row, { onConflict: "day,teacher_lc" });
    return error ? out({ ok: false, error: "not saved" }, 500) : out({ ok: true });
  }
  return out({ ok: false, error: "unknown op" }, 400);
});
