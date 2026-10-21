// CupOfEnglish · coe-invoice (21 Oct 2026): Payment Confirmations 付款确认单 made in the app (replaces QuickBooks; numbers continue from 1747).
// The official invoice stays the BIR-authorized printed booklet; its number can be recorded here (bir_no).
// POST { token, action, ... } — management only.
//   boot   { code? }            → { ok, products, next, profile, student (with recent books), recent, students (only without code) }
//   issue  { inv }              → { ok, invoice }        (number, totals and 3% tax are set by the database)
//   file   { no, file_name }    → { ok }                 (Drive file name, once)
//   mailed { no }               → { ok }                 (email sent time)
//   bir    { no, bir_no }       → { ok }                 (printed BIR invoice number, once)
//   void   { no, reason }       → { ok, invoice }
//   list   { code?, limit? }    → { ok, invoices }
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
const str = (x: unknown, n = 200) => String(x == null ? "" : x).trim().slice(0, n);

Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: s } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
  if (s.mode !== "mgmt") return out({ ok: false, error: "Management only." }, 403);
  const who = String(s.name || "Management");
  const a = String(b.action || "");
  try {
    if (a === "boot") {
      const code = str(b.code, 20);
      const [p, n, pr, st, rc, cx] = await Promise.all([
        db.from("coe_inv_products").select("code,name,descr,category,units,rate,free,bonus_units,extras,sort").eq("active", true).order("sort"),
        db.rpc("coe_inv_last"),
        code ? db.from("coe_bill_profiles").select("bill_name,bill_addr,email,reimb").eq("code", code).maybeSingle() : Promise.resolve({ data: null }),
        code ? db.from("coe_students").select("code,data").eq("code", code).is("removed_at", null).limit(1).maybeSingle() : Promise.resolve({ data: null }),
        code ? db.from("coe_invoices").select("no,day,total,status,items").eq("code", code).order("no", { ascending: false }).limit(5) : Promise.resolve({ data: [] }),
        code ? db.from("classes").select("starts_at,data").eq("code", code).eq("cancelled", false).gte("starts_at", new Date(Date.now() - 150 * 864e5).toISOString()).order("starts_at", { ascending: false }).limit(80)
             : db.from("coe_students").select("code,data").is("removed_at", null).order("code", { ascending: false }).limit(1500),
      ]);
      if (p.error || n.error) return out({ ok: false, error: "db" }, 500);
      const d: any[] = (st as any).data?.data || [];
      const books = code ? [...new Set(((cx as any).data || []).map((x: any) => str(x.data?.book, 40)).filter(Boolean))].slice(0, 6) : [];
      const student = d.length ? { code, zh: str(d[1], 60), en: str(d[2], 60), birth: str(d[5], 10), city: str(d[9], 60), source: str(d[22], 60), books } : null;
      const seen = new Set<string>(), students = code ? [] : ((cx as any).data || []).filter((x: any) => x.code && !seen.has(x.code) && seen.add(x.code)).map((x: any) => ({ code: x.code, en: str(x.data?.[2], 40), zh: str(x.data?.[1], 40) }));
      return out({ ok: true, products: p.data, next: (n.data as number) + 1, profile: (pr as any).data || null, student, recent: (rc as any).data || [], students });
    }
    if (a === "issue") {
      const v = b.inv || {};
      const items = Array.isArray(v.items) ? v.items.slice(0, 20).map((x: any) => ({ pcode: str(x.pcode, 30), name: str(x.name, 120), descr: str(x.descr, 400), qty: +x.qty, rate: +x.rate })) : [];
      if (!items.length || items.some((x: any) => !(x.qty > 0) || !(x.rate >= 0) || !x.name)) return out({ ok: false, error: "Check the lines: each needs a product, a quantity and a rate." });
      const em = str(v.email, 120); if (em && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) return out({ ok: false, error: "The email address looks wrong." });
      const r = v.reimb && typeof v.reimb === "object" ? Object.fromEntries(["company_zh", "company_en", "tax_id", "bank_zh", "bank_en", "account"].map((k) => [k, str(v.reimb[k], 120)]).filter(([, x]) => x)) : null;
      const p = { code: str(v.code, 20), day: str(v.day, 10), bill_name: str(v.bill_name, 120), bill_addr: str(v.bill_addr, 300), email: em, reimb: r && Object.keys(r).length ? r : null, items, paid: v.paid !== false, currency: str(v.currency, 5) || "CNY", partner: str(v.partner, 60), method: str(v.method, 30), bir_no: str(v.bir_no, 30) };
      const { data, error } = await db.rpc("coe_inv_issue", { p, p_by: who });
      if (error) return out({ ok: false, error: error.message || "db" });
      return out({ ok: true, invoice: data });
    }
    if (a === "file" || a === "mailed" || a === "bir") {
      const no = +b.no; if (!(no > 0)) return out({ ok: false, error: "no" });
      if (a === "bir" && !str(b.bir_no, 30)) return out({ ok: false, error: "Type the BIR invoice number." });
      const patch = a === "file" ? { file_name: str(b.file_name, 160) } : a === "bir" ? { bir_no: str(b.bir_no, 30) } : { emailed_at: new Date().toISOString() };
      const { error } = await db.from("coe_invoices").update(patch).eq("no", no);
      return out(error ? { ok: false, error: error.message } : { ok: true });
    }
    if (a === "void") {
      const no = +b.no, why = str(b.reason, 200); if (!(no > 0) || !why) return out({ ok: false, error: "A reason is needed to void." });
      const { data, error } = await db.from("coe_invoices").update({ status: "void", void_reason: why, void_by: who, void_at: new Date().toISOString() }).eq("no", no).select().maybeSingle();
      return out(error ? { ok: false, error: error.message } : { ok: true, invoice: data });
    }
    if (a === "list") {
      let q = db.from("coe_invoices").select("*").order("no", { ascending: false }).limit(Math.min(+b.limit || 60, 300));
      if (b.code) q = q.eq("code", str(b.code, 20));
      const { data, error } = await q;
      return out(error ? { ok: false, error: "db" } : { ok: true, invoices: data });
    }
    return out({ ok: false, error: "unknown action" }, 400);
  } catch (e) { return out({ ok: false, error: String((e as Error).message || e) }, 500); }
});
