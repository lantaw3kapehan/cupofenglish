// 1744: (Misty 4 Nov 16:07–16:11: "Celine can edit payroll" · "celine's payslip can also be editable")
//   · ✎ correct is for all management (coe-payedit v2/v3: nobody but the President corrects their own pay).
//   · Extra payslip lines with their own name: "+ Extra earning" (e.g. Allowance) and "− Extra deduction" (e.g. Cash advance, Rent).
//   · Payslip from the database (same layout as the PAYSLIP tab): personnel, pay period, rate, lessons, sub, trial, incentives (each
//     case), deductions (each case + extra lines), statutory dues, gross / deductions / net; payout date, payment method and a note are
//     editable for the month; Print / Save as PDF.
const file = process.argv[2];
const js = String.raw`<script>
/* 1744 · Payslip from the database (editable) */
(function(){
  if(window.__1744) return; window.__1744 = 1;
  const URL = FAST_URL + '-payedit', MN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const call = b => fetch(URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(Object.assign({ token: TOKEN }, b)) }).then(x => x.json());
  const pz = n => '₱' + (Math.round((+n || 0) * 100) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const lab = ym => { const [y, m] = String(ym).split('-'); return MN[+m - 1] + ' ' + y; };
  const longDay = d => { if(!d) return ''; const x = new Date(String(d).slice(0, 10) + 'T00:00:00'); return isNaN(x) ? String(d) : x.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); };
  const nextPay = ym => { const [y, m] = String(ym).split('-').map(Number), d = new Date(Date.UTC(y, m, 10)); return d.toISOString().slice(0, 10); };
  let SL = null;
  function slipHtml(S, forPrint){ const r = S.row, p = S.person, sl = S.slip || {}, cs = S.cases || [], E = r.edited || [];
    const extra = E.filter(e => e.field === 'extra'), less = E.filter(e => e.field === 'less');
    const lessonsPay = +r.lesson_pay || 0, regPay = Math.round(((+r.reg || 0) * (+r.rate || 0)) * 100) / 100;
    const inc = cs.filter(c => c.incentive), ded = cs.filter(c => c.deduction);
    const gross = +r.gross || 0, dues = (+r.sss || 0) + (+r.pagibig || 0) + (+r.philhealth || 0), gid = S.people && S.people.gov_in_deduct;
    const totalDed = Math.round(((+r.deduct || 0) + (gid ? 0 : dues)) * 100) / 100, net = +r.net || 0;
    const row = (a, u, b, cls) => '<tr' + (cls ? ' class="' + cls + '"' : '') + '><td>' + a + '</td><td style="text-align:right">' + (u == null ? '' : u) + '</td><td style="text-align:right">' + b + '</td></tr>';
    const rateTxt = (r.courses || []).length ? r.courses.map(c => esc(c.course) + ' ' + pz(c.rate)).join(' · ') : (+r.rate ? pz(r.rate) : '—');
    const tenure = p.start ? (() => { const a = new Date(p.start + 'T00:00:00'), b = new Date(); let mo = (b.getFullYear() - a.getFullYear()) * 12 + b.getMonth() - a.getMonth(); return Math.floor(mo / 12) + ' year' + (Math.floor(mo / 12) === 1 ? '' : 's') + ', ' + (mo % 12) + ' month' + (mo % 12 === 1 ? '' : 's'); })() : '';
    const css = '<style>.ps1744{font:13px/1.45 system-ui,-apple-system,Segoe UI,sans-serif;color:#1d2433;max-width:720px;margin:0 auto}.ps1744 h2{margin:16px 0 6px;font-size:12px;letter-spacing:.08em;color:#00737B}.ps1744 table{width:100%;border-collapse:collapse}.ps1744 td{padding:5px 4px;border-bottom:1px solid #EEF0F4;vertical-align:top}.ps1744 .tot td{font-weight:700;border-bottom:2px solid #1d2433}.ps1744 .k{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px}.ps1744 .k div{background:#F1FAF9;border-radius:10px;padding:8px 10px}.ps1744 .k b{display:block;font-size:17px}.ps1744 .m{color:#6b7385;font-size:12px}</style>';
    return css + '<div class="ps1744"><div style="text-align:center"><b style="font-size:20px;letter-spacing:.12em">PAYSLIP</b><div class="m">CupOfEnglish · Service Compensation Record · Ref. No. PS-' + String(S.month).replace('-', '') + '-' + esc(p.code || '') + '</div></div>'
      + '<h2>PERSONNEL</h2><table><tr><td><b>' + esc(p.full || p.name) + '</b><div class="m">' + esc(p.position || '') + (p.employment ? ' · ' + esc(p.employment) : '') + (p.start ? '<br>Engagement date: ' + esc(longDay(p.start)) + (tenure ? ' (' + tenure + ')' : '') : '') + '</div></td>'
      + '<td><span class="m">Personnel code</span><br><b>' + esc(p.code || '—') + '</b></td><td><span class="m">Pay period</span><br><b>' + esc(lab(S.month)) + '</b></td><td><span class="m">Rate per lesson</span><br><b>' + rateTxt + '</b></td></tr></table>'
      + '<div class="m" style="margin-top:6px">Scheduled payout date: ' + esc(longDay(sl.payout_date || nextPay(S.month))) + (sl.method ? ' · Payment method: ' + esc(sl.method) : '') + '</div>'
      + '<div class="k"><div><span class="m">Gross compensation</span><b>' + pz(gross) + '</b></div><div><span class="m">Total deductions</span><b>' + pz(totalDed) + '</b></div><div><span class="m">Net compensation</span><b>' + pz(net) + '</b></div></div>'
      + '<h2>COMPENSATION</h2><table>' + row('<b>Item</b>', '<b>Units</b>', '<b>Amount</b>')
      + (+r.base ? row('Base pay (days worked)', '', pz(r.base)) : '')
      + ((+r.reg || 0) || !(+r.base) ? row('Regular lessons @ ' + rateTxt, +r.reg || 0, pz((r.courses || []).length ? lessonsPay - ((+r.sub || 0) + (+r.trial || 0)) * (+r.rate || 0) : regPay)) : '')
      + ((+r.trial) ? row('Trial classes', +r.trial, pz((+r.trial) * (+r.rate || 0))) : '') + ((+r.sub) ? row('Substitute classes', +r.sub, pz((+r.sub) * (+r.rate || 0))) : '')
      + inc.map(c => row('Incentive · ' + esc(c.type || c.subject) + (c.student ? ' · ' + esc(c.student) : '') + ' <span class="m">' + esc(c.id) + '</span>', '', pz(c.incentive))).join('')
      + extra.map(e => row(esc(e.label || 'Extra') + (e.reason ? ' <span class="m">· ' + esc(e.reason) + '</span>' : ''), '', pz(e.value))).join('')
      + row('Gross compensation', '', pz(gross), 'tot') + '</table>'
      + '<h2>DEDUCTIONS</h2><table>' + (ded.length || less.length ? '' : row('None', '', pz(0)))
      + ded.map(c => row(esc(c.subject || c.type) + (c.note ? ' <span class="m">· ' + esc(c.note) + '</span>' : '') + ' <span class="m">' + esc(c.id) + '</span>', '', pz(c.deduction))).join('')
      + less.map(e => row(esc(e.label || 'Deduction') + (e.reason ? ' <span class="m">· ' + esc(e.reason) + '</span>' : ''), '', pz(e.value))).join('')
      + (Math.abs((ded.reduce((a, c) => a + c.deduction, 0) + less.reduce((a, e) => a + (+e.value || 0), 0)) - (+r.deduct || 0)) > 0.009 ? row('Other adjustments', '', pz((+r.deduct || 0) - ded.reduce((a, c) => a + c.deduction, 0) - less.reduce((a, e) => a + (+e.value || 0), 0))) : '')
      + '</table><h2>STATUTORY</h2><table>' + row('<b>Contribution</b>', '<b>ID on file</b>', '<b>Amount</b>')
      + [['SSS', 'sss', +r.sss], ['PhilHealth', 'philhealth', +r.philhealth], ['Pag-IBIG', 'pagibig', +r.pagibig], ['BIR / TIN', 'tin', +r.bir]].map(x => row(x[0], p.ids && p.ids[x[1]] ? 'On file' : 'No ID on file', pz(x[2] || 0))).join('')
      + (gid && dues ? '<tr><td colspan="3" class="m">Statutory contributions shown for the record · not deducted from this pay.</td></tr>' : '') + row('Total deductions', '', pz(totalDed), 'tot') + '</table>'
      + '<p style="margin-top:14px">' + esc((p.title ? p.title + ' ' : '') + (String(p.full || p.name).split(' ').slice(-1)[0])) + ' accrued gross service compensation of ' + pz(gross) + ' for the ' + esc(lab(S.month)) + ' pay period, less ' + pz(totalDed) + ' in applicable deductions, resulting in net compensation payable of <b>' + pz(net) + '</b>.</p>'
      + (sl.note ? '<p>' + esc(sl.note) + '</p>' : '') + '<p class="m">For verification or inquiries regarding this payslip, please contact CupOfEnglish at works@cupofenglishatph.com.<br>System-generated payslip · records as of ' + new Date().toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }) + '.</p></div>'; }
  window.ps1744Open = async function(name, ym){ if(!/^\d{4}-\d{2}$/.test(String(ym || ''))){ const m = String(ym || (typeof MO !== 'undefined' && MO && MO.payMonth) || '').match(/([A-Za-z]+)\s+(\d{4})/); ym = m ? m[2] + '-' + ('0' + (MN.findIndex(x => x.toLowerCase() === m[1].toLowerCase()) + 1)).slice(-2) : ''; } if(!ym) return toast('Choose the month first'); openSheet('<h1>Payslip · ' + esc(name) + '</h1><div class="sk"></div><div class="sk" style="height:300px"></div>'); try{ $('sheet').classList.add('wide'); }catch(e){}
    let S = null; try{ S = await call({ op: 'slip', month: ym, teacher: name }); }catch(e){}
    if(!S || !S.ok) return void ($('sheetBody').innerHTML = '<h1>Payslip · ' + esc(name) + '</h1><div class="empty">' + esc((S && S.error) || 'Could not load') + '</div>');
    SL = S; const sl = S.slip || {};
    $('sheetBody').innerHTML = '<div class="row" style="gap:8px;flex-wrap:wrap;align-items:center"><h1 class="grow" style="margin:0">Payslip · ' + esc(name) + '</h1><button class="btn sm teal" onclick="ps1744Print()">Print / Save PDF</button><button class="btn sm ghost" onclick="pdb1742Open()">‹ Payroll list</button></div>'
      + '<details class="card" style="margin-top:10px;padding:10px 12px"><summary><b>✎ Edit this payslip</b> <span class="small mute">payout date, payment method, note · amounts and extra lines with ✎ in the list</span></summary>'
      + '<div class="row" style="gap:10px;flex-wrap:wrap"><div class="grow"><label>Payout date</label><input id="psD1744" class="in-t" type="date" value="' + esc(sl.payout_date || nextPay(S.month)) + '"></div><div class="grow"><label>Payment method</label><input id="psM1744" class="in-t" maxlength="80" placeholder="e.g. Bank Transfer (UnionBank)" value="' + esc(sl.method || '') + '"></div></div>'
      + '<label>Note on the payslip</label><input id="psN1744" class="in-t" maxlength="500" value="' + esc(sl.note || '') + '"><button class="btn block" style="margin-top:10px" id="psG1744" onclick="ps1744Save(\'' + esc(name) + '\',\'' + esc(S.month) + '\')">Save payslip details</button></details>'
      + '<div class="card" style="margin-top:10px;padding:14px">' + slipHtml(S) + '</div>'; };
  window.ps1744Save = async function(name, ym){ const g = $('psG1744'); if(g){ g.disabled = true; g.textContent = 'Saving…'; } let x = null;
    try{ x = await call({ op: 'slipset', month: ym, teacher: name, payout_date: ($('psD1744') || {}).value || '', method: ($('psM1744') || {}).value || '', note: ($('psN1744') || {}).value || '' }); }catch(e){}
    if(!x || !x.ok){ if(g){ g.disabled = false; g.textContent = 'Save payslip details'; } return toast((x && x.error) || 'Not saved'); } toast('✓ Payslip details saved'); ps1744Open(name, ym); };
  window.ps1744Print = function(){ if(!SL) return; const w = window.open('', '_blank'); if(!w) return toast('Allow pop-ups to print');
    w.document.write('<!doctype html><html><head><meta charset="utf-8"><title>Payslip ' + esc(SL.person.name) + ' ' + esc(lab(SL.month)) + '</title></head><body style="margin:24px">' + slipHtml(SL, true) + '</body></html>'); w.document.close(); setTimeout(() => { try{ w.focus(); w.print(); }catch(e){} }, 400); };
  /* ✎ form: + extra earning / − extra deduction lines, and a Payslip button; ✎ for all management */
  const e0 = window.pdb1742Edit;
  if(e0) window.pdb1742Edit = function(i){ const r = e0.apply(this, arguments);
    try{ const sel = $('pdF'); if(sel && !sel.querySelector('[value=extra]')){ sel.insertAdjacentHTML('beforeend', '<option value="extra">+ Extra earning line (e.g. Allowance)</option><option value="less">− Extra deduction line (e.g. Cash advance)</option>');
        const lb = document.createElement('div'); lb.id = 'pdLW'; lb.style.display = 'none'; lb.innerHTML = '<label>Line name (shows on the payslip)</label><input id="pdL" class="in-t" maxlength="80" placeholder="e.g. Allowance · Cash advance · Rent">'; $('pdV').before(lb);
        sel.addEventListener('change', () => { const x = /^(extra|less)$/.test(sel.value); lb.style.display = x ? '' : 'none'; if(x){ $('pdA').click(); } });
        const go = $('pdGo'); if(go){ const b = document.createElement('button'); b.className = 'btn ghost block'; b.style.marginTop = '8px'; b.textContent = 'Payslip from the database →';
          const nm = (document.querySelector('#sheetBody h1') || {}).textContent || ''; const t = nm.replace(/^✎\s*/, '').split(' · ')[0]; const ym = (window.__pm1744 || ''); b.onclick = () => ps1744Open(t, ym || nm.split(' · ')[1]); go.after(b); }
        // the Edit sheet labels for extra / less corrections
        document.querySelectorAll('#sheetBody .grow.small b').forEach(b => { if(b.textContent === 'extra') b.textContent = '+ Extra'; if(b.textContent === 'less') b.textContent = '− Extra'; }); } }catch(e){} return r; };
  const s0 = window.pdb1742Save;
  if(s0) window.pdb1742Save = async function(i){ const f = ($('pdF') || {}).value; if(/^(extra|less)$/.test(f || '')){ const L = (($('pdL') || {}).value || '').trim(); if(L.length < 2) return toast('Write the line name');
      const _f = window.fetch; window.fetch = function(u, o){ try{ if(String(u).indexOf('-payedit') > -1 && o && o.body){ const b = JSON.parse(o.body); if(b.op === 'edit'){ b.label = L; o = Object.assign({}, o, { body: JSON.stringify(b) }); } } }catch(e){} return _f.call(this, u, o); };
      try{ return await s0.apply(this, arguments); } finally { window.fetch = _f; } }
    return s0.apply(this, arguments); };
  /* month names in the ✎ sheet are labels like "October 2026": turn into yyyy-mm for the payslip */
  const o0 = window.pdb1742Open; if(o0) window.pdb1742Open = function(){ const r = o0.apply(this, arguments); setTimeout(() => { try{ const t = ($('pdbM1742') || {}).textContent || '', m = t.match(/([A-Za-z]+)\s+(\d{4})/); if(m) window.__pm1744 = m[2] + '-' + ('0' + (MN.findIndex(x => x === m[1]) + 1)).slice(-2); }catch(e){} }, 0); return r; };
  const m0 = window.pdb1742Month; if(m0) window.pdb1742Month = function(){ const r = m0.apply(this, arguments); try{ const t = ($('pdbM1742') || {}).textContent || '', m = t.match(/([A-Za-z]+)\s+(\d{4})/); if(m) window.__pm1744 = m[2] + '-' + ('0' + (MN.findIndex(x => x === m[1]) + 1)).slice(-2); }catch(e){} return r; };
})();
</script>
</body>
</html>`;
require('../tools/lib.js')(file, [
  ["</script>\n</body>\n</html>", "</script>\n" + js],
  ["b.textContent = isPres() ? 'Database · ✎ correct' : 'From the database';", "b.textContent = 'Database · ✎ correct';   /* 1744: all management */"],
  ["' · payslip and Paid tick still from the PAY tab' + (isPres() ? ' · <a style=\"cursor:pointer;text-decoration:underline\" onclick=\"pdb1742Open()\">✎ correct</a>' : '');",
   "' · <a style=\"cursor:pointer;text-decoration:underline\" onclick=\"pdb1742Open()\">✎ correct</a> · <a style=\"cursor:pointer;text-decoration:underline\" onclick=\"ps1744Open(\\'' + esc(x.name) + '\\',\\'' + (window.__pm1744 || '') + '\\')\">payslip from the database</a>';   /* 1744 */"],
]);
