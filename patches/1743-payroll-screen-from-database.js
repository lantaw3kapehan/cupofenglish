// 1743: (Misty 4 Nov 16:03 "SWITCH NOW, I will check Julia, Rose and Cy later") the Payroll screen shows the database's pay
//   (coe-payedit › coe_pay_calc, with the President's corrections) instead of the PAY tab's: units, rate, lesson pay, base, bonus,
//   deductions, dues and net per person; paid / ready status stays as before. A person whose net differs from the PAY tab shows
//   "PAY tab ₱…" on their card. Payslip PDF, "Paid" tick and the teachers' own Pay screen still come from the PAY tab (Google).
//   Off on one device: localStorage coe.paydb = '0'.
const file = process.argv[2];
const js = String.raw`<script>
/* 1743 · Payroll screen from the database */
(function(){
  if(window.__1743) return; window.__1743 = 1;
  const MN = ['january','february','march','april','may','june','july','august','september','october','november','december'];
  let DB = null, at = 0, busy = false, ym = '';
  const off = () => { try{ return localStorage.getItem('coe.paydb') === '0'; }catch(e){ return false; } };
  const monthOf = t => { const m = String(t || '').match(/([A-Za-z]+)\s+(\d{4})/); if(!m) return ''; const i = MN.findIndex(x => x.startsWith(m[1].toLowerCase().slice(0, 3))); return i < 0 ? '' : m[2] + '-' + ('0' + (i + 1)).slice(-2); };
  function load(){ if(busy || off() || !TOKEN || !(D && D.mgr) || typeof MO === 'undefined' || !MO) return; const m = monthOf(MO.payMonth); if(!m) return;
    if(m === ym && Date.now() - at < 120000) return; busy = true;
    fetch(FAST_URL + '-payedit', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'month', month: m, token: TOKEN }) }).then(x => x.json())
      .then(r => { if(r && r.ok){ DB = r; ym = m; at = Date.now(); if(typeof VIEW !== 'undefined' && VIEW === 'payroll') renderPayroll(); } })
      .catch(() => {}).finally(() => { busy = false; }); }
  window.payDbReload1743 = function(){ at = 0; load(); };
  function apply(){ if(off() || !DB || typeof MO === 'undefined' || !MO || !Array.isArray(MO.payroll) || monthOf(MO.payMonth) !== ym) return false;
    const by = {}; (DB.rows || []).forEach(r => { by[String(r.teacher).toLowerCase()] = r; });
    const seen = {};
    MO.payroll.forEach(x => { const r = by[String(x.name || '').toLowerCase()]; if(!r) return; seen[String(r.teacher).toLowerCase()] = 1;
      if(x._sheet == null) x._sheet = { units: x.units, rate: x.rate, lessonPay: x.lessonPay, base: x.base, bonus: x.bonus, deduct: x.deduct, gov: x.gov, net: x.net };
      const gid = (DB.people || []).some(p => String(p.teacher).toLowerCase() === String(r.teacher).toLowerCase() && p.gov_in_deduct);
      Object.assign(x, { units: +r.reg + +r.sub + +r.trial, rate: (r.courses || []).length ? r.courses.map(c => c.rate).join(' / ') : +r.rate, lessonPay: +r.lesson_pay, base: +r.base, bonus: +r.bonus,
        deduct: +r.deduct, gov: gid ? 0 : +r.sss + +r.pagibig + +r.philhealth, net: +r.net, _db: 1, _edits: (r.edited || []).length }); });
    (DB.rows || []).forEach(r => { const k = String(r.teacher).toLowerCase(); if(seen[k] || !(+r.net > 0)) return;
      MO.payroll.push({ name: r.teacher, units: +r.reg + +r.sub + +r.trial, rate: +r.rate, lessonPay: +r.lesson_pay, base: +r.base, bonus: +r.bonus, deduct: +r.deduct, gov: +r.sss + +r.pagibig + +r.philhealth, net: +r.net, paid: false, _db: 1, _sheet: null, _edits: (r.edited || []).length }); });
    return true; }
  function marks(){ try{ const v = $('v-payroll'); if(!v || off() || !DB || monthOf(MO.payMonth) !== ym) return; const sub = v.querySelector('.lead .mute.small');
      if(sub && !/database/.test(sub.textContent)) sub.textContent = sub.textContent.replace('from the PAY tab', 'from the database') + (/database/.test(sub.textContent) ? '' : '');
      v.querySelectorAll('.pr-k').forEach((a, i) => { const x = MO.payroll[i]; if(!x || a.querySelector('.pdiff1743')) return; const s = x._sheet;
        if(s && Math.abs((+s.net || 0) - (+x.net || 0)) > 0.009){ const d = document.createElement('span'); d.className = 'pdiff1743 small'; d.style.cssText = 'display:block;color:#9A4330;margin-top:2px'; d.textContent = 'PAY tab ' + peso(s.net) + ' · differs'; (a.querySelector('.pr-h .grow') || a).appendChild(d); }
        else if(!s){ const d = document.createElement('span'); d.className = 'pdiff1743 small'; d.style.cssText = 'display:block;color:#9A4330;margin-top:2px'; d.textContent = 'not in the PAY tab'; (a.querySelector('.pr-h .grow') || a).appendChild(d); } }); }catch(e){} }
  const r0 = window.renderPayroll; if(typeof r0 === 'function') window.renderPayroll = function(){ load(); apply(); const r = r0.apply(this, arguments); marks(); setTimeout(marks, 0); return r; };
  const p0 = window.payRow; if(typeof p0 === 'function') window.payRow = function(i){ const r = p0.apply(this, arguments);
    try{ const x = MO.payroll[i], b = $('sheetBody'); if(x && x._db && b && !b.querySelector('.pdbn1743')){ const s = x._sheet, n = document.createElement('div'); n.className = 'mini pdbn1743'; n.style.marginTop = '10px';
      n.innerHTML = 'From the database' + (x._edits ? ' · ' + x._edits + ' correction' + (x._edits > 1 ? 's' : '') : '') + (s ? ' · PAY tab net ' + peso(s.net) + (Math.abs(s.net - x.net) > 0.009 ? ' (differs)' : ' (same)') : ' · not in the PAY tab') + ' · payslip and Paid tick still from the PAY tab' + (isPres() ? ' · <a style="cursor:pointer;text-decoration:underline" onclick="pdb1742Open()">✎ correct</a>' : '');
      const t = b.querySelector('table'); if(t) t.after(n); else b.appendChild(n); } }catch(e){} return r; };
  const s0 = window.pdb1742Save, u0 = window.pdb1742Undo;
  if(s0) window.pdb1742Save = async function(){ const r = await s0.apply(this, arguments); window.payDbReload1743(); return r; };
  if(u0) window.pdb1742Undo = async function(){ const r = await u0.apply(this, arguments); window.payDbReload1743(); return r; };
})();
</script>
</body>
</html>`;
require('../tools/lib.js')(file, [["</script>\n</body>\n</html>", "</script>\n" + js]]);
