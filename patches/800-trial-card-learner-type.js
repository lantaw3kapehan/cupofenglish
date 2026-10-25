// 800: (Misty) Trials › Will: "will is still showing the old" — the trial card had no way to set the Learner type
//      (it was only in Parent reports), and the PDF button showed blank (white on white).
// · The trial card now starts with "Learner type · sets the roadmap and books on the PDF" (Young learner · Teen · Adult daily ·
//   Adult work · Adult business). It is marked red when not set. Changing it remakes the PDF (same as in Parent reports).
// · The report's main button always shows its label (teal, white text).
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>'); if (i < 0) { console.error('no body'); process.exit(1); }
s = s.slice(0, i) + String.raw`<script>
/* 800 · learner type on the trial card */
(function(){
  if(window.__800 || typeof window.tlGrpBox !== 'function') return; window.__800 = 1;
  document.head.insertAdjacentHTML('beforeend', '<style>.tl4 #tlGrp{margin:0 0 14px;padding:12px 14px;border-radius:14px;border:1px solid #E3E1EC;background:#fff}.tl4 #tlGrp.miss{border:2px solid #E4846B;background:#FFF6F2}' +
    '.tl4 .tl4-r .tl4-a>.btn.tl4-main{background:linear-gradient(135deg,#2BB3AA,#1F8F96)!important;color:#fff!important;border:0!important}.tl4 .tl4-r .tl4-a>.btn.tl4-main:disabled{background:#B9B6C9!important}</style>');
  function fix(){ try{ const t = (typeof TLD !== 'undefined') ? TLD : null, w = document.querySelector('#sheetBody .tl4'); if(!t || !w) return;
    if(!w.querySelector('#tlGrp')){ const o = document.getElementById('tlGrp'); if(o){ o.style.display = ''; w.insertBefore(o, w.firstChild); } else w.insertAdjacentHTML('afterbegin', tlGrpBox(t)); }
    const g = w.querySelector('#tlGrp'); if(g) g.classList.toggle('miss', !t.group);
    const b = w.querySelector('.tl4-r.tl4-w .tl4-a>.btn:first-child'); if(b && !/^Mark as sent|^Already sent/.test(b.textContent.trim())) b.classList.add('tl4-main'); }catch(e){} }
  ['tlBtns', 'tlPaint', 'tlGrp'].forEach(n => { const f0 = window[n]; if(typeof f0 !== 'function') return;
    window[n] = function(){ const r = f0.apply(this, arguments); setTimeout(fix, 30); setTimeout(fix, 400); Promise.resolve(r).then(() => setTimeout(fix, 30)).catch(() => {}); return r; }; });
  new MutationObserver(() => { if(document.querySelector('#sheetBody .tl4') && !document.querySelector('#sheetBody .tl4 #tlGrp')) fix(); }).observe(document.body, { childList: true, subtree: true });
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
