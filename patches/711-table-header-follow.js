// 711: (Misty) Trainings table: the book/training headers stay in view while scrolling the page (they followed only the table's own scroll).
require('../tools/lib.js')(process.argv[2], [
[".tx-tb thead th{position:sticky;", ".tx-tb thead th{transform:translateY(var(--hy,0px));position:sticky;"],
], );
const fs = require('fs'), f = process.argv[2]; let s = fs.readFileSync(f, 'utf8');
const js = `<script>
/* 711: Trainings table headers follow the page scroll (below the app's top bar) */
(function(){ let q = 0;
  function bar(){ const n = document.getElementById('hName'); let el = n; while(el && el !== document.body){ const p = getComputedStyle(el).position; if(p === 'fixed' || p === 'sticky') return el.getBoundingClientRect().bottom; el = el.parentElement; } return 0; }
  function run(){ q = 0; const T = document.querySelectorAll('.tx-tb'); if(!T.length) return; const top = bar();
    T.forEach(t => { const r = t.getBoundingClientRect(), th = t.querySelector('thead'); if(!th) return; const hh = th.getBoundingClientRect().height;
      const dy = Math.max(0, Math.min(top - r.top, r.height - hh - 40)); t.style.setProperty('--hy', (dy > 0 ? Math.round(dy) : 0) + 'px'); }); }
  window.addEventListener('scroll', () => { if(!q) q = requestAnimationFrame(run); }, { passive: true });
  document.addEventListener('scroll', e => { if(e.target && e.target.classList && e.target.classList.contains('tx-tb') && !q) q = requestAnimationFrame(run); }, { passive: true, capture: true });
})();
</script>`;
const i = s.lastIndexOf('</body>'); s = s.slice(0, i) + js + '\n' + s.slice(i); fs.writeFileSync(f, s);
