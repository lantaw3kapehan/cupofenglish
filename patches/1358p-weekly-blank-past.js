// 1358p (Misty 20:36): Weekly class times picture + text — in the current week, passed days are blank (faint "—") and times already
//   gone today are left out; never "Full · 已满" / "Not available" for the past. wkpCol is the SAME function as the partner portal's.
const fs = require('fs'), path = require('path');
const WKP = fs.readFileSync(path.join(__dirname, '..', 'tools', 'wkp-shared.js'), 'utf8');
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["async function avPic(){ const A = AVD, W = avWeek();",
   WKP + "function avCols(W){ const A = AVD, t0 = new Date(); t0.setHours(0, 0, 0, 0); const now = Date.now();\n  return W.map(x => wkpCol(x.d < t0, x.items.map(it => Object.assign({}, it, { gone: !!it.b && it.t < now })), !!A.days[x.w], A.days[x.w] === 'full')); }\nasync function avPic(){ const A = AVD, W = avWeek();"],
  ["const cols = W.map(x => (x.full ? [{ full: 1 }] : x.off ? [{ off: 1 }] : []).concat(x.items))", "const cols = avCols(W)"],
  ["+ W.map(x => `${AV_W[x.w]} 周${AV_WZ[x.w]}：${x.full ? 'Full · 已满' + (x.items.length ? '  ' : '') : ''}${x.items.length ? x.items.map(it => avT(it.t) + (it.b ? '（已约 booked）' : '')).join('  ') : x.full ? '' : x.off ? 'Not available · 不可约' : '—'}`).join('\\n')",
   "+ avCols(W).map((col, i) => { const x = W[i], it = col.filter(c => c.t != null), fu = col.some(c => c.full); return `${AV_W[x.w]} 周${AV_WZ[x.w]}：${fu ? 'Full · 已满' + (it.length ? '  ' : '') : ''}${it.length ? it.map(c => avT(c.t) + (c.b ? '（已约 booked）' : '')).join('  ') : fu ? '' : col.some(c => c.off) ? 'Not available · 不可约' : '—'}`; }).join('\\n')"],
]);
