// 1614 · taps first, background later (Misty 11:40: "management access is still slow every time we choose a screen and
//   buttons"). Her laptop telemetry: right after each reload about 15 background Google reads started at once (4–20 s each)
//   and her database-backed taps in the same seconds took 5–7 s instead of 0.5–1 s.
//   Now every Google read that nobody is waiting for (no tap in the last 1.5 s) waits its turn: none in the first 3.5 s
//   after the page opens, at most 2 at a time, 200 ms apart, and none starts while a tapped call is still running or within
//   1.5 s of a tap. Saves and tapped reads go at once, as before. The same read asked twice waits for one answer.
//   Database copies also get more time before the app gives up on them (light copies 8 s, was 4 s), so a slow moment no
//   longer sends the read to Google.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["tid = ac ? setTimeout(() => ac.abort(), g === '_' ? 4000 : 9000) : 0;   /* 1607 */", "tid = ac ? setTimeout(() => ac.abort(), g === '_' ? 8000 : 9000) : 0;   /* 1607 · 1614 */"],
  ["new Promise(z => setTimeout(() => z(null), 4500))]).then(d => (d && d.data != null && !(d.data && d.data.ok === false && fn !== 'mgmtHealth')",
   "new Promise(z => setTimeout(() => z(null), 8500))]).then(d => (d && d.data != null && !(d.data && d.data.ok === false && fn !== 'mgmtHealth')"],
  ["</script>\n<script>\n/* 1374 · progress reports",
   "</script>\n<script>\n/* 1614 · Google reads nobody waits for go one or two at a time, after the taps */\n(function(){\n" +
   "  if(window.__1614 || typeof window.apiNow !== 'function') return; window.__1614 = 1;\n" +
   "  const an = window.apiNow, Q = [], SAME = {}; let run = 0, ui = 0, last = 0, T = 0;\n" +
   "  const isRead = fn => (typeof API_READ !== 'undefined' && API_READ.test(fn)) || (typeof API_BG !== 'undefined' && API_BG.test(fn)) || (typeof SB_R !== 'undefined' && SB_R.test(fn));\n" +
   "  const tapped = () => Date.now() - (window._ui || 0) < 1500;\n" +
   "  function pump(){ clearTimeout(T); T = 0;\n" +
   "    if(!Q.length) return;\n" +
   "    const wait = Math.max(3500 - performance.now(), ui > 0 || tapped() ? 300 : 0, run >= 2 ? 250 : 0, 200 - (Date.now() - last));\n" +
   "    if(wait > 0){ T = setTimeout(pump, Math.max(50, wait)); return; }\n" +
   "    const j = Q.shift(); run++; last = Date.now();\n" +
   "    let p; try{ p = Promise.resolve(an.apply(null, [j.fn].concat(j.args))); }catch(e){ p = Promise.reject(e); }\n" +
   "    p.then(j.res, j.rej).finally(() => { run--; delete SAME[j.k]; pump(); });\n" +
   "    if(Q.length) T = setTimeout(pump, 200); }\n" +
   "  window.apiNow = apiNow = function(fn){ const args = Array.prototype.slice.call(arguments, 1);\n" +
   "    try{\n" +
   "      if(!isRead(fn) || tapped()){ ui++; let p; try{ p = Promise.resolve(an.apply(this, arguments)); }catch(e){ ui--; throw e; } p.finally(() => { ui--; }).catch(() => {}); return p; }\n" +
   "      const k = fn + '|' + JSON.stringify(args.slice(1)); if(SAME[k]) return SAME[k];\n" +
   "      const pr = new Promise((res, rej) => { Q.push({ fn, args, k, res, rej }); }); SAME[k] = pr; pump(); return pr;\n" +
   "    }catch(e){ return an.apply(this, arguments); } };\n" +
   "  for(const k in an) try{ window.apiNow[k] = an[k]; }catch(e){}\n" +
   "})();\n" +
   "</script>\n<script>\n/* 1374 · progress reports"],
]);
