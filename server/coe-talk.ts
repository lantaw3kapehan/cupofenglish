// CupOfEnglish · coe-talk v18 (20 Nov: Speaking history ops speak / speakList, internal) · v17 (20 Nov: words and phrases keep a short meaning and Oxford IPA; IPA filled on approve and by op ipa) · v12 (19 Nov: a week of topics approved at once · teachers see each topic from its own day) · v11 (19 Nov: President sees taken-out topics and can put them back) · v10 (19 Nov: Early years picture phrases) · v9 (19 Nov: useful phrases) · v8 (19 Nov: morning-draft photos copied on approval) · v7 (19 Nov: word photos for Early years · mirror op) · v6 (19 Nov: picture words for Early years) · v5 (19 Nov: Early years · Pre-A1 level and phonics sound) · v4 (19 Nov: teachers also get the facts list) · v3 (19 Nov: CEFR band per level) · v2 (19 Nov: topics also Culture, Education, Travel, Daily life, Food, Sport, Nature) · v1 (19 Nov 2026 · 2425, Misty 14:33–14:40: "Talk of the Day" · class openers for YLE, Teens and Adults instead of "How are you?",
//   factual and sourced, approved by the President, kept so teachers can go back to them). Used by talk/index.html and the teacher Today card.
// POST { op, ... }:
//   pub     { id }                         → one approved topic (no sign-in: the page a student or parent opens)
//   list    { token }                      → approved topics newest first + which students I used each with; President/Operations also see drafts
//   use     { token, id, code, student }   → "Used with <student>" (so a topic is not repeated with the same student)
//   save    { token, topic }               → President/Operations: create or edit a draft (approved topics go back to draft when edited)
//   approve { token, id }                  → President only: every fact must point to a source with a link
//   retire  { token, id } · reopen { token, id } → President only (never deleted)
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
const cl = (s: unknown, n: number) => String(s == null ? "" : s).trim().slice(0, n);
const LV = ["early", "yle", "teens", "adults"], ST = ["china", "stem", "ai", "think", "world", "culture", "education", "travel", "daily", "food", "sport", "nature"];
const PUB = "id,day,strand,tags,photo,levels,cefr,phonics,words_early,phrases,phrases_early,title,title_zh,story,story_zh,words,q,think,try_home,try_home_zh,media_url,media_kind,facts,sources,approved_at";
const ALL = PUB + ",status,drafted_by,approved_by,note,updated_at";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function shape(t: any) {
  const arr = (v: unknown, n: number, m: number) => (Array.isArray(v) ? v : []).map((x) => cl(x, m)).filter(Boolean).slice(0, n);
  const lv = arr(t.levels, 4, 10).filter((x) => LV.includes(x));
  const q: any = {}, th: any = {}, ce: any = {};
  for (const k of LV) { q[k] = arr(t.q && t.q[k], 4, 300); th[k] = cl(t.think && t.think[k], 300); const c = cl(t.cefr && t.cefr[k], 20).replace(/-/g, "–"); if (/^(Pre-A1|A1|A2|B1|B2|C1|C2)(–(A1|A2|B1|B2|C1|C2))?$/.test(c.replace("Pre–A1", "Pre-A1"))) ce[k] = c.replace("Pre–A1", "Pre-A1"); }
  const sources = (Array.isArray(t.sources) ? t.sources : []).slice(0, 8).map((s: any) => ({ outlet: cl(s && s.outlet, 80), title: cl(s && s.title, 200), url: cl(s && s.url, 500), date: cl(s && s.date, 20) }));
  const facts = (Array.isArray(t.facts) ? t.facts : []).slice(0, 12).map((f: any) => ({ fact: cl(f && f.fact, 300), src: Number.isInteger(f && f.src) ? f.src : -1 })).filter((f: any) => f.fact);
  const WM = /^https:\/\/(commons|upload)\.wikimedia\.org\//;
  const IMG = /^https:\/\/rlxkiahqjsabopmuhern\.supabase\.co\/storage\/v1\/object\/public\/talk\//;
  const OX = /^\/us\/definition\/english\/[a-z0-9_-]+$/;   // 2491: short meaning, key word and its Oxford IPA travel with each word and phrase
  const ex = (w: any) => { const o: any = {}; if (!w) return o; if (w.m) o.m = cl(w.m, 90); if (w.w) o.w = cl(w.w, 40); if (w.ipa) o.ipa = cl(w.ipa, 80); if (OX.test(String(w.u || ""))) o.u = cl(w.u, 120); return o; };
  const wl = (v: unknown) => (Array.isArray(v) ? v : []).slice(0, 8).map((w: any) => { const o: any = { en: cl(w && w.en, 40), zh: cl(w && w.zh, 40), ...ex(w) }; if (w && IMG.test(String(w.img || ""))) o.img = cl(w.img, 300); if (w && WM.test(String(w.src || ""))) o.src = cl(w.src, 400); if (o.img || o.src) o.credit = cl(w && w.credit, 160); return o; }).filter((w: any) => w.en);
  const PH = /^https:\/\/((commons|upload)\.wikimedia\.org|images\.pexels\.com|images\.unsplash\.com)\//, p0: any = t.photo || {}, photo: any = {};   // 2477: the topic's main photo (openly licensed, with credit)
  if (IMG.test(String(p0.img || ""))) photo.img = cl(p0.img, 300); if (PH.test(String(p0.src || ""))) photo.src = cl(p0.src, 400);
  if (photo.img || photo.src) { photo.credit = cl(p0.credit, 200); photo.alt = cl(p0.alt, 160); photo.page = /^https:\/\//.test(String(p0.page || "")) ? cl(p0.page, 400) : ""; }
  const words = wl(t.words), words_early = wl(t.words_early), ph = (v: unknown) => (Array.isArray(v) ? v : []).slice(0, 6).map((w: any) => ({ en: cl(w && w.en, 60), zh: cl(w && w.zh, 60), ...ex(w) })).filter((w: any) => w.en), phrases = ph(t.phrases), phrases_early = ph(t.phrases_early);
  return { day: /^\d{4}-\d{2}-\d{2}$/.test(String(t.day || "")) ? t.day : undefined, strand: ST.includes(String(t.strand)) ? t.strand : "china", tags: (Array.isArray(t.tags) ? t.tags : []).map(String).filter((x: string, i: number, A: string[]) => ST.includes(x) && x !== t.strand && A.indexOf(x) === i).slice(0, 3), levels: lv.length ? lv : LV,
    title: cl(t.title, 160), title_zh: cl(t.title_zh, 160), story: cl(t.story, 1200), story_zh: cl(t.story_zh, 1200), words, words_early, phrases, phrases_early, q, think: th, cefr: ce, photo: (photo.img || photo.src) ? photo : null,
    phonics: cl(t.phonics, 80), try_home: cl(t.try_home, 300), try_home_zh: cl(t.try_home_zh, 300), media_url: /^https:\/\//.test(String(t.media_url || "")) ? cl(t.media_url, 500) : "", media_kind: cl(t.media_kind, 20),
    facts, sources, note: cl(t.note, 500) };
}
const wmW = (u: string) => String(u).includes("Special:FilePath") && !/width=/.test(u) ? u + (u.includes("?") ? "&" : "?") + "width=1280" : u;
/* 2491 · Oxford Learner's Dictionaries IPA for a word or phrase's key word (UK and US as Oxford shows them). Words that already have IPA are kept. */
async function oxford(word: string): Promise<{ ipa: string; u: string } | null> {
  const slug = word.trim().toLowerCase().replace(/[^a-z0-9 '-]/g, "").replace(/ /g, "-"); if (!slug) return null;
  for (const path of ["/us/definition/english/" + slug, "/us/definition/english/" + slug + "_1"]) {
    try { const r = await fetch("https://www.oxfordlearnersdictionaries.com" + path, { headers: { "user-agent": "Mozilla/5.0 (CupOfEnglish class page)" } }); if (!r.ok) continue;
      const h = await r.text(), u = new URL(r.url).pathname; if (!/^\/us\/definition\/english\//.test(u)) continue;
      const br = (h.match(/phons_br[\s\S]*?<span class="phon">([^<]+)<\/span>/) || [])[1] || "", am = (h.match(/phons_n_am[\s\S]*?<span class="phon">([^<]+)<\/span>/) || [])[1] || "";
      return { ipa: br && am && br !== am ? "UK " + br + "  ·  US " + am : (br || am), u }; } catch { /* try the next form */ }
  }
  return null;
}
async function fillIpa(id: string): Promise<number> {
  const { data: t } = await db.from("coe_talk").select("words,words_early,phrases,phrases_early").eq("id", id).maybeSingle(); if (!t) return 0;
  let n = 0; const seen: Record<string, { ipa: string; u: string } | null> = {}, up: any = {};
  for (const k of ["words", "words_early", "phrases", "phrases_early"]) { const A = Array.isArray((t as any)[k]) ? (t as any)[k] : []; let ch = false;
    for (const w of A) { if (!w || w.ipa) continue; const key = String(w.w || (String(w.en || "").split(" ").length === 1 ? w.en : "")).trim(); if (!key) continue;
      if (!(key in seen)) { seen[key] = await oxford(key); await new Promise((z) => setTimeout(z, 250)); }
      const r = seen[key]; if (r && (r.ipa || r.u)) { if (r.ipa) w.ipa = r.ipa; w.u = r.u; w.w = key; ch = true; n++; } }
    if (ch) up[k] = A; }
  if (Object.keys(up).length) await db.from("coe_talk").update(up).eq("id", id);
  return n;
}
async function mirrorPhoto(id: string, p: any) {   // 2477: the main photo into our storage (loads in China); keep the topic as it is if it fails
  if (!p || !p.src || p.img) return; try { const img = await mirrorUrl(wmW(p.src)); await db.from("coe_talk").update({ photo: { ...p, img } }).eq("id", id); } catch { /* shown from its source until it is copied */ } }
async function mirrorUrl(u: string): Promise<string> {
  const r = await fetch(u, { headers: { "User-Agent": "CupOfEnglish-TalkOfTheDay/1.0 (https://app.cupofenglishatph.com; operations@cupofenglishatph.com)" }, redirect: "follow" });
  const type = (r.headers.get("content-type") || "").split(";")[0]; if (!r.ok || !/^image\/(jpeg|png|webp)$/.test(type)) throw new Error("Could not get the photo (" + r.status + ").");
  const buf = new Uint8Array(await r.arrayBuffer()); if (buf.length > 6 * 1024 * 1024) throw new Error("The photo is too big.");
  const path = "w/" + crypto.randomUUID() + (type === "image/png" ? ".png" : type === "image/webp" ? ".webp" : ".jpg");
  const { error } = await db.storage.from("talk").upload(path, buf, { contentType: type, upsert: false }); if (error) throw new Error(error.message);
  return Deno.env.get("SUPABASE_URL") + "/storage/v1/object/public/talk/" + path;
}
function sourced(t: any) {   // every fact points to a source with a real link
  const S = Array.isArray(t.sources) ? t.sources : [], F = Array.isArray(t.facts) ? t.facts : [];
  if (!S.length || !F.length) return "Add the facts and the sources they come from.";
  for (const s of S) if (!/^https:\/\/\S+\.\S+/.test(String(s.url || "")) || !s.outlet) return "Every source needs the outlet name and its link.";
  for (const f of F) if (!(f.src >= 0 && f.src < S.length)) return "This fact has no source: " + String(f.fact).slice(0, 80);
  return "";
}

Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const op = String(b.op || "");
  try {
    if (op === "pub") {
      const id = cl(b.id, 40); if (!UUID.test(id)) return out({ ok: false, error: "not found" }, 404);
      const { data } = await db.from("coe_talk").select(PUB).eq("id", id).eq("status", "approved").maybeSingle();
      return data ? out({ ok: true, topic: data }) : out({ ok: false, error: "not found" }, 404);
    }
    const token = String(b.token || "");
    if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
    const { data: s } = await db.from("app_sessions").select("name,role,exp").eq("token_hash", await sha(token)).maybeSingle();
    if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
    const name = String(s.name || ""), role = String(s.role || ""), pres = role === "President", mgmt = pres || role === "Operations";

    /* 2495 · Speaking history (Teacher notes from IELTS Speaking and Free talk). Internal: teachers and management only. */
    const staff = pres || role === "pres" || role === "Operations" || role === "Teacher";
    const teaches = async (code: string) => { if (mgmt || role === "pres") return true;
      const from = new Date(Date.now() - 120 * 864e5).toISOString(), to = new Date(Date.now() + 60 * 864e5).toISOString(), me = name.trim().toLowerCase();
      const { data } = await db.from("classes").select("teachers").eq("code", code).gte("starts_at", from).lte("starts_at", to).limit(400);
      return (data || []).some((c: any) => (Array.isArray(c.teachers) ? c.teachers : []).some((x: any) => String(x).trim().toLowerCase() === me)); };
    if (op === "speak") {
      if (!staff) return out({ ok: false, error: "Not allowed." }, 403);
      const code = cl(b.code, 20).toUpperCase(); if (!/^ST-\d{4}-\d{3}$/.test(code)) return out({ ok: false, error: "Choose the student first." }, 400);
      const kind = ["ielts", "free", "talk"].includes(String(b.kind)) ? String(b.kind) : "free", LV = ["needs", "ok", "good", "strong"], m: any = {};
      for (const k of ["fluency", "lexical", "grammar", "pron"]) { const v = String((b.marks || {})[k] || ""); if (LV.includes(v)) m[k] = v; }
      const arr = (v: unknown) => (Array.isArray(v) ? v : []).map((x) => cl(x, 80)).filter(Boolean).slice(0, 40);
      const row = { code, student: cl(b.student, 80), teacher: name, kind, set_id: cl(b.set_id, 40), set_title: cl(b.set_title, 160), minutes: [25, 50].includes(+b.minutes) ? +b.minutes : null, marks: m, used: arr(b.used), practise: arr(b.practise), comment: cl(b.comment, 600) };
      if (!Object.keys(m).length && !row.used.length && !row.comment) return out({ ok: true, saved: false });
      const { error } = await db.from("coe_speak").insert(row); if (error) throw new Error(error.message);
      return out({ ok: true, saved: true });
    }
    if (op === "speakList") {
      if (!staff) return out({ ok: false, error: "Not allowed." }, 403);
      const code = cl(b.code, 20).toUpperCase(); if (!/^ST-\d{4}-\d{3}$/.test(code)) return out({ ok: false, error: "bad request" }, 400);
      if (!(await teaches(code))) return out({ ok: true, rows: [] });
      const { data, error } = await db.from("coe_speak").select("id,kind,set_title,minutes,teacher,marks,used,practise,comment,created_at").eq("code", code).order("created_at", { ascending: false }).limit(60);
      if (error) throw new Error(error.message); return out({ ok: true, rows: data || [] });
    }
    if (op === "list") {
      let qy = db.from("coe_talk").select(mgmt ? ALL : PUB).order("day", { ascending: false }).order("created_at", { ascending: false }).limit(400);
      qy = pres ? qy.in("status", ["approved", "draft", "retired"]) : mgmt ? qy.in("status", ["approved", "draft"]) : qy.eq("status", "approved").lte("day", new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10));   // teachers see a topic from its own day
      const { data, error } = await qy; if (error) throw new Error(error.message);
      const { data: U } = await db.from("coe_talk_use").select("topic,code,student,at").eq("teacher", name).order("at", { ascending: false }).limit(2000);
      const { data: A } = await db.from("coe_talk_use").select("topic,teacher").limit(20000);   // 2448: how many classes used each topic, by all teachers
      const counts: Record<string, { n: number; t: number }> = {}, tt: Record<string, Set<string>> = {};
      for (const r of (A || []) as any[]) { const c = counts[r.topic] || (counts[r.topic] = { n: 0, t: 0 }); c.n++; (tt[r.topic] ||= new Set()).add(r.teacher); c.t = tt[r.topic].size; }
      // 2460 dashboards: a teacher's classes today · management's uses this week and who teaches this week
      const mn = new Date(Date.now() + 8 * 3600e3), today = mn.toISOString().slice(0, 10), dow = (mn.getUTCDay() + 6) % 7, mon = new Date(mn.getTime() - dow * 864e5).toISOString().slice(0, 10), sun = new Date(mn.getTime() + (6 - dow) * 864e5).toISOString().slice(0, 10);
      let extra: any = {};
      if (!mgmt) { const { data: C } = await db.from("classes").select("starts_at,code,student,cancelled").eq("day", today).contains("teachers", JSON.stringify([name.trim().toLowerCase()])).order("starts_at");
        extra.today = (C || []).filter((c: any) => !c.cancelled && c.code).map((c: any) => ({ at: new Date(new Date(c.starts_at).getTime() + 8 * 3600e3).toISOString().slice(11, 16), code: c.code, student: c.student || "" })); }
      else { const [W, S] = await Promise.all([db.from("coe_talk_use").select("teacher,topic,student,code,at").gte("at", mon + "T00:00:00+08:00").order("at", { ascending: false }).limit(2000),
          db.from("classes").select("teachers").gte("day", mon).lte("day", sun).eq("cancelled", false).limit(5000)]);
        const st: Record<string, 1> = {}; ((S.data || []) as any[]).forEach((c) => (c.teachers || []).forEach((t: string) => { t = String(t || "").trim(); if (t) st[t.toLowerCase()] = 1; }));
        extra = { week: W.data || [], staff: Object.keys(st), today, mon }; }
      return out(Object.assign({ ok: true, me: name, role, pres, mgmt, topics: data || [], used: U || [], counts }, extra));
    }
    if (op === "use") {
      const id = cl(b.id, 40); if (!UUID.test(id)) return out({ ok: false, error: "bad request" }, 400);
      const code = /^ST-\d{4}-\d{3}$/.test(String(b.code || "")) ? String(b.code) : "";
      const { error } = await db.from("coe_talk_use").upsert({ topic: id, teacher: name, code, student: cl(b.student, 60), at: new Date().toISOString() }, { onConflict: "topic,teacher,code" });
      if (error) throw new Error(error.message); return out({ ok: true });
    }
    if (op === "save") {
      if (!mgmt) return out({ ok: false, error: "Only management can edit topics." }, 403);
      const t = shape(b.topic || {}); if (!t.title) return out({ ok: false, error: "The topic needs a title." }, 400);
      const id = cl(b.topic && b.topic.id, 40), row: any = { ...t, status: "draft", approved_by: null, approved_at: null, updated_at: new Date().toISOString() };
      if (!row.day) delete row.day;
      if (UUID.test(id)) { const { error } = await db.from("coe_talk").update(row).eq("id", id); if (error) throw new Error(error.message); await mirrorPhoto(id, row.photo); return out({ ok: true, id }); }
      row.drafted_by = name; const { data, error } = await db.from("coe_talk").insert(row).select("id").single(); if (error) throw new Error(error.message);
      await mirrorPhoto(data.id, row.photo); return out({ ok: true, id: data.id });
    }
    if (op === "mirror") {   // copy an openly licensed photo into our own storage (loads in China)
      if (!mgmt) return out({ ok: false, error: "not allowed" }, 403);
      const u = cl(b.url, 600); let host = ""; try { host = new URL(u).hostname; } catch { /* */ }
      if (!/^(commons\.wikimedia\.org|upload\.wikimedia\.org|images\.pexels\.com|images\.unsplash\.com)$/.test(host)) return out({ ok: false, error: "Only Wikimedia Commons, Pexels or Unsplash photos." }, 400);
      try { return out({ ok: true, url: await mirrorUrl(u) }); } catch (e) { return out({ ok: false, error: String((e as Error).message) }, 400); }
    }
    if (op === "photo") {   // 2477 · Management: change or remove a topic's main photo (Wikimedia Commons, Pexels or Unsplash, with credit)
      if (!mgmt) return out({ ok: false, error: "not allowed" }, 403);
      const id = cl(b.id, 40); if (!UUID.test(id)) return out({ ok: false, error: "bad request" }, 400);
      if (b.remove) { const { error } = await db.from("coe_talk").update({ photo: null, updated_at: new Date().toISOString() }).eq("id", id); if (error) throw new Error(error.message); return out({ ok: true }); }
      const u = cl(b.url, 600); let host = ""; try { host = new URL(u).hostname; } catch { /* */ }
      if (!/^(commons\.wikimedia\.org|upload\.wikimedia\.org|images\.pexels\.com|images\.unsplash\.com)$/.test(host)) return out({ ok: false, error: "Only Wikimedia Commons, Pexels or Unsplash photos." }, 400);
      const credit = cl(b.credit, 200); if (credit.length < 3) return out({ ok: false, error: "Write the credit (photographer · site · licence)." }, 400);
      let img = ""; try { img = await mirrorUrl(wmW(u)); } catch (e) { return out({ ok: false, error: String((e as Error).message) }, 400); }
      const { error } = await db.from("coe_talk").update({ photo: { src: u, img, credit, alt: cl(b.alt, 160), page: /^https:\/\//.test(String(b.page || "")) ? cl(b.page, 400) : "" }, updated_at: new Date().toISOString() }).eq("id", id);
      if (error) throw new Error(error.message); return out({ ok: true, img });
    }
    if (op === "restore") {   // President: put a topic that was taken out back in the library, approved as before
      if (!pres) return out({ ok: false, error: "Only the President can do this." }, 403);
      const id = cl(b.id, 40); if (!UUID.test(id)) return out({ ok: false, error: "bad request" }, 400);
      const { error } = await db.from("coe_talk").update({ status: "approved", approved_by: name, approved_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", id).eq("status", "retired");
      if (error) throw new Error(error.message); return out({ ok: true });
    }
    if (op === "ipa") {   // management: fill Oxford IPA for one topic's words and phrases now
      if (!mgmt) return out({ ok: false, error: "Only management can do this." }, 403);
      const id = cl(b.id, 40); if (!UUID.test(id)) return out({ ok: false, error: "bad request" }, 400);
      return out({ ok: true, filled: await fillIpa(id) });
    }
    const approveOne = async (id: string): Promise<string> => {
      const { data: t } = await db.from("coe_talk").select("facts,sources,title,story,q,words_early,status,photo").eq("id", id).maybeSingle();
      if (!t) return "not found"; await mirrorPhoto(id, t.photo);
      if (Array.isArray(t.words_early) && t.words_early.some((w: any) => w && w.src && !w.img)) {   // photos chosen by the draft → our storage (loads in China)
        const WE = []; for (const w of t.words_early) { const o = { ...w }; if (o.src && !o.img) { try { o.img = await mirrorUrl(String(o.src).includes("Special:FilePath") && !/width=/.test(o.src) ? o.src + "?width=800" : o.src); } catch { /* keep the word without a photo */ } } WE.push(o); }
        await db.from("coe_talk").update({ words_early: WE }).eq("id", id);
      }
      try { await fillIpa(id); } catch { /* the cards still show meanings without IPA */ }
      const why = sourced(t); if (why) return why;
      const { error } = await db.from("coe_talk").update({ status: "approved", approved_by: name, approved_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", id);
      return error ? error.message : "";
    };
    if (op === "approveAll") {   // President: approve every draft at once (the week's topics)
      if (!pres) return out({ ok: false, error: "Only the President approves topics." }, 403);
      const ids = (Array.isArray(b.ids) ? b.ids : []).map((x: unknown) => cl(x, 40)).filter((x: string) => UUID.test(x)).slice(0, 20);
      const done: string[] = [], held: { id: string; why: string }[] = [];
      for (const id of ids) { const why = await approveOne(id); if (why) held.push({ id, why }); else done.push(id); }
      return out({ ok: true, done, held });
    }
    if (op === "approve" || op === "retire" || op === "reopen") {
      if (!pres) return out({ ok: false, error: "Only the President approves topics." }, 403);
      const id = cl(b.id, 40); if (!UUID.test(id)) return out({ ok: false, error: "bad request" }, 400);
      if (op === "approve") {
        const why = await approveOne(id); if (why) return out({ ok: false, error: why }, why === "not found" ? 404 : 400);
        return out({ ok: true });
      }
      const { error } = await db.from("coe_talk").update({ status: op === "retire" ? "retired" : "draft", approved_by: null, approved_at: null, updated_at: new Date().toISOString() }).eq("id", id);
      if (error) throw new Error(error.message); return out({ ok: true });
    }
    return out({ ok: false, error: "unknown op" }, 400);
  } catch (e) { return out({ ok: false, error: String((e as Error).message || e) }, 500); }
});
