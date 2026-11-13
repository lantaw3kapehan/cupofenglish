// CupOfEnglish · coe-wifi v1 (12 Nov 2026, 2135 · Misty: Wi-Fi seen at time-in → a warning as the contract says, and "I'm in" waits until the teacher answers).
// Teacher:  POST { token, op: "mine" }                         → { ok, flag: { id, status, contract, src, at } | null }
//           POST { token, op: "answer", id, how }              → how = "cable" (connected the LAN cable, new time-in picture: unlocked, Operations re-checks) | "down" / "approval" (a request: I'm in stays locked until Operations allows)
//           POST { token, op: "browser" }                       → the browser itself says Wi-Fi (Android Chrome): flag today
//           POST { token, op: "explain", id, text, img? }      → v3 (2159): the teacher explains (stored on coe_wifi, shown in To do › Fix these)
//           POST { token, op: "shots" }                         → v2: today's picture checks for me [{ at, kind, net }] (the label under time-in / I'm in)
// v2 (13 Nov, 2157 · Misty: "we can turn the lock on now" · "only management can unlock it until they explain" · "warning as per contract …
//   systematic and undisputable"): "recheck" (the teacher says the cable is connected) keeps I'm in LOCKED; only management unlocks
//   (close: cleared / confirmed). "mine" also returns the picture (proof), shown to the teacher with the warning.
// Management: POST { token, op: "flag", teacher, proof? }      → Operations saw the Wi-Fi icon in the time-in picture
//             POST { token, op: "list" }                        → today's (and still open) flags
//             (v3) close "confirmed" also returns info for the auto-filled case (picture, contract, incident no., 5-day deadline)
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
      const { data } = await db.from("coe_wifi").select("id,status,contract,src,flagged_at,answer,proof,explain,explain_at").ilike("teacher", me).eq("day", today()).maybeSingle();
      const { data: ct } = await db.rpc("coe_wifi_contract", { p_teacher: me });
      return out({ ok: true, contract: ct || "2025", flag: data && /^(warned|asked|recheck)$/.test(data.status) ? { id: data.id, status: data.status, contract: data.contract, src: data.src, at: data.flagged_at, answer: data.answer, proof: data.proof, explain: data.explain, explainAt: data.explain_at } : null });
    }
    if (op === "shots") {   // v2: my picture checks today
      const { data } = await db.from("coe_shot_read").select("created_at,kind,net,read_at,log_id").ilike("teacher", me).eq("day", today()).order("created_at", { ascending: true }).limit(40);
      return out({ ok: true, shots: (data || []).map((x: any) => ({ at: x.created_at, kind: x.kind, net: x.net === "error" ? null : x.net, what: String(x.log_id || "").split("|")[3] || "" })) });
    }
    if (op === "explain") {   // v3 (2159): the teacher's explanation (text 1–600, optional photo ≤ 600 KB) → Operations' Wi-Fi item
      const id = Number(b.id) || 0, text = String(b.text || "").trim().slice(0, 600);
      if (!id || text.length < 3) return out({ ok: false, error: "Write a short explanation" }, 400);
      const { data: f } = await db.from("coe_wifi").select("id,day").eq("id", id).ilike("teacher", me).maybeSingle();
      if (!f) return out({ ok: false, error: "Not found" }, 404);
      let img: string | null = null;
      const raw = String(b.img || ""); const m = raw.match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/);
      if (m) { const bytes = Uint8Array.from(atob(m[2]), (c) => c.charCodeAt(0));
        if (bytes.length > 600 * 1024) return out({ ok: false, error: "The photo is too big (600 KB max)" }, 400);
        const path = "wifi-explain/" + String(f.day).slice(0, 7) + "/" + me.toLowerCase().replace(/[^a-z0-9]+/g, "") + "-" + id + "-" + crypto.randomUUID().slice(0, 12) + (m[1] === "image/png" ? ".png" : m[1] === "image/webp" ? ".webp" : ".jpg");
        const { error: ue } = await db.storage.from("proofs").upload(path, bytes, { contentType: m[1], upsert: false });
        if (ue) return out({ ok: false, error: "Photo not saved · try again" }, 500);
        img = Deno.env.get("SUPABASE_URL") + "/storage/v1/object/public/proofs/" + path; }
      const { error } = await db.from("coe_wifi").update({ explain: text, explain_at: new Date().toISOString(), ...(img ? { explain_img: img } : {}) }).eq("id", id);
      if (error) return out({ ok: false, error: "Not saved · try again" }, 500);
      await pushMgmt("Wi-Fi · Teacher " + me + " explained", (text + (img ? " · with a photo" : "")).slice(0, 140) + " · To do › Fix these");
      return out({ ok: true, img });
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
      const said = how === "cable" ? "says the LAN cable is connected and sent a new time-in picture · check it, then unlock I'm in (To do › Fix these)" : how === "down" ? "says the cable internet is down · asks to teach on backup (Clause 3.2A) · I'm in is locked until you allow it" : "says they have written approval for Wi-Fi today · I'm in is locked until you allow it";
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
  if (op === "decided") {   // v3 (2159): the decision for a Wi-Fi case is written (after the 5 days) → off To do
    const id = Number(b.id) || 0; if (!id) return out({ ok: false, error: "bad request" }, 400);
    const { error } = await db.from("coe_wifi").update({ decided_at: new Date().toISOString(), decided_by: me }).eq("id", id).eq("status", "confirmed");
    return out({ ok: !error });
  }
  if (op === "close") {
    const id = Number(b.id) || 0, r = String(b.result || "");
    if (!id || !/^(confirmed|cleared)$/.test(r)) return out({ ok: false, error: "bad request" }, 400);
    const { data: f0 } = await db.from("coe_wifi").select("*").eq("id", id).maybeSingle();
    const { error } = await db.from("coe_wifi").update({ status: r, closed_by: me, closed_at: new Date().toISOString(), note: String(b.note || "").slice(0, 300) || null }).eq("id", id);
    if (error) return out({ ok: false, error: "not saved" }, 500);
    if (r !== "confirmed" || !f0) return out({ ok: true });
    // v3 (2159): what the case needs, filled in by the app: the picture, the time, the teacher's contract, which incident this is,
    //   the 5-day deadline to explain (Clause 5.1). When the 5 days are up, To do › Fix these shows it (coe_ops_check, 2159).
    const { count } = await db.from("coe_wifi").select("id", { count: "exact", head: true }).ilike("teacher", f0.teacher).eq("status", "confirmed").lt("day", f0.day);
    const dl = new Date(Date.now() + 5 * 864e5), dlDay = new Date(dl.getTime() + 8 * 3600e3).toISOString().slice(0, 10);
    return out({ ok: true, info: { teacher: f0.teacher, day: f0.day, at: f0.flagged_at, proof: f0.proof, contract: f0.contract, explain: f0.explain, explainImg: f0.explain_img, incident: (count || 0) + 1, deadline: dlDay } });
  }
  return out({ ok: false, error: "unknown op" }, 400);
});
