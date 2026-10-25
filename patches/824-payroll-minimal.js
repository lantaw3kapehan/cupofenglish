// 824: (Misty) Finance redesign brief · Payroll: "keep the monthly total, teacher count, payment status and historical trend;
//      move secondary statistics into a collapsible Payroll Insights section; clearly label all payroll rate calculations".
// · The big summary card + three coloured mini-cards → one compact KPI strip:
//   month running: <Month> accrued so far (n teachers, paid after month end) · <Last month> pay disbursed (✓ all n paid) · Still to pay
//   pay month open: <Month> pay · Released (x of n paid) · Ready to release · Still to pay.
// · The 12-month chart: full width, shorter, one calm colour (this month striped as before), month click still opens the history.
// · "Payroll insights" (closed): where pay goes · average pay per unit (both formulas written out) · top 3 earners · biggest change
//   · largest so far this month.
// · Figures in a clean sans-serif with tabular numerals; spacing ~20% tighter. Payslips, Mark paid, search, filters, history unchanged.
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
lib(file, [
  ["<em>Average lesson rate</em><b>' + (un ? peso(Math.round(lp / un)) : '—') + '<small style=\"display:inline;font-size:13px;color:#8A86A0\"> per unit</small></b><small>lesson pay ÷ ' + un + ' units · with bonuses ' + (un ? peso(Math.round((lp + bon) / un)) : '—') + ' · ' + P.filter(x => num(x.units) > 0).length + ' teaching</small></div>'",
   "<em>Average pay per unit · ' + mo.split(' ')[0] + '</em><b>' + (un ? peso(Math.round(lp / un)) : '—') + '<small style=\"display:inline;font-size:13px;color:#8A86A0\"> lesson pay ÷ units</small></b><small>' + peso(Math.round(lp)) + ' lesson pay ÷ ' + un + ' units</small><small>With bonuses: <b style=\"display:inline;font-size:13px\">' + (un ? peso(Math.round((lp + bon) / un)) : '—') + '</b> = (lesson pay + ' + peso(Math.round(bon)) + ' bonuses) ÷ ' + un + ' units · ' + P.filter(x => num(x.units) > 0).length + ' teaching</small></div>'"]
]);
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 824 · Payroll, minimal */
(function(){
  if(window.__824 || typeof renderPayroll !== 'function') return; window.__824 = 1;
  const SANS = '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
  document.head.insertAdjacentHTML('beforeend', '<style>' + [
    '#v-payroll.p824 .py-hero{display:none!important}#v-payroll.p824 .bd63{display:block!important}',
    '#v-payroll .k824{display:grid;grid-template-columns:repeat(var(--n,3),minmax(0,1fr));background:#fff;border:1px solid #E9E7F0;border-radius:14px;margin:0 0 12px;overflow:hidden}',
    '#v-payroll .k824>div{padding:12px 16px;border-left:1px solid #E9E7F0;min-width:0}#v-payroll .k824>div:first-child{border-left:0}',
    '#v-payroll .k824 span{display:block;font-size:11.5px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#7C7893}',
    '#v-payroll .k824 b{display:block;font-family:' + SANS + ';font-variant-numeric:tabular-nums;font-size:22px;font-weight:700;color:#2f2752;margin-top:3px;white-space:nowrap}',
    '#v-payroll .k824 small{display:block;font-family:' + SANS + ';font-size:12px;color:#7C7893;margin-top:3px}',
    '#v-payroll .t824{display:inline-block;font-size:11px;font-weight:700;border-radius:999px;padding:1px 8px}#v-payroll .t824.ok{background:#E8F4EE;color:#2E7D5B}#v-payroll .t824.ac{background:#FFF5E6;color:#97600F}#v-payroll .t824.no{background:#FBEDEA;color:#B5533C}',
    '#v-payroll .pm60{margin:0 0 12px!important;padding:10px 16px 8px!important;border-radius:14px!important;box-shadow:none!important;border:1px solid #E9E7F0!important}',
    '#v-payroll .pm60 .cs{height:96px!important;min-height:0!important;padding-top:18px!important}#v-payroll .pm60 .cs i{background:#9FCDBC}#v-payroll .pm60 .cs>div:hover i{background:#2E7D5B;outline:0!important}',
    '#v-payroll .pm60 .cs b{font-family:' + SANS + ';font-weight:600;font-size:10px;color:#5E5A75}',
    '#v-payroll details.pi824{background:#fff;border:1px solid #E9E7F0;border-radius:14px;margin:0 0 12px}#v-payroll details.pi824>summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:8px;padding:11px 16px;font-weight:700;color:#2f2752;font-size:14.5px}',
    '#v-payroll details.pi824>summary::-webkit-details-marker{display:none}#v-payroll details.pi824>summary small{font-weight:400;color:#7C7893;font-size:12.5px}#v-payroll details.pi824>summary .ch{margin-left:auto;color:#A3A0B5;transition:transform .2s}#v-payroll details.pi824[open]>summary .ch{transform:rotate(90deg)}',
    '#v-payroll details.pi824 .in63{margin:0!important;padding:0 12px 12px;grid-template-columns:repeat(auto-fit,minmax(200px,1fr))!important}#v-payroll details.pi824 .in63>div{border-radius:12px!important;box-shadow:none!important}',
    '#v-payroll .in63 b{font-family:' + SANS + '!important;font-variant-numeric:tabular-nums;font-weight:700!important;font-size:19px!important}#v-payroll .in63 em{color:#7C7893!important}',
    '#v-payroll .py-net,#v-payroll .py-h table,#v-payroll .py-h summary .t,#v-payroll .py-n small{font-family:' + SANS + ';font-variant-numeric:tabular-nums}',
    '#v-payroll .py-row{padding-top:9px!important;padding-bottom:9px!important}#v-payroll .py-cap{margin-top:14px!important;margin-bottom:6px!important}#v-payroll .py-find{margin:4px 0 10px!important}',
    '@media(max-width:760px){#v-payroll .k824{grid-template-columns:1fr 1fr}#v-payroll .k824>div:nth-child(3){border-left:0}#v-payroll .k824>div:nth-child(n+3){border-top:1px solid #E9E7F0}#v-payroll .k824 b{font-size:18px}}'].join('') + '</style>');
  const T = x => String(x == null ? '' : x).trim(), num = v => { const n = parseFloat(String(v || '').replace(/[^\d.\-]/g, '')); return isNaN(n) ? 0 : n; };
  function cur(){ if(typeof PL === 'undefined' || !PL || !PL.rows) return null; const H = PL.head, c = k => H.findIndex(h => T(h).toUpperCase() === k);
    const iN = c('TEACHER NAME'), iM = c('MONTH'), iNet = c('NET SALARY'), iS = c('STATUS'); if(iN < 0 || iM < 0) return null;
    const label = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const rows = PL.rows.filter(r => T(r[iN]) && plMonth(r[iM]) === label).map(r => ({ name: T(r[iN]), net: num(r[iNet]), paid: /paid/i.test(r[iS]) }));
    return rows.length ? { label, rows } : null; }
  function post(){ const v = $('v-payroll'); if(!v) return; const P = (typeof MO !== 'undefined' && MO && MO.payroll) || []; if(!P.length) return;
    const pm = (MO && MO.payMonth) || 'Last month', tot = P.reduce((a, x) => a + x.net, 0), paid = P.filter(x => x.paid), owed = tot - paid.reduce((a, x) => a + x.net, 0);
    const now = v.classList.contains('py-now') && $('pyCur'), C = now ? cur() : null;
    let cells;
    if(C){ const t = C.rows.reduce((a, x) => a + x.net, 0), L = C.rows.slice().sort((a, b) => b.net - a.net)[0];
      cells = ['<div><span>' + esc(C.label) + ' · accrued so far</span><b>' + peso(t) + '</b><small>' + C.rows.length + ' teachers · <span class="t824 ac">Not paid yet</span> paid after month end</small></div>',
        '<div><span>' + esc(pm) + ' pay · disbursed</span><b>' + peso(tot - owed) + '</b><small><span class="t824 ok">✓ All ' + P.length + ' paid</span></small></div>',
        '<div><span>Still to pay</span><b>' + peso(owed) + '</b><small>' + (owed ? (P.length - paid.length) + ' teachers' : 'nothing owed for ' + esc(pm)) + '</small></div>'];
      v.dataset.lg = L ? peso(L.net) + '|' + tName(L.name) + '|' + C.label : ''; }
    else { const RD = typeof RDY !== 'undefined' && RDY ? P.filter(x => !x.paid && rdyN(x.name) === 0) : null;
      cells = ['<div><span>' + esc(pm) + ' pay · total net</span><b>' + peso(tot) + '</b><small>' + P.length + ' teachers · ' + P.reduce((a, x) => a + x.units, 0) + ' units</small></div>',
        '<div><span>Disbursed</span><b>' + peso(tot - owed) + '</b><small><span class="t824 ' + (paid.length === P.length ? 'ok' : 'ac') + '">' + paid.length + ' of ' + P.length + ' paid</span></small></div>',
        '<div><span>Ready to release</span><b>' + (RD ? peso(RD.reduce((a, x) => a + x.net, 0)) : '—') + '</b><small>' + (RD ? RD.length + ' teachers, all checks done' : 'checking…') + '</small></div>',
        '<div><span>Still to pay</span><b>' + peso(owed) + '</b><small>' + (owed ? '<span class="t824 no">' + (P.length - paid.length) + ' teachers</span>' : 'all paid') + '</small></div>'];
      v.dataset.lg = ''; }
    const html = '<div class="k824" style="--n:' + cells.length + '">' + cells.join('') + '</div>';
    const bd = v.querySelector('.bd63') || v.querySelector('.pm60') || v.querySelector('.py-hero'); if(!bd) return;
    const old = v.querySelector('.k824'); if(old) old.outerHTML = html; else bd.insertAdjacentHTML('beforebegin', html);
    v.classList.add('p824');
    const ins = v.querySelector('.in63');
    if(ins && !ins.closest('details.pi824')){ const d = document.createElement('details'); d.className = 'pi824'; d.innerHTML = '<summary>Payroll insights <small>where pay goes · pay per unit · top earners · biggest change</small><span class="ch">›</span></summary>'; ins.before(d); d.appendChild(ins); }
    if(ins && v.dataset.lg && !ins.querySelector('.lg824')){ const [a, n, l] = v.dataset.lg.split('|'); ins.insertAdjacentHTML('beforeend', '<div class="lg824" style="--c:#2f2752"><em>Largest so far · ' + esc(l.split(' ')[0]) + '</em><b>' + esc(a) + '</b><small>' + esc(n) + ' · accrued, not paid yet</small></div>'); } }
  ['renderPayroll', 'payLedger', 'payFind'].forEach(f => { const o = window[f]; if(typeof o === 'function') window[f] = function(){ const r = o.apply(this, arguments); try{ post(); }catch(e){ console.warn('824', e); } return r; }; });
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'payroll') renderPayroll(); }catch(e){}
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
