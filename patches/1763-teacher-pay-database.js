// 1763: (Misty 4 Nov 19:25 "YES GO AHEAD NOW") Teachers' Pay screen and the ✔ Paid tick from the database:
//   · Teacher › Pay: the "please check" card and the pay history come from coe-payedit op mypay (coe_tpay: October onward worked out by
//     the database's payroll, earlier months from the copy of the old PAYROLL kept in the database, paid / paid date from coe_pay_paid,
//     checks and reminders from coe_pay_check_ev). If the database does not answer, Google's numbers are used as before.
//   · Management › Payroll: ✔ Paid comes from the database (coe_pay_paid, filled the moment ✔ is tapped through the save queue).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["async function loadPayCheck(){ if(!TOKEN) return; try{ await swr('paychk', () => api('tPayCheck', TOKEN),",
   "async function myPay1763(){ try{ const r = await fetch(FAST_URL + '-payedit', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, op: 'mypay' }) }).then(x => x.json());   /* 1763: database first */\n" +
   "  if(r && r.ok && r.check){ window.MYPAY1763 = { pay: r.pay || [], at: Date.now() }; try{ if(typeof D !== 'undefined' && D && !D.mgr) D.pay = r.pay || []; }catch(e){} return r.check; } }catch(e){} return api('tPayCheck', TOKEN); }\n" +
   "async function loadPayCheck(){ if(!TOKEN) return; try{ await swr('paychk', () => myPay1763(),"],
  ["function renderPay(){", "function renderPay(){ try{ if(window.MYPAY1763 && typeof D !== 'undefined' && D && !D.mgr) D.pay = MYPAY1763.pay; }catch(e){}   /* 1763 */"],
  ["const x = MO.payroll[i], to = !x.paid; x.paid = to;", "const x = MO.payroll[i], to = !x.paid; x.paid = to; x._pt = Date.now();   /* 1763 */"],
  ["try{ const r = await q[x.name]; if(!r.ok) throw r; }", "try{ const r = await q[x.name]; if(!r.ok) throw r; try{ setTimeout(() => { if(window.payDbReload1743) payDbReload1743(); }, 1500); }catch(y){} }"],
  ["deduct: +r.deduct, gov: gid ? 0 : +r.sss + +r.pagibig + +r.philhealth, net: +r.net, _db: 1, _edits: (r.edited || []).length }); });",
   "deduct: +r.deduct, gov: gid ? 0 : +r.sss + +r.pagibig + +r.philhealth, net: +r.net, _db: 1, _edits: (r.edited || []).length });\n" +
   "      if(r.paid != null && !(x._pt && Date.now() - x._pt < 120000)) x.paid = !!r.paid; });   /* 1763: ✔ Paid from the database */"],
]);
