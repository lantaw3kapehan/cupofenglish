// CupOfEnglish · coe-light v4 (21 Nov: todo { ids }) · v3 (21 Nov: _APP COPIES files too · Dezza OD1 Workbook) · v2 (20 Nov: todo by id) · v1 (20 Nov 2026 · 2548 · Misty 23:03 "let us do 1 and 2 now"): lighter book copies made overnight on GitHub.
// Only the repository's own "Book light copies" workflow can call this: the caller sends its GitHub OIDC token, checked here
// against GitHub's public keys (repository lantaw3kapehan/cupofenglish, workflow book-light.yml, branch main). No shared secret.
// POST { oidc, op, ... }
//   todo { limit }            → our copied book PDFs over 20 MB without a light copy yet (largest first)
//   sign { id }               → a one-time upload address for book-media/light-2548/<id>
//   done { id, orig, size, dpi, use } → recorded in coe_book_light (use = the light copy is smaller enough to be opened instead)
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
import { createRemoteJWKSet, jwtVerify } from "npm:jose@5.9.6";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const JWKS = createRemoteJWKSet(new URL("https://token.actions.githubusercontent.com/.well-known/jwks"));
const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "Content-Type": "application/json" } });
const ID = /^[A-Za-z0-9_-]{20,80}$/;
Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return out({ ok: false }, 405);
  let b: any; try { b = await req.json(); } catch { return out({ ok: false, error: "bad request" }, 400); }
  try {
    const { payload: p } = await jwtVerify(String(b.oidc || ""), JWKS, { issuer: "https://token.actions.githubusercontent.com", audience: "coe-light" });
    if (p.repository !== "lantaw3kapehan/cupofenglish" || p.ref !== "refs/heads/main" || !String(p.job_workflow_ref || p.workflow_ref || "").includes("/.github/workflows/book-light.yml@")) return out({ ok: false, error: "not allowed" }, 403);
  } catch (_) { return out({ ok: false, error: "not allowed" }, 403); }
  const op = String(b.op || "");
  try {
    if (op === "todo") {
      const lim = Math.min(200, Math.max(1, +b.limit || 20));
      // v4 (21 Nov, Mayi · Consonant Blends 7–14 MB on a slow connection): todo { ids } → these files, any size, if copied and not done yet
      if (Array.isArray(b.ids) && b.ids.length) { const ids = b.ids.map((x: unknown) => String(x)).filter((x: string) => ID.test(x)).slice(0, 50);
        const { data: F2 } = await db.from("coe_book_files").select("id,name,size").in("id", ids); const { data: M2 } = await db.from("coe_media_mirror").select("id").in("id", ids).not("done_at", "is", null);
        const { data: L2 } = await db.from("coe_book_light").select("id").in("id", ids); const cp2 = new Set((M2 || []).map((x: any) => x.id)), have2 = new Set((L2 || []).map((x: any) => x.id));
        return out({ ok: true, rows: (F2 || []).filter((f: any) => cp2.has(f.id) && !have2.has(f.id)).map((f: any) => ({ id: f.id, size: f.size, name: f.name })) }); }
      const { data: L } = await db.from("coe_book_light").select("id").limit(5000); const have = new Set((L || []).map((x: any) => x.id));
      const { data: F } = await db.from("coe_book_files").select("id,name,size,path").is("gone_at", null).ilike("name", "%.pdf").gt("size", 20 * 1048576).lte("size", 250 * 1048576).order("size", { ascending: false }).limit(1000);
      const C = (F || []).filter((f: any) => !have.has(f.id)), cp = new Set<string>();
      for (let i = 0; i < C.length; i += 200) { const { data: M } = await db.from("coe_media_mirror").select("id").in("id", C.slice(i, i + 200).map((f: any) => f.id)).not("done_at", "is", null); (M || []).forEach((x: any) => cp.add(x.id)); }   // v2: by id (a plain list stops at 1000 rows)
      const rows = C.filter((f: any) => cp.has(f.id)).slice(0, lim).map((f: any) => ({ id: f.id, size: f.size, name: f.name }));
      return out({ ok: true, rows });
    }
    const id = String(b.id || ""); if (!ID.test(id)) return out({ ok: false, error: "id" }, 400);
    if (op === "sign") { const { data, error } = await db.storage.from("book-media").createSignedUploadUrl("light-2548/" + id, { upsert: true }); if (error) throw new Error(error.message); return out({ ok: true, url: data.signedUrl }); }
    if (op === "done") { const { error } = await db.from("coe_book_light").upsert({ id, orig_size: +b.orig || null, size: +b.size || null, dpi: +b.dpi || null, use_it: false, note: String(b.use ? "ready" : "kept original: not smaller enough").slice(0, 80), at: new Date().toISOString() }); if (error) throw new Error(error.message); return out({ ok: true }); }
    return out({ ok: false, error: "unknown op" }, 400);
  } catch (e) { return out({ ok: false, error: String((e as Error).message || e) }, 500); }
});
