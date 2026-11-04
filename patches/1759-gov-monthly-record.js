// 1759: (Misty 4 Nov 18:07, GOV tab screenshots: "This is what we paid so far, it's on COE DATABASE excel … it should be in supabase
//   database") Finance › Government now shows the GOV record from the database table coe_gov (moved from the GOV tab: 36 months,
//   total ₱232,412.98, the same as the tab): month covered, date of payment, SSS, Pag-IBIG, PhilHealth, BIR, SEC, charges, total,
//   status. ✎ edits a month, + Month adds one (coe-payedit v7 op gov / govset, every change logged in coe_gov_log). Saving can also add
//   the total to Finance › Transactions as one expense line (tick box; it shows what Transactions already has that month, so a
//   payment is not counted twice). The Transactions lines stay below, folded, for checking.
const lib = require('../tools/lib.js'), fs = require('fs'), path = require('path'), file = process.argv[2];
const part = fs.readFileSync(path.join(__dirname, '1759-gov-monthly-record.part.txt'), 'utf8');
lib(file, [
  ["  const X = { rows: null, ppl: null, y: '', busy: 0 };\n  try{ const k = JSON.parse(localStorage.getItem('coe.exp') || 'null'); if(k && k.rows) X.rows = k.rows; }catch(e){}",
   "  const X = { rows: null, ppl: null, y: '', busy: 0, gov: null, gy: null };\n  try{ const k = JSON.parse(localStorage.getItem('coe.exp') || 'null'); if(k && k.rows) X.rows = k.rows; }catch(e){}"],
  ["X.ppl = r.people || []; }).catch(() => {})]);",
   "X.ppl = r.people || []; }).catch(() => {}),\n      fetch(FAST_URL + '-payedit', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, op: 'gov' }) }).then(x => x.json()).then(r => { if(r && r.ok) X.gov = r.rows || []; else if(!X.gov){ X.gov = []; toast((r && r.error) || 'Could not load Government'); } }).catch(() => { if(!X.gov){ X.gov = []; toast('Could not load Government · try again'); } })]);   /* 1759 */"],
  ["  function paint(){ const v = $('v-gov'); if(!v) return;", "  function paint(){ return paint1759(); }   /* 1759 */\n  function paint1757(){ const v = $('v-gov'); if(!v) return;"],
  ["  window.gov1757Y = y => { X.y = y; paint(); };", part + "  window.gov1757Y = y => { X.y = y; paint(); };"],
]);
