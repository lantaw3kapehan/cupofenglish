// CupOfEnglish · coe-adv v1 (28 Nov 2026 · 3161, Misty: "Resa asked for an advance of 10,000 … flexible, editable and sustainable")
// Cash advances and loans repaid from pay. Management only; nobody but the President changes an advance of their own.
// POST { token, op, ... }
//   list                                   → { ok, rows }   every advance with its repayments, repaid and balance
//   add   { teacher, amount, given_on, note, per_month?, start_month? }   → { ok, id }   (the plan can be left for later)
//   plan  { id, per_month, start_month, note? }   → { ok }   change the plan (per_month 0 / empty = not set yet)
//   month { id, month, amount }            → { ok }   this month's payslip repayment changed by hand (0 = skip this month)
//   cash  { id, amount, day, note }        → { ok }   a repayment paid in cash or by transfer (not from pay)
//   unpay { pay_id }                       → { ok }   removes a cash repayment, or a hand change (back to the plan)
//   remove { id }                          → { ok }   removes an advance entered by mistake
// After every change the database works the month out again (coe_advance_sync): the payslip line
// "Cash advance repayment · … · balance … after this" (coe_pay_edits, field less, reason auto:adv:<id>:<month>).
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
const s = (x: unknown, n = 200) => String(x ?? "").trim().slice(0, n);
const money = (x: unknown) => { const v = Math.round(Number(x) * 100) / 100; return isFinite(v) ? v : NaN; };
const ymd = (x: unknown) => { const v = s(x, 10); return /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : ""; };
const mon = (x: unknown) => { const m = s(x, 10).match(/^(\d{4})-(\d{2})/); return m ? `${m[1]}-${m[2]}-01` : ""; };

Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, st = 200) => new Response(JSON.stringify(o), { status: st, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const token = s(b.token, 400); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: se } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!se || new Date(se.exp).getTime() < Date.now() || se.mode !== "mgmt") return out({ ok: false, error: "AUTH" }, 401);
  const { data: au } = await db.from("auth_users").select("role").ilike("name", se.name || "-").limit(1).maybeSingle();
  const pres = !!(au && /president/i.test(String(au.role || "")));
  const own = (t: unknown) => String(t || "").trim().toLowerCase() === String(se.name || "").trim().toLowerCase();
  const op = s(b.op, 20);
  const sync = async () => { await db.rpc("coe_advance_sync"); };
  const adv = async (id: unknown) => { const { data } = await db.from("coe_advances").select("*").eq("id", Number(id) || 0).is("removed_at", null).maybeSingle(); return data; };
  try {
    if (op === "list") { const { data, error } = await db.rpc("coe_advance_list"); if (error) return out({ ok: false, error: "db" }, 500);
      const m = new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 7) + "-01";
      const [{ data: pc }, { data: pp }] = await Promise.all([db.rpc("coe_pay_calc", { p_month: m }), db.from("coe_pay_people").select("teacher")]);
      const people = [...new Set([...(pc || []).map((x: any) => String(x.teacher || "").trim()), ...(pp || []).map((x: any) => String(x.teacher || "").trim())].filter(Boolean))].sort();
      return out({ ok: true, rows: data || [], people }); }
    if (op === "add") {
      const t = s(b.teacher, 60), amt = money(b.amount), d = ymd(b.given_on), pm = b.per_month === "" || b.per_month == null ? null : money(b.per_month), sm = mon(b.start_month);
      if (!t) return out({ ok: false, msg: "Choose the person." });
      if (!(amt > 0) || amt > 1e6) return out({ ok: false, msg: "Write the amount given." });
      if (!d) return out({ ok: false, msg: "Write the date it was given." });
      if (pm !== null && (!(pm >= 0) || pm > amt)) return out({ ok: false, msg: "The monthly repayment should be between 0 and the amount." });
      if (pm && !sm) return out({ ok: false, msg: "Choose the first month to deduct." });
      if (own(t) && !pres) return out({ ok: false, msg: "Your own advance is entered by the President." });
      const { data, error } = await db.from("coe_advances").insert({ teacher: t, amount: amt, given_on: d, note: s(b.note, 300), per_month: pm || null, start_month: sm || null, by_name: se.name }).select("id").single();
      if (error) return out({ ok: false, msg: "Not saved. Try again." }); await sync(); return out({ ok: true, id: data.id });
    }
    const a = await adv(b.id || (op === "unpay" ? 0 : null));
    if (op === "unpay") {
      const { data: p } = await db.from("coe_advance_pay").select("id,adv_id,kind,month").eq("id", Number(b.pay_id) || 0).maybeSingle(); if (!p) return out({ ok: false, msg: "Not found." });
      const x = await adv(p.adv_id); if (!x) return out({ ok: false, msg: "Not found." }); if (own(x.teacher) && !pres) return out({ ok: false, msg: "Your own advance is changed by the President." });
      const { data: paid } = await db.from("coe_pay_paid").select("paid").eq("month", p.month || "1900-01-01").ilike("teacher", x.teacher).maybeSingle();
      if (p.kind === "payslip" && paid && paid.paid) return out({ ok: false, msg: "That month is already paid out." });
      if (p.kind === "cash") await db.from("coe_advance_pay").delete().eq("id", p.id); else await db.from("coe_advance_pay").update({ fixed: false, note: "" }).eq("id", p.id);
      await sync(); return out({ ok: true });
    }
    if (!a) return out({ ok: false, msg: "Not found." });
    if (own(a.teacher) && !pres) return out({ ok: false, msg: "Your own advance is changed by the President." });
    if (op === "plan") {
      const pm = b.per_month === "" || b.per_month == null ? null : money(b.per_month), sm = mon(b.start_month);
      if (pm !== null && (!(pm >= 0) || pm > Number(a.amount))) return out({ ok: false, msg: "The monthly repayment should be between 0 and the amount." });
      if (pm && !sm) return out({ ok: false, msg: "Choose the first month to deduct." });
      const up: any = { per_month: pm || null, start_month: sm || null, updated_at: new Date().toISOString() }; if (b.note !== undefined) up.note = s(b.note, 300);
      const { error } = await db.from("coe_advances").update(up).eq("id", a.id); if (error) return out({ ok: false, msg: "Not saved. Try again." });
      await sync(); return out({ ok: true });
    }
    if (op === "month") {
      const m = mon(b.month), v = money(b.amount); if (!m || !(v >= 0)) return out({ ok: false, msg: "Choose the month and the amount (0 to skip)." });
      const { data: paid } = await db.from("coe_pay_paid").select("paid").eq("month", m).ilike("teacher", a.teacher).maybeSingle();
      if (paid && paid.paid) return out({ ok: false, msg: "That month is already paid out." });
      const { data: ex } = await db.from("coe_advance_pay").select("id").eq("adv_id", a.id).eq("month", m).eq("kind", "payslip").maybeSingle();
      if (ex) await db.from("coe_advance_pay").update({ amount: v, fixed: true, note: s(b.note, 200), by_name: se.name }).eq("id", ex.id);
      else await db.from("coe_advance_pay").insert({ adv_id: a.id, month: m, amount: v, kind: "payslip", fixed: true, note: s(b.note, 200), by_name: se.name });
      await sync(); return out({ ok: true });
    }
    if (op === "cash") {
      const v = money(b.amount), d = ymd(b.day); if (!(v > 0) || !d) return out({ ok: false, msg: "Write the amount and the date." });
      const { error } = await db.from("coe_advance_pay").insert({ adv_id: a.id, day: d, amount: v, kind: "cash", note: s(b.note, 200), by_name: se.name });
      if (error) return out({ ok: false, msg: "Not saved. Try again." }); await sync(); return out({ ok: true });
    }
    if (op === "remove") {
      const { data: ps } = await db.from("coe_advance_pay").select("month,kind").eq("adv_id", a.id);
      for (const p of ps || []) { if (p.kind !== "payslip") continue; const { data: paid } = await db.from("coe_pay_paid").select("paid").eq("month", p.month).ilike("teacher", a.teacher).maybeSingle();
        if (paid && paid.paid) return out({ ok: false, msg: "Repayments were already taken from a paid month. Close it by recording the rest instead." }); }
      await db.from("coe_advances").update({ removed_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", a.id);
      await db.from("coe_pay_edits").update({ removed_at: new Date().toISOString(), removed_by: se.name }).is("removed_at", null).like("reason", "auto:adv:" + a.id + ":%");
      return out({ ok: true });
    }
    return out({ ok: false, error: "unknown op" }, 400);
  } catch (e) { console.warn("adv", e); return out({ ok: false, error: "db", msg: "Not saved. Try again." }, 500); }
});
