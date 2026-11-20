// CupOfEnglish · coe-review v1 (20 Nov 2026 · 2518) · Performance Improvement Plan and Accountability Review (Annex A)
// Office staff under a Regular Employment Contract (Operations). The President writes; the staff member reads, acknowledges and answers.
// A draft is never shown to the staff member. Nothing here changes pay.
// POST { token, op: "get", staff? }       → { ok, review, items, weeks, ladder, role: "pres" | "staff" }
// President: create { staff, notice } · notice { id, notice } · send { id } · item_add { id, day, cat, title, expected, detail, prior, memo_ref }
//            item_edit { iid, ... } · item_del { iid } · week { id, week, punct, comm, accuracy, collab, note } · decide { id, outcome, note }
// Staff:     read { id } · ack { id } · reply { iid, text } · respond { id, text } · week_note { id, week, note }
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
const cl = (s: unknown, n: number) => String(s == null ? "" : s).replace(/\u0000/g, "").trim().slice(0, n);
const mnlDay = (plus = 0) => new Date(Date.now() + 8 * 3600e3 + plus * 864e5).toISOString().slice(0, 10);
// Annex A · Performance Penalties (regardless of situation) · 3 Jul 2025 Regular Employment Contract
const LADDER: Record<string, { name: string; steps: string[] }> = {
  task: { name: "Poor task management", steps: ["Verbal warning", "Written warning", "Salary deduction and PIP"] },
  comm: { name: "Communication negligence", steps: ["Reminder", "Written warning", "Performance review and salary deduction"] },
  deadline: { name: "Missed deadlines", steps: ["Review and reassignment", "Salary deduction", "PIP and salary deduction"] },
  meeting: { name: "Inadequate meeting support", steps: ["Reminder and corrective action", "Written warning", "Training and review"] },
  data: { name: "Data breach / confidentiality", steps: ["Investigation", "Serious warning and training", "Suspension / legal action"] },
  other: { name: "Other (Clause 5 duties)", steps: ["", "", ""] },
};
const REPEATED = "Repeated violations: termination (Clause 15, after notice, her written answer and a written decision)";
const OUTCOMES: Record<string, string> = { improved: "Closed · improved", extend: "Extended 30 days", warning: "Written warning", further: "Further action under Clause 15" };
Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: s } = await db.from("app_sessions").select("name,mode,role,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
  if (s.mode !== "mgmt") return out({ ok: false, error: "Management only" }, 403);
  const me = String(s.name || ""), pres = /pres/i.test(String(s.role || ""));
  const op = String(b.op || "");
  try {
    const load = async (rv: any) => {
      const { data: I } = await db.from("coe_review_item").select("*").eq("review_id", rv.id).is("gone_at", null).order("day").order("id");
      const n: Record<string, number> = {};
      const items = (I || []).map((x: any) => { const k = x.cat; n[k] = (n[k] || 0) + 1; const L = LADDER[k] || LADDER.other;
        const step = k === "other" ? "" : n[k] <= 3 ? L.steps[n[k] - 1] : REPEATED;
        return { ...x, catName: L.name, occ: n[k], step }; });
      const { data: W } = await db.from("coe_review_week").select("*").eq("review_id", rv.id).order("week");
      return { review: rv, items, weeks: W || [] };
    };
    const getRv = async (id: number) => { const { data } = await db.from("coe_review").select("*").eq("id", id).maybeSingle(); return data; };
    const mine = (rv: any) => rv && rv.staff.toLowerCase() === me.toLowerCase() && rv.status !== "draft";
    if (op === "get") {
      if (pres) { const staff = cl(b.staff || "Celine", 40);
        const { data } = await db.from("coe_review").select("*").ilike("staff", staff).order("id", { ascending: false }).limit(1).maybeSingle();
        return out({ ok: true, role: "pres", ladder: LADDER, outcomes: OUTCOMES, ...(data ? await load(data) : { review: null, items: [], weeks: [] }) }); }
      const { data } = await db.from("coe_review").select("*").ilike("staff", me).neq("status", "draft").order("id", { ascending: false }).limit(1).maybeSingle();
      return out({ ok: true, role: "staff", ladder: LADDER, outcomes: OUTCOMES, ...(data ? await load(data) : { review: null, items: [], weeks: [] }) });
    }
    if (pres) {
      if (op === "create") { const staff = cl(b.staff, 40); if (!staff) return out({ ok: false, error: "Who is it for?" }, 400);
        const { data: open } = await db.from("coe_review").select("id").ilike("staff", staff).neq("status", "closed").limit(1);
        if (open && open.length) return out({ ok: false, error: "There is already an open review for " + staff + "." }, 400);
        const { data, error } = await db.from("coe_review").insert({ staff, notice: cl(b.notice, 6000), created_by: me }).select("*").single(); if (error) throw error;
        return out({ ok: true, ...(await load(data)) }); }
      if (op === "notice") { const rv = await getRv(+b.id); if (!rv || rv.status !== "draft") return out({ ok: false, error: "The notice can only change before it is sent." }, 400);
        await db.from("coe_review").update({ notice: cl(b.notice, 6000) }).eq("id", rv.id); return out({ ok: true, ...(await load(await getRv(rv.id))) }); }
      if (op === "send") { const rv = await getRv(+b.id); if (!rv || rv.status !== "draft") return out({ ok: false, error: "Already sent." }, 400);
        if (!String(rv.notice || "").trim()) return out({ ok: false, error: "Write the notice first." }, 400);
        const { count } = await db.from("coe_review_item").select("id", { count: "exact", head: true }).eq("review_id", rv.id).is("gone_at", null);
        if (!count) return out({ ok: false, error: "Add the documented concerns first. She needs the specific cases to answer." }, 400);
        await db.from("coe_review").update({ status: "sent", sent_at: new Date().toISOString(), response_due: mnlDay(5), ends_at: mnlDay(30) }).eq("id", rv.id);
        return out({ ok: true, ...(await load(await getRv(rv.id))) }); }
      if (op === "item_add" || op === "item_edit") {
        const cat = String(b.cat || ""); if (!LADDER[cat]) return out({ ok: false, error: "Choose the Annex A category." }, 400);
        const day = /^\d{4}-\d{2}-\d{2}$/.test(String(b.day || "")) ? String(b.day) : ""; if (!day) return out({ ok: false, error: "Add the date." }, 400);
        const row = { day, cat, title: cl(b.title, 200), expected: cl(b.expected, 600), detail: cl(b.detail, 2000), prior: !!b.prior, memo_ref: cl(b.memo_ref, 120) || null };
        if (!row.title) return out({ ok: false, error: "Say what happened." }, 400);
        if (op === "item_add") { const rv = await getRv(+b.id); if (!rv || rv.status === "closed") return out({ ok: false, error: "This review is closed." }, 400);
          const { error } = await db.from("coe_review_item").insert({ ...row, review_id: rv.id, created_by: me }); if (error) throw error; return out({ ok: true, ...(await load(rv)) }); }
        const { data: it } = await db.from("coe_review_item").select("review_id").eq("id", +b.iid).maybeSingle(); if (!it) return out({ ok: false, error: "Not found." }, 404);
        await db.from("coe_review_item").update(row).eq("id", +b.iid); return out({ ok: true, ...(await load(await getRv(it.review_id))) }); }
      if (op === "item_del") { const { data: it } = await db.from("coe_review_item").select("review_id").eq("id", +b.iid).maybeSingle(); if (!it) return out({ ok: false, error: "Not found." }, 404);
        await db.from("coe_review_item").update({ gone_at: new Date().toISOString() }).eq("id", +b.iid); return out({ ok: true, ...(await load(await getRv(it.review_id))) }); }
      if (op === "week") { const rv = await getRv(+b.id); if (!rv || rv.status !== "sent") return out({ ok: false, error: "Check-ins start once the review is sent." }, 400);
        const sc = (v: unknown) => { const n = +String(v); return n >= 1 && n <= 4 ? n : null; };
        const row: any = { review_id: rv.id, week: +b.week, punct: sc(b.punct), comm: sc(b.comm), accuracy: sc(b.accuracy), collab: sc(b.collab), note_pres: cl(b.note, 1500), at: new Date().toISOString() };
        if (!(row.week >= 1 && row.week <= 8)) return out({ ok: false, error: "bad week" }, 400);
        const { error } = await db.from("coe_review_week").upsert(row, { onConflict: "review_id,week" }); if (error) throw error; return out({ ok: true, ...(await load(rv)) }); }
      if (op === "decide") { const rv = await getRv(+b.id); if (!rv || rv.status !== "sent") return out({ ok: false, error: "Not open." }, 400);
        const o = String(b.outcome || ""); if (!OUTCOMES[o]) return out({ ok: false, error: "Choose an outcome." }, 400);
        const note = cl(b.note, 3000); if (note.length < 10) return out({ ok: false, error: "Write the reason for the decision. It is shown to her." }, 400);
        const answered = !!rv.response_at, dueGone = rv.response_due && mnlDay() > rv.response_due;
        if ((o === "warning" || o === "further") && !answered && !dueGone) return out({ ok: false, error: "Wait for her written answer, or until " + rv.response_due + " has passed." }, 400);
        if (o === "extend") { if (rv.extended) return out({ ok: false, error: "It was already extended once." }, 400);
          const end = new Date(String(rv.ends_at || mnlDay()) + "T00:00:00Z"); end.setUTCDate(end.getUTCDate() + 30);
          await db.from("coe_review").update({ extended: true, ends_at: end.toISOString().slice(0, 10), outcome: o, outcome_note: note, decided_at: new Date().toISOString() }).eq("id", rv.id); }
        else await db.from("coe_review").update({ status: "closed", outcome: o, outcome_note: note, decided_at: new Date().toISOString() }).eq("id", rv.id);
        return out({ ok: true, ...(await load(await getRv(rv.id))) }); }
      return out({ ok: false, error: "unknown op" }, 400);
    }
    // the staff member
    if (op === "read" || op === "ack") { const rv = await getRv(+b.id); if (!mine(rv)) return out({ ok: false, error: "Not found." }, 404);
      const f = op === "read" ? "read_at" : "ack_at"; if (!rv[f]) await db.from("coe_review").update({ [f]: new Date().toISOString(), ...(op === "ack" && !rv.read_at ? { read_at: new Date().toISOString() } : {}) }).eq("id", rv.id);
      return out({ ok: true, ...(await load(await getRv(rv.id))) }); }
    if (op === "reply") { const { data: it } = await db.from("coe_review_item").select("id,review_id").eq("id", +b.iid).is("gone_at", null).maybeSingle(); const rv = it && await getRv(it.review_id);
      if (!mine(rv) || rv.status !== "sent") return out({ ok: false, error: "Not open." }, 400);
      await db.from("coe_review_item").update({ her_reply: cl(b.text, 2000) || null, replied_at: new Date().toISOString() }).eq("id", it.id); return out({ ok: true, ...(await load(rv)) }); }
    if (op === "respond") { const rv = await getRv(+b.id); if (!mine(rv) || rv.status !== "sent") return out({ ok: false, error: "Not open." }, 400);
      const t = cl(b.text, 6000); if (t.length < 20) return out({ ok: false, error: "Write your answer in full sentences." }, 400);
      await db.from("coe_review").update({ response: t, response_at: new Date().toISOString() }).eq("id", rv.id); return out({ ok: true, ...(await load(await getRv(rv.id))) }); }
    if (op === "week_note") { const rv = await getRv(+b.id); if (!mine(rv) || rv.status !== "sent") return out({ ok: false, error: "Not open." }, 400);
      const wk = +b.week; const { data: w } = await db.from("coe_review_week").select("id").eq("review_id", rv.id).eq("week", wk).maybeSingle(); if (!w) return out({ ok: false, error: "That check-in has not been written yet." }, 400);
      await db.from("coe_review_week").update({ note_staff: cl(b.note, 1500) }).eq("id", w.id); return out({ ok: true, ...(await load(rv)) }); }
    return out({ ok: false, error: pres ? "unknown op" : "Not allowed." }, 403);
  } catch (e) { return out({ ok: false, error: String((e as any)?.message || e).slice(0, 200) }, 500); }
});
