// CupOfEnglish · coe-wifi v1 (12 Nov 2026, 2135 · Misty: Wi-Fi seen at time-in → a warning as the contract says, and "I'm in" waits until the teacher answers).
// Teacher:  POST { token, op: "mine" }                         → { ok, flag: { id, status, contract, src, at } | null }
//           POST { token, op: "answer", id, how }              → how = "cable" (connected the LAN cable, new time-in picture: unlocked, Operations re-checks) | "down" / "approval" (a request: I'm in stays locked until Operations allows)
//           POST { token, op: "browser" }                       → the browser itself says Wi-Fi (Android Chrome): flag today
// Management: POST { token, op: "flag", teacher, proof? }      → Operations saw the Wi-Fi icon in the time-in picture
//             POST { token, op: "list" }                        → today's (and still open) flags
//             POST { token, op: "close", id, result, note? }    → result = "confirmed" (a lesson was taught on Wi-Fi; the case is opened in the app) | "cleared" (not Wi-Fi, or allowed today: unlocks I'm in)
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
const today = () => new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10);
const hm = () => new Date(Date.now() + 8 * 3600e3).toISOString().slice(11, 16);
Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: s } = await db.from("app_sessions").select("name,mode,role,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
  const me = String(s.name || ""), mgmt = s.mode === "mgmt", op = String(b.op || "");
  const pushMgmt = async (title: string, body: string) => {
    const { data: c } = await db.from("docs").select("data").eq("key", "sys:chat").maybeSingle();
    const L: string[] = ((c && c.data && c.data.mgmt) || ["CupOfEnglish", "Celine"]).filter((n: string) => n.toLowerCase() !== me.toLowerCase());
    if (L.length) await db.from("chat_outbox").insert(L.map((n) => ({ to_name: n, title: title.slice(0, 80), body: body.slice(0, 160), tag: "m-msg", release_at: new Date().toISOString() })));
  };
  if (!mgmt) {
    if (op === "mine") {
      const { data } = await db.from("coe_wifi").select("id,status,contract,src,flagged_at,answer").ilike("teacher", me).eq("day", today()).maybeSingle();
      const { data: ct } = await db.rpc("coe_wifi_contract", { p_teacher: me });
      return out({ ok: true, contract: ct || "2025", flag: data && (data.status === "warned" || data.status === "asked") ? { id: data.id, status: data.status, contract: data.contract, src: data.src, at: data.flagged_at } : null });
    }
    if (op === "browser") {
      const { data, error } = await db.rpc("coe_wifi_flag", { p_teacher: me, p_src: "browser", p_proof: null, p_by: "System" });
      if (error) return out({ ok: false, error: "not saved" }, 500);
      return out({ ok: true, id: (data as any)?.id });
    }
    if (op === "answer") {
      const id = Number(b.id) || 0, how = String(b.how || "");
      if (!id || !/^(cable|down|approval)$/.test(how)) return out({ ok: false, error: "bad request" }, 400);
      const { data: f } = await db.from("coe_wifi").select("*").eq("id", id).ilike("teacher", me).maybeSingle();
      if (!f) return out({ ok: false, error: "Not found" }, 404);
      if (how === "approval" && f.contract !== "addendum") return out({ ok: false, error: "not allowed" }, 400);
      await db.from("coe_wifi").update({ status: how === "cable" ? "recheck" : "asked", answer: how, answered_at: new Date().toISOString() }).eq("id", id);
      const said = how === "cable" ? "connected the LAN cable and sent a new time-in picture · check it" : how === "down" ? "says the cable internet is down · asks to teach on backup (Clause 3.2A) · I'm in is locked until you allow it" : "says they have written approval for Wi-Fi today · I'm in is locked until you allow it";
      await pushMgmt("Wi-Fi · Teacher " + me + " answered", "Teacher " + me + " " + said + " · " + hm() + " · To do › Fix these");
      return out({ ok: true });
    }
    return out({ ok: false, error: "Management only" }, 403);
  }
  if (op === "flag") {
    const t = String(b.teacher || "").trim().slice(0, 60); if (!t) return out({ ok: false, error: "Which teacher?" }, 400);
    const { data, error } = await db.rpc("coe_wifi_flag", { p_teacher: t, p_src: "proof", p_proof: String(b.proof || "").slice(0, 400) || null, p_by: me });
    if (error) return out({ ok: false, error: "not saved" }, 500);
    return out({ ok: true, ...(data as any) });
  }
  if (op === "list") {
    const { data } = await db.from("coe_wifi").select("*").or("day.eq." + today() + ",status.in.(warned,asked,recheck)").order("flagged_at", { ascending: false }).limit(50);
    return out({ ok: true, flags: data || [] });
  }
  if (op === "close") {
    const id = Number(b.id) || 0, r = String(b.result || "");
    if (!id || !/^(confirmed|cleared)$/.test(r)) return out({ ok: false, error: "bad request" }, 400);
    const { error } = await db.from("coe_wifi").update({ status: r, closed_by: me, closed_at: new Date().toISOString(), note: String(b.note || "").slice(0, 300) || null }).eq("id", id);
    if (error) return out({ ok: false, error: "not saved" }, 500);
    return out({ ok: true });
  }
  return out({ ok: false, error: "unknown op" }, 400);
});
