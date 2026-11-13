// 2196 (13 Nov · Misty): management Overview gets "Coming up in China" (next 3 weeks) at the bottom, and every China dates note
// has "See all dates", which opens the full list for the year (holidays, exam seasons, make-up school days, international holidays).
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
 ["  const box = (title, L) => L.length ? '<section class=\"cn95\"><h3>' + E(title) + '</h3>' + L.map(item).join('') + '</section>' : '';",
  "  const box = (title, L) => L.length ? '<section class=\"cn95\"><div style=\"display:flex;justify-content:space-between;align-items:center;gap:8px\"><h3>' + E(title) + '</h3><a class=\"link small\" style=\"cursor:pointer;font-weight:600\" onclick=\"cn2196All()\">See all dates</a></div>' + L.map(item).join('') + '</section>' : '';\n" +
  "  window.cn2196All = function(){ const t = ymd(new Date()), L = CN.filter(x => x.b >= t), by = {};\n" +
  "    L.forEach(x => { const m = new Date(x.a + 'T12:00:00').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }); (by[m] = by[m] || []).push(x); });\n" +
  "    const key = '<div style=\"display:flex;gap:14px;flex-wrap:wrap;font-size:12.5px;color:#4A4566;margin:4px 0 10px\"><span><b style=\"color:#A4402A\">Red</b> China public holiday</span><span><b style=\"color:#4A3FA8\">Purple</b> school exams (about, differs by city)</span><span><b style=\"color:#00626A\">Teal</b> international holiday</span><span><b style=\"color:#4A3FA8\">Dashed</b> China make-up school day</span></div>';\n" +
  "    openSheet('<h1>China dates</h1><div class=\"mute small\">Holidays and school exam seasons in China, so you can plan classes and leave.</div>' + key + Object.keys(by).map(m => '<section class=\"cn95\" style=\"margin-top:10px\"><h3>' + E(m) + '</h3>' + by[m].map(item).join('') + '</section>').join('')); };"],
 ["  const RUN = { 'v-tsched': tsched, 'v-schedule': sched, 'v-today': today };",
  "  function home(v){ if(typeof D === 'undefined' || !D || !D.mgr) return; const old = v.querySelector('.cn95'); if(old) old.remove();\n" +
  "    const L = over(T(), addD(T(), 21)); v.insertAdjacentHTML('beforeend', L.length ? box('Coming up in China', L) : '<section class=\"cn95\"><div style=\"display:flex;justify-content:space-between;align-items:center;gap:8px\"><h3>Coming up in China</h3><a class=\"link small\" style=\"cursor:pointer;font-weight:600\" onclick=\"cn2196All()\">See all dates</a></div><div class=\"it\">Nothing in the next 3 weeks.</div></section>'); }\n" +
  "  const RUN = { 'v-tsched': tsched, 'v-schedule': sched, 'v-today': today, 'v-home': home };"]
]);
