// 2056 (10 Nov 11:52, Misty: "yes do all 1-5 now"), after the final QA (2053–2055). Display only; no data or saves change.
//   1 · One count for renewals: To do's Renewals list counts the students to remind (not Renewing / Not renewing / Renewed), the
//       same as its tile and Overview's "Renewals to act on now"; Overview's Packages card counts the same students as
//       Students › "5 or fewer left" (it read ACTIVE ticks before: 18 + 1 ran out vs 21).
//   2 · To do tiles = the rows in their own list (Trial follow-ups 2 vs 1, Renewals 13 vs 16 before).
//   3 · Overview Business keeps the four profit figures; the monthly profit chart is on Finance › Overview only.
//   4 · Teacher Today (laptop): the red "management is waiting" line repeated Needs your action → hidden on laptops (phones keep it,
//       Needs your action is further down there).
//   5 · Menu Finance opens Finance › Overview again (the 823 fix stopped working when menu items became links); Monitor's table
//       leaves out teachers with no classes and no time-in that day; dates as "13 Oct 2026", "12 Oct", "Mon 9 Nov".
const file = process.argv[2];
require('../tools/lib.js')(file, [
[
"const items = sec => sec.querySelectorAll('.tdr,.tdl,.li').length;",
"const items = sec => sec.querySelectorAll(sec.id === 'td-renew' ? '.tdr:not(.yes):not(.closed):not(.done)' : '.tdr,.tdl,.li').length;   /* 2056: Renewals counts only the ones to remind (same as the tile and Overview) */"
],
[
"const out = S.filter(s => s.left != null && s.left <= 0).length, low = S.filter(s => s.left != null && s.left > 0 && s.left <= 5).length, ok = n - out - low;\n        const rh = $('rnHome')",
"const PS2056 = (typeof MS !== 'undefined' && Array.isArray(MS) && MS.length) ? MS : S;   /* 2056: the same students as Students › 5 or fewer left */\n        const out = PS2056.filter(s => s.left != null && s.left <= 0).length, low = PS2056.filter(s => s.left != null && s.left > 0 && s.left <= 5).length, ok = PS2056.length - out - low;\n        const rh = $('rnHome')"
],
[
"Math.round(ok / tot * 100) + '%', 'healthy')",
"Math.round(ok / (PS2056.length || 1) * 100) + '%', 'healthy')"
],
[
"document.querySelectorAll('nav button[data-v=\"payroll\"]')",
"document.querySelectorAll('nav [data-v=\"payroll\"], #navIn [data-v=\"payroll\"]')"
],
[
"board(T) : '')",
"board(T.filter(t => M.who || (t.classes || []).some(c => !c.cancelled) || t.timeIn)) : '')"
],
[
"${e.obsDate?' · '+esc(e.obsDate):''}",
"${e.obsDate?' · '+esc((d => { const t = Date.parse(d); return isNaN(t) ? d : new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); })(e.obsDate)):''}"
],
[
"From Management\\'s class visit (' + esc(v.date) + '):</b>",
"From Management\\'s class visit (' + esc((d => { const t = Date.parse(String(d) + (/^\\d{4}-\\d{2}-\\d{2}$/.test(String(d)) ? 'T12:00:00' : '')); return isNaN(t) ? d : new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); })(v.date)) + '):</b>"
],
[
"dl = new Date(String(V.day) + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })",
"dl = new Date(String(V.day) + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })"
],
[
" 课时，不计入已上课时，仍保留在课程包中。</div>'; };\n})();\n</script>\n</body>",
" 课时，不计入已上课时，仍保留在课程包中。</div>'; };\n})();\n</script>\n<style id=\"st2056\">/* 2056: Overview keeps the profit figures, the monthly chart is in Finance › Overview; teacher Today on a laptop shows the waiting message once (Needs your action) */\n#v-home details.t1000,#v-home .bz2-h,#v-home .bz2-ch,#v-home .bz2-y,#v-home .bz2-def{display:none!important}\n@media(min-width:900px){#urg2001{display:none!important}}</style>\n<script>\n/* 2056 (10 Nov, Misty: \"do all 1-5\"): on To do each tile shows the number of rows in its own list that need action\n   (Renewals: not counting Renewing, Not renewing or Renewed; Trial follow-ups: the rows listed), so tile, list and Overview agree. */\n(function(){\n  const cnt = s => s.querySelectorAll(s.id === 'td-renew' ? '.tdr:not(.yes):not(.closed):not(.done)' : '.tdr,.tdl').length;\n  function sync(){ try{ const v = document.getElementById('v-mtoday'); if(!v) return;\n    v.querySelectorAll('.tdsum a').forEach(a => { const m = (a.getAttribute('onclick') || '').match(/tdJump\\('(renew|follow)'\\)/); if(!m) return;\n      const sec = v.querySelector('#td-' + m[1]), b = a.querySelector('b.num'); if(!b) return; const c = String(sec ? cnt(sec) : 0); if(b.textContent !== c) b.textContent = c; }); }catch(e){} }\n  const r = window.renderMToday; if(typeof r === 'function') window.renderMToday = function(){ const x = r.apply(this, arguments); sync(); return x; };\n  /* the menu's Finance opens Finance › Overview (the tabs inside Finance still open Payroll) */\n  const g0 = window.go; if(typeof g0 === 'function') window.go = function(v){ try{ const ev = window.event; if(v === 'payroll' && ev && ev.type === 'click' && ev.target && ev.target.closest && ev.target.closest('#navIn [data-v=\"payroll\"], nav [data-v=\"payroll\"]')) v = 'finov'; }catch(e){} return g0.apply(this, [v].concat([].slice.call(arguments, 1))); };\n})();\n</script>\n</body>"
]
]);
