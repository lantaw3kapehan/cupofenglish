// 20 Oct · Pay (teachers) and My pay (Celine): coloured tiles, on-pace estimate, month-progress bar, pay-by-month chart.
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + `/* 20 Oct · 470 · Misty: "can we also improve the Pay screen on the teacher's end and Celine's end?"
   · The three tiles get a coloured edge and label (units teal · bonus green · deductions coral).
   · Under the estimate: a bar of the month passing ("day 20 of 31") and "on pace for about ₱20,700 · September ₱18,180 ▲".
   · "Pay by month": a column per month from the history (net, paid green · this month teal), newest on the right; tap a column for that payslip.
   The history table stays below, as before. */
(function(){
  const css = document.createElement('style');
  css.textContent = \`
#v-pay .stats .stat,#v-mypay .stats .stat{border-left:4px solid var(--c70)!important;padding:10px 16px!important;min-height:0!important;box-shadow:none!important}
#v-pay .stats .stat:before,#v-pay .stats .stat:after,#v-mypay .stats .stat:before,#v-mypay .stats .stat:after{display:none!important}
#v-pay .stats .stat:nth-child(1),#v-mypay .stats .stat:nth-child(1){--c70:#00A3AD;background:#EEF8F9!important}
#v-pay .stats .stat:nth-child(2),#v-mypay .stats .stat:nth-child(2){--c70:#2E9E6F;background:#EEF8F3!important}
#v-pay .stats .stat:nth-child(3),#v-mypay .stats .stat:nth-child(3){--c70:#D4705A;background:#FDF1EE!important}
.pc70{margin-top:12px}
.pc70 .bar{position:relative;height:8px;border-radius:4px;background:var(--soft);overflow:hidden}
.pc70 .bar i{position:absolute;left:0;top:0;bottom:0;background:linear-gradient(90deg,#9ED9DD,#00A3AD);border-radius:4px}
.pc70 .t{display:flex;justify-content:space-between;flex-wrap:wrap;gap:4px 12px;font-size:12.5px;color:#55526E;margin-top:6px}
.pc70 .t b{color:var(--ink)}.pc70 .up{color:#1E8A5E;font-weight:700}.pc70 .dn{color:#C0563F;font-weight:700}
.pm70{background:#fff;border:1px solid var(--line);border-radius:var(--r-lg);padding:12px 18px 10px;margin-top:14px}
.pm70 .h{display:flex;justify-content:space-between;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#8A86A0}
.pm70 .cs{display:flex;align-items:flex-end;gap:10px;height:130px;padding-top:20px}
.pm70 .cs>div{flex:1;position:relative;display:flex;align-items:flex-end;height:100%;cursor:pointer;max-width:70px}
.pm70 .cs i{display:block;width:100%;border-radius:5px 5px 0 0;background:#2E9E6F}
.pm70 .cs>div.cur i{background:repeating-linear-gradient(45deg,#00A3AD 0 6px,#33B6BE 6px 12px)}
.pm70 .cs>div.pd i{background:#E0A030}
.pm70 .cs>div:hover i{filter:brightness(1.08)}
.pm70 .cs b{position:absolute;left:-8px;right:-8px;text-align:center;font-size:10.5px;color:var(--ink);white-space:nowrap}
.pm70 .ax{display:flex;gap:10px;font-size:11px;color:#8A86A0;margin-top:4px}.pm70 .ax span{flex:1;text-align:center;max-width:70px}
.pm70 .lg{display:flex;gap:14px;font-size:11.5px;color:#8A86A0;margin-top:6px}.pm70 .lg i{display:inline-block;width:10px;height:8px;border-radius:2px;margin-right:5px}\`;
  document.head.appendChild(css);
  const MF = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'], MN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const num = v => { const n = parseFloat(String(v == null ? '' : v).replace(/[^\\d.-]/g, '')); return isNaN(n) ? 0 : n; };
  const ym = x => { const s = String((x && (x.m || x.month)) || ''); let m = s.match(/^(\\d{4})-(\\d{2})/); if(m) return m[1] + '-' + m[2]; m = s.match(/([A-Za-z]{3})[a-z]*\\s+(\\d{4})/); return m ? m[2] + '-' + String(MF.indexOf(m[1].toLowerCase()) + 1).padStart(2, '0') : ''; };
  const now = new Date(), k0 = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0'), dim = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  window.pay70 = function(i, w){ const L = w === 'm' ? ((typeof MYP !== 'undefined' && MYP && MYP.pay) || []) : ((D && D.pay) || []); const x = L[i]; if(x && typeof paySheet === 'function') paySheet(x); };
  function chart(L, w){ const R = L.map((x, i) => ({ x, i, k: ym(x) })).filter(o => o.k).sort((a, b) => a.k.localeCompare(b.k)).slice(-8); if(R.length < 2) return '';
    const mx = Math.max(1, ...R.map(o => num(o.x.net))), sh = n => n >= 1000 ? '₱' + (n / 1000).toFixed(1) + 'k' : '₱' + Math.round(n);
    return '<section class="pm70"><div class="h"><span>Pay by month</span><span>net · tap a month for the payslip</span></div><div class="cs">' +
      R.map(o => { const v = num(o.x.net), paid = /paid/i.test(o.x.status || '') || o.x.paid === true; return '<div class="' + (o.k === k0 ? 'cur' : paid ? '' : 'pd') + '" onclick="pay70(' + o.i + ',\\'' + w + '\\')" title="' + esc(o.x.month || o.k) + ' · ' + peso(v) + '"><i style="height:' + Math.max(2, v / mx * 100) + 'px"></i><b style="bottom:' + (v / mx * 100 + 3) + 'px">' + sh(v) + '</b></div>'; }).join('') +
      '</div><div class="ax">' + R.map(o => '<span>' + MN[+o.k.slice(5) - 1] + '</span>').join('') + '</div><div class="lg"><span><i style="background:#2E9E6F"></i>paid</span><span><i style="background:#E0A030"></i>pending</span><span><i style="background:#00A3AD"></i>this month so far</span></div></section>'; }
  function pace(card, so, L){ if(!card || card.querySelector('.pc70')) return; const d = now.getDate(), p = Math.round(so / Math.max(1, d) * dim / 10) * 10;
    const prev = L.map(x => ({ x, k: ym(x) })).filter(o => o.k && o.k < k0).sort((a, b) => b.k.localeCompare(a.k))[0], pv = prev ? num(prev.x.net) : 0;
    card.insertAdjacentHTML('beforeend', '<div class="pc70"><div class="bar"><i style="width:' + (d / dim * 100) + '%"></i></div><div class="t"><span>day <b>' + d + '</b> of ' + dim + '</span><span>on pace for about <b>' + peso(p) + '</b>' + (pv ? ' · ' + esc(String(prev.x.month || '').split(' ')[0]) + ' ' + peso(pv) + ' <span class="' + (p >= pv ? 'up' : 'dn') + '">' + (p >= pv ? '▲' : '▼') + '</span>' : '') + '</span></div></div>'); }
  function teacher(){ const v = document.getElementById('v-pay'); if(!v || !D || !D.me) return; const card = v.querySelector('.card'); const me = D.me, so = nowPayOf(me) + (me.monthBonus || 0) - (me.monthDeduct || 0);
    pace(card, so, D.pay || []); if(!v.querySelector('.pm70')){ const h = [...v.querySelectorAll('h2')].find(x => /^History/.test(x.textContent.trim())); const c = chart(D.pay || [], 't'); if(h && c) h.insertAdjacentHTML('beforebegin', c); } }
  function mine(){ const v = document.getElementById('v-mypay'); if(!v || typeof MYP === 'undefined' || !MYP || !MYP.pay) return; const card = v.querySelector('.card'), cur = MYP.pay.find(x => x.m === MYP.month);
    if(cur) pace(card, num(cur.net), MYP.pay.filter(x => x !== cur)); if(!v.querySelector('.pm70')){ const h = [...v.querySelectorAll('h2')].find(x => /^History/.test(x.textContent.trim())); const c = chart(MYP.pay, 'm'); if(h && c) h.insertAdjacentHTML('beforebegin', c); } }
  const _a = window.renderPay; if(_a) window.renderPay = function(){ const r = _a.apply(this, arguments); try{ teacher(); }catch(e){ console.warn('p70', e); } return r; };
  const _b = window.renderMyPay; if(_b) window.renderMyPay = function(){ const r = _b.apply(this, arguments); try{ mine(); }catch(e){ console.warn('p70m', e); } return r; };
})();
` + "</script>\n\n</body>"]]);
