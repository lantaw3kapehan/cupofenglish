// CupOfEnglish · coe-ops v1 (11 Nov 2026, 2091 · Misty: Operations "always makes mistakes with details … I want her to be productive").
// Management only (Operations and President). Teachers get "Management only".
// POST { token, op: "check" }                        → { ok, items: [{ kind, ref, text, go }], at }   the daily database check (coe_ops_check)
// POST { token, op: "ok", ref }                      → { ok }   "It's correct": this item never comes back (coe_ops_ok)
// POST { token, op: "precheck", code?, invoice, partner, pkg, free }
//                                                    → { ok, student: { code, name, source }, last, partnerHint, flags: [text] }   the check card before a payment save
// POST { token, op: "week", who? }                   → { ok, week }   Operations' week (coe_ops_week); the President gets the Operations staff
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
const AG = /(?:Mr|Ms|Mrs|Dr)\.\s*([A-Za-z]+)/i;
const invName = (s: string) => { const p = String(s || "").split("_"); const t = (p.length > 1 ? p.slice(1).join(" ") : "").replace(/\.pdf$/i, "").replace(/[^A-Za-z ]/g, " ").replace(/\s+/g, " ").trim(); return t; };
Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: s } = await db.from("app_sessions").select("name,mode,role,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
  if (s.mode !== "mgmt") return out({ ok: false, error: "Management only" }, 403);
  const me = String(s.name || ""), pres = /pres/i.test(String(s.role || ""));
  const op = String(b.op || "");
  if (op === "check") {
    const { data, error } = await db.rpc("coe_ops_check");
    if (error) return out({ ok: false, error: "db" }, 500);
    return out({ ok: true, items: (data && data.items) || [], at: data && data.at });
  }
  if (op === "ok") {
    const ref = String(b.ref || "").slice(0, 120); if (!/^(sale|dbl|nt):/.test(ref)) return out({ ok: false, error: "not allowed" }, 400);
    const { error } = await db.from("coe_ops_ok").upsert({ ref, by_name: me, at: new Date().toISOString() }, { onConflict: "ref" });
    if (error) return out({ ok: false, error: "not saved" }, 500);
    return out({ ok: true });
  }
  if (op === "precheck") {
    const code = String(b.code || "").toUpperCase().match(/ST-\d{4}-\d{3}/)?.[0] || "";
    const inv = invName(String(b.invoice || "")), partner = String(b.partner || "").trim();
    let pk: any = null;
    if (code) { const { data } = await db.from("coe_packages").select("code,name,source,buy").is("removed_at", null).ilike("code", code).order("buy", { ascending: false }).limit(1); pk = (data || [])[0] || null; }
    else if (inv) { const { data } = await db.from("coe_packages").select("code,name,source,buy").is("removed_at", null).ilike("name", inv).order("buy", { ascending: false }).limit(5);
      const codes = new Set((data || []).map((x: any) => String(x.code).toUpperCase())); pk = codes.size === 1 ? data![0] : null;
      if (codes.size > 1) return out({ ok: true, student: null, flags: [codes.size + " students are called " + inv + " (" + [...codes].join(", ") + "). Check this is the right one."], last: null, partnerHint: "" }); }
    const flags: string[] = [];
    if (!pk && (code || inv)) flags.push("No student package found for " + (code || inv) + ". Check the name and code.");
    let last: any = null, partnerHint = "";
    if (pk) {
      const nm = String(pk.name || "");
      if (inv && nm && inv.toLowerCase() !== nm.toLowerCase() && !inv.toLowerCase().includes(nm.toLowerCase())) flags.push("The invoice says " + inv + ", but this student is " + nm + " (" + pk.code + ").");
      const ag = (String(pk.source || "").match(AG) || [])[1] || "";
      if (ag) {
        const { data: ps } = await db.from("coe_sales").select("partner").is("removed_at", null).ilike("partner", "%" + ag + "%").order("day", { ascending: false }).limit(20);
        const cnt: Record<string, number> = {}; for (const r of ps || []) { const p = String(r.partner || ""); if (p) cnt[p] = (cnt[p] || 0) + 1; }
        partnerHint = Object.keys(cnt).sort((a, c) => cnt[c] - cnt[a])[0] || "";
        if (partner && !new RegExp("\\b" + ag + "\\b", "i").test(partner)) flags.push(nm + " came through " + pk.source + ", but the partner here is \"" + partner + "\".");
        if (!partner) flags.push(nm + " came through " + pk.source + ". Choose that partner.");
      } else if (partner && AG.test(partner)) flags.push(nm + " came through " + (pk.source || "no partner") + ", but the partner here is \"" + partner + "\".");
      const { data: ls } = await db.from("coe_sales").select("day,pkg,free,partner,php").is("removed_at", null).ilike("invoice", "%\\_" + nm + "%").order("day", { ascending: false }).limit(1);
      last = (ls || [])[0] || null;
      const pkg = Number(b.pkg || 0), free = Number(b.free || 0);
      if (last && pkg && (Number(last.pkg) !== pkg || Number(last.free || 0) !== free)) flags.push("Last time " + nm + " paid for " + last.pkg + (Number(last.free) ? " + " + last.free : "") + " lessons. This time it is " + pkg + (free ? " + " + free : "") + ".");
    }
    return out({ ok: true, student: pk ? { code: pk.code, name: pk.name, source: pk.source } : null, last, partnerHint, flags });
  }
  if (op === "week") {
    let who = [me];
    if (pres) { const { data } = await db.from("app_sessions").select("name").eq("mode", "mgmt").ilike("role", "operations"); who = [...new Set((data || []).map((x: any) => String(x.name || "")).filter((n) => n && !/^(zz|claude)/i.test(n)))]; }
    const weeks = []; for (const w of who.slice(0, 3)) { const { data } = await db.rpc("coe_ops_week", { p_who: w }); if (data) weeks.push(data); }
    const { data: ck } = await db.rpc("coe_ops_check");
    return out({ ok: true, weeks, open: (ck && ck.n) || 0 });
  }
  return out({ ok: false, error: "unknown op" }, 400);
});
