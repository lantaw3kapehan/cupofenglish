// 2181 (13 Nov · Misty 20:02 "on Finance, her Overview is like this … it has to be improved too"): Finance › Overview for the Operations
// Coordinator was one line ("Sales, costs and net are not part of this account"). It now shows her finance work at a glance, counts
// only (no company totals): Payroll (paid / verified for the pay month), Government (this month's contributions, due on the 15th),
// Payments (recorded this month and this week, confirmations issued, not linked / not emailed) and Expenses, each opening its tab.
// Data: coe-ops op finov (coe_ops_finov). The President's Overview is unchanged.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["    if(!SC()){ v.innerHTML = '<div class=\"fx\">' + head + '<div class=\"fx-card\">Sales, costs and net are not part of this account. Payroll and Transactions are in the tabs above.</div></div>'; return; }",
   "    if(!SC()){ v.innerHTML = '<div class=\"fx\">' + head + (window.fo2181Html ? fo2181Html() : '<div class=\"fx-card\">Sales, costs and net are not part of this account. Payroll and Transactions are in the tabs above.</div>') + '</div>'; if(window.fo2181Load) fo2181Load(); return; }"],
  ["</script>\n</body>\n</html>", `</script>
<style id="css2181">
.fo81{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:14px}
.fo81 .c{background:#fff;border:1px solid #ECEAF2;border-radius:16px;padding:16px 18px;display:flex;flex-direction:column;gap:8px;border-left:4px solid var(--k)}
.fo81 .t{display:flex;align-items:center;gap:8px;font:600 17px Inter,sans-serif;color:#2B2253}
.fo81 .st{margin-left:auto;font:600 12.5px Inter,sans-serif;border-radius:999px;padding:2px 9px}
.fo81 .st.ok{background:#EEF8F3;color:#1F6E4E}.fo81 .st.todo{background:#FFF6E5;color:#8A5A00}
.fo81 .big{font:600 26px Inter,sans-serif;color:#2B2253;font-variant-numeric:tabular-nums}.fo81 .big span{font:400 15px Inter,sans-serif;color:#5E5A72;margin-left:6px}
.fo81 p{margin:0;font-size:14.5px;line-height:1.5;color:#3D3760}
.fo81 button{align-self:flex-start;margin-top:auto;border:1.5px solid #00737B;background:#fff;color:#00737B;border-radius:10px;padding:6px 12px;font:600 14px Inter,sans-serif;cursor:pointer}
.fo81 .pay{--k:#00A3AD}.fo81 .gov{--k:#5B4FC4}.fo81 .sal{--k:#2E9E6F}.fo81 .exp{--k:#D4705A}
@media(max-width:700px){.fo81{grid-template-columns:1fr}}
</style>
<script id="x2181">
/* 2181 · Finance › Overview for Operations: her finance work at a glance (counts only) */
(function(){
  if(window.__x2181) return; window.__x2181 = 1;
  let F = null, at = 0, busy = 0;
  const n = v => (+v || 0).toLocaleString('en-US');
  const ML = m => { try{ return new Date(String(m).slice(0, 7) + '-15T12:00:00Z').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }); }catch(e){ return m; } };
  window.fo2181Html = function(){
    if(!F) return '<div class="fo81"><div class="sk"></div><div class="sk"></div></div>';
    const x = F, pm = ML(x.payMonth), payLeft = Math.max(0, (+x.payPeople || 0) - (+x.payPaid || 0)), gov = x.gov || {}, govPaid = !!gov.paid_on || /paid/i.test(gov.status || '');
    const pd = d => { try{ return new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }); }catch(e){ return d; } };
    const fix = [];
    if(+x.unlinked) fix.push(n(x.unlinked) + ' payment' + (+x.unlinked === 1 ? ' is' : 's are') + ' not linked to a student (see To do).');
    if(+x.notEmailed) fix.push(n(x.notEmailed) + ' payment confirmation' + (+x.notEmailed === 1 ? ' has' : 's have') + ' an email address but was not emailed yet.');
    if(+x.noEmail) fix.push(n(x.noEmail) + ' payment confirmation' + (+x.noEmail === 1 ? ' has' : 's have') + ' no email address.');
    return '<div class="fo81">'
      + '<div class="c pay"><div class="t">Payroll<span class="st ' + (payLeft ? 'todo' : 'ok') + '">' + (payLeft ? payLeft + ' to pay' : 'All paid') + '</span></div><div class="big">' + n(x.payPaid) + ' of ' + n(x.payPeople) + '<span>' + pm + ' pay released</span></div><p>' + n(x.payVerified) + ' teacher' + (+x.payVerified === 1 ? ' has' : 's have') + ' checked and verified their pay.</p><button type="button" onclick="go(\\'payroll\\')">Open Payroll</button></div>'
      + '<div class="c gov"><div class="t">Government<span class="st ' + (govPaid ? 'ok' : 'todo') + '">' + (govPaid ? 'Paid' : 'Due ' + (x.govDue || '')) + '</span></div><div class="big">' + (gov.month || ML(x.month)) + '</div><p>' + (govPaid ? 'SSS, Pag-IBIG, PhilHealth and BIR were paid' + (gov.paid_on ? ' on ' + pd(gov.paid_on) : '') + '.' : 'SSS, Pag-IBIG, PhilHealth and BIR are due on ' + (x.govDue || 'the 15th') + '. Record the payment when it is done.') + '</p><button type="button" onclick="go(\\'gov\\')">Open Government</button></div>'
      + '<div class="c sal"><div class="t">Payments<span class="st ' + (fix.length ? 'todo' : 'ok') + '">' + (fix.length ? fix.length + ' to check' : 'All in order') + '</span></div><div class="big">' + n(x.sales) + '<span>recorded in ' + (x.month || '') + '</span></div><p>' + n(x.salesWeek) + ' in the last 7 days. ' + n(x.confirmations) + ' payment confirmation' + (+x.confirmations === 1 ? '' : 's') + ' issued this month.' + (fix.length ? ' ' + fix.join(' ') : '') + '</p><button type="button" onclick="go(\\'money\\')">Open Sales &amp; costs</button></div>'
      + '<div class="c exp"><div class="t">Expenses</div><div class="big">' + n(x.expenses) + '<span>recorded in ' + (x.month || '') + '</span></div><p>Record each expense with its receipt on the day it is paid.</p><button type="button" onclick="go(\\'expenses\\')">Open Transactions</button></div>'
      + '</div>';
  };
  window.fo2181Load = function(){ if(busy || (F && Date.now() - at < 120000)) return; busy = 1;
    fetch('https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-ops', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, op: 'finov' }) })
      .then(r => r.json()).then(r => { busy = 0; if(r && r.ok && r.data){ F = r.data; at = Date.now(); const v = document.getElementById('v-finov'); const box = v && v.querySelector('.fo81'); if(box) box.outerHTML = fo2181Html(); } }).catch(() => { busy = 0; }); };
})();
</script>
</body>
</html>`],
]);
