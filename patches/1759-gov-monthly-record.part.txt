  /* 1759 · the GOV record (coe_gov, database): one line per month · Misty 4 Nov 18:07 "it should be in supabase database" */
  const GK = [['sss', 'SSS'], ['pagibig', 'Pag-IBIG'], ['philhealth', 'PhilHealth'], ['bir', 'BIR'], ['sec', 'SEC'], ['charges', 'Charges']];
  const gTot = g => GK.reduce((a, [k]) => a + (+g[k] || 0), 0);
  const mLong = m => { const d = new Date(String(m).slice(0, 7) + '-15T12:00:00'); return isNaN(d) ? String(m) : d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }); };
  const dShort = d => { if(!d) return ''; const x = new Date(String(d).slice(0, 10) + 'T12:00:00'); return isNaN(x) ? String(d) : x.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); };
  const isPaid = g => /^paid$/i.test(String(g.status || '').trim());
  function paint1759(){ const v = $('v-gov'); if(!v) return; const tabs = v.querySelector(':scope > .grp-tabs'), th = tabs ? tabs.outerHTML : '';
    const head = '<div class="gv-h"><h1>Government</h1><span class="small mute">What CupOfEnglish pays to government each month · SSS, Pag-IBIG, PhilHealth, BIR, SEC · saved in the database</span><span class="grow"></span><button class="btn teal sm" onclick="gov1759Edit(\'\')">+ Month</button></div>';
    if(!X.gov){ v.innerHTML = th + head + '<div class="sk"></div><div class="sk"></div>'; return; }
    const G = X.gov.slice().sort((a, b) => String(b.month).localeCompare(String(a.month)));
    const years = [...new Set(G.map(g => String(g.month).slice(0, 4)))].sort().reverse();
    if(X.gy == null) X.gy = years.indexOf(today().slice(0, 4)) > -1 ? today().slice(0, 4) : (years[0] || '');
    const Y = X.gy ? G.filter(g => String(g.month).slice(0, 4) === X.gy) : G;
    const paidY = Y.filter(isPaid).reduce((a, g) => a + gTot(g), 0), all = G.filter(isPaid).reduce((a, g) => a + gTot(g), 0);
    const due = G.filter(g => !isPaid(g) && String(g.month).slice(0, 7) <= today().slice(0, 7)).sort((a, b) => String(a.month).localeCompare(String(b.month)));
    const pp = (X.ppl || []).filter(p => (+p.sss || 0) + (+p.pagibig || 0) + (+p.philhealth || 0) + (+p.bir || 0) > 0), staff = pp.reduce((a, p) => a + (+p.sss || 0) + (+p.pagibig || 0) + (+p.philhealth || 0) + (+p.bir || 0), 0);
    const used = GK.filter(([k]) => Y.some(g => +g[k]));
    const q = x => esc(String(x)).replace(/'/g, '');
    v.innerHTML = th + head
      + '<div class="ex-ch">' + years.map(y => '<button class="' + (X.gy === y ? 'on' : '') + '" onclick="gov1759Y(\'' + y + '\')">' + y + '</button>').join('') + '<button class="' + (!X.gy ? 'on' : '') + '" onclick="gov1759Y(\'\')">All</button></div>'
      + '<div class="gv-k"><div><span>Paid ' + (X.gy ? 'for ' + esc(X.gy) : 'in all') + '</span><b>' + P(paidY) + '</b><small>' + Y.filter(isPaid).length + ' month' + (Y.filter(isPaid).length === 1 ? '' : 's') + ' paid · all time ' + P(all) + '</small></div>'
      + '<div><span>To pay</span><b>' + (due.length ? P(due.reduce((a, g) => a + gTot(g), 0)) : '₱0.00') + '</b><small>' + (due.length ? due.map(g => esc(mLong(g.month))).join(' · ') : 'nothing waiting') + '</small></div>'
      + '<div><span>Staff contributions on payroll</span><b>' + P(staff) + '</b><small>a month · ' + pp.length + ' staff · <a class="link" onclick="go(\'payroll\');setTimeout(()=>{try{pdb1742Open()}catch(e){}},300)">edit in Payroll</a></small></div></div>'
      + '<div class="gv-c"><h2>By month' + (X.gy ? ' · ' + esc(X.gy) : '') + '</h2><div class="gv-s"><table><tr><th>Month</th><th style="text-align:left">Date of payment</th>' + used.map(([, l]) => '<th>' + l + '</th>').join('') + '<th>Total</th><th style="text-align:left">Status</th><th></th></tr>'
      + (Y.length ? Y.map(g => '<tr><td><b>' + esc(mLong(g.month)) + '</b></td><td style="text-align:left">' + (g.paid_on ? esc(dShort(g.paid_on)) : '<span class="small mute">—</span>') + '</td>'
          + used.map(([k]) => +g[k] ? '<td>' + P(g[k]) + '</td>' : '<td class="z">—</td>').join('') + '<td><b>' + P(gTot(g)) + '</b></td>'
          + '<td style="text-align:left">' + (isPaid(g) ? '<span class="chip" style="background:#E8F6EE;color:#1E7A55">Paid</span>' : '<span class="chip" style="background:#FFF4E0;color:#8A5A00">Not paid</span>') + (g.note ? ' <span class="small mute">' + esc(g.note) + '</span>' : '') + '</td>'
          + '<td><button class="btn ghost sm" title="Edit" onclick="gov1759Edit(\'' + q(String(g.month).slice(0, 7)) + '\')">✎</button></td></tr>').join('') : '<tr><td colspan="12" class="small mute">No months yet</td></tr>')
      + '<tr class="t"><td>Total</td><td></td>' + used.map(([k]) => '<td>' + P(Y.reduce((a, g) => a + (+g[k] || 0), 0)) + '</td>').join('') + '<td>' + P(Y.reduce((a, g) => a + gTot(g), 0)) + '</td><td colspan="2"></td></tr></table></div>'
      + '<div class="small mute" style="margin-top:6px">The month the payment covers · moved from the GOV tab of COE DATABASE on 4 Nov 2026 · the app saves here now</div></div>'
      + (pp.length ? '<div class="gv-c"><h2>Staff contributions on payroll · every month</h2><div class="gv-s"><table><tr><th>Person</th><th>SSS</th><th>PhilHealth</th><th>Pag-IBIG</th><th>BIR</th><th></th></tr>'
        + pp.map(p => '<tr><td><b>' + esc(p.teacher) + '</b> <span class="small mute">' + (p.gov_in_deduct ? 'not deducted' : 'deducted from pay') + '</span></td>' + ['sss', 'philhealth', 'pagibig', 'bir'].map(k => +p[k] ? '<td>' + P(p[k]) + '</td>' : '<td class="z">—</td>').join('') + '<td><button class="btn ghost sm" title="Edit" onclick="gov1758Staff(\'' + q(p.teacher) + '\')">✎</button></td></tr>').join('') + '</table></div></div>' : '')
      + (function(){ const L = (X.rows || []).filter(r => CATS.indexOf(r.c) > -1 && Number(r.a) && (!X.gy || r.d.slice(0, 4) === X.gy)); if(!L.length) return '';
          return '<details class="gv-c gv-l"><summary><b>Government lines in Finance › Transactions</b> <span class="small mute">' + L.length + ' · ' + P(L.reduce((a, r) => a + r.a, 0)) + ' · for checking against the months above</span></summary><div class="gv-s"><table><tr><th>Date</th><th style="text-align:left">Description</th><th style="text-align:left">Agency</th><th>Amount</th><th></th></tr>'
            + L.slice().sort((a, b) => b.d.localeCompare(a.d)).map(r => '<tr><td>' + esc(r.d) + '</td><td>' + esc(r.t) + '</td><td style="text-align:left"><span class="chip">' + LBL[agency(r)] + '</span></td><td>' + P(r.a) + '</td><td>' + (r.key && typeof fxTx === 'function' ? '<button class="btn ghost sm" title="Edit" onclick="fxTx(\'expense\',\'' + encodeURIComponent(r.key).replace(/'/g, '%27') + '\')">✎</button>' : '') + '</td></tr>').join('') + '</table></div></details>'; })(); }
  window.gov1759Y = y => { X.gy = y; paint(); };
  window.gov1759Edit = function(ym){ const G = X.gov || [], g = G.find(x => String(x.month).slice(0, 7) === ym) || {};
    if(!ym){ const last = G.map(x => String(x.month).slice(0, 7)).sort().reverse()[0]; const d = last ? new Date(Date.UTC(+last.slice(0, 4), +last.slice(5, 7), 1)) : new Date(); ym = d.toISOString().slice(0, 7); }
    const f = (k, l) => '<div class="grow" style="min-width:130px"><label>' + l + '</label><input id="gq' + k + '" class="in-t" type="number" min="0" step="0.01" inputmode="decimal" value="' + (+g[k] || '') + '" placeholder="0" oninput="gov1759Sum()"></div>';
    const paidDay = g.paid_on ? String(g.paid_on).slice(0, 10) : '';
    openSheet('<h1>Government · ' + esc(mLong(ym)) + '</h1><div class="small mute">The month this payment covers · saved in the database</div>'
      + '<label>Month covered</label><input id="gqM" class="in-t" type="month" value="' + esc(ym) + '"' + (g.month ? ' disabled' : '') + '>'
      + '<label>Date of payment</label><input id="gqD" class="in-t" type="date" value="' + esc(paidDay) + '">'
      + '<div class="row" style="gap:10px;flex-wrap:wrap">' + GK.map(([k, l]) => f(k, l)).join('') + '</div>'
      + '<div style="margin-top:10px"><b>Total payment <span id="gqT">' + P(gTot(g)) + '</span></b></div>'
      + '<label>Status</label><select id="gqS" class="in-t"><option value="">Not paid yet</option><option value="Paid"' + (isPaid(g) ? ' selected' : '') + '>Paid</option></select>'
      + '<label>Note</label><input id="gqN" class="in-t" maxlength="300" value="' + esc(g.note || '') + '" placeholder="e.g. paid at the bank · reference no.">'
      + (typeof api === 'function' ? '<label style="display:flex;gap:8px;align-items:center;margin-top:12px;font-weight:400"><input type="checkbox" id="gqX" style="width:auto;margin:0"> Also add the total to Finance › Transactions (one expense line, category Government Contributions)</label><div class="small mute" id="gqXH" style="margin-top:2px"></div>' : '')
      + '<button class="btn block" id="gqGo" style="margin-top:14px" onclick="gov1759Save(' + (g.month ? 1 : 0) + ')">Save</button>'
      + '<button class="btn ghost block" style="margin-top:8px" onclick="closeSheet()">Cancel</button>');
    try{ $('sheet').classList.remove('wide'); }catch(e){} gov1759Sum(); };
  window.gov1759Sum = function(){ const g = {}; GK.forEach(([k]) => g[k] = +(($('gq' + k) || {}).value || 0)); const t = $('gqT'); if(t) t.textContent = P(gTot(g));
    const h = $('gqXH'), d = (($('gqD') || {}).value || ''); if(h){ const L = (X.rows || []).filter(r => CATS.indexOf(r.c) > -1 && d && r.d.slice(0, 7) === d.slice(0, 7)); h.textContent = d ? (L.length ? 'Transactions already has ' + L.length + ' government line' + (L.length > 1 ? 's' : '') + ' in ' + mLong(d) + ' (' + P(L.reduce((a, r) => a + r.a, 0)) + ') · tick only if this payment is not one of them' : 'No government line in Transactions in ' + mLong(d) + ' yet') : 'Write the date of payment first'; } };
  window.gov1759Save = async function(existing){ const ym = (($('gqM') || {}).value || '').slice(0, 7); if(!/^\d{4}-\d{2}$/.test(ym)) return toast('Choose the month');
    if(!existing && (X.gov || []).some(x => String(x.month).slice(0, 7) === ym)) return toast(mLong(ym) + ' is already in the list · use ✎ on it');
    const b = { op: 'govset', month: ym, paid_on: ($('gqD') || {}).value || '', status: ($('gqS') || {}).value || '', note: (($('gqN') || {}).value || '').trim() };
    GK.forEach(([k]) => b[k] = +(($('gq' + k) || {}).value || 0)); if(GK.some(([k]) => !isFinite(b[k]) || b[k] < 0)) return toast('Check the amounts');
    if(b.status === 'Paid' && !b.paid_on) return toast('Write the date of payment');
    const also = !!($('gqX') || {}).checked; if(also && !b.paid_on) return toast('Write the date of payment for Transactions');
    const g = $('gqGo'); if(g){ g.disabled = true; g.textContent = 'Saving…'; }
    let r = null; try{ r = await fetch(FAST_URL + '-payedit', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(Object.assign({ token: TOKEN }, b)) }).then(x => x.json()); }catch(e){}
    if(!r || !r.ok){ if(g){ g.disabled = false; g.textContent = 'Save'; } return toast((r && r.error) || 'Not saved · check your internet'); }
    const tot = gTot(b); toast('✓ Saved · Government ' + mLong(ym));
    if(also && tot > 0){ const parts = GK.filter(([k]) => b[k]).map(([k, l]) => l + ' ' + P(b[k]).replace('.00', '')).join(' · ');
      try{ api('addExpense', TOKEN, { date: b.paid_on, desc: 'Government contributions · ' + mLong(ym) + ' (' + parts + ')', category: 'Government Contributions', amount: String(Math.round(tot * 100) / 100) }).then(x => { if(x && x.ok) toast('✓ Also added to Transactions'); else toast('Saved here · not added to Transactions · add it there'); }).catch(() => toast('Saved here · not added to Transactions · add it there')); }catch(e){} }
    closeSheet(); X.gov = null; paint(); load(); };
