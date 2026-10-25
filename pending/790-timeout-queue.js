// 790: management time-out goes through the database queue (instant), Google writes it into T-TIMEIN within a minute.
// NEEDS the Apps Script line `SB_REPLAY.timeOut = 1;` deployed first (else Google refuses to replay it).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["const FAST_M = { mgmtRenewal: 1,", "const FAST_M = { timeOut: 1, mgmtRenewal: 1,"],
  ["  if(fn === 'markHomework') return { ok: true, queued: true, hw: { time: t, text: String(a.text || '') } };",
   "  if(fn === 'markHomework') return { ok: true, queued: true, hw: { time: t, text: String(a.text || '') } };\n  if(fn === 'timeOut'){ let hrs = ''; try{ const ti = (D && D.timeIn) || {}, m = String(ti.time || '').match(/(\\d{1,2}):(\\d{2})/); if(m){ const n = new Date(), a0 = new Date(); a0.setHours(+m[1], +m[2], 0, 0); const h = (n - a0) / 36e5; if(h > 0 && h < 24) hrs = Math.round(h * 10) / 10; } }catch(e){} return { ok: true, queued: true, out: { time: t, hours: hrs } }; }   /* 790 */"]
]);
