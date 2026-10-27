// CupOfEnglish · coe-chat (27 Oct 2026 · 1400–1415): Team Chat — groups + direct chats, @mentions, seen/replied receipts,
// needs-reply, confirm, pinned, pictures (up to 5 per message), voice, time-in auto-post, search, Today/History, alerts for every group message
// (merged, mutable), management roster (add / remove a teacher), retry-safe sending (cid). Teachers never receive other people's presence or
// per-person receipts. Kept in CupOfEnglish's database: nothing is deleted by the app (teachers can edit, shown "edited"; management can hide).
// Phone alerts: chat_outbox → coe_push_queue (coe_chat_out, every minute, held while the teacher has a class running, merged per person).
// Flag: docs sys:chat { enabled, pilot:[teacher names] | "*", exclude?:[names], gx?:{ groupId:[names left out] }, mgmt?:[names], alias?:{account:name} }.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
const str = (x: unknown, n = 2000) => String(x == null ? "" : x).trim().slice(0, n);
const lc = (s: string) => String(s || "").trim().toLowerCase();
const mnl = (t = Date.now()) => new Date(t + 8 * 3600e3).toISOString().slice(0, 10);
const QUICK = ["Noted", "On it", "Done"];
// 1406 speed: the settings doc (10 s) and the active-teacher list (5 min; built from 30 days of sign-ins and classes) are cached per
// server instance instead of being rebuilt on every 4-second poll. Adding / removing a teacher clears both at once.
let CFG: { at: number; data: any } | null = null;
let ROS: { at: number; nm: Record<string, string> } | null = null;
let GRP: { at: number; rows: any[] } | null = null;
async function activeTeachers(): Promise<Record<string, string>> {
  if (ROS && Date.now() - ROS.at < 300e3) return { ...ROS.nm };
  const since = new Date(Date.now() - 30 * 864e5).toISOString();
  const [{ data: TS }, { data: TC }] = await Promise.all([
    db.from("app_sessions").select("name").eq("mode", "teacher").gt("exp", since),
    db.from("classes").select("teachers").gte("day", since.slice(0, 10)).eq("cancelled", false).limit(20000)]);
  const nm: Record<string, string> = {}; (TS || []).forEach((x: any) => { nm[lc(x.name)] = String(x.name); });
  (TC || []).forEach((c: any) => (c.teachers || []).forEach((t: string) => { const k = lc(t); if (k && !nm[k]) nm[k] = k.charAt(0).toUpperCase() + k.slice(1); }));
  ROS = { at: Date.now(), nm }; return { ...nm };
}

Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: s } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
  const mgmt = s.mode === "mgmt", me = String(s.name || ""), a = String(b.action || ""), now = new Date().toISOString(), today = mnl();
  try {
    if (!CFG || Date.now() - CFG.at > 10e3) { const { data: cd } = await db.from("docs").select("data").eq("key", "sys:chat").maybeSingle(); CFG = { at: Date.now(), data: (cd && cd.data) || {} }; }
    const cfg: any = JSON.parse(JSON.stringify(CFG.data));
    const alias: Record<string, string> = cfg.alias && typeof cfg.alias === "object" ? cfg.alias : {};
    const dn = (n: string) => alias[n] || n;
    const ALL = cfg.pilot === "*" || (Array.isArray(cfg.pilot) && cfg.pilot.includes("*"));
    let pilot: string[] = ALL ? [] : (Array.isArray(cfg.pilot) ? cfg.pilot : []).map((x: unknown) => String(x).trim()).filter(Boolean);
    if (!cfg.enabled || (!mgmt && !ALL && !pilot.some((p) => lc(p) === lc(me)))) return out({ ok: true, off: true });
    if (!mgmt && ALL && /^zz/i.test(me) && !cfg.allowTest) return out({ ok: true, off: true });
    if (!mgmt && Array.isArray(cfg.exclude) && cfg.exclude.some((x: unknown) => lc(String(x)) === lc(me))) return out({ ok: true, off: true });   // (Misty) not in Team Chat
    let mg: string[] = Array.isArray(cfg.mgmt) ? cfg.mgmt.map(String) : [];
    if (!mg.length) { const { data: M } = await db.from("app_sessions").select("name").eq("mode", "mgmt").gt("exp", new Date(Date.now() - 30 * 864e5).toISOString()); mg = [...new Set((M || []).map((x: any) => String(x.name)))]; }
    if (mgmt && !mg.some((x) => lc(x) === lc(me))) mg.push(me);
    if (ALL) {   // every active teacher: signed in during the last 30 days or taught a class in the last 30 days
      const nm = await activeTeachers();
      const skip = new Set([...mg.map(lc), ...Object.values(alias).map(lc), ...(Array.isArray(cfg.exclude) ? cfg.exclude.map((x: unknown) => lc(String(x))) : [])]);
      pilot = Object.keys(nm).filter((k) => !skip.has(k) && !/^zz/.test(k) && !/test/.test(k)).map((k) => nm[k]).sort();
      if (!mgmt && !pilot.some((p) => lc(p) === lc(me))) pilot.push(me);
    }
    const isMg = (n: string) => mg.some((x) => lc(x) === lc(n));
    if (Array.isArray(cfg.exclude)) { const ex = new Set(cfg.exclude.map((x: unknown) => lc(String(x)))); pilot = pilot.filter((p) => !ex.has(lc(p))); }
    const everyone = [...new Set([...mg, ...pilot])];
    // 1413 (Misty 23:27): per-group membership · sys:chat gx = { groupId: [teacher names left out of that group] }; checked here on every action
    const gx: Record<string, string[]> = cfg.gx && typeof cfg.gx === "object" ? cfg.gx : {};
    const inGroup = (n: string, gid: string) => isMg(n) || !(Array.isArray(gx[gid]) ? gx[gid] : []).some((x) => lc(String(x)) === lc(n));
    const members = (gid: string) => gid.startsWith("dm:") ? [...mg, ...pilot.filter((p) => "dm:" + lc(p) === gid)] : everyone.filter((n) => inGroup(n, gid));
    const canSee = (gid: string) => gid.startsWith("dm:") ? (mgmt || gid === "dm:" + lc(me)) : (mgmt || inGroup(me, gid));
    const need = () => { if (!mgmt) throw new Error("Management only"); };
    const msg = async (id: number) => { const { data } = await db.from("chat_messages").select("*").eq("id", id).maybeSingle(); if (!data || !canSee(data.gid)) throw new Error("Not found"); return data; };
    async function signed(rows: any[]) {
      const P = rows.flatMap((r) => r.img_path ? [r.img_path, ...((r.meta && Array.isArray(r.meta.imgs)) ? r.meta.imgs : [])] : []); if (!P.length) return rows;
      const { data } = await db.storage.from("chat").createSignedUrls([...new Set(P)], 3600); const U: any = {}; (data || []).forEach((x: any) => { if (x.path) U[x.path] = x.signedUrl; });
      return rows.map((r) => r.img_path ? { ...r, img: U[r.img_path] || null, imgs: r.meta && Array.isArray(r.meta.imgs) ? r.meta.imgs.map((x: string) => U[x] || null).filter(Boolean) : null } : r);
    }
    async function decorate(rows: any[]) {
      if (!rows.length) return rows;
      const { data: R } = await db.from("chat_reads").select("mid,name,seen_at,replied_at,confirmed_at").in("mid", rows.map((r) => r.id));
      const by: any = {}; (R || []).forEach((x: any) => { (by[x.mid] = by[x.mid] || []).push(x); });
      const pids = [...new Set(rows.filter((r) => r.parent_id).map((r) => r.parent_id))], PQ: any = {};
      if (pids.length) { const { data: PP } = await db.from("chat_messages").select("id,author,body,kind,hidden").in("id", pids); (PP || []).forEach((x: any) => { PQ[x.id] = { author: x.author, body: x.hidden ? "" : String(x.body || (x.kind === "voice" ? "Voice message" : "Picture")).slice(0, 120) }; }); }
      return signed(rows.map((r) => { const L0 = by[r.id] || [], mine = L0.find((x: any) => lc(x.name) === lc(me)) || null;
        const L = mgmt || lc(r.author) === lc(me) ? L0 : [];   // (Misty 20:24) teachers get receipt numbers only for their own messages
        return { id: r.id, gid: r.gid, author: r.author, mgmt: r.author_mgmt, kind: r.kind, body: r.hidden && !mgmt ? "" : r.body, img_path: r.hidden && !mgmt ? null : r.img_path, meta: r.meta,
          quote: r.parent_id ? PQ[r.parent_id] || null : null, mentions: r.mentions, needs_reply: r.needs_reply, reply_by: r.reply_by, confirm: r.confirm, pinned: r.pinned, hidden: r.hidden, parent_id: r.parent_id, edited: !!r.edited_at,
          day: r.day, at: r.created_at, n: L.length, seen: L.filter((x: any) => x.seen_at).length, replied: L.filter((x: any) => x.replied_at).length, confirmed: L.filter((x: any) => x.confirmed_at).length,
          mine: mine ? { seen: mine.seen_at, replied: mine.replied_at, confirmed: mine.confirmed_at } : null, ...(mgmt || lc(r.author) === lc(me) ? {} : { replied: 0, confirmed: 0 }) }; }));
    }
    async function groups(up = false) {
      const [G, { data: U }] = await Promise.all([
        GRP && Date.now() - GRP.at < 60e3 ? Promise.resolve(GRP.rows) : db.from("chat_groups").select("id,name,kind,sort").eq("kind", "group").order("sort").then((r: any) => { GRP = { at: Date.now(), rows: r.data || [] }; return GRP.rows; }),
        db.from("chat_reads").select("mid,chat_messages!inner(gid,mentions,needs_reply,hidden)").eq("name", me).is("seen_at", null).eq("chat_messages.hidden", false).limit(1000)]);
      const L = (G || []).filter((g: any) => g.kind === "group").map((g: any) => ({ ...g }));
      if (mgmt) pilot.forEach((p) => L.push({ id: "dm:" + lc(p), name: "Teacher " + p, kind: "direct", sort: 100 }));
      else L.push({ id: "dm:" + lc(me), name: "Management", kind: "direct", sort: 100 });
      const ids = L.map((g: any) => g.id);
      if (up) await db.from("chat_groups").upsert(L.filter((g: any) => g.kind === "direct").map((g: any) => ({ id: g.id, name: g.name, kind: "direct", sort: 100 })), { onConflict: "id", ignoreDuplicates: true });
      const un: any = {}, at: any = {}; (U || []).forEach((x: any) => { const m = x.chat_messages, g = m.gid; if (!ids.includes(g)) return; un[g] = (un[g] || 0) + 1; if ((m.mentions || []).some((n: string) => lc(n) === lc(me) || n === "all") || m.needs_reply) at[g] = (at[g] || 0) + 1; });
      return L.filter((g: any) => canSee(g.id)).map((g: any) => ({ id: g.id, name: g.name, kind: g.kind, unread: un[g.id] || 0, tagged: at[g.id] || 0 }));
    }
    async function push(to: string[], title: string, body: string, tag: string, soft = false) {
      let T = [...new Set(to.filter((n) => n && lc(n) !== lc(me)))]; if (!T.length) return;
      if (soft) { const gid = tag.split("|")[1] || ""; const { data: Mu } = await db.from("chat_mutes").select("name").eq("gid", gid); const mu = new Set((Mu || []).map((x: any) => lc(x.name))); T = T.filter((n) => !mu.has(lc(n))); if (!T.length) return; }
      // soft (plain group message): wait ~45 s so a burst becomes one alert (coe_chat_out merges per person)
      await db.from("chat_outbox").insert(T.map((n) => ({ to_name: n, title: title.slice(0, 80), body: body.slice(0, 160), tag: tag.split("|")[0], release_at: soft ? new Date(Date.now() + 45e3).toISOString() : now })));
    }
    async function markReplied(gid: string, parent: number | null) {
      const since = new Date(Date.now() - 3 * 864e5).toISOString();
      const { data: O } = await db.from("chat_messages").select("id,mentions,needs_reply").eq("gid", gid).neq("author", me).gte("created_at", since).eq("hidden", false);
      const ids = (O || []).filter((m: any) => m.id === parent || m.needs_reply || (m.mentions || []).some((n: string) => lc(n) === lc(me))).map((m: any) => m.id);
      if (parent && !ids.includes(parent)) ids.push(parent);
      if (ids.length) await db.from("chat_reads").update({ replied_at: now, seen_at: now }).eq("name", me).is("replied_at", null).in("mid", ids);
      if (ids.length) await db.from("chat_reads").update({ seen_at: now }).eq("name", me).is("seen_at", null).in("mid", ids);
    }
    async function upload(img: string, tag: string) {
      const m = /^data:((image|audio)\/(jpeg|png|webp|webm|ogg|mp4|aac|mpeg))(?:;codecs=[^;,]+)?;base64,(.+)$/.exec(String(img || "")); if (!m) throw new Error("File not readable");
      const bin = Uint8Array.from(atob(m[4]), (c) => c.charCodeAt(0)); if (bin.length > (m[2] === "audio" ? 1200000 : 400000)) throw new Error("File too large");
      const path = today + "/" + tag + "-" + crypto.randomUUID().slice(0, 8) + "." + (m[3] === "jpeg" ? "jpg" : m[3] === "mp4" && m[2] === "audio" ? "m4a" : m[3]);
      const { error } = await db.storage.from("chat").upload(path, bin, { contentType: m[1], upsert: false }); if (error) throw error; return path;
    }
    async function insertMsg(row: any) {
      const { data, error } = await db.from("chat_messages").insert(row).select("*").single(); if (error) throw error;
      const rec = members(row.gid).filter((n) => lc(n) !== lc(me));
      if (rec.length) await db.from("chat_reads").insert(rec.map((n) => ({ mid: data.id, name: n })));
      return data;
    }

    if (a === "init") {
      const { data: MU } = await db.from("chat_mutes").select("gid").eq("name", me);
      return out({ ok: true, me, mgmt, today, alias, muted: (MU || []).map((x: any) => x.gid), members: everyone.map((n) => ({ name: n, mgmt: isMg(n) })), groups: await groups(true),
        quick: QUICK, ready: mgmt ? ["Please redo your time-in check now (tap Redo now on Today).", "You're late for your class. Please join now and reply here.", "Substitute needed at [time] for [student]. Who can take it?"] : [] });
    }
    if (a === "roster" || a === "member") {   // management: who is in Team Chat (applies to every group and direct chat)
      need();
      if (a === "member" && b.gid) {   // 1413: one group only (e.g. Time-in only); the teacher's chat with management is not affected
        const who = str(b.name, 40), gid = str(b.gid, 60); if (!who) throw new Error("Pick a teacher");
        const { data: G1 } = await db.from("chat_groups").select("id,name,kind").eq("id", gid).maybeSingle(); if (!G1 || G1.kind !== "group") throw new Error("Pick a group");
        const { data: cur } = await db.from("docs").select("data").eq("key", "sys:chat").maybeSingle(); const base = (cur && cur.data) || cfg;
        const GX: Record<string, string[]> = base.gx && typeof base.gx === "object" ? { ...base.gx } : {}; const L0 = (Array.isArray(GX[gid]) ? GX[gid] : []).map(String), has = L0.some((x) => lc(x) === lc(who));
        if (b.on ? has : !has) {
          GX[gid] = b.on ? L0.filter((x) => lc(x) !== lc(who)) : [...L0, who]; if (!GX[gid].length) delete GX[gid];
          await db.from("docs").update({ data: { ...base, gx: GX }, updated_at: now }).eq("key", "sys:chat"); CFG = null;
          await db.from("chat_messages").insert({ gid: /^zz/i.test(who) ? "zztest" : gid, author: me, author_mgmt: true, kind: "system", body: dn(me) + (b.on ? " added Teacher " + who + " to " : " removed Teacher " + who + " from ") + G1.name, mentions: [] });
        }
        cfg.gx = GX; for (const k of Object.keys(gx)) delete gx[k]; Object.assign(gx, GX);
      } else if (a === "member") {
        const who = str(b.name, 40); if (!who) throw new Error("Pick a teacher");
        const ex: string[] = Array.isArray(cfg.exclude) ? cfg.exclude.map(String) : [], has = ex.some((x) => lc(x) === lc(who));
        const next = b.on ? ex.filter((x) => lc(x) !== lc(who)) : (has ? ex : [...ex, who]);
        if (b.on ? has : !has) {   // a real change: save it, log it in All Teachers (kept in the database), stop alerts already waiting
          const { data: cur } = await db.from("docs").select("data").eq("key", "sys:chat").maybeSingle();
          await db.from("docs").update({ data: { ...((cur && cur.data) || cfg), exclude: next }, updated_at: now }).eq("key", "sys:chat"); CFG = null; ROS = null;
          await db.from("chat_messages").insert({ gid: /^zz/i.test(who) ? "zztest" : "all", author: me, author_mgmt: true, kind: "system", body: dn(me) + (b.on ? " added Teacher " : " removed Teacher ") + who, mentions: [] });
          if (!b.on) await db.from("chat_outbox").update({ queued_at: now }).is("queued_at", null).ilike("to_name", who);
        }
        cfg.exclude = next;
      }
      const nm = await activeTeachers();
      (Array.isArray(cfg.exclude) ? cfg.exclude : []).forEach((x: string) => { if (!nm[lc(x)]) nm[lc(x)] = String(x); });
      const exs = new Set((Array.isArray(cfg.exclude) ? cfg.exclude : []).map((x: string) => lc(x)));
      const { data: GG } = await db.from("chat_groups").select("id,name,kind,sort").eq("kind", "group").order("sort");
      const glist = (GG || []).filter((g: any) => g.id !== "ann").map((g: any) => ({ id: g.id, name: g.name }));
      const list = Object.keys(nm).filter((k) => !mg.some((x) => lc(x) === k) && !/^zz/.test(k) && !/test/.test(k)).sort().map((k) => ({ name: nm[k], in: !exs.has(k), groups: glist.filter((g: any) => inGroup(nm[k], g.id)).map((g: any) => g.id) }));
      return out({ ok: true, teachers: list, groups: glist });
    }
    if (a === "mute") {
      const gid = str(b.gid, 60); if (!canSee(gid) || gid === "ann") throw new Error("This group can't be muted");
      if (b.on) await db.from("chat_mutes").upsert({ name: me, gid }, { onConflict: "name,gid" }); else await db.from("chat_mutes").delete().eq("name", me).eq("gid", gid);
      return out({ ok: true });
    }
    if (a === "poll") {
      const [{ data: L }, C, gr] = await Promise.all([   // 1406: the three look-ups run side by side
        db.from("chat_messages").select("id").order("id", { ascending: false }).limit(1),
        mgmt ? Promise.resolve(null) : db.from("classes").select("id").eq("day", today).lte("starts_at", now).gt("ends_at", now).eq("cancelled", false).contains("teachers", [lc(me)]).limit(1).then((r: any) => r.data),
        groups()]);
      return out({ ok: true, last: L && L[0] ? L[0].id : 0, groups: gr, today, inClass: !!(C && C.length) });
    }
    if (a === "list") {
      const gid = str(b.gid, 60); if (!canSee(gid)) throw new Error("Not found"); const day = /^\d{4}-\d{2}-\d{2}$/.test(String(b.day || "")) ? String(b.day) : today;
      let q = db.from("chat_messages").select("*").eq("gid", gid).eq("day", day).order("id").limit(500); if (!mgmt) q = q.eq("hidden", false);
      const [{ data: M }, { data: P }, O] = await Promise.all([q,   // 1406: the three look-ups (and their receipts) run side by side
        db.from("chat_messages").select("*").eq("gid", gid).eq("pinned", true).eq("hidden", false).order("id", { ascending: false }).limit(5),
        day === today ? db.from("chat_messages").select("*").in("gid", gid === "all" ? ["all", "ann"] : [gid]).lte("day", today).eq("hidden", false).or("needs_reply.eq.true,confirm.eq.true").gte("created_at", new Date(Date.now() - 30 * 864e5).toISOString()).order("id", { ascending: false }).limit(40).then((r: any) => r.data || []) : Promise.resolve([])]);
      const [DM, DP, DO] = await Promise.all([decorate(M || []), decorate(P || []), decorate(O || [])]);
      // 1406: Announcements left the channel list (Misty 21:13); their open Confirm / Needs reply items show in All Teachers until done
      const open = DO.filter((m: any) => m.gid !== gid || m.day < today).filter((m: any) => mgmt ? (m.needs_reply ? m.replied < m.n : m.confirmed < m.n) : (m.mine && (m.needs_reply ? !m.mine.replied : !m.mine.confirmed))).slice(0, 10);
      return out({ ok: true, gid, day, today, msgs: DM, pinned: DP, open, members: members(gid) });
    }
    if (a === "todo") {   // 1415 (Misty 23:27): open chat items for Today · Needs reply / @name / Confirm not answered yet (last 3 days, visible chats only)
      const since = new Date(Date.now() - 3 * 864e5).toISOString();
      const [{ data: R }, G] = await Promise.all([db.from("chat_reads").select("mid,replied_at,confirmed_at,chat_messages!inner(id,gid,author,author_mgmt,body,kind,mentions,needs_reply,reply_by,confirm,hidden,created_at,day)").eq("name", me).eq("chat_messages.hidden", false).gte("chat_messages.created_at", since).order("mid", { ascending: false }).limit(300), groups()]);
      const gn: Record<string, string> = {}; (G || []).forEach((g: any) => { gn[g.id] = g.name; });
      const items = (R || []).flatMap((x: any) => { const m = x.chat_messages; if (!m || !gn[m.gid] || lc(m.author) === lc(me) || m.kind === "system") return [];
        const named = (m.mentions || []).some((n: string) => lc(n) === lc(me));
        const base = { id: m.id, gid: m.gid, chat: gn[m.gid], author: m.author, mgmt: m.author_mgmt, body: String(m.body || (m.kind === "voice" ? "Voice message" : m.kind === "image" ? "Picture" : "")).slice(0, 140), day: m.day, at: m.created_at, by: m.reply_by };
        if (m.confirm && !x.confirmed_at) return [{ ...base, kind: "confirm" }];
        if ((m.needs_reply || named) && !x.replied_at) return [{ ...base, kind: "reply" }];
        return []; }).slice(0, 12);
      return out({ ok: true, items });
    }
    if (a === "days") {
      const gid = str(b.gid, 60); if (!canSee(gid)) throw new Error("Not found");
      const { data } = await db.from("chat_messages").select("day").eq("gid", gid).lt("day", today).eq("hidden", false).order("day", { ascending: false }).limit(5000);
      const c: any = {}; (data || []).forEach((x: any) => { c[x.day] = (c[x.day] || 0) + 1; });
      return out({ ok: true, days: Object.keys(c).sort().reverse().slice(0, 90).map((d) => ({ day: d, n: c[d] })) });
    }
    if (a === "seen") {
      const ids = (Array.isArray(b.ids) ? b.ids : []).map(Number).filter((x: number) => x > 0).slice(0, 500);
      if (ids.length) await db.from("chat_reads").update({ seen_at: now }).eq("name", me).is("seen_at", null).in("mid", ids);
      return out({ ok: true });
    }
    if (a === "send") {
      const gid = str(b.gid, 60); if (!canSee(gid)) throw new Error("Not found"); if (gid === "ann" && !mgmt) throw new Error("Only management posts announcements");
      if (gid === "timein" && !mgmt) throw new Error("Time-in cards post here by themselves");
      const cid = str(b.cid, 40), ckey = cid ? "c:" + lc(me) + ":" + cid : null;   // a retry of the same message never posts twice
      if (ckey) { const { data: ex } = await db.from("chat_messages").select("*").eq("ukey", ckey).maybeSingle(); if (ex) return out({ ok: true, msg: (await decorate([ex]))[0], again: true }); }
      const body = str(b.body, 2000), parent = Number(b.parent_id) || null; let img_path = null;
      const imgP: string[] = [];   // 1405: up to 5 pictures in one message (first in img_path, all in meta.imgs)
      if (Array.isArray(b.imgs) && b.imgs.length) { for (const x of b.imgs.slice(0, 5)) imgP.push(await upload(String(x), "m")); img_path = imgP[0]; }
      else if (b.img) img_path = await upload(String(b.img), "m"); else if (b.voice) img_path = await upload(String(b.voice), "v");
      if (!body && !img_path) throw new Error("Empty message");
      const mem = members(gid); let men = (Array.isArray(b.mentions) ? b.mentions : []).map(String).filter((n: string) => n === "all" || mem.some((x) => lc(x) === lc(n)));
      men = [...new Set(men.map((n: string) => n === "all" ? "all" : mem.find((x) => lc(x) === lc(n))!))];
      const nr = mgmt && !!b.needs_reply, cf = mgmt && !!b.confirm;
      const row = { gid, author: me, author_mgmt: mgmt, kind: b.voice && img_path ? "voice" : img_path ? "image" : (QUICK.includes(body) && parent ? "quick" : "text"), body, img_path, mentions: men, needs_reply: nr,
        reply_by: nr && b.reply_by ? new Date(String(b.reply_by)).toISOString() : null, confirm: cf, pinned: mgmt && !!b.pin, parent_id: parent, ukey: ckey, meta: imgP.length > 1 ? { imgs: imgP } : null };
      const m = await insertMsg(row);
      await markReplied(gid, parent);
      const gname = gid.startsWith("dm:") ? (mgmt ? "Management" : "Teacher " + me) : ((await db.from("chat_groups").select("name").eq("id", gid).maybeSingle()).data?.name || "Team Chat");
      const others = mem.filter((n) => lc(n) !== lc(me));
      const loud: string[] = men.includes("all") || gid === "ann" || nr || cf || gid.startsWith("dm:") ? others : men;
      const what = body || (b.voice ? "Voice message" : imgP.length > 1 ? "Sent " + imgP.length + " pictures" : "Sent a picture");
      await push(loud, dn(me) + " · " + gname, (men.length ? "Tagged you: " : "") + what, "chat-at-" + m.id);   // chat-at-*: urgent (sw.js keeps it on screen)
      await push(others.filter((n) => !loud.some((x) => lc(x) === lc(n))), dn(me) + " · " + gname, what, "chat-" + m.id + "|" + gid, true);
      return out({ ok: true, msg: (await decorate([m]))[0] });
    }
    if (a === "quick") {
      const p = await msg(Number(b.id)); const t = QUICK.includes(String(b.text)) ? String(b.text) : "Noted";
      const m = await insertMsg({ gid: p.gid, author: me, author_mgmt: mgmt, kind: "quick", body: t, parent_id: p.id, mentions: [] });
      await markReplied(p.gid, p.id);
      if (p.author_mgmt && !mgmt) await push([p.author], dn(me) + " replied · " + t, p.body.slice(0, 120), "chat-" + m.id);
      return out({ ok: true, msg: (await decorate([m]))[0] });
    }
    if (a === "confirm") {
      const p = await msg(Number(b.id)); await db.from("chat_reads").update({ confirmed_at: now, seen_at: now }).eq("mid", p.id).eq("name", me).is("confirmed_at", null); return out({ ok: true });
    }
    if (a === "edit") {
      const p = await msg(Number(b.id)); if (lc(p.author) !== lc(me)) throw new Error("Only the writer can edit"); const body = str(b.body, 2000); if (!body) throw new Error("Empty message");
      await db.from("chat_messages").update({ body, edited_at: now, updated_at: now }).eq("id", p.id); return out({ ok: true });
    }
    if (a === "hide") { need(); const p = await msg(Number(b.id)); await db.from("chat_messages").update({ hidden: !!b.on, hidden_by: b.on ? me : null, updated_at: now }).eq("id", p.id); return out({ ok: true }); }
    if (a === "pin") { need(); const p = await msg(Number(b.id)); await db.from("chat_messages").update({ pinned: !!b.on, updated_at: now }).eq("id", p.id); return out({ ok: true }); }
    if (a === "readers") {
      need();   // (Misty 20:24) who saw what, and when, is for management only
      const p = await msg(Number(b.id)); const { data: R } = await db.from("chat_reads").select("name,seen_at,replied_at,confirmed_at").eq("mid", p.id);
      return out({ ok: true, readers: (R || []).sort((x: any, y: any) => String(x.seen_at || "9").localeCompare(String(y.seen_at || "9"))) });
    }
    if (a === "search") {
      const ids = (await groups()).map((g: any) => g.id); let q = db.from("chat_messages").select("*").in("gid", ids).eq("hidden", false).order("id", { ascending: false }).limit(60);
      const t = str(b.q, 80); if (t) q = q.ilike("body", "%" + t.replace(/[%_]/g, "") + "%");
      const who = str(b.who, 40); if (who) q = q.ilike("author", who);
      if (/^\d{4}-\d{2}-\d{2}$/.test(String(b.from || ""))) q = q.gte("day", String(b.from));
      if (/^\d{4}-\d{2}-\d{2}$/.test(String(b.to || ""))) q = q.lte("day", String(b.to));
      const { data } = await q; return out({ ok: true, msgs: await decorate(data || []) });
    }
    if (a === "timein") {
      if (mgmt) throw new Error("Teachers only"); const ukey = "ti:" + today + ":" + lc(me), path = await upload(String(b.img || ""), "ti-" + lc(me));
      const meta = { ...(b.meta && typeof b.meta === "object" ? b.meta : {}), redo: !!b.redo }; const body = str(b.body, 300) || ("Time-in " + (meta.time || ""));
      const { data: ex } = await db.from("chat_messages").select("id").eq("ukey", ukey).maybeSingle();
      if (ex) { await db.from("chat_messages").update({ img_path: path, meta, body, edited_at: b.redo ? now : null, updated_at: now }).eq("id", ex.id); return out({ ok: true, id: ex.id, replaced: true }); }
      const m = await insertMsg({ gid: "timein", author: me, author_mgmt: false, kind: "timein", body, img_path: path, meta, ukey, mentions: [] });
      await push(everyone, dn(me) + " · Time-in", body, "chat-" + m.id + "|timein", true);
      return out({ ok: true, id: m.id });
    }
    if (a === "presence" && !mgmt) return out({ ok: true, members: everyone.map((n) => ({ name: n, mgmt: isMg(n) })) });   // (Misty 20:24) teachers: names only
    if (a === "presence") {
      const { data: P } = await db.from("coe_presence").select("name,at").gte("at", new Date(Date.now() - 7 * 864e5).toISOString());
      const NOW = Date.now(), soon = new Date(NOW + 2 * 3600e3).toISOString();
      const { data: C } = await db.from("classes").select("teachers,starts_at,ends_at").eq("day", today).lt("starts_at", soon).gt("ends_at", now).eq("cancelled", false);
      const until: any = {}, next: any = {}, last: any = {};
      (C || []).forEach((c: any) => (c.teachers || []).forEach((t: string) => { const k = lc(t), st = Date.parse(c.starts_at), en = Date.parse(c.ends_at);
        if (st <= NOW) { if (!until[k] || en > until[k]) until[k] = en; } else if (!next[k] || st < next[k]) next[k] = st; }));
      (P || []).forEach((x: any) => { const k = lc(x.name); if (!last[k] || x.at > last[k]) last[k] = x.at; });
      const iso = (t: number) => t ? new Date(t).toISOString() : null;
      return out({ ok: true, members: everyone.map((n) => { const k = lc(n); return { name: n, mgmt: isMg(n), last: last[k] || null, online: !!last[k] && NOW - new Date(last[k]).getTime() < 3 * 60e3, inClass: !!until[k], until: iso(until[k]), next: iso(next[k]) }; }) });
    }
    return out({ ok: false, error: "Unknown action" }, 400);
  } catch (e) { return out({ ok: false, error: String((e as any)?.message || e) }); }
});
