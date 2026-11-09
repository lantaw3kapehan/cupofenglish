// CupOfEnglish · coe-excuse (9 Nov 2026 · 2027 · Misty: "create an edit for us management that when there's a system issue and
// they're tagged late we can easily edit it"). Database only.
// POST { token, action, ... }  (management only)
//   list   { days? }                 → lates of the last 14 days: time-ins (Late / Late to class) and late video uploads; excused ones marked done
//   excuse { kind, ref, note? }      → kind "timein" (log_rows id) or "video" (coe_class_videos event_id):
//                                       the record is corrected (time-in → On time; video → not late), the linked case is waived, Growth and ranks
//                                       are refreshed, and who / when / what it was before is kept in coe_excuse_log (coe_excuse_system).
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
  if (s.mode !== "mgmt") return out({ ok: false, error: "Management only" }, 403);
  const a = String(b.action || "");
  try {
    if (a === "list") {
      const days = Math.min(31, Math.max(1, +b.days || 14));
      const { data, error } = await db.rpc("coe_excuse_recent", { p_days: days });
      if (error) return out({ ok: false, error: error.message });
      return out({ ok: true, ...(data || {}), at: new Date().toISOString() });
    }
    if (a === "excuse") {
      const kind = String(b.kind || ""), ref = String(b.ref || "").slice(0, 200), note = String(b.note || "").slice(0, 160);
      if (!/^(timein|video)$/.test(kind) || !ref) return out({ ok: false, error: "bad request" }, 400);
      const { data, error } = await db.rpc("coe_excuse_system", { p_kind: kind, p_ref: ref, p_who: String(s.name || "").trim(), p_note: note });
      if (error) return out({ ok: false, error: error.message });
      return out(data || { ok: false, error: "No answer" });
    }
    return out({ ok: false, error: "Unknown action" }, 400);
  } catch (e) { return out({ ok: false, error: String((e as Error).message || e) }, 500); }
});
