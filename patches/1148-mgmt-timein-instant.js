// 1148: (Misty, 27 Oct 09:54 "saving the time in is too slow now") Management time-in still went straight to Google (15–35 s, "Saving…")
//   and first waited for the full internet speed test and a fresh location. Now:
//   · management time-in is saved through the database queue like every teacher's (Google records it within a minute, same time
//     stamp — the queue keeps the tap time);
//   · the speed test and location are waited for at most 2.5 s / 4 s (management) or 8 s / 9 s (teachers, who share the screen first,
//     so both are normally ready long before) — after that the time-in is saved anyway, with whatever was measured.
//   Policies, thresholds and statuses are unchanged; Google still works out On time / Late.
require('../tools/lib.js')(process.argv[2], [
  ["if(FAST_W[fn] && fastOn()) return fastWrite(fn, args);",
   "if(FAST_W[fn] && (fastOn() || (fn === 'timeIn' && D && D.mgr && (function(){ try{ return localStorage.getItem('coe.fast') !== '0'; }catch(e){ return true; } })()))) return fastWrite(fn, args);"],
  ["return { ok: true, queued: true, timeIn: { time: t, status: fl ? (mins >= 30 ? 'On time' : 'Late') : 'No class today', mins, place: '', proof: '', flag: '' } }; }",
   "return { ok: true, queued: true, timeIn: { time: t, status: D && D.mgr ? '' : fl ? (mins >= 30 ? 'On time' : 'Late') : 'No class today', mins: D && D.mgr ? '' : mins, place: '', proof: '', flag: '' } }; }"],
  ["toast((r.dup ? 'Already timed in · ' : 'Time-in saved · ') + r.timeIn.time + (r.timeIn.status!=='On time'",
   "toast((r.dup ? 'Already timed in · ' : 'Time-in saved · ') + r.timeIn.time + (r.timeIn.status && r.timeIn.status!=='On time'"],
  ["const loc = await LOC;", "const loc = await Promise.race([LOC, new Promise(z => setTimeout(() => z({ locErr: 'timed out' }), D.shift ? 4000 : 9000))]);"],
  ["}, await NET, loc);", "}, await Promise.race([NET, new Promise(z => setTimeout(() => z({}), D.shift ? 2500 : 8000))]), loc);"]]);
