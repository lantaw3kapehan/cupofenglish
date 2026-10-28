// CupOfEnglish · Night report (mgmtNight) worked out from the database (28 Oct 2026, release 1363).
// A line-by-line port of the Apps Script mgmtNight → night_ → recDay_ (live Code.gs, read 28 Oct), reading:
//   classes            – the calendar copy (dayEvents_): the event itself is in classes.data
//   log_rows T-TIMEIN  – time-ins and "I'm in" (database original; sheet order = newest first)
//   log_rows S-HOMEWORK, S-NOTES – homework and class notes (database original)
//   coe_vid_log        – Google's own class-video check (vids_: month-DAILY links + Drive), written for today and yesterday
//   coe_class_videos   – videos uploaded in the app (vidApp_ / "vapp"), the moment they are uploaded
//   sheet_rows MASTERLIST – names (staff_ / teachers_)
// Days before the video log began (18 Oct): the video status comes from Google's stored answer for that day (labelled _src).
// op 'night' {token, ds?}  → management only; same shape as Google's mgmtNight. Off (docs 'sys:nightdb' {"on":false}) → {fallback:true}
// op 'check' {token|key}    → compares with Google's stored answers (docs 'mgmt:mgmtNight|["yyyy-MM-dd",false]')
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const HW_SOON_MIN = 60;
const MANAGERS = ["CupOfEnglish", "Celine", "Misty"];
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], MO3 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// ── Manila time (sheet copies hold Manila local 'yyyy-MM-ddTHH:mm:ss') ──
const isD = (x: any) => typeof x === "string" && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d$/.test(x);
const loc = (t: number) => new Date(t + 8 * 3600e3).toISOString().slice(0, 19);
const msL = (s: string) => Date.parse(s + "+08:00");
const ymd_ = (v: any) => String(v == null ? "" : v).slice(0, 10);
const hm_ = (v: any) => isD(v) ? String(v).slice(11, 16) : String(v == null ? "" : v);
const d_ = (v: any) => isD(v) ? String(v).slice(0, 10) : null;
const fmtYmdHm = (t: number) => { const s = loc(t); return s.slice(0, 10) + " " + s.slice(11, 16); };
const isTrialTitle_ = (t: any) => { t = String(t || ""); return /trial|试听/i.test(t) || /(^|-)\s*TC\s*(\s+X)?\s*$/i.test(t); };
const isSubTitle_ = (t: any) => { t = String(t || ""); return /\bsub\b/i.test(t) || /(^|-)\s*SC\s*(\s+X)?\s*$/i.test(t); };

async function all(q: () => any) {   // every row of a query, 1000 at a time
  const out: any[] = [];
  for (let from = 0; ; from += 1000) { const { data, error } = await q().range(from, from + 999); if (error) throw new Error(error.message);
    out.push(...(data || [])); if (!data || data.length < 1000) break; }
  return out;
}

async function names() {   // staff_() + teachers_(): lower-case name → the name as written (TEACHER'S NAME, else first name)
  const R = await all(() => db.from("sheet_rows").select("r,data").eq("tab", "MASTERLIST").order("r"));
  const head = ((R.find((x: any) => x.r === 1) || {}).data || []).map((x: any) => String(x).trim().toUpperCase());
  const iN = head.indexOf("TEACHER'S NAME") > -1 ? head.indexOf("TEACHER'S NAME") : 4, iF = head.indexOf("FIRST NAME");
  const out: Record<string, string> = {};
  R.filter((x: any) => x.r > 1).forEach((x: any) => { const r = x.data || [];
    const n = String(r[iN] || "").replace(/^(coordinator|admin|support)\s+/i, "").trim() || String(iF > -1 ? r[iF] || "" : r[2] || "").trim().split(/\s+/)[0];
    if (n) out[n.toLowerCase()] = n; });
  MANAGERS.forEach((m) => out[m.toLowerCase()] = m);
  return out;
}

// recDay_(ds): one row per finished class of the day
async function recDay(ds: string, google: any) {
  const now = Date.now(), today = loc(now).slice(0, 10);
  const C = await all(() => db.from("classes").select("data").eq("day", ds).order("starts_at"));
  const allE = C.map((x: any) => x.data || {}).filter((e: any) => !e.cancelled && (e.teachers || [])[0]);
  const ev = allE.filter((e: any) => new Date(e.end).getTime() < now);
  if (!ev.length) return { rows: [], vsrc: "" };
  const firstId: Record<string, string> = {};
  allE.slice().sort((a: any, b: any) => String(a.start).localeCompare(String(b.start))).forEach((e: any) => { const t = e.teachers[0]; if (!firstId[t]) firstId[t] = e.id; });
  const [TI, HW, NT, VL, VA, NM] = await Promise.all([
    all(() => db.from("log_rows").select("data").eq("tab", "T-TIMEIN").gte("data->>0", ds).lt("data->>0", ds + "T99").order("ord", { ascending: false })),
    all(() => db.from("log_rows").select("data").eq("tab", "S-HOMEWORK").order("ord", { ascending: false }).limit(1500)),
    all(() => db.from("log_rows").select("data").eq("tab", "S-NOTES").order("ord", { ascending: false }).limit(1500)),
    all(() => db.from("coe_vid_log").select("code,teacher,found_at,file_url,uploaded_at,source").eq("day", ds)),
    all(() => db.from("coe_class_videos").select("event_id,code,teacher,uploaded_at,via").eq("day", ds)),
    names(),
  ]);
  const dayIn: Record<string, any> = {}, clsIn: Record<string, any> = {}, clsAt: Record<string, any> = {};
  TI.map((x: any) => x.data || []).forEach((r: any[]) => {
    if (ymd_(r[0]) !== ds) return; const who = String(r[1]).trim().toLowerCase();
    if (r[13] === "Class") { const id = String(r[14]).split(" · ").pop()!, ak = who + "|" + String(r[14]).split(" ")[0].toUpperCase() + "|" + hm_(r[4]); if (!clsIn[id]) clsIn[id] = r; if (!clsAt[ak]) clsAt[ak] = r; }
    else if (!dayIn[who]) dayIn[who] = r;
  });
  const hw: Record<string, string> = {}, hwAt: Record<string, string> = {};
  const bySaved = (L: any[]) => L.map((x: any) => x.data || []).sort((a: any[], b: any[]) => String(b[0]).localeCompare(String(a[0])));   // the sheet's order: newest saved first
  bySaved(HW).forEach((r: any[]) => { if (!isD(r[0])) return; if (r[6]) hw[String(r[6])] = r[0];   // oldest mark wins
    if (ymd_(r[1]) === ds) hwAt[String(r[3]).toUpperCase()] = r[0]; });
  const nt: Record<string, number> = {}; NT.map((x: any) => x.data || []).forEach((r: any[]) => { if (r[8]) nt[String(r[8])] = 1; nt[String(r[3]).toUpperCase() + "|" + (d_(r[1]) || String(r[1]))] = 1; });
  // vids_: Google's own result (coe_vid_log), else a video uploaded in the app; days before the log: Google's stored answer
  const V: Record<string, any> = {}; let vsrc = VL.length ? "db" : "";
  VL.forEach((v: any) => { if (v.found_at && v.file_url) V[String(v.code).toUpperCase() + "|" + String(v.teacher).toLowerCase()] = { url: v.file_url, ts: v.source !== "daily" && v.uploaded_at ? Date.parse(v.uploaded_at) : 0 }; });
  const app: Record<string, boolean> = {};
  VA.forEach((v: any) => { if (v.via === "app" && v.event_id) app[v.event_id] = true; });
  const appBy: Record<string, any> = {}; VA.forEach((v: any) => { if (v.event_id) appBy[v.event_id] = v; });
  const gItem: Record<string, any> = {};
  if (!VL.length && google && Array.isArray(google.teachers)) { vsrc = "google"; google.teachers.forEach((t: any) => (t.items || []).forEach((i: any) => { gItem[String(t.name).toLowerCase() + "|" + i.code + "|" + i.at] = i; })); }
  const rows = ev.map((e: any) => {
    const t = e.teachers[0], first = firstId[t] === e.id, type = isTrialTitle_(e.title) ? "Trial" : isSubTitle_(e.title) ? "Sub" : "";
    const st = loc(Date.parse(e.start)).slice(11, 16), end = Date.parse(e.end);
    let r = (first && dayIn[t]) || clsIn[e.id] || clsAt[t + "|" + String(e.code || "").toUpperCase() + "|" + st];
    if (!r && e.code) { const pv = allE.find((x: any) => x.id !== e.id && x.teachers[0] === t && x.code === e.code && new Date(x.end).getTime() === new Date(e.start).getTime());
      if (pv) r = (firstId[t] === pv.id && dayIn[t]) || clsIn[pv.id] || clsAt[t + "|" + String(pv.code || "").toUpperCase() + "|" + loc(Date.parse(pv.start)).slice(11, 16)]; }
    let ci = "None", at = "", mins: any = "", proof = "";
    if (r) { at = hm_(r[3]); mins = r[5]; ci = r[6] === "On time" ? "On time" : /^Late|After class/.test(String(r[6])) ? "Late" : String(r[6] || "None"); proof = /^http/.test(String(r[7])) ? "Yes" : "No"; }
    let vid = "", vat = "";
    if (e.code) {
      const nm = names_(NM, t);
      if (vsrc === "google") { const g = gItem[nm.toLowerCase() + "|" + (e.code || "") + "|" + st]; if (g) { vid = g.vid; vat = g.vat; } else vid = ds === today ? "Not yet" : "Missing"; }
      else {
        let v = V[String(e.code).toUpperCase() + "|" + t];
        if (!v && appBy[e.id] && appBy[e.id].uploaded_at) v = { ts: Date.parse(appBy[e.id].uploaded_at), app: true };   // uploaded in the app; Google's check finds it within 10 min
        if (v && v.ts) { vat = fmtYmdHm(v.ts); vid = vat.slice(0, 10) <= ds ? "On time" : "Late"; }
        else vid = v ? "Submitted" : ds === today ? "Not yet" : "Missing";
      }
    }
    let hwS = "", hat = "", note = "";
    if (e.code && type !== "Trial") {
      const h = hw[e.id] || hwAt[String(e.code).toUpperCase()];
      if (h) { const ht = msL(h); hat = fmtYmdHm(ht); hwS = hat.slice(0, 10) > ds ? "Late" : (ht - end) / 60000 <= HW_SOON_MIN ? "Right after" : "Same day"; }
      else hwS = ds === today ? "Not yet" : "Missing";
      note = nt[e.id] || nt[String(e.code).toUpperCase() + "|" + ds] ? "Yes" : ds === today ? "Not yet" : "No";
    }
    return [ds, names_(NM, t), st, loc(end).slice(11, 16), e.code || "", e.student || "", type, ci, at, mins, first ? "Yes" : "", proof, vid, vat, hwS, hat, note, e.id];
  });
  return { rows, vsrc, app };
}
const names_ = (NM: Record<string, string>, t: string) => NM[String(t).toLowerCase()] || t;

// night_(ds)
async function night(ds: string, google: any) {
  const now = Date.now(), today = loc(now).slice(0, 10);
  if (ds > today) return { date: ds, teachers: [], tot: {} };
  const { rows, vsrc, app } = await recDay(ds, google) as any;
  const VA = app || {}, T: Record<string, any> = {}, tot: any = { classes: 0, vid: 0, vidNeed: 0, hw: 0, hwNeed: 0, note: 0, noteNeed: 0, fix: 0, vapp: 0 };
  rows.forEach((r: any[]) => {
    const [, t, st, en, code, stu, type, ci, at, mins, first, , vid, vat, hwS, hat, note] = r;
    const x = T[t] || (T[t] = { name: t, classes: 0, vid: 0, vidNeed: 0, hw: 0, hwNeed: 0, note: 0, noteNeed: 0, fix: 0, items: [] }), it: string[] = [];
    x.classes++; tot.classes++;
    if (/^(On time|Submitted|Late|Missing)$/.test(vid)) { x.vidNeed++; tot.vidNeed++; if (vid !== "Missing" && VA[r[17]]) { x.vapp = (x.vapp || 0) + 1; tot.vapp++; } if (vid !== "Missing") { x.vid++; tot.vid++; } if (vid === "Missing") it.push("No video"); else if (vid === "Late") it.push("Video late"); }
    if (/^(Right after|Same day|Late|Missing)$/.test(hwS)) { x.hwNeed++; tot.hwNeed++; if (hwS !== "Missing") { x.hw++; tot.hw++; } if (hwS === "Missing") it.push("No homework"); else if (hwS === "Late") it.push("Homework after 23:59"); }
    if (note === "Yes" || note === "No") { x.noteNeed++; tot.noteNeed++; if (note === "Yes") { x.note++; tot.note++; } else it.push("No class note"); }
    if (ci === "None") it.push(first === "Yes" ? "No time-in" : "No “I'm in”"); else if (ci === "Late") it.push(first === "Yes" ? "Late time-in" : "Late to class");
    if (it.length) { x.fix++; tot.fix++; }
    x.items.push({ at: st, end: en, code: code, student: stu, type: type, ci: ci, inAt: at, vid: vid, vat: vat, hw: hwS, hat: hat, note: note, issues: it });
  });
  const list = Object.keys(T).map((n) => T[n]).sort((a, b) => (b.fix - a.fix) || a.name.localeCompare(b.name));
  list.forEach((x) => x.items.sort((a: any, b: any) => String(a.at).localeCompare(String(b.at))));
  const dd = new Date(ds + "T12:00:00Z");
  return { date: ds, label: DOW[dd.getUTCDay()] + " " + dd.getUTCDate() + " " + MO3[dd.getUTCMonth()], teachers: list, tot: tot, at: loc(now).slice(11, 16),
    _src: { db: true, videos: vsrc === "google" ? "Google (stored answer; the video log starts 18 Oct)" : "database (Google's video check + app uploads)" } };
}

async function googleCopy(ds: string) {
  const { data } = await db.from("docs").select("data,updated_at").eq("key", 'mgmt:mgmtNight|["' + ds + '",false]').maybeSingle();
  return data && data.data ? Object.assign(data.data, { __at: data.updated_at }) : null;
}

function diff(a: any, b: any, path: string, out: string[]) {
  if (out.length > 40 || a === b) return;
  if (typeof a !== typeof b || a === null || b === null || typeof a !== "object") { out.push(path + ": db " + JSON.stringify(a)?.slice(0, 60) + " · google " + JSON.stringify(b)?.slice(0, 60)); return; }
  if (Array.isArray(a)) { if (a.length !== b.length) out.push(path + ": length db " + a.length + " · google " + b.length); for (let i = 0; i < Math.min(a.length, b.length); i++) diff(a[i], b[i], path + "[" + i + "]", out); return; }
  new Set([...Object.keys(a), ...Object.keys(b)]).forEach((k) => { if (k === "_src" || k === "__at" || k === "at" && path === "") return; diff(a[k], b[k], path + "." + k, out); });
}
async function check() {
  const ks = (await db.from("docs").select("key").like("key", "mgmt:mgmtNight|%")).data?.filter((x: any) => /^mgmt:mgmtNight\|\["\d{4}-\d\d-\d\d",false\]$/.test(x.key));
  const res: any[] = [];
  for (const r of (ks || []).sort((a: any, b: any) => a.key.localeCompare(b.key))) {
    const ds = String(r.key).slice(17, 27), gc = await googleCopy(ds); if (!gc) continue;
    const n = await night(ds, gc), d: string[] = []; diff(n, gc, "", d);
    res.push({ ds, google_at: gc.__at, videos: (n as any)._src && (n as any)._src.videos, diffs: d });
  }
  return { ok: true, days: res.length, same: res.filter((x) => !x.diffs.length).length, res };
}

const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(x: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(x)); return Array.from(new Uint8Array(b)).map((c) => c.toString(16).padStart(2, "0")).join(""); }

Deno.serve(async (req) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  try {
    if (b.op === "check" && b.key) {   // the release check: the one-time key kept in docs 'sys:growthcheck'
      const { data: kk } = await db.from("docs").select("data").eq("key", "sys:growthcheck").maybeSingle();
      if (!kk || !kk.data || !kk.data.key || kk.data.key !== String(b.key)) return out({ ok: false, error: "AUTH" }, 401);
      return out(await check());
    }
    const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
    const { data: s } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
    if (!s || new Date(s.exp).getTime() < Date.now() || s.mode !== "mgmt") return out({ ok: false, error: "AUTH" }, 401);
    if (b.op === "night") {
      const { data: flag } = await db.from("docs").select("data").eq("key", "sys:nightdb").maybeSingle();
      if (!(flag && flag.data && flag.data.on) && !b.force) return out({ ok: false, fallback: true });
      const ds = /^\d{4}-\d{2}-\d{2}$/.test(String(b.ds || "")) ? String(b.ds) : loc(Date.now() - 864e5).slice(0, 10);
      const t0 = Date.now(), gc = ds < "2026-10-18" ? await googleCopy(ds) : null;
      return out({ ok: true, data: await night(ds, gc), ms: Date.now() - t0 });
    }
    if (b.op === "check") return out(await check());
    return out({ ok: false, error: "unknown op" }, 400);
  } catch (e) { return out({ ok: false, error: "db", why: String((e as Error).message || e) }, 500); }
});
