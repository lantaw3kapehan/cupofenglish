// 1883: (Misty 7 Nov 22:27 "let us do all now" · build 3: release-day pay check)
//   Payroll → "✓ Release check": every person for the pay month in one list, from the database (coe-stuvid release → coe_pay_release):
//   Hold (red)  = disputed by the teacher, feedback owed, peer review owed, videos missing (the same as Ready to release);
//   Check (amber) = an unusual correction (units set by hand, ±20 units, ±₱5,000), not checked by the teacher, net ₱0, net ±50% vs last month;
//   Ready (green) = nothing left; Paid (grey). Each person's corrections are listed; tap a name → the payslip. ‹ › to change month.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["/* 1882 · Class videos card on management To do */",
   `/* 1883 · Release check (payroll) */
(function(){
  let M = null;
  const pz = n => '₱' + (Math.round((+n || 0) * 100) / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  const prevYm = () => { const d = new Date(Date.now() + 8 * 3600e3); d.setUTCDate(1); d.setUTCMonth(d.getUTCMonth() - 1); return d.toISOString().slice(0, 7); };
  const shift = (ym, k) => { const [y, m] = ym.split('-').map(Number), d = new Date(Date.UTC(y, m - 1 + k, 1)); return d.toISOString().slice(0, 7); };
  const lst = (A, max) => { A = A || []; return esc(A.slice(0, max || 8).join(', ')) + (A.length > (max || 8) ? ' +' + (A.length - (max || 8)) + ' more' : ''); };
  window.rc1883Open = async function(ym){ M = ym || M || prevYm(); if(!(D && D.mgr)) return;
    openSheet('<h1>Release check</h1><div class="sk"></div><div class="sk"></div><div class="sk" style="width:60%"></div>'); try{ $('sheet').classList.add('wide'); }catch(e){}
    let r = null; try{ r = await fetch(FAST_URL + '-stuvid', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, release: M }) }).then(x => x.json()); }catch(e){}
    if(!r || !r.ok){ $('sheetBody').innerHTML = '<h1>Release check</h1><div class="empty">Could not load. Try again.</div>'; return; }
    const col = { hold: '#B42318', check: '#B54708', ready: '#0E6B5C', paid: '#8A84A0' }, lab = { hold: 'Hold', check: 'Check', ready: 'Ready', paid: 'Paid' };
    const why = x => { const L = []; if(x.paid) return '<div class="small mute" style="margin-top:3px">Paid' + (x.paidOn ? ' ' + esc(x.paidOn) : '') + '</div>';
      if(x.verified === 'dispute') L.push('<b style="color:#B42318">Disputed</b>' + (x.vnote ? ' · “' + esc(x.vnote) + '”' : '') + (x.vat ? ' · ' + esc(x.vat) : ''));
      if((x.fb || []).length) L.push('Feedback owed (' + x.fb.length + '): ' + lst(x.fb));
      if((x.peer || []).length) L.push('Peer review owed: ' + lst(x.peer));
      if((x.vid || []).length) L.push('Videos missing (' + x.vid.length + '): ' + lst(x.vid));
      (x.check || []).forEach(c => { if(c !== 'unusual edit') L.push('<span style="color:#B54708">' + esc(c.charAt(0).toUpperCase() + c.slice(1)) + '</span>'); });
      (x.edits || []).forEach(e => L.push((e.odd ? '<span style="color:#B54708;font-weight:600">Unusual correction</span> · ' : 'Correction · ') + esc(e.field) + ' ' + (e.how === 'set' ? 'set to ' : '+') + esc(String(e.value)) + (e.label ? ' · ' + esc(e.label) : '') + ' · by ' + esc(e.by || '')));
      if(x.verified === 'verify') L.push('<span style="color:#0E6B5C">Checked by the teacher</span>' + (x.vat ? ' · ' + esc(x.vat) : ''));
      if(x.paid) L.push('Paid' + (x.paidOn ? ' ' + esc(x.paidOn) : ''));
      return L.map(s => '<div class="small" style="margin-top:3px">' + s + '</div>').join(''); };
    const row = x => '<div style="padding:10px 0;border-top:1px solid #EFEDF4"><div class="row" style="gap:8px;align-items:baseline"><b class="grow" style="cursor:pointer" onclick="ps1744Open(\\'' + esc(x.teacher).replace(/'/g, '') + '\\',\\'' + r.month + '\\')">' + esc(x.teacher) + ' ›</b>'
      + '<span class="small mute">' + (+x.units ? (Math.round(x.units * 100) / 100) + ' units · ' : '') + '</span><b>' + pz(x.net) + '</b> <span class="chip" style="background:' + col[x.status] + '1A;color:' + col[x.status] + '">' + lab[x.status] + '</span></div>' + why(x) + '</div>';
    const tile = (k, n, s) => '<div style="flex:1;background:#F7F5FC;border-radius:10px;padding:8px 4px;text-align:center"><b style="display:block;font-size:18px;color:' + col[k] + '">' + n + '</b><span class="small mute">' + s + '</span></div>';
    const grp = k => { const L = (r.rows || []).filter(x => x.status === k); return L.length ? '<h2 style="margin-top:14px;color:' + col[k] + '">' + lab[k] + ' · ' + L.length + '</h2>' + L.map(row).join('') : ''; };
    $('sheetBody').innerHTML = '<div class="row" style="gap:8px;align-items:center"><button class="btn sm ghost" onclick="rc1883Open(\\'' + shift(r.month, -1) + '\\')">‹</button><h1 class="grow" style="margin:0;text-align:center">Release check · ' + esc(r.label) + '</h1><button class="btn sm ghost" onclick="rc1883Open(\\'' + shift(r.month, 1) + '\\')">›</button></div>'
      + '<div class="small mute" style="text-align:center;margin-top:4px">From the database · ' + esc(r.at) + ' · total ' + pz(r.total) + ' for ' + r.count + ' people</div>'
      + '<div style="display:flex;gap:6px;margin-top:10px">' + tile('ready', r.ready, 'ready') + tile('check', r.check, 'to check') + tile('hold', r.hold, 'on hold') + tile('paid', r.paid, 'paid') + '</div>'
      + grp('hold') + grp('check') + grp('ready') + grp('paid')
      + '<div class="small mute" style="margin-top:12px;line-height:1.6">Hold = disputed, or feedback / peer review / videos still owed (the same list as Ready to release). Check = a correction made by hand that is unusual (units set by hand, more than 20 units, more than ₱5,000), not checked by the teacher yet, net ₱0, or net 50% higher or lower than last month. Ready = nothing left. Tap a name for the payslip.</div>'; };
  function addBtn(){ try{ if(!(D && D.mgr)) return; const v = $('v-payroll'); if(!v || v.querySelector('.rcBtn1883')) return; const lead = v.querySelector('.lead'); if(!lead) return;
    const b = document.createElement('button'); b.className = 'btn sm teal rcBtn1883'; b.textContent = '✓ Release check'; b.onclick = () => rc1883Open();
    lead.insertBefore(b, lead.firstChild); }catch(e){} }
  const r0 = window.renderPayroll; if(typeof r0 === 'function') window.renderPayroll = function(){ const r = r0.apply(this, arguments); addBtn(); setTimeout(addBtn, 0); return r; };
  try{ new MutationObserver(() => addBtn()).observe($('v-payroll'), { childList: true }); }catch(e){}
})();
/* 1882 · Class videos card on management To do */`],
]);
