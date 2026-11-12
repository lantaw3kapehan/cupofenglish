// CupOfEnglish · coe-expenses (25 Oct 2026) · Money › Expenses: every expense line of COE DATABASE › EXPENSES (DATE · DESCRIPTION ·
// CATEGORY · TOTAL PRICE), newest first, plus the ones just added in the app that Google has not copied yet (writes · addExpense).
// v2: also sales: [{ d, t: student, inv, pkg, free, src, pay, rmb, a: PHP }]
// v3 (4 Nov): each line carries key, the record key coe-edit uses (✎ Edit in Finance › Transactions):
//   expense "yyyy-mm-dd|amount|description" · sale "yyyy-mm-dd|invoice as written in SALES"
// v6 (4 Nov): an expense already made by the database is not listed twice.
// v5 (4 Nov): reads the database tables coe_sales / coe_expenses (no longer the sheet copies).
// v4 (4 Nov): lines removed in the app ("REMOVED · …") are left out.
// v9 (12 Nov, 2144 · Misty: "the latest entry should always be the top row"): each line carries n = when it was entered (ms),
//   0 for the lines brought over from Google on 4 Nov (their order stays by date). Finance › Transactions sorts by n, then by date (the list order here stays by date).
// POST { token } → { ok, at, rows: [{ d: "yyyy-MM-dd", t: description, c: category, a: amount, q?: 1, key?, n }] } · management only.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
const s = (x: unknown) => String(x ?? "");
const MOVED = Date.parse("2026-11-04T06:00:00Z");   // lines created before this came over from Google in one go
const ent = (c: unknown) => { const t = Date.parse(s(c)); return isFinite(t) && t >= MOVED ? t : 0; };
Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, st = 200) => new Response(JSON.stringify(o), { status: st, headers: { ...h, "Content-Type": "application/json" } });
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const token = s(b.token); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: se } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!se || new Date(se.exp).getTime() < Date.now() || se.mode !== "mgmt") return out({ ok: false, error: "AUTH" }, 401);
  // v5 (4 Nov): read the database tables (coe_sales / coe_expenses), brought up to date first (0.1 s; same filters as before)
  try { await db.rpc("coe_money_sync"); } catch (_) { /* the 5-minute job keeps them close anyway */ }
  const all = async (t: string, cols: string) => { const out: any[] = []; for (let from = 0; from < 20000; from += 1000) {
      const { data, error } = await db.from(t).select(cols).is("removed_at", null).order("day", { ascending: false }).range(from, from + 999);
      if (error) throw error; out.push(...(data || [])); if (!data || data.length < 1000) break; } return out; };
  let E: any[] = [], S: any[] = [];
  try { [E, S] = await Promise.all([all("coe_expenses", "day,description,category,amount,created_at"), all("coe_sales", "day,invoice,pkg,free,partner,method,rmb,php,created_at")]); }
  catch (_) { return out({ ok: false, error: "db" }, 500); }
  const rows: any[] = [];
  E.forEach((x: any) => { const d = s(x.day).slice(0, 10), a = x.amount == null ? 0 : Number(x.amount), t = s(x.description).trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d) || !isFinite(a) || (!t && !a) || /^REMOVED · /.test(t)) return;
    rows.push({ d, t, c: s(x.category).trim() || "Other", a: Math.round(a * 100) / 100, key: d + "|" + a + "|" + t, n: ent(x.created_at) }); });
  const { data: W } = await db.from("writes").select("id,args,status,created_at").eq("fn", "addExpense").in("status", ["new", "pending", "working", "busy"]).gte("created_at", new Date(Date.now() - 3 * 864e5).toISOString()).limit(50);
  // v6: an expense the database has already made (coe_expenses.app_write) is in the list once, from the table
  const made = new Set<number>(); if ((W || []).length) { const { data: M } = await db.from("coe_expenses").select("app_write").in("app_write", (W || []).map((w: any) => w.id)); (M || []).forEach((x: any) => made.add(Number(x.app_write))); }
  (W || []).filter((w: any) => !made.has(Number(w.id))).forEach((w: any) => { const f = (w.args || [])[1] || {}, d = s(f.date || f.d).slice(0, 10) || new Date(Date.parse(w.created_at) + 8 * 3600e3).toISOString().slice(0, 10);
    const a = Number(f.amount ?? f.total ?? f.price); rows.push({ d, t: s(f.description || f.desc || f.item).trim(), c: s(f.category || f.cat).trim() || "Other", a: isFinite(a) ? a : 0, q: 1, n: ent(w.created_at) }); });
  rows.sort((p, q) => q.d.localeCompare(p.d));
  // 25 Oct v2 · sales too (COE DATABASE › SALES: DATE · INVOICE AND STUDENT · LESSON PACKAGE · FREE LESSON · PARTNERSHIP · PAYMENT METHOD · RMB · PHP)
  const sales: any[] = [];
  S.forEach((x: any) => { const d = s(x.day).slice(0, 10), php = Number(x.php); if (!/^\d{4}-\d{2}-\d{2}$/.test(d) || !php) return;
    const inv = s(x.invoice).trim(), m = inv.replace(/\.pdf$/i, "").match(/^(?:PaymentConfirmation|Invoice)?\s*#?(\d+)?[_\s-]*(.*)$/i);
    sales.push({ d, t: (m && m[2] ? m[2] : inv).replace(/_/g, " ").trim(), inv: m && m[1] ? m[1] : "", pkg: x.pkg == null ? "" : s(x.pkg), free: x.free == null ? "" : s(x.free), src: s(x.partner).trim(), pay: s(x.method).trim(), rmb: Number(x.rmb) || 0, a: Math.round(php * 100) / 100, key: d + "|" + inv, n: ent(x.created_at) }); });
  sales.sort((p, q) => q.d.localeCompare(p.d));
  const { data: st } = await db.from("sheet_tabs").select("synced_at").eq("tab", "EXPENSES").maybeSingle();
  return out({ ok: true, at: st ? st.synced_at : null, rows, sales });
});
