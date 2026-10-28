// 1471 · Operations QA 28 Oct (Misty's priority 2: "keep statuses consistent across screens"; accurate dates).
//   Notices & requests wrote every date as month/day with a slash — "10/22 21:00", "Got it 10/11 17:18", memo
//   "Received and acknowledged by … · 10/22 21:00". In the Philippines 10/11 reads as 10 November as easily as 11 October,
//   and every other management screen writes the day first ("24 Oct", "Sat 23 Oct"). The shared formatter (msgAt) now writes
//   "22 Oct 21:00" — same 24-hour time, same source value, nothing else changed. Used by Notices & requests, progress checks,
//   memos and the teacher's own Notices list (teachers see the same day-first date).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["const msgAt = s => { const d = String(s || ''); return d.slice(5, 10).replace('-', '/') + ' ' + d.slice(11, 16); };",
   "const msgAt = s => { const d = String(s || ''), m = +d.slice(5, 7); if(/^\\d{4}-\\d{2}-\\d{2}/.test(d) && m >= 1 && m <= 12) return (+d.slice(8, 10) + ' ' + 'JanFebMarAprMayJunJulAugSepOctNovDec'.substr(m * 3 - 3, 3) + ' ' + d.slice(11, 16)).trim();   /* 1471: day first, as on every other screen */\n" +
   "  return d.slice(5, 10).replace('-', '/') + ' ' + d.slice(11, 16); };"]
]);
