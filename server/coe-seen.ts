// CupOfEnglish · coe-seen (10 Nov 2026 · 2046 · Misty: "even though it has been marked seen, it still shows"): what each person has
// marked as seen, kept in the database so every device and browser agrees (it was only in one browser's storage).
// POST { token, action: "get" | "set", box, data? }   box: a short name (e.g. "fd1806"); data: a small object (≤ 20 KB)
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: s } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
  const box = String(b.box || "").replace(/[^a-z0-9_-]/gi, "").slice(0, 30); if (!box) return out({ ok: false, error: "box" }, 400);
  const key = "seen:" + String(s.name || "").trim().toLowerCase() + ":" + box;
  try {
    if (b.action === "get") { const { data } = await db.from("docs").select("data,updated_at").eq("key", key).maybeSingle(); return out({ ok: true, data: data ? data.data : null, at: data ? data.updated_at : null }); }
    if (b.action === "set") {
      const d = b.data && typeof b.data === "object" ? b.data : {}; if (JSON.stringify(d).length > 20000) return out({ ok: false, error: "too big" }, 400);
      const { error } = await db.from("docs").upsert({ key, scope: "pres", data: d, updated_at: new Date().toISOString() }, { onConflict: "key" });
      if (error) return out({ ok: false, error: error.message }); return out({ ok: true });
    }
    return out({ ok: false, error: "Unknown action" }, 400);
  } catch (e) { return out({ ok: false, error: String((e as Error).message || e) }, 500); }
});
