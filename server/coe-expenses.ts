// CupOfEnglish · coe-expenses (25 Oct 2026) · Money › Expenses: every expense line of COE DATABASE › EXPENSES (DATE · DESCRIPTION ·
// CATEGORY · TOTAL PRICE), newest first, plus the ones just added in the app that Google has not copied yet (writes · addExpense).
// POST { token } → { ok, at, rows: [{ d: "yyyy-MM-dd", t: description, c: category, a: amount, q?: 1 }] } · management only.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
const s = (x: unknown) => String(x ?? "");
Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, st = 200) => new Response(JSON.stringify(o), { status: st, headers: { ...h, "Content-Type": "application/json" } });
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const token = s(b.token); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: se } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!se || new Date(se.exp).getTime() < Date.now() || se.mode !== "mgmt") return out({ ok: false, error: "AUTH" }, 401);
  const rows: any[] = [];
  for (let from = 0; from < 20000; from += 1000) {
    const { data, error } = await db.from("sheet_rows").select("r,data").eq("tab", "EXPENSES").gt("r", 1).order("r").range(from, from + 999);
    if (error) return out({ ok: false, error: "db" }, 500);
    (data || []).forEach((x: any) => { const r = x.data || [], d = s(r[0]).slice(0, 10), a = Number(r[3]);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(d) || !(isFinite(a)) || (!s(r[1]).trim() && !a)) return;
      rows.push({ d, t: s(r[1]).trim(), c: s(r[2]).trim() || "Other", a: Math.round(a * 100) / 100 }); });
    if (!data || data.length < 1000) break;
  }
  const { data: W } = await db.from("writes").select("args,status,created_at").eq("fn", "addExpense").in("status", ["new", "pending", "working"]).gte("created_at", new Date(Date.now() - 3 * 864e5).toISOString()).limit(50);
  (W || []).forEach((w: any) => { const f = (w.args || [])[1] || {}, d = s(f.date || f.d).slice(0, 10) || new Date(Date.parse(w.created_at) + 8 * 3600e3).toISOString().slice(0, 10);
    const a = Number(f.amount ?? f.total ?? f.price); rows.push({ d, t: s(f.description || f.desc || f.item).trim(), c: s(f.category || f.cat).trim() || "Other", a: isFinite(a) ? a : 0, q: 1 }); });
  rows.sort((p, q) => q.d.localeCompare(p.d));
  const { data: st } = await db.from("sheet_tabs").select("synced_at").eq("tab", "EXPENSES").maybeSingle();
  return out({ ok: true, at: st ? st.synced_at : null, rows });
});
