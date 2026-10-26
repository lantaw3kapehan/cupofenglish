// CupOfEnglish · coe-trq (26 Oct 2026) · which trial reports this teacher has already written.
// POST { token } (a signed-in teacher, or management with { as: "<teacher>" }) → { ok, rep: [{ d: "yyyy-mm-dd", n: "student" }] }
// From TR-DATA (the database copy of the Google tab) for this teacher, plus trial reports sent in the app (writes tTrialSubmit,
// not refused) that Google has not copied yet. The app uses it so a trial whose report is written does not stay on Today
// ("Christian wrote Eric's trial report but it still shows"): TR-DATA's trial date can be a day off, or the calendar has
// extra "Trial" entries for the same student. Read-only.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
const ymd = (v: unknown) => { const m = String(v || "").match(/^(\d{4}-\d{2}-\d{2})/); return m ? m[1] : ""; };
Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: s } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
  const who = String(s.mode === "mgmt" && b.as ? b.as : s.name || "").trim().toLowerCase(); if (!who) return out({ ok: true, rep: [] });
  const since = new Date(Date.now() - 75 * 864e5).toISOString().slice(0, 10);
  const [{ data: T }, { data: W }] = await Promise.all([
    db.from("sheet_rows").select("data").eq("tab", "TR-DATA").limit(5000),
    db.from("writes").select("who,args,status").eq("fn", "tTrialSubmit").gte("created_at", new Date(Date.now() - 75 * 864e5).toISOString()).limit(1000)]);
  const rep: { d: string; n: string }[] = [], seen: Record<string, number> = {};
  const add = (d: string, n: string) => { const k = d + "|" + n; if (d && n && d >= since && !seen[k]) { seen[k] = 1; rep.push({ d, n }); } };
  (T || []).forEach((r: any) => { const a = Array.isArray(r.data) ? r.data : []; if (String(a[4] || "").trim().toLowerCase().split(/[,/&+]| and /).map((x) => x.trim()).indexOf(who) < 0) return; add(ymd(a[2]), String(a[5] || "").trim().toLowerCase()); });
  (W || []).forEach((w: any) => { if (w.status === "error" || w.status === "test" || String(w.who || "").trim().toLowerCase() !== who) return; const a = (w.args || [])[1] || {}; add(ymd(a.date), String(a.student || "").trim().toLowerCase()); });
  return out({ ok: true, rep });
});
