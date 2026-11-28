// CupOfEnglish · coe-drive (28 Nov 2026): Google Drive without Apps Script.
// Service account coe-drive@coe-drive.iam.gserviceaccount.com (project "COE Drive"), domain-wide delegation,
// scope https://www.googleapis.com/auth/drive, acting as works@cupofenglishatph.com. Key: secret GOOGLE_SA_JSON.
// POST { token | (header x-coe-srv), op, ... }
//   probe       {}                → { ok, user, quota }                 (President / server key: is the setup working?)
//   script_src  {}                → { ok, files }                       (server key: copy the Apps Script source into table coe_gas_src)
// Class videos (28 Nov · 3142 · the Apps Script versions moved here unchanged in what they do; month-DAILY links dropped: sheets are frozen):
//   tVidStart   { args:[ev{id,start,teacher?}, file{name,size,type,dur,lm,why,note,test}] } → { ok, url, key, name, chunk }
//   tVidDone    { args:[key, fileId] }   → { ok, url, name, late, flags, note }   (checks, late case, coe_class_videos + coe_class_video_days, sys:vids)
//   tVidList    {}                       → { ok, list }   teacher: classes of the last 7 days still without a video
//   tVidFlags   {}                       → { ok, list }   teacher: my video checks (60 days)
//   tVidExplain { args:[id, why, note] } → { ok }
//   mgmtVidFlags {}                      → { ok, list }   ·   mgmtVidFlagSet { args:[id, st, note] } → { ok, item }
//   pzList {} → { ok, map: {CODE: [[from, to, note, id, by]]} } · pzSet { args:[code, from, to, note] } · pzDel { args:[id] }   (3154, management: pauses in learning)
// 28 Nov · 3145 (Misty "yes"): the 21:00 "tomorrow's classes" emails, sent from works@ through Gmail (was DAYSCHEDULE in Apps Script):
//   day_schedule { dry? } (server key) → each teacher gets her own classes; Operations gets the whole day. Once per day (docs sys:dayschedule).
// 28 Nov · 3146 (Misty "let's finish those google jobs now"), the last two Google night jobs:
//   books_scan {} (server key) → the books folder (BK16_ROOT, 4 levels) into coe_book_files, then coe_book_automatch. A run continues
//       where the last one stopped (docs sys:books16); files not seen in a finished full scan get gone_at (never when the scan saw < 80%).
//   rec8 {}       (server key) → coaching and training recordings copied into Drive (COACHINGS / TRAININGS next to STUDENT CLASS VIDEOS),
//       16 MB pieces, resumable across runs (table coe_rec8); a file already in Drive with the same name counts as done.
// 28 Nov · 3147 (Misty "yes let's all finish now"): the President's "first time or forgot password" without Google (was requestCode /
//   setPassword in Apps Script; same rules and wording). No sign-in needed:
//   requestCode { email, mode }            → 6-digit code by email (15 minutes, same code if asked again within the time); table coe_otp
//   setPassword { email, code, pw, mode }  → checks the code (8 tries), sets the password (same hash as coe-pw / coe login), signs in
//   mgmtRoadmap { args:[name] }            → { ok, type, b64 }  the COE-RM-… roadmap picture from Drive (management)
//   mgmtTrialSentPic { args:[label, what] } → { ok, at }  "<what> sent <time> by <name>" on the trial row (TR-DATA copy, column AS)
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
const AS = "works@cupofenglishatph.com";

// ── Google access token for works@ (JWT bearer, RS256), kept ~50 minutes
let TOK: { t: string; exp: number; sub: string } | null = null;
const b64u = (u: Uint8Array | string) => { const s = typeof u === "string" ? btoa(unescape(encodeURIComponent(u))) : btoa(String.fromCharCode(...u)); return s.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); };
export async function gToken(sub = AS): Promise<string> {
  if (TOK && TOK.sub === sub && TOK.exp > Date.now() + 60e3) return TOK.t;
  const raw = Deno.env.get("GOOGLE_SA_JSON"); if (!raw) throw new Error("GOOGLE_SA_JSON is not set");
  const k = JSON.parse(raw), now = Math.floor(Date.now() / 1000);
  const head = b64u(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const body = b64u(JSON.stringify({ iss: k.client_email, sub, scope: "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/gmail.send", aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 }));
  const pem = String(k.private_key).replace(/-----[^-]+-----/g, "").replace(/\s+/g, "");
  const der = Uint8Array.from(atob(pem), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey("pkcs8", der, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
  const sig = new Uint8Array(await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(head + "." + body)));
  const r = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: head + "." + body + "." + b64u(sig) }) });
  const j = await r.json(); if (!j.access_token) throw new Error("Google token: " + JSON.stringify(j).slice(0, 300));
  TOK = { t: j.access_token, exp: Date.now() + (j.expires_in || 3600) * 1000, sub }; return TOK.t;
}
export async function gApi(url: string, init: RequestInit = {}) {
  const t = await gToken(); const h = new Headers(init.headers || {}); h.set("Authorization", "Bearer " + t);
  return fetch(url, { ...init, headers: h });
}


// ───────────────────────── class videos (ported from Apps Script: tVidStart · VIDSTUDENT08 · VIDKEY26 · tVidDone · vidCheck_ · penalty_)
const VIDUP_FROM = "2026-10-22";
const FOLDER = "application/vnd.google-apps.folder";
const lc = (x: unknown) => String(x || "").trim().toLowerCase();
const man = (t = Date.now()) => new Date(t + 8 * 3600e3).toISOString();          // Manila wall clock as ISO (no zone)
const ymd = (d: string | number | Date) => man(new Date(d).getTime()).slice(0, 10);
const MONS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const dMon = (t: number) => { const s = man(t); return +s.slice(8, 10) + " " + MONS[+s.slice(5, 7) - 1] + " " + s.slice(11, 16); };
const kindOf = (title: string) => { const t = String(title || "").replace(/\s+X$/i, ""); return /trial/i.test(t) || /-TC$/i.test(t) ? "trial" : (/\bsub\b/i.test(t) || /-SC$/i.test(t)) ? "sub" : ""; };
const clean = (s: string) => String(s || "").replace(/^copy of\s+/i, "").replace(/\s+/g, "-").replace(/[^A-Za-z0-9一-鿿-]+/g, "").replace(/-{2,}/g, "-").replace(/^-|-$/g, "");
function makeName(o: any) {
  const t = clean(o.teacher), bk = clean(o.book), x = o.ext ? "." + String(o.ext).replace(/^\./, "").toLowerCase() : "", pf = o.proof ? "-SCREENPROOF" : "", ts = o.test ? "-TEST" : "";
  if (o.trial) return [o.iso, o.code || "TRIAL", clean(o.who), bk, t].filter(Boolean).join("-") + pf + ts + x;
  return [o.code, clean(o.who), o.iso, bk, t].filter(Boolean).join("-") + pf + ts + x;
}
const q = (s: string) => s.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
async function gJson(url: string, init: RequestInit = {}) { const r = await gApi(url, init); const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error("Drive " + r.status + " " + JSON.stringify(j).slice(0, 200)); return j; }
async function folders(query: string) {
  const out: any[] = []; let pt = "";
  do { const j = await gJson("https://www.googleapis.com/drive/v3/files?q=" + encodeURIComponent(query) + "&fields=nextPageToken,files(id,name,parents)&pageSize=1000&supportsAllDrives=true&includeItemsFromAllDrives=true" + (pt ? "&pageToken=" + pt : ""));
    out.push(...(j.files || [])); pt = j.nextPageToken || ""; } while (pt && out.length < 5000);
  return out;
}
async function mkFolder(name: string, parent: string) { const j = await gJson("https://www.googleapis.com/drive/v3/files?supportsAllDrives=true&fields=id", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, mimeType: FOLDER, parents: [parent] }) }); return String(j.id); }
async function memo(k: string) { const { data } = await db.from("docs").select("data").eq("key", "sys:drive:" + k).maybeSingle(); return data && data.data && data.data.id ? String(data.data.id) : ""; }
async function memoSet(k: string, id: string) { await db.from("docs").upsert({ key: "sys:drive:" + k, scope: "pres", data: { id, at: Date.now() }, updated_at: new Date().toISOString() }); }
async function rootId() {   // STUDENT CLASS VIDEOS (the folder Apps Script made on 8 Nov), remembered
  const m = await memo("vid8root"); if (m) return m;
  const L = await folders(`name='STUDENT CLASS VIDEOS' and mimeType='${FOLDER}' and trashed=false`);
  if (L.length !== 1) throw new Error("STUDENT CLASS VIDEOS folder: found " + L.length);
  await memoSet("vid8root", L[0].id); return L[0].id;
}
async function child(parent: string, name: string) {
  const L = await folders(`'${parent}' in parents and name='${q(name)}' and mimeType='${FOLDER}' and trashed=false`);
  return L.length ? L[0].id : await mkFolder(name, parent);
}
async function studentFolder(code: string, student: string, book: string) {   // "CODE | NAME | BOOK" in STUDENT CLASS VIDEOS (book matched as before)
  const root = await rootId(), B = String(book || "").replace(/[\s-]+/g, "").toUpperCase();
  const all = await folders(`'${root}' in parents and mimeType='${FOLDER}' and trashed=false`);
  const L = all.map((f) => { const nm = String(f.name || "").trim(), c = (nm.match(/ST-\d{4}-\d{3}/i) || [])[0]; return c && c.toUpperCase() === code ? { id: f.id, book: String(nm.split("|")[2] || "").replace(/\s+/g, "").toUpperCase() } : null; }).filter(Boolean) as any[];
  const hit = L.find((x) => B && (x.book === B || (x.book && (x.book.indexOf(B) === 0 || B.indexOf(x.book) === 0)))) || (!B && L[0]);
  if (hit) return hit.id;
  return await mkFolder(code + " | " + String(student || "").toUpperCase() + " | " + B, root);
}
async function classOf(ev: any) {   // the class from the class table (the calendar)
  const st = new Date(ev && ev.start); if (isNaN(st.getTime())) return null;
  const ds = ymd(st), ids = [ev && ev.id].map((x) => String(x || "").split("|")[0].trim()).filter(Boolean);
  const { data } = await db.from("classes").select("data").eq("day", ds).limit(600);
  const all = (data || []).map((r: any) => r.data || {});
  return all.find((e: any) => e.id === ev.id) || all.find((e: any) => ids.indexOf(String(e.id || "").split("|")[0]) > -1) || null;
}
const bookOf = (e: any) => String(e.book || "").split(/\s*,\s*/).filter((p) => p && !/^(pre[-\s]?)?[abc][12]\+?$/i.test(p))[0] || "";
const num = (x: unknown) => { const n = parseFloat(String(x == null ? "" : x).replace(/[^0-9.\-]/g, "")); return isNaN(n) ? 0 : n; };

async function vidStart(u: any, ev: any, file: any) {
  ev = ev || {}; file = file || {};
  const mgmt = u.mode === "mgmt";
  { const st = new Date(ev.start); if (!mgmt && !isNaN(st.getTime()) && st.getTime() - Date.now() > 15 * 6e4) return { ok: false, msg: "This class has not started yet. Upload its video after the class." }; }
  const size = Math.floor(Number(file.size) || 0), fname = String(file.name || ""), mime = String(file.type || "").slice(0, 60) || (/\.mov$/i.test(fname) ? "video/quicktime" : "video/mp4");
  if (!(size > 0)) return { ok: false, msg: "Choose the class video file." };
  const img = /^image\//.test(mime) || /\.(jpe?g|png|heic|heif|webp)$/i.test(fname);
  if (!img && !/^video\//.test(mime) && !/\.(mp4|mov|m4v|mkv|webm|avi)$/i.test(fname)) return { ok: false, msg: "Choose the class video (MP4, MOV…) or a screen proof picture." };
  const e = await classOf(ev); if (!e) return { ok: false, msg: "This class was not found in the calendar. Refresh and try again." };
  const teacher = String(mgmt && ev.teacher ? ev.teacher : u.name).trim(), tl = teacher.toLowerCase();
  if (!mgmt && (e.teachers || []).map(lc).indexOf(tl) < 0) return { ok: false, msg: "This class is not on your schedule." };
  const st = new Date(e.start), ds = ymd(st), code = String(e.code || "").toUpperCase(), book = bookOf(e), k = kindOf(e.title);
  if (!file.test) {   // one file per class: the database decides (the video recorded for this class on this day)
    const ids = [ev.id, e.id].map((x) => String(x || "").split("|")[0].trim()).filter((x, i, a) => x && a.indexOf(x) === i);
    for (const id of ids) for (const t of ["coe_class_videos", "coe_class_video_days"]) {
      const { data, error } = await db.from(t).select("name").eq("event_id", id).eq("day", ds).limit(1);
      if (error) return { ok: false, msg: "The database did not answer. Try again in a minute." };
      if (data && data.length) return { ok: false, msg: "This class already has its video (" + (data[0].name || "uploaded") + "). Only one file per class." };
    }
  }
  let fid: string;
  try {
    if (k === "trial" || !code) fid = await child(await rootId(), "TRIAL CLASSES");
    else { const sf = await studentFolder(code, e.student, book); fid = k === "sub" ? await child(sf, "SUB CLASSES") : sf; }
  } catch (x) { console.warn("vid folder", x); return { ok: false, msg: "Google Drive could not open the folder for this class. Ask Ops to check the student's video folder, then try again." }; }
  const ext = ((fname.match(/\.([A-Za-z0-9]{2,5})$/) || [])[1] || (mime.split("/")[1] || "mp4").replace("quicktime", "mov")).toLowerCase();
  const name = makeName({ code, who: String(e.student || "Student").trim(), iso: ds, book: book.replace(/[\s-]+/g, ""), teacher, proof: img, ext, trial: k === "trial" || !code, test: !!file.test });
  const when = man(st.getTime()).slice(0, 16).replace("T", " ");
  const meta = { name, parents: [fid], mimeType: mime, description: "Uploaded in the CupOfEnglish app by " + u.name + " · class " + when + (teacher !== u.name ? " · Teacher " + teacher : "") };
  const r = await gApi("https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true&fields=id", { method: "POST",
    headers: { "Content-Type": "application/json; charset=UTF-8", "X-Upload-Content-Type": mime, "X-Upload-Content-Length": String(size), Origin: "https://app.cupofenglishatph.com" }, body: JSON.stringify(meta) });
  const loc = r.headers.get("location");
  if (r.status !== 200 || !loc) { console.warn("vid start", r.status, (await r.text()).slice(0, 300)); return { ok: false, msg: "Google did not open the upload (" + r.status + "). Try again in a minute." }; }
  const key = "vdb:" + crypto.randomUUID();
  const j = { ds, code, teacher, id: e.id, name, by: u.name, test: !!file.test, start: e.start, student: String(e.student || ""), end: e.end, img: !!img,
    dur: Math.round(Number(file.dur) || 0), lm: Math.round(Number(file.lm) || 0), why: String(file.why || "").slice(0, 60), note: String(file.note || "").slice(0, 400) };
  await db.from("coe_vid_up").insert({ key, data: j, by_name: u.name });
  return { ok: true, url: loc, key, name, chunk: 8 * 1024 * 1024 };
}

async function lateCase(j: any) {   // penalty_('Teacher Late Class Video Submission', 'Unexcused', …) — same POLICY rows, same case layout
  const subject = "Teacher Late Class Video Submission", condition = "Unexcused";
  let tier = "";
  try { const { data } = await db.from("coe_rank_cur").select("rank").ilike("teacher", j.teacher).limit(1); if (data && data[0] && data[0].rank) tier = String(data[0].rank); } catch (_) { /* */ }
  const [{ data: P }, { data: T }] = await Promise.all([db.from("sheet_rows").select("data").eq("tab", "POLICY"), tier ? Promise.resolve({ data: [] as any[] }) : db.from("sheet_rows").select("data").eq("tab", "T-DASH")]);
  if (!tier) (T || []).forEach((x: any) => { const r = x.data; if (Array.isArray(r) && lc(r[1]) === lc(j.teacher)) tier = String(r[6] || ""); });
  const status = /newly hired|starting/i.test(tier) ? "New" : "Regular";
  let amount = 0, pid = "", dem = 0;
  (P || []).forEach((x: any) => { const p = x.data; if (!Array.isArray(p)) return;
    if (p[2] === subject && p[4] === condition && (p[5] === status || p[5] === "All") && /active/i.test(String(p[12] || ""))) { amount = num(p[7]); pid = String(p[0] || ""); }
    if (p[1] === "Demerit" && lc(p[6]) === lc(tier)) dem = num(p[8]); });
  const yr = +man().slice(0, 4);
  const { data: cid, error } = await db.rpc("coe_case_next", { p_year: yr, p_min: 1, p_by: "App (automatic)", p_src: "video" });
  if (error || !cid) throw new Error("case number: " + (error && error.message));
  const who = [j.code, j.student].filter(Boolean).join(" ");
  const detail = "Class video for " + who + " " + j.ds + " · due " + j.ds + " 23:59 · uploaded in the app " + man().slice(0, 16).replace("T", " ") + " · automatic, management may waive";
  const when = man(new Date(j.start || (j.ds + "T12:00:00+08:00")).getTime()).slice(0, 19);
  const { error: e2 } = await db.from("coe_rec").insert({ tab: "ACTIONS", key: cid + "#1", sheet_r: 5, src: "app",
    data: [cid, subject, true, when, "Operations", "Operations", "Teaching Compliance", j.teacher, who, condition, status, tier, true, "", dem || "", "", amount, detail + " · " + pid + " · via app by App (automatic)"] });
  if (e2) throw new Error("case: " + e2.message);
  return { caseId: String(cid), amount };
}

async function vidDone(u: any, key: string, fileId: string) {
  key = String(key || ""); fileId = String(fileId || "");
  const { data: row } = await db.from("coe_vid_up").select("data,done").eq("key", key).maybeSingle();
  if (!row) return { ok: false, msg: "This upload is too old. Upload the video again." };
  if (row.done) return row.done;                                   // a repeated last step answers "saved" again
  const j = row.data || {};
  if (u.mode !== "mgmt" && lc(j.by) !== lc(u.name)) return { ok: false, msg: "Not your upload." };
  let f: any;
  try { f = await gJson("https://www.googleapis.com/drive/v3/files/" + encodeURIComponent(fileId) + "?supportsAllDrives=true&fields=id,name,size,md5Checksum,webViewLink,description"); }
  catch (_) { return { ok: false, msg: "The video did not arrive in Drive. Upload it again." }; }
  const url = String(f.webViewLink || ("https://drive.google.com/file/d/" + f.id + "/view?usp=drivesdk"));
  // checks (22 Oct): never block the upload; the teacher explains, management marks OK or Needs action
  const fl: any[] = [];
  if (!j.test) {
    const st = new Date(j.start).getTime(), en = new Date(j.end || j.start).getTime(), len = Math.round((en - st) / 60000);
    if (j.img) {
      const m0 = j.ds.slice(0, 7) + "-01", m1 = new Date(Date.UTC(+j.ds.slice(0, 4), +j.ds.slice(5, 7), 1)).toISOString().slice(0, 10);
      const { count } = await db.from("coe_class_videos").select("event_id", { count: "exact", head: true }).ilike("teacher", j.teacher).eq("proof", true).gte("day", m0).lt("day", m1).neq("event_id", j.id);
      const n = (count || 0) + 1;
      fl.push({ k: "proof", t: "Screen proof instead of a video" + (n > 1 ? " · " + n + " this month" : "") });
    } else {
      if (j.dur > 0 && len > 0 && j.dur / 60 < len * 0.8) fl.push({ k: "short", t: Math.max(1, Math.round(j.dur / 60)) + " min video for a " + len + " min class" });
      if (j.lm > 0 && j.lm < st - 10 * 60000) fl.push({ k: "time", t: "Recorded " + dMon(j.lm) + " · before the class started" });
      if (f.md5Checksum) { j.md5 = f.md5Checksum;
        const { data: was } = await db.from("coe_class_videos").select("event_id,code,student,day,teacher").eq("md5", j.md5).neq("event_id", j.id).limit(1);
        const w = was && was[0]; if (w) fl.push({ k: "same", t: "Same file as " + [w.code, w.student, w.day].filter(Boolean).join(" ") + (lc(w.teacher) !== lc(j.teacher) ? " (Teacher " + w.teacher + ")" : "") }); }
    }
    if (fl.length) try { await gApi("https://www.googleapis.com/drive/v3/files/" + f.id + "?supportsAllDrives=true", { method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: (f.description || "") + " · CHECK: " + fl.map((x) => x.t).join(" · ") + (j.why ? " · Teacher: " + j.why + (j.note ? " — " + j.note : "") : "") }) }); } catch (_) { /* */ }
  }
  const lateNow = Date.now() > new Date(j.ds + "T23:59:59+08:00").getTime();
  let lt: any = null;
  if (!j.test && j.ds >= VIDUP_FROM && lateNow) {   // after 23:59 of the class day: automatic Late Class Video case (management may waive it in Cases)
    const { data: had } = await db.from("coe_class_video_days").select("case_id").eq("event_id", j.id).eq("day", j.ds).not("case_id", "is", null).limit(1);
    if (had && had[0]) lt = { caseId: had[0].case_id, amount: 0 };
    else try { lt = await lateCase(j); } catch (x) { console.warn("vid late case", x); }
  }
  if (!j.test) {
    const rec = { event_id: j.id, day: j.ds, start_at: j.start || null, teacher: j.teacher, code: j.code || null, student: j.student || null,
      file_id: f.id, name: f.name, url, via: "app", proof: !!j.img, size_bytes: +f.size || null, dur_sec: j.dur || null, late: !!lt || lateNow,
      case_id: (lt && lt.caseId) || null, md5: j.md5 || null, flags: fl, why: j.why || null, note: j.note || null, uploaded_by: u.name, uploaded_at: new Date().toISOString() };
    const a = await db.from("coe_class_videos").upsert(rec, { onConflict: "event_id" });
    const b = await db.from("coe_class_video_days").upsert(rec, { onConflict: "event_id,day" });
    if (a.error || b.error) console.warn("video log", a.error, b.error);
    try { await vidsDoc({ day: j.ds, key: String(j.code || "").toUpperCase() + "|" + lc(j.teacher), flag: fl.length ? { id: j.id, ds: j.ds, start: j.start, teacher: j.teacher, code: j.code, student: j.student, url, name: f.name, flags: fl, why: j.why || "", note: j.note || "", at: Date.now(), st: "open", by: "", dnote: "" } : null }); } catch (x) { console.warn("sys:vids", x); }
  }
  const res = { ok: true, url, name: f.name, linked: false, late: lt || lateNow, flags: fl, note: "Class video saved · " + f.name };
  await db.from("coe_vid_up").update({ done: res, file_id: f.id }).eq("key", key);
  return res;
}
// sys:vids (Today, Schedule, the video checks): kept by the database now. One upload is added at once; vidsBuild() rebuilds from the tables
// and keeps every entry Google had made (Drive-found videos), so nothing that showed before disappears.
async function vidsDoc(add?: { day: string; key: string; flag: any }) {
  const { data } = await db.from("docs").select("data").eq("key", "sys:vids").maybeSingle();
  const d = (data && data.data) || { flags: [], days: {} }; d.days = d.days || {}; d.flags = Array.isArray(d.flags) ? d.flags : [];
  if (add) { if (add.key && add.key[0] !== "|") (d.days[add.day] = d.days[add.day] || {})[add.key] = 1;
    if (add.flag) { d.flags = d.flags.filter((x: any) => x.id !== add.flag.id); d.flags.unshift(add.flag); } }
  d.at = Date.now();
  await db.from("docs").upsert({ key: "sys:vids", scope: "mgmt", data: d, updated_at: new Date().toISOString() });
  return d;
}
const flagRow = (r: any) => ({ id: r.event_id, ds: r.day, start: r.start_at ? new Date(r.start_at).toISOString() : "", teacher: r.teacher, code: r.code || "", student: r.student || "", url: r.url, name: r.name,
  flags: r.flags || [], why: r.why || "", note: r.note || "", at: r.uploaded_at ? Date.parse(r.uploaded_at) : 0, st: r.review || "open", by: r.reviewed_by || "", dnote: r.review_note || "", dat: r.reviewed_at ? Date.parse(r.reviewed_at) : undefined });
async function flagsAll() {   // last 60 days, from the database; review state from the database (Google's copy as a fallback for older ones)
  const cut = new Date(Date.now() - 60 * 864e5).toISOString();
  const { data } = await db.from("coe_class_video_days").select("event_id,day,start_at,teacher,code,student,url,name,flags,why,note,review,reviewed_by,review_note,reviewed_at,uploaded_at").gte("uploaded_at", cut).neq("flags", "[]").limit(2000);
  const { data: doc } = await db.from("docs").select("data").eq("key", "sys:vids").maybeSingle();
  const old: Record<string, any> = {}; (((doc && doc.data) || {}).flags || []).forEach((x: any) => { old[x.id + "|" + x.ds] = x; });
  const seen: Record<string, 1> = {}, out: any[] = [];
  (data || []).forEach((r: any) => { if (!Array.isArray(r.flags) || !r.flags.length) return; const x = flagRow(r), o = old[x.id + "|" + x.ds];
    if (o && !r.review && o.st && o.st !== "open") { x.st = o.st; x.by = o.by || ""; x.dnote = o.dnote || ""; x.dat = o.dat; }
    seen[x.id + "|" + x.ds] = 1; out.push(x); });
  Object.keys(old).forEach((k) => { if (!seen[k] && (old[k].at || 0) > Date.now() - 60 * 864e5) out.push(old[k]); });
  return out.sort((a, b) => String(b.start).localeCompare(String(a.start)));
}
export async function vidsBuild() {
  const { data } = await db.from("docs").select("data").eq("key", "sys:vids").maybeSingle();
  const d = (data && data.data) || { flags: [], days: {} }, days: Record<string, Record<string, 1>> = {};
  const today = man().slice(0, 10), from = new Date(Date.parse(today + "T00:00:00Z") - 7 * 864e5).toISOString().slice(0, 10);
  Object.keys(d.days || {}).forEach((ds) => { if (ds >= from) days[ds] = { ...(d.days[ds] || {}) }; });
  for (const t of ["coe_class_video_days", "coe_class_videos"]) {
    const { data: R } = await db.from(t).select("day,code,teacher,url").gte("day", from).limit(5000);
    (R || []).forEach((r: any) => { if (!r.code || !r.url) return; (days[r.day] = days[r.day] || {})[String(r.code).toUpperCase() + "|" + lc(r.teacher)] = 1; });
  }
  const flags = await flagsAll();
  await db.from("docs").upsert({ key: "sys:vids", scope: "mgmt", data: { flags, days, at: Date.now() }, updated_at: new Date().toISOString() });
  return { flags: flags.length, days: Object.keys(days).length };
}
async function vidList(u: any) {   // classes of the last 7 days (from 22 Oct) that still have no class video
  const me = lc(u.name), today = man().slice(0, 10), out: any[] = [];
  const from = new Date(Date.parse(today + "T00:00:00Z") - 7 * 864e5).toISOString().slice(0, 10), to = new Date(Date.parse(today + "T00:00:00Z") - 864e5).toISOString().slice(0, 10);
  const { data: C } = await db.from("classes").select("day,data").contains("teachers", JSON.stringify([me])).gte("day", from).lte("day", to).limit(500);
  const { data: V } = await db.from("coe_class_video_days").select("day,code,teacher,url").gte("day", from).lte("day", to).limit(3000);
  const { data: V2 } = await db.from("coe_class_videos").select("day,code,teacher,url").gte("day", from).lte("day", to).limit(3000);
  const { data: doc } = await db.from("docs").select("data").eq("key", "sys:vids").maybeSingle();
  const has: Record<string, 1> = {}; [...(V || []), ...(V2 || [])].forEach((r: any) => { if (r.url && r.code) has[r.day + "|" + String(r.code).toUpperCase() + "|" + lc(r.teacher)] = 1; });
  const dd = ((doc && doc.data) || {}).days || {}; Object.keys(dd).forEach((ds) => Object.keys(dd[ds] || {}).forEach((k) => { has[ds + "|" + k] = 1; }));
  (C || []).forEach((r: any) => { const e = r.data || {}; if (r.day < VIDUP_FROM || e.cancelled || !e.code || (e.teachers || []).map(lc).indexOf(me) < 0) return;
    if (has[r.day + "|" + String(e.code).toUpperCase() + "|" + me]) return;
    out.push({ id: e.id, start: e.start, end: e.end, code: e.code, student: e.student || "", book: e.book || "", day: r.day, type: /trial/i.test(e.title || "") ? "Trial" : /\bsub\b/i.test(e.title || "") ? "Sub" : "" }); });
  return { ok: true, list: out.sort((a, b) => String(b.start).localeCompare(String(a.start))) };
}
async function patchVid(id: string, ds: string | null, patch: any) {
  let a = db.from("coe_class_video_days").update(patch).eq("event_id", id); if (ds) a = a.eq("day", ds); await a;
  await db.from("coe_class_videos").update(patch).eq("event_id", id);
}


// ───────────────────────── tomorrow's classes by email (ported unchanged from DAYSCHEDULE.gs)
const DS_MGMT = ["operations@cupofenglishatph.com"];
const dsEsc = (x: unknown) => String(x == null ? "" : x).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" } as any)[c]);
const dsRows = (L: any[]) => L.map((c) => '<tr><td style="padding:6px 10px;border-bottom:1px solid #eee"><b>' + c.start + "</b>–" + c.end + '</td><td style="padding:6px 10px;border-bottom:1px solid #eee">' +
  dsEsc(c.student) + (c.type ? " (" + dsEsc(c.type) + ")" : "") + '<br><span style="color:#777">' + dsEsc([c.code, c.book].filter(Boolean).join(" · ")) + '</span></td><td style="padding:6px 10px;border-bottom:1px solid #eee">' + dsEsc(c.meet || "") + "</td></tr>").join("");
const dsTable = (L: any[]) => '<table style="border-collapse:collapse;font:14px Arial,sans-serif"><tr style="background:#f3f2f8"><th align="left" style="padding:6px 10px">Time (Manila)</th><th align="left" style="padding:6px 10px">Student</th><th align="left" style="padding:6px 10px">Meeting ID</th></tr>' + dsRows(L) + "</table>";
const DS_FOOT = '<p style="color:#777;font:12px Arial,sans-serif">This is your backup copy of tomorrow\'s schedule, sent outside the app. The app is still the main record: changes made after this email (cancellations, new classes) show only in the app. If the app is down, send your time-in screenshot to the teachers\' WeChat group and Operations will enter it later.</p>';
const DSW = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], DSM = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dsLabel = (day: string) => { const d = new Date(day + "T12:00:00Z"); return DSW[d.getUTCDay()] + " " + d.getUTCDate() + " " + DSM[d.getUTCMonth()] + " " + d.getUTCFullYear(); };
const b64 = (s: string) => { const u = new TextEncoder().encode(s); let bin = ""; for (let i = 0; i < u.length; i += 0x8000) bin += String.fromCharCode(...u.subarray(i, i + 0x8000)); return btoa(bin); };
async function gmailSend(to: string, subject: string, html: string) {
  const mime = ["From: CupOfEnglish <" + AS + ">", "To: " + to, "Subject: =?UTF-8?B?" + b64(subject) + "?=", "MIME-Version: 1.0", "Content-Type: text/html; charset=UTF-8", "Content-Transfer-Encoding: base64", "", b64(html).replace(/.{76}/g, "$&\r\n")].join("\r\n");
  const raw = b64(mime).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const r = await gApi("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ raw }) });
  if (!r.ok) throw new Error("Gmail " + r.status + " " + (await r.text()).slice(0, 200));
}
async function daySchedule(dry: boolean) {
  const { data: d, error } = await db.rpc("coe_day_schedule"); if (error || !d || !d.day) throw new Error("The database gave no schedule");
  const { data: was } = await db.from("docs").select("data").eq("key", "sys:dayschedule").maybeSingle();
  if (!dry && was && was.data && was.data.day === d.day && ((was.data.sent || []).length || !(was.data.fail || []).length)) return { ok: true, skipped: "already sent for " + d.day };   // 3175: a run where every email failed can be sent again
  const label = dsLabel(d.day), T = d.teachers || [], sent: string[] = [], fail: string[] = [];
  const mails: { to: string; subject: string; html: string }[] = [];
  T.forEach((t: any) => { if (!t.email || !t.classes || !t.classes.length) return;
    mails.push({ to: t.email, subject: "Your classes tomorrow, " + label + " (" + t.classes.length + ")",
      html: '<p style="font:14px Arial,sans-serif">Hi Teacher ' + dsEsc(t.teacher) + ", here are your classes for <b>" + label + "</b>.</p>" + dsTable(t.classes) + DS_FOOT }); });
  const all = T.map((t: any) => '<h3 style="font:600 15px Arial,sans-serif;margin:18px 0 6px">Teacher ' + dsEsc(t.teacher) + " · " + t.classes.length + "</h3>" + dsTable(t.classes)).join("");
  DS_MGMT.forEach((to) => mails.push({ to, subject: "All classes tomorrow, " + label + " (" + d.total + ")", html: '<p style="font:14px Arial,sans-serif"><b>' + label + "</b> · " + d.total + " classes · " + T.length + " teachers.</p>" + all + DS_FOOT }));
  if (dry) return { ok: true, dry: true, day: d.day, mails: mails.map((m) => ({ to: m.to, subject: m.subject, bytes: m.html.length })) };
  for (const m of mails) { try { await gmailSend(m.to, m.subject, m.html); sent.push(m.to); } catch (e) { fail.push(m.to + ": " + String((e as Error).message || e).slice(0, 120)); } }
  await db.from("docs").upsert({ key: "sys:dayschedule", scope: "pres", data: { day: d.day, at: Date.now(), sent, fail }, updated_at: new Date().toISOString() });
  return { ok: !fail.length, day: d.day, sent: sent.length, fail };
}


// ───────────────────────── books folder scan (ported from booksScan16_)
const BK16_ROOT = "1TXgfR2yOKWSdq59muGLNeWGv8h6PVpVc";
async function children(id: string) {
  const out: any[] = []; let pt = "";
  do { const j = await gJson("https://www.googleapis.com/drive/v3/files?q=" + encodeURIComponent(`'${id}' in parents and trashed=false`) + "&fields=nextPageToken,files(id,name,mimeType,size)&pageSize=1000&supportsAllDrives=true&includeItemsFromAllDrives=true" + (pt ? "&pageToken=" + pt : ""));
    out.push(...(j.files || [])); pt = j.nextPageToken || ""; } while (pt);
  return out;
}
async function booksScan() {
  const t0 = Date.now(), { data: st0 } = await db.from("docs").select("data").eq("key", "sys:books16").maybeSingle();
  let st: any = (st0 && st0.data) || {};
  if (!st.queue || !st.queue.length) {
    if (st.done_at && Date.now() - st.done_at < 20 * 3600e3) return { ok: true, skipped: "scanned " + new Date(st.done_at).toISOString() };
    st = { run: new Date().toISOString(), queue: [{ id: BK16_ROOT, path: "", depth: 0 }], files: 0 };
  }
  while (st.queue.length && Date.now() - t0 < 100e3) {
    const batch = st.queue.splice(0, 6);
    const res = await Promise.all(batch.map(async (f: any) => ({ f, L: await children(f.id) })));
    const rows: any[] = [];
    for (const { f, L } of res) for (const x of L) {
      if (x.mimeType === FOLDER) { if (f.depth < 4) st.queue.push({ id: x.id, path: (f.path ? f.path + " / " : "") + x.name, depth: f.depth + 1 }); continue; }
      rows.push({ id: x.id, name: x.name, path: f.path, mime: x.mimeType, folder_id: f.id, size: x.size != null ? +x.size : null, seen_at: st.run, gone_at: null });
    }
    for (let i = 0; i < rows.length; i += 400) { const { error } = await db.from("coe_book_files").upsert(rows.slice(i, i + 400), { onConflict: "id" }); if (error) throw new Error("books save: " + error.message); }
    st.files += rows.length;
  }
  let fin: any = null;
  if (!st.queue.length) {
    const { count } = await db.from("coe_book_files").select("id", { count: "exact", head: true }).is("gone_at", null);
    if (st.files >= 0.8 * (count || 0)) await db.from("coe_book_files").update({ gone_at: new Date().toISOString() }).lt("seen_at", st.run).is("gone_at", null);
    try { await db.rpc("coe_book_automatch"); } catch (_) { /* */ }
    fin = { files: st.files, before: count }; st = { done_at: Date.now(), files: st.files, run: st.run };
  }
  await db.from("docs").upsert({ key: "sys:books16", scope: "pres", data: st, updated_at: new Date().toISOString() });
  return { ok: true, left: (st.queue || []).length, files: st.files, finished: fin };
}

// ───────────────────────── coaching and training recordings → Drive (ported from rec8Run)
const VIDEO_ROOT = "1BtfJ4G6qQXi73Ctj_Tb3ehwZnGKjUuDd";   // TEACHERS VIDEO CLASSES
const rec8Clean = (s: string) => String(s || "").replace(/[\\/:*?"<>|#%]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 80);
const ymdM = (d: string) => man(Date.parse(d)).slice(0, 10);
async function rec8Items() {
  const out: any[] = [];
  const { data: T0 } = await db.from("coe_trainings").select("id,title"); const T: Record<string, string> = {}; (T0 || []).forEach((t: any) => { T[t.id] = t.title; });
  const { data: R } = await db.from("coe_training_records").select("id,teacher,done_at,note,status").eq("training_id", "coach").order("id");
  (R || []).forEach((r: any) => { const n = String(r.note || ""), f = (n.match(/§file:(\S+)/) || [])[1], v = (n.match(/§video:(\S+)/) || [])[1], coach = ((n.match(/§coach:([^\n]+)/) || [])[1] || "").trim();
    if (!f && !v) return; out.push({ key: "c" + r.id, kind: "COACHINGS", sub: String(r.teacher || "").toUpperCase(), name: ymdM(r.done_at) + "-" + rec8Clean(r.teacher) + "-coaching" + (coach ? "-by-" + rec8Clean(coach) : ""), path: f || "", link: f ? "" : v }); });
  const { data: S } = await db.from("coe_training_sessions").select("id,training_id,starts_at,facilitator,recording_path").not("recording_path", "is", null).order("id");
  (S || []).forEach((x: any) => { const t = T[x.training_id] || x.training_id || "Training";
    out.push({ key: "s" + x.id, kind: "TRAININGS", sub: String(t).toUpperCase(), name: ymdM(x.starts_at) + "-" + rec8Clean(t) + (x.facilitator ? "-by-" + rec8Clean(x.facilitator) : ""), path: x.recording_path, link: "" }); });
  const { data: P } = await db.from("coe_training_parts").select("id,training_id,title,video_path").not("video_path", "is", null).order("id");
  (P || []).forEach((x: any) => { const t = T[x.training_id] || x.training_id || "Training"; out.push({ key: "p" + x.id, kind: "TRAININGS", sub: String(t).toUpperCase(), name: rec8Clean(x.title), path: x.video_path, link: "" }); });
  try { for (const Tf of await folders(`'${VIDEO_ROOT}' in parents and mimeType='${FOLDER}' and trashed=false`))
    for (const Sf of await folders(`'${Tf.id}' in parents and mimeType='${FOLDER}' and trashed=false`))
      if (/training/i.test(Sf.name)) out.push({ key: "f" + Sf.id, kind: "TRAININGS", sub: "FROM TEACHER FOLDERS", name: String(Tf.name).trim() + " · " + String(Sf.name).trim(), path: "", link: Sf.id });
  } catch (e) { console.warn("rec8 old folders", e); }
  return out;
}
async function rec8Top(name: string) {   // COACHINGS / TRAININGS next to STUDENT CLASS VIDEOS
  const m = await memo("rec8:" + name); if (m) return m;
  const root = await rootId(), j = await gJson("https://www.googleapis.com/drive/v3/files/" + root + "?fields=parents&supportsAllDrives=true");
  const id = await child((j.parents || [])[0], name); await memoSet("rec8:" + name, id); return id;
}
async function rec8Run() {
  const t0 = Date.now(), L = await rec8Items(); let made = 0, err = 0, left = 0;
  const { data: D } = await db.from("coe_rec8").select("*"); const S: Record<string, any> = {}; (D || []).forEach((r: any) => { S[r.key] = r; });
  const subs: Record<string, string> = {};
  for (const x of L) {
    const st = S[x.key]; if (st && (st.status === "done" || st.status === "none")) continue;
    if (Date.now() - t0 > 100e3) { left++; continue; }
    try {
      const top = await rec8Top(x.kind), sk = x.kind + "|" + x.sub, sub = subs[sk] || (subs[sk] = await child(top, x.sub || "OTHER"));
      if (!x.path) {   // a Drive link (or an old TRAINING folder): one shortcut
        const tid = (String(x.link).match(/[-\w]{25,}/) || [])[0]; if (!tid) { await db.from("coe_rec8").upsert({ key: x.key, status: "none", name: x.name, at: new Date().toISOString() }); continue; }
        const nm = x.name + " (link)", have = await folders(`'${sub}' in parents and name='${q(nm)}' and trashed=false`);
        if (!have.length) await gJson("https://www.googleapis.com/drive/v3/files?supportsAllDrives=true&fields=id", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: nm, mimeType: "application/vnd.google-apps.shortcut", parents: [sub], shortcutDetails: { targetId: tid } }) });
        await db.from("coe_rec8").upsert({ key: x.key, status: "done", name: nm, at: new Date().toISOString() }); made++; continue;
      }
      const ext = (String(x.path).match(/\.(\w{2,5})$/) || [, "mp4"])[1].toLowerCase(), mime = ext === "webm" ? "video/webm" : ext === "mov" ? "video/quicktime" : "video/mp4", nm = x.name + "." + ext;
      if (!st || !st.session) { const have = await folders(`'${sub}' in parents and name='${q(nm)}' and trashed=false`);
        if (have.length) { await db.from("coe_rec8").upsert({ key: x.key, status: "done", name: nm, file_id: have[0].id, at: new Date().toISOString() }); continue; } }
      const { data: sg, error: se } = await db.storage.from("trainings").createSignedUrl(x.path, 3600); if (se || !sg) throw new Error("sign " + (se && se.message));
      const src = sg.signedUrl, h0 = await fetch(src, { headers: { Range: "bytes=0-0" } }), size = +String(h0.headers.get("content-range") || "").split("/")[1]; try { await h0.body?.cancel(); } catch (_) { /* */ }
      if (!(size > 1)) throw new Error("size " + h0.status);
      let session = st && st.session && st.size === size ? st.session : "", off = 0;
      if (session) { const q0 = await fetch(session, { method: "PUT", headers: { "Content-Range": "bytes */" + size } }); if (q0.status === 308) { const g = q0.headers.get("range"); off = g ? +g.split("-")[1] + 1 : 0; } else if (q0.status === 200 || q0.status === 201) off = size; else session = ""; }
      if (!session) {
        const r = await gApi("https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true", { method: "POST", headers: { "Content-Type": "application/json", "X-Upload-Content-Type": mime, "X-Upload-Content-Length": String(size) }, body: JSON.stringify({ name: nm, parents: [sub] }) });
        session = r.headers.get("location") || ""; if (!session) throw new Error("session " + r.status); off = 0;
      }
      const CH = 16 * 1024 * 1024; let id = "";
      while (off < size && Date.now() - t0 < 110e3) {
        const b = Math.min(size, off + CH) - 1, part = await fetch(src, { headers: { Range: "bytes=" + off + "-" + b } }); if ([200, 206].indexOf(part.status) < 0) throw new Error("read " + part.status);
        const up = await fetch(session, { method: "PUT", headers: { "Content-Range": "bytes " + off + "-" + b + "/" + size }, body: new Uint8Array(await part.arrayBuffer()) });
        if (up.status === 200 || up.status === 201) { id = (await up.json()).id; off = size; } else if (up.status === 308) { const g = up.headers.get("range"); off = g ? +g.split("-")[1] + 1 : 0; } else throw new Error("upload " + up.status + " " + (await up.text()).slice(0, 120));
      }
      await db.from("coe_rec8").upsert(off >= size && id ? { key: x.key, status: "done", name: nm, file_id: id, session: null, size, at: new Date().toISOString() } : { key: x.key, status: "up", name: nm, session, size, at: new Date().toISOString() });
      if (id) made++; else left++;
    } catch (e) { err++; console.warn("rec8 " + x.key, e); await db.from("coe_rec8").upsert({ key: x.key, status: "err", name: x.name, err: String((e as Error).message || e).slice(0, 300), at: new Date().toISOString() }); }
  }
  return { ok: true, items: L.length, made, left, err };
}


// ───────────────────────── President: first time or forgot password (ported from requestCode / setPassword)
async function pwHash(salt: string, pw: string, pep: string) {   // = coe-pw pwHash = coe login
  const enc = new TextEncoder(), sb = enc.encode(salt);
  let d = new Uint8Array(await crypto.subtle.digest("SHA-256", enc.encode(salt + "|" + pw + "|" + pep)));
  for (let i = 0; i < 400; i++) { const x = new Uint8Array(d.length + sb.length); x.set(d); x.set(sb, d.length); d = new Uint8Array(await crypto.subtle.digest("SHA-256", x)); }
  let bin = ""; d.forEach((c) => bin += String.fromCharCode(c)); return btoa(bin);
}
const pwBad = (email: string, pw: string) => pw.length < 8 ? "Use at least 8 characters." : (pw.toLowerCase() === email || /^(\d)\1+$/.test(pw) || /^(12345678|password|qwertyui)/i.test(pw)) ? "Choose a harder password." : "";
const isMgrR = (r: string) => /ops|operation|manag|admin|president/i.test(r || ""), isPresR = (r: string) => /president/i.test(r || "");
const accessErr = (u: any, mode: string) => mode === "mgmt" && !isMgrR(u.role) ? "This Gmail has teacher access only. Choose Teacher." : mode !== "mgmt" && !/teacher/i.test(u.role || "") ? "This Gmail is a management account. Choose Management." : "";
async function requestCode(b: any) {
  const email = String(b.email || "").trim().toLowerCase(), mode = b.mode === "mgmt" ? "mgmt" : "teacher";
  const { data: u } = await db.from("auth_users").select("name,role").eq("email", email).maybeSingle();
  if (!u) return { ok: false, msg: "This Gmail is not registered yet. Please message Ops." };
  const bad = accessErr(u, mode); if (bad) return { ok: false, msg: bad };
  if (!(mode === "mgmt" && isPresR(u.role))) return { ok: false, msg: mode === "mgmt" ? "Please ask the President for your password." : "Please message Ops for your password." };
  const { data: o } = await db.from("coe_otp").select("code,exp,tries").eq("email", email).maybeSingle();
  const keep = o && Date.parse(o.exp) > Date.now() + 120000, code = keep ? o.code : String(100000 + (crypto.getRandomValues(new Uint32Array(1))[0] % 900000));
  await db.from("coe_otp").upsert({ email, code, exp: new Date(Date.now() + 15 * 60000).toISOString(), tries: keep ? o.tries || 0 : 0 });
  await gmailSend(email, "CupOfEnglish app · your sign-in code " + code, '<div style="font-family:Rockwell,Georgia,serif;color:#2D2A4A"><p>Hi ' + dsEsc(u.name) + ',</p><p>Your sign-in code is</p><p style="font-size:28px;letter-spacing:6px;color:#5B9EA6"><b>' + code + '</b></p><p style="color:#9E9E9E">It expires in 15 minutes.</p></div>');
  return { ok: true };
}
async function setPassword(b: any) {
  const email = String(b.email || "").trim().toLowerCase(), code = String(b.code || "").replace(/\D/g, ""), pw = String(b.pw || ""), mode = b.mode === "mgmt" ? "mgmt" : "teacher";
  const { data: o } = await db.from("coe_otp").select("code,exp,tries").eq("email", email).maybeSingle();
  if (!o || Date.parse(o.exp) < Date.now()) return { ok: false, msg: "This code has expired. Tap Back and send a new code." };
  if ((o.tries || 0) >= 8) return { ok: false, msg: "Too many tries. Tap Back and send a new code." };
  if (o.code !== code) { await db.from("coe_otp").update({ tries: (o.tries || 0) + 1 }).eq("email", email); return { ok: false, msg: "That code does not match. Use the newest email from CupOfEnglish." }; }
  const { data: u } = await db.from("auth_users").select("name,role").eq("email", email).maybeSingle(); if (!u) return { ok: false, msg: "This Gmail is not registered." };
  const bad = accessErr(u, mode) || pwBad(email, pw); if (bad) return { ok: false, msg: bad };
  const { data: sec } = await db.from("auth_secret").select("v").eq("k", "pepper").maybeSingle(); if (!sec || !sec.v) return { ok: false, msg: "Not saved. Try again." };
  try { await db.rpc("coe_auth_unblock", { p_email: email }); } catch (_) { /* */ }
  const salt = crypto.randomUUID(), hash = await pwHash(salt, pw, sec.v), now = new Date();
  const { error } = await db.from("auth_pw").upsert({ email, salt, hash, at: now.getTime(), updated_at: now.toISOString(), src: "db", set_at: now.toISOString(), set_by: email + " (email code)" }, { onConflict: "email" });
  if (error) return { ok: false, msg: "Not saved. Try again." };
  await db.from("auth_fails").delete().eq("email", email); await db.from("coe_otp").delete().eq("email", email);
  const token = crypto.randomUUID(), exp = new Date(Date.now() + 60 * 864e5).toISOString();
  const { error: e2 } = await db.from("app_sessions").insert({ token_hash: await sha(token), email, name: u.name || "", role: u.role || "", mode, exp, src: "db", updated_at: now.toISOString() });
  if (e2) return { ok: false, msg: "Password saved. Sign in with it now." };
  return { ok: true, token, mode, via: "db" };
}

Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  if (b.op === "requestCode") { try { return out(await requestCode(b)); } catch (e) { console.warn("code", e); return out({ ok: false, msg: "The email could not be sent. Try again in a minute." }); } }
  if (b.op === "setPassword") { try { return out(await setPassword(b)); } catch (e) { console.warn("setpw", e); return out({ ok: false, msg: "Not saved. Try again." }); } }
  // who: the server key (only the database knows it) or an app session
  let srv = false, pres = false, me = "", sess: any = null;
  const sk = req.headers.get("x-coe-srv") || "";
  if (sk.length >= 32) { const { data } = await db.from("coe_srv_key").select("k").eq("k_hash", await sha(sk)).maybeSingle(); srv = !!data; }
  if (!srv) {
    const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
    const { data: s } = await db.from("app_sessions").select("name,role,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
    if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
    pres = s.mode === "mgmt" && /president/i.test(String(s.role || "")); me = String(s.name || ""); sess = s;
  }
  const op = String(b.op || "");
  try {
    if (op === "probe") {
      if (!srv && !pres) return out({ ok: false, error: "Only the President can do this." }, 403);
      const r = await gApi("https://www.googleapis.com/drive/v3/about?fields=user(emailAddress,displayName),storageQuota");
      const j = await r.json(); return out({ ok: r.ok, user: j.user, quota: j.storageQuota, err: r.ok ? undefined : j });
    }
    if (op === "script_src") {
      if (!srv) return out({ ok: false, error: "server only" }, 403);
      const q = encodeURIComponent("mimeType='application/vnd.google-apps.script' and trashed=false");
      const l = await (await gApi(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name,modifiedTime)&pageSize=100&supportsAllDrives=true&includeItemsFromAllDrives=true`)).json();
      const files = l.files || [], got: any[] = [];
      for (const f of files) {
        const r = await gApi(`https://www.googleapis.com/drive/v3/files/${f.id}/export?mimeType=${encodeURIComponent("application/vnd.google-apps.script+json")}`);
        const t = await r.text(); got.push({ id: f.id, name: f.name, modified: f.modifiedTime, ok: r.ok, size: t.length });
        if (r.ok) await db.from("coe_gas_src").upsert({ id: f.id, name: f.name, modified: f.modifiedTime, src: JSON.parse(t), copied_at: new Date().toISOString() });
      }
      return out({ ok: true, files: got, list: l.error || undefined });
    }
    const A = Array.isArray(b.args) ? b.args : [];
    if (op === "books_scan") { if (!srv) return out({ ok: false, error: "server only" }, 403); return out(await booksScan()); }
    if (op === "rec8") { if (!srv) return out({ ok: false, error: "server only" }, 403); return out(await rec8Run()); }
    if (op === "day_schedule") { if (!srv) return out({ ok: false, error: "server only" }, 403); return out(await daySchedule(!!b.dry)); }
    if (op === "vids_build") { if (!srv && !pres) return out({ ok: false, error: "Only the President can do this." }, 403); return out({ ok: true, ...(await vidsBuild()) }); }
    if (!sess) return out({ ok: false, error: "AUTH" }, 401);
    const mgmt = sess.mode === "mgmt";
    // 3154 (Misty 28 Nov, Shirui): a pause in learning that the records cannot show, kept per student (table coe_pauses); management only
    if (op === "pzList") { if (!mgmt) return out({ ok: false, error: "Management only" }, 403);
      const { data } = await db.from("coe_pauses").select("id,code,d_from,d_to,note,by_name,created_at").order("d_from"); const map: Record<string, any[]> = {};
      (data || []).forEach((r: any) => { (map[r.code] = map[r.code] || []).push([r.d_from, r.d_to || "", r.note || "", r.id, r.by_name || ""]); }); return out({ ok: true, map }); }
    if (op === "pzSet") { if (!mgmt) return out({ ok: false, error: "Management only" }, 403);
      const code = String(A[0] || "").trim().toUpperCase(), f = String(A[1] || "").slice(0, 10), t = String(A[2] || "").slice(0, 10), note = String(A[3] || "").slice(0, 300);
      if (!/^ST-\d{4}-\d{3}$/.test(code) || !/^\d{4}-\d{2}-\d{2}$/.test(f) || (t && !/^\d{4}-\d{2}-\d{2}$/.test(t)) || (t && t < f)) return out({ ok: false, msg: "Check the dates." });
      const { error } = await db.from("coe_pauses").insert({ code, d_from: f, d_to: t || null, note, by_name: me }); if (error) return out({ ok: false, msg: "Not saved. Try again." }); return out({ ok: true }); }
    if (op === "pzDel") { if (!mgmt) return out({ ok: false, error: "Management only" }, 403);
      const { error } = await db.from("coe_pauses").delete().eq("id", +A[0] || 0); return out({ ok: !error }); }
    if (op === "tVidStart") return out(await vidStart(sess, A[0], A[1]));
    if (op === "tVidDone") return out(await vidDone(sess, A[0], A[1]));
    if (op === "tVidList") return out(await vidList(sess));
    if (op === "tVidFlags") return out({ ok: true, list: (await flagsAll()).filter((x) => lc(x.teacher) === lc(me)) });
    if (op === "tVidExplain") {
      const id = String(A[0] || ""), L = await flagsAll(), x = L.find((y) => y.id === id && lc(y.teacher) === lc(me)) || L.find((y) => y.id === id);
      if (!x) return out({ ok: false, msg: "Not found." }); if (lc(x.teacher) !== lc(me)) return out({ ok: false, msg: "Not your class." });
      if (x.st !== "open") return out({ ok: false, msg: "Management already reviewed this video." });
      await patchVid(x.id, x.ds, { why: String(A[1] || "").slice(0, 60), note: String(A[2] || "").slice(0, 400) }); await vidsBuild(); return out({ ok: true });
    }
    if (op === "mgmtVidFlags") { if (!mgmt) return out({ ok: false, error: "Management only" }, 403); const L = await flagsAll(); return out({ ok: true, list: L.filter((x) => x.st === "open").concat(L.filter((x) => x.st !== "open")) }); }
    if (op === "mgmtVidFlagSet") {
      if (!mgmt) return out({ ok: false, error: "Management only" }, 403);
      const id = String(A[0] || ""), st = String(A[1] || ""), note = String(A[2] || "").slice(0, 300);
      if (["ok", "action", "open"].indexOf(st) < 0) return out({ ok: false, msg: "Choose OK or Needs action." });
      const x = (await flagsAll()).find((y) => y.id === id); if (!x) return out({ ok: false, msg: "Not found." });
      await patchVid(x.id, x.ds, { review: st, reviewed_by: me, review_note: note, reviewed_at: new Date().toISOString() });
      x.st = st; x.by = me; x.dat = Date.now(); x.dnote = note; await vidsBuild(); return out({ ok: true, item: x });
    }
    if (op === "mgmtRoadmap") {
      if (!mgmt) return out({ ok: false, error: "Management only" }, 403);
      const name = String(A[0] || "").trim(); if (!/^COE-RM-[A-Z0-9-]{2,20}$/.test(name)) return out({ ok: false, msg: "Bad name" });
      let id = await memo("rm:" + name);
      if (!id) { const L = await folders("(" + [".jpg", ".jpeg", ".png", ""].map((x) => "name = '" + name + x + "'").join(" or ") + ") and trashed = false"); if (!L.length) return out({ ok: false, missing: true }); id = L[0].id; await memoSet("rm:" + name, id); }
      const r = await gApi("https://www.googleapis.com/drive/v3/files/" + id + "?alt=media&supportsAllDrives=true"); if (!r.ok) return out({ ok: false, missing: true });
      const buf = new Uint8Array(await r.arrayBuffer()); let bin = ""; for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
      return out({ ok: true, type: r.headers.get("content-type") || "image/jpeg", b64: btoa(bin) });
    }
    if (op === "mgmtTrialSentPic") {
      if (!mgmt) return out({ ok: false, error: "Management only" }, 403);
      const label = String(A[0] || ""), what = String(A[1] || "").slice(0, 60); if (!label || !what) return out({ ok: false });
      const { data: R } = await db.from("sheet_rows").select("r,data").eq("tab", "TR-DATA").eq("data->>0", label).limit(1);
      const row = R && R[0]; if (!row) return out({ ok: false, msg: "Trial report not found." });
      const at = man().slice(0, 16).replace("T", " "), d = Array.isArray(row.data) ? row.data.slice() : []; while (d.length < 45) d.push("");
      const old = String(d[44] || ""); d[44] = (old ? old + " · " : "") + what + " sent " + at + " by " + me;
      const { error } = await db.from("sheet_rows").update({ data: d, updated_at: new Date().toISOString() }).eq("tab", "TR-DATA").eq("r", row.r);
      if (error) return out({ ok: false, msg: "Not saved. Try again." });
      return out({ ok: true, at });
    }
    return out({ ok: false, error: "unknown op" }, 400);
  } catch (e) { return out({ ok: false, error: String((e as Error).message || e).slice(0, 400) }, 500); }
});
