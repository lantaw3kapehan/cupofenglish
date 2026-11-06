// 1801: (Misty 6 Nov 15:37: "putting her length new for the first 6 months is also better") The New rate also applies in the
//   teacher's first 6 months with us (start date in the team list, staff.start_date), counted to the day of the notice.
//   New = first 6 months OR rank Newly Hired / Starting Teacher; otherwise Regular. Fixed-rate people stay Regular.
//   e.g. Dezza (since 19 Jul 2026) is New until 19 Jan 2027 even though she is Newly Qualified.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["fetch(FAST_URL + '-payedit', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, op: 'tpay', teacher: t }) }).then(r => r.json()).then(r => { const k2 = (r && r.rank) || {}; LVRK1800[k] = { rank: k2.rank || '', fixed: !!k2.fixed, ok: !!(r && r.ok) }; }).catch(() => { LVRK1800[k] = { rank: '', fixed: false, ok: false }; })",
   "Promise.all([fetch(FAST_URL + '-payedit', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, op: 'tpay', teacher: t }) }).then(r => r.json()).catch(() => null),\n"
   + "    (window.AS40 && AS40.L && AS40.L.length ? Promise.resolve({ people: AS40.L }) : window.AS40 && AS40.call ? (window.LVST1801 = window.LVST1801 || AS40.call('list').catch(() => null)) : Promise.resolve(null))])   /* 1801: + start date */\n"
   + "    .then(([r, s]) => { const k2 = (r && r.rank) || {}, p = ((s && s.people) || []).find(q => String(q.name || '').toLowerCase() === k); LVRK1800[k] = { rank: k2.rank || '', fixed: !!k2.fixed, ok: !!(r && r.ok), start: (p && p.start_date) || '' }; }).catch(() => { LVRK1800[k] = { rank: '', fixed: false, ok: false, start: '' }; })"],
  ["return rk.fixed ? 'Regular' : /newly hired|starting/i.test(rk.rank || '') ? 'New' : 'Regular'; }",
   "return rk.fixed ? 'Regular' : (/newly hired|starting/i.test(rk.rank || '') || lv1801young(rk, x)) ? 'New' : 'Regular'; }\n"
   + "function lv1801six(rk){ if(!rk || !/^\\d{4}-\\d{2}-\\d{2}/.test(rk.start || '')) return ''; const [y, m, dd] = rk.start.slice(0, 10).split('-').map(Number), d = new Date(Date.UTC(y, m - 1 + 6, dd)); return d.toISOString().slice(0, 10); }\n"
   + "function lv1801young(rk, x){ const e = lv1801six(rk); return !!e && String((x && x.from) || new Date().toISOString()).slice(0, 10) < e; }"],
  ["' · ' + esc(rk.fixed ? 'fixed-rate teacher' : rk.rank || 'no rank') + (window.LV95T && LV95T[x.id] ? ' · changed by hand' : ' (from rank)')",
   "' · ' + esc(rk.fixed ? 'fixed-rate teacher' : (rk.rank || 'no rank') + (rk.start ? ' · with us since ' + rk.start.slice(0, 10) + (lv1801young(rk, x) ? ' (first 6 months, until ' + lv1801six(rk) + ')' : '') : '')) + (window.LV95T && LV95T[x.id] ? ' · changed by hand' : '')"],
  ["<span>· New = Newly Hired / Starting Teacher · Regular = Newly Qualified and up</span>",
   "<span>· New = first 6 months with us, or Newly Hired / Starting Teacher · Regular = everyone else</span>"],
]);
