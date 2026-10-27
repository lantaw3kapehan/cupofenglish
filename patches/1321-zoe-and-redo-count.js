// 1321: (backlog 5) (a) Parent picture report: the student's name line was 1.15 high — a Chinese name (e.g. 佐伊) drawn in the CJK
//        fallback font sits taller than Fredoka One and lost a few pixels at the bottom of the picture. Name line now 1.32 with a little
//        room below. (b) Monitor › Time-ins "Needs a look": after a redo turns a weak internet result good, the count (and the row in
//        that box) now update at once instead of on the next redraw. Presentation only.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const j = s.lastIndexOf('</body>');
s = s.slice(0, j) + String.raw`<script>
/* 1321 · "Needs a look" recount after a redo (1270 replaces the internet badge in each row) */
(function(){
  if(window.__1321) return; window.__1321 = 1; let q = 0;
  function bad(r){ if(r.classList.contains('bad') || r.querySelector('.ti-in.ti2-over') || /Not on app/.test(r.textContent)) return true;
    return [].some.call(r.querySelectorAll('.ti-q.weak, .ti-q.bad'), x => x.style.display !== 'none'); }
  function run(){ q = 0; try{ const v = document.getElementById('v-team'), h = v && v.querySelector('.t13h'), box = h && h.nextElementSibling; if(!box || !box.classList.contains('t13-look')) return;
    const rows = [...box.querySelectorAll('.ti-r')], n = rows.filter(bad).length, sp = h.querySelector('span'); if(!sp) return;
    const t = n + ' teacher' + (n === 1 ? '' : 's') + ' · late, missing, not on the app or weak internet' + (rows.length > n ? ' · ' + (rows.length - n) + ' re-checked OK' : '');
    if(sp.textContent !== t) sp.textContent = t; rows.forEach(r => { const ok = !bad(r); if(r.classList.contains('ok1321') !== ok) r.classList.toggle('ok1321', ok); }); }catch(e){} }
  const mo = new MutationObserver(ms => { if(q) return; if(!ms.some(m => [].some.call(m.addedNodes, n => n.nodeType === 1 && (n.classList.contains('wc-x') || n.querySelector && n.querySelector('.wc-x'))))) return; q = 1; queueMicrotask(run); });
  (function w(){ const v = document.getElementById('v-team'); if(v) mo.observe(v, { childList: true, subtree: true }); else setTimeout(w, 1500); })();
  const st = document.createElement('style'); st.textContent = '#v-team .t13-look .ti-r.ok1321{opacity:.7}'; document.head.appendChild(st);
})();
</script>
` + s.slice(j);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, [
  ["<div style=\"font:400 64px ' + B + ';color:#2B2253;line-height:1.15;margin-top:8px\">' + E(x.student) + '</div>';",
   "<div style=\"font:400 64px ' + B + ';color:#2B2253;line-height:1.32;margin-top:6px;padding-bottom:4px\">' + E(x.student) + '</div>';"]]);
