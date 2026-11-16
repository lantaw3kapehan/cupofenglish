// CupOfEnglish · coe-books (16 Nov 2026 · 2270 · Misty: "let us do all"): extras for the Books screens.
// POST (text/plain JSON) { op, token | stoken, ... }
//   log      { token, kind, id, title, book, student }   staff: a book file was opened (pdf / audio / video)
//   opens    { token, days? }                            management: who opened what (last N days, ≤ 60)
//   gaps     { token }                                   management: per book, how many student books / workbooks / audio / video
//   hwGet    { token, code, day }                        staff: the listening homework set for a class
//   hwSet    { token, code, day, book, files:[{id,title}] }  staff: set it (empty list removes it)
//   stuHw    { stoken }                                  student portal: the family's listening homework (last 120 days)
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...CORS, "Content-Type": "application/json" } });
const clip = (s: unknown, n: number) => String(s ?? "").slice(0, n);
async function staff(token: string) { if (!token || token.length < 16) return null;
  const { data: s } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
  return s && new Date(s.exp).getTime() > Date.now() ? s : null; }
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const op = String(b.op || "");
  try {
    if (op === "stuHw") {
      const t = String(b.stoken || ""); if (t.length < 16) return out({ ok: false, error: "AUTH" }, 401);
      const { data: ss } = await db.from("student_sessions").select("code,exp").eq("token_hash", await sha(t)).maybeSingle();
      if (!ss || new Date(ss.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
      const since = new Date(Date.now() - 120 * 864e5).toISOString().slice(0, 10);
      const { data } = await db.from("coe_hw_audio").select("day,teacher,book,files").eq("code", ss.code).gte("day", since).order("day", { ascending: false });
      return out({ ok: true, list: (data || []).filter((x: any) => (x.files || []).length) });
    }
    const s = await staff(String(b.token || "")); if (!s) return out({ ok: false, error: "AUTH" }, 401);
    const mgr = s.mode === "mgmt";
    if (op === "log") {
      await db.from("coe_book_opens").insert({ who: clip(s.name, 60), mode: clip(s.mode, 20), kind: clip(b.kind, 10), file_id: clip(b.id, 80), title: clip(b.title, 160), book: clip(b.book, 80), student: clip(b.student, 80) });
      return out({ ok: true });
    }
    if (op === "opens") { if (!mgr) return out({ ok: false, error: "management only" }, 403);
      const days = Math.min(60, Math.max(1, +b.days || 14));
      const { data } = await db.from("coe_book_opens").select("at,who,mode,kind,title,book,student").gte("at", new Date(Date.now() - days * 864e5).toISOString()).order("at", { ascending: false }).limit(2000);
      return out({ ok: true, rows: data || [] });
    }
    if (op === "gaps") { if (!mgr) return out({ ok: false, error: "management only" }, 403);
      const { data: c } = await db.from("docs").select("data").eq("key", "books:gaps").maybeSingle();   // refreshed every hour (cron coe-book-gaps)
      const { data: sc } = await db.from("coe_book_files").select("seen_at").order("seen_at", { ascending: false }).limit(1);
      return out({ ok: true, books: (c && c.data && c.data.books) || [], at: c && c.data ? c.data.at : null, scanned: sc && sc[0] ? sc[0].seen_at : null });
    }
    if (op === "meta") {   // 2279: the reader needs a file's size and whether our copy is ready (for page-by-page loading)
      const id = clip(b.id, 80); const { data: f } = await db.from("coe_book_files").select("size,mime").eq("id", id).maybeSingle();
      const { data: m } = await db.from("coe_media_mirror").select("done_at").eq("id", id).maybeSingle();
      return out({ ok: !!f, size: f ? f.size : null, copied: !!(m && m.done_at) });
    }
    const code = clip(b.code, 20).toUpperCase(), day = clip(b.day, 10);
    if (op === "hwGet" || op === "hwSet") { if (!/^ST-\d{4}-\d{3}$/.test(code) || !/^\d{4}-\d{2}-\d{2}$/.test(day)) return out({ ok: false, error: "code/day" }, 400); }
    if (op === "hwGet") { const { data } = await db.from("coe_hw_audio").select("files,teacher,book,updated_at").eq("code", code).eq("day", day).maybeSingle(); return out({ ok: true, hw: data || null }); }
    if (op === "hwSet") {
      const files = (Array.isArray(b.files) ? b.files : []).slice(0, 40).map((f: any) => ({ id: clip(f.id, 80), title: clip(f.title, 120) })).filter((f: any) => /^[A-Za-z0-9_-]{10,80}$/.test(f.id));
      if (!files.length) { await db.from("coe_hw_audio").delete().eq("code", code).eq("day", day); return out({ ok: true, removed: true }); }
      const { data: ok } = await db.from("coe_book_files").select("id").in("id", files.map((f: any) => f.id)).like("mime", "audio/%");
      const good = new Set((ok || []).map((x: any) => x.id)), keep = files.filter((f: any) => good.has(f.id));
      const { error } = await db.from("coe_hw_audio").upsert({ code, day, teacher: clip(s.name, 60), book: clip(b.book, 80), files: keep, updated_at: new Date().toISOString() }, { onConflict: "code,day" });
      return out({ ok: !error, n: keep.length, error: error ? error.message : undefined });
    }
    return out({ ok: false, error: "Unknown op" }, 400);
  } catch (e) { return out({ ok: false, error: String((e as Error).message || e) }, 500); }
});
