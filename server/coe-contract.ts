// CupOfEnglish · coe-contract (22 Oct 2026): My Contract — the Agreement, Annex A and Addendum No. 1 in the app,
// read, signed in the app (the original, RA 8792), countersigned by the President, notarized scan attached.
// POST { token, action, ... }
//   my        { teacher? }                → { ok, docs, rows, people, me }      (teacher: own; management: any teacher)
//   open      { doc_id }                  → { ok, row }                          (first opening: time + IP)
//   sign      { doc_id, typed_name, sig, loc, hash } → { ok, row }               (hash = SHA-256 of the text shown)
//   respond   { doc_id, kind: question|declined, note } → { ok, row }
//   record    { id }                      → { ok, row, doc }                     (full record with signatures, for printing)
//   scan_url  { id }                      → { ok, url }                          (notarized scan, 10 minutes)
//   list      {}                          → { ok, docs, teachers, rows, people } (management)
//   reply     { id, reply }               → { ok }                               (management answers a question)
//   countersign { id, sig, loc }          → { ok, row }                          (President)
//   send_set  { teacher }                 → { ok }                               (President: full set for a new teacher)
//   paper     { teacher, ref, date }      → { ok }                               (President: signed on paper before the app)
//   people_set { teacher, p }             → { ok }                               (President: legal name, address… for the Agreement)
//   scan_put  { id, name, type, b64 }     → { ok, row }                          (President: notarized scan)
//   void      { id, reason }              → { ok }                               (President: start this document again)
//   doc_text  { id, find, replace }       → { ok, hash }                         (President: fix wording before anyone signs)
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
const str = (x: unknown, n = 200) => String(x == null ? "" : x).trim().slice(0, n);
const LIGHT = "id,teacher,doc_id,sent_at,sent_by,due_at,opened_at,status,note,note_at,reply,reply_at,reply_by,signed_at,typed_name,ip,loc,filled_hash,pres_at,pres_name,pres_ip,pres_loc,scan_name,scan_at,paper_date,void_at";
const peso = (n: number) => (Math.round(n * 100) / 100).toFixed(2);
const MON = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const longDay = (d: string) => { const m = String(d || "").match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? +m[3] + " " + MON[+m[2] - 1] + " " + m[1] : String(d || ""); };
function fill(body: string, p: any) {
  const r50 = +(p && p.rate50) || 150;
  const v: Record<string, string> = {
    legal_name: str(p && p.legal_name, 120) || "__________________",
    civil_status: str(p && p.civil_status, 40) || "__________",
    citizenship: str(p && p.citizenship, 40) || "Filipino",
    address: str(p && p.address, 300) || "__________________________",
    agreement_date: p && p.agreement_date ? longDay(p.agreement_date) : "the date of the Independent Contractor's signature in the App",
    rate50: peso(r50), rate25: peso(r50 / 2),
  };
  return body.replace(/\{\{(\w+)\}\}/g, (_, k) => (k in v ? v[k] : ""));
}

Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: s } = await db.from("app_sessions").select("name,role,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
  const mgmt = s.mode === "mgmt", pres = mgmt && /president/i.test(String(s.role || ""));
  const me = String(s.name || "");
  const ip = str((req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip") || (req.headers.get("x-forwarded-for") || "").split(",")[0]), 60);
  const ua = str(req.headers.get("user-agent"), 300);
  const a = String(b.action || "");
  const now = new Date().toISOString();
  const onlyPres = () => out({ ok: false, error: "Only the President can do this." }, 403);

  async function docs() { const { data } = await db.from("coe_contract_docs").select("id,kind,ref,version,title,short,body,sort,needs_sign,for_existing,in_new_set,published_at,respond_days").not("published_at", "is", null).order("sort"); return data || []; }
  async function people(t: string) { const { data } = await db.from("coe_contract_people").select("*").eq("teacher", t).maybeSingle(); return data; }
  async function ensure(t: string, ds: any[]) {   // a published update reaches every current teacher by itself
    const { data: have } = await db.from("coe_contract_signs").select("doc_id").eq("teacher", t);
    const got = new Set((have || []).map((x: any) => x.doc_id));
    const add = ds.filter((d) => d.for_existing && d.needs_sign && !got.has(d.id)).map((d) => ({ teacher: t, doc_id: d.id, sent_at: d.published_at, sent_by: "CupOfEnglish", due_at: new Date(new Date(d.published_at).getTime() + d.respond_days * 864e5).toISOString() }));
    if (add.length) await db.from("coe_contract_signs").upsert(add, { onConflict: "teacher,doc_id", ignoreDuplicates: true });
  }
  async function rowFor(t: string, docId: number) { const { data } = await db.from("coe_contract_signs").select(LIGHT).eq("teacher", t).eq("doc_id", docId).is("void_at", null).maybeSingle(); return data; }
  async function filled(t: string, docId: number) { const ds = await docs(); const d = ds.find((x: any) => x.id === docId); if (!d) return null; const p = await people(t); const body = fill(d.body, p); return { d, body, hash: await sha(body) }; }
  async function teachers() { const { data } = await db.from("auth_users").select("name,role,code").eq("role", "Teacher").order("name"); return (data || []).map((x: any) => ({ name: x.name, code: x.code })); }

  try {
    if (a === "my") {
      const t = mgmt && b.teacher ? str(b.teacher, 60) : me;
      if (!mgmt && !t) return out({ ok: false, error: "AUTH" }, 401);
      const ds = await docs();
      if (!mgmt) await ensure(t, ds);
      const p = await people(t);
      const { data: rows } = await db.from("coe_contract_signs").select(LIGHT).eq("teacher", t).is("void_at", null);
      const mine = new Set((rows || []).map((r: any) => r.doc_id));
      const list = await Promise.all(ds.filter((d: any) => !d.needs_sign || mine.has(d.id) || d.kind === "agreement" || d.kind === "annex_a").map(async (d: any) => { const body = fill(d.body, p); return { id: d.id, kind: d.kind, ref: d.ref, version: d.version, title: d.title, short: d.short, body, hash: await sha(body), needs_sign: d.needs_sign, sort: d.sort, published_at: d.published_at }; }));
      return out({ ok: true, teacher: t, docs: list, rows: rows || [], people: p ? { legal_name: p.legal_name, agreement_date: p.agreement_date } : null });
    }
    if (a === "open") {
      const id = +b.doc_id; const r = await rowFor(me, id); if (!r) return out({ ok: true, row: null });
      if (!r.opened_at) { await db.from("coe_contract_signs").update({ opened_at: now, open_ip: ip, open_ua: ua, status: r.status === "sent" ? "opened" : r.status }).eq("id", r.id); }
      return out({ ok: true, row: await rowFor(me, id) });
    }
    if (a === "sign") {
      if (mgmt) return out({ ok: false, error: "Teachers sign from their own account." }, 403);
      const id = +b.doc_id; const r = await rowFor(me, id); if (!r) return out({ ok: false, error: "This document was not sent to you." });
      if (r.status === "signed" || r.status === "paper") return out({ ok: true, row: r, already: true });
      const f = await filled(me, id); if (!f) return out({ ok: false, error: "Document not found" });
      if (str(b.hash, 80) !== f.hash) return out({ ok: false, error: "The text changed while you were reading. Close and open it again, then sign." });
      const name = str(b.typed_name, 120); if (name.length < 4 || !/\s/.test(name)) return out({ ok: false, error: "Type your full name, as in your Agreement." });
      const sig = String(b.sig || ""); if (!/^data:image\/png;base64,/.test(sig) || sig.length < 800 || sig.length > 250000) return out({ ok: false, error: "Draw your signature in the box." });
      const loc = b.loc && typeof b.loc === "object" ? { lat: +b.loc.lat || null, lng: +b.loc.lng || null, acc: +b.loc.acc || null, place: str(b.loc.place, 160) || null, allowed: !!b.loc.allowed } : { allowed: false };
      await db.from("coe_contract_signs").update({ status: "signed", signed_at: now, typed_name: name, sig, ip, ua, loc, body_hash: f.hash, filled_hash: f.hash, opened_at: r.opened_at || now }).eq("id", r.id);
      return out({ ok: true, row: await rowFor(me, id) });
    }
    if (a === "respond") {
      const id = +b.doc_id; const r = await rowFor(me, id); if (!r) return out({ ok: false, error: "This document was not sent to you." });
      if (r.status === "signed") return out({ ok: false, error: "Already signed." });
      const kind = b.kind === "declined" ? "declined" : "question"; const note = str(b.note, 2000); if (!note) return out({ ok: false, error: "Write your question or reason." });
      await db.from("coe_contract_signs").update({ status: kind, note, note_at: now, opened_at: r.opened_at || now }).eq("id", r.id);
      return out({ ok: true, row: await rowFor(me, id) });
    }
    if (a === "record") {
      const { data: r } = await db.from("coe_contract_signs").select("*").eq("id", +b.id).maybeSingle();
      if (!r || (!mgmt && r.teacher !== me)) return out({ ok: false, error: "Not found" }, 404);
      const f = await filled(r.teacher, r.doc_id);
      return out({ ok: true, row: r, doc: f ? { title: f.d.title, version: f.d.version, ref: f.d.ref, body: f.body, hash: f.hash } : null });
    }
    if (a === "scan_url") {
      const { data: r } = await db.from("coe_contract_signs").select("teacher,scan_path").eq("id", +b.id).maybeSingle();
      if (!r || !r.scan_path || (!mgmt && r.teacher !== me)) return out({ ok: false, error: "No scan yet" });
      const { data, error } = await db.storage.from("contracts").createSignedUrl(r.scan_path, 600);
      if (error) return out({ ok: false, error: error.message });
      return out({ ok: true, url: data.signedUrl });
    }
    if (!mgmt) return out({ ok: false, error: "Management only." }, 403);
    if (a === "list") {
      const [ds, ts] = await Promise.all([docs(), teachers()]);
      for (const t of ts) await ensure(t.name, ds);
      const [{ data: rows }, { data: ps }] = await Promise.all([db.from("coe_contract_signs").select(LIGHT).is("void_at", null), db.from("coe_contract_people").select("*")]);
      return out({ ok: true, pres, docs: ds.map((d: any) => ({ id: d.id, kind: d.kind, ref: d.ref, title: d.title, short: d.short, version: d.version, needs_sign: d.needs_sign, in_new_set: d.in_new_set, sort: d.sort })), teachers: ts, rows: rows || [], people: ps || [] });
    }
    if (a === "reply") {
      const reply = str(b.reply, 2000); if (!reply) return out({ ok: false, error: "Write a reply." });
      await db.from("coe_contract_signs").update({ reply, reply_at: now, reply_by: me }).eq("id", +b.id);
      return out({ ok: true });
    }
    if (!pres) return onlyPres();
    if (a === "countersign") {
      const { data: r } = await db.from("coe_contract_signs").select(LIGHT).eq("id", +b.id).maybeSingle();
      if (!r || r.status !== "signed") return out({ ok: false, error: "The teacher has not signed yet." });
      const sig = String(b.sig || ""); if (!/^data:image\/png;base64,/.test(sig) || sig.length < 800 || sig.length > 250000) return out({ ok: false, error: "Draw your signature in the box." });
      const loc = b.loc && typeof b.loc === "object" ? { lat: +b.loc.lat || null, lng: +b.loc.lng || null, acc: +b.loc.acc || null, place: str(b.loc.place, 160) || null, allowed: !!b.loc.allowed } : { allowed: false };
      await db.from("coe_contract_signs").update({ pres_at: now, pres_name: str(b.name, 120) || "Misty T. Dagyapen", pres_sig: sig, pres_ip: ip, pres_ua: ua, pres_loc: loc }).eq("id", r.id);
      const { data: r2 } = await db.from("coe_contract_signs").select(LIGHT).eq("id", r.id).maybeSingle();
      return out({ ok: true, row: r2 });
    }
    if (a === "send_set") {
      const t = str(b.teacher, 60); if (!t) return out({ ok: false, error: "Pick a teacher" });
      const ds = (await docs()).filter((d: any) => d.in_new_set && d.needs_sign);
      const rows = ds.map((d: any) => ({ teacher: t, doc_id: d.id, sent_at: now, sent_by: me, due_at: new Date(Date.now() + d.respond_days * 864e5).toISOString() }));
      await db.from("coe_contract_signs").upsert(rows, { onConflict: "teacher,doc_id", ignoreDuplicates: true });
      return out({ ok: true, sent: rows.length });
    }
    if (a === "paper") {
      const t = str(b.teacher, 60), ref = str(b.ref, 40), day = str(b.date, 10);
      const { data: d } = await db.from("coe_contract_docs").select("id").eq("ref", ref).not("published_at", "is", null).order("id", { ascending: false }).limit(1).maybeSingle();
      if (!t || !d) return out({ ok: false, error: "Teacher or document not found" });
      await db.from("coe_contract_signs").upsert({ teacher: t, doc_id: d.id, sent_at: now, sent_by: me, status: "paper", paper_date: day || null, signed_at: day ? day + "T00:00:00+08:00" : now }, { onConflict: "teacher,doc_id" });
      return out({ ok: true });
    }
    if (a === "people_set") {
      const t = str(b.teacher, 60), p = b.p || {}; if (!t) return out({ ok: false, error: "Pick a teacher" });
      await db.from("coe_contract_people").upsert({ teacher: t, legal_name: str(p.legal_name, 120) || null, civil_status: str(p.civil_status, 40) || null, citizenship: str(p.citizenship, 40) || "Filipino", address: str(p.address, 300) || null, agreement_date: str(p.agreement_date, 10) || null, rate50: +p.rate50 || null, updated_by: me, updated_at: now });
      return out({ ok: true });
    }
    if (a === "scan_put") {
      const { data: r } = await db.from("coe_contract_signs").select("id,teacher,doc_id").eq("id", +b.id).maybeSingle(); if (!r) return out({ ok: false, error: "Not found" });
      const type = str(b.type, 60) || "application/pdf"; if (!/^(application\/pdf|image\/(png|jpeg|webp|heic))$/.test(type)) return out({ ok: false, error: "Use a PDF or a photo." });
      const bin = Uint8Array.from(atob(String(b.b64 || "")), (c) => c.charCodeAt(0)); if (bin.length < 1000 || bin.length > 15e6) return out({ ok: false, error: "The file is empty or larger than 15 MB." });
      const ext = type === "application/pdf" ? "pdf" : type.split("/")[1].replace("jpeg", "jpg");
      const path = r.teacher.replace(/[^\w-]/g, "_") + "/" + r.doc_id + "-" + Date.now() + "." + ext;
      const up = await db.storage.from("contracts").upload(path, bin, { contentType: type, upsert: false }); if (up.error) return out({ ok: false, error: up.error.message });
      await db.from("coe_contract_signs").update({ scan_path: path, scan_name: str(b.name, 160) || path, scan_at: now, scan_by: me }).eq("id", r.id);
      return out({ ok: true });
    }
    if (a === "doc_text") {   // President: correct a document's wording before anyone has signed it (refused once someone has)
      const id = +b.id, find = String(b.find || ""), rep = String(b.replace || "");
      const { data: d } = await db.from("coe_contract_docs").select("id,body").eq("id", id).maybeSingle(); if (!d) return out({ ok: false, error: "Not found" });
      const { data: signed } = await db.from("coe_contract_signs").select("id").eq("doc_id", id).in("status", ["signed"]).is("void_at", null).limit(1);
      if (signed && signed.length) return out({ ok: false, error: "Someone has already signed this version. Issue a new version instead." });
      const n = find ? d.body.split(find).length - 1 : 0; if (n !== 1) return out({ ok: false, error: "The text to change was found " + n + " times (needs exactly 1)." });
      const body = d.body.replace(find, () => rep);
      const { error } = await db.from("coe_contract_docs").update({ body, hash: await sha(body) }).eq("id", id); if (error) return out({ ok: false, error: error.message });
      return out({ ok: true, hash: await sha(body) });
    }
    if (a === "void") {
      const reason = str(b.reason, 300); if (!reason) return out({ ok: false, error: "Give a reason." });
      const { data: r } = await db.from("coe_contract_signs").select("*").eq("id", +b.id).maybeSingle(); if (!r) return out({ ok: false, error: "Not found" });
      // keep the old record: move it aside under a new id, then reset the row so the teacher can sign again
      await db.from("coe_contract_signs").update({ void_at: now, void_by: me, void_reason: reason, teacher: r.teacher + "#void" + Date.now() }).eq("id", r.id);
      await db.from("coe_contract_signs").insert({ teacher: r.teacher, doc_id: r.doc_id, sent_at: now, sent_by: me, due_at: new Date(Date.now() + 14 * 864e5).toISOString() });
      return out({ ok: true });
    }
    return out({ ok: false, error: "unknown action" }, 400);
  } catch (e) { return out({ ok: false, error: String((e as Error)?.message || e) }, 500); }
});
