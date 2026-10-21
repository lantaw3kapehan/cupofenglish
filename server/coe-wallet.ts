// CupOfEnglish · coe-wallet (21 Oct 2026): Alipay, WeChat and CCB balances, President only (sensitive).
// Balance = last balance check + Alipay/WeChat sales in SALES since that check + money in − remittances − other money out − charges (¥50 per remittance).
// POST { token, action, ... }
//   get                                   → { ok, wallets: [{ wallet, balance, base, base_day, sales, sales_n, in, out, fees }], entries, sales }
//   add  { kind, wallet, day, cny, fee?, php?, note? }   kind: check | remit | out | in   → { ok, entry, wallets }
//   add  { kind: "transfer", wallet (from), to, cny, fee? }  (the charge can be added later with "fee")
//   fee  { id, fee }                      → { ok, wallets }   (charge of a transfer/remittance, once, after it shows)
//   undo { id }                           → { ok, wallets }
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
const str = (x: unknown, n = 200) => String(x == null ? "" : x).trim().slice(0, n);
const money = (x: unknown) => Math.round((+String(x ?? "").replace(/[^0-9.\-]/g, "") || 0) * 100) / 100;
const WALLETS = ["Alipay", "WeChat", "CCB"], KINDS = ["check", "remit", "out", "in", "transfer"];

Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: s } = await db.from("app_sessions").select("name,role,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
  if (s.mode !== "mgmt" || !/^president$/i.test(String(s.role || ""))) return out({ ok: false, error: "President only." }, 403);
  const who = String(s.name || "President");
  const state = async () => { const { data, error } = await db.rpc("coe_wallet_state"); if (error) throw new Error(error.message); return data || []; };
  try {
    const a = String(b.action || "");
    if (a === "get") {
      const W = await state();
      const since = W.map((w: any) => w.base_day).filter(Boolean).sort()[0] || new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10);
      const [en, sl] = await Promise.all([
        db.from("coe_wallet").select("*").neq("wallet", "ChinaBank").order("created_at", { ascending: false }).limit(80),
        db.from("coe_ledger").select("day,created_at,data").eq("kind", "sale").is("removed_at", null).gte("day", since).order("day", { ascending: false }).limit(200),
      ]);
      const sales = (sl.data || []).map((r: any) => ({ day: r.day, at: r.created_at, name: str(r.data?.[1], 80), partner: str(r.data?.[4], 60), method: str(r.data?.[5], 30), cny: money(r.data?.[6]) }))
        .filter((x: any) => /alipay|支付宝|wechat|weixin|微信/i.test(x.method));
      return out({ ok: true, wallets: W, entries: en.data || [], sales });
    }
    if (a === "add") {
      const kind = str(b.kind, 10), wallet = str(b.wallet, 10), day = str(b.day, 10), cny = money(b.cny);
      if (!KINDS.includes(kind) || !WALLETS.includes(wallet)) return out({ ok: false, error: "Choose the wallet." });
      const to = kind === "transfer" ? str(b.to, 12) : null;
      if (kind === "transfer" && (!WALLETS.includes(to!) || to === wallet)) return out({ ok: false, error: "Choose where the money goes." });
      if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return out({ ok: false, error: "Choose the date." });
      if (!(cny >= 0) || (kind !== "check" && !(cny > 0))) return out({ ok: false, error: "Type the amount in ¥." });
      const W = await state(), cur = W.find((w: any) => w.wallet === wallet);
      const row: any = { kind, wallet, day, cny, by_name: who, note: str(b.note, 300) || null,
        fee: kind === "remit" ? Math.max(0, money(b.fee ?? 50)) : kind === "out" || kind === "transfer" ? Math.max(0, money(b.fee ?? 0)) : 0, to_wallet: to,
        php: kind === "remit" && money(b.php) > 0 ? money(b.php) : null,
        expected: kind === "check" && cur ? cur.balance : null };
      const { data, error } = await db.from("coe_wallet").insert(row).select().single();
      if (error) return out({ ok: false, error: error.message });
      return out({ ok: true, entry: data, wallets: await state() });
    }
    if (a === "fee") {
      const id = +b.id, fee = money(b.fee); if (!(id > 0) || !(fee > 0)) return out({ ok: false, error: "Type the charge in ¥." });
      const { data, error } = await db.from("coe_wallet").update({ fee }).eq("id", id).eq("fee", 0).is("void_at", null).select("id");
      if (error) return out({ ok: false, error: error.message });
      if (!data || !data.length) return out({ ok: false, error: "The charge is already set." });
      return out({ ok: true, wallets: await state() });
    }
    if (a === "undo") {
      const id = +b.id; if (!(id > 0)) return out({ ok: false, error: "id" });
      const { error } = await db.from("coe_wallet").update({ void_at: new Date().toISOString(), void_by: who }).eq("id", id).is("void_at", null);
      if (error) return out({ ok: false, error: error.message });
      return out({ ok: true, wallets: await state() });
    }
    return out({ ok: false, error: "unknown action" }, 400);
  } catch (e) { return out({ ok: false, error: String((e as Error).message || e) }, 500); }
});
