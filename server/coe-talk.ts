// CupOfEnglish · coe-talk v1 (19 Nov 2026 · 2425, Misty 14:33–14:40: "Talk of the Day" · class openers for YLE, Teens and Adults instead of "How are you?",
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
const LV = ["yle", "teens", "adults"], ST = ["china", "stem", "ai", "think", "world"];
const PUB = "id,day,strand,levels,title,title_zh,story,story_zh,words,q,think,try_home,try_home_zh,media_url,media_kind,sources,approved_at";
const ALL = PUB + ",facts,status,drafted_by,approved_by,note,updated_at";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function shape(t: any) {
  const arr = (v: unknown, n: number, m: number) => (Array.isArray(v) ? v : []).map((x) => cl(x, m)).filter(Boolean).slice(0, n);
  const lv = arr(t.levels, 3, 10).filter((x) => LV.includes(x));
  const q: any = {}, th: any = {};
  for (const k of LV) { q[k] = arr(t.q && t.q[k], 4, 300); th[k] = cl(t.think && t.think[k], 300); }
  const sources = (Array.isArray(t.sources) ? t.sources : []).slice(0, 8).map((s: any) => ({ outlet: cl(s && s.outlet, 80), title: cl(s && s.title, 200), url: cl(s && s.url, 500), date: cl(s && s.date, 20) }));
  const facts = (Array.isArray(t.facts) ? t.facts : []).slice(0, 12).map((f: any) => ({ fact: cl(f && f.fact, 300), src: Number.isInteger(f && f.src) ? f.src : -1 })).filter((f: any) => f.fact);
  const words = (Array.isArray(t.words) ? t.words : []).slice(0, 8).map((w: any) => ({ en: cl(w && w.en, 40), zh: cl(w && w.zh, 40) })).filter((w: any) => w.en);
  return { day: /^\d{4}-\d{2}-\d{2}$/.test(String(t.day || "")) ? t.day : undefined, strand: ST.includes(String(t.strand)) ? t.strand : "china", levels: lv.length ? lv : LV,
    title: cl(t.title, 160), title_zh: cl(t.title_zh, 160), story: cl(t.story, 1200), story_zh: cl(t.story_zh, 1200), words, q, think: th,
    try_home: cl(t.try_home, 300), try_home_zh: cl(t.try_home_zh, 300), media_url: /^https:\/\//.test(String(t.media_url || "")) ? cl(t.media_url, 500) : "", media_kind: cl(t.media_kind, 20),
    facts, sources, note: cl(t.note, 500) };
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

    if (op === "list") {
      let qy = db.from("coe_talk").select(mgmt ? ALL : PUB).order("day", { ascending: false }).order("created_at", { ascending: false }).limit(400);
      qy = mgmt ? qy.in("status", ["approved", "draft"]) : qy.eq("status", "approved");
      const { data, error } = await qy; if (error) throw new Error(error.message);
      const { data: U } = await db.from("coe_talk_use").select("topic,code,student,at").eq("teacher", name).order("at", { ascending: false }).limit(2000);
      return out({ ok: true, me: name, role, pres, mgmt, topics: data || [], used: U || [] });
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
      if (UUID.test(id)) { const { error } = await db.from("coe_talk").update(row).eq("id", id); if (error) throw new Error(error.message); return out({ ok: true, id }); }
      row.drafted_by = name; const { data, error } = await db.from("coe_talk").insert(row).select("id").single(); if (error) throw new Error(error.message);
      return out({ ok: true, id: data.id });
    }
    if (op === "approve" || op === "retire" || op === "reopen") {
      if (!pres) return out({ ok: false, error: "Only the President approves topics." }, 403);
      const id = cl(b.id, 40); if (!UUID.test(id)) return out({ ok: false, error: "bad request" }, 400);
      if (op === "approve") {
        const { data: t } = await db.from("coe_talk").select("facts,sources,title,story,q").eq("id", id).maybeSingle();
        if (!t) return out({ ok: false, error: "not found" }, 404);
        const why = sourced(t); if (why) return out({ ok: false, error: why }, 400);
        const { error } = await db.from("coe_talk").update({ status: "approved", approved_by: name, approved_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", id);
        if (error) throw new Error(error.message); return out({ ok: true });
      }
      const { error } = await db.from("coe_talk").update({ status: op === "retire" ? "retired" : "draft", approved_by: null, approved_at: null, updated_at: new Date().toISOString() }).eq("id", id);
      if (error) throw new Error(error.message); return out({ ok: true });
    }
    return out({ ok: false, error: "unknown op" }, 400);
  } catch (e) { return out({ ok: false, error: String((e as Error).message || e) }, 500); }
});
