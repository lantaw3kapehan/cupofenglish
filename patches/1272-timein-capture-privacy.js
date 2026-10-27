// 1272: (Misty, 27 Oct 15:21 · Teacher Pam's real time-in picture)
//   1. Privacy: the entire-screen picture showed the app behind VooV — the header pay rate and a student's code + phone number.
//      While a time-in / redo / "I'm in" screen picture is being taken (from the share prompt until the frame is grabbed) the whole
//      app is covered by a neutral screen (logo + "Taking your screen picture…"); nothing of the app (names, rates, phones) can be in it.
//      After sharing starts, a 3-second countdown asks the teacher to bring the VooV window to the front, so the picture shows
//      VooV + clock + LAN icon instead of the app.
//   2. Upload "0.0 Mbps" was a test that never ran (the time budget was used up by the download rounds on a slower line), not a
//      real zero. Upload now has its own time, is sent the way Cloudflare's page accepts from another site, and a missing or ≤0.05
//      result shows "not measured" (card, chips, details) — never 0.0. Thresholds unchanged (upload is information only).
//   3. The checklist row "Screen proof · check VooV + date/time" is a reminder for management to look, not a verified ✓ → neutral "…".
const fs = require('fs'), file = process.argv[2], lib = require('../tools/lib.js');
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + fs.readFileSync(__dirname + '/1272-timein-capture-privacy.inc', 'utf8') + s.slice(i);
fs.writeFileSync(file, s);
lib(file, [
  ["L.push(x.shot ? { ok: true, t: 'Screen proof · VooV + date/time' }", "L.push(x.shot ? { ok: null, t: 'Screen proof · check VooV + date/time' }"],
  ["if(await up(1e5, 6, 11500)) await up(1e6, 4, 13000);", "var ub = used(); if(await up(1e5, 6, ub + 2500)) await up(1e6, 4, ub + 4500);   /* 1272: upload has its own time (it was skipped when the download rounds used up the budget) */"],
  ["await (await go(u2, 8000, { method: 'POST', body: body, headers: { 'Content-Type': 'text/plain' } })).text(); var e2 = rt(u2), dt = (e2 && e2.responseStart > e2.startTime ? e2.responseStart - e2.startTime : performance.now() - t1) / 1000;",
   "try{ await (await go(u2, 8000, { method: 'POST', body: body, mode: 'no-cors' })).text(); }catch(eu){ if(eu && eu.name === 'AbortError') return false; continue; } var e2 = rt(u2), dt = (e2 && e2.responseStart > e2.startTime ? e2.responseStart - e2.startTime : performance.now() - t1) / 1000;"],
  ["out.speed = '↓ ' + p90(dl).toFixed(1) + ' Mbps · ↑ ' + (ul.length ? p90(ul).toFixed(1) : '0.0') + ' Mbps · '", "out.speed = '↓ ' + p90(dl).toFixed(1) + ' Mbps · ' + (ul.length && p90(ul) > 0.05 ? '↑ ' + p90(ul).toFixed(1) + ' Mbps · ' : '')"],
  ["up = num(x.speed, /↑\\s*([\\d.]+)/)", "up = (+num(x.speed, /↑\\s*([\\d.]+)/) > 0.05 ? num(x.speed, /↑\\s*([\\d.]+)/) : '')"]]);
