// 1742: (Misty 4 Nov 15:33 "ensure payroll can also be easily edited"; 15:51 "anything that is on hold for 10pm should be done now")
//   Payroll › "From the database · ✎ correct": each person's pay worked out by the database (coe-payedit › coe_pay_calc) next to the
//   PAY tab, with the difference. The President can correct any number (units, rate, bonus, deductions, SSS, Pag-IBIG, PhilHealth, BIR,
//   base) for the month — set a new value or add an amount, with a reason — and remove a correction. Nothing in the PAY tab changes.
const file = process.argv[2];
const js = String.raw`<script>
/* 1742 · Payroll from the database + corrections */
(function(){
  if(window.__1742) return; window.__1742 = 1;
  const URL = FAST_URL + '-payedit', MN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const peso = n => '₱' + (Math.round((+n || 0) * 100) / 100).toLocaleString('en-US', { maximumFractionDigits: 2 });
  const F = { reg: 'Regular units', sub: 'Sub units', trial: 'Trial units', rate: 'Rate per lesson', base: 'Base (staff hours)', bonus: 'Incentives (+ bonus)', deduct: 'Deductions', sss: 'SSS', pagibig: 'Pag-IBIG', philhealth: 'PhilHealth', bir: 'BIR' };
  let PD = null, PM = '';
  const call = b => fetch(URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(Object.assign({ token: TOKEN }, b)) }).then(x => x.json());
  const monthOfPay = () => { const t = String((typeof MO !== 'undefined' && MO && MO.payMonth) || ''), m = t.match(/([A-Za-z]+)\s+(\d{4})/);
    if(m){ const i = MN.findIndex(x => x.toLowerCase().startsWith(m[1].toLowerCase().slice(0, 3))); if(i > -1) return m[2] + '-' + ('0' + (i + 1)).slice(-2); }
    const d = new Date(Date.now() + 8 * 36e5); d.setUTCMonth(d.getUTCMonth() - 1); return d.toISOString().slice(0, 7); };
  const label = ym => { const [y, m] = ym.split('-'); return MN[+m - 1] + ' ' + y; };
  const shift = (ym, k) => { const [y, m] = ym.split('-').map(Number), d = new Date(Date.UTC(y, m - 1 + k, 1)); return d.toISOString().slice(0, 7); };
  function paint(){ const b = $('sheetBody'); if(!b || !b.querySelector('.pdb1742')) return; const box = b.querySelector('.pdb1742');
    if(!PD){ box.innerHTML = '<div class="sk"></div><div class="sk"></div>'; return; }
    if(!PD.ok){ box.innerHTML = '<div class="empty">' + esc(PD.error || 'Could not load') + ' · <button class="btn ghost sm" onclick="pdb1742Load()">Try again</button></div>'; return; }
    const R = PD.rows || [], tot = R.reduce((a, r) => a + (+r.net || 0), 0), diff = R.filter(r => r.sheet && Math.abs((+r.net || 0) - (+r.sheet.net || 0)) > 0.009);
    box.innerHTML = '<div class="small mute" style="margin:6px 0 10px">Database total ' + peso(tot) + ' · ' + R.length + ' people · ' + (diff.length ? diff.length + ' differ from the PAY tab' : 'all the same as the PAY tab') + '</div>'
      + R.map((r, i) => { const s = r.sheet, d = s ? (+r.net || 0) - (+s.net || 0) : null, ed = (r.edited || []).length;
        return '<div class="card" style="margin-top:8px;padding:10px 12px"><div class="row" style="gap:8px;align-items:center"><div class="grow"><b>' + esc(r.teacher) + '</b>'
          + '<div class="small mute">' + (+r.reg || 0) + ' + ' + (+r.sub || 0) + ' sub + ' + (+r.trial || 0) + ' trial units × ' + peso(r.rate) + ((r.courses || []).length ? ' (course rates)' : '') + (+r.base ? ' · base ' + peso(r.base) : '') + (+r.bonus ? ' · + ' + peso(r.bonus) : '') + (+r.deduct ? ' · − ' + peso(r.deduct) : '') + ((+r.sss) + (+r.pagibig) + (+r.philhealth) ? ' · dues ' + peso((+r.sss) + (+r.pagibig) + (+r.philhealth)) : '') + (ed ? ' · ' + ed + ' correction' + (ed > 1 ? 's' : '') : '') + '</div></div>'
          + '<div style="text-align:right"><b>' + peso(r.net) + '</b><div class="small ' + (d == null ? 'mute' : Math.abs(d) < 0.01 ? 'mute' : '') + '" style="' + (d != null && Math.abs(d) >= 0.01 ? 'color:#9A4330' : '') + '">' + (s ? (Math.abs(d) < 0.01 ? 'same as PAY tab' : 'PAY tab ' + peso(s.net) + ' (' + (d > 0 ? '+' : '−') + peso(Math.abs(d)) + ')') : 'not in the PAY tab') + (s && s.paid ? ' · paid' : '') + '</div></div>'
          + (PD.pres ? '<button class="btn ghost sm" onclick="pdb1742Edit(' + i + ')">✎</button>' : '') + '</div></div>'; }).join('');
  }
  window.pdb1742Load = async function(){ PD = null; paint(); try{ PD = await call({ op: 'month', month: PM }); }catch(e){ PD = { ok: false, error: 'No connection' }; } paint(); };
  window.pdb1742Month = function(k){ PM = shift(PM, k); const t = $('pdbM1742'); if(t) t.textContent = label(PM); pdb1742Load(); };
  window.pdb1742Open = function(){ PM = monthOfPay(); PD = null;
    openSheet('<h1>Pay from the database</h1><div class="small mute">Worked out from the classes taught, TC&amp;SUB, rank rates, cases and staff hours — next to the PAY tab. ' + (isPres() ? 'Tap ✎ to correct a number for the month (with a reason). ' : '') + 'The PAY tab is not changed.</div>'
      + '<div class="row" style="gap:8px;margin-top:10px;align-items:center"><button class="btn ghost sm" onclick="pdb1742Month(-1)">‹</button><b id="pdbM1742" class="grow" style="text-align:center">' + esc(label(PM)) + '</b><button class="btn ghost sm" onclick="pdb1742Month(1)">›</button></div><div class="pdb1742"></div>');
    try{ $('sheet').classList.add('wide'); }catch(e){} pdb1742Load(); };
  window.pdb1742Edit = function(i){ const r = PD && PD.rows && PD.rows[i]; if(!r) return; const E = r.edited || [];
    openSheet('<h1>✎ ' + esc(r.teacher) + ' · ' + esc(label(PM)) + '</h1><div class="small mute">Net now ' + peso(r.net) + (r.sheet ? ' · PAY tab ' + peso(r.sheet.net) : '') + '</div>'
      + '<label>What to correct</label><select id="pdF" class="in-t">' + Object.keys(F).map(k => '<option value="' + k + '">' + F[k] + ' · now ' + (k === 'reg' || k === 'sub' || k === 'trial' ? (+r[k] || 0) : peso(r[k])) + '</option>').join('') + '</select>'
      + '<label>How</label><div class="qa-ch"><button type="button" class="on" id="pdS" onclick="this.classList.add(\'on\');$(\'pdA\').classList.remove(\'on\')">Set to</button><button type="button" id="pdA" onclick="this.classList.add(\'on\');$(\'pdS\').classList.remove(\'on\')">Add (+ or −)</button></div>'
      + '<label>Amount</label><input id="pdV" class="in-t" type="number" step="0.5" inputmode="decimal" placeholder="e.g. 6 or 300 or -0.5">'
      + '<label>Reason</label><input id="pdR" class="in-t" maxlength="300" placeholder="e.g. 12 classes with Mia missing in OCTOBER-DAILY">'
      + '<button class="btn block" id="pdGo" style="margin-top:12px" onclick="pdb1742Save(' + i + ')">Save correction</button>'
      + (E.length ? '<h2 style="margin-top:16px">Corrections this month</h2>' + E.map(e => '<div class="row" style="gap:8px;margin-top:6px;align-items:center"><div class="grow small"><b>' + esc(F[e.field] || e.field) + '</b> ' + (e.how === 'add' ? (e.value >= 0 ? '+' : '') + e.value : '= ' + e.value) + ' · ' + esc(e.reason || '') + '<div class="mute">' + esc(e.by || '') + ' · ' + esc(String(e.at || '').slice(0, 16).replace('T', ' ')) + '</div></div><button class="btn ghost sm" onclick="pdb1742Undo(' + e.id + ',' + i + ')">Remove</button></div>').join('') : '')
      + '<button class="btn ghost block" style="margin-top:14px" onclick="pdb1742Open()">‹ Back to the list</button>'); };
  window.pdb1742Save = async function(i){ const r = PD.rows[i], v = ($('pdV') || {}).value, why = (($('pdR') || {}).value || '').trim(), g = $('pdGo');
    if(v === '' || !isFinite(+v)) return toast('Type the amount'); if(why.length < 3) return toast('Write the reason');
    if(g){ g.disabled = true; g.textContent = 'Saving…'; }
    let x = null; try{ x = await call({ op: 'edit', month: PM, teacher: r.teacher, field: $('pdF').value, how: $('pdA').classList.contains('on') ? 'add' : 'set', value: +v, reason: why }); }catch(e){}
    if(!x || !x.ok){ if(g){ g.disabled = false; g.textContent = 'Save correction'; } return toast((x && x.error) || 'Not saved · check your internet'); }
    toast('✓ Correction saved · ' + r.teacher); const t = r.teacher; await pdb1742Load(); const j = (PD.rows || []).findIndex(y => y.teacher === t); pdb1742Open(); if(j > -1) setTimeout(() => pdb1742Edit(j), 50); };
  window.pdb1742Undo = async function(id, i){ const t = PD.rows[i] && PD.rows[i].teacher; let x = null; try{ x = await call({ op: 'unedit', id }); }catch(e){}
    if(!x || !x.ok) return toast((x && x.error) || 'Not removed'); toast('Correction removed'); pdb1742Open(); setTimeout(() => { const j = (PD && PD.rows || []).findIndex(y => y.teacher === t); if(j > -1) pdb1742Edit(j); }, 900); };
  function addBtn(){ try{ if(!(D && D.mgr)) return; const v = $('v-payroll'); if(!v || v.querySelector('.pdbBtn1742')) return; const lead = v.querySelector('.lead'); if(!lead) return;
    const b = document.createElement('button'); b.className = 'btn sm ghost pdbBtn1742'; b.textContent = isPres() ? 'Database · ✎ correct' : 'From the database'; b.onclick = () => pdb1742Open();
    const last = lead.querySelector('button'); if(last) lead.insertBefore(b, last); else lead.appendChild(b); }catch(e){} }
  const r0 = window.renderPayroll; if(typeof r0 === 'function') window.renderPayroll = function(){ const r = r0.apply(this, arguments); addBtn(); setTimeout(addBtn, 0); return r; };
  try{ new MutationObserver(() => addBtn()).observe($('v-payroll'), { childList: true }); }catch(e){}
})();
</script>
</body>
</html>`;
require('../tools/lib.js')(file, [["</script>\n</body>\n</html>", "</script>\n" + js]]);
