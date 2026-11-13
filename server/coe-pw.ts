// CupOfEnglish · coe-pw (5 Nov 2026) · set a person's app password in the database (the same rules as Google's mgmtPwSave).
// POST { op: 'set', token, name | email, password, change? }  → management session only.
//   Rules copied from Code.gs mgmtPwSave / pwTarget_ / pwProt_ / pwBad_ / pwSave_:
//   · the person must be in auth_users (APP EMAIL) · a protected account (management role, or one of CFG.MANAGERS) needs the President
//   · a person who already has a password needs change = true · strength: 8+ characters, not the e-mail, not one repeated digit,
//     not starting 12345678 / password / qwertyui.
//   Hash: base64( sha256^401 ) of salt|password|pepper, then 400 × sha256(digest + salt) — identical to pwHash_ and coe's login;
//   a fresh UUID salt; the pepper from auth_secret. auth_pw gets src 'db', set_at, set_by; auth_fails is cleared; coe_pw_audit records
//   who / for whom / when (never the password or the hash). Other sessions are NOT signed out (not asked yet).
//   Switch: docs 'sys:live' → pwDb. Off → { ok:false, fallback:true }: the app keeps using Google.
// v4 (13 Nov, step 2.1, Misty "go"): the database keeps passwords set here (trigger coe_auth_pw_guard: Google's copy can no longer undo them).
//   POST { op: 'check', email, mode }  (no sign-in; asked by the app only after coe's login said "no")
//     → { final: true, msg } when this person's password was set in the app: Google does not know it, so asking Google would only
//       accept the OLD password. The message is the one Google would give (wrong role / too many tries / wrong password).
//     → { final: false } otherwise (Google decides as before). Reveals nothing about the password; no password is sent.
//   v5 (13 Nov): each check is logged in coe_signin_shadow (kind 'fallback', the reason) · step 2.2 shadow check.
//   POST { op: 'off', token, name }  → Access off in the database too (Google's mgmtAccessOff cannot remove an app-set password):
//     coe_pw_off = password, sessions and failed tries removed. Same rules as Google's mgmtAccessOff (not yourself, not the President,
//     a protected account needs the President). Audited.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const MANAGERS = ["works@cupofenglishatph.com", "operations@cupofenglishatph.com", "mistydotph@gmail.com"];   // CFG.MANAGERS
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
export async function pwHash(salt: string, pw: string, pep: string) {   // = Code.gs pwHash_ = coe login pwHash
  const enc = new TextEncoder(), sb = enc.encode(salt);
  let d = new Uint8Array(await crypto.subtle.digest("SHA-256", enc.encode(salt + "|" + pw + "|" + pep)));
  for (let i = 0; i < 400; i++) { const x = new Uint8Array(d.length + sb.length); x.set(d); x.set(sb, d.length); d = new Uint8Array(await crypto.subtle.digest("SHA-256", x)); }
  let bin = ""; d.forEach((c) => bin += String.fromCharCode(c)); return btoa(bin);
}
export function pwBad(email: string, pw: string) {   // = Code.gs pwBad_
  if (pw.length < 8) return "Use at least 8 characters.";
  if (pw.toLowerCase() === email || /^(\d)\1+$/.test(pw) || /^(12345678|password|qwertyui)/i.test(pw)) return "Choose a harder password.";
  return "";
}
const isMgr = (role: string) => /ops|operation|manag|admin|president/i.test(role || "");
const isPres = (role: string) => /president/i.test(role || "");
const nm = (s: any) => String(s || "").toLowerCase().replace(/^(teacher|coordinator|admin|support)\s+/, "").trim();   // pwTarget_

Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }

  // v4 · after coe's login said "no": should the app still ask Google? (no token; nothing secret in or out)
  if (b.op === "check") {
    const email = String(b.email || "").trim().toLowerCase(), mode = b.mode === "mgmt" ? "mgmt" : "teacher", no = { ok: false, final: false };
    if (!email || email.length > 200) return out(no);
    const [{ data: live }, { data: p }, { data: u }, { data: f }] = await Promise.all([
      db.from("docs").select("data").eq("key", "sys:live").maybeSingle(), db.from("auth_pw").select("src").eq("email", email).maybeSingle(),
      db.from("auth_users").select("role").eq("email", email).maybeSingle(), db.from("auth_fails").select("n,until").eq("email", email).maybeSingle()]);
    // v5 (13 Nov, step 2.2 · watch only): why this sign-in was not answered by the database (no e-mail or password is kept apart from
    //   the e-mail typed; the reason is the same check coe's login makes). Read with: select * from coe_signin_shadow where kind='fallback'.
    const locked = !!(f && f.until && Date.parse(f.until) > Date.now() && f.n >= 6), roleBad = !!u && (mode === "mgmt" ? !isMgr(u.role || "") : !/teacher/i.test(u.role || ""));
    const why = !(live && live.data && live.data.login === true) ? "database sign-in off" : !u ? "e-mail not in the app list" : !p ? "no password in the database"
      : roleBad ? "wrong mode (" + mode + ")" : locked ? "locked · too many tries" : "password did not match";
    try { await db.from("coe_signin_shadow").insert({ kind: "fallback", email, mode, reason: why, detail: { src: p ? p.src : null, final: !!(p && p.src === "db" && u && live && live.data && live.data.login === true) } }); } catch (_e) { /* */ }
    if (!(live && live.data && live.data.login === true) || !p || p.src !== "db" || !u) return out(no);
    const mgr = isMgr(u.role || ""), pres = mode === "mgmt" && isPres(u.role || "");
    const help = pres ? ', or tap "President: first time or forgot password".' : mode === "mgmt" ? ", or ask the President." : ", or message Ops.";
    if (mode === "mgmt" && !mgr) return out({ ok: false, final: true, msg: "This Gmail has teacher access only. Choose Teacher." });
    if (mode !== "mgmt" && !/teacher/i.test(u.role || "")) return out({ ok: false, final: true, msg: "This Gmail is a management account. Choose Management." });
    if (f && f.until && Date.parse(f.until) > Date.now() && f.n >= 6) return out({ ok: false, final: true, msg: "Too many tries. Wait 15 minutes" + help });
    return out({ ok: false, final: true, msg: "Wrong password. Try again" + help });
  }

  if (b.op !== "set" && b.op !== "off") return out({ ok: false, error: "unknown op" }, 400);
  const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: s } = await db.from("app_sessions").select("email,name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
  const byEmail = String(s.email || "").toLowerCase();
  const { data: me } = await db.from("auth_users").select("email,name,role").eq("email", byEmail).maybeSingle();
  const audit = async (forEmail: string, forName: string, action: string, result: string) => {
    try { await db.from("coe_pw_audit").insert({ by_email: byEmail, by_name: s.name || "", for_email: forEmail || null, for_name: forName || null, action, result }); } catch (_e) { /* */ }
  };
  if (s.mode !== "mgmt" || !me || !isMgr(me.role)) return out({ ok: false, error: "Management only" }, 403);   // mgr_
  // the person: by e-mail, else by name as pwTarget_ does
  let t: any = null;
  const { data: U } = await db.from("auth_users").select("email,name,role");
  if (b.email) t = (U || []).find((x: any) => String(x.email).toLowerCase() === String(b.email).trim().toLowerCase()) || null;
  else t = (U || []).find((x: any) => nm(x.name) === nm(b.name)) || null;
  const who = String(b.name || b.email || "");

  if (b.op === "off") {   // v4 · = Google's mgmtAccessOff rules
    if (!t) { await audit("", who, "off", "nothing to remove · not in the app list"); return out({ ok: true, pw: 0, sessions: 0 }); }
    const email = String(t.email).toLowerCase();
    if (email === byEmail) return out({ ok: false, msg: "You cannot remove your own access." });
    if (isPres(t.role)) return out({ ok: false, msg: "The President account cannot be removed." });
    if ((isMgr(t.role) || MANAGERS.includes(email)) && !isPres(me.role)) return out({ ok: false, msg: "Only the President can remove this account." });
    const { data: r, error } = await db.rpc("coe_pw_off", { p_email: email });
    if (error) { await audit(email, t.name, "off", "failed"); return out({ ok: false, msg: "Not removed in the database. Try again." }, 500); }
    await audit(email, t.name, "off", "ok");
    return out({ ok: true, ...(r as any) });
  }

  const { data: live } = await db.from("docs").select("data").eq("key", "sys:live").maybeSingle();
  if (!(live && live.data && live.data.pwDb === true)) return out({ ok: false, fallback: true });
  const pw = String(b.password == null ? "" : b.password), change = !!(b.change || b.current);
  if (pw.length > 200) return out({ ok: false, msg: "Too long." });
  if (!t) { await audit("", who, "set", "refused · no app e-mail"); return out({ ok: false, msg: "No app email for " + who + " yet. Add it in the APP EMAIL column first." }); }
  const email = String(t.email).toLowerCase(), prot = isMgr(t.role) || MANAGERS.includes(email);
  if (prot && !isPres(me.role)) { await audit(email, t.name, "set", "refused · President only"); return out({ ok: false, msg: "Only the President can set this password." }); }
  const { data: had } = await db.from("auth_pw").select("email").eq("email", email).maybeSingle();
  if (had && !change) { await audit(email, t.name, "set", "refused · already has a password"); return out({ ok: false, msg: "This person already has a password. Tap Back, then Change password to replace it." }); }
  const bad = pwBad(email, pw); if (bad) { await audit(email, t.name, change ? "change" : "set", "refused · weak password"); return out({ ok: false, msg: bad }); }
  const { data: sec } = await db.from("auth_secret").select("v").eq("k", "pepper").maybeSingle();
  if (!sec || !sec.v) return out({ ok: false, fallback: true });
  const salt = crypto.randomUUID(), hash = await pwHash(salt, pw, sec.v), now = new Date();
  const { error } = await db.from("auth_pw").upsert({ email, salt, hash, at: now.getTime(), updated_at: now.toISOString(), src: "db", set_at: now.toISOString(), set_by: byEmail }, { onConflict: "email" });
  if (error) { await audit(email, t.name, change ? "change" : "set", "failed · not saved"); return out({ ok: false, msg: "Not saved. Try again." }, 500); }
  await db.from("auth_fails").delete().eq("email", email);
  await audit(email, t.name, change ? "change" : "set", "ok");
  return out({ ok: true, email });
});
