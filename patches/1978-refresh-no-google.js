// 1978: (Misty 9 Nov 14:03 "let us do all now") Management ↻ no longer asks Google.
//   · Google's "refresh" (4–5 s) ran behind every management ↻ and then replaced the start data with Google's copy. Management's start data
//     is only the name, date, own shift and time-in (1971); every screen already refreshes from the database (about 0.7 s). Removed.
//   · Google's system health (mgmtHealth, 5 s) ran on every ↻ as well. It now runs at most every 30 min (and when Team is opened),
//     like the other place that already asked for it.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["  await loadMgmt(); if(MS){ MS = null; if(VIEW==='astudents') loadStudents(); } toast('Up to date'); $('rf').classList.remove('spin');\n  const tk = TOKEN; api('refresh', tk).then(v => { if(!v || TOKEN !== tk) return; store('set', KEY_D, JSON.stringify(v)); const a = document.activeElement; if(document.querySelector('#sheet.on') || (a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName))) return; D = v; render(); }).catch(() => {});\n  return; }",
   "  await loadMgmt(); if(MS){ MS = null; if(VIEW==='astudents') loadStudents(); } toast('Up to date'); $('rf').classList.remove('spin');\n  return; }   /* 1978: no Google 'refresh' behind management ↻ */"],
  ["setTimeout(() => bg(() => { loadHealth(); loadNight(0); }), 600);",
   "setTimeout(() => bg(() => { if(Date.now() - (window._hlAt || 0) > 30 * 60000 || VIEW === 'team'){ window._hlAt = Date.now(); loadHealth(); } loadNight(0); }), 600);   /* 1978: Google health at most every 30 min */"],
]);
