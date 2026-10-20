// 20 Oct · Payroll history: no repeats (this month and last month are already shown above), one "show more" line, a warning on a future month with only deductions.
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + `/* 20 Oct · 466 · Payroll history no longer repeats October (the list above) and September (the "All paid" line above) unless you search.
   The extra "Showing the latest 12 months" note is hidden while "Show more" is there. A month after the current one that has only
   deductions gets a coral note: "filed ahead · check the month in PAYROLL". */
(function(){
  const css = document.createElement('style');
  css.textContent = '#plList .w66{display:inline-block;margin-left:10px;font-size:11.5px;font-weight:700;color:#C0563F;background:#FDF1EE;border-radius:999px;padding:2px 9px}';
  document.head.appendChild(css);
  const MN = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
  const key = t => { const m = String(t || '').match(/([A-Za-z]{3})[a-z]*\\s+(\\d{4})/); return m ? m[2] + '-' + String(MN.indexOf(m[1].toLowerCase()) + 1).padStart(2, '0') : ''; };
  const num = s => { const n = parseFloat(String(s || '').replace(/[^\\d.-]/g, '')); return isNaN(n) ? 0 : n; };
  function run(){ const box = document.getElementById('plList'); if(!box) return; const q = ((document.getElementById('prq') || {}).value || '').trim(); const now = new Date();
    const k0 = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0'), p = new Date(now.getFullYear(), now.getMonth() - 1, 1), k1 = p.getFullYear() + '-' + String(p.getMonth() + 1).padStart(2, '0');
    const above = !!document.getElementById('pyCur');
    const D = [...box.querySelectorAll(':scope > details.py-h')]; let shown = 0;
    D.forEach(d => { const b = d.querySelector('summary b'), k = key(b && b.textContent);
      if(k > k0 && num((d.querySelector('summary .t') || {}).textContent) < 0 && !d.querySelector('.w66') && b) b.insertAdjacentHTML('afterend', '<span class="w66">only deductions · filed ahead? check the month in PAYROLL</span>');
      if(!q && above && (k === k0 || k === k1)){ d.style.display = 'none'; d.dataset.h66 = 1; return; }
      if(d.dataset.h66){ delete d.dataset.h66; } if(d.style.display !== 'none') shown++; });
    const more = box.querySelector('.mo63'); if(more && !q){ const vis = D.filter(d => !d.dataset.h66); vis.forEach((d, i) => d.style.display = i < 4 ? '' : 'none'); const rest = vis.length - 4; if(rest > 0){ more.textContent = 'Show ' + rest + ' more months'; vis[3].after(more); } else more.remove(); }
    box.querySelectorAll(':scope > .small.mute').forEach(n => { n.style.display = box.querySelector('.mo63') ? 'none' : ''; }); }
  ['payLedger', 'payFind', 'renderPayroll', 'pay63More'].forEach(f => { const o = window[f]; if(typeof o === 'function') window[f] = function(){ const r = o.apply(this, arguments); try{ run(); }catch(e){ console.warn('h66', e); } return r; }; });
  try{ run(); }catch(e){}
})();
` + "</script>\n\n</body>"]]);
