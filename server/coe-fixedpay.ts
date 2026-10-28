// CupOfEnglish · coe-fixedpay (28 Oct 2026, release 1373) · who is paid a fixed amount each month (docs 'sys:fixedpay').
// POST { token } → management: { ok, list: [{ name, monthly, role, from }] }
//                  anyone else:  { ok, me: { name, monthly, from } | null }   (only their own entry · never another person's pay)
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
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: s } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
  const { data: d } = await db.from("docs").select("data").eq("key", "sys:fixedpay").maybeSingle();
  const list = ((d && d.data && Array.isArray(d.data.list)) ? d.data.list : [])
    .map((x: any) => ({ name: String(x.name || "").trim(), monthly: Number(x.monthly) || 0, role: String(x.role || ""), from: String(x.from || "") }))
    .filter((x: any) => x.name && x.monthly > 0);
  if (s.mode === "mgmt") return out({ ok: true, list });
  const me = String(s.name || "").trim().toLowerCase(), mine = list.find((x: any) => x.name.toLowerCase() === me);
  return out({ ok: true, me: mine ? { name: mine.name, monthly: mine.monthly, from: mine.from } : null });
});
