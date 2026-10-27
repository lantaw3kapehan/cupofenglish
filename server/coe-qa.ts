// CupOfEnglish · QA evaluations saved in the database first (27 Oct 2026, release 1362).
// The app still sends the evaluation to Google exactly as before (mgmtQaSubmit → QA-DATA); this keeps a copy in the database
// the moment it is sent, so a teacher's Growth shows it within a minute (coe-growth reads coe_qa_saves).
// op 'save' {token, rid, items:[{id,title,type}], answers} → management only; the row is laid out like QA-DATA (header titles,
//          in order; repeated titles taken in turn). Same rid twice = the first save (no duplicates).
// op 'done' {token, rid, ok, msg} → Google's answer: landed / failed (a failed one never shows).
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const ORIGINS = ["https://app.cupofenglishatph.com"];
const cors = (o: string) => ({ "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
async function sha(x: string) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(x)); return Array.from(new Uint8Array(b)).map((c) => c.toString(16).padStart(2, "0")).join(""); }
const norm = (s: any) => String(s == null ? "" : s).replace(/\s+/g, " ").trim().toUpperCase();
const loc = (t: number) => new Date(t + 8 * 3600e3).toISOString().slice(0, 19);
const SCORE_COLS = [7, 9, 11, 13, 15];

function layout(head: any[], items: any[], ans: Record<string, any>, now: number) {
  const used = new Set<string>(), row: any[] = [loc(now)], miss: string[] = [];
  for (let j = 1; j < head.length; j++) {
    const h = norm(head[j]); if (!h) { row.push(""); continue; }
    const it = items.find((x: any) => !used.has(String(x.id)) && norm(x.title) === h);
    if (!it) { row.push(""); miss.push(String(head[j])); continue; }
    used.add(String(it.id));
    let v: any = ans[String(it.id)]; if (Array.isArray(v)) v = v.join(", "); if (v == null) v = "";
    if (it.type === "DATE" && /^\d{4}-\d\d-\d\d$/.test(String(v))) v = v + "T00:00:00";
    else if (SCORE_COLS.indexOf(j) > -1 && /^\s*\d+(\.\d+)?\s*$/.test(String(v))) v = Number(v);
    row.push(v);
  }
  return { row, miss };
}

Deno.serve(async (req) => {
  const h = cors(req.headers.get("origin") || "");
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...h, "Content-Type": "application/json" } });
  let b: any; try { b = JSON.parse(await req.text()); } catch { return out({ ok: false, error: "bad request" }, 400); }
  const token = String(b.token || ""); if (token.length < 16) return out({ ok: false, error: "AUTH" }, 401);
  const { data: s } = await db.from("app_sessions").select("name,mode,exp").eq("token_hash", await sha(token)).maybeSingle();
  if (!s || new Date(s.exp).getTime() < Date.now() || s.mode !== "mgmt") return out({ ok: false, error: "AUTH" }, 401);
  const rid = String(b.rid || "").slice(0, 80); if (rid.length < 8) return out({ ok: false, error: "rid" }, 400);
  try {
    if (b.op === "save") {
      const { data: old } = await db.from("coe_qa_saves").select("status").eq("rid", rid).maybeSingle();
      if (old) return out({ ok: true, status: old.status, dup: true });
      const items = Array.isArray(b.items) ? b.items.slice(0, 80) : [], ans = b.answers && typeof b.answers === "object" ? b.answers : {};
      const { data: hd } = await db.from("sheet_rows").select("data").eq("tab", "QA-DATA").eq("r", 1).maybeSingle();
      const head = hd && Array.isArray(hd.data) ? hd.data : [];
      if (head.length < 20) return out({ ok: false, error: "no QA-DATA header" });
      const { row, miss } = layout(head, items, ans, Date.now());
      const teacher = String(row[2] || "").trim();
      const ok = !!teacher && SCORE_COLS.every((j) => typeof row[j] === "number") && !miss.some((m) => /^(TEACHER|EVALUATOR|DATE OF EVALUATION)$/.test(norm(m)));
      const status = ok ? "pending" : "unmapped";
      const { error } = await db.from("coe_qa_saves").insert({ rid, who: s.name, teacher: teacher || "?", row, status, msg: miss.length ? "not matched: " + miss.join(" · ").slice(0, 400) : null });
      if (error && !/duplicate/i.test(error.message)) return out({ ok: false, error: "db" }, 500);
      return out({ ok: true, status, miss });
    }
    if (b.op === "done") {
      const st = b.ok ? "landed" : "failed";
      await db.from("coe_qa_saves").update({ status: st, msg: b.ok ? null : String(b.msg || "Google did not save it").slice(0, 300), updated_at: new Date().toISOString() }).eq("rid", rid).in("status", ["pending", "failed"]);
      return out({ ok: true, status: st });
    }
    return out({ ok: false, error: "unknown op" }, 400);
  } catch (e) { return out({ ok: false, error: "db", why: String((e as Error).message || e) }, 500); }
});
