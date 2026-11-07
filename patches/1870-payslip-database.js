// 1870: (Misty 7 Nov "GO AHEAD") payslip tools from the database instead of Google Apps Script. Same screens, buttons and texts.
//   · "Ask Teacher X to check this pay": the database saves it (coe-payedit v14 op pcnudge, Google's rules and texts); Google's
//     mgmtPayVerNudge only when the database does not answer.
//   · Teacher's Pay card (tPayCheck) and Payroll pay checks (mgmtPayChecks): database only, asked twice; no Google backup.
//   · Payslip teacher list (mgmtSlipPeople) and management's own My pay (mgmtMyPay): database first (coe-payedit ops people / mgmtmypay),
//     Google only when the database does not answer. The Payslip sheet no longer pre-loads the old Google payslip (the
//     "Old Google payslip" button still opens it).
//   · Pay readiness reminder (mgmtPayNudge): the database keeps it (sys:pnudge, coe-reads); Google is no longer told.
//   (Database side: coe_pay_takeover answers tPayVerify / mgmtPayReply saves so Google does not replay them; coe_pay_checks as Google's.)
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  [`async function myPay1763(){`,
   `async function myPay1763(){ for(let i = 0; i < 2; i++){ const v = await myPay1870a(); if(v) return v; if(!i) await new Promise(z => setTimeout(z, 1500)); } throw new Error('Could not load your pay. Try again.'); }   /* 1870: the database only, asked twice */
async function myPay1870a(){`],
  [`return r.check; } }catch(e){} return api('tPayCheck', TOKEN); }`,
   `return r.check; } }catch(e){} return null; }   /* 1870: no Google backup (tPayCheck) */`],
  [`async function pchkDb1761(){`,
   `async function pchkDb1761(){ for(let i = 0; i < 2; i++){ const v = await pchkDb1870a(); if(v) return v; if(!i) await new Promise(z => setTimeout(z, 1500)); } throw new Error('Could not load the pay checks. Try again.'); }   /* 1870: the database only, asked twice */
async function pchkDb1870a(){`],
  [`return { month: r.month, checks: r.checks || {}, nudged: r.nudged || {}, src: 'database' }; }catch(e){} return api('mgmtPayChecks', TOKEN); }`,
   `return { month: r.month, checks: r.checks || {}, nudged: r.nudged || {}, src: 'database' }; }catch(e){} return null; }   /* 1870: no Google backup (mgmtPayChecks) */`],
  [`try{ const r = await api('mgmtPayVerNudge', TOKEN, names); if(!r.ok) throw r; toast('✓ ' + r.note + ' · they see it on Pay and Today');`,
   `try{ let r = null; try{ r = await fetch(FAST_URL + '-payedit', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, op: 'pcnudge', names }) }).then(x => x.json()); }catch(x){}   /* 1870: the database saves it */
  if(!r || !r.ok || r.n == null) r = await api('mgmtPayVerNudge', TOKEN, names);   /* the database did not answer: Google as before */
  if(!r.ok) throw r; toast('✓ ' + r.note + ' · they see it on Pay and Today');`],
  [`  try{ await fetch(FAST_URL + '-payedit', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, op: 'pcnudge', month: (typeof MO !== 'undefined' && MO && MO.payMonth) || (PCKM && PCKM.month) || '', names }) }); }catch(x){}   /* 1761 */
`, ``],
  [`try{ const f = await api('mgmtSlipPeople', TOKEN);`,
   `try{ const f = await (async () => { try{ const r = await fetch(FAST_URL + '-payedit', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, op: 'people' }) }).then(x => x.json()); if(r && r.ok && Array.isArray(r.data) && r.data.length) return r.data; }catch(x){} return api('mgmtSlipPeople', TOKEN); })();   /* 1870: database first */`],
  [`function psPre(){ const n = $('psN'), p = $('psP'); if(n && p && n.value && !docHave('PAYSLIP', n.value, p.value)) docGet('PAYSLIP', n.value, p.value).catch(()=>{}); }`,
   `function psPre(){}   /* 1870: the payslip comes from the database; the old Google payslip loads only when its button is tapped */`],
  [`(quiet && typeof bg === 'function' ? bg(() => api('mgmtMyPay', TOKEN)) : api('mgmtMyPay', TOKEN))`,
   `(quiet && typeof bg === 'function' ? bg(() => myPay1870()) : myPay1870())`],
  [`let MYP = null;`,
   `let MYP = null;
async function myPay1870(){ try{ const r = await fetch(FAST_URL + '-payedit', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, op: 'mgmtmypay' }) }).then(x => x.json());
  if(r && r.ok && r.data && Array.isArray(r.data.pay)) return r.data; }catch(e){} return api('mgmtMyPay', TOKEN); }   /* 1870: management's own pay from the database; Google only if it does not answer */`],
  [`if(fn === 'mgmtPayNudge') apiOnce('mgmtPayNudge', a, 45000, '').catch(() => {});   /* Google keeps its own copy of the reminder */`,
   `if(fn === 'mgmtPayNudge'){}   /* 1870: the database keeps the reminder (sys:pnudge); Google is no longer told */`]]);
