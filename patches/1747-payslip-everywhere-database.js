// 1747: (Misty 4 Nov 16:39 "In TEACHERS, the PAYSLIP is still this design") every management payslip opens the database payslip
//   (1744 design): Teachers › a teacher › Payslip, and Finance › Payroll › Payslip (choose teacher + period › Show payslip).
//   The old Google payslip stays one tap away ("Old Google payslip") while the two are compared.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["<button class=\"btn block\" style=\"margin-top:14px\" onclick=\"tabSheet('PAYSLIP','Payslip',$('psN').value,$('psP').value)\">Show payslip</button>",
   "<button class=\"btn block\" style=\"margin-top:14px\" onclick=\"ps1747Show()\">Show payslip</button><button class=\"btn ghost block\" style=\"margin-top:8px\" onclick=\"tabSheet('PAYSLIP','Payslip',$('psN').value,$('psP').value)\">Old Google payslip</button>"],
  ["</script>\n</body>\n</html>", "</script>\n" + String.raw`<script>
/* 1747 · payslips from the database everywhere in management */
(function(){
  if(window.__1747) return; window.__1747 = 1;
  window.ps1747Show = function(){ try{ const n = $('psN'), p = $('psP'); if(!n || !p) return;
    const nm = String((n.options[n.selectedIndex] || {}).textContent || '').split(' · ')[0].trim(), per = String(p.value || '').split(typeof SL2 !== 'undefined' ? SL2 : '//').join(' ');
    if(typeof ps1744Open === 'function') ps1744Open(nm, per); }catch(e){ toast('Could not open the payslip'); } };
  const p0 = window.payslip; if(typeof p0 === 'function') window.payslip = function(name){
    if(name && typeof D !== 'undefined' && D && D.mgr && typeof ps1744Open === 'function') return ps1744Open(String(name), (typeof MO !== 'undefined' && MO && MO.payMonth) || '');
    return p0.apply(this, arguments); };
  const n0 = window.payslipNow; if(typeof n0 === 'function') window.payslipNow = function(name){
    if(name && typeof D !== 'undefined' && D && D.mgr && typeof ps1744Open === 'function') return ps1744Open(String(name), (typeof MO !== 'undefined' && MO && MO.payMonth) || '');
    return n0.apply(this, arguments); };
})();
</script>
</body>
</html>`],
]);
