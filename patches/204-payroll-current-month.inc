/* 15 Oct night · Payroll: once last month's pay is all paid, it folds down and the month now running (from the PAYROLL tab,
   e.g. October so far) comes to the top — in the dark card and as its own list. Last month stays one tap away. */
(function(){
  const css = `
.py-cur .py-row{grid-template-columns:44px minmax(0,1.4fr) 140px 150px!important}
.py-cur .py-row .py-av{background:#7B6FC9}
.py-cur .neg{color:var(--red)}
.py-done{background:#fff;border:1px solid rgba(236,234,241,.9);border-radius:20px;box-shadow:var(--sh1);margin-top:18px;overflow:hidden}
.py-done>summary{display:flex;align-items:center;gap:12px;padding:16px 18px;cursor:pointer;list-style:none}
.py-done>summary::-webkit-details-marker{display:none}
.py-done>summary b{font-family:var(--brand);font-weight:400;font-size:18px;color:var(--ink)}
.py-done>summary .chev{margin-left:auto;color:#A3A0B5;transition:transform .2s;font-size:18px}
.py-done[open]>summary .chev{transform:rotate(90deg)}
.py-done .py-list{border:0;border-radius:0;box-shadow:none;border-top:1px solid #F1F0F5}
.py-done .py-nudge{padding:0 18px 14px}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  const T = s => String(s == null ? '' : s).trim(), num = v => { const n = parseFloat(String(v || '').replace(/[^\d.\-]/g, '')); return isNaN(n) ? 0 : n; };
  const qv = () => ($('prq') && $('prq').value || '').trim().toLowerCase();
  function curRows(){
    if(!PL || !PL.rows) return null; const H = PL.head, c = k => H.findIndex(h => T(h).toUpperCase() === k);
    const iN = c('TEACHER NAME'), iM = c('MONTH'), iNet = c('NET SALARY'), iS = c('STATUS'); if(iN < 0 || iM < 0) return null;
    const label = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const rows = PL.rows.filter(r => T(r[iN]) && plMonth(r[iM]) === label).map(r => ({ name: T(r[iN]), net: num(r[iNet]), st: T(r[iS]) || 'Pending', paid: /paid/i.test(r[iS]) }));
    return rows.length ? { label, rows } : null;
  }
  function paintCur(){ const box = $('pyCur'), C = curRows(); if(!box || !C) return; const q = qv();
    const L = C.rows.filter(x => !q || x.name.toLowerCase().includes(q));
    box.innerHTML = L.map(x => `<div class="py-row" onclick="payslipNow('${esc(x.name)}')" title="Open ${esc(x.name)}'s payslip"><span class="py-av">${esc(x.name.slice(0, 2).toUpperCase())}</span><div class="py-n"><b>${esc(tName(x.name))}</b><small>so far this month</small></div><span class="py-net ${x.net < 0 ? 'neg' : ''}">${peso(x.net)}</span><div class="py-st"><span class="${x.paid ? 'paid' : 'wait'}">${esc(x.paid ? '✓ Paid' : x.st)}</span></div></div>`).join('')
      || `<div class="py-empty">${q ? 'No teacher matches “' + esc(q) + '” this month' : 'Nothing yet this month'}</div>`; }
  // the payslip opens on this month (not last month's pay)
  window.payslipNow = function(name){ payslip(name); const C = curRows(); if(!C) return; let n = 0;
    const t = setInterval(() => { const s = $('psP'); if(s || ++n > 30){ clearInterval(t); if(!s) return;
      const o = [...s.options].find(o => plMonth(o.value) === C.label || plMonth(o.textContent) === C.label); if(o && s.value !== o.value){ s.value = o.value; try{ psPre(); }catch(e){} } } }, 100); };
  const _r = window.renderPayroll;
  window.renderPayroll = function(){
    const r = _r.apply(this, arguments);
    try{
      const P = (MO && MO.payroll) || [], C = curRows(), v = $('v-payroll'); if(!v || !P.length || !C || P.some(x => !x.paid)) return r;
      const tot = C.rows.reduce((a, x) => a + x.net, 0), last = P.reduce((a, x) => a + x.net, 0), pm = esc((MO && MO.payMonth) || 'Last month');
      const hero = v.querySelector('.py-hero');
      if(hero) hero.innerHTML = `<img class="py-cup" src="${esc(ovCup())}" alt=""><div class="r1"><span>${esc(C.label)} · so far</span></div><div class="big">${peso(tot)}</div>
        <div class="bs">${C.rows.length} teacher${C.rows.length === 1 ? '' : 's'} · the month is still running · paid out after month end</div>
        <div class="py-3"><div><span>${pm}</span><b>${peso(last)}</b><small>all ${P.length} paid ✓</small></div>
        <div><span>${esc(C.label.split(' ')[0])} pending</span><b>${C.rows.filter(x => !x.paid).length}</b><small>teacher${C.rows.filter(x => !x.paid).length === 1 ? '' : 's'} so far</small></div>
        <div><span>Largest so far</span><b>${(() => { const m = C.rows.slice().sort((a, b) => b.net - a.net)[0]; return m ? peso(m.net) : '—'; })()}</b><small>${(() => { const m = C.rows.slice().sort((a, b) => b.net - a.net)[0]; return m ? esc(tName(m.name)) : ''; })()}</small></div></div>`;
      // last month (all paid) folds into one line under the month now running
      const cap = v.querySelector('#pyRows') && v.querySelector('#pyRows').previousElementSibling, rows = v.querySelector('#pyRows'), nudge = rows && rows.nextElementSibling && rows.nextElementSibling.classList.contains('py-nudge') ? rows.nextElementSibling : null;
      if(cap && rows){
        const d = document.createElement('details'); d.className = 'py-done';
        d.innerHTML = `<summary><b>${pm}</b><span class="py-pill ok">All paid ✓</span><span class="small mute">${peso(last)} · ${P.length} teachers · tap to see each payslip</span><span class="chev">›</span></summary>`;
        cap.insertAdjacentHTML('beforebegin', `<div class="py-cap"><h3>${esc(C.label)}</h3><span>so far · tap a teacher for the payslip</span></div><div class="py-list py-cur" id="pyCur"></div>`);
        cap.replaceWith(d); d.appendChild(rows); if(nudge) d.appendChild(nudge);
        paintCur();
      }
    }catch(e){ console.warn('payroll current month', e); }
    return r;
  };
  const _f = window.payFind; window.payFind = function(){ const r = _f.apply(this, arguments); try{ paintCur(); const d = document.querySelector('.py-done'); if(d && qv()) d.open = true; }catch(e){} return r; };
  try{ if(VIEW === 'payroll') renderPayroll(); }catch(e){}
})();
