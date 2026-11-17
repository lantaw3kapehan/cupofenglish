// 2327: "Give homework" beside every "Check homework" (class card, My schedule, My students, Schedule pop-up), so teachers never look for it.
const file = process.argv[2];
const inc = `<script id="b2327">
/* 17 Nov · 2327 · Give homework (homework/give.html) next to every Check homework button */
(function(){
  const Q = s => String(s == null ? '' : s).replace(/[\\\\'"<>&]/g, '');
  const nmOf = x => String((x && (x.student || x.name)) || '').replace(/\\s+X$/i, '').trim() || (x && x.code) || '';
  window.hwGive2327 = function(code, nm){ try{ const u = 'homework/give.html?code=' + encodeURIComponent(code || '') + '&n=' + encodeURIComponent(nm || '');
    const w = window.open(u, 'coehw'); if(!w) location.href = u; }catch(e){ toast('Could not open Give homework'); } };
  const btn = (x, cls, style) => '<button type="button" class="' + cls + '"' + (style ? ' style="' + style + '"' : '') + ' title="Make a homework picture with your own task, pictures and a note, then paste it in WeChat" onclick="event.stopPropagation();hwGive2327(\\'' + Q(x.code) + '\\',\\'' + Q(nmOf(x)) + '\\')">Give homework</button>';
  const b1 = window.hwBtn2308; if(b1) window.hwBtn2308 = function(c){ const h = b1(c); return h ? h + btn(c, 'btn ghost sm', 'margin:8px 0 0 6px') : h; };
  const b2 = window.hwStuBtn2310; if(b2) window.hwStuBtn2310 = function(s){ const h = b2(s); return h ? h + ' ' + btn(s, 'btn ghost sm hw2310') : h; };
  const b3 = window.m38Link; if(b3) window.m38Link = function(e){ const h = b3(e); return (h && /hwOpenEv2310/.test(h)) ? h + ' <a class="m38 hw2310" onclick="event.stopPropagation();hwGive2327(\\'' + Q(e.code) + '\\',\\'' + Q(nmOf(e)) + '\\')">Give homework</a>' : h; };
  window.hwGiveCE2327 = function(){ try{ const e = typeof CE !== 'undefined' && CE ? CE.e : null; if(e && e.code) hwGive2327(e.code, nmOf(e)); }catch(x){} };
})();
</script>
`;
require('../tools/lib.js')(file, [
['<script id="b2278">', inc + '<script id="b2278">'],
['`<button type="button" class="btn ghost block" style="margin-top:12px" onclick="hwOpenCE2309()">Check homework</button>`',
 '`<div class="row" style="gap:8px;margin-top:12px"><button type="button" class="btn ghost grow" onclick="hwOpenCE2309()">Check homework</button><button type="button" class="btn ghost grow" onclick="hwGiveCE2327()">Give homework</button></div>`']
]);
