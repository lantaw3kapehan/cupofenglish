// CupOfEnglish · coe-ops v28 (21 Nov · 2640 pkgfirst) · v27 (21 Nov · 2638 decnotes, decreply) · v26 (21 Nov · 2637 presmark, marks in presdec) · v25 (21 Nov · 2630 presdec) · v24 (21 Nov · 2609 clsbylist, clsby) · v23 (21 Nov · 2588 validity review: valrev, valset) · v20 (20 Nov · 2524 log kind "sent") · v19 (20 Nov · 2522 lessonfix: "left" flag; a correction closes open reports about the student) · v14 (19 Nov · 2456 lessonfix: management's lesson count for one month) · v13 (19 Nov · 2453 resolve {lid}: President solves a problem from her log) · v12 (18 Nov · 2377 System reminders on the President card) · v11 (18 Nov · 2375 teachers waiting, 2376 weekly summary in deskday) · v10 (18 Nov · 2360 chain of command: report types, answer, myreports, seenans, eod) · v9 (18 Nov · 2344 op me: her own Overview) · v8 (18 Nov · 2341 Ops Desk: desk, log, done, report, deskday, resolve, watch) · v7 (13 Nov · op finov: Operations' Finance overview, counts only, coe_ops_finov) · v6 (13 Nov · ok also takes tfu: / tagain: · trial follow-up gaps) · v5 (13 Nov · ok also takes risk: · students at risk, "Called ✓") · v4 (13 Nov · "Done today" on renewals and "It's the LAN cable" on pictures were refused: ok now takes renew: and shot:) · v3 (2099 · op invemail: a parent email that came late, on the payment confirmation and the student) · v2 (2093 · precheck also returns the booked classes { first, last, n, lessons }; no "no package" flag on a first enrolment) · v1 (11 Nov 2026, 2091 · Misty: Operations "always makes mistakes with details … I want her to be productive").
// Management only (Operations and President). Teachers get "Management only".
// POST { token, op: "check" }                        → { ok, items: [{ kind, ref, text, go }], at }   the daily database check (coe_ops_check)
// POST { token, op: "ok", ref }                      → { ok }   "It's correct": this item never comes back (coe_ops_ok)
// POST { token, op: "precheck", code?, invoice, partner, pkg, free }
//                                                    → { ok, student: { code, name, source }, last, partnerHint, flags: [text] }   the check card before a payment save
// POST { token, op: "week", who? }                   → { ok, week }   Operations' week (coe_ops_week); the President gets the Operations staff
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
const AG = /(?:Mr|Ms|Mrs|Dr)\.\s*([A-Za-z]+)/i;
const invName = (s: string) => { const p = String(s || "").split("_"); const t = (p.length > 1 ? p.slice(1).join(" ") : "").replace(/\.pdf$/i, "").replace(/[^A-Za-z ]/g, " ").replace(/\s+/g, " ").trim(); return t; };
// v10 (2360): reports with their answers · open = not resolved (Management view) / last 14 days (Operations view)
async function thread(who: string, days: number, openOnly: boolean, withSystem = false) {
  const since = new Date(Date.now() - days * 864e5).toISOString();
  const { data: R } = await (withSystem ? db.from("coe_ops_log").select("id,at,title,note,data,who").or("who.ilike." + who + ",who.eq.System") : db.from("coe_ops_log").select("id,at,title,note,data,who").ilike("who", who)).eq("kind", "report").gte("at", since).order("at", { ascending: false }).limit(40);
  const ids = (R || []).map((x: any) => "rep:" + x.id); if (!ids.length) return [];
  const { data: A } = await db.from("coe_ops_log").select("id,at,kind,ref,note,data,by_name").in("ref", ids).in("kind", ["answered", "resolved", "seenans"]).order("at");
  const by: Record<string, any[]> = {}; (A || []).forEach((x: any) => { (by[x.ref] = by[x.ref] || []).push(x); });
  const rows = await Promise.all((R || []).map(async (x: any) => { const L = by["rep:" + x.id] || [], ans = L.filter((y: any) => y.kind === "answered"), res = L.find((y: any) => y.kind === "resolved"), seen = L.filter((y: any) => y.kind === "seenans").pop();
    const last = ans[ans.length - 1]; let img = null; if (x.data && x.data.img) { const { data: su } = await db.storage.from("ops").createSignedUrl(x.data.img, 3600); img = su && su.signedUrl; }
    return { id: x.id, at: x.at, where: (x.who === "System" ? "System · " : "") + x.title, what: x.note, who: x.data && x.data.who, img, type: (x.data && x.data.type) || "problem", urgent: !!(x.data && x.data.urgent),
      answers: ans.map((y: any) => ({ at: y.at, text: y.note, decision: y.data && y.data.decision, by: y.by_name })), resolved: res ? { at: res.at, note: res.note } : null,
      unread: !!last && (!seen || seen.at < last.at) }; }));
  const rank = (x: any) => (x.urgent ? 0 : 2) + ({ decision: 0, concern: 1, problem: 2, fyi: 3 } as any)[x.type];
  return (openOnly ? rows.filter((x) => !x.resolved) : rows).sort((a: any, b: any) => openOnly ? rank(a) - rank(b) || String(b.at).localeCompare(String(a.at)) : String(b.at).localeCompare(String(a.at)));
}
// v17 (2482): coe_ops_queue (0.85 s) and coe_ops_checks (1.36 s) were run on every Ops Desk / From Operations refresh (every 20 s, two screens).
//   The same answer is reused for 15 s inside this server; what she has done is still read fresh each time (coe_ops_log), so a Done shows at once.
const MEMO = new Map<string, { at: number; p: Promise<any> }>();
function memo(k: string, f: () => Promise<any>, ttl = 15000) { const h = MEMO.get(k); if (h && Date.now() - h.at < ttl) return h.p;
  const p = f().then((r: any) => { if (r && r.error) MEMO.delete(k); return r; }, (e: any) => { MEMO.delete(k); throw e; }); MEMO.set(k, { at: Date.now(), p }); return p; }
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
  // v23 (21 Nov · 2588, audit QA-07): validity review. valrev → every review row (latest first); valset { code, dl, kind, new_date?, note }
  //   records one. Operations may record 'review'; the decisions (extend · exception · date_error) are the President's. Nothing else changes.
  // v24 (21 Nov · 2609, Misty "easy to check there, and simple"): cancelled classes with no "who asked" (last 45 days) · clsby { id, who } sets it
  if (op === "clsbylist") {
    const { data, error } = await db.rpc("coe_cls_by_missing"); if (error) return out({ ok: false, error: "db" }, 500);
    return out({ ok: true, rows: data || [] });
  }
  if (op === "clsby") {
    const id = String(b.id || "").slice(0, 200), who = String(b.who || "");
    if (!id || !["parent", "teacher", "company"].includes(who)) return out({ ok: false, error: "Choose who asked." });
    const { error: e1 } = await db.from("coe_class_who").upsert({ id, field: "by", who, at: new Date().toISOString() }, { onConflict: "id,field" });
    if (e1) return out({ ok: false, error: "Not saved. Try again." }, 500);
    const { data: c } = await db.from("classes").select("data").eq("id", id).maybeSingle();
    if (c) await db.from("classes").update({ data: { ...(c.data || {}), by: who } }).eq("id", id);
    return out({ ok: true });
  }
  if (op === "valrev") {
    const { data, error } = await db.from("coe_validity_review").select("code,dl,kind,new_date,note,by_name,at").order("at", { ascending: false }).limit(2000);
    if (error) return out({ ok: false, error: "db" }, 500);
    return out({ ok: true, rows: data || [] });
  }
  if (op === "valset") {
    const code = String(b.code || "").trim().toUpperCase(), dl = String(b.dl || "").slice(0, 10), kind = String(b.kind || ""), nd = String(b.new_date || "").slice(0, 10), note = String(b.note || "").trim().slice(0, 500);
    if (!/^ST-\d{4}-\d{3}$/.test(code) || !/^\d{4}-\d{2}-\d{2}$/.test(dl)) return out({ ok: false, error: "Open it from the student." });
    if (!["review", "extend", "exception", "date_error"].includes(kind)) return out({ ok: false, error: "Choose what to record." });
    if (kind !== "review" && !pres) return out({ ok: false, error: "Only the President approves. Record it as a review and the President decides." });
    if ((kind === "extend" || kind === "date_error") && !/^\d{4}-\d{2}-\d{2}$/.test(nd)) return out({ ok: false, error: "Choose the date." });
    if (note.length < 3) return out({ ok: false, error: "Write the reason (it is kept with the record)." });
    const { error } = await db.from("coe_validity_review").insert({ code, dl, kind, new_date: kind === "extend" || kind === "date_error" ? nd : null, note, by_name: me });
    if (error) return out({ ok: false, error: "Not saved. Try again." }, 500);
    return out({ ok: true });
  }
  if (op === "check") {
    const [r1, r2] = await Promise.all([db.rpc("coe_ops_check"), db.rpc("coe_ops_check2")]);   // 2910: + cancellation pictures for classes still on, teachers booked twice
    if (r1.error) return out({ ok: false, error: "db" }, 500);
    const data: any = r1.data, more = (!r2.error && r2.data && (r2.data as any).items) || [];
    return out({ ok: true, items: more.concat((data && data.items) || []), at: data && data.at });
  }
  if (op === "ok") {
    const ref = String(b.ref || "").slice(0, 120); if (!/^(sale|dbl|nt|shot|renew|risk|tfu|tagain|vidkeep|fm|cxp|tdbl):/.test(ref))   /* v21 (2539): vidkeep = a late-video case reviewed, penalty kept */ return out({ ok: false, error: "not allowed" }, 400);
    const { error } = await db.from("coe_ops_ok").upsert({ ref, by_name: me, at: new Date().toISOString() }, { onConflict: "ref" });
    if (error) return out({ ok: false, error: "not saved" }, 500);
    return out({ ok: true });
  }
  if (op === "finov") {   // v7 (2181)
    const { data, error } = await db.rpc("coe_ops_finov");
    if (error) return out({ ok: false, error: "db" }, 500);
    return out({ ok: true, data });
  }
  if (op === "precheck") {
    const code = String(b.code || "").toUpperCase().match(/ST-\d{4}-\d{3}/)?.[0] || "";
    const inv = invName(String(b.invoice || "")), partner = String(b.partner || "").trim();
    let pk: any = null;
    if (code) { const { data } = await db.from("coe_packages").select("code,name,source,buy").is("removed_at", null).ilike("code", code).order("buy", { ascending: false }).limit(1); pk = (data || [])[0] || null; }
    else if (inv) { const { data } = await db.from("coe_packages").select("code,name,source,buy").is("removed_at", null).ilike("name", inv).order("buy", { ascending: false }).limit(5);
      const codes = new Set((data || []).map((x: any) => String(x.code).toUpperCase())); pk = codes.size === 1 ? data![0] : null;
      if (codes.size > 1) return out({ ok: true, student: null, flags: [codes.size + " students are called " + inv + " (" + [...codes].join(", ") + "). Check this is the right one."], last: null, partnerHint: "" }); }
    if (!pk && code) {   // v2: a first enrolment has no package yet: name and referral come from the student record
      const { data: sr } = await db.from("coe_students").select("data").ilike("code", code).is("removed_at", null).limit(6);
      const r = (sr || []).map((x: any) => x.data || []).find((d: any) => d[2] && !/#ERROR/.test(String(d[2])) && d[22] && !/#ERROR/.test(String(d[22])));
      if (r) pk = { code, name: String(r[2]), source: String(r[22]).replace(/^Partner\s*[–-]\s*/i, ""), buy: null };
    }
    const flags: string[] = [];
    if (!pk && !code && inv) flags.push("No student package found for " + inv + ". Check the name and code.");   // v2: with a code and no package yet, it is a first enrolment: nothing to flag
    let classes: any = null;   // v2 (2093): the classes already booked from today, so the form's first class matches the calendar
    if (code) { const t0 = new Date(Date.now() + 8 * 3600e3); t0.setUTCHours(0, 0, 0, 0); const since = new Date(t0.getTime() - 8 * 3600e3).toISOString();
      const { data: cl } = await db.from("classes").select("starts_at,ends_at,data").ilike("code", code).eq("cancelled", false).gte("starts_at", since).order("starts_at").limit(400);
      const L = (cl || []).filter((c: any) => { const d = c.data || {}; return !/^TC$/i.test(String(d.type || d.kind || "")) && !/-TC$/i.test(String(d.title || "").replace(/\s+X$/, "")); });
      const md = (x: string) => new Date(new Date(x).getTime() + 8 * 3600e3).toISOString().slice(0, 10);
      const mins = L.reduce((a: number, c: any) => a + Math.max(0, Math.round((new Date(c.ends_at).getTime() - new Date(c.starts_at).getTime()) / 6e4)), 0);
      if (L.length) classes = { first: md(L[0].starts_at), last: md(L[L.length - 1].starts_at), n: L.length, lessons: Math.round(mins / 50 * 10) / 10 }; }
    let last: any = null, partnerHint = "";
    if (pk) {
      const nm = String(pk.name || "");
      if (inv && nm && inv.toLowerCase() !== nm.toLowerCase() && !inv.toLowerCase().includes(nm.toLowerCase())) flags.push("The invoice says " + inv + ", but this student is " + nm + " (" + pk.code + ").");
      const ag = (String(pk.source || "").match(AG) || [])[1] || "";
      if (ag) {
        const { data: ps } = await db.from("coe_sales").select("partner").is("removed_at", null).ilike("partner", "%" + ag + "%").order("day", { ascending: false }).limit(20);
        const cnt: Record<string, number> = {}; for (const r of ps || []) { const p = String(r.partner || ""); if (p) cnt[p] = (cnt[p] || 0) + 1; }
        partnerHint = Object.keys(cnt).sort((a, c) => cnt[c] - cnt[a])[0] || "";
        if (partner && !new RegExp("\\b" + ag + "\\b", "i").test(partner)) flags.push(nm + " came through " + pk.source + ", but the partner here is \"" + partner + "\".");
        if (!partner) flags.push(nm + " came through " + pk.source + ". Choose that partner.");
      } else if (partner && AG.test(partner)) flags.push(nm + " came through " + (pk.source || "no partner") + ", but the partner here is \"" + partner + "\".");
      const { data: ls } = pk.buy ? await db.from("coe_sales").select("day,pkg,free,partner,php").is("removed_at", null).ilike("invoice", "%\\_" + nm + "%").order("day", { ascending: false }).limit(1) : { data: [] as any[] };   // v2: no "last time" on a first enrolment
      last = (ls || [])[0] || null;
      const pkg = Number(b.pkg || 0), free = Number(b.free || 0);
      if (last && pkg && (Number(last.pkg) !== pkg || Number(last.free || 0) !== free)) flags.push("Last time " + nm + " paid for " + last.pkg + (Number(last.free) ? " + " + last.free : "") + " lessons. This time it is " + pkg + (free ? " + " + free : "") + ".");
    }
    return out({ ok: true, student: pk ? { code: pk.code, name: pk.name, source: pk.source } : null, last, partnerHint, flags, classes });
  }
  if (op === "invemail") {   // v3 (2099): a parent's email that came late: saved on the payment confirmation and on the student (coe_bill_profiles), then the app emails it
    const no = Number(b.no || 0), em = String(b.email || "").trim().toLowerCase().slice(0, 120);
    if (!(no > 0) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) return out({ ok: false, error: "The email address looks wrong." });
    const { data: inv, error } = await db.from("coe_invoices").update({ email: em }).eq("no", no).neq("status", "void").select("no,code,email").maybeSingle();
    if (error || !inv) return out({ ok: false, error: "not saved" }, 500);
    const code = String(inv.code || "");
    if (/^ST-\d{4}-\d{3}$/.test(code)) {
      const { data: ex } = await db.from("coe_bill_profiles").select("code,email").eq("code", code).maybeSingle();
      if (!ex) await db.from("coe_bill_profiles").insert({ code, email: em, updated_by: me });
      else if (!ex.email) await db.from("coe_bill_profiles").update({ email: em, updated_by: me, updated_at: new Date().toISOString() }).eq("code", code);
    }
    return out({ ok: true, email: em });
  }
  if (op === "week") {
    let who = [me];
    if (pres) { const { data } = await db.from("app_sessions").select("name").eq("mode", "mgmt").ilike("role", "operations"); who = [...new Set((data || []).map((x: any) => String(x.name || "")).filter((n) => n && !/^(zz|claude)/i.test(n)))]; }
    const weeks = []; for (const w of who.slice(0, 3)) { const { data } = await db.rpc("coe_ops_week", { p_who: w }); if (data) weeks.push(data); }
    const { data: ck } = await db.rpc("coe_ops_check");
    return out({ ok: true, weeks, open: (ck && ck.n) || 0 });
  }
  // ── 2341 · Ops Desk (Misty 18 Nov) ─────────────────────────────────────────────────────────────
  //   desk                         → { queue, checks, day, watch }   Operations' prioritized queue + spot-checks + her day + repeated mistakes
  //   log { kind, ref, title, note } → { ok, day }                   match | problem | fixed | messaging | skip | nudge
  //   done { ref, title }          → { ok, cleared, item? }          checked again at once: cleared, or still found (with what is still wrong)
  //   report { where, what, who, img? } → { ok, id }                 a problem for Management (screenshot in the private bucket "ops")
  //   deskday { who? }  (President) → { ok, day, reports, watch }      Operations' day + open reports + repeated mistakes
  //   resolve { id, note } (President) · watch_add { who, text } (President) · watch_del { id } (President)
  const today = () => new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10);
  const str = (x: unknown, n = 300) => String(x == null ? "" : x).trim().slice(0, n);
  const opsName = async () => { const { data } = await db.from("app_sessions").select("name").eq("mode", "mgmt").ilike("role", "operations").order("exp", { ascending: false }).limit(1); return (data && data[0] && data[0].name) || "Celine"; };
  const watchOf = async (who: string) => { const { data } = await db.from("coe_ops_watch").select("id,text,times,last_at").ilike("who", who).is("gone_at", null).order("times", { ascending: false }).limit(12); return data || []; };
  if (op === "me") {   // 2344: Operations' own Overview
    const [M, D, W] = await Promise.all([db.rpc("coe_ops_me", { p_who: me }), db.rpc("coe_ops_day", { p_who: me }), watchOf(me)]);
    if (M.error) return out({ ok: false, error: "db" }, 500);
    return out({ ok: true, me: M.data || {}, day: D.data || {}, watch: W });
  }
  if (op === "desk") {
    const [Q, C, D, W] = await Promise.all([memo("q", () => db.rpc("coe_ops_queue")), memo("c:" + me.toLowerCase(), () => db.rpc("coe_ops_checks", { p_who: me })), db.rpc("coe_ops_day", { p_who: me }), watchOf(me)]);
    if (Q.error) return out({ ok: false, error: "db", why: Q.error.message }, 500);
    const { data: sk } = await db.from("coe_ops_log").select("ref").ilike("who", me).eq("day", today()).in("kind", ["skip", "cleared", "match", "fixed"]);
    const hide = new Set((sk || []).map((x: any) => x.ref));
    return out({ ok: true, queue: (Q.data || []).filter((x: any) => !hide.has(x.ref)), checks: C.data || {}, day: D.data || {}, watch: W, done: [...hide], now: new Date().toISOString() });
  }
  if (op === "log") {
    const kind = str(b.kind, 20); if (!/^(match|problem|fixed|messaging|skip|nudge|sent)$/.test(kind))   // v20 (2524): sent = a Lesson Summary shared with a parent after the numbers check
      return out({ ok: false, error: "not allowed" }, 400);
    const { error } = await db.from("coe_ops_log").insert({ who: me, kind, ref: str(b.ref, 160) || null, title: str(b.title, 200) || null, note: str(b.note, 1000) || null });
    if (error) return out({ ok: false, error: "not saved" }, 500);
    const { data: D } = await db.rpc("coe_ops_day", { p_who: me }); return out({ ok: true, day: D });
  }
  if (op === "done") {
    const ref = str(b.ref, 160); if (!ref) return out({ ok: false, error: "no ref" }, 400);
    const { data: Q } = await db.rpc("coe_ops_queue"); const still = (Q || []).find((x: any) => x.ref === ref);
    await db.from("coe_ops_log").insert({ who: me, kind: still ? "still" : "cleared", ref, title: str(b.title, 200) || (still && still.title) || null, note: still ? str(still.sub, 300) : null });
    const { data: D } = await db.rpc("coe_ops_day", { p_who: me });
    return out({ ok: true, cleared: !still, item: still || null, day: D });
  }
  if (op === "firstmonth") {   // v18 (2484): packages whose first month also counts lessons from before the start (payment) date · Operations checks each and saves it with lessonfix
    const { data, error } = await memo("fm", () => db.rpc("coe_firstmonth_check"), 60000); if (error) return out({ ok: false, error: "db" }, 500);
    // v22 (2544, Misty 19:59 "these are all correct but no option"): rows management marked "It's right" (coe_ops_ok ref fm:<code>|<yyyy-mm>) leave the list
    const { data: okd } = await db.from("coe_ops_ok").select("ref").like("ref", "fm:%"); const OK = new Set((okd || []).map((x: any) => String(x.ref).slice(3)));
    return out({ ok: true, rows: (data || []).filter((x: any) => !OK.has(String(x.code) + "|" + String(x.ym))) });
  }
  if (op === "lessonfix") {   // v14 (2456): management sets a student's lesson count for one month (Chenyu March 1.5) · v null = back to the sheet's count
    const code = str(b.code, 20).toUpperCase(), ym = str(b.ym, 7); if (!/^ST-\d{4}-\d{3}$/.test(code) || !/^\d{4}-\d{2}$/.test(ym)) return out({ ok: false, error: "bad student or month" }, 400);
    const v = b.v === null || b.v === "" ? null : Number(b.v); if (v !== null && (!isFinite(v) || v < 0 || v > 60 || Math.round(v * 2) !== v * 2)) return out({ ok: false, error: "Use halves only, e.g. 1.5" }, 400);
    const was = Number(b.was), note = str(b.note, 300); if (v !== null && note.length < 4) return out({ ok: false, error: "Write why (e.g. only count from 15 Mar)." }, 400);
    const { data: d0 } = await db.from("docs").select("data").eq("key", "sys:lessonfix").maybeSingle(); const D = (d0 && d0.data) || { fix: {}, log: [] }; D.fix = D.fix || {}; D.log = D.log || [];
    MEMO.delete("fm"); const k = code + "|" + ym, at = new Date().toISOString();
    if (v === null) delete D.fix[k]; else D.fix[k] = { v, was: isFinite(was) ? was : (D.fix[k] && D.fix[k].was), note, by: me, at, ...(b.left ? { left: true } : {}) };   // v19 (2522): left = these lessons were never counted, so Lessons left goes down too
    D.log.unshift({ k, v, was: isFinite(was) ? was : null, note, by: me, at }); D.log = D.log.slice(0, 300);
    const { error } = await db.from("docs").upsert({ key: "sys:lessonfix", scope: "mgmt", data: D, updated_at: at }, { onConflict: "key" }); if (error) return out({ ok: false, error: "not saved" }, 500);
    if (v !== null) { try {   // v19 (2522): a correction closes the open reports / problems about this student
      const ML = ["January","February","March","April","May","June","July","August","September","October","November","December"], mon = ML[+ym.slice(5, 7) - 1] + " " + ym.slice(0, 4);
      const { data: L } = await db.from("coe_ops_log").select("id,who,kind,title").in("kind", ["report", "problem"]).gte("at", new Date(Date.now() - 60 * 864e5).toISOString()).or("title.ilike.%" + code + "%,note.ilike.%" + code + "%");
      for (const x of (L || []) as any[]) { const ref = (x.kind === "report" ? "rep:" : "log:") + x.id;
        const { data: R0 } = await db.from("coe_ops_log").select("id").eq("ref", ref).eq("kind", "resolved").limit(1); if (R0 && R0.length) continue;
        await db.from("coe_ops_log").insert({ who: x.who, kind: "resolved", ref, title: x.title, note: "Corrected in Correct a month: " + mon + " = " + v + " (was " + (isFinite(was) ? was : "?") + ") · " + note, by_name: me }); } } catch (_e) { /* the correction itself is saved */ } }
    return out({ ok: true, fix: D.fix[k] || null });
  }
  if (op === "report") {
    const what = str(b.what, 2000); if (what.length < 5) return out({ ok: false, error: "Write what is wrong." }, 400);
    let img = ""; const raw = String(b.img || "");
    if (raw && raw.length < 8_000_000) { try { const bin = Uint8Array.from(atob(raw.replace(/^data:image\/\w+;base64,/, "")), (c) => c.charCodeAt(0));
      const { data: bk } = await db.storage.getBucket("ops"); if (!bk) await db.storage.createBucket("ops", { public: false });
      const path = today() + "/" + me.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now() + ".png";
      const { error: ue } = await db.storage.from("ops").upload(path, bin, { contentType: "image/png" }); if (!ue) img = path; } catch (_e) { /* the report still goes in */ } }
    const type = /^(decision|concern|problem|fyi)$/.test(str(b.type, 12)) ? str(b.type, 12) : "problem";   // v10 (2360): chain of command · what kind of report
    const { data, error } = await db.from("coe_ops_log").insert({ who: me, kind: b.fixed ? "fixed" : "report", ref: "report", title: str(b.where, 120) || "App", note: what,
      data: { who: str(b.who, 60), img: img || null, fixedByMe: !!b.fixed, type, urgent: !!b.urgent } }).select("id").single();
    if (error) return out({ ok: false, error: "not saved" }, 500);
    return out({ ok: true, id: data.id });
  }
  // v10 (2360, Misty 18 Nov "an efficient and effective chain of command"): Operations → Management and back
  if (op === "eod") {   // Operations: end-of-shift report (her day, what is left, what needs Management)
    const left = str(b.left, 2000), need = str(b.need, 2000), notes = str(b.notes, 2000);
    const [D, Q] = await Promise.all([db.rpc("coe_ops_day", { p_who: me }), db.rpc("coe_ops_queue")]);
    const q = (Q.data || []) as any[], d: any = D.data || {};
    const summary = { done: d.done || 0, found: d.found || 0, fixed: d.fixed || 0, saves: d.saves || 0, idle: d.idle || 0, timein: d.timein || null,
      open: q.length, urgent: q.filter((x: any) => x.tier <= 2).map((x: any) => x.title).slice(0, 8) };
    const { data, error } = await db.from("coe_ops_log").insert({ who: me, kind: "eod", ref: "eod", title: "End of shift", note: [left && "Left for tomorrow: " + left, need && "Needs Management: " + need, notes && "Notes: " + notes].filter(Boolean).join("\n") || null,
      data: { summary, left, need, notes } }).select("id").single();
    if (error) return out({ ok: false, error: "not saved" }, 500);
    return out({ ok: true, id: data.id, summary });
  }
  if (op === "myreports" || op === "seenans") {   // Operations: her reports and Management's answers
    if (op === "seenans") { const id = Number(b.id) || 0; if (id) await db.from("coe_ops_log").insert({ who: me, kind: "seenans", ref: "rep:" + id }); return out({ ok: true }); }
    return out({ ok: true, reports: await thread(me, 14, false) });
  }
  if (op === "answer") {   // the President answers a report: reply · approve / decline · resolve
    if (!pres) return out({ ok: false, error: "Management only" }, 403);
    const id = Number(b.id) || 0, text = str(b.text, 1000), dec = /^(approved|declined)$/.test(str(b.decision, 10)) ? str(b.decision, 10) : "";
    if (!id || (!text && !dec && !b.close)) return out({ ok: false, error: "Write an answer." }, 400);
    const { data: R } = await db.from("coe_ops_log").select("id,who").eq("id", id).maybeSingle(); if (!R) return out({ ok: false, error: "Not found" }, 404);
    if (text || dec) await db.from("coe_ops_log").insert({ who: me, kind: "answered", ref: "rep:" + id, note: text || null, data: { decision: dec || null, to: R.who }, by_name: me });
    if (b.close) await db.from("coe_ops_log").insert({ who: R.who, kind: "resolved", ref: "rep:" + id, note: text || null, by_name: me });
    return out({ ok: true });
  }
  if (op === "presdec") {   // v25 (2630, Misty 21 Nov): For your decision · what only the President can decide
    if (!pres) return out({ ok: false, error: "President only" }, 403);
    const [{ data, error }, M] = await Promise.all([db.rpc("coe_pres_decisions"), db.from("docs").select("data").eq("key", "pres:decisions").maybeSingle()]);
    if (error) return out({ ok: false, error: "Not loaded. Try again." }, 500);
    return out({ ok: true, ...(data || {}), marks: (M.data && M.data.data && M.data.data.marks) || {} });
  }
  if (op === "pkgfirst") {   // v28 (2640, Misty 17:35 "the 36 packages are on Celine to check"): older packages whose first class came well after buying
    const { data, error } = await db.rpc("coe_pkg_first_check"); if (error) return out({ ok: false, error: "Not loaded. Try again." }, 500);
    return out({ ok: true, rows: data || [] });
  }
  if (op === "decnotes" || op === "decreply") {   // v27 (2638, Misty 17:05 "in sync with Celine, instant communication"): the President's follow-ups reach Operations; she replies or marks done
    const { data: cur } = await db.from("docs").select("data").eq("key", "pres:decisions").maybeSingle();
    const marks: Record<string, any> = { ...((cur && cur.data && cur.data.marks) || {}) };
    if (op === "decreply") { const k = str(b.k, 80), m = marks[k]; if (!m) return out({ ok: false, error: "This follow-up was closed." }, 404);
      const text = str(b.text, 500); if (!text && !b.done) return out({ ok: false, error: "Write a reply." }, 400);
      if (text) { m.reply = text; m.replyAt = new Date().toISOString(); m.replyBy = me; } if (b.done) { m.opsDone = true; m.opsDoneAt = new Date().toISOString(); m.opsDoneBy = me; }
      const { error } = await db.from("docs").upsert({ key: "pres:decisions", scope: "mgmt", data: { marks }, updated_at: new Date().toISOString() }, { onConflict: "key" }); if (error) return out({ ok: false, error: "Not saved. Try again." }, 500); }
    const L = Object.keys(marks).map((k) => ({ k, ...marks[k] })).filter((x: any) => x.st === "followed" && (!x.opsDone || Date.now() - Date.parse(x.opsDoneAt || x.at) < 864e5)).sort((a: any, b: any) => String(b.at).localeCompare(String(a.at)));
    return out({ ok: true, notes: L });
  }
  if (op === "presmark") {   // v26 (2637, Misty 17:03): For your decision · "Followed up" (waiting) or "Done" on one item, kept until the item changes
    if (!pres) return out({ ok: false, error: "President only" }, 403);
    const k = str(b.k, 80), st = str(b.st, 12); if (!k || !/^(followed|done|)$/.test(st)) return out({ ok: false, error: "bad request" }, 400);
    const { data: cur } = await db.from("docs").select("data").eq("key", "pres:decisions").maybeSingle();
    const marks: Record<string, any> = { ...((cur && cur.data && cur.data.marks) || {}) };
    if (!st) delete marks[k]; else marks[k] = { st, sig: str(b.sig, 300), note: str(b.note, 300), t: str(b.t, 120), s: str(b.s, 300), at: new Date().toISOString(), by: me };
    for (const x of Object.keys(marks)) if (Date.now() - Date.parse(marks[x].at) > 30 * 864e5) delete marks[x];   // a mark is forgotten after 30 days
    const { error } = await db.from("docs").upsert({ key: "pres:decisions", scope: "mgmt", data: { marks }, updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (error) return out({ ok: false, error: "Not saved. Try again." }, 500);
    return out({ ok: true, marks });
  }
  if (op === "deskday" || op === "resolve" || op === "watch_add" || op === "watch_del") {
    if (!pres) return out({ ok: false, error: "Management only" }, 403);
    if (op === "resolve" && Number(b.lid)) { const lid = Number(b.lid);   // v13 (2453): the President marks a problem Operations found as solved
      const { data: L } = await db.from("coe_ops_log").select("who,title").eq("id", lid).maybeSingle(); if (!L) return out({ ok: false, error: "Not found." }, 404);
      const { error: re } = await db.from("coe_ops_log").insert({ who: L.who, kind: "resolved", ref: "log:" + lid, title: L.title, note: str(b.note, 500) || null, by_name: me }); if (re) return out({ ok: false, error: "Not saved. Try again." }, 500); return out({ ok: true }); }
    if (op === "resolve") { const id = Number(b.id) || 0; await db.from("coe_ops_log").insert({ who: str(b.who, 60) || "Operations", kind: "resolved", ref: "rep:" + id, note: str(b.note, 500) || null, by_name: me }); return out({ ok: true }); }
    if (op === "watch_add") { const who = str(b.who, 60) || await opsName(), text = str(b.text, 300); if (text.length < 4) return out({ ok: false, error: "Write the mistake." }, 400);
      const { data: ex } = await db.from("coe_ops_watch").select("id,times").ilike("who", who).ilike("text", text).is("gone_at", null).maybeSingle();
      if (ex) await db.from("coe_ops_watch").update({ times: ex.times + 1, last_at: new Date().toISOString(), by_name: me }).eq("id", ex.id);
      else await db.from("coe_ops_watch").insert({ who, text, by_name: me });
      return out({ ok: true, watch: await watchOf(who) }); }
    if (op === "watch_del") { await db.from("coe_ops_watch").update({ gone_at: new Date().toISOString() }).eq("id", Number(b.id) || 0); return out({ ok: true }); }
    const who = str(b.who, 60) || await opsName(), day = /^\d{4}-\d{2}-\d{2}$/.test(str(b.day, 10)) ? str(b.day, 10) : null;
    const [D, reports, W, E, TW, WK] = await Promise.all([db.rpc("coe_ops_day", { p_who: who, p_day: day }), thread(who, 14, true, true), watchOf(who),
      db.from("coe_ops_log").select("id,at,note,data").ilike("who", who).eq("kind", "eod").gte("at", new Date(Date.now() - 3 * 864e5).toISOString()).order("at", { ascending: false }).limit(3),
      db.rpc("coe_teacher_waiting", { p_days: 5 }), db.rpc("coe_ops_weekly", { p_who: who })]);   // v11 (2375): teachers waiting · (2376) the week
    const eod = (E.data || []).map((x: any) => ({ id: x.id, at: x.at, note: x.note, ...(x.data || {}) }));
    let todo: number | null = null;   // v16 (2474): her list still to do today, counted the same way as her Ops Desk (queue + spot-checks left)
    if (!day) { try {
      const [Q, C, S] = await Promise.all([memo("q", () => db.rpc("coe_ops_queue")), memo("c:" + who.toLowerCase(), () => db.rpc("coe_ops_checks", { p_who: who })),
        db.from("coe_ops_log").select("ref").ilike("who", who).eq("day", today()).in("kind", ["skip", "cleared", "match", "fixed"])]);
      const sk = new Set((S.data || []).map((x: any) => x.ref)), hide = new Set(sk); ((D.data || {}).log || []).forEach((l: any) => { if (l.ref) hide.add(l.ref); });
      const c: any = C.data || {}; let left = 0; for (const k of ["summaries", "videos", "notes"]) for (const x of (c[k] || [])) if (!hide.has(x.ref)) left++;
      todo = (Q.data || []).filter((x: any) => !sk.has(x.ref)).length + left; } catch (_e) { todo = null; } }
    return out({ ok: true, who, day: D.data || {}, reports, eod, watch: W, waiting: TW.data || [], week: WK.error ? null : WK.data, todo });
  }
  return out({ ok: false, error: "unknown op" }, 400);
});
