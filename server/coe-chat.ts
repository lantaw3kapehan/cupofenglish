// CupOfEnglish · coe-chat (27 Oct 2026 · 1400): Team Chat pilot — groups + direct chats, @mentions, seen/replied receipts,
// needs-reply, confirm, pinned, pictures, time-in auto-post, search, Today/History. History is permanent: nothing is ever deleted
// (teachers can edit, shown "edited"; management can hide, the row stays). Phone alerts go through chat_outbox → coe_push_queue
// (coe_chat_out, every minute, held while the teacher has a class running).
// Pilot flag: docs sys:chat { enabled, pilot:[teacher names], mgmt?:[names] }. Management always sees it when enabled.
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
    const { data: cd } = await db.from("docs").select("data").eq("key", "sys:chat").maybeSingle();
    const cfg: any = (cd && cd.data) || {};
    const pilot: string[] = (Array.isArray(cfg.pilot) ? cfg.pilot : []).map((x: unknown) => String(x).trim()).filter(Boolean);
    if (!cfg.enabled || (!mgmt && !pilot.some((p) => lc(p) === lc(me)))) return out({ ok: true, off: true });
    let mg: string[] = Array.isArray(cfg.mgmt) ? cfg.mgmt.map(String) : [];
    if (!mg.length) { const { data: M } = await db.from("app_sessions").select("name").eq("mode", "mgmt").gt("exp", new Date(Date.now() - 30 * 864e5).toISOString()); mg = [...new Set((M || []).map((x: any) => String(x.name)))]; }
    if (mgmt && !mg.some((x) => lc(x) === lc(me))) mg.push(me);
    const isMg = (n: string) => mg.some((x) => lc(x) === lc(n));
    const everyone = [...new Set([...mg, ...pilot])];
    const members = (gid: string) => gid.startsWith("dm:") ? [...mg, ...pilot.filter((p) => "dm:" + lc(p) === gid)] : everyone;
    const canSee = (gid: string) => !gid.startsWith("dm:") || mgmt || gid === "dm:" + lc(me);
    const need = () => { if (!mgmt) throw new Error("Management only"); };
    const msg = async (id: number) => { const { data } = await db.from("chat_messages").select("*").eq("id", id).maybeSingle(); if (!data || !canSee(data.gid)) throw new Error("Not found"); return data; };
    async function signed(rows: any[]) {
      const P = rows.filter((r) => r.img_path).map((r) => r.img_path); if (!P.length) return rows;
      const { data } = await db.storage.from("chat").createSignedUrls(P, 3600); const U: any = {}; (data || []).forEach((x: any) => { if (x.path) U[x.path] = x.signedUrl; });
      return rows.map((r) => r.img_path ? { ...r, img: U[r.img_path] || null } : r);
    }
    async function decorate(rows: any[]) {
      if (!rows.length) return rows;
      const { data: R } = await db.from("chat_reads").select("mid,name,seen_at,replied_at,confirmed_at").in("mid", rows.map((r) => r.id));
      const by: any = {}; (R || []).forEach((x: any) => { (by[x.mid] = by[x.mid] || []).push(x); });
      return signed(rows.map((r) => { const L = by[r.id] || [], mine = L.find((x: any) => lc(x.name) === lc(me)) || null;
        return { id: r.id, gid: r.gid, author: r.author, mgmt: r.author_mgmt, kind: r.kind, body: r.hidden && !mgmt ? "" : r.body, img_path: r.hidden && !mgmt ? null : r.img_path, meta: r.meta,
          mentions: r.mentions, needs_reply: r.needs_reply, reply_by: r.reply_by, confirm: r.confirm, pinned: r.pinned, hidden: r.hidden, parent_id: r.parent_id, edited: !!r.edited_at,
          day: r.day, at: r.created_at, n: L.length, seen: L.filter((x: any) => x.seen_at).length, replied: L.filter((x: any) => x.replied_at).length, confirmed: L.filter((x: any) => x.confirmed_at).length,
          mine: mine ? { seen: mine.seen_at, replied: mine.replied_at, confirmed: mine.confirmed_at } : null }; }));
    }
    async function groups() {
      const { data: G } = await db.from("chat_groups").select("id,name,kind,sort").order("sort");
      const L = (G || []).filter((g: any) => g.kind === "group");
      if (mgmt) pilot.forEach((p) => L.push({ id: "dm:" + lc(p), name: "Teacher " + p, kind: "direct", sort: 100 }));
      else L.push({ id: "dm:" + lc(me), name: "Management", kind: "direct", sort: 100 });
      const ids = L.map((g: any) => g.id);
      await db.from("chat_groups").upsert(L.filter((g: any) => g.kind === "direct").map((g: any) => ({ id: g.id, name: g.name, kind: "direct", sort: 100 })), { onConflict: "id", ignoreDuplicates: true });
      const { data: U } = await db.from("chat_reads").select("mid,chat_messages!inner(gid,mentions,needs_reply,hidden)").eq("name", me).is("seen_at", null).in("chat_messages.gid", ids).eq("chat_messages.hidden", false).limit(1000);
      const un: any = {}, at: any = {}; (U || []).forEach((x: any) => { const m = x.chat_messages, g = m.gid; un[g] = (un[g] || 0) + 1; if ((m.mentions || []).some((n: string) => lc(n) === lc(me) || n === "all") || m.needs_reply) at[g] = (at[g] || 0) + 1; });
      return L.map((g: any) => ({ id: g.id, name: g.name, kind: g.kind, unread: un[g.id] || 0, tagged: at[g.id] || 0 }));
    }
    async function push(to: string[], title: string, body: string, tag: string) {
      const T = [...new Set(to.filter((n) => n && lc(n) !== lc(me)))]; if (!T.length) return;
      await db.from("chat_outbox").insert(T.map((n) => ({ to_name: n, title: title.slice(0, 80), body: body.slice(0, 160), tag })));
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
      const m = /^data:(image\/(jpeg|png|webp));base64,(.+)$/.exec(String(img || "")); if (!m) throw new Error("Picture not readable");
      const bin = Uint8Array.from(atob(m[3]), (c) => c.charCodeAt(0)); if (bin.length > 400000) throw new Error("Picture too large");
      const path = today + "/" + tag + "-" + crypto.randomUUID().slice(0, 8) + "." + (m[2] === "jpeg" ? "jpg" : m[2]);
      const { error } = await db.storage.from("chat").upload(path, bin, { contentType: m[1], upsert: false }); if (error) throw error; return path;
    }
    async function insertMsg(row: any) {
      const { data, error } = await db.from("chat_messages").insert(row).select("*").single(); if (error) throw error;
      const rec = members(row.gid).filter((n) => lc(n) !== lc(me));
      if (rec.length) await db.from("chat_reads").insert(rec.map((n) => ({ mid: data.id, name: n })));
      return data;
    }

    if (a === "init") {
      return out({ ok: true, me, mgmt, today, members: everyone.map((n) => ({ name: n, mgmt: isMg(n) })), groups: await groups(),
        quick: QUICK, ready: mgmt ? ["Please redo your time-in check now (tap Redo now on Today).", "You're late for your class. Please join now and reply here.", "Substitute needed at [time] for [student]. Who can take it?"] : [] });
    }
    if (a === "poll") {
      const { data: L } = await db.from("chat_messages").select("id").order("id", { ascending: false }).limit(1);
      return out({ ok: true, last: L && L[0] ? L[0].id : 0, groups: await groups(), today });
    }
    if (a === "list") {
      const gid = str(b.gid, 60); if (!canSee(gid)) throw new Error("Not found"); const day = /^\d{4}-\d{2}-\d{2}$/.test(String(b.day || "")) ? String(b.day) : today;
      let q = db.from("chat_messages").select("*").eq("gid", gid).eq("day", day).order("id").limit(500); if (!mgmt) q = q.eq("hidden", false);
      const { data: M } = await q;
      const { data: P } = await db.from("chat_messages").select("*").eq("gid", gid).eq("pinned", true).eq("hidden", false).order("id", { ascending: false }).limit(5);
      let open: any[] = [];
      if (day === today) {
        const { data: O } = await db.from("chat_messages").select("*").eq("gid", gid).lt("day", today).eq("hidden", false).or("needs_reply.eq.true,confirm.eq.true").gte("created_at", new Date(Date.now() - 30 * 864e5).toISOString()).order("id", { ascending: false }).limit(40);
        const D = await decorate(O || []);
        open = D.filter((m: any) => mgmt ? (m.needs_reply ? m.replied < m.n : m.confirmed < m.n) : (m.mine && (m.needs_reply ? !m.mine.replied : !m.mine.confirmed))).slice(0, 10);
      }
      return out({ ok: true, gid, day, today, msgs: await decorate(M || []), pinned: await decorate(P || []), open, members: members(gid) });
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
      const body = str(b.body, 2000), parent = Number(b.parent_id) || null; let img_path = null;
      if (b.img) img_path = await upload(String(b.img), "m");
      if (!body && !img_path) throw new Error("Empty message");
      const mem = members(gid); let men = (Array.isArray(b.mentions) ? b.mentions : []).map(String).filter((n: string) => n === "all" || mem.some((x) => lc(x) === lc(n)));
      men = [...new Set(men.map((n: string) => n === "all" ? "all" : mem.find((x) => lc(x) === lc(n))!))];
      const nr = mgmt && !!b.needs_reply, cf = mgmt && !!b.confirm;
      const row = { gid, author: me, author_mgmt: mgmt, kind: img_path ? "image" : (QUICK.includes(body) && parent ? "quick" : "text"), body, img_path, mentions: men, needs_reply: nr,
        reply_by: nr && b.reply_by ? new Date(String(b.reply_by)).toISOString() : null, confirm: cf, pinned: mgmt && !!b.pin, parent_id: parent };
      const m = await insertMsg(row);
      await markReplied(gid, parent);
      const gname = gid.startsWith("dm:") ? (mgmt ? "Management" : "Teacher " + me) : ((await db.from("chat_groups").select("name").eq("id", gid).maybeSingle()).data?.name || "Team Chat");
      const others = mem.filter((n) => lc(n) !== lc(me));
      let to: string[] = men.includes("all") || gid === "ann" || nr || cf ? others : men;
      if (gid.startsWith("dm:")) to = others;
      await push(to, me + " · " + gname, (men.length ? "Tagged you: " : "") + (body || "Sent a picture"), "chat-" + m.id);
      return out({ ok: true, msg: (await decorate([m]))[0] });
    }
    if (a === "quick") {
      const p = await msg(Number(b.id)); const t = QUICK.includes(String(b.text)) ? String(b.text) : "Noted";
      const m = await insertMsg({ gid: p.gid, author: me, author_mgmt: mgmt, kind: "quick", body: t, parent_id: p.id, mentions: [] });
      await markReplied(p.gid, p.id);
      if (p.author_mgmt && !mgmt) await push([p.author], me + " replied · " + t, p.body.slice(0, 120), "chat-" + m.id);
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
      return out({ ok: true, id: m.id });
    }
    if (a === "presence") {
      const { data: P } = await db.from("coe_presence").select("name,at").gte("at", new Date(Date.now() - 24 * 3600e3).toISOString());
      const { data: C } = await db.from("classes").select("teachers").eq("day", today).lte("starts_at", now).gt("ends_at", now).eq("cancelled", false);
      const inC = new Set((C || []).flatMap((c: any) => (c.teachers || []).map((t: string) => lc(t)))), last: any = {};
      (P || []).forEach((x: any) => { const k = lc(x.name); if (!last[k] || x.at > last[k]) last[k] = x.at; });
      return out({ ok: true, members: everyone.map((n) => ({ name: n, mgmt: isMg(n), last: last[lc(n)] || null, online: !!last[lc(n)] && Date.now() - new Date(last[lc(n)]).getTime() < 3 * 60e3, inClass: inC.has(lc(n)) })) });
    }
    return out({ ok: false, error: "Unknown action" }, 400);
  } catch (e) { return out({ ok: false, error: String((e as any)?.message || e) }); }
});
