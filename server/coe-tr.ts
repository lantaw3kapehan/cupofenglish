// CupOfEnglish · coe-tr v1 (11 Nov 2026, 2082 · Misty: "CANCELLING A LESSON DOES NOT FEEL INSTANT" · "CAN YOU DO IT NOW INSTEAD?").
// The translate buttons (trEn: Chinese → English, trZh: English → Chinese) took 4–5 s through the Google Apps Script. This answers the
// same question in well under a second with the same translation engine, called directly (no Apps Script, no sheets).
// POST { token, fn: "trEn" | "trZh", text } → { ok: true, en } / { ok: true, zh }. Anyone signed in to the app; text up to 2000 characters.
// If the translator does not answer in 6 s, { ok: false } and the app asks the Apps Script as before.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
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
  const fn = String(b.fn || ""), text = String(b.text || "").trim(), token = String(b.token || "");
  if (!/^tr(En|Zh)$/.test(fn) || !text || text.length > 2000) return out({ ok: false, error: "not allowed" }, 400);
  if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: s } = await db.from("app_sessions").select("name,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
  const [sl, tl] = fn === "trEn" ? ["zh-CN", "en"] : ["en", "zh-CN"];
  try {
    const ac = new AbortController(), tid = setTimeout(() => ac.abort(), 6000);
    const u = "https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&sl=" + sl + "&tl=" + tl + "&q=" + encodeURIComponent(text);
    const x = await fetch(u, { signal: ac.signal, headers: { "User-Agent": "Mozilla/5.0 (CupOfEnglish app)" } }).finally(() => clearTimeout(tid));
    const raw = await x.text(); let r: any = null; try { r = JSON.parse(raw); } catch (_e) { /* not JSON */ }
    const res = (Array.isArray(r) && Array.isArray(r[0]) ? r[0] : []).map((p: any) => (Array.isArray(p) ? String(p[0] || "") : "")).join("").trim();
    if (!res) return out({ ok: false, error: "no answer", why: x.status + " " + raw.slice(0, 120) });
    return out(fn === "trEn" ? { ok: true, en: res } : { ok: true, zh: res });
  } catch (e) { return out({ ok: false, error: "no answer", why: String((e as Error).message || e).slice(0, 160) }); }
});
