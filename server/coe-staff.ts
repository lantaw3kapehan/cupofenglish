// CupOfEnglish · coe-staff (28 Oct 2026 · 1440): one place to add / edit / deactivate teachers and staff, saved in the database
// first. Misty 11:31 "in Management there should be Add, so when we add, everything reflects"; 11:32 "and that they get access to
// the app with the info we add"; 11:35 "information can be referred to what's in MASTERLIST".
// - The record lives in public.staff (ml = the person's MASTERLIST row, same columns and order as the sheet).
// - Sign-in: the same check the app already uses (auth_users + auth_pw + the pepper in auth_secret, hashed exactly like Google's
//   pwHash_). A new password works within seconds; Google copies the same salt+hash to its own store (STAFF28 paste), so the
//   Google sign-in path accepts it too. Plain passwords are never stored.
// - Google follows within a minute (STAFF28): MASTERLIST row, PAYROLL name dropdowns, PAYROLL rows, sign-in store, access off.
// - Management only. Ops / Admin (management access) can only be given, changed or removed by the President. The President's
//   own row cannot be changed here.
// Actions: list · check (validate only, nothing saved) · save · off · on.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
async function pwHash(salt: string, pw: string, pep: string) {   // identical to coe.ts / Apps Script pwHash_
  const enc = new TextEncoder(), sb = enc.encode(salt);
  let d = new Uint8Array(await crypto.subtle.digest("SHA-256", enc.encode(salt + "|" + pw + "|" + pep)));
  for (let i = 0; i < 400; i++) { const x = new Uint8Array(d.length + sb.length); x.set(d); x.set(sb, d.length); d = new Uint8Array(await crypto.subtle.digest("SHA-256", x)); }
  let bin = ""; d.forEach((c) => bin += String.fromCharCode(c)); return btoa(bin);
}
const str = (x: unknown, n = 300) => String(x == null ? "" : x).trim().slice(0, n);
const lc = (s: unknown) => String(s || "").trim().toLowerCase();
const ROLES = ["teacher", "ops", "admin", "staff"];
const APPROLE: Record<string, string> = { teacher: "Teacher", ops: "Ops", admin: "Admin", staff: "" };
const isMgmtRole = (r: string) => r === "ops" || r === "admin";
const isPresRow = (p: any) => /president/i.test(String(p && p.position || ""));
const PRIV = ["sss", "philhealth", "pagibig", "tin", "pw_salt", "pw_hash"];
// MASTERLIST column index → staff field (the rest of the row is kept in ml as typed)
const ML: Record<number, string> = { 1: "last_name", 2: "first_name", 4: "name", 6: "position", 7: "employment", 8: "start_date", 18: "contact", 22: "sss", 23: "philhealth", 24: "pagibig", 25: "tin", 28: "email" };
const ML_SENSITIVE = [17, 20, 22, 23, 24, 25, 26, 27];   // birth date, address, government numbers, emergency contact
function pwBad(email: string, pw: string) {
  if (pw.length < 8) return "Use at least 8 characters.";
  if (pw.length > 100) return "Use at most 100 characters.";
  if (pw.toLowerCase() === email || /^(\d)\1+$/.test(pw) || /^(12345678|password|qwertyui)/i.test(pw)) return "Choose a harder password.";
  return "";
}
async function syncDocs() {   // sys:fixedpay (monthly pay) and sys:chat exclude follow the staff table
  const { data: S } = await db.from("staff").select("name,role,position,status,pay_type,pay_hist,chat");
  const rows = S || [];
  const { data: fd } = await db.from("docs").select("data").eq("key", "sys:fixedpay").maybeSingle();
  const fdata: any = (fd && fd.data) || {};
  const list = rows.filter((p: any) => p.status === "active" && p.pay_type === "monthly").map((p: any) => {
    const h = (Array.isArray(p.pay_hist) ? p.pay_hist : []).filter((x: any) => Number(x.monthly) > 0).sort((a: any, b: any) => String(a.from).localeCompare(String(b.from)));
    const last = h[h.length - 1] || {}, first = h[0] || {};
    return { name: p.name, role: p.position || "", monthly: Number(last.monthly) || 0, from: String(first.from || "").slice(0, 7) || undefined };
  }).filter((x: any) => x.monthly > 0);
  await db.from("docs").upsert({ key: "sys:fixedpay", scope: "mgmt", data: { ...fdata, list }, updated_at: new Date().toISOString() });
  const { data: cd } = await db.from("docs").select("data").eq("key", "sys:chat").maybeSingle();
  if (cd && cd.data) {
    const c: any = cd.data, ex = new Set((Array.isArray(c.exclude) ? c.exclude : []).map((x: unknown) => String(x)));
    rows.filter((p: any) => p.role === "teacher").forEach((p: any) => {   // management and non-app staff are not on this list
      const leaveOut = p.status !== "active" || p.chat === false;
      const hit = [...ex].find((x) => lc(x) === lc(p.name));
      if (leaveOut && !hit) ex.add(p.name);
      if (!leaveOut && hit) ex.delete(hit);
    });
    await db.from("docs").update({ data: { ...c, exclude: [...ex] }, updated_at: new Date().toISOString() }).eq("key", "sys:chat");
  }
}

Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: s } = await db.from("app_sessions").select("email,name,role,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
  if (s.mode !== "mgmt" || !/ops|operation|manag|admin|president/i.test(String(s.role || ""))) return out({ ok: false, error: "Management only" }, 403);
  const pres = /president/i.test(String(s.role || "")), me = String(s.name || s.email || ""), a = String(b.action || "");
  try {
    if (a === "list") {
      const [{ data: S }, { data: hd }, { data: A }, { data: P }] = await Promise.all([
        db.from("staff").select("*").order("status").order("name"),
        db.from("sheet_tabs").select("head,synced_at").eq("tab", "MASTERLIST").maybeSingle(),
        db.from("auth_users").select("email"), db.from("auth_pw").select("email")]);
      const au = new Set((A || []).map((x: any) => lc(x.email))), ap = new Set((P || []).map((x: any) => lc(x.email)));
      const people = (S || []).map((p: any) => {
        const o: any = { ...p }; PRIV.slice(4).forEach((k) => delete o[k]);
        o.signin = p.email ? (ap.has(lc(p.email)) ? "ready" : au.has(lc(p.email)) ? "no password" : "not yet") : "none";
        o.pw_pending = !!p.pw_hash; o.president = isPresRow(p);
        return o;
      });
      return out({ ok: true, pres, head: (hd && hd.head) || [], sens: ML_SENSITIVE, map: ML, people });
    }
    if (a === "save" || a === "check") {
      const f = b.f || {}, id = Number(f.id) || 0;
      let cur: any = null;
      if (id) { const { data } = await db.from("staff").select("*").eq("id", id).maybeSingle(); cur = data; if (!cur) return out({ ok: false, msg: "This person was not found. Refresh and try again." }); }
      if (cur && isPresRow(cur)) return out({ ok: false, msg: "The President's own record is changed in MASTERLIST only." });
      const name = cur ? cur.name : str(f.name, 40).replace(/^(teacher|coordinator|admin|support)\s+/i, "");
      if (!name || !/^[A-Za-z][A-Za-z .'-]{0,38}$/.test(name)) return out({ ok: false, msg: "Enter the short name used in the app (letters only), e.g. Rose." });
      const role = ROLES.includes(f.role) ? f.role : (cur ? cur.role : "teacher");
      if ((isMgmtRole(role) || (cur && isMgmtRole(cur.role))) && !pres) return out({ ok: false, msg: "Only the President can give, change or remove management access." });
      const email = lc(str(f.email, 120));
      if (role !== "staff" && f.signin !== false && email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return out({ ok: false, msg: "The sign-in email doesn't look right." });
      if (!cur) { const { data: dup } = await db.from("staff").select("id,status").ilike("name", name).maybeSingle(); if (dup) return out({ ok: false, msg: name + " is already in the list. Open them and tap Edit instead (or pick another app name)." }); }
      if (email) { const { data: de } = await db.from("staff").select("id,name").ilike("email", email); if ((de || []).some((x: any) => x.id !== id)) return out({ ok: false, msg: "This email already belongs to " + de!.find((x: any) => x.id !== id)!.name + "." }); }
      const pw = String(f.pw || "");
      if (pw) { if (!email) return out({ ok: false, msg: "Add the sign-in email first." }); const bad = pwBad(email, pw); if (bad) return out({ ok: false, msg: bad }); }
      const payType = ["lesson", "monthly", "none"].includes(f.pay_type) ? f.pay_type : (cur ? cur.pay_type : role === "teacher" ? "lesson" : "none");
      let hist: any[] = Array.isArray(cur && cur.pay_hist) ? cur.pay_hist.slice() : [];
      const amt = Number(f.pay_amount), from = str(f.pay_from, 10);
      if (amt > 0) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(from)) return out({ ok: false, msg: "Pick the date the pay starts." });
        const e = payType === "monthly" ? { from, monthly: amt } : { from, rate: amt };
        const last = hist[hist.length - 1];
        if (!last || Number(last.rate || last.monthly) !== amt || (last.monthly ? "monthly" : "lesson") !== payType) { hist = hist.filter((x) => x.from !== from); hist.push(e); hist.sort((x, y) => String(x.from).localeCompare(String(y.from))); }
      }
      // MASTERLIST row: start from what the sheet has, apply the form's columns
      const ml: any[] = Array.isArray(cur && cur.ml) ? cur.ml.slice() : [];
      const mlIn: Record<string, unknown> = f.ml && typeof f.ml === "object" ? f.ml : {};
      Object.keys(mlIn).forEach((k) => { const i = Number(k); if (i >= 0 && i < 60 && ![9].includes(i)) ml[i] = str(mlIn[k], 300); });   // 9 LENGTH is worked out by the sheet
      ml[4] = (role === "ops" ? "Coordinator " : "") + name;
      if (email || role === "staff") ml[28] = email;
      ml[29] = APPROLE[role];
      if (!cur) ml[10] = ml[10] || "Active";
      const row: any = {
        name, role, email: email || null, pay_type: payType, pay_hist: hist, chat: f.chat !== false,
        first_name: str(ml[2], 80) || null, last_name: str(ml[1], 80) || null, cn_name: str(f.cn_name, 40) || (cur && cur.cn_name) || null,
        position: str(ml[6], 120) || null, employment: str(ml[7], 60) || null,
        start_date: /^\d{4}-\d{2}-\d{2}/.test(String(ml[8] || "")) ? String(ml[8]).slice(0, 10) : (cur ? cur.start_date : null),
        contact: str(ml[18], 60) || null, sss: str(ml[22], 40) || null, philhealth: str(ml[23], 40) || null, pagibig: str(ml[24], 40) || null, tin: str(ml[25], 40) || null,
        books: str(f.books, 500) || null, avail: str(f.avail, 500) || null, ml,
        status: cur ? cur.status : "active", sync_pending: true, updated_at: new Date().toISOString(), updated_by: me,
      };
      if (a === "check") return out({ ok: true, check: true, row: { ...row, sss: undefined, philhealth: undefined, pagibig: undefined, tin: undefined }, pw: !!pw });
      let salt = "", hash = "";
      if (pw) {
        const { data: sec } = await db.from("auth_secret").select("v").eq("k", "pepper").maybeSingle();
        if (!sec) return out({ ok: false, msg: "Sign-in isn't ready on the database yet. Try again in a minute." });
        salt = crypto.randomUUID(); hash = await pwHash(salt, pw, sec.v);
        row.pw_salt = salt; row.pw_hash = hash; row.pw_set_at = new Date().toISOString();
      }
      const res = cur ? await db.from("staff").update(row).eq("id", id).select("id").single() : await db.from("staff").insert({ ...row, src: "app" }).select("id").single();
      if (res.error) return out({ ok: false, msg: "Not saved: " + res.error.message.slice(0, 120) });
      if (row.status === "active" && role !== "staff" && email) {   // sign-in works at once (Google copies the same within a minute)
        const at = new Date().toISOString();
        await db.from("auth_users").upsert({ email, name, role: APPROLE[role], code: "", updated_at: at });
        if (pw) await db.from("auth_pw").upsert({ email, salt, hash, at: Date.now(), updated_at: at });
      }
      if (cur && cur.email && lc(cur.email) !== email) { await db.from("auth_pw").delete().eq("email", lc(cur.email)); await db.from("auth_users").delete().eq("email", lc(cur.email)); await db.from("app_sessions").delete().eq("email", lc(cur.email)); }
      if (cur && cur.role !== role) await db.from("app_sessions").delete().eq("email", email);   // role changed → sign in again with the new access
      await db.from("staff_log").insert({ by: me, name, what: cur ? "edit" : "add", detail: { role, email, pay_type: payType, pw: !!pw, fields: Object.keys(mlIn).map(Number).filter((i) => !ML_SENSITIVE.includes(i)) } });
      await syncDocs();
      return out({ ok: true, id: res.data.id, name, role, email, pw: !!pw, isNew: !cur });
    }
    if (a === "off" || a === "on") {
      const id = Number(b.id) || 0; const { data: cur } = await db.from("staff").select("*").eq("id", id).maybeSingle();
      if (!cur) return out({ ok: false, msg: "Not found." });
      if (isPresRow(cur)) return out({ ok: false, msg: "The President account cannot be changed here." });
      if (isMgmtRole(cur.role) && !pres) return out({ ok: false, msg: "Only the President can change management access." });
      if (lc(cur.email) && lc(cur.email) === lc(s.email)) return out({ ok: false, msg: "You cannot remove your own access." });
      const on = a === "on";
      await db.from("staff").update({ status: on ? "active" : "inactive", sync_pending: true, updated_at: new Date().toISOString(), updated_by: me }).eq("id", id);
      if (!on && cur.email) {   // sign-in stops at once: no password here, every open session ends
        await db.from("auth_pw").delete().eq("email", lc(cur.email));
        await db.from("auth_users").delete().eq("email", lc(cur.email));
        await db.from("app_sessions").delete().eq("email", lc(cur.email));
      }
      if (on && cur.email && cur.role !== "staff") await db.from("auth_users").upsert({ email: lc(cur.email), name: cur.name, role: APPROLE[cur.role], code: "", updated_at: new Date().toISOString() });
      await db.from("staff_log").insert({ by: me, name: cur.name, what: on ? "reactivate" : "deactivate", detail: { reason: str(b.reason, 200) } });
      await syncDocs();
      return out({ ok: true, name: cur.name, status: on ? "active" : "inactive", needPw: on && !!cur.email });
    }
    return out({ ok: false, error: "unknown action" }, 400);
  } catch (e) { return out({ ok: false, msg: "Server error: " + String((e as Error).message || e).slice(0, 120) }, 500); }
});
