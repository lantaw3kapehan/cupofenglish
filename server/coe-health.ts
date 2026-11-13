// CupOfEnglish · coe-health (13 Nov 2026): the outside uptime alarm's check. Public, no sign-in, returns no personal data.
// GET or POST → { ok, db, at, backupDay, backupAgeHours, classesToday }.
// ok = the database answered within 8 seconds. The GitHub "Uptime alarm" workflow calls this every few minutes.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });

Deno.serve(async () => {
  const t0 = Date.now();
  const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
  try {
    const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error("database did not answer in 8 s")), 8000));
    const q = db.from("docs").select("data,updated_at").eq("key", "sys:backup").maybeSingle();
    const { data, error } = await Promise.race([q, timeout]) as any;
    if (error) return out({ ok: false, db: false, error: String(error.message || error).slice(0, 200), ms: Date.now() - t0 }, 503);
    const day = new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10);
    const { count } = await db.from("classes").select("id", { count: "exact", head: true }).gte("starts_at", day + "T00:00:00+08:00").lt("starts_at", day + "T23:59:59+08:00");
    const at = data?.updated_at ? new Date(data.updated_at).getTime() : 0;
    return out({ ok: true, db: true, at: new Date().toISOString(), ms: Date.now() - t0, backupDay: data?.data?.day || null, backupAgeHours: at ? Math.round((Date.now() - at) / 36e5) : null, classesToday: count ?? null });
  } catch (e) {
    return out({ ok: false, db: false, error: String((e as Error)?.message || e).slice(0, 200), ms: Date.now() - t0 }, 503);
  }
});
