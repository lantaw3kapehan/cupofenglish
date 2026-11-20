// CupOfEnglish · coe-pdffix (20 Nov 2026 · 2499 · Misty: the Monkey page in The Alphabet U5L1 shows "monke" / "y" on two lines).
// Corrects text layout inside OUR copy of a lesson PDF (Supabase Storage, book-media/<Drive id>), page by page.
// President only. Before the first change to a file, the original is kept as book-media/<id>.orig-2499 (never overwritten).
// POST { token, op, id, page }
//   show  → the page's drawing instructions (text parts only) so the change can be chosen exactly
//   fix   { find, replace } → the exact text `find` must appear once on that page; it is replaced and the PDF saved back
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
import { PDFDocument, PDFArray, PDFName } from "npm:pdf-lib@1.17.1";
import pako from "npm:pako@2.1.0";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...CORS, "Content-Type": "application/json" } });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
const ID = /^[A-Za-z0-9_-]{20,80}$/;
const latin = (u: Uint8Array) => { let s = ""; for (let i = 0; i < u.length; i++) s += String.fromCharCode(u[i]); return s; };
const bytes = (s: string) => { const u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i) & 255; return u; };
async function load(id: string) { const { data, error } = await db.storage.from("book-media").download(id); if (error || !data) throw new Error("Could not read our copy of this file."); return new Uint8Array(await data.arrayBuffer()); }
function pageStream(doc: PDFDocument, n: number) {
  const page = doc.getPage(n - 1), c = page.node.Contents(); if (!c) throw new Error("This page has no content.");
  const refs = c instanceof PDFArray ? c.asArray() : [page.node.get(PDFName.of("Contents"))];
  const parts = refs.map((r: any) => { const st: any = doc.context.lookup(r); const raw = st.getContents(); let txt: string; try { txt = latin(pako.inflate(raw)); } catch { txt = latin(raw); } return txt; });
  return { page, text: parts.join("\n") };
}
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  try {
    const t = String(b.token || ""); if (t.length < 16) return out({ ok: false, error: "AUTH" }, 401);
    const { data: s } = await db.from("app_sessions").select("role,exp").eq("token_hash", await sha(t)).maybeSingle();
    if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
    if (!["President", "pres"].includes(String(s.role))) return out({ ok: false, error: "Only the President can change book files." }, 403);
    const id = String(b.id || ""), n = Math.floor(+b.page || 0); if (!ID.test(id) || n < 1) return out({ ok: false, error: "bad request" }, 400);
    const src = await load(id), doc = await PDFDocument.load(src, { updateMetadata: false });
    if (n > doc.getPageCount()) return out({ ok: false, error: "No such page." }, 400);
    const { page, text } = pageStream(doc, n);
    if (b.op === "show") { const lines = text.split(/\r?\n/).filter((l) => /T[fjJdmD*]|BT|ET|Tz|TL|Ts/.test(l)).slice(0, 400); return out({ ok: true, pages: doc.getPageCount(), lines, length: text.length }); }
    if (b.op === "fix") {
      const find = String(b.find || ""), rep = String(b.replace ?? ""); if (!find) return out({ ok: false, error: "find is empty" }, 400);
      const k = text.split(find).length - 1; if (k !== 1) return out({ ok: false, error: "The text to change appears " + k + " times on this page (must be once)." }, 400);
      const bak = id + ".orig-2499"; const { data: L } = await db.storage.from("book-media").list("", { search: bak });
      if (!(L || []).some((x: any) => x.name === bak)) { const { error } = await db.storage.from("book-media").upload(bak, src, { contentType: "application/pdf", upsert: false }); if (error) throw new Error("Backup failed: " + error.message); }
      const stream = doc.context.flateStream(bytes(text.replace(find, rep)));
      page.node.set(PDFName.of("Contents"), doc.context.register(stream));
      const outBytes = await doc.save({ useObjectStreams: false });
      const { error } = await db.storage.from("book-media").upload(id, outBytes, { contentType: "application/pdf", upsert: true, cacheControl: "60" });
      if (error) throw new Error(error.message);
      // v2 (2553): the light copy (2548) was made from the old page → removed; the reader opens this corrected copy and tonight's run makes a new light copy
      await db.from("coe_book_light").delete().eq("id", id); await db.storage.from("book-media").remove(["light-2548/" + id]);
      return out({ ok: true, size: outBytes.length, backup: bak });
    }
    return out({ ok: false, error: "unknown op" }, 400);
  } catch (e) { return out({ ok: false, error: String((e as Error)?.message || e) }, 500); }
});
