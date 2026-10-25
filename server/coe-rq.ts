// CupOfEnglish · coe-rq (25 Oct 2026) · Parent reports › Return to teacher, saved at once.
// POST { token, key, note, rid } (management only) → the return is recorded in `writes` straight away (the app shows
// "Returned" at once, a second tap with the same rid is the same save) and Google's own mgmtReportReturn is called in the
// background with the same sign-in, exactly as the app called it before. Google's answer is kept on the `writes` row
// (done / error), which the app reads through coe-mgmt › writeStatus. If Google does not answer, the row goes back to
// "new" after 3 minutes for Google's minute job.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const GAS_URL = "https://script.google.com/a/cupofenglishatph.com/macros/s/AKfycbyqAYrjEQ3CdeTzogP8mZ8tMRx59nV0vMvOHtoQ0wudTBNNXV7YeE_mJPYcqIRhmRbu/exec";
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: s } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!s || new Date(s.exp).getTime() < Date.now() || s.mode !== "mgmt") return out({ ok: false, error: "AUTH" }, 401);
  const key = String(b.key || "").slice(0, 200), note = String(b.note || "").trim().slice(0, 2000), rid = b.rid ? String(b.rid).slice(0, 80) : null;
  if (!key || note.length < 5) return out({ ok: false, error: "Write what to fix" }, 400);
  if (rid) { const { data: old } = await db.from("writes").select("id").eq("rid", rid).maybeSingle(); if (old) return out({ ok: true, queued: old.id, dup: true }); }
  const { data: w, error: we } = await db.from("writes").insert({ rid, fn: "mgmtReportReturn", args: [token, key, note], who: s.name, mode: s.mode, status: "busy" }).select("id").single();
  if (we || !w) return out({ ok: false, error: "not saved" }, 500);
  const google = (async () => {
    let st = "new", result: any = null, err = "";
    try {
      const ac = new AbortController(), tid = setTimeout(() => ac.abort(), 120000);
      const r = await fetch(GAS_URL, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ fn: "mgmtReportReturn", args: [token, key, note], rid: "rq" + w.id }), signal: ac.signal, redirect: "follow" }).then((x) => x.json()).finally(() => clearTimeout(tid));
      if (r && r.ok && r.data && r.data.ok) { st = "done"; result = r.data; }
      else if (r && r.ok && r.data && r.data.ok === false) { st = "error"; result = r.data; err = String(r.data.msg || "refused").slice(0, 300); }
      else if (r && r.ok === false && !/lock|timed? ?out|busy|service|internal|try again|too many/i.test(String(r.error || ""))) { st = "error"; err = String(r.error || "refused").slice(0, 300); }
    } catch (_e) { st = "new"; }
    if (st !== "new") await db.from("writes").update({ status: st, result, error: err || null, done_at: new Date().toISOString() }).eq("id", w.id).eq("status", "busy");
  })();
  try { (globalThis as any).EdgeRuntime.waitUntil(google); } catch (_e) { await google; }
  return out({ ok: true, queued: w.id });
});
