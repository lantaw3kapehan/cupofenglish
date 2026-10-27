// CupOfEnglish · coe-portal-ping (27 Oct 2026) · presence for the partner portal (/partner/) and the student portal (/student/).
// ping: a signed-in portal page, while on screen, says "I'm here" about once a minute → portal_presence (who, device family, tab, version,
//       first sign-in, last seen). Never stores IP or location.
// list: management only (app_sessions mode mgmt) → last 7 days of portal presence + who has access but never opened it.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const hex = (b: ArrayBuffer) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
const sha = async (t: string) => hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)));
const cl = (x: unknown, n: number) => String(x ?? "").replace(/[^\w一-鿿 ·.\-]/g, "").slice(0, n);
async function pages(mk: () => any) { const out: any[] = []; for (let f = 0; f < 30000; f += 1000) { const { data, error } = await mk().range(f, f + 999); if (error || !data) break; out.push(...data); if (data.length < 1000) break; } return out; }
Deno.serve(async (req: Request) => {
  const o = req.headers.get("origin") || "", h = { "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" };
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (x: unknown, s = 200) => new Response(JSON.stringify(x), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false }, 400); }
  const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const th = await sha(token), now = new Date().toISOString();
  if (b.op === "list") {
    const { data: s } = await db.from("app_sessions").select("mode,exp").eq("token_hash", th).maybeSingle();
    if (!s || s.mode !== "mgmt" || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
    const since = new Date(Date.now() - 7 * 864e5).toISOString();
    const [{ data: R }, { data: PA }, SA, DB] = await Promise.all([
      db.from("portal_presence").select("kind,who,name,dev,view,v,since,at,first_at").gte("at", since).order("at", { ascending: false }).limit(2000),
      db.from("partner_accounts").select("id,display_name,username,active,last_login"),
      pages(() => db.from("student_access").select("code,active,last_login").order("code")),
      pages(() => db.from("sheet_rows").select("data").eq("tab", "DATABASE").order("r"))]);
    const nm: Record<string, string> = {}; DB.forEach((x: any) => { const r = x.data || [], k = String(r[0] || "").trim().toUpperCase(); if (/^ST-\d{4}-\d{3}$/.test(k) && !nm[k]) nm[k] = String(r[2] || "").trim() + (r[1] ? " " + String(r[1]).trim() : ""); });
    const seen = new Set((R || []).map((r: any) => r.kind + "|" + r.who));
    const neverP = (PA || []).filter((a: any) => a.active && !a.last_login && !/^zztest/.test(a.username)).map((a: any) => ({ who: a.id, name: a.display_name }));
    const neverS = SA.filter((a: any) => a.active !== false && !a.last_login && !seen.has("student|" + a.code)).map((a: any) => ({ who: a.code, name: nm[a.code] || "" }));
    const lastP = (PA || []).filter((a: any) => a.active && a.last_login && !/^zztest/.test(a.username)).map((a: any) => ({ who: a.id, name: a.display_name, last_login: a.last_login }));
    const wk = Date.now() - 7 * 864e5, lastS = SA.filter((a: any) => a.active !== false && a.last_login && new Date(a.last_login).getTime() > wk).map((a: any) => ({ who: a.code, name: nm[a.code] || "", last_login: a.last_login }));
    return out({ ok: true, rows: (R || []).filter((r: any) => !/^zztest|TEST \(Claude/.test(String(r.name || ""))), never: { partner: neverP, student: neverS }, partners: lastP, students: lastS, at: now });
  }
  // ping (partner or student page)
  const kind = b.kind === "student" ? "student" : "partner"; let who = "", name = "";
  if (kind === "partner") { const { data: ss } = await db.from("partner_sessions").select("partner_id,exp").eq("token_hash", th).maybeSingle(); if (!ss || new Date(ss.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
    const { data: a } = await db.from("partner_accounts").select("id,display_name,active").eq("id", ss.partner_id).maybeSingle(); if (!a || !a.active) return out({ ok: false, error: "AUTH" }, 401); who = a.id; name = a.display_name; }
  else { const { data: ss } = await db.from("student_sessions").select("code,exp").eq("token_hash", th).maybeSingle(); if (!ss || new Date(ss.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
    who = String(ss.code).toUpperCase(); const { data: d } = await db.from("sheet_rows").select("data").eq("tab", "DATABASE").filter("data->>0", "eq", who).limit(1).maybeSingle(); const r = (d as any)?.data || []; name = String(r[2] || "").trim() + (r[1] ? " " + String(r[1]).trim() : ""); }
  const dev = cl(b.dev, 40), key = { kind, who, dev };
  const { data: ex } = await db.from("portal_presence").select("at,since,first_at").match(key).maybeSingle();
  const fresh = ex && Date.now() - new Date(ex.at).getTime() < 10 * 60e3;   // a gap over 10 min starts a new "since"
  const row = { ...key, name, view: cl(b.view, 30), v: cl(b.v, 20), at: now, since: fresh ? ex!.since : now, first_at: ex ? ex.first_at : now };
  await db.from("portal_presence").upsert(row, { onConflict: "kind,who,dev" });
  return out({ ok: true });
});
