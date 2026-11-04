// 1746: (Misty 4 Nov 16:29–16:31 "the payroll in FINANCE is better and more detailed than the one on teacher's payslip"; Mia missing in
//   Lessons counted) · teachers' Pay › a month › "My payslip" opens the same detailed payslip from the database (their own only, through
//   coe-payedit op myslip, without internal notes); management keeps editing. Lessons counted says where October+ lessons come from.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["    let S = null; try{ S = await call({ op: 'slip', month: ym, teacher: name }); }catch(e){}",
   "    const MG = !!(typeof D !== 'undefined' && D && D.mgr);   /* 1746: a teacher sees only her own (myslip) */\n    let S = null; try{ S = await call(MG ? { op: 'slip', month: ym, teacher: name } : { op: 'myslip', month: ym }); }catch(e){}"],
  ["<button class=\"btn sm ghost\" onclick=\"pdb1742Open()\">‹ Payroll list</button></div>'\n      + '<details class=\"card\"",
   "' + (MG ? '<button class=\"btn sm ghost\" onclick=\"pdb1742Open()\">‹ Payroll list</button>' : '') + '</div>'\n      + (MG ? '<details class=\"card\""],
  ["'\\')\">Save payslip details</button></details>'",
   "'\\')\">Save payslip details</button></details>' : '')"],
  ["The students behind the payslip units. Regular lessons come from the month\\'s DAILY tab, trials and subs from TC&amp;SUB; each total is checked against PAYROLL.",
   "The students behind the payslip units. From October 2026 regular lessons come from the classes held (calendar, the same as payroll); earlier months from the DAILY tab. Trials and subs from TC&amp;SUB; each total is checked against the payslip."],
]);
// the teacher's month sheet gets a "My payslip" button
require('../tools/lib.js')(file, [["</script>\n</body>\n</html>", "</script>\n" + String.raw`<script>
/* 1746 · teacher Pay › My payslip (from the database) */
(function(){
  if(window.__1746) return; window.__1746 = 1;
  const p0 = window.paySheet; if(typeof p0 !== 'function') return;
  window.paySheet = function(p){ const r = p0.apply(this, arguments);
    try{ if(typeof D !== 'undefined' && D && !D.mgr && p && typeof ps1744Open === 'function'){ const b = $('sheetBody'); if(b && !b.querySelector('.myps1746')){
      const ym = String(p.m || '').match(/^\d{4}-\d{2}/) ? String(p.m).slice(0, 7) : String(p.month || '');
      const btn = document.createElement('button'); btn.className = 'btn block myps1746'; btn.style.marginTop = '14px'; btn.textContent = 'My payslip →';
      btn.onclick = () => ps1744Open((D.me && D.me.name) || '', ym); b.appendChild(btn); } } }catch(e){}
    return r; };
})();
</script>
</body>
</html>`]]);
