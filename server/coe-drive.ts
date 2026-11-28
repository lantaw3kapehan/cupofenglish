// CupOfEnglish · coe-drive (28 Nov 2026): Google Drive without Apps Script.
// Service account coe-drive@coe-drive.iam.gserviceaccount.com (project "COE Drive"), domain-wide delegation,
// scope https://www.googleapis.com/auth/drive, acting as works@cupofenglishatph.com. Key: secret GOOGLE_SA_JSON.
// POST { token | (header x-coe-srv), op, ... }
//   probe       {}                → { ok, user, quota }                 (President / server key: is the setup working?)
//   script_src  {}                → { ok, files }                       (server key: copy the Apps Script source into table coe_gas_src)
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(t: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
const AS = "works@cupofenglishatph.com";

// ── Google access token for works@ (JWT bearer, RS256), kept ~50 minutes
let TOK: { t: string; exp: number; sub: string } | null = null;
const b64u = (u: Uint8Array | string) => { const s = typeof u === "string" ? btoa(unescape(encodeURIComponent(u))) : btoa(String.fromCharCode(...u)); return s.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); };
export async function gToken(sub = AS): Promise<string> {
  if (TOK && TOK.sub === sub && TOK.exp > Date.now() + 60e3) return TOK.t;
  const raw = Deno.env.get("GOOGLE_SA_JSON"); if (!raw) throw new Error("GOOGLE_SA_JSON is not set");
  const k = JSON.parse(raw), now = Math.floor(Date.now() / 1000);
  const head = b64u(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const body = b64u(JSON.stringify({ iss: k.client_email, sub, scope: "https://www.googleapis.com/auth/drive", aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 }));
  const pem = String(k.private_key).replace(/-----[^-]+-----/g, "").replace(/\s+/g, "");
  const der = Uint8Array.from(atob(pem), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey("pkcs8", der, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
  const sig = new Uint8Array(await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(head + "." + body)));
  const r = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: head + "." + body + "." + b64u(sig) }) });
  const j = await r.json(); if (!j.access_token) throw new Error("Google token: " + JSON.stringify(j).slice(0, 300));
  TOK = { t: j.access_token, exp: Date.now() + (j.expires_in || 3600) * 1000, sub }; return TOK.t;
}
export async function gApi(url: string, init: RequestInit = {}) {
  const t = await gToken(); const h = new Headers(init.headers || {}); h.set("Authorization", "Bearer " + t);
  return fetch(url, { ...init, headers: h });
}

Deno.serve(async (req: Request) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method !== "POST") return out({ ok: false, error: "POST only" }, 405);
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  // who: the server key (only the database knows it) or an app session
  let srv = false, pres = false, me = "";
  const sk = req.headers.get("x-coe-srv") || "";
  if (sk.length >= 32) { const { data } = await db.from("coe_srv_key").select("k").eq("k_hash", await sha(sk)).maybeSingle(); srv = !!data; }
  if (!srv) {
    const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
    const { data: s } = await db.from("app_sessions").select("name,role,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
    if (!s || new Date(s.exp).getTime() < Date.now()) return out({ ok: false, error: "AUTH" }, 401);
    pres = s.mode === "mgmt" && /president/i.test(String(s.role || "")); me = String(s.name || "");
  }
  const op = String(b.op || "");
  try {
    if (op === "probe") {
      if (!srv && !pres) return out({ ok: false, error: "Only the President can do this." }, 403);
      const r = await gApi("https://www.googleapis.com/drive/v3/about?fields=user(emailAddress,displayName),storageQuota");
      const j = await r.json(); return out({ ok: r.ok, user: j.user, quota: j.storageQuota, err: r.ok ? undefined : j });
    }
    if (op === "script_src") {
      if (!srv) return out({ ok: false, error: "server only" }, 403);
      const q = encodeURIComponent("mimeType='application/vnd.google-apps.script' and trashed=false");
      const l = await (await gApi(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name,modifiedTime)&pageSize=100&supportsAllDrives=true&includeItemsFromAllDrives=true`)).json();
      const files = l.files || [], got: any[] = [];
      for (const f of files) {
        const r = await gApi(`https://www.googleapis.com/drive/v3/files/${f.id}/export?mimeType=${encodeURIComponent("application/vnd.google-apps.script+json")}`);
        const t = await r.text(); got.push({ id: f.id, name: f.name, modified: f.modifiedTime, ok: r.ok, size: t.length });
        if (r.ok) await db.from("coe_gas_src").upsert({ id: f.id, name: f.name, modified: f.modifiedTime, src: JSON.parse(t), copied_at: new Date().toISOString() });
      }
      return out({ ok: true, files: got, list: l.error || undefined });
    }
    return out({ ok: false, error: "unknown op" }, 400);
  } catch (e) { return out({ ok: false, error: String((e as Error).message || e).slice(0, 400) }, 500); }
});
