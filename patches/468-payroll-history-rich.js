// 20 Oct · Payroll history months: the bar is split by teacher (who was paid, how much), change vs the month before, the highest month marked.
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + `/* 20 Oct · 468 · Misty: "this part is bland".
   Each month's bar is now made of its teachers: one segment per teacher, sized by their pay (hover: name and amount), the 3 largest
   labelled inside; a ▲/▼ % chip vs the month before; ★ on the highest month; the "filed ahead" note sits neatly under the month name. */
(function(){
  const css = document.createElement('style');
  css.textContent = \`
#plList details.py-h>summary{grid-template-columns:minmax(170px,230px) minmax(0,1fr) 90px 140px 130px 16px!important}
#plList .hb62{height:22px!important;border-radius:6px!important;display:flex;gap:2px;background:transparent!important;overflow:hidden}
#plList .hb62>i{display:none!important}
#plList .hb62 .sg{display:block;height:100%;border-radius:3px;font-style:normal;font-size:10.5px;font-weight:700;color:#fff;overflow:hidden;white-space:nowrap;padding:0 5px;line-height:22px;text-overflow:clip}
#plList .hb62 .rest{flex:1;background:var(--soft);border-radius:3px}
#plList .dl68{font-size:12px;font-weight:700;text-align:right;white-space:nowrap}
#plList .dl68.up{color:#1E8A5E}#plList .dl68.dn{color:#C0563F}
#plList .st68{display:inline-block;margin-left:8px;font-size:11px;font-weight:700;color:#9A6A10;background:#FCF1DC;border-radius:999px;padding:1px 8px;vertical-align:2px}
#plList .w66{display:block!important;margin:4px 0 0!important;width:max-content;max-width:100%;padding:2px 9px!important;font-size:11px!important;line-height:1.4}
#plList details.py-h>summary>div:first-child small{display:inline!important;margin-left:8px}\`;
  document.head.appendChild(css);
  const C = ['#00A3AD', '#2E9E6F', '#6C5FC7', '#3B82B5', '#D9962B', '#C2557A', '#4A9BAA', '#8A6FD1', '#5BB08A', '#E07A5F'];
  const num = s => { const n = parseFloat(String(s || '').replace(/[^\\d.-]/g, '')); return isNaN(n) ? 0 : n; };
  const MN = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
  const key = t => { const m = String(t || '').match(/([A-Za-z]{3})[a-z]*\\s+(\\d{4})/); return m ? m[2] + '-' + String(MN.indexOf(m[1].toLowerCase()) + 1).padStart(2, '0') : ''; };
  const col = {}; let ci = 0; const cOf = n => col[n] || (col[n] = C[ci++ % C.length]);
  function run(){ const box = document.getElementById('plList'); if(!box) return; const D = [...box.querySelectorAll(':scope > details.py-h')]; if(!D.length) return;
    const info = D.map(d => { const R = [...d.querySelectorAll('table tr')].map(tr => { const td = tr.querySelectorAll('td'); return td.length >= 2 ? { n: td[0].textContent.trim(), v: num(td[1].textContent) } : null; }).filter(Boolean);
      return { d, k: key((d.querySelector('summary b') || {}).textContent), R, t: num((d.querySelector('summary .t') || {}).textContent) }; });
    const mx = Math.max(1, ...info.map(x => x.t)), byK = {}; info.forEach(x => byK[x.k] = x.t);
    const hi = info.filter(x => x.t > 0).sort((a, b) => b.t - a.t)[0];
    info.forEach(x => { const bar = x.d.querySelector('.hb62'); if(!bar || bar.dataset.r68) return; bar.dataset.r68 = 1;
      const P = x.R.filter(r => r.v > 0).sort((a, b) => b.v - a.v), top = P.slice(0, 3).map(r => r.n);
      if(x.t > 0) bar.innerHTML = P.map(r => '<span class="sg" style="flex:0 0 ' + (r.v / mx * 100) + '%;background:' + cOf(r.n.toLowerCase()) + '" title="' + esc(r.n) + ' · ' + peso(r.v) + '">' + (top.includes(r.n) && r.v / mx > .07 ? esc(r.n) : '') + '</span>').join('') + '<span class="rest"></span>';
      const [y, m] = x.k.split('-').map(Number), pk = new Date(y, m - 2, 1), pv = byK[pk.getFullYear() + '-' + String(pk.getMonth() + 1).padStart(2, '0')];
      const s = x.d.querySelector('summary'), pill = s && s.querySelector('.s');
      if(pill && !s.querySelector('.dl68')){ let h = ''; if(pv > 0 && x.t > 0){ const d = Math.round((x.t - pv) / pv * 100); h = '<span class="dl68 ' + (d >= 0 ? 'up' : 'dn') + '" title="vs the month before: ' + peso(pv) + '">' + (d >= 0 ? '▲ ' : '▼ ') + Math.abs(d) + '%</span>'; } else h = '<span class="dl68"></span>'; pill.insertAdjacentHTML('beforebegin', h); }
      if(hi && x === hi){ const b = s.querySelector('b'); if(b && !s.querySelector('.st68')) b.insertAdjacentHTML('afterend', '<span class="st68">★ highest</span>'); } }); }
  ['payLedger', 'payFind', 'pay63More'].forEach(f => { const o = window[f]; if(typeof o === 'function') window[f] = function(){ const r = o.apply(this, arguments); try{ run(); }catch(e){ console.warn('r68', e); } return r; }; });
  try{ run(); }catch(e){}
})();
` + "</script>\n\n</body>"]]);
