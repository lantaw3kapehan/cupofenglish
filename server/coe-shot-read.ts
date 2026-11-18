// CupOfEnglish · coe-shot-read v7 (18 Nov: battery ≠ LAN, cable readings checked too) · v6 (from v1 (12 Nov 2026, 2141) · reads every time-in / "I'm in" screen picture for the Wi-Fi icon.
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
// v4 (13 Nov, Misty: "for macbook users, also ensure the LAN can be detected"): a Mac shows no LAN icon and keeps the Wi-Fi icon solid
//   while Wi-Fi is on (even with a cable in), so a Mac counts as cable only when its Wi-Fi icon shows Wi-Fi OFF (outline / slash) or
//   the Ethernet <··> symbol; no Wi-Fi icon in the menu bar = unclear. Mac teachers: Wi-Fi off during class, Wi-Fi icon kept in the menu bar.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
import { Image } from "https://deno.land/x/imagescript@1.3.0/mod.ts";   // v6: crop and enlarge the taskbar for a second look
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const LIVE0 = Deno.env.get("COE_SHOT_LIVE") === "1";   // trial first: without it, a Wi-Fi reading only tells Operations (no lock)
// v5 (13 Nov, 2157 · Misty "we can turn the lock on now"): live = the secret OR docs sys:live.shotLive = true (switch without a deploy)
const KEY = Deno.env.get("ANTHROPIC_API_KEY") || "", MODEL = Deno.env.get("COE_SHOT_MODEL") || "claude-haiku-5-5";
const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "Content-Type": "application/json" } });
const b64 = (u: Uint8Array) => { let s = ""; for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode(...u.subarray(i, i + 0x8000)); return btoa(s); };
const ASK = `This is a screenshot of a teacher's whole computer screen, taken when she starts an online class.
Look ONLY at the network status icon. On Windows it is in the taskbar at the bottom right, just left of the volume (speaker) icon and the clock. On a Mac it is in the menu bar at the top right (near the battery, Control Centre and the date).
What the icons look like:
- Windows LAN cable (Ethernet): a small computer monitor / screen with a short cable or plug under it (sometimes a globe). This means "cable".
- A laptop BATTERY icon is a flat, wide rectangle lying on its side (often with a small nub on one end, a fill level or a plug). It is NOT the LAN monitor. A laptop shows the battery AND a network icon: still look for the network icon next to it.
- Windows Wi-Fi: a fan of curved arcs (like a quarter circle of signal waves), no monitor. This means "wifi".
- Mac, Wi-Fi connected: the Wi-Fi fan of arcs drawn solid / filled in the menu bar. This means "wifi" (even if a cable is also plugged in, the Mac may be using Wi-Fi).
- Mac, Wi-Fi turned off: the Wi-Fi fan drawn as an empty outline, greyed out, or with a slash through it; or the Ethernet symbol <··> (two arrows with dots) where the Wi-Fi icon would be. The class is live, so the Mac is on the LAN cable. This means "cable".
Answer:
- "cable" for the Windows monitor-with-cable icon, or a Mac whose Wi-Fi icon shows Wi-Fi turned off / Ethernet.
- "wifi" for the solid curved-arcs Wi-Fi icon (Windows or Mac).
- "unclear" if the taskbar / menu bar is hidden, cut off or covered, or a Mac shows no Wi-Fi icon at all in the menu bar, so you cannot tell.
If you see curved Wi-Fi arcs anywhere among the tray icons near the speaker, the answer is "wifi", even if a battery or monitor-like icon is also there.
Do not confuse the network icon with other tray icons: the battery icon (a flat wide rectangle), the microphone-in-use icon, the location icon, VPN, Bluetooth, OneDrive, app icons, or the "speaking" signal bars inside VooV / Tencent Meeting.
Reply with JSON only: {"net":"wifi"|"cable"|"unclear","os":"windows"|"mac"|"other","why":"<max 15 words>"}`;
// v6 (17 Nov, Misty 20:02 "Kat was using LAN but she was deducted wifi?"): a "wifi" reading is checked a second time on the taskbar
//   (or Mac menu bar) cut out and enlarged 3×. Only when that second look also sees Wi-Fi is the teacher flagged; otherwise the reading
//   becomes "unclear" and Operations looks at the picture (nothing locked, no contract warning). Kat 19:57 was a misread (monitor icon).
const ASK2 = `This is the bottom-right taskbar (Windows) or top-right menu bar (Mac) of a teacher's screen, cut out and enlarged.
Go through the small status icons one by one and find the NETWORK icon (on Windows: just left of the speaker/volume icon).
- Windows LAN cable (Ethernet) = a small computer MONITOR / screen shape, about as tall as it is wide, with a stand, plug or cable under it (maybe a globe). → "cable"
- A laptop BATTERY = a flat, wide rectangle lying on its side (nub on one end, maybe a fill level or plug). It is NOT the LAN monitor.
- Wi-Fi = a fan of 3–4 curved ARCS widening upwards, like a quarter circle of waves. → "wifi"
- Mac with the Wi-Fi fan as an outline / slashed, or the Ethernet <··> symbol → "cable"; Mac with a solid Wi-Fi fan → "wifi".
The microphone-in-use icon, location pin, battery, speaker, VPN or app icons are NOT the network icon.
If curved Wi-Fi arcs appear anywhere among these icons, answer "wifi" even if a battery or monitor-like icon is also there.
If you cannot see a network icon clearly, answer "unclear".
Reply with JSON only: {"net":"wifi"|"cable"|"unclear","why":"<max 15 words>"}`;
// v7 (18 Nov, Misty 18:24: Teacher Dezza on Wi-Fi was read as "cable": the battery icon was taken for the LAN monitor): a Windows "cable"
//   reading now also gets the enlarged second look; when that look sees Wi-Fi, a third yes/no look decides (2 of 3 Wi-Fi = Wi-Fi, else unclear).
const ASK3 = `This is the enlarged bottom-right corner of a Windows taskbar. Among the small status icons, is there a Wi-Fi icon: a fan of 3–4 curved arcs widening upwards (like a quarter circle of signal waves)?
A battery (flat wide rectangle), a monitor/screen shape, a microphone, a speaker or app icons are NOT Wi-Fi.
Reply with JSON only: {"net":"wifi"|"cable"|"unclear","why":"<max 15 words>"} using "wifi" if you see the Wi-Fi arcs, "cable" if you clearly see a monitor-shaped LAN icon and no arcs, "unclear" otherwise.`;
async function decide(u: Uint8Array, mime: string) {   // v6 + v7: the reading used for a picture, with the extra looks
  const r1: any = await readOne(u, mime); let res: any = r1, r2: any = null, r3: any = null;
  if (r1.net === "wifi") {
    const z = await corner(u, r1.os === "mac"); r2 = z ? await readOne(z, "image/png", ASK2) : { net: "error", why: "could not cut the taskbar" };
    if (r2.net !== "wifi") res = { ...r1, net: "unclear", why: ("2nd look: " + r2.net + " · " + (r2.why || "") + " · 1st: " + (r1.why || "")).slice(0, 160) };
    else res = { ...r1, why: ("confirmed · " + (r1.why || "")).slice(0, 160) };
  } else if (r1.net === "cable" && r1.os !== "mac") {
    const z = await corner(u, false); r2 = z ? await readOne(z, "image/png", ASK2) : null;
    if (r2 && r2.net === "wifi") { r3 = await readOne(z!, "image/png", ASK3);
      res = r3.net === "wifi" ? { ...r1, net: "wifi", why: ("2nd and 3rd look: Wi-Fi · " + (r3.why || r2.why || "")).slice(0, 160) }
                              : { ...r1, net: "unclear", why: ("2nd look Wi-Fi, 3rd " + r3.net + " · " + (r2.why || "")).slice(0, 160) }; }
    else if (r2 && r2.net === "cable") res = { ...r1, why: ("checked · " + (r1.why || "")).slice(0, 160) };
  }
  return { res, r1, r2, r3 };
}
async function corner(bytes: Uint8Array, mac: boolean): Promise<Uint8Array | null> {
  try {
    const im = await Image.decode(bytes); const W = im.width, H = im.height;
    const c = mac ? im.crop(Math.round(W * .5), 0, Math.round(W * .5), Math.max(24, Math.round(H * .06)))
                  : im.crop(Math.round(W * .5), Math.round(H * .9), Math.round(W * .5), Math.round(H * .1));
    c.resize(c.width * 3, Image.RESIZE_AUTO); return await c.encode();
  } catch (_e) { return null; }
}
async function readOne(bytes: Uint8Array, mime: string, ask: string = ASK) {
  const ac = new AbortController(), t = setTimeout(() => ac.abort(), 40000);
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", signal: ac.signal,
      headers: { "x-api-key": KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: MODEL, max_tokens: 1500, messages: [{ role: "user", content: [
        { type: "image", source: { type: "base64", media_type: mime, data: b64(bytes) } }, { type: "text", text: ask }] }] }) });
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
  const { data: SL } = await db.from("docs").select("data").eq("key", "sys:live").maybeSingle();
  const LIVE = LIVE0 || !!(SL && (SL as any).data && (SL as any).data.shotLive === true);
  // v6: read-only test of one stored picture (no flag, nothing saved): { test: "<proofs path>", code } with code = docs sys:shottest.code
  try { const tb = await req.clone().json().catch(() => null) as any;
    if (tb && tb.test) { const { data: T } = await db.from("docs").select("data").eq("key", "sys:shottest").maybeSingle();
      if (!T || !(T as any).data || !(T as any).data.code || (T as any).data.code !== tb.code) return out({ ok: false }, 403);
      const { data: f } = await db.storage.from("proofs").download(String(tb.test)); if (!f) return out({ ok: false, error: "no picture" });
      const u = new Uint8Array(await f.arrayBuffer()); const d = await decide(u, "image/jpeg"); return out({ ok: true, final: d.res.net, why: d.res.why, r1: d.r1.net, r2: d.r2 && d.r2.net, r3: d.r3 && d.r3.net }); } } catch (_e) { /* not a test */ }
  const { data: L, error } = await db.rpc("coe_shot_claim", { p_n: 6 });
  if (error) return out({ ok: false, error: "db" }, 500);
  const done: any[] = [];
  for (const x of (L || []) as any[]) {
    let res: any = { net: "error", why: "no picture" };
    try {
      const path = String(x.url).split("/object/public/proofs/")[1] || "";
      const { data: f, error: fe } = path ? await db.storage.from("proofs").download(decodeURIComponent(path)) : { data: null, error: "no path" } as any;
      if (!fe && f) { const u = new Uint8Array(await f.arrayBuffer()); res = (await decide(u, /\.png$/i.test(path) ? "image/png" : "image/jpeg")).res; }   // v6 + v7: extra looks (see decide)
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
