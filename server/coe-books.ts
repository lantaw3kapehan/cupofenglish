// CupOfEnglish · coe-books (16 Nov 2026 · 2270 · Misty: "let us do all"): extras for the Books screens.
// POST (text/plain JSON) { op, token | stoken, ... }
//   log      { token, kind, id, title, book, student }   staff: a book file was opened (pdf / audio / video)
//   opens    { token, days? }                            management: who opened what (last N days, ≤ 60)
//   gaps     { token }                                   management: per book, how many student books / workbooks / audio / video
//   hwGet    { token, code, day }                        staff: the listening homework set for a class
//   hwSet    { token, code, day, book, files:[{id,title}] }  staff: set it (empty list removes it)
//   stuHw    { stoken }                                  student portal: the family's listening homework (last 120 days) · v7 (2379): + work (writing feedback, homework pictures)
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
  if (op === "ping") return out({ ok: true });   // v8 (20 Nov): the app's 9 s warm-up ping got 400 (~500 a day)
  try {
    if (op === "stuHw") {
      const t = String(b.stoken || ""); if (t.length < 16) return out({ ok: false, error: "AUTH" }, 401);
      const { data: ss } = await db.from("student_sessions").select("code,exp").eq("token_hash", await sha(t)).maybeSingle();
      if (!ss || new Date(ss.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
      const since = new Date(Date.now() - 120 * 864e5).toISOString().slice(0, 10);
      const { data } = await db.from("coe_hw_audio").select("day,teacher,book,files").eq("code", ss.code).gte("day", since).order("day", { ascending: false });
      // 2379 (Misty 18 Nov, "parent portal shows writing feedback and homework pictures"): checked homework, writing feedback and homework given, with the marked picture
      const { data: W } = await db.from("coe_hw_checks").select("id,day,kind,title,teacher,note,note_zh,counts,img_marked").eq("code", ss.code).is("removed_at", null).neq("portal", false)
        .in("kind", ["writing", "given", "picture"]).not("img_marked", "is", null).gte("day", since).order("day", { ascending: false }).order("id", { ascending: false }).limit(30);
      const P = [...new Set((W || []).map((x: any) => x.img_marked).filter(Boolean))] as string[], U: Record<string, string> = {};
      if (P.length) { const { data: S } = await db.storage.from("homework").createSignedUrls(P, 6 * 3600); (S || []).forEach((x: any) => { if (x && x.path && x.signedUrl) U[x.path] = x.signedUrl; }); }
      const work = (W || []).filter((x: any) => U[x.img_marked]).map((x: any) => { const c = x.counts || {}; return { id: x.id, day: x.day, kind: x.kind, title: x.title || "", teacher: x.teacher || "", note: x.note || "", note_zh: x.note_zh || "",
        overall: c.overall ?? null, words: c.words ?? null, url: U[x.img_marked] }; });
      return out({ ok: true, list: (data || []).filter((x: any) => (x.files || []).length), work });
    }
    const s = await staff(String(b.token || "")); if (!s) return out({ ok: false, error: "AUTH" }, 401);
    const mgr = s.mode === "mgmt";
    if (op === "log") {
      await db.from("coe_book_opens").insert({ who: clip(s.name, 60), mode: clip(s.mode, 20), kind: clip(b.kind, 10), file_id: clip(b.id, 80), title: clip(b.title, 160), book: clip(b.book, 80), student: clip(b.student, 80) });
      return out({ ok: true });
    }
    if (op === "fail") {   // v9 (2547): a book that did not open, or opened only after a slow fallback → kept for Operations
      const n = clip(b.outcome, 20); if (!["failed", "fallback", "slow"].includes(n)) return out({ ok: false, error: "outcome" }, 400);
      const { error: fe } = await db.from("coe_book_fail").insert({ who: clip(s.name, 60), mode: clip(s.mode, 20), file_id: clip(b.id, 80), book: clip(b.book, 80), title: clip(b.title, 160), outcome: n, step: clip(b.step, 40), error: clip(b.error, 200), secs: Math.min(9999, Math.max(0, +b.secs || 0)), net: clip(b.net, 60) });
      if (fe) throw new Error(fe.message);
      return out({ ok: true });
    }
    if (op === "fails") { if (!mgr) return out({ ok: false, error: "management only" }, 403);
      const h = Math.min(168, Math.max(1, +b.hours || 24));
      const { data } = await db.from("coe_book_fail").select("at,who,book,title,outcome,step,error,secs").gte("at", new Date(Date.now() - h * 36e5).toISOString()).order("at", { ascending: false }).limit(200);
      return out({ ok: true, rows: data || [] });
    }
    if (op === "opens") { if (!mgr) return out({ ok: false, error: "management only" }, 403);
      const days = Math.min(60, Math.max(1, +b.days || 14));
      const { data } = await db.from("coe_book_opens").select("at,who,mode,kind,title,book,student").gte("at", new Date(Date.now() - days * 864e5).toISOString()).order("at", { ascending: false }).limit(2000);
      return out({ ok: true, rows: data || [] });
    }
    if (op === "coverFiles") { if (!mgr) return out({ ok: false, error: "management only" }, 403);   // 2321: the Student Book / Workbook PDFs of a book, from our copies (no Google)
      const code = String(b.code || "").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 40); if (!code) return out({ ok: false, error: "no book" }, 400);
      const pat = code.split("").join("%");   // the database gives at most 1000 rows: ask only for names / folders that start with the book code
      const { data } = await db.from("coe_book_files").select("id,name,path,size").is("gone_at", null).eq("mime", "application/pdf").or(`name.ilike.${pat}%,path.ilike.%${pat}`).limit(1000);
      const n = (x: string) => String(x || "").toLowerCase().replace(/[^a-z0-9]/g, "");
      const L = (data || []).filter((f: any) => { const nm = n(f.name), pa = n(String(f.path || "").split("/").pop() || "");
        if (/unit|test|teacher|guide|answer|key|lesson|flashcard/.test(nm)) return false;
        return nm.startsWith(code) || pa === code; });
      const ids = L.map((f: any) => f.id); const { data: M } = ids.length ? await db.from("coe_media_mirror").select("id,obj").in("id", ids).not("done_at", "is", null) : { data: [] } as any;
      const mo: Record<string, string> = {}; (M || []).forEach((x: any) => { mo[x.id] = x.obj; });
      const pick = (re: RegExp) => { const c = L.filter((f: any) => re.test(n(f.name)) && mo[f.id]).sort((a: any, z: any) => (a.size || 0) - (z.size || 0)); return c[0] ? { id: c[0].id, name: c[0].name, obj: mo[c[0].id] } : null; };
      return out({ ok: true, sb: pick(/student|pupil|sb(?!x)|coursebook/), wb: pick(/workbook|activity|wb/) });
    }
    if (op === "gaps") { if (!mgr) return out({ ok: false, error: "management only" }, 403);
      const { data: c } = await db.from("docs").select("data").eq("key", "books:gaps").maybeSingle();   // refreshed every hour (cron coe-book-gaps)
      const { data: sc } = await db.from("coe_book_files").select("seen_at").order("seen_at", { ascending: false }).limit(1);
      return out({ ok: true, books: (c && c.data && c.data.books) || [], at: c && c.data ? c.data.at : null, scanned: sc && sc[0] ? sc[0].seen_at : null });
    }
    if (op === "meta") {   // 2279: the reader needs a file's size and whether our copy is ready (for page-by-page loading)
      const id = clip(b.id, 80); const { data: f } = await db.from("coe_book_files").select("size,mime").eq("id", id).maybeSingle();
      const { data: m } = await db.from("coe_media_mirror").select("done_at").eq("id", id).maybeSingle();
      // 2281: not copied yet → a lighter "_APP COPIES" twin that is copied opens instead (same book, same name)
      if (f && !(m && m.done_at)) { const { data: me } = await db.from("coe_book_files").select("path,name").eq("id", id).maybeSingle();
        if (me) { const { data: tw } = await db.from("coe_book_files").select("id,size").eq("name", me.name).eq("path", "_APP COPIES / " + me.path).is("gone_at", null).limit(1);
          const t = tw && tw[0]; if (t) { const { data: tm } = await db.from("coe_media_mirror").select("done_at").eq("id", t.id).maybeSingle();
            if (tm && tm.done_at) return out({ ok: true, size: f.size, copied: false, alt: t.id, altSize: t.size }); } } }
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
