// coe-xmas v4 · 6 Nov 2026 (v2: "about me" clues · v3: drop-outs — "drop" op, re-spin when the match changed · v4: answered flag for "I will not join") · Christmas 2026 dinner + gift exchange (Secret Santa). Config in docs sys:xmas2026.
// POST { token, op } — anyone invited (active teachers + Celine, minus sys:xmas2026.exclude):
//   me    → { ok, cfg, me: {joining, avail, wish}, drawn, picked, recv?: {name, wish}, wheel?: [names] , counts }
//   save  { joining, avail, wish[] } (until the deadline and before the draw)
//   spin  → assigns nothing new (the draw is already made); marks it seen and returns { recv: {name, wish}, wheel }
// President (CupOfEnglish, mgmt) and Operations:
//   admin → { list: [{name, joining, avail, hasWish, picked}], counts } — never the pairs
//   draw  (President) → coe_xmas_do_draw · reveal { on } (President) · pairs (President, only when reveal is on)
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
const str = (x: unknown, n = 200) => String(x == null ? "" : x).trim().slice(0, n);
Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const token = str(b.token, 200); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: s } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
  const { data: cd } = await db.from("docs").select("data").eq("key", "sys:xmas2026").maybeSingle(); const cfg: any = (cd && cd.data) || {};
  const me = String(s.name || "").trim(), lc = me.toLowerCase(), pres = s.mode === "mgmt" && lc === "cupofenglish", ops = s.mode === "mgmt";
  const excl: string[] = (cfg.exclude || []).map((x: string) => String(x).toLowerCase()), extra: string[] = (cfg.extra || []).map((x: string) => String(x).toLowerCase());
  const { data: st } = await db.from("staff").select("name,role,status").eq("status", "active");
  const people = (st || []).filter((x: any) => (x.role === "teacher" || extra.includes(String(x.name).toLowerCase())) && !excl.includes(String(x.name).toLowerCase())).map((x: any) => String(x.name));
  if (!people.some((p) => p.toLowerCase() === "celine") && extra.includes("celine")) people.push("Celine");
  const invited = people.some((p) => p.toLowerCase() === lc) && (s.mode === "teacher" || lc === "celine");
  const open = Date.now() <= Date.parse(cfg.deadline || "2000-01-01") && !cfg.drawn_at;
  const pub = { title: cfg.title, deadline: cfg.deadline, budget: cfg.budget, open, drawn: !!cfg.drawn_at, reveal: !!cfg.reveal };
  const op = str(b.op, 20);
  const disp = async () => { const { data } = await db.from("coe_xmas").select("person,display"); const m: Record<string, string> = {}; (data || []).forEach((x: any) => m[x.person] = x.display); return m; };
  if (op === "me" || op === "save" || op === "spin" || op === "drop") {
    if (!invited) return out({ ok: true, invited: false, cfg: pub });
    if (op === "save") {
      if (!open) return out({ ok: false, error: "Sign-up is closed" });
      const wish = (Array.isArray(b.wish) ? b.wish : []).map((x: unknown) => str(x, 160)).filter(Boolean).slice(0, 3);
      const row = { person: lc, display: me, joining: !!b.joining, avail: str(b.avail, 400), wish, about: str(b.about, 400), ...(b.joining ? { dropped_at: null } : {}), updated_at: new Date().toISOString() };
      const { error } = await db.from("coe_xmas").upsert(row); if (error) return out({ ok: false, error: "not saved" }, 500);
    }
    if (op === "drop") { const { data, error } = await db.rpc("coe_xmas_drop", { p_person: lc, p_by: me }); if (error) return out({ ok: false, error: "not saved" }, 500); if (!data.ok) return out({ ok: false, error: data.msg }); }
    const [{ data: mine }, { data: d }] = await Promise.all([db.from("coe_xmas").select("joining,avail,wish,about,dropped_at").eq("person", lc).maybeSingle(), db.from("coe_xmas_draw").select("receiver,picked_at,changed").eq("giver", lc).maybeSingle()]);
    let recv: any = null, wheel: string[] = [];
    if (d && (op === "spin" || d.picked_at)) {
      if (op === "spin" && !d.picked_at) await db.from("coe_xmas_draw").update({ picked_at: new Date().toISOString(), changed: false }).eq("giver", lc);
      const { data: r } = await db.from("coe_xmas").select("display,wish,about").eq("person", d.receiver).maybeSingle();
      recv = r ? { name: r.display, wish: r.wish, about: r.about || "" } : null;
      const { data: all } = await db.from("coe_xmas").select("display,person").eq("joining", true); wheel = (all || []).filter((x: any) => x.person !== lc).map((x: any) => x.display);
    }
    const { count: nj } = await db.from("coe_xmas").select("person", { count: "exact", head: true }).eq("joining", true);
    return out({ ok: true, invited: true, answered: !!mine, cfg: pub, me: mine || { joining: false, avail: "", wish: [], about: "" }, inDraw: !!d, changed: !!(d && d.changed && !d.picked_at && op !== "spin"), dropped: !!(mine && mine.dropped_at), picked: !!(d && (d.picked_at || op === "spin")), recv, wheel, joined: nj || 0 });
  }
  if (!ops) return out({ ok: false, error: "Management only" }, 403);
  if (op === "admin") {
    const [{ data: rows }, { data: dr }] = await Promise.all([db.from("coe_xmas").select("person,display,joining,avail,wish,updated_at,dropped_at"), db.from("coe_xmas_draw").select("giver,picked_at,changed")]);
    const R: Record<string, any> = {}; (rows || []).forEach((x: any) => R[x.person] = x);
    const P: Record<string, any> = {}; (dr || []).forEach((x: any) => P[x.giver] = x);
    const list = people.map((p) => { const r = R[p.toLowerCase()]; return { name: p, answered: !!r, joining: !!(r && r.joining), avail: r ? r.avail : "", hasWish: !!(r && (r.wish || []).length), inDraw: !!P[p.toLowerCase()], picked: !!(P[p.toLowerCase()] && P[p.toLowerCase()].picked_at), dropped: !!(r && r.dropped_at) }; });
    return out({ ok: true, cfg: pub, pres, list });
  }
  if (op === "dropfor") { const who = str(b.person, 60).toLowerCase(); if (!people.some((p) => p.toLowerCase() === who)) return out({ ok: false, error: "Not on the list" }); const { data, error } = await db.rpc("coe_xmas_drop", { p_person: who, p_by: me }); if (error) return out({ ok: false, error: "not saved" }, 500); return out({ ok: !!data.ok, msg: data.msg, error: data.ok ? undefined : data.msg }); }
  if (!pres) return out({ ok: false, error: "President only" }, 403);
  if (op === "draw") { const { data, error } = await db.rpc("coe_xmas_do_draw", { p_by: me }); if (error) return out({ ok: false, error: error.message }); return out(data); }
  if (op === "reveal") { const { error } = await db.from("docs").update({ data: { ...cfg, reveal: !!b.on }, updated_at: new Date().toISOString() }).eq("key", "sys:xmas2026"); return out({ ok: !error }); }
  if (op === "pairs") {
    if (!cfg.reveal) return out({ ok: false, error: "Press Reveal first (at the dinner)" });
    const m = await disp(); const { data } = await db.from("coe_xmas_draw").select("giver,receiver");
    return out({ ok: true, pairs: (data || []).map((x: any) => ({ from: m[x.giver] || x.giver, to: m[x.receiver] || x.receiver })) });
  }
  return out({ ok: false, error: "unknown op" }, 400);
});
