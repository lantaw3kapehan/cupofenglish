// CupOfEnglish · coe-shot-read v1 (12 Nov 2026, 2141) · reads every time-in / "I'm in" screen picture for the Wi-Fi icon.
// Misty 17:31–17:35: laptops can't report Wi-Fi to the browser, so the picture itself is the proof: the teacher shares the entire
// screen (VooV + date/time + the LAN cable icon). This reads the network icon in each new picture:
//   cable / no Wi-Fi icon → nothing · Wi-Fi icon → coe_wifi_flag(teacher, 'proof', picture, 'Picture check') = the contract warning,
//   "I'm in" locked until the cable is connected and the check redone, Operations told · unclear → Operations checks (nothing locked).
// Runs from the database's own queue (coe_shot_claim), so calling it needs no sign-in and can do no harm. Needs the edge-function
// secret ANTHROPIC_API_KEY; without it, it does nothing (returns off: true). Model: Claude Haiku 5.5 (vision).
// Trial mode until the secret COE_SHOT_LIVE = 1: a Wi-Fi reading only tells Operations (to check how accurate the reading is first).
// v3 (13 Nov, credit on via Misty's plan): Haiku 5.5 thinks first, so max_tokens 120 gave no answer: now 1500, text blocks only,
//   and the prompt describes the Windows LAN (monitor + cable) and Wi-Fi (arcs) icons exactly. Tested read-only on 14 of 12 Nov's
//   pictures: 14/14 right (13 cable, 1 Wi-Fi: April 17:21). About 2,000 tokens in + 300 out = about $0.00035 a picture.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const LIVE = Deno.env.get("COE_SHOT_LIVE") === "1";   // trial first: without it, a Wi-Fi reading only tells Operations (no lock)
const KEY = Deno.env.get("ANTHROPIC_API_KEY") || "", MODEL = Deno.env.get("COE_SHOT_MODEL") || "claude-haiku-5-5";
const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "Content-Type": "application/json" } });
const b64 = (u: Uint8Array) => { let s = ""; for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode(...u.subarray(i, i + 0x8000)); return btoa(s); };
const ASK = `This is a screenshot of a teacher's whole computer screen, taken when she starts an online class.
Look ONLY at the network status icon. On Windows it is in the taskbar at the bottom right, just left of the volume (speaker) icon and the clock. On a Mac it is in the menu bar at the top right.
What the icons look like:
- Windows LAN cable (Ethernet): a small computer monitor / screen with a short cable or plug under it (sometimes a globe). This means "cable".
- Windows Wi-Fi: a fan of curved arcs (like a quarter circle of signal waves), no monitor. This means "wifi".
- Mac: a fan of curved arcs in the menu bar means "wifi"; no arcs means "cable".
Answer:
- "cable" if you see the monitor-with-cable icon next to the speaker icon.
- "wifi" if you see the curved-arcs Wi-Fi icon there.
- "unclear" only if the taskbar / menu bar is hidden, cut off or covered, so you cannot see the network icon at all.
Reply with JSON only: {"net":"wifi"|"cable"|"unclear","os":"windows"|"mac"|"other","why":"<max 15 words>"}`;
async function readOne(bytes: Uint8Array, mime: string) {
  const ac = new AbortController(), t = setTimeout(() => ac.abort(), 40000);
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", signal: ac.signal,
      headers: { "x-api-key": KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: MODEL, max_tokens: 1500, messages: [{ role: "user", content: [
        { type: "image", source: { type: "base64", media_type: mime, data: b64(bytes) } }, { type: "text", text: ASK }] }] }) });
    const j = await r.json();
    if (!r.ok) return { net: "error", why: String(j?.error?.message || r.status).slice(0, 160) };
    const txt = String((j.content || []).filter((c: any) => c.type === "text").map((c: any) => c.text || "").join("")), m = txt.match(/\{[^{}]*"net"[^{}]*\}/);
    const o = m ? JSON.parse(m[0]) : {}; const net = /^(wifi|cable|unclear)$/.test(o.net) ? o.net : "unclear";
    return { net, os: String(o.os || ""), why: String(o.why || "").slice(0, 160), tokens: j.usage || null };
  } catch (e) { return { net: "error", why: String((e as Error)?.message || e).slice(0, 160) }; }
  finally { clearTimeout(t); }
}
Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return out({ ok: false }, 405);
  if (!KEY) return out({ ok: false, off: true });
  const { data: L, error } = await db.rpc("coe_shot_claim", { p_n: 6 });
  if (error) return out({ ok: false, error: "db" }, 500);
  const done: any[] = [];
  for (const x of (L || []) as any[]) {
    let res: any = { net: "error", why: "no picture" };
    try {
      const path = String(x.url).split("/object/public/proofs/")[1] || "";
      const { data: f, error: fe } = path ? await db.storage.from("proofs").download(decodeURIComponent(path)) : { data: null, error: "no path" } as any;
      if (!fe && f) { const u = new Uint8Array(await f.arrayBuffer()); res = await readOne(u, /\.png$/i.test(path) ? "image/png" : "image/jpeg"); }
    } catch (e) { res = { net: "error", why: String((e as Error)?.message || e).slice(0, 160) }; }
    let flagged = false;
    // Operations already allowed Wi-Fi today (cable internet down / written approval) → no new lock
    const { data: W0 } = res.net === "wifi" ? await db.from("coe_wifi").select("status,answer").ilike("teacher", x.teacher).eq("day", x.day).maybeSingle() : { data: null } as any;
    const allowed = !!W0 && W0.status === "cleared" && /^(down|approval)$/.test(String(W0.answer || ""));
    if (res.net === "wifi" && allowed) res.why = "allowed today · " + (res.why || "");
    if (res.net === "wifi" && !allowed && !LIVE) {   // trial: Operations checks the picture; nothing locked
      const { data: C } = await db.from("docs").select("data").eq("key", "sys:chat").maybeSingle();
      const L2: string[] = ((C && (C as any).data && (C as any).data.mgmt) || ["CupOfEnglish", "Celine"]);
      await db.from("chat_outbox").insert(L2.map((n) => ({ to_name: n, title: "Picture check (trial) · Teacher " + x.teacher, body: ("Wi-Fi icon seen in the time-in picture? Please check it: Team Chat › Time-in · " + (res.why || "")).slice(0, 160), tag: "m-msg", release_at: new Date().toISOString() })));
      res.why = "trial · " + (res.why || ""); }
    if (res.net === "wifi" && !allowed && LIVE) { const { data: fl } = await db.rpc("coe_wifi_flag", { p_teacher: x.teacher, p_src: "proof", p_proof: x.url, p_by: "Picture check" }); flagged = !!(fl as any)?.ok; }
    await db.from("coe_shot_read").update({ net: res.net, os: res.os || null, why: res.why || null, usage: res.tokens || null, flagged, read_at: new Date().toISOString(),
      tries: (x.tries || 0) + 1 }).eq("log_id", x.log_id);
    done.push({ id: x.log_id, net: res.net });
  }
  return out({ ok: true, n: done.length, done });
});
