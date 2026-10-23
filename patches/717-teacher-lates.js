// 717: (Misty) Punctuality is part of what is expected of teachers: each teacher sees their late time-ins / late to class (last 40 days)
// on Pay, with the decision and the POLICY amount. A late not decided yet shows "Pending · −₱X unless excused by <24 h>" (it becomes
// Unexcused automatically after 24 h — Apps Script autoLateUnexcused). Today shows a short notice while one is pending.
require('../tools/lib.js')(process.argv[2], [
["  window.trView = async function(name){", `  /* 717: my late time-ins */
  let LT = null, LTT = 0;
  async function loadLates(){ try{ const r = await call('lates'); if(r && r.ok){ LT = r; LTT = Date.now(); paintLates(); } }catch(x){} }
  function ltAmt(kind){ const rk = (typeof D !== 'undefined' && D && D.me && D.me.rank) || '', tier = /newly hired|starting/i.test(rk) ? 'New' : 'Regular', subj = kind === 'Late' ? 'Teacher Late Time-in' : 'Teacher Late to Class';
    const p = ((LT && LT.policy) || []).find(x => x.subject === subj && x.condition === 'Unexcused' && (x.tier === tier || x.tier === 'All')); return p ? p.amount : 0; }
  function ltHtml(full){ const R = (LT && LT.rows) || []; if(!R.length) return '';
    const pend = R.filter(r => !/^(Waived|Excused|Unexcused)/.test(r.note)), M = ((typeof D !== 'undefined' && D && D.me && D.me.rank) || '');
    const due = r => { const t = Date.parse(r.at + '+08:00') + 864e5; return new Date(t).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Manila' }); };
    const row = r => { const dec = String(r.note).split(' · '), d0 = dec[0], amt = (String(r.note).match(/₱\\s?([\\d,]+)/) || [])[1];
      const st = !d0 || !/^(Waived|Excused|Unexcused)$/.test(d0) ? '<b class="lt-p">Pending · −₱' + ltAmt(r.kind) + ' unless excused by ' + e(due(r)) + '</b>' : d0 === 'Waived' ? '<b class="lt-w">Waived</b>' : '<b class="lt-d">' + e(d0) + (amt ? ' · −₱' + e(amt) : '') + '</b>';
      return '<div class="lt-it"><span class="grow"><b>' + e(r.kind === 'Late' ? 'Late time-in' : 'Late to class') + '</b> · ' + (Math.abs(+r.mins) || '') + (r.mins !== '' ? ' min' : '') + '<small>' + e(fmtD(r.day)) + ' · ' + e(String(r.at).slice(11, 16)) + (r.first ? ' · class ' + e(String(r.first).slice(11, 16)) : '') + '</small></span>' + st + '</div>'; };
    if(!full) return pend.length ? '<div id="txLate" class="lt-bn"><b>Late time-in pending review</b> · ' + pend.map(r => e(fmtD(r.day))).join(', ') + ' · −₱' + ltAmt(pend[0].kind) + ' unless management excuses it within 24 hours (policy). <a class="link" onclick="go(\\'pay\\')">Details</a></div>' : '';
    return '<section id="txLate" class="sec lt"><h2>Punctuality <span class="c">late time-ins · last 40 days · POLICY</span></h2>' + R.map(row).join('')
      + '<div class="small mute" style="margin-top:8px">On time = timed in before your first class, and "I\\'m in" before each class. A late not excused or waived within 24 hours becomes Unexcused (−₱' + ltAmt('Late') + ' ' + (/newly hired|starting/i.test(M) ? 'New' : 'Regular') + ' rate).</div></section>'; }
  function ltPut(id, full){ const v = $(id); if(!v) return; const h = ltHtml(full), c = v.querySelector('#txLate');
    if(!h){ if(c) c.remove(); return; } if(c && c._h === h) return; if(c) c.remove();
    const w = document.createElement('div'); w.innerHTML = h; const n = w.firstElementChild; n._h = h; const ld = v.querySelector(':scope > .lead'); if(ld) ld.after(n); else v.prepend(n); }
  function paintLates(){ if(typeof D === 'undefined' || !D || D.mgr) return; try{ ltPut('v-pay', true); }catch(x){} try{ ltPut('v-today', false); }catch(x){} }
  (function(){ const st = document.createElement('style'); st.textContent = '.lt-it{display:flex;gap:10px;align-items:center;padding:9px 0;border-bottom:1px solid #F0EFF5;font-size:13.5px}.lt-it:last-of-type{border-bottom:0}.lt-it small{display:block;font-size:12px;color:#77738C}.lt-it > b{font-size:12.5px;white-space:nowrap}'
      + '.lt-p{color:#B4532F}.lt-w{color:#2E9E6F}.lt-d{color:#C2483A}.lt-bn{margin:12px 0;padding:10px 14px;border-radius:14px;background:#FBEDE8;border:1px solid #F0C9BD;color:#8A3B22;font-size:13px}.lt-bn b{color:#8A3B22}@media(max-width:620px){.lt-it{flex-wrap:wrap}.lt-it > b{white-space:normal}}';
    document.head.appendChild(st);
    const w = () => { if(typeof D === 'undefined' || !D || !TOKEN){ setTimeout(w, 1500); return; } if(D.mgr) return; let q = 0; const later = () => { if(q) return; q = requestAnimationFrame(() => { q = 0; paintLates(); }); };
      ['v-pay', 'v-today'].forEach(id => { const v = $(id); if(v) new MutationObserver(later).observe(v, { childList: true }); });
      loadLates(); setInterval(() => { if(document.visibilityState === 'visible') loadLates(); }, 300e3); };
    setTimeout(w, 5000); })();
  window.trView = async function(name){`],
]);
