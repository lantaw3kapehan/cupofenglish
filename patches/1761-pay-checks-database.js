// 1761: (Misty 4 Nov 18:32 "yes, since our goal it should be supabase database now not reading on google") Management's Payroll reads
//   the teachers' pay checks (✓ This is correct / Something's wrong / replies / "asked to check") from the database (coe-payedit op checks,
//   table coe_pay_check_ev, filled the moment a teacher taps from the save queue) instead of Google; refreshes every 20 s instead of 3 min.
//   "Ask … to check this pay" is also recorded in the database. If the database does not answer, the app falls back to Google as before.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["async function loadPayChecks(force){ if(!force && window._pckAt && Date.now() - window._pckAt < 3 * 6e4) return; window._pckAt = Date.now(); try{ await swr('paychkm', () => api('mgmtPayChecks', TOKEN),",
   "async function pchkDb1761(){ try{ const mo = (typeof MO !== 'undefined' && MO && MO.payMonth) || ''; const r = await fetch(FAST_URL + '-payedit', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, op: 'checks', month: /^[A-Za-z]+ \\d{4}$/.test(mo) ? mo : '' }) }).then(x => x.json());   /* 1761: database first */\n" +
   "  if(r && r.ok && r.checks) return { month: r.month, checks: r.checks || {}, nudged: r.nudged || {}, src: 'database' }; }catch(e){} return api('mgmtPayChecks', TOKEN); }\n" +
   "async function loadPayChecks(force){ if(!force && window._pckAt && Date.now() - window._pckAt < 2e4) return; window._pckAt = Date.now(); try{ await swr('paychkm', () => pchkDb1761(),"],
  ["try{ const r = await api('mgmtPayVerNudge', TOKEN, names); if(!r.ok) throw r; toast('✓ ' + r.note + ' · they see it on Pay and Today'); loadPayChecks(1); }",
   "try{ const r = await api('mgmtPayVerNudge', TOKEN, names); if(!r.ok) throw r; toast('✓ ' + r.note + ' · they see it on Pay and Today');\n" +
   "  try{ await fetch(FAST_URL + '-payedit', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, op: 'pcnudge', month: (typeof MO !== 'undefined' && MO && MO.payMonth) || (PCKM && PCKM.month) || '', names }) }); }catch(x){}   /* 1761 */\n" +
   "  loadPayChecks(1); }"],
  ["</body>\n</html>",
   "<script>/* 1761 · while Payroll is open, teachers' checks show within 20 seconds */ setInterval(function(){ try{ if(typeof VIEW !== 'undefined' && VIEW === 'payroll' && !document.hidden && typeof D !== 'undefined' && D && D.mgr && typeof loadPayChecks === 'function') loadPayChecks(); }catch(e){} }, 20000);</script>\n</body>\n</html>"],
]);
