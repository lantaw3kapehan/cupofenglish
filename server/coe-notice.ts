// CupOfEnglish · coe-notice (22 Oct 2026): notice of breach with Explain (Addendum No. 1, Clause 5.1).
// Management sends a notice (usually from a case); the teacher reads it in the app, explains within 5 calendar days with proof and may
// ask for a call; management decides in writing (upheld or waived). Phone alerts come from the coe_notice_notify trigger.
// POST { token, action, ... }
//   list    { teacher?, all? }      → { ok, notices }   (teacher: own; management: all, or one teacher)
//   open    { id }                  → { ok, notice }    (teacher: first opening)
//   explain { id, text, conf, files:[{name,type,b64}] } → { ok, notice }   (teacher, before the decision)
//   file    { id, i }               → { ok, url }       (proof, 10 minutes)
//   new     { n:{teacher,case_id,subject,happened,rule,record,consequence,amount,points,final_notice} } → { ok, notice }  (management)
//   decide  { id, decision: upheld|waived, text } → { ok, notice }   (management)
//   void    { id, reason }          → { ok }            (management: sent by mistake)
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
const str = (x: unknown, n = 200) => String(x == null ? "" : x).trim().slice(0, n);

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
  const get = async (id: number) => { const { data } = await db.from("coe_notices").select("*").eq("id", id).is("void_at", null).maybeSingle(); return data; };
  try {
    if (a === "list") {
      let q = db.from("coe_notices").select("*").is("void_at", null).order("sent_at", { ascending: false }).limit(300);
      if (!mgmt) q = q.eq("teacher", me); else if (b.teacher) q = q.eq("teacher", str(b.teacher, 60));
      const { data, error } = await q; if (error) return out({ ok: false, error: error.message });
      return out({ ok: true, notices: data || [] });
    }
    if (a === "open") {
      const n = await get(+b.id); if (!n || (!mgmt && n.teacher !== me)) return out({ ok: false, error: "Not found" }, 404);
      if (!mgmt && !n.opened_at) await db.from("coe_notices").update({ opened_at: now }).eq("id", n.id);
      return out({ ok: true, notice: await get(n.id) });
    }
    if (a === "explain") {
      if (mgmt) return out({ ok: false, error: "The teacher explains from their own account." }, 403);
      const n = await get(+b.id); if (!n || n.teacher !== me) return out({ ok: false, error: "Not found" }, 404);
      if (n.decided_at) return out({ ok: false, error: "A decision has already been made." });
      const text = str(b.text, 4000); if (text.length < 5) return out({ ok: false, error: "Write your explanation." });
      const files: any[] = Array.isArray(n.files) ? n.files.slice() : [];
      for (const f of (Array.isArray(b.files) ? b.files.slice(0, 5) : [])) {
        const type = str(f.type, 60); if (!/^(application\/pdf|image\/(png|jpeg|webp|heic))$/.test(type)) continue;
        const bin = Uint8Array.from(atob(String(f.b64 || "")), (c) => c.charCodeAt(0)); if (bin.length < 200 || bin.length > 8e6) continue;
        const path = "notices/" + n.id + "/" + Date.now() + "-" + files.length + "." + (type === "application/pdf" ? "pdf" : type.split("/")[1].replace("jpeg", "jpg"));
        const up = await db.storage.from("contracts").upload(path, bin, { contentType: type, upsert: false }); if (!up.error) files.push({ path, name: str(f.name, 120) || path, at: now });
      }
      await db.from("coe_notices").update({ explain: text, explain_at: now, conf_req: !!b.conf, files, opened_at: n.opened_at || now }).eq("id", n.id);
      return out({ ok: true, notice: await get(n.id) });
    }
    if (a === "file") {
      const n = await get(+b.id); if (!n || (!mgmt && n.teacher !== me)) return out({ ok: false, error: "Not found" }, 404);
      const f = (n.files || [])[+b.i]; if (!f) return out({ ok: false, error: "No file" });
      const { data, error } = await db.storage.from("contracts").createSignedUrl(f.path, 600); if (error) return out({ ok: false, error: error.message });
      return out({ ok: true, url: data.signedUrl });
    }
    if (!mgmt) return out({ ok: false, error: "Management only." }, 403);
    if (a === "new") {
      const p = b.n || {}; const teacher = str(p.teacher, 60), subject = str(p.subject, 120);
      if (!teacher || !subject) return out({ ok: false, error: "Choose the teacher and subject." });
      if (p.case_id) { const { data: dup } = await db.from("coe_notices").select("id").eq("case_id", str(p.case_id, 40)).is("void_at", null).limit(1); if (dup && dup.length) return out({ ok: false, error: "A notice was already sent for this case." }); }
      const row = { teacher, case_id: str(p.case_id, 40) || null, subject, happened: str(p.happened, 400), rule: str(p.rule, 1200), record: str(p.record, 2000), consequence: str(p.consequence, 1200),
        amount: +p.amount || 0, points: +p.points || 0, final_notice: !!p.final_notice, sent_by: me, sent_at: now, due_at: new Date(Date.now() + 5 * 864e5).toISOString() };
      const { data, error } = await db.from("coe_notices").insert(row).select("*").single(); if (error) return out({ ok: false, error: error.message });
      return out({ ok: true, notice: data });
    }
    if (a === "decide") {
      const n = await get(+b.id); if (!n) return out({ ok: false, error: "Not found" });
      if (n.decided_at) return out({ ok: false, error: "Already decided." });
      const decision = b.decision === "waived" ? "waived" : "upheld", text = str(b.text, 3000);
      if (text.length < 5) return out({ ok: false, error: "Write the reasons for the decision." });
      if (decision === "upheld" && !n.explain_at && Date.now() < new Date(n.due_at).getTime()) return out({ ok: false, error: "The 5 days to explain have not ended and no explanation was received yet." });
      await db.from("coe_notices").update({ decision, decision_text: text, decided_at: now, decided_by: me }).eq("id", n.id);
      return out({ ok: true, notice: await get(n.id) });
    }
    if (a === "void") {
      const reason = str(b.reason, 300); if (!reason) return out({ ok: false, error: "Give a reason." });
      await db.from("coe_notices").update({ void_at: now, void_by: me, void_reason: reason }).eq("id", +b.id);
      return out({ ok: true });
    }
    return out({ ok: false, error: "unknown action" }, 400);
  } catch (e) { return out({ ok: false, error: String((e as Error)?.message || e) }, 500); }
});
