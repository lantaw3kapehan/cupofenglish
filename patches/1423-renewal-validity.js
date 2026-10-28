// 1423: (Misty, 28 Oct 11:16) Luna's "Renewal confirmed · 续费成功" picture said Valid until 28 Nov 2026 — a parent already disputed
// one like it. The picture took the date from the package row it was drawn from, which right after a renewal is still the OLD
// package (its end date), not the new one.
// The rule (management's, checked against all 154 packages started in 2026: 0 exceptions):
//   valid until = official first class of the new package + 4 months (under 30 lessons) / 8 months (30–59) / 12 months (60+),
//   lessons = paid + free (carried lessons don't change the length); a month-end start ends on the last day of the month
//   (31 Oct + 8 months = 30 Jun, as the sheet does).
// · Renewal picture: start = the new package's official first class (ACTIVE start of the package row linked to this payment,
//   or the package row itself when it already is the new one); "Valid until" + "Counted from the first class · 有效期从首课…起计算".
//   Never the last booked class, never the old package's end. Until the first class is known the line is left out (no guess).
// · The quick answers right after Save (renew / enrol) use the same month-end rule.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["  window.pkChipDate = function(code, teacher, start){", "  window.pkRows = () => M;   /* 1423 */\n  window.pkChipDate = function(code, teacher, start){"],
  ["deadline: o[C.deadline], carry: o[C.carry],", "deadline: o[C.deadline], start: o[C.start], carry: o[C.carry],"],
  ["deadline: r[C.deadline], carry: r[C.carry], today: 0 };", "deadline: r[C.deadline], start: r[C.start], carry: r[C.carry], today: 0 };"],
  ["if(bl && P.renew){ const Q = P.renew, pd = pD(Q.paid), dl = pD(P.bal.deadline),",
   "if(bl && P.renew){ const Q = P.renew, pd = pD(Q.paid), dl = Q.dl ? pD(Q.dl) : null,   /* 1423: never the old package's end */"],
  ["if(dl) rows.push(['Valid until', '有效期至', [dEn(dl)], [dZh(dl)]]);\nrows.push(['__POL__']);",
   "if(dl){ const sd = pD(Q.start); rows.push(['Valid until', '有效期至', [dEn(dl)].concat(sd ? ['Counted from the first class · ' + sd.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })] : []), [dZh(dl)].concat(sd ? ['有效期从首课 ' + (sd.getMonth() + 1) + '月' + sd.getDate() + '日 起计算'] : [])]); }\nrows.push(['__POL__']);"],
  ["cxDraw = async function(){ const P = CXP; if(P && P.kind === 'bal') P.renew = rnFor(P) || null;",
   "const RN_ST = {};   /* 1423: first class of the new package, by student */\n" +
   "function rnAddM(ymd, k){ const p = String(ymd || '').slice(0, 10).split('-').map(Number); if(p.length < 3 || !p[0]) return ''; const last = new Date(p[0], p[1] - 1 + k + 1, 0).getDate(); const x = new Date(p[0], p[1] - 1 + k, Math.min(p[2], last), 12); return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0'); }\n" +
   "function rnValid(P){ const Q = P && P.renew, b = P && P.bal; if(!Q || !Q.paid) return; const ymdM = s => new Date(new Date(s).getTime() + 8 * 3600e3).toISOString().slice(0, 10), wk = rnAddM(Q.paid, 0) && new Date(new Date(Q.paid + 'T12:00:00').getTime() - 7 * 864e5).toISOString().slice(0, 10);\n" +
   "  let st = ''; try{ const R = window.pkRows ? pkRows() : null; if(window.pkPaid) pkPaid(Q.code, '', ''); if(R) Object.keys(R).forEach(k => { if(k.indexOf(String(Q.code).toUpperCase() + '|') === 0) R[k].forEach(x => { if(x.paid === Q.paid && x.st && (!st || x.st > st)) st = x.st; }); }); }catch(x){}   /* the new package row linked to this payment (ACTIVE col J → SALES) */\n" +
  "  if(!st){ const bs = String((b && b.start) || '').slice(0, 10); if(/^\\d{4}-\\d{2}-\\d{2}$/.test(bs) && bs >= wk) st = bs; }\n" +
  "  if(!st){ Q.dl = ''; Q.start = ''; if(!P._rnS){ P._rnS = 1; setTimeout(() => { if(CXP === P){ P.url = ''; cxDraw(); } }, 4000); setTimeout(() => { if(CXP === P){ P._rnS = 0; P.url = ''; cxDraw(); } }, 90000); } return; }   /* no guess: the line waits for the new package row */\n" +
  "  Q.start = st; Q.dl = rnAddM(st, (+Q.tot || 0) < 30 ? 4 : (+Q.tot || 0) < 60 ? 8 : 12); }\n" +
   "window.rnValid = rnValid; window.rnAddM = rnAddM;\n" +
   "cxDraw = async function(){ const P = CXP; if(P && P.kind === 'bal') P.renew = rnFor(P) || null; try{ rnValid(P); }catch(x){}"],
  ["const addM = (s, k) => { const d = new Date(String(s).slice(0, 10) + 'T12:00:00'); if(isNaN(d)) return ''; const x = new Date(d.getFullYear(), d.getMonth() + k, d.getDate(), 12); return ymdLocal(x); };",
   "const addM = (s, k) => { const d = new Date(String(s).slice(0, 10) + 'T12:00:00'); if(isNaN(d)) return ''; const last = new Date(d.getFullYear(), d.getMonth() + k + 1, 0).getDate(); const x = new Date(d.getFullYear(), d.getMonth() + k, Math.min(d.getDate(), last), 12); return ymdLocal(x); };   /* 1423: 31 Oct + 8 months = 30 Jun */"]
]);
