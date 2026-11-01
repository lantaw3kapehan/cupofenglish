// CupOfEnglish · coe-stucls (1 Nov 2026): a student's classes from today on, the whole future, from the class table
// (the original since 19 Oct). The app's student page (mgmtStuClasses in coe) only reads 6 weeks ahead from the database and
// takes the rest from Google's last saved copy; a new student has no saved copy, so the calendar stopped after 6 weeks
// (Yoyo ST-2025-083: 13 of 98 classes shown) and "Book the rest" counted too few classes as already booked.
// POST { token, code } → { ok, classes: [{ id, start, end, title, teacher, book, cancelled, why, mv }] } · management only.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
function parseTeacher(t: string) {
  const m = String(t).replace(/[‐-―−]/g, "-").match(/^\s*(ST-\d{4}-\d{3})\s*-\s*(.+?)\s*$/i); if (!m) return { teacher: "", book: "" };
  let rest = m[2]; if (/\s+X$/i.test(rest)) rest = rest.replace(/\s+X$/i, "");
  const parts = rest.split("-").map((s) => s.trim()).filter(Boolean);
  while (parts.length >= 3 && /^(TC|TRIAL|试听|SC|SUB)$/i.test(parts[parts.length - 1])) parts.pop();
  if (parts.length < 2) return { teacher: "", book: "" };
  return { teacher: parts[parts.length - 1], book: parts.slice(1, -1).join("-") };
}
Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: s } = await db.from("app_sessions").select("mode,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
  if (s.mode !== "mgmt") return out({ ok: false, error: "Management only." }, 403);
  const code = String(b.code || "").trim().toUpperCase(); if (!/^ST-\d{4}-\d{3}$/.test(code)) return out({ ok: false, error: "code" }, 400);
  const today = new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10);
  const { data, error } = await db.from("classes").select("day,data").eq("code", code).gte("day", today).order("day", { ascending: true }).limit(2000);
  if (error) return out({ ok: false, error: "db" }, 500);
  const classes = (data || []).map((r: any) => { const e = r.data || {}, p = parseTeacher(e.title || "");
    return { id: e.id, start: e.start, end: e.end, title: e.title, teacher: p.teacher, book: p.book, cancelled: !!e.cancelled, why: e.why || "", mv: e.mv || null }; })
    .filter((x: any) => x.id && x.start).sort((x: any, y: any) => String(x.start).localeCompare(String(y.start)));
  return out({ ok: true, classes, at: new Date().toISOString() });
});
