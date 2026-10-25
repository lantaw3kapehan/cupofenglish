// 845: Rows that look like duplicates say what makes them different (audit #9). Display only; nothing merged or removed.
// Payroll: PAYROLL has two rows a month for Teacher Virgo, one at ₱500 and one at ₱350 per lesson (PAY shows them together
// as "₱500 / ₱350"). The "so far this month" list and Payroll history showed both as just "Virgo" with different amounts.
// · When a teacher has more than one row in the same month, each row now also shows "₱500 per lesson · 2 units" (from that
//   row's RATE PER LESSON and REG + SUB + TRIAL UNITS), matched to its PAYROLL row by name and net amount. Single rows unchanged.
// · Payroll history month line: "14 teachers" counted rows → "13 teachers · 14 rows" when they differ.
// Database: a student with several DATABASE rows (trial row, enrolment, renewals) showed identical lines.
// · Each such line now adds "row 2 of 3 · sheet row 57 · first class 22 Sep 2026 · 15 lessons" (or "trial only").
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 845 · same-name rows: show the field that tells them apart */
(function(){
  if(window.__845) return; window.__845 = 1;
  document.head.insertAdjacentHTML('beforeend', '<style>.d845{display:block;font-size:12px;color:#7C7893;font-weight:500;margin-top:1px;font-variant-numeric:tabular-nums}.py-n small.d845{display:block}</style>');
  const T = x => String(x == null ? '' : x).trim(), num = v => { const n = parseFloat(String(v || '').replace(/[^\d.\-]/g, '')); return isNaN(n) ? 0 : n; };
  const pesoR = v => { const n = num(v); return n ? '₱' + n.toLocaleString('en-US', { maximumFractionDigits: 2 }) : ''; };
  function cols(){ if(typeof PL === 'undefined' || !PL || !PL.head) return null; const H = PL.head, c = k => H.findIndex(h => T(h).toUpperCase() === k);
    return { iN: c('TEACHER NAME'), iM: c('MONTH'), iR: c('RATE PER LESSON'), iU: [c('REG UNITS'), c('SUB UNITS'), c('TRIAL UNITS')] }; }
  function why(r, C){ const u = C.iU.filter(j => j > -1).reduce((a, j) => a + num(r[j]), 0), rt = C.iR > -1 ? pesoR(r[C.iR]) : '';
    return [rt ? rt + ' per lesson' : '', u + ' unit' + (u === 1 ? '' : 's')].filter(Boolean).join(' · '); }
  const qv = () => ((document.getElementById('prq') || {}).value || '').trim().toLowerCase();
  const nm = s2 => T(s2).toLowerCase().replace(/^teacher\s+/, '');
  function payroll(){ const C = cols(); if(!C || C.iN < 0 || C.iM < 0) return; const q = qv();
    /* "so far this month" list (#pyCur): rows are matched by name and amount (other steps re-sort and re-word them) */
    const cur = document.getElementById('pyCur');
    if(cur){ const label = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }), iNet = PL.head.findIndex(h => T(h).toUpperCase() === 'NET SALARY');
      const R = PL.rows.filter(r => T(r[C.iN]) && plMonth(r[C.iM]) === label);
      const n = {}; R.forEach(r => { const k = nm(r[C.iN]); n[k] = (n[k] || 0) + 1; });
      const used = new Set();
      [...cur.querySelectorAll(':scope > .py-row')].forEach(d => { const b = d.querySelector('.py-n b'), k = nm(b && b.textContent), net = num((d.querySelector('.py-net') || {}).textContent);
        const old = d.querySelector('.d845'); if(!k || !(n[k] > 1)){ if(old) old.remove(); return; }
        const r = R.find(x => !used.has(x) && nm(x[C.iN]) === k && Math.abs(num(x[iNet]) - net) < 0.01); if(!r){ if(old) old.remove(); return; } used.add(r);
        const t = why(r, C); if(old && old.textContent === t) return; if(old) old.remove();
        const sm = d.querySelector('.py-n small'); (sm || b).insertAdjacentHTML('afterend', '<small class="d845">' + esc(t) + '</small>');
        d.title = tName(T(r[C.iN])) + ' has ' + n[k] + ' PAYROLL rows this month (different rates) · this one: ' + t; }); }
    /* Payroll history (#plList): same grouping as payLedger */
    const box = document.getElementById('plList'); if(!box) return;
    const G = [], by = {};
    PL.rows.forEach(r => { const name = T(r[C.iN]), mo = plMonth(r[C.iM]); if(q && !nm(name).includes(q) && !mo.toLowerCase().includes(q) && !T(r[C.iM]).toLowerCase().includes(q)) return;
      let g = by[mo]; if(!g){ g = by[mo] = { mo, rows: [] }; G.push(g); } g.rows.push(r); });
    const D = [...box.querySelectorAll(':scope > details.py-h')];
    D.forEach(d => { const b = d.querySelector('summary b'), g = b && by[b.textContent.trim()]; if(!g) return;
      const n = {}; g.rows.forEach(r => { const k = nm(r[C.iN]); n[k] = (n[k] || 0) + 1; }); const people = Object.keys(n).length;
      const sm = d.querySelector('summary small:not(.s)'); if(sm && people !== g.rows.length){ const t = people + ' teacher' + (people === 1 ? '' : 's') + ' · ' + g.rows.length + ' rows'; if(sm.textContent !== t){ sm.textContent = t; sm.title = 'Some teachers have more than one PAYROLL row this month (e.g. two rates)'; } }
      const TR = [...d.querySelectorAll('table tr')]; if(TR.length !== g.rows.length) return;
      TR.forEach((tr, k) => { const r = g.rows[k], td = tr.querySelector('td'); if(!td || n[nm(r[C.iN])] < 2 || td.querySelector('.d845')) return;
        if(nm(td.textContent) !== nm(r[C.iN])) return; td.insertAdjacentHTML('beforeend', '<small class="d845">' + esc(why(r, C)) + '</small>'); }); }); }
  ['renderPayroll', 'payLedger', 'payFind'].forEach(f => { const o = window[f]; if(typeof o === 'function') window[f] = function(){ const r = o.apply(this, arguments); try{ payroll(); }catch(e){ console.warn('845', e); } return r; }; });

  /* Database list: several rows for one code */
  const MS3 = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const day = v => { v = T(v); let m = v.match(/^(\d{4})-(\d{2})-(\d{2})/); if(m) return +m[3] + ' ' + MS3[+m[2] - 1] + ' ' + m[1]; return v.replace(/-/g, ' ').replace(/\/\/+/g, ' '); };
  function db(){ const v = document.getElementById('v-db'); if(!v || typeof DB === 'undefined' || !DB || !DB.rows) return;
    const cnt = {}, pos = {}; DB.rows.forEach((r, k) => { const c = T(r[0]).toUpperCase(); if(!c) return; cnt[c] = (cnt[c] || 0) + 1; pos[k] = cnt[c]; });
    v.querySelectorAll('.li[onclick^="dbRow("]').forEach(li => { const k = +((li.getAttribute('onclick').match(/dbRow\((\d+)\)/) || [])[1]); const r = DB.rows[k]; if(!r) return;
      const c = T(r[0]).toUpperCase(); if(!c || cnt[c] < 2 || li.querySelector('.d845')) return;
      const fc = T(r[16]), les = T(r[17]), tr = T(r[10]), sheetRow = r[r.length - 1];
      const bits = ['row ' + pos[k] + ' of ' + cnt[c], /^\d+$/.test(String(sheetRow)) ? 'sheet row ' + sheetRow : '', fc ? 'first class ' + day(fc) : tr ? 'trial ' + day(tr) + ' only' : '', les ? les + ' lessons' : ''].filter(Boolean);
      const g = li.querySelector('.grow'); if(g) g.insertAdjacentHTML('beforeend', '<span class="d845" title="This student code has ' + cnt[c] + ' rows in DATABASE (trial, enrolment, renewals). Nothing is merged.">' + esc(bits.join(' · ')) + '</span>'); }); }
  const rd = window.renderDb; if(typeof rd === 'function') window.renderDb = function(){ const r = rd.apply(this, arguments); try{ db(); }catch(e){ console.warn('845 db', e); } return r; };
  try{ payroll(); db(); }catch(e){}
})();
</script>` + s.slice(i);
fs.writeFileSync(file, s);
lib(file, []);
