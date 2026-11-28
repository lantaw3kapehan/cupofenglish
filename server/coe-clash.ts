// CupOfEnglish · coe-clash (20 Oct 2026): the Add class / move clash check from the class table, in under a second.
// v5 (28 Nov · 3143): the teacher's-hours part (Google's outside_ / avAll_, from T-AVAIL) is answered here too, so the app no longer
// asks Google afterwards. Same wording as Google: "Monday is not a teaching day for Teacher X", "Teacher X is fully booked on Mondays",
// "outside Teacher X’s hours (13:00-17:00, 19:00-22:00)". A clash on a date is shown instead of the hours note for that date, as before.
// Management sign-in only (same app_sessions check as coe-mgmt).
// POST { token, teacher, dates: ["yyyy-mm-dd", …], time: "HH:MM", mins, ignore?: event id, code?: student code }
//   → { ok, issues: […], more, n, hours, src: "db" }
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
const WD = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: s } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!s || new Date(s.exp).getTime() < Date.now() || s.mode !== "mgmt") return out({ ok: false, error: "AUTH" }, 401);
  const tch = String(b.teacher || "").replace(/^teacher\s+/i, "").trim(), lc = tch.toLowerCase(), tm = String(b.time || "").trim();
  const dates = (Array.isArray(b.dates) ? b.dates : []).map((x: any) => String(x).slice(0, 10)).filter((x: string) => /^\d{4}-\d{2}-\d{2}$/.test(x)).slice(0, 120);
  const mins = Math.max(10, Math.min(240, Number(b.mins) || 50)), ign = String(b.ignore || ""), code = String(b.code || "").trim().toUpperCase();
  if (!lc || !dates.length || !/^([01]?\d|2[0-3]):[0-5]\d$/.test(tm)) return out({ ok: false, error: "bad request" }, 400);
  const hh = tm.length === 4 ? "0" + tm : tm, hm = (x: Date) => new Date(x.getTime() + 8 * 3600e3).toISOString().slice(11, 16);
  const slots = dates.map((d: string) => { const a = new Date(d + "T" + hh + ":00+08:00"); return { d, a, z: new Date(a.getTime() + mins * 6e4) }; });
  const [{ data: C, error }, { data: AV }] = await Promise.all([
    db.from("classes").select("id,day,code,student,starts_at,ends_at,teachers,data").in("day", dates).eq("cancelled", false).limit(8000),
    db.from("sheet_rows").select("data").eq("tab", "T-AVAIL").limit(500)]);
  if (error) return out({ ok: false, error: "db" }, 500);
  // the teacher's weekly hours (T-AVAIL: name, Mon…Sun, at, by), as Google's avAll_ reads them
  const avRow = (AV || []).map((x: any) => x.data).find((r: any) => Array.isArray(r) && String(r[0] || "").trim().toLowerCase() === lc) || null;
  const days = avRow ? avRow.slice(1, 8).map((x: any) => String(x == null ? "" : x).replace(/\s+/g, "")) : null;
  const pad = (x: string) => (String(x).length === 4 ? "0" : "") + x;
  const outside = (a: Date, z: Date) => {
    if (!days) return null;
    const w = (new Date(a.getTime() + 8 * 3600e3).getUTCDay() + 6) % 7, st = hm(a), en = hm(z), r = String(days[w] || "");
    if (!r) return WD[w] + " is not a teaching day for Teacher " + tch;
    if (r === "full") return "Teacher " + tch + " is fully booked on " + WD[w] + "s";
    const ok = r.split(",").some((x) => { const p = x.split("-"); return p.length === 2 && pad(p[0]) <= st && en <= pad(p[1]); });
    return ok ? null : "outside Teacher " + tch + "’s hours (" + r.replace(/,/g, ", ") + ")";
  };
  const issues: string[] = [], seen = new Set<string>();
  for (const sl of slots) {
    let clash = false;
    for (const c of (C || [])) {
      if (c.day !== sl.d) continue;
      const cid = String((c.data || {}).id || "");
      if (ign && (cid === ign || String(c.id).startsWith(ign + "|"))) continue;
      const a = new Date(c.starts_at), z = new Date(c.ends_at); if (!(a < sl.z && z > sl.a)) continue;
      const mine = (c.teachers || []).map((x: any) => String(x).toLowerCase()).includes(lc), same = !!code && String(c.code || "").toUpperCase() === code;
      if (!mine && !same) continue;
      if (mine) clash = true;
      const key = sl.d + "|" + (c.code || c.student || "") + "|" + a.getTime(); if (seen.has(key)) continue; seen.add(key);   // a pending copy and Google's copy of the same class count once
      const who = c.student || (c.data || {}).title || "a class", other = String((c.teachers || [])[0] || "");
      issues.push(sl.d + " " + hh + " · " + (mine ? "Teacher " + tch + " already has " + who : who + " already has a class with Teacher " + (other.charAt(0).toUpperCase() + other.slice(1))) + " " + hm(a) + "–" + hm(z));
    }
    if (!clash) { const o = outside(sl.a, sl.z); if (o) issues.push(sl.d + " " + hh + " · " + o); }
  }
  return out({ ok: true, issues: issues.slice(0, 12), more: Math.max(0, issues.length - 12), n: slots.length, hours: !!days, src: "db" });
});
