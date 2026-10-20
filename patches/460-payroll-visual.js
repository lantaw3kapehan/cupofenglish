// 20 Oct · Payroll: 12-month payroll chart, this month's teachers sorted by pay with bars and the change vs last month.
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + `/* 20 Oct · 460 · Misty: "now let us do and fix the PAYROLL screen".
   · "Payroll · last 12 months" under the dark card: one column per month (total net from the PAYROLL tab), paid months green,
     the month now running teal; the change vs the month before on each; hover for teachers and total.
   · This month's list: sorted by pay (largest first); each row gets a bar (share of the largest) and "Sep ₱20,710 ▲/▼" so a big jump or drop stands out. */
(function(){
  const css = document.createElement('style');
  css.textContent = \`
#v-payroll .pm60{background:#fff;border:1px solid var(--line);border-radius:var(--r-lg);box-shadow:var(--sh1);padding:12px 18px 10px;margin:14px 0}
#v-payroll .pm60 .h{display:flex;justify-content:space-between;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#8A86A0}
#v-payroll .pm60 .cs{display:flex;align-items:flex-end;gap:8px;height:130px;padding-top:22px}
#v-payroll .pm60 .cs>div{flex:1;position:relative;display:flex;align-items:flex-end;height:100%;min-width:0}
#v-payroll .pm60 .cs i{display:block;width:100%;border-radius:4px 4px 0 0;background:#2E9E6F}
#v-payroll .pm60 .cs>div.cur i{background:repeating-linear-gradient(45deg,#00A3AD 0 6px,#33B6BE 6px 12px)}
#v-payroll .pm60 .cs b{position:absolute;left:-6px;right:-6px;text-align:center;font-size:10.5px;color:var(--ink);font-weight:700;white-space:nowrap}
#v-payroll .pm60 .ax{display:flex;gap:8px;font-size:10.5px;color:#8A86A0;margin-top:4px}
#v-payroll .pm60 .ax span{flex:1;text-align:center;min-width:0}
#v-payroll .pm60 .ax em{display:block;font-style:normal;font-weight:700}
#v-payroll .pm60 .lg{display:flex;gap:14px;font-size:11.5px;color:#8A86A0;margin-top:6px}
#v-payroll .pm60 .lg i{display:inline-block;width:10px;height:8px;border-radius:2px;margin-right:5px}
#pyCur .py-row{position:relative}
#pyCur .py-n small.c60{display:flex;align-items:center;gap:8px}
#pyCur .py-n .sb60{display:inline-block;width:120px;height:5px;border-radius:3px;background:var(--soft);overflow:hidden;vertical-align:middle}
#pyCur .py-n .sb60 i{display:block;height:100%;background:#00A3AD;border-radius:3px}
#v-payroll details.py-h{margin:6px 0!important}
#v-payroll details.py-h>summary{padding:10px 16px!important;min-height:0!important}
#v-payroll details.py-h>summary>div br{display:none}
#v-payroll details.py-h>summary>div small{margin-left:10px}
#v-payroll details.py-h>summary .t{font-size:17px!important}
#pyCur .up60{color:#1E8A5E;font-weight:700}#pyCur .dn60{color:#C0563F;font-weight:700}\`;
  document.head.appendChild(css);
  const MN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], MF = ['january','february','march','april','may','june','july','august','september','october','november','december'];
  const num = v => { const n = parseFloat(String(v == null ? '' : v).replace(/[^\\d.-]/g, '')); return isNaN(n) ? 0 : n; };
  const ym = v => { const s = String(v || '').trim(); let m = s.match(/^(\\d{4})-(\\d{2})/); if(m) return m[1] + '-' + m[2]; m = s.match(/([A-Za-z]+)\\s+(\\d{4})/); if(m){ const i = MF.findIndex(x => x.startsWith(m[1].toLowerCase().slice(0, 3))); if(i >= 0) return m[2] + '-' + String(i + 1).padStart(2, '0'); } const d = new Date(s); return isNaN(d) ? '' : d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); };
  function ledger(){ if(typeof PL === 'undefined' || !PL || !PL.rows || !PL.head) return null; const H = PL.head.map(h => String(h || '').trim().toUpperCase()), iN = H.indexOf('TEACHER NAME'), iM = H.indexOf('MONTH'), iNet = H.indexOf('NET SALARY'), iS = H.indexOf('STATUS'); if(iN < 0 || iM < 0 || iNet < 0) return null;
    const by = {}; PL.rows.forEach(r => { const n = String(r[iN] || '').trim(); if(!n) return; const k = ym(r[iM]); if(!k) return; const o = by[k] = by[k] || { k, net: 0, n: 0, paid: 0, T: {} }; o.net += num(r[iNet]); o.n++; if(/paid/i.test(r[iS])) o.paid++; o.T[n.toLowerCase()] = (o.T[n.toLowerCase()] || 0) + num(r[iNet]); }); return by; }
  function chart(v){ if(v.querySelector('.pm60')) return; const by = ledger(); if(!by) return; const now = new Date(), K = []; for(let i = 11; i >= 0; i--){ const d = new Date(now.getFullYear(), now.getMonth() - i, 1); K.push(d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0')); }
    const M = K.map(k => by[k] || { k, net: 0, n: 0, paid: 0 }), first = M.findIndex(m => m.net > 0); if(first < 0) return; const S = M.slice(first), mx = Math.max(1, ...S.map(m => m.net)), cur = K[11];
    const short = n => n >= 1000 ? '₱' + (n / 1000).toFixed(n >= 100000 ? 0 : 1) + 'k' : '₱' + Math.round(n);
    const h = '<section class="pm60"><div class="h"><span>Payroll · last ' + S.length + ' months</span><span>total net · PAYROLL tab</span></div><div class="cs">' +
      S.map(m => '<div class="' + (m.k === cur ? 'cur' : '') + '" title="' + MN[+m.k.slice(5) - 1] + ' ' + m.k.slice(0, 4) + ': ' + peso(m.net) + ' · ' + m.n + ' teachers' + (m.k === cur ? ' · so far' : m.paid === m.n ? ' · all paid' : ' · ' + m.paid + ' paid') + '"><i style="height:' + Math.max(2, m.net / mx * 100) + 'px"></i><b style="bottom:' + (m.net / mx * 100 + 3) + 'px">' + short(m.net) + '</b></div>').join('') + '</div>' +
      '<div class="ax">' + S.map((m, i) => { const p = S[i - 1], d = p && p.net && m.k !== cur ? Math.round((m.net - p.net) / p.net * 100) : null; return '<span>' + MN[+m.k.slice(5) - 1] + (d != null ? '<em class="' + (d >= 0 ? 'up' : 'dn') + '" style="color:' + (d >= 0 ? '#1E8A5E' : '#C0563F') + '">' + (d >= 0 ? '+' : '') + d + '%</em>' : '<em style="color:#00808A">' + (m.k === cur ? 'so far' : '') + '</em>') + '</span>'; }).join('') + '</div>' +
      '<div class="lg"><span><i style="background:#2E9E6F"></i>paid month</span><span><i style="background:#00A3AD"></i>this month so far</span></div></section>';
    const hero = v.querySelector('.py-hero'); if(hero) hero.insertAdjacentHTML('afterend', h); }
  function rows(){ const box = document.getElementById('pyCur'); if(!box || box.dataset.s60 === box.innerHTML.length + '') return; const by = ledger(); const now = new Date(), pk = (() => { const d = new Date(now.getFullYear(), now.getMonth() - 1, 1); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); })(), P = by && by[pk];
    const R = [...box.querySelectorAll('.py-row')]; if(!R.length) return; const val = r => num((r.querySelector('.py-net') || {}).textContent); const mx = Math.max(1, ...R.map(val));
    R.sort((a, b) => val(b) - val(a)).forEach(r => { box.appendChild(r); const sm = r.querySelector('.py-n small'); if(!sm || sm.classList.contains('c60')) return; const nm = ((r.getAttribute('onclick') || '').match(/payslipNow\\('([^']+)'\\)/) || [])[1] || ''; const pv = P && P.T[nm.toLowerCase()];
      sm.classList.add('c60'); sm.innerHTML = '<span class="sb60"><i style="width:' + Math.max(3, val(r) / mx * 100) + '%"></i></span>' + (pv ? MN[+pk.slice(5) - 1] + ' ' + peso(pv) : 'so far this month'); });
    box.dataset.s60 = box.innerHTML.length + ''; }
  function run(){ const v = document.getElementById('v-payroll'); if(!v) return; chart(v); rows(); }
  const _r = window.renderPayroll; if(_r) window.renderPayroll = function(){ const r = _r.apply(this, arguments); try{ run(); }catch(e){ console.warn('pm60', e); } return r; };
  let q = 0; new MutationObserver(() => { if(q) return; q = requestAnimationFrame(() => { q = 0; try{ if(typeof VIEW !== 'undefined' && VIEW === 'payroll') run(); }catch(e){} }); }).observe(document.body, { childList: true, subtree: true });
})();
` + "</script>\n\n</body>"]]);
