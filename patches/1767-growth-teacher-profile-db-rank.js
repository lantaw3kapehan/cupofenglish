// 1767: (Misty 4 Nov 21:16 "YES" · 21:18 "everything will be from database not copying or reading from google")
//   1. Growth: rank / rate / lifetime / rank dates now come from the database rank (coe-growth v6). When the units are reached but
//      trainings are not done, Growth says so ("Junior Teacher · units reached · waiting for: …") instead of "0 more units".
//   2. Management › teacher profile: rank, rate, lifetime units and the Pay list come from the database (coe-payedit op tpay,
//      the same numbers as Payroll and the teacher's own Pay screen) instead of Google's mgmtTeacher answer.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ['<div class="small mute">${fmtU(c.next.need)} more units · every class counts</div>',
   '<div class="small mute">${c.waiting ? esc(c.waiting) + \' · ask Operations to schedule them\' : fmtU(c.next.need) + \' more units · every class counts\'}</div>'],
  ["function tchGet(name){ if(!TCHF[name]) TCHF[name] = api('mgmtTeacher', TOKEN, name).then(p => { store(",
   "async function tch1767(name, p){ try{ if(!p || typeof p !== 'object' || typeof TOKEN === 'undefined' || !TOKEN) return p;   /* 1767 · rank + pay from the database */\n" +
   "  const r = await fetch(FAST_URL + '-payedit', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, op: 'tpay', teacher: name }) }).then(x => x.json());\n" +
   "  if(!(r && r.ok)) return p; const k = r.rank || {}; p.me = p.me || {};\n" +
   "  if(k.rank || k.fixed){ if(!k.fixed) p.me.rank = k.rank; p.me.rate = +k.rate || p.me.rate; p.me.lifetime = +k.lifetime; if(k.rankDate) p.me.rankDate = k.rankDate; p.me.rankWaiting = k.waiting || ''; }\n" +
   "  if(Array.isArray(r.pay) && r.pay.length) p.pay = r.pay.map(x => Object.assign({}, x, { month: /^\\d{4}-\\d{2}$/.test(x.m || '') ? new Date(x.m + '-15').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : x.month }));\n" +
   "  p._db1767 = Date.now(); }catch(e){} return p; }\n" +
   "function tchGet(name){ if(!TCHF[name]) TCHF[name] = api('mgmtTeacher', TOKEN, name).then(p => tch1767(name, p)).then(p => { store("],
]);
