// 1765: (Misty 4 Nov 20:43 "in management we should be notified of this, so we can change their trainings and activate";
//   20:47 "ALSO SHOW IN THE PAYSLIP THE COUNTING OF OLD RANK RATE, AND THEN THE NEW ONE .. SO IT'S TRANSPARENT")
//   1. Payslip: when a teacher ranked up during the month, the lessons are listed per rate — e.g. "Regular lessons @ ₱150 · Newly Hired (1–15 Oct)"
//      then "Regular lessons @ ₱155 · Starting Teacher (16–31 Oct)", the same for trial / substitute classes, with a rank-up note.
//      Data: coe-payedit v12 `rates` (coe_rank_tl, the same rows the pay is computed from). Shown only when the rows add up to the lesson pay.
//   2. Management Home: "Rank-ups waiting for trainings" (units reached, trainings not done → opens Trainings, ticking them activates the rank
//      on the next refresh) and, in the watch list, "New ranks (last 30 days)". Data: coe-payedit op rankwait (coe_rank_cur).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["    const rateTxt = (r.courses || []).length ? r.courses.map(c => esc(c.course) + ' ' + pz(c.rate)).join(' · ') : (+r.rate ? pz(r.rate) : '—');",
   "    const rr1765 = rates1765(S, r, (a, u, b) => '<tr><td>' + a + '</td><td style=\"text-align:right\">' + (u == null ? '' : u) + '</td><td style=\"text-align:right\">' + b + '</td></tr>');   /* 1765 */\n" +
   "    const rateTxt = rr1765 ? rr1765.head : (r.courses || []).length ? r.courses.map(c => esc(c.course) + ' ' + pz(c.rate)).join(' · ') : (+r.rate ? pz(r.rate) : '—');"],
  ["      + ((+r.reg || 0) || !(+r.base) ? row('Regular lessons @ ' + rateTxt,",
   "      + (rr1765 ? rr1765.rows : '') + (rr1765 ? '' : (+r.reg || 0) || !(+r.base) ? row('Regular lessons @ ' + rateTxt,"],
  ["      + ((+r.trial) ? row('Trial classes', +r.trial, pz((+r.trial) * (+r.rate || 0))) : '') + ((+r.sub) ? row('Substitute classes', +r.sub, pz((+r.sub) * (+r.rate || 0))) : '')",
   "      + (rr1765 ? '' : ((+r.trial) ? row('Trial classes', +r.trial, pz((+r.trial) * (+r.rate || 0))) : '') + ((+r.sub) ? row('Substitute classes', +r.sub, pz((+r.sub) * (+r.rate || 0))) : ''))"],
  ["      + row('Gross compensation', '', pz(gross), 'tot') + '</table>'",
   "      + row('Gross compensation', '', pz(gross), 'tot') + '</table>' + (rr1765 ? rr1765.note : '')"],
  ["  function slipHtml(S, forPrint){ const r = S.row,",
   "  function rates1765(S, r, row){ try{ const R = (S.rates || []).filter(x => +x.units); if((r.courses || []).length || new Set(R.map(x => +x.rate)).size < 2) return null;   /* 1765 · old rank rate, then the new one */\n" +
   "    const sum = R.reduce((a, x) => a + (+x.pay || 0), 0); if(Math.abs(sum - (+r.lesson_pay || 0)) > 0.5) return null;\n" +
   "    const units = k => R.filter(x => x.kind === k).reduce((a, x) => a + (+x.units || 0), 0); if(Math.abs(units('reg') - (+r.reg || 0)) > 0.01 || Math.abs(units('trial') - (+r.trial || 0)) > 0.01 || Math.abs(units('sub') - (+r.sub || 0)) > 0.01) return null;\n" +
   "    const dd = d => { const x = new Date(String(d).slice(0, 10) + 'T00:00:00'); return isNaN(x) ? '' : x.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); };\n" +
   "    const span = x => x.from === x.to ? dd(x.from) : dd(x.from) + '–' + dd(x.to);\n" +
   "    const nm = { reg: 'Regular lessons', trial: 'Trial classes', sub: 'Substitute classes' }, ord = { reg: 0, trial: 1, sub: 2 };\n" +
   "    const L = R.slice().sort((a, b) => ord[a.kind] - ord[b.kind] || a.rate - b.rate);\n" +
   "    const rows = L.map(x => row(nm[x.kind] + ' @ ' + pz(x.rate) + (x.rank ? ' · ' + esc(x.rank) : '') + ' <span class=\"m\">(' + esc(span(x)) + ')</span>', +x.units, pz(x.pay))).join('');\n" +
   "    const rs = [...new Set(R.map(x => +x.rate))].sort((a, b) => a - b), k = S.rankNow || {};\n" +
   "    const first = R.filter(x => +x.rate === rs[rs.length - 1]).map(x => x.from).sort()[0];\n" +
   "    const note = '<div class=\"m\" style=\"margin-top:6px\">Rank-up this month' + (k.prev_rank && k.rank ? ': ' + esc(k.prev_rank) + ' → ' + esc(k.rank) : '') + (k.rank_date && /^\\d{4}-/.test(k.rank_date) ? ' on ' + esc(dd(k.rank_date)) : '') + '. Classes up to the class that reached the units are paid at ' + rs.slice(0, -1).map(pz).join(', ') + '; classes from ' + esc(dd(first)) + ' are paid at the new rate ' + pz(rs[rs.length - 1]) + '. Trial and substitute classes are paid at the rate on their day; only regular classes count toward rank.</div>';\n" +
   "    return { rows, note, head: rs.map(pz).join(' → ') }; }catch(e){ return null; } }\n" +
   "  function slipHtml(S, forPrint){ const r = S.row,"],
  ["</body>\n</html>",
   "<script>\n/* 1765 · management Home: rank-ups waiting for trainings (units reached) and new ranks — from the database (coe_rank_cur) */\n(function(){\n  if(window.__1765) return; window.__1765 = 1; let at = 0;\n" +
   "  async function rw(force){ try{ if(typeof D === 'undefined' || !D || !D.mgr || typeof TOKEN === 'undefined' || !TOKEN) return; if(!force && Date.now() - at < 120000) return; at = Date.now();\n" +
   "    const r = await fetch(FAST_URL + '-payedit', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, op: 'rankwait' }) }).then(x => x.json());\n" +
   "    if(r && r.ok){ const k = JSON.stringify([r.waiting, r.ups]), ch = k !== window.__rw1765k; window.RW1765 = r; window.__rw1765k = k; if(ch){ try{ if(typeof VIEW !== 'undefined' && VIEW === 'home') renderHome(); hmBadge(); }catch(e){} } } }catch(e){} }\n" +
   "  window.rw1765 = rw;\n" +
   "  const q0 = window.hmQueue; if(typeof q0 === 'function') window.hmQueue = function(){ const o = q0.apply(this, arguments); try{ const R = window.RW1765; if(!R || !o) return o;\n" +
   "    const w = R.waiting || []; if(w.length){ o.Q.push({ n: w.length, tone: '', t: 'Rank-ups waiting for trainings', s: w.slice(0, 3).map(x => tName(x.teacher) + ' → ' + String(x.blocked || '').replace(' · units reached · waiting for: ', ': ')).join(' · ') + ' · tick the trainings when done and the new rate starts', go: \"go('train')\" });\n" +
   "      const rank = { hot: 0, '': 1, low: 2 }; o.Q.sort((a, b) => rank[a.tone] - rank[b.tone] || b.n - a.n); } else if(o.ok) o.ok.push('Rank-ups');\n" +
   "    const u = R.ups || []; if(u.length) o.W.push({ n: u.length, tone: '', t: 'New ranks (last 30 days)', s: u.slice(0, 4).map(x => tName(x.teacher) + ' → ' + x.rank + ' ₱' + x.rate + (x.on ? ' · ' + x.on.slice(5).replace('-', '/') : '')).join(' · '), go: \"go('payroll')\" });\n" +
   "  }catch(e){} return o; };\n" +
   "  const l0 = window.hmLoad; if(typeof l0 === 'function') window.hmLoad = function(force){ rw(!!force); return l0.apply(this, arguments); };\n" +
   "  setTimeout(() => rw(true), 4000); setInterval(() => { if(!document.hidden) rw(); }, 300000);\n" +
   "})();\n</script>\n</body>\n</html>"],
]);
