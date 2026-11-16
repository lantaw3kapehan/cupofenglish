// CupOfEnglish · coe-media-sync (16 Nov 2026 · 2276 · Misty: "books, audios and videos must open instantly · no downtime in class").
// Copies every course-book audio and video from Google Drive into Supabase Storage (public bucket book-media, served from the CDN).
// The app plays the Storage copy first; if a file is not copied yet it falls back to coe-audio (Drive stream), then Drive's player.
// POST { op: "run" } with header x-coe-cron (pg_cron every minute until done, then the new files after the nightly Drive scan)
// POST { op: "status" }  → how many copied / waiting / failed (no key needed, numbers only)
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
async function copy(f: { id: string; mime: string; size: number }) {
  const { data: cur } = await db.from("coe_media_mirror").select("tries").eq("id", f.id).maybeSingle();
  await db.from("coe_media_mirror").upsert({ id: f.id, mime: f.mime, size: f.size, tries: ((cur && cur.tries) || 0) + 1, updated_at: new Date().toISOString() }, { onConflict: "id" });
  try {
    const r = await fetch("https://drive.usercontent.google.com/download?id=" + encodeURIComponent(f.id) + "&export=download&confirm=t", { redirect: "follow" });
    if (!r.ok) throw new Error("drive " + r.status);
    if (/text\/html/.test(r.headers.get("content-type") || "")) throw new Error("drive page (quota or permission)");
    const buf = new Uint8Array(await r.arrayBuffer());
    if (buf.length < 512) throw new Error("too small");
    const { error } = await db.storage.from("book-media").upload(f.id, buf, { contentType: f.mime || "application/octet-stream", cacheControl: "31536000", upsert: true });
    if (error) throw new Error("storage " + error.message);
    await db.from("coe_media_mirror").update({ obj: f.id, done_at: new Date().toISOString(), err: null, updated_at: new Date().toISOString() }).eq("id", f.id);
    return true;
  } catch (e) {
    await db.from("coe_media_mirror").update({ err: String((e as Error).message || e).slice(0, 200), updated_at: new Date().toISOString() }).eq("id", f.id);
    return false;
  }
}
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "content-type" } });
  let b: any = {}; try { b = JSON.parse(await req.text()); } catch { /* empty */ }
  if (b.op === "status") {
    const { count: done } = await db.from("coe_media_mirror").select("id", { count: "exact", head: true }).not("done_at", "is", null);
    const { count: failed } = await db.from("coe_media_mirror").select("id", { count: "exact", head: true }).is("done_at", null).gte("tries", 4);
    const { data: next } = await db.rpc("coe_media_next", { p_n: 10000 });
    return out({ ok: true, copied: done || 0, waiting: (next || []).length, failed: failed || 0 });
  }
  if (b.op === "one") {   // 2278: the reader asks for a file that is not copied yet: copy it now (course-book files only; once per 5 minutes)
    const id = String(b.id || ""); if (!/^[A-Za-z0-9_-]{10,80}$/.test(id)) return out({ ok: false, error: "id" }, 400);
    const { data: f } = await db.from("coe_book_files").select("id,mime,size").eq("id", id).is("gone_at", null).maybeSingle();
    if (!f || !/^(audio\/|video\/|application\/pdf$)/.test(f.mime || "") || (f.size || 0) > 150000000) return out({ ok: false, error: "not a book file" }, 404);
    const { data: m } = await db.from("coe_media_mirror").select("done_at,updated_at").eq("id", id).maybeSingle();
    if (m && m.done_at) return out({ ok: true, done: true });
    if (m && Date.now() - new Date(m.updated_at).getTime() < 5 * 60000) return out({ ok: true, busy: true });
    return out({ ok: await copy(f as any) });
  }
  const { data: k } = await db.from("coe_cron_key").select("k").eq("id", 1).maybeSingle();
  if (!k || req.headers.get("x-coe-cron") !== k.k) return out({ ok: false, error: "AUTH" }, 401);
  const t0 = Date.now(), budget = 110000; let ok = 0, bad = 0, bytes = 0;
  while (Date.now() - t0 < budget) {
    const { data: next } = await db.rpc("coe_media_next", { p_n: 6 });
    if (!next || !next.length) break;
    const big = next.filter((f: any) => (f.size || 0) > 20e6);
    const batch = big.length ? [big[0]] : next;            // big videos one at a time, audio six at a time
    if (big.length && bytes > 0 && Date.now() - t0 > budget - 60000) break;
    const res = await Promise.all(batch.map((f: any) => copy(f)));
    res.forEach((x, i) => { if (x) { ok++; bytes += batch[i].size || 0; } else bad++; });
  }
  return out({ ok: true, copied: ok, failed: bad, mb: Math.round(bytes / 1e6), secs: Math.round((Date.now() - t0) / 1000) });
});
