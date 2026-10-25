// 831: (audit 25 Oct, finding 6) "Net" is labelled with what it includes on every Finance screen. No calculation changes.
// Two different measures exist and both stay as they are:
//   · Net / profit (MONEY tab) = sales − total costs, total costs = recorded expenses + net salaries (PAYROLL) + government dues.
//     Used by Finance › Overview, Sales & costs, and the Overview (home) Business card and "Month at a glance".
//   · Difference (Transactions) = sales − the expense lines listed there. It leaves out net salaries and gov dues, so it is not Net.
// Payroll's "net" is net pay (after deductions and gov contributions) — labelled "net pay" so it is not read as business net.
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
lib(file, [
  ["sales − these expenses (salaries are on Payroll)", "sales − the expense lines listed · not Net: salaries and gov dues are left out"],
  ["<small>Sales − costs' + (pv ? ' · ' + mL(pv.m, 1) + ' ' + P0(pv.net) : '') + '</small>",
   "<small>Sales − expenses − salaries − gov dues' + (pv ? ' · ' + mL(pv.m, 1) + ' ' + P0(pv.net) : '') + '</small>"],
  ["' pay · total net</span><b>' + peso(tot) + '</b><small>' + P.length + ' teachers · ' + P.reduce((a, x) => a + x.units, 0) + ' units</small></div>'",
   "' pay · total net pay</span><b>' + peso(tot) + '</b><small>' + P.length + ' teachers · ' + P.reduce((a, x) => a + x.units, 0) + ' units · after deductions and gov contributions</small></div>'"],
  ["parts.push(esc(pm) + ' profit <b>' + k(prev.net) + '</b>')", "parts.push(esc(pm) + ' profit <b>' + k(prev.net) + '</b> (after salaries and dues)')"]
]);
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 831 · what "net" includes, written where it is shown */
(function(){
  if(window.__831) return; window.__831 = 1;
  document.head.insertAdjacentHTML('beforeend', '<style>.def831{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;font-size:12.5px;line-height:1.45;color:#5E5A75;background:#F6F5FA;border-radius:10px;padding:8px 12px;margin:0 0 12px}.def831 b{color:#2f2752}.bz2-def.def831{margin:10px 0 0}</style>');
  const MONEY_DEF = '<b>Net</b> (also called profit) = sales − total costs. Total costs = recorded expenses + net salaries (PAYROLL tab) + government dues. Figures come from the MONEY tab. Transactions shows a different figure, <b>Difference</b> = sales − expense lines only.';
  // Sales & costs
  const rm = window.renderMoney;
  if(typeof rm === 'function') window.renderMoney = function(){ const r = rm.apply(this, arguments);
    try{ const v = document.getElementById('v-money'), top = v && v.querySelector('.mx-top'); if(top && !v.querySelector('.def831')) top.insertAdjacentHTML('afterend', '<div class="def831">' + MONEY_DEF + '</div>'); }catch(e){ console.warn('831', e); }
    return r; };
  // Overview (home) · Business card
  const ob = window.ovBiz;
  if(typeof ob === 'function') window.ovBiz = function(){ const h = ob.apply(this, arguments);
    return h + '<div class="def831 bz2-def"><b>Profit</b> = MONEY tab net: sales − expenses − net salaries − gov dues.</div>'; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'money' && typeof MN !== 'undefined' && MN) renderMoney(); }catch(e){}
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
