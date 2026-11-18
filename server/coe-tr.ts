// CupOfEnglish · coe-tr v8 (18 Nov 2026 · 2391 Chinese only, no English lines from the translator) · was v1 (11 Nov 2026, 2082 · Misty: "CANCELLING A LESSON DOES NOT FEEL INSTANT" · "CAN YOU DO IT NOW INSTEAD?").
// The translate buttons (trEn: Chinese → English, trZh: English → Chinese) took 4–5 s through the Google Apps Script. This answers the
// same question in well under a second with the same translation engine, called directly (no Apps Script, no sheets).
// POST { token, fn: "trEn" | "trZh", text } → { ok: true, en } / { ok: true, zh }. Anyone signed in to the app; text up to 2000 characters.
// If the translator does not answer in 6 s, { ok: false } and the app asks the Apps Script as before.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const fn = String(b.fn || ""), text = String(b.text || "").trim(), token = String(b.token || "");
  if (!/^tr(En|Zh|ZhParent)$/.test(fn) || !text || text.length > 2000) return out({ ok: false, error: "not allowed" }, 400);
  if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: s } = await db.from("app_sessions").select("name,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
  // 2328 (Misty 17 Nov: "keep the Chinese, just ensure it is accurate and native"): homework and notes for Chinese parents are translated
  // by Claude with an education-centre brief (natural Simplified Chinese a native teacher would write); Google is the fallback.
  // 18 Nov (Misty: "keep their student's name as exactly it is"): names given by the caller are kept letter for letter (Lucy stays Lucy, never 露西)
  const NAMES: string[] = (Array.isArray(b.names) ? b.names : []).map((x: unknown) => String(x || "").trim()).filter((x: string) => x.length > 1 && x.length < 40).slice(0, 8);
  const lock = (t: string) => { let o = t; NAMES.forEach((n, i) => { o = o.replace(new RegExp("\\b" + n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "gi"), "ZQX" + i + "Q"); }); return o; };
  const unlock = (t: string) => t.replace(/ZQX\s*(\d)\s*Q/gi, (_m, i) => NAMES[+i] || _m);
  if (fn === "trZhParent") {
    const KEY = Deno.env.get("ANTHROPIC_API_KEY") || "";
    if (KEY) try {
      const ac = new AbortController(), tid = setTimeout(() => ac.abort(), 12000);
      const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", signal: ac.signal,
        headers: { "x-api-key": KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
        body: JSON.stringify({ model: Deno.env.get("COE_TR_MODEL") || "claude-haiku-5-5", max_tokens: 1200,
          system: "You translate messages from CupOfEnglish, an online English school, into Simplified Chinese for Chinese parents (and students): homework instructions, teachers' notes, and reasons a class was cancelled or moved. Translate only what is written; never add or guess a reason. " +
            "Write natural, warm, professional Chinese exactly as an experienced native Chinese teacher at a language centre would write to parents: clear, polite, never stiff or word-for-word. " +
            "Keep the exact meaning, numbers, word counts, dates, page and unit numbers. Keep personal names, book titles and English words or sentences the student must use in English (e.g. target words, example sentences in quotes). " +
            "In class-change reasons, he / she / they means the student or the family, never things (use 孩子 or 家长 as fits, never 它们), and say it the way a centre tells a parent, e.g. They will start next week. → 孩子下周开始上课。 The student is sick. → 孩子身体不适。 " +
            "Never translate or transliterate a person's name: keep every name exactly as written in English letters (e.g. Well done, Lucy! → 干得好，Lucy！, never 露西)." + (NAMES.length ? " These names must stay exactly as written: " + NAMES.join(", ") + "." : "") + " " +
            "Use 你 for the student in homework and notes. Use common Chinese terms for school tasks (e.g. 作文, 造句, 形容词, 逗号, 大写字母). The text to translate comes inside <text> tags. Reply with the Chinese translation only, inside <zh> tags: no English version, no notes, no corrections or comments about your answer.",
          messages: [{ role: "user", content: "<text>\n" + text + "\n</text>" }, { role: "assistant", content: "<zh>" }], stop_sequences: ["</zh>"] }) }).finally(() => clearTimeout(tid));
      const j = await r.json();
      const zh0 = r.ok ? String((j.content || []).filter((c: any) => c.type === "text").map((c: any) => c.text || "").join("")).replace(/<\/?zh>/g, "").trim() : "";
      // 2391 (Misty 18 Nov 21:55, Penny's homework showed the English twice): a line with no Chinese in it is kept only when it is in the
      // teacher's own text (a target word or example sentence); an English rewording or a remark from the translator is dropped
      const CJK = /[\u3400-\u9fff]/, flat = (x: string) => x.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim(), src = flat(text);
      const zh = CJK.test(zh0) ? zh0.split("\n").filter((ln) => !ln.trim() || CJK.test(ln) || (flat(ln) && src.includes(flat(ln)))).join("\n").replace(/\n{3,}/g, "\n\n").trim() : "";
      if (zh) return out({ ok: true, zh, by: "claude" });
    } catch (_e) { /* no answer */ }
    return out({ ok: false, error: "no answer" });   // Misty 17 Nov: no Google for parent Chinese
  }
  const [sl, tl] = fn === "trEn" ? ["zh-CN", "en"] : ["en", "zh-CN"];
  try {
    const ac = new AbortController(), tid = setTimeout(() => ac.abort(), 6000);
    const u = "https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&sl=" + sl + "&tl=" + tl + "&q=" + encodeURIComponent(lock(text));   // names locked, put back below
    const x = await fetch(u, { signal: ac.signal, headers: { "User-Agent": "Mozilla/5.0 (CupOfEnglish app)" } }).finally(() => clearTimeout(tid));
    const raw = await x.text(); let r: any = null; try { r = JSON.parse(raw); } catch (_e) { /* not JSON */ }
    const res = unlock((Array.isArray(r) && Array.isArray(r[0]) ? r[0] : []).map((p: any) => (Array.isArray(p) ? String(p[0] || "") : "")).join("").trim());
    if (!res) return out({ ok: false, error: "no answer", why: x.status + " " + raw.slice(0, 120) });
    return out(fn === "trEn" ? { ok: true, en: res } : { ok: true, zh: res });
  } catch (e) { return out({ ok: false, error: "no answer", why: String((e as Error).message || e).slice(0, 160) }); }
});
