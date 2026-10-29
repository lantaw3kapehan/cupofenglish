// CupOfEnglish · coe-late (29 Oct 2026 · 1670, approved by Misty 19:14 "ensure language is standard and policy-based"):
// the automatic System notice for a recorded late (Late time-in / Late to class) and the teacher's one reply to it.
// Database only (no Google). Tables: log_rows (T-TIMEIN), sheet_rows (POLICY, T-DASH), late_explain (new, server-only), writes, coe_speed.
// Pictures: private storage bucket "late-proof" (signed links, 1 hour).
// POST { token, action, ... }
//   mine   {}                         → teacher: her own lates (last 40 days) with class, device, internet, proof link, decision,
//                                        the POLICY amounts for her rank (New / Regular), demerit points for her tier, and her replies.
//   submit { key, reason, img? }      → teacher: one reply per late (reason 1–500 characters, optional picture ≤ 400 KB). Only while undecided.
//   mgmt   { lates:[{ teacher, at }] } → management: the replies + a one-line "System check" for each late (app activity, saves,
//                                        app update, other teachers' check-ins in the same window · counts only).
// The decision itself stays in decideLate (Apps Script) and autoLateUnexcused; nothing here changes POLICY, amounts or cases.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
const str = (x: unknown, n = 200) => String(x == null ? "" : x).trim().slice(0, n);
const lc = (s: unknown) => String(s || "").trim().toLowerCase();
const BUCKET = "late-proof";
const LOCAL = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
const utc = (local: string) => new Date(local + "+08:00");                       // T-TIMEIN times are Manila local
const hm = (d: Date) => new Date(d.getTime() + 8 * 3600e3).toISOString().slice(11, 16);
const hms = (d: Date) => new Date(d.getTime() + 8 * 3600e3).toISOString().slice(11, 19);
const isDec = (n: string) => /^(Waived|Excused|Unexcused)\b/.test(String(n || "").trim());
// the decision without the name of the person who made it (teachers see the outcome, not who)
function decision(note: string) {
  const s = String(note || "").trim(); if (!isDec(s)) return null;
  const cond = s.split(" · ")[0].trim(), amt = (s.match(/₱\s?([\d,]+)/) || [])[1], cid = (s.match(/\bOAR-\d{4}-\d+\b/) || [])[0];
  return { cond, amount: amt ? +amt.replace(/,/g, "") : 0, caseId: cid || "", auto: /Auto · 24 h/.test(s) };
}
function lateRow(r: any[]) {
  const cls = String(r[14] || "").split(" · ")[0].trim(), stu = cls.replace(/^ST-\d{4}-\d+\s*/, "").trim().split(/\s+/)[0] || "";
  const d = decision(String(r[8] || ""));
  return {
    key: lc(r[1]) + "|" + String(r[3]), day: String(r[0]).slice(0, 10), at: String(r[3]), first: String(r[4] || ""), mins: r[5], kind: String(r[6]),
    note: d ? [d.cond, d.amount ? "₱" + d.amount : "", d.caseId].filter(Boolean).join(" · ") : "", dec: d,
    student: stu, device: str(String(r[9] || "").split(" · ").slice(0, 3).join(" · "), 80), net: str(String(r[11] || "").split(" · ")[0], 60), speed: str(r[12], 80),
    proof: /^https:\/\/drive\.google\.com\//.test(String(r[7] || "")) ? String(r[7]) : "",
  };
}
async function policy(teacher: string) {
  const [{ data: P }, { data: T }] = await Promise.all([db.from("sheet_rows").select("data").eq("tab", "POLICY"), db.from("sheet_rows").select("data").eq("tab", "T-DASH")]);
  const tierRow = (T || []).map((x: any) => x.data).find((r: any) => Array.isArray(r) && lc(r[1]) === lc(teacher));
  const tier = tierRow ? String(tierRow[6] || "") : "", status = /newly hired|starting/i.test(tier) ? "New" : "Regular";
  const rows = (P || []).map((x: any) => x.data).filter((r: any) => Array.isArray(r) && /Active/.test(String(r[12] || "")));
  const pol = rows.filter((r: any) => /^Teacher Late (Time-in|to Class)$/.test(String(r[2]))).map((r: any) => ({ subject: r[2], condition: r[4], tier: r[5], amount: +r[7] || 0 }));
  const dm = rows.find((r: any) => r[1] === "Demerit" && lc(r[6]) === lc(tier));
  return { policy: pol, tier, status, demerit: dm ? +dm[8] || 0 : 0 };
}
// ── management: one line of facts from the database for the window "5 minutes before the deadline → the check-in"
async function sysCheck(teacher: string, r: any[]) {
  const at = utc(String(r[3])), first = LOCAL.test(String(r[4] || "")) ? utc(String(r[4])) : null;
  const deadline = first ? new Date(first.getTime() - (r[6] === "Late" ? 30 * 60e3 : 0)) : new Date(at.getTime() - 10 * 60e3);
  let a = new Date(deadline.getTime() - 5 * 60e3); const b = at;
  if (a >= b) a = new Date(b.getTime() - 10 * 60e3);
  if (b.getTime() - a.getTime() > 4 * 3600e3) a = new Date(b.getTime() - 4 * 3600e3);   // very late: the last 4 hours before the check-in
  const pad = 2 * 60e3, vFrom = new Date(a.getTime() - 30 * 60e3);
  const [S, W, O] = await Promise.all([
    db.from("coe_speed").select("at,fn,ui,v").ilike("who", teacher).gte("at", vFrom.toISOString()).lte("at", new Date(b.getTime() + pad).toISOString()).order("at").limit(800),
    db.from("writes").select("fn,status,tries,error,created_at,done_at").ilike("who", teacher).gte("created_at", a.toISOString()).lte("created_at", new Date(b.getTime() + pad).toISOString()).order("created_at").limit(200),
    db.from("writes").select("who,status,tries,error,created_at").in("fn", ["classIn", "timeIn"]).not("who", "ilike", teacher).gte("created_at", a.toISOString()).lte("created_at", b.toISOString()).limit(200)]);
  const parts: string[] = [];
  const sp = (S.data || []).map((x: any) => ({ t: new Date(x.at), ui: !!x.ui, v: +x.v || 0, fn: String(x.fn || "") }));
  const inW = sp.filter((x) => x.t >= a && x.t <= b), taps = inW.filter((x) => x.ui).map((x) => x.t);
  if (!inW.length) parts.push("no app activity recorded " + hm(a) + "–" + hm(b));
  else {
    const mins = [...new Set(taps.map(hm))];
    if (!mins.length) parts.push("app open in the background " + hm(inW[0].t) + "–" + hm(inW[inW.length - 1].t) + " · no taps");
    else parts.push("app active " + (mins.length <= 3 ? mins.join(", ") : mins[0] + "–" + mins[mins.length - 1] + " (" + mins.length + " minutes with taps)"));
    if (mins.length) {
      const pts = [a, ...taps, b]; let g = 0, ga = a, gb = b;
      for (let i = 1; i < pts.length; i++) { const d = pts[i].getTime() - pts[i - 1].getTime(); if (d > g) { g = d; ga = pts[i - 1]; gb = pts[i]; } }
      if (g >= 5 * 60e3) parts.push("no taps " + hm(new Date(ga.getTime() + (ga === a ? 0 : 60e3))) + "–" + hm(new Date(gb.getTime() - (gb === b ? 0 : 60e3))));
    }
  }
  const vs = sp.filter((x) => x.v && x.t <= new Date(b.getTime() + pad)); let up = "";
  for (let i = 1; i < vs.length; i++) if (vs[i].v !== vs[i - 1].v && vs[i].t >= a) { up = "app reloaded for an update (v" + vs[i - 1].v + " → v" + vs[i].v + ") at " + hm(vs[i].t); }
  parts.push(up || "no app update");
  const mine = W.data || [], bad = mine.filter((w: any) => w.status !== "done" || (+w.tries || 0) > 0 || w.error);
  const near = (w: any) => Math.abs(new Date(w.created_at).getTime() - b.getTime());   // the check-in of this late = the one sent closest to its time
  const ci = mine.filter((w: any) => w.fn === (r[6] === "Late" ? "timeIn" : "classIn")).sort((p: any, q: any) => near(p) - near(q))[0];
  if (bad.length) parts.push(bad.length + " save" + (bad.length === 1 ? "" : "s") + " not normal: " + bad.slice(0, 3).map((w: any) => w.fn + " " + w.status + (+w.tries ? " · tries " + w.tries : "") + (w.error ? " · " + str(w.error, 60) : "")).join("; "));
  else parts.push(mine.length ? "no failed or waiting saves" : "no saves sent in this window");
  if (ci && ci.status === "done" && ci.done_at) parts.push("check-in received " + hms(new Date(ci.created_at)) + ", saved " + hms(new Date(ci.done_at)));
  const oth = O.data || [], ok = oth.filter((w: any) => w.status === "done" && !(+w.tries || 0) && !w.error), nok = oth.length - ok.length;
  if (ok.length) { const t = ok.map((w: any) => new Date(w.created_at)).sort((p: Date, q: Date) => p.getTime() - q.getTime()); const r0 = hm(t[0]), r1 = hm(t[t.length - 1]);
    parts.push(ok.length + " other check-in" + (ok.length === 1 ? "" : "s") + " saved normally at " + (r0 === r1 ? r0 : r0 + "–" + r1)); }
  if (nok) parts.push(nok + " other check-in" + (nok === 1 ? "" : "s") + " waited or retried");
  if (!oth.length) parts.push("no other check-ins in this window");
  return { line: "System check: " + parts.join(" · "), from: hm(a), to: hm(b) };
}

Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: s } = await db.from("app_sessions").select("name,role,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
  const mgmt = s.mode === "mgmt", me = String(s.name || "").trim(), a = String(b.action || ""), now = new Date().toISOString();
  try {
    if (a === "mine") {
      if (mgmt) return out({ ok: true, rows: [], policy: [], ex: {}, now });
      const since = new Date(Date.now() + 8 * 3600e3 - 40 * 864e5).toISOString().slice(0, 10);
      const [L, X, pol] = await Promise.all([
        db.from("log_rows").select("data").eq("tab", "T-TIMEIN").in("data->>6", ["Late", "Late to class"]).gte("data->>0", since).ilike("data->>1", me).limit(200),
        db.from("late_explain").select("teacher,late_at,reason,img_path,created_at").ilike("teacher", me).order("created_at", { ascending: false }).limit(100),
        policy(me)]);
      if (L.error) return out({ ok: false, error: L.error.message });
      const rows = (L.data || []).map((x: any) => x.data).filter((r: any) => Array.isArray(r) && lc(r[1]) === lc(me) && LOCAL.test(String(r[3] || ""))).map(lateRow)
        .sort((p: any, q: any) => String(q.at).localeCompare(String(p.at)));
      const ex: Record<string, any> = {}, paths = (X.data || []).map((x: any) => x.img_path).filter(Boolean);
      let U: Record<string, string> = {};
      if (paths.length) { const { data } = await db.storage.from(BUCKET).createSignedUrls(paths, 3600); (data || []).forEach((x: any) => { if (x.path) U[x.path] = x.signedUrl; }); }
      (X.data || []).forEach((x: any) => { const k = lc(x.teacher) + "|" + x.late_at; if (!ex[k]) ex[k] = { reason: x.reason, at: x.created_at, img: x.img_path ? U[x.img_path] || null : null, hasImg: !!x.img_path }; });
      return out({ ok: true, rows, ...pol, ex, now });
    }
    if (a === "submit") {
      if (mgmt) return out({ ok: false, error: "Teachers only" });
      const key = str(b.key, 120), at = key.split("|")[1] || "", reason = String(b.reason == null ? "" : b.reason).replace(/\s+$/g, "").trim();
      if (lc(key.split("|")[0]) !== lc(me) || !LOCAL.test(at)) return out({ ok: false, error: "This notice is not yours." });
      if (!reason) return out({ ok: false, error: "Write the reason." });
      if (reason.length > 500) return out({ ok: false, error: "The reason is longer than 500 characters." });
      const { data: L } = await db.from("log_rows").select("data").eq("tab", "T-TIMEIN").eq("data->>3", at).ilike("data->>1", me).in("data->>6", ["Late", "Late to class"]).limit(1);
      const r = L && L[0] && L[0].data; if (!r) return out({ ok: false, error: "This late was not found. Refresh." });
      if (isDec(String(r[8] || ""))) return out({ ok: false, error: "This late has already been decided." });
      const { data: had } = await db.from("late_explain").select("id").ilike("teacher", me).eq("late_at", at).limit(1);
      if (had && had.length) return out({ ok: false, error: "Already submitted.", dup: true });
      let img_path: string | null = null;
      if (b.img) {
        const m = /^data:(image\/(jpeg|png|webp));base64,(.+)$/.exec(String(b.img)); if (!m) return out({ ok: false, error: "The picture could not be read." });
        const bin = Uint8Array.from(atob(m[3]), (c) => c.charCodeAt(0)); if (bin.length > 400000) return out({ ok: false, error: "The picture is too large." });
        img_path = lc(me).replace(/[^a-z0-9]/g, "") + "/" + at.replace(/[^0-9]/g, "") + "-" + crypto.randomUUID().slice(0, 8) + "." + (m[2] === "jpeg" ? "jpg" : m[2]);
        const { error } = await db.storage.from(BUCKET).upload(img_path, bin, { contentType: m[1], upsert: false }); if (error) return out({ ok: false, error: "The picture was not saved. Try again." });
      }
      const { error } = await db.from("late_explain").insert({ teacher: me, late_at: at, kind: String(r[6]), reason, img_path, dev: str(b.dev, 40) || null });
      if (error) { if (img_path) await db.storage.from(BUCKET).remove([img_path]); return out({ ok: false, error: /duplicate|unique/i.test(error.message) ? "Already submitted." : "Not saved. Try again.", dup: /duplicate|unique/i.test(error.message) }); }
      return out({ ok: true, at: now });
    }
    if (a === "mgmt") {
      if (!mgmt) return out({ ok: false, error: "Management only" }, 403);
      const L = (Array.isArray(b.lates) ? b.lates : []).slice(0, 30).map((x: any) => ({ teacher: str(x.teacher, 60), at: str(x.at, 19) })).filter((x: any) => x.teacher && LOCAL.test(x.at));
      if (!L.length) return out({ ok: true, items: {}, now });
      const [R, X] = await Promise.all([
        db.from("log_rows").select("data").eq("tab", "T-TIMEIN").in("data->>3", [...new Set(L.map((x: any) => x.at))]).in("data->>6", ["Late", "Late to class"]).limit(100),
        db.from("late_explain").select("teacher,late_at,reason,img_path,created_at").in("late_at", [...new Set(L.map((x: any) => x.at))]).limit(100)]);
      const paths = (X.data || []).map((x: any) => x.img_path).filter(Boolean); const U: Record<string, string> = {};
      if (paths.length) { const { data } = await db.storage.from(BUCKET).createSignedUrls(paths, 3600); (data || []).forEach((x: any) => { if (x.path) U[x.path] = x.signedUrl; }); }
      const items: Record<string, any> = {};
      await Promise.all(L.map(async (l: any) => {
        const k = lc(l.teacher) + "|" + l.at, r = (R.data || []).map((x: any) => x.data).find((d: any) => lc(d[1]) === lc(l.teacher) && String(d[3]) === l.at);
        const e = (X.data || []).find((x: any) => lc(x.teacher) === lc(l.teacher) && x.late_at === l.at);
        let check = null; try { if (r) check = await sysCheck(String(r[1]).trim(), r); } catch (err) { check = { line: "System check: not available (" + str((err as Error).message, 60) + ")" }; }
        items[k] = { ex: e ? { reason: e.reason, at: e.created_at, img: e.img_path ? U[e.img_path] || null : null } : null, check };
      }));
      return out({ ok: true, items, now });
    }
    return out({ ok: false, error: "Unknown action" }, 400);
  } catch (e) { return out({ ok: false, error: String((e as Error).message || e) }, 500); }
});
