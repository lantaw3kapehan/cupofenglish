// CupOfEnglish · coe-proof v1 (11 Nov 2026, 2067 · Misty: "DO ALL NOW"). Time-in and "I'm in" are finished by the database
// (coe_tin_takeover). This adds the two slow parts a few seconds later, never through Google:
//   · the screen-proof screenshot → storage bucket "proofs" (a long random file name; the link replaces Google Drive's)
//   · the place name from the location (OpenStreetMap), e.g. "Rizal St, Tayug, Pangasinan (±107 m)"
// It only works through the database's own queue (coe_proof_claim), so calling it needs no sign-in and can do no harm.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
const URL0 = Deno.env.get("SUPABASE_URL")!;
const db = createClient(URL0, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const out = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "Content-Type": "application/json" } });
function b64bytes(s: string) { const t = s.replace(/^data:[^,]*,/, "").replace(/\s+/g, ""); const bin = atob(t); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u; }
function rnd() { const u = new Uint8Array(16); crypto.getRandomValues(u); return [...u].map((x) => x.toString(16).padStart(2, "0")).join(""); }
async function placeOf(lat: number, lng: number, acc: string) {
  const tail = acc !== "" && isFinite(+acc) ? " (±" + Math.round(+acc) + " m)" : "";
  try {
    const ac = new AbortController(), t = setTimeout(() => ac.abort(), 6000);
    const r = await fetch("https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=17&accept-language=en&lat=" + lat + "&lon=" + lng,
      { headers: { "User-Agent": "CupOfEnglish-app/1.0 (operations@cupofenglishatph.com)" }, signal: ac.signal }).then((x) => x.json()).finally(() => clearTimeout(t));
    const a = (r && r.address) || {};
    const parts = [a.road || a.neighbourhood || a.hamlet || a.village || a.suburb, a.city || a.town || a.municipality || a.village, a.state || a.province || a.region, a.country]
      .filter((x: any, i: number, arr: any[]) => x && arr.indexOf(x) === i);
    if (parts.length) return parts.join(", ") + tail;
  } catch (_e) { /* keep the coordinates */ }
  return null;
}
Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return out({ ok: false }, 405);
  const { data: W, error } = await db.rpc("coe_proof_claim", { p_n: 6 });
  if (error) return out({ ok: false, error: "db" }, 500);
  const done: any[] = [];
  for (const w of (W || []) as any[]) {
    let proof: string | null = null, place: string | null = null;
    try {
      const dv = w.fn === "timeIn" ? (w.args || [])[3] || {} : (w.args || [])[2] || {};
      const shot = w.fn === "timeIn" ? String((w.args || [])[1] || "") : String(dv.shot || "");
      if (shot.length > 100) {
        const mime = w.fn === "timeIn" && /^image\//.test(String((w.args || [])[2] || "")) ? String(w.args[2]) : "image/jpeg";
        const day = new Date(Date.parse(w.created_at) + 8 * 3600e3).toISOString().slice(0, 7);
        const path = day + "/" + String(w.who || "x").toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + (w.fn === "timeIn" ? "day" : "class") + "-" + w.id + "-" + rnd() + (mime === "image/png" ? ".png" : ".jpg");
        const up = await db.storage.from("proofs").upload(path, b64bytes(shot), { contentType: mime, upsert: false });
        if (!up.error) proof = URL0 + "/storage/v1/object/public/proofs/" + path;
      }
      const lat = Number(dv.lat), lng = Number(dv.lng);
      if (dv.lat != null && dv.lng != null && isFinite(lat) && isFinite(lng)) place = await placeOf(lat, lng, String(dv.acc ?? ""));
      if (shot.length > 100 && !proof) { done.push({ id: w.id, ok: false, retry: true }); continue; }   // the screenshot stays in the save; tried again in 3 min
      await db.rpc("coe_proof_done", { p_wid: w.id, p_proof: proof, p_place: place });
      done.push({ id: w.id, ok: true });
    } catch (_e) { done.push({ id: w.id, ok: false }); }
  }
  return out({ ok: true, n: done.length, done });
});
