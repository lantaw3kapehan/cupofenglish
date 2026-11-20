// 2503 (Misty 13:00 "When I Copy WeChat nudge, it's still there"): a teacher you nudged today folds to one line at the bottom
//   ("Nudged 13:00 · 3 items · Copy again · Show"); the items come back in full the next day if they are still not done.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["(function(){ let OPEN = false;", "(function(){ let OPEN = false; const SH = {};\n  const NK = 'coe.nudge2501', nudged = () => { try{ const o = JSON.parse(localStorage.getItem(NK) || '{}'); const d = new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10); return o.d === d ? o : { d, t: {} }; }catch(x){ return { d: '', t: {} }; } };\n  const setNudged = t => { try{ const o = nudged(); o.t[t] = new Date(Date.now() + 8 * 3600e3).toISOString().slice(11, 16); localStorage.setItem(NK, JSON.stringify(o)); }catch(x){} };"],
  ["  function html(){ const R = data(); if(!R.length) return ''; const od = R.filter(r => r.top === 'r').length, N = OPEN ? R : R.slice(0, 6);",
   "  function html(){ const NG = nudged().t, R0 = data(); if(!R0.length) return ''; const R = R0.filter(r => !NG[r.t]).concat(R0.filter(r => NG[r.t])); const od = R.filter(r => r.top === 'r' && !NG[r.t]).length, N = OPEN ? R : R.slice(0, 6);"],
  ["      + N.map(r => '<div class=\"t\"><div class=\"tn\">Teacher ' + e(r.t) + ' <span",
   "      + N.map(r => NG[r.t] && !SH[r.t] ? '<div class=\"t\"><div class=\"tn\" style=\"font-weight:600;color:#8A869C\">Teacher ' + e(r.t) + ' <span class=\"pl g\">Nudged ' + e(NG[r.t]) + '</span><span style=\"font-size:12.5px;font-weight:400\">' + r.L.length + ' item' + (r.L.length === 1 ? '' : 's') + '</span><button type=\"button\" class=\"nb\" data-show=\"' + e(r.t) + '\" style=\"margin-left:auto\">Show</button><button type=\"button\" class=\"nb\" data-nudge=\"' + e(r.t) + '\" style=\"margin-left:6px\">Copy again</button></div></div>' : '<div class=\"t\"><div class=\"tn\">Teacher ' + e(r.t) + ' <span"],
  ["    try{ navigator.clipboard.writeText(txt).then(() => { try{ toast('Copied. Paste it in WeChat to Teacher ' + t + '.'); }catch(x){} }); }catch(x){ prompt('Copy this message:', txt); } }",
   "    try{ navigator.clipboard.writeText(txt).then(() => { try{ toast('Copied. Paste it in WeChat to Teacher ' + t + '.'); }catch(x){} }); }catch(x){ prompt('Copy this message:', txt); } setNudged(t); delete SH[t]; place(); }"],
  ["        box.addEventListener('click', ev => { const b = ev.target.closest('[data-nudge]');",
   "        box.addEventListener('click', ev => { const s0 = ev.target.closest('[data-show]'); if(s0){ ev.stopPropagation(); SH[s0.dataset.show] = !SH[s0.dataset.show]; place(); return; } const b = ev.target.closest('[data-nudge]');"]
]);
