/* 2060 (10 Nov 15:45, Misty: "Celine's final 13th month pay … PRESIDENT ACCESS ONLY so I could see and edit · aligned with DOLE ·
   Celine should not have access of it yet"). Payroll › 13th month (button shows for the President only; the server coe-13th also
   refuses everyone else). DOLE (PD 851): basic salary actually earned January–December ÷ 12, paid on or before 24 December.
   Basic = days worked × daily rate from the daily time records. Months not finished are estimated (days × current rate) and can be
   changed; any month's basic can be typed by hand; an adjustment with a reason; a note; the date paid. Penalties are listed, not
   deducted. Every save is kept in a history table. */
(function(){
  if(window.__t2060) return; window.__t2060 = 1;
  const URL = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-13th';
  const T = { y: new Date().getFullYear(), d: null, who: '', busy: 0, edit: {} };
  const e = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const P = n => '₱' + (Math.round((+n || 0) * 100) / 100).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const MN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const pres = () => { try{ return typeof isPres === 'function' && isPres(); }catch(x){ return false; } };
  const call = b => fetch(URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(Object.assign({ token: TOKEN, year: T.y }, b)) }).then(r => r.json());
  const css = document.createElement('style');
  css.textContent = '.t13 h1{margin:0}.t13 .sub{color:#5E5A76;font-size:13px;line-height:1.5;margin:4px 0 12px}'
    + '.t13 .hero{border-radius:16px;background:#1F2A44;color:#fff;padding:14px 16px;margin:6px 0 12px}.t13 .hero b{display:block;font-size:30px;font-weight:700;letter-spacing:.2px}.t13 .hero span{font-size:12.5px;color:#C9CEE0}'
    + '.t13 table{width:100%;border-collapse:collapse;font-size:13.5px}.t13 th{text-align:left;font-size:12px;color:#8F8CA3;font-weight:600;padding:6px 4px}.t13 td{padding:6px 4px;border-top:1px solid #F1EFF6;vertical-align:middle}'
    + '.t13 td.n,.t13 th.n{text-align:right;white-space:nowrap}.t13 .est{color:#9A6A12;font-size:11.5px;font-weight:600}.t13 .typ{color:#5B3FA6;font-size:11.5px;font-weight:600}.t13 .tot td{font-weight:700;border-top:2px solid #E4E1EC}'
    + '.t13 input.sm{width:64px;padding:4px 6px;border:1px solid #DCD8E6;border-radius:8px;font:inherit;text-align:right}.t13 input.md{width:110px}.t13 .box{border:1px solid #ECEAF1;border-radius:14px;padding:10px 12px;margin-top:10px;background:#fff}'
    + '.t13 .lab{font-size:12.5px;font-weight:600;color:#5E5A76;margin:8px 0 4px}.t13 .in{width:100%;padding:8px 10px;border:1px solid #DCD8E6;border-radius:10px;font:inherit}.t13 a.ed{color:#00737B;font-size:12px;cursor:pointer;margin-left:4px}'
    + '.t13 .seg{margin-bottom:8px}';
  document.head.appendChild(css);
  function person(){ const L = (T.d && T.d.people) || []; return L.find(p => p.person === T.who) || L[0]; }
  function show(h){ const b = document.getElementById('sheetBody'), on = document.getElementById('sheet'); if(b && on && on.classList.contains('on') && b.querySelector('.t13')) b.innerHTML = h; else openSheet(h); }
  function paint(){
    if(!T.d){ show('<div class="t13"><h1>13th month pay</h1><div class="sub">Loading…</div></div>'); return; }
    if(!T.d.ok){ show('<div class="t13"><h1>13th month pay</h1><div class="empty" role="alert">' + e(T.d.error === 'President only' ? 'Only the President can open this.' : 'Could not load. ' + (T.d.error || '')) + '</div></div>'); return; }
    const L = T.d.people || [], p = person();
    let h = '<div class="t13"><h1>13th month pay · ' + T.y + '</h1><div class="sub">Only you can see this page. DOLE rule (PD 851): basic salary actually earned from January to December ÷ 12, paid on or before 24 December. Basic = days worked × daily rate. Not counted: incentives, allowances, SSS, Pag-IBIG, PhilHealth, rent and bills. Penalties are not deducted. Holiday premiums are paid on payroll but are not basic salary.</div>';
    if(L.length > 1) h += '<div class="seg">' + L.map(x => '<button class="' + (x === p ? 'on' : '') + '" onclick="t2060who(\'' + e(x.person) + '\')">' + e(x.person) + '</button>').join('') + '</div>';
    if(!p){ show(h + '<div class="empty">No daily time records for ' + T.y + '.</div></div>'); return; }
    T.who = p.person;
    h += '<div class="hero"><span>' + e(p.person) + ' · 13th month pay' + (p.estimated ? ' (estimate until the year’s days are in)' : '') + '</span><b id="t13p1">' + P(p.pay) + '</b><span><span id="t13t1">' + P(p.total) + '</span> basic for the year ÷ 12' + (p.saved.paid_on ? ' · paid ' + e(p.saved.paid_on) : '') + '</span></div>';
    h += '<table><tr><th>Month</th><th class="n">Days</th><th class="n">Rate</th><th class="n">Basic</th></tr>';
    p.months.forEach(m => {
      const k = String(m.m), ed = T.edit[k] || m.src === 'typed';
      const rate = p.fixed ? 'monthly' : (m.rates.length ? m.rates.map(x => (m.rates.length > 1 ? x.d + ' × ' : '') + '₱' + x.r).join(' + ') : (m.src === 'estimate' ? '₱' + p.rate : '—'));
      const days = m.src === 'estimate' && !p.fixed ? '<input class="sm" type="number" min="0" max="31" step="0.5" data-est="' + k + '" oninput="t2060calc()" value="' + e(m.est) + '"' + (m.days ? ' title="' + m.days + ' days so far"' : '') + '>' : (p.fixed ? '' : String(Math.round(m.rates.reduce((t, x) => t + x.d, 0) * 100) / 100));   /* day-equivalents: a half day counts 0.5 */
      const basic = ed ? '<input class="sm md" type="number" min="0" step="0.01" data-ovr="' + k + '" oninput="t2060calc()" value="' + e(m.ovr != null ? m.ovr : m.basic) + '"> <a class="ed" onclick="t2060ed(\'' + k + '\',0)">records</a>'
        : P(m.basic) + ' <a class="ed" onclick="t2060ed(\'' + k + '\',1)">edit</a>';
      const tag = m.src === 'estimate' ? '<div class="est">estimate' + (m.part && m.days ? ' · ' + m.days + ' days so far (' + P(m.actual) + ')' : '') + '</div>' : m.src === 'typed' ? '<div class="typ">typed by you · records say ' + P(m.actual) + '</div>' : '';
      const prem = m.prem ? '<div class="small mute">holiday premium ' + P(m.prem) + ' not counted</div>' : '';
      h += '<tr><td>' + MN[m.m - 1] + tag + prem + '</td><td class="n">' + days + '</td><td class="n small">' + rate + '</td><td class="n" id="t13b' + k + '">' + basic + '</td></tr>';
    });
    if(p.saved.adj) h += '<tr><td>Adjustment' + (p.saved.adj_note ? '<div class="small mute">' + e(p.saved.adj_note) + '</div>' : '') + '</td><td></td><td></td><td class="n">' + P(p.saved.adj) + '</td></tr>';
    h += '<tr class="tot"><td>Basic for the year</td><td></td><td></td><td class="n" id="t13t2">' + P(p.total) + '</td></tr><tr class="tot"><td>13th month (÷ 12)</td><td></td><td></td><td class="n" id="t13p2">' + P(p.pay) + '</td></tr></table>';
    h += '<details class="box"><summary><b>Penalties in ' + T.y + ' · ' + P(p.penaltyTotal) + '</b> <span class="small mute">· not deducted (DOLE)</span></summary>'
      + (p.penalties.length ? '<table>' + p.penalties.map(x => '<tr><td class="small">' + e(x.when) + '</td><td class="small">' + e(x.what) + '</td><td class="n small">' + P(x.amount) + '</td></tr>').join('') + '</table>' : '<div class="small mute">None.</div>') + '</details>';
    h += '<div class="box"><div class="lab">Adjustment (₱, use a minus sign to take off)</div><input class="in" id="t13adj" oninput="t2060calc()" type="number" step="0.01" value="' + e(p.saved.adj || '') + '" placeholder="0">'
      + '<div class="lab">Reason for the adjustment</div><input class="in" id="t13adjn" value="' + e(p.saved.adj_note) + '" placeholder="e.g. unpaid days not in the time records">'
      + '<div class="lab">Note</div><textarea class="in" id="t13note" rows="2">' + e(p.saved.note) + '</textarea>'
      + '<div class="lab">Paid on</div><input class="in" id="t13paid" type="date" value="' + e(p.saved.paid_on) + '">'
      + '<button class="btn teal block" style="margin-top:12px" id="t13go" onclick="t2060save()">Save</button>'
      + (p.saved.updated_at ? '<div class="small mute" style="margin-top:6px">Last saved ' + e(new Date(p.saved.updated_at).toLocaleString('en-GB', { timeZone: 'Asia/Manila', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false })) + '</div>' : '') + '</div>';
    h += '<div class="small mute" style="margin-top:10px">Days and rates come from the daily time records. Months not finished use 26 days at the current rate; change the days to match. Each save is kept in the history.</div></div>';
    show(h);
  }
  function gather(){ const p = person(), est = {}, ovr = {};
    document.querySelectorAll('.t13 [data-est]').forEach(i => { est[i.dataset.est] = i.value; });
    document.querySelectorAll('.t13 [data-ovr]').forEach(i => { if(i.value !== '') ovr[i.dataset.ovr] = i.value; });
    return { person: p.person, est, ovr, adj: ($('t13adj') || {}).value || 0, adj_note: ($('t13adjn') || {}).value || '', note: ($('t13note') || {}).value || '', paid_on: ($('t13paid') || {}).value || '' }; }
  window.t2060 = function(){ if(!pres()) return; T.d = null; T.edit = {}; paint(); call({ op: 'get' }).then(d => { T.d = d; paint(); }).catch(() => { T.d = { ok: false, error: 'No connection' }; paint(); }); };
  window.t2060calc = function(){ const p = person(); if(!p) return; let t = 0;
    p.months.forEach(m => { const k = String(m.m), o = document.querySelector('.t13 [data-ovr="' + k + '"]'), d = document.querySelector('.t13 [data-est="' + k + '"]');
      let v = m.basic; if(o && o.value !== '') v = +o.value || 0; else if(d){ v = (+d.value || 0) * p.rate; const c = document.getElementById('t13b' + k); if(c && c.firstChild && c.firstChild.nodeType === 3) c.firstChild.nodeValue = P(v) + ' '; }
      t += v; });
    t += +(($('t13adj') || {}).value || 0) || 0; const set = (id, x) => { const el = document.getElementById(id); if(el) el.textContent = x; };
    set('t13t1', P(t)); set('t13t2', P(t)); set('t13p1', P(t / 12)); set('t13p2', P(t / 12)); };
  window.t2060who = function(n){ T.who = n; T.edit = {}; paint(); };
  window.t2060ed = function(k, on){ if(on) T.edit[k] = 1; else { delete T.edit[k]; const p = person(), m = p && p.months[+k - 1]; if(m){ m.ovr = null; if(m.src === 'typed'){ m.src = m.done ? 'records' : 'estimate'; m.basic = m.done || p.fixed ? (m.done ? m.actual : p.rate) : m.est * p.rate; } } } paint(); };
  window.t2060save = function(){ if(T.busy) return; T.busy = 1; const b = $('t13go'); if(b){ b.disabled = true; b.textContent = 'Saving…'; }
    call(Object.assign({ op: 'save' }, gather())).then(d => { T.busy = 0; if(d && d.ok){ T.d = d; T.edit = {}; paint(); try{ toast('Saved'); }catch(x){} } else { if(b){ b.disabled = false; b.textContent = 'Save'; } try{ toast((d && d.error) || 'Not saved'); }catch(x){} } })
      .catch(() => { T.busy = 0; if(b){ b.disabled = false; b.textContent = 'Save'; } try{ toast('Not saved · no connection'); }catch(x){} }); };
  function addBtn(){ try{ if(!pres()) return; const a = document.querySelector('#v-payroll .py-act'); if(!a || a.querySelector('.t13b')) return;
    a.insertAdjacentHTML('afterbegin', '<button class="btn ghost t13b" onclick="t2060()">13th month</button>'); }catch(x){} }
  const r = window.renderPayroll; if(typeof r === 'function') window.renderPayroll = function(){ const x = r.apply(this, arguments); addBtn(); return x; };
})();
