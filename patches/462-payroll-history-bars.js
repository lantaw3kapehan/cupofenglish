// 20 Oct · Payroll history: each month line gets a bar of its total (largest month = full), teachers as a small count, so the trend reads at a glance.
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + `/* 20 Oct · 462 · Misty: "better improve the visual through graphs or charts" (Payroll history list). */
(function(){
  const css = document.createElement('style');
  css.textContent = \`
#v-payroll details.py-h>summary{display:grid!important;grid-template-columns:minmax(170px,240px) minmax(0,1fr) 150px 130px 16px!important;align-items:center;gap:14px}
#v-payroll details.py-h .hb62{height:10px;border-radius:5px;background:var(--soft);overflow:hidden;position:relative}
#v-payroll details.py-h .hb62 i{display:block;height:100%;border-radius:5px;background:#2E9E6F}
#v-payroll details.py-h .hb62 i.pd{background:repeating-linear-gradient(45deg,#E0A030 0 6px,#EDB95A 6px 12px)}
#v-payroll details.py-h .hb62 i.ng{background:#D4705A}
#v-payroll details.py-h>summary .s{text-align:right}#v-payroll details.py-h>summary .t{text-align:right}\n#v-payroll details.py-h .hb62 u{position:absolute;top:-3px;bottom:-3px;width:2px;background:#2B2253;opacity:.35;text-decoration:none}
@media(max-width:760px){#v-payroll details.py-h>summary{grid-template-columns:1fr auto 16px!important}#v-payroll details.py-h .hb62,#v-payroll details.py-h>summary .s{display:none}}\`;
  document.head.appendChild(css);
  const num = s => { const n = parseFloat(String(s || '').replace(/[^\\d.-]/g, '')); return isNaN(n) ? 0 : n; };
  function run(){ const box = document.getElementById('plList'); if(!box) return; const D = [...box.querySelectorAll('details.py-h')]; if(!D.length || D.every(d => d.querySelector('.hb62'))) return;
    const V = D.map(d => num((d.querySelector('summary .t') || {}).textContent)), mx = Math.max(1, ...V.map(Math.abs)), P = V.filter(v => v > 0), avg = P.length ? P.reduce((a, b) => a + b, 0) / P.length : 0;
    D.forEach((d, i) => { if(d.querySelector('.hb62')) return; const s = d.querySelector('summary'), first = s && s.firstElementChild; if(!first) return; const v = V[i], all = /All paid/.test(s.textContent);
      first.insertAdjacentHTML('afterend', '<span class="hb62" title="' + (v < 0 ? 'only deductions so far' : Math.round(v / mx * 100) + '% of the largest month') + '"><i class="' + (v < 0 ? 'ng' : all ? '' : 'pd') + '" style="width:' + Math.max(2, Math.abs(v) / mx * 100) + '%"></i>' + (avg ? '<u style="left:' + (avg / mx * 100) + '%" title="average month"></u>' : '') + '</span>'); }); }
  const _l = window.payLedger; if(_l) window.payLedger = function(){ const r = _l.apply(this, arguments); try{ run(); }catch(e){ console.warn('hb62', e); } return r; };
  try{ run(); }catch(e){}
})();
` + "</script>\n\n</body>"]]);
