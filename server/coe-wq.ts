// CupOfEnglish · coe-wq v10 (11 Nov 2026 · 2070: finished by the database when it can; Google only for what the database cannot do yet) · (27 Oct 2026) · slow management saves answered at once (Misty: "Yes I want them made instant").
// POST { token, fn, args, rid } → the save is recorded in `writes` straight away (status busy) and the app shows "Saved"; Google's own
// function is called in the background with the same sign-in and arguments, exactly as the app called it before (same checks, same
// sheets, same Drive upload). Google's answer is kept on the `writes` row (done / error); the app reads it through coe-mgmt › writeStatus
// and shows a clear message if Google refused. Same rid = same save (never twice): the row is found by rid, and Google is called with
// rid "wq<id>" (Google ignores a repeated rid). If Google does not answer twice, the row goes to "new" for Google's minute job
// (SB_REPLAY; see SERVER-INSTANT27-paste.md) — except a save with a file (the file is not kept in the database): that row ends as
// error "Google did not answer" so the person is told to save it again. Its row is stored as "<fn>:file" so Google's minute job can never
// replay it without the file.
// v9 (6 Nov · cases database-first): for addCase the database makes the case when the row is inserted (coe_dbf_h_case writes the number
// into args[1].caseId, or args[1].dbErr for a second Enrollment Bonus). The number goes back to the app at once and Google is called
// with it (CASEDB1106: Google writes that same case into ACTIONS). A refused case (dbErr) is answered at once and never sent to Google.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const GAS_URL = "https://script.google.com/a/cupofenglishatph.com/macros/s/AKfycbyqAYrjEQ3CdeTzogP8mZ8tMRx59nV0vMvOHtoQ0wudTBNNXV7YeE_mJPYcqIRhmRbu/exec";
// fn → who may send it (Google checks the same again): m = management only, a = anyone signed in (Google limits a teacher to their own)
const FNS: Record<string, "m" | "a"> = { mgmtAgreeSave: "m", mgmtLeaveInformed: "m", tLeaveInformed: "a", mgmtTagClass: "m", decideLate: "m",
    addCase: "m", mgmtCaseWaive: "m", mgmtTaskStatus: "m", mgmtTrialGroup: "m", mgmtLeaveSave: "m", setActiveTick: "m", mgmtAvailSave: "m", mgmtShiftClose: "m",   // 4 Nov (Misty: "do the rest … in the database"): batch 1
    mgmtPeerCancel: "m", mgmtLeaveAsk: "m", markPaidMonth: "m", mgmtProfileSave: "m", mgmtTcSubFix: "m", mgmtFix: "m", setSharedPkg: "m", tLeaveCancel: "a",   // batch 2
    mgmtTrialSent: "m", mgmtSetCourse: "m", mgmtTrialCefrSave: "m", mgmtReportReturn: "m", mgmtNoteComment: "m", mgmtPeerAssign: "m", markPaid: "m", tNotMine: "a",   // batch 3
    mgmtEnqSave: "m",   // batch 4: enquiry changes (the app sends only changes of an existing enquiry here; a new one goes to Google)
    mgmtTrialReturn: "m", mgmtPayReply: "m", tLeaveReply: "a",   // batch 5 (v7, 4 Nov · app 1740): trial sent back, pay reply, a teacher's written leave answer
    mgmtEnrolShared: "m", mgmtRefund: "m" };   // batch 6 (v8, 4 Nov · app 1741): shared enrolment, refund (Google checks President for refunds)
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
const BUSY = /lock|timed? ?out|busy|service|internal|try again|too many/i;
Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const fn = String(b.fn || ""), args = b.args;
  if (!FNS[fn] || !Array.isArray(args) || args.length < 2 || args.length > 6) return out({ ok: false, error: "not allowed" }, 400);
  if (fn === "tLeaveReply" && Array.isArray(args[3]) && args[3].length) return out({ ok: false, error: "not allowed" }, 400);   // v7: a leave answer with files goes to Google (files are not kept here)
  if (fn === "mgmtRefund" && args[1] && typeof args[1] === "object" && args[1].dry) return out({ ok: false, error: "not allowed" }, 400);   // v8: the refund look-up is read by Google directly
  const token = String(args[0] || ""); if (token.length < 16 || token !== String(b.token || token)) return out({ ok: false, error: "AUTH" }, 401);
  const { data: s } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
  if (FNS[fn] === "m" && s.mode !== "mgmt") return out({ ok: false, error: "not allowed" }, 403);
  const rid = b.rid ? String(b.rid).slice(0, 80) : null;
  if (rid) { const { data: old } = await db.from("writes").select("id,args").eq("rid", rid).maybeSingle(); if (old) return out({ ok: true, queued: true, id: old.id, dup: true, caseId: fn === "addCase" ? ((old.args || [])[1] || {}).caseId : undefined }); }
  // a file (signed agreement) goes to Google but is not stored in the database row
  const a1 = args[1] && typeof args[1] === "object" ? args[1] : null, hasFile = !!(a1 && a1.file && a1.file.b64);
  if (hasFile && String(a1.file.b64).length > 12e6) return out({ ok: false, error: "too big" }, 413);
  let stored = hasFile ? [token, { ...a1, file: { name: a1.file.name, mime: a1.file.mime, size: String(a1.file.b64).length, kept: false } }, ...args.slice(2)] : args;
  // v10 (11 Nov · 2070): inserted as "new" so the database's own handlers can finish the save; only a save still open goes on to Google
  const { data: W0, error: we } = await db.rpc("coe_wq_insert", { p_rid: rid, p_fn: hasFile ? fn + ":file" : fn, p_args: stored, p_who: s.name, p_mode: s.mode });
  const w: any = W0;
  if (we || !w || !w.id) { if (rid && we && /duplicate/i.test(we.message)) return out({ ok: true, queued: true, dup: true }); return out({ ok: false, error: "not saved" }, 500); }
  // finished by the database (done, or refused with a reason): answered like a queued save; the app's watch shows a refusal as before
  if (w.status === "done" || w.status === "error") return out({ ok: true, queued: true, id: w.id, db: true, caseId: w.result && w.result.caseId });
  // v9 · cases database-first: the case number made by the database (or its refusal)
  let send = args, caseId: string | undefined;
  if (fn === "addCase") {
    const { data: w2 } = await db.from("writes").select("args").eq("id", w.id).maybeSingle();
    const f2 = (w2 && Array.isArray(w2.args) && w2.args[1] && typeof w2.args[1] === "object") ? w2.args[1] : {};
    if (f2.dbErr) {
      await db.from("writes").update({ status: "error", error: String(f2.dbErr).slice(0, 300), result: { ok: false, msg: f2.dbErr }, done_at: new Date().toISOString(), args: [""].concat(w2!.args.slice(1)) }).eq("id", w.id);
      return out({ ok: false, error: String(f2.dbErr), msg: String(f2.dbErr) });
    }
    if (f2.caseId) { caseId = String(f2.caseId); send = [args[0], { ...args[1], caseId }, ...args.slice(2)]; stored = send; }
  }
  const google = (async () => {
    let st = "new", result: any = null, err = "";
    for (let a = 0; a < 2 && st === "new"; a++) {
      if (a) await new Promise((z) => setTimeout(z, 5000));
      try {
        const ac = new AbortController(), tid = setTimeout(() => ac.abort(), 110000);
        const r = await fetch(GAS_URL, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ fn, args: send, rid: "wq" + w.id }), signal: ac.signal, redirect: "follow" }).then((x) => x.json()).finally(() => clearTimeout(tid));
        if (r && r.ok && r.data && r.data.ok) { st = "done"; result = r.data; }
        else if (r && r.ok && r.data && r.data.ok === false) { st = "error"; result = r.data; err = String(r.data.msg || r.data.error || "refused").slice(0, 300); }
        else if (r && r.ok === false && r.error === "AUTH") { st = "error"; err = "Signed out · sign in and save again"; }
        else if (r && r.ok === false && !BUSY.test(String(r.error || ""))) { st = "error"; err = String(r.error || "refused").slice(0, 300); }
      } catch (_e) { st = "new"; }
    }
    if (st === "new" && hasFile) { st = "error"; err = "Google did not answer · the file was not saved · please save it again"; }
    if (st === "new") return;   // stays busy: writeStatus turns it to "new" after 3 minutes for Google's minute job
    if (result && typeof result === "object") { try { const t = JSON.stringify(result); if (t.length > 20000) result = { ok: result.ok, note: result.note, caseId: result.caseId, msg: result.msg }; } catch (_e) { result = null; } }
    await db.from("writes").update({ status: st, result, error: err || null, done_at: new Date().toISOString(), args: [""].concat(stored.slice(1)) })   // the sign-in is not kept once Google has answered
     .eq("id", w.id).eq("status", "busy");
  })();
  try { (globalThis as any).EdgeRuntime.waitUntil(google); } catch (_e) { await google; }
  return out({ ok: true, queued: true, id: w.id, caseId });
});
