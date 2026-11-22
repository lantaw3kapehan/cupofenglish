// CupOfEnglish · coe-hw v9 (22 Nov · 2729 where / whereGet: where the class ended and the homework page, per student) · v8 (21 Nov · 2556 trialMark k books) · v7 (19 Nov · 2401 trialSteps, trialMark) · v6 (18 Nov · 2378 bonuses: My bonuses for teachers) · v5 (18 Nov · 2373: kinds writing (Writing correction) and given (Give homework); list { kind? }) · v4 (17 Nov 2026, 2308 · Misty: a screen in class where teachers paste the homework the student sent on WeChat,
// correct it and share it). Used by the Homework check page (homework/index.html).
// POST { token, op, ... }:
//   me                       → { name, role, mgmt }
//   students                 → students this person teaches (classes from 30 days ago to 21 days ahead); management: everyone
//   list   { code }          → this student's saved checks, newest first (pictures as 1-hour links)
//   save   { code, student, class_id, day, kind, title, body, marks, counts, note, note_zh, orig?, marked?, id? } → { id }
//   remove { id }            → removed_at set (kept, never deleted)
// A teacher can only read or save checks for their own students (coe_stupage_owns); management can for everyone.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
const BUCKET = "homework";
function fromDataUrl(u: string): { bytes: Uint8Array; type: string; ext: string } | null {
  const m = /^data:(image\/(png|jpeg|webp));base64,(.+)$/.exec(String(u || ""));
  if (!m) return null;
  const bin = atob(m[3]); const a = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i);
  return { bytes: a, type: m[1], ext: m[2] === "jpeg" ? "jpg" : m[2] };
}
async function put(code: string, u: string): Promise<string | null> {
  const f = fromDataUrl(u); if (!f) return null;
  if (f.bytes.length > 12 * 1024 * 1024) throw new Error("The picture is too big (over 12 MB).");
  const path = code + "/" + crypto.randomUUID() + "." + f.ext;
  const { error } = await db.storage.from(BUCKET).upload(path, f.bytes, { contentType: f.type, upsert: false });
  if (error) throw new Error(error.message);
  return path;
}
async function link(p: string | null) { if (!p) return null; const { data } = await db.storage.from(BUCKET).createSignedUrl(p, 3600); return data ? data.signedUrl : null; }
const clean = (s: unknown, n: number) => String(s == null ? "" : s).slice(0, n);

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
  const owns = async (code: string) => {
    if (!/^ST-\d{4}-\d{3}$/.test(code)) return false; if (mgmt) return true;
    const { data } = await db.rpc("coe_stupage_owns", { p_teacher: name, p_code: code }); return data === true; };
  try {
    if (op === "me") return out({ ok: true, name, role, mgmt });

    if (op === "students") {
      const from = new Date(Date.now() - 30 * 864e5).toISOString(), to = new Date(Date.now() + 21 * 864e5).toISOString();
      const { data, error } = await db.from("classes").select("code,student,teachers,starts_at").gte("starts_at", from).lte("starts_at", to).not("code", "is", null).order("starts_at", { ascending: false }).limit(5000);
      if (error) throw new Error(error.message);
      const me = name.trim().toLowerCase(), seen = new Map<string, any>();
      for (const c of data || []) {
        const code = String(c.code || "").toUpperCase(); if (!/^ST-\d{4}-\d{3}$/.test(code) || seen.has(code)) continue;
        const T = Array.isArray(c.teachers) ? c.teachers.map((x: any) => String(x).trim().toLowerCase()) : [];
        if (!mgmt && !T.includes(me)) continue;
        seen.set(code, { code, student: String(c.student || "").replace(/\s+X$/i, ""), teachers: T });
      }
      const L = [...seen.values()].sort((a, b) => a.student.localeCompare(b.student));
      return out({ ok: true, students: L });
    }

    if (op === "bonuses") {   // v6 (2378, Misty 18 Nov): "My bonuses" · the signed-in teacher's own incentives (enrolment, trial and other recognition) of the last 4 months
      const { data, error } = await db.rpc("coe_rec_rows", { p_tab: "ACTIONS" }); if (error) throw new Error(error.message);
      const since = new Date(Date.now() - 125 * 864e5).toISOString().slice(0, 10), me = name.trim().toLowerCase();
      const L = (data || []).map((x: any) => x.data || []).filter((d: any[]) => String(d[7] || "").trim().toLowerCase() === me && String(d[3] || "").slice(0, 10) >= since && Number(d[15]) > 0)
        .map((d: any[]) => ({ day: String(d[3] || "").slice(0, 10), type: clean(d[6], 40), student: clean(String(d[8] || "").split("\n")[0], 60), code: (String(d[8] || "").match(/ST-\d{4}-\d{3}/) || [""])[0], amount: Number(d[15]) || 0,
          why: clean(String(d[17] || "").replace(/^Automatic:\s*/i, "").replace(/\s*·?\s*via app by [^·]*/gi, "").replace(/\s*·\s*rule \d+/gi, "").replace(/\s*·\s*moved from[^·]*/gi, ""), 220) }))
        .sort((a: any, b2: any) => b2.day.localeCompare(a.day));
      return out({ ok: true, bonuses: L });
    }
    if (op === "trialSteps") {   // v7 (2401, Misty 19 Nov): trial steps ticked from what is recorded (package, classes, email) + shared marks
      if (!mgmt) return out({ ok: false, error: "not allowed" }, 403);
      const codes = (Array.isArray(b.codes) ? b.codes : []).map((x: unknown) => clean(x, 20)).slice(0, 300), labels = (Array.isArray(b.labels) ? b.labels : []).map((x: unknown) => clean(x, 120)).slice(0, 300);
      const { data, error } = await db.rpc("coe_trial_steps", { p_codes: codes, p_labels: labels }); if (error) throw new Error(error.message);
      return out({ ok: true, data });
    }
    if (op === "trialMark") {   // v7 (2401): course plan, CEFR picture, price, welcome copied (on) or "Not sent" (off) · who and when kept
      if (!mgmt) return out({ ok: false, error: "not allowed" }, 403);
      const label = clean(b.label, 120), k = clean(b.k, 20); if (!label || !/^(plan|cefr|price|welcome|books)$/.test(k)) return out({ ok: false, error: "bad request" }, 400);
      if (b.on === false) { await db.from("coe_trial_marks").delete().eq("label", label).eq("k", k); return out({ ok: true }); }
      const row: any = { label, k, by: name }; if (b.at && !isNaN(Date.parse(String(b.at)))) row.at = new Date(String(b.at)).toISOString();
      const { error } = await db.from("coe_trial_marks").upsert(row, { onConflict: "label,k", ignoreDuplicates: !!b.keep }); if (error) throw new Error(error.message);
      return out({ ok: true });
    }
    if (op === "where") {   // v9 (2729, Misty 22 Nov): where the class ended / the homework page, per student, saved by the book reader
      const code = clean(b.code, 20); if (!(await owns(code))) return out({ ok: false, error: "Not your student" }, 403);
      const book = clean(b.book, 40).toUpperCase().replace(/[^A-Z0-9]/g, ""), kind = b.kind === "wb" ? "wb" : "sb", what = b.what === "hw" ? "hw" : "end";
      if (!book) return out({ ok: false, error: "Which book?" }, 400);
      const num = (v: unknown) => { const n = Number(v); return Number.isFinite(n) && n > 0 && n < 2000 ? Math.round(n) : null; };
      const pages = Array.isArray(b.pages) ? (b.pages as unknown[]).map(num).filter((x): x is number => x != null).slice(0, 20) : null;
      const row = { code, book, kind, what, day: new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10), page: num(b.page), unit: num(b.unit), pages, teacher: name, at: new Date().toISOString() };
      const { error } = await db.from("coe_book_where").upsert(row, { onConflict: "code,book,kind,what,day" }); if (error) throw new Error(error.message);
      return out({ ok: true });
    }
    if (op === "whereGet") {   // v9: the latest records for a student (last 30 days, newest first)
      const code = clean(b.code, 20); if (!(await owns(code))) return out({ ok: false, error: "Not your student" }, 403);
      const since = new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10);
      const { data, error } = await db.from("coe_book_where").select("book,kind,what,day,page,unit,pages,teacher,at").eq("code", code).gte("day", since).order("at", { ascending: false }).limit(40);
      if (error) throw new Error(error.message); return out({ ok: true, rows: data || [] });
    }
    if (op === "ids") {   // v4 (2319): which classes already have a saved check (class card shows "Homework checked")
      const since = new Date(Date.now() - 21 * 864e5).toISOString();
      let q = db.from("coe_hw_checks").select("class_id,code,created_at").gte("created_at", since).is("removed_at", null).not("class_id", "is", null).limit(2000);
      if (!mgmt) q = q.ilike("teacher", name);
      const { data, error } = await q; if (error) throw new Error(error.message);
      return out({ ok: true, ids: [...new Set((data || []).map((r: any) => r.class_id))] });
    }
    if (op === "list") {
      const code = String(b.code || "").toUpperCase(); if (!(await owns(code))) return out({ ok: false, error: "Not your student" }, 403);
      let lq = db.from("coe_hw_checks").select("*").eq("code", code).is("removed_at", null); if (b.kind) lq = lq.eq("kind", String(b.kind)); const { data, error } = await lq.order("created_at", { ascending: false }).limit(b.kind ? 40 : 20);
      if (error) throw new Error(error.message);
      const paths = [...new Set((data || []).flatMap((r: any) => [r.img_orig, r.img_marked]).filter(Boolean))] as string[], U: Record<string, string> = {};
      if (paths.length) { const { data: S } = await db.storage.from(BUCKET).createSignedUrls(paths, 3600); (S || []).forEach((x: any) => { if (x && x.path && x.signedUrl) U[x.path] = x.signedUrl; }); }   // one call for all pictures
      const L = (data || []).map((r: any) => ({ ...r, img_orig_url: U[r.img_orig] || null, img_marked_url: U[r.img_marked] || null }));
      return out({ ok: true, checks: L });
    }

    if (op === "save") {
      const code = String(b.code || "").toUpperCase(); if (!(await owns(code))) return out({ ok: false, error: "Not your student" }, 403);
      const kind = ["picture", "writing", "given"].includes(String(b.kind)) ? String(b.kind) : "text";
      const row: any = { code, student: clean(b.student, 80), teacher: clean(b.teacher || name, 60), class_id: clean(b.class_id, 120) || null,
        day: /^\d{4}-\d{2}-\d{2}$/.test(String(b.day || "")) ? b.day : null, kind, title: clean(b.title, 160), body: clean(b.body, 60000),
        marks: Array.isArray(b.marks) ? b.marks.slice(0, 500) : [], counts: b.counts && typeof b.counts === "object" ? b.counts : {},
        note: clean(b.note, 2000), note_zh: clean(b.note_zh, 2000), by_name: role === 'Teacher' ? 'Teacher ' + name.charAt(0).toUpperCase() + name.slice(1) : role === 'President' ? 'Management' : name, updated_at: new Date().toISOString() };
      if (b.orig) row.img_orig = await put(code, b.orig);
      if (b.marked) row.img_marked = await put(code, b.marked);
      if (b.id) {
        const { data: old } = await db.from("coe_hw_checks").select("id,code").eq("id", +b.id).maybeSingle();
        if (!old || old.code !== code) return out({ ok: false, error: "Not found" }, 404);
        const { error } = await db.from("coe_hw_checks").update(row).eq("id", +b.id); if (error) throw new Error(error.message);
        return out({ ok: true, id: +b.id });
      }
      const { data, error } = await db.from("coe_hw_checks").insert(row).select("id").single(); if (error) throw new Error(error.message);
      return out({ ok: true, id: data.id });
    }

    if (op === "remove") {
      const { data: old } = await db.from("coe_hw_checks").select("id,code,by_name").eq("id", +b.id).maybeSingle();
      if (!old || !(await owns(old.code))) return out({ ok: false, error: "Not found" }, 404);
      const { error } = await db.from("coe_hw_checks").update({ removed_at: new Date().toISOString() }).eq("id", +b.id); if (error) throw new Error(error.message);
      return out({ ok: true });
    }
    return out({ ok: false, error: "unknown op" }, 400);
  } catch (e) { return out({ ok: false, error: String((e as Error).message || e).slice(0, 200) }, 500); }
});
