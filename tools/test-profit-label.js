// 1995 · regression: the words on Overview › Profit each month (spoken label, tap, hover) come from the number itself.
// Runs on every release from tools/check.js. Returns the number of failed cases.
const fs = require('fs'), vm = require('vm');
module.exports = function(file){
  const s = fs.readFileSync(file, 'utf8');
  const a = s.indexOf('function plParse1995('), b = s.indexOf('window.plLabel1995 = plLabel1995;');
  if (a < 0 || b < 0) { console.error('profit label: plParse1995 / plLabel1995 not found'); return 1; }
  const ctx = {}; vm.createContext(ctx); vm.runInContext(s.slice(a, b), ctx);
  const L = ctx.plLabel1995, P = ctx.plParse1995;
  const cases = [
    // [what, got, expected]
    ['negative, finished month', L('October', -52776, false), 'October · loss ₱52,776'],
    ['positive, finished month', L('October', 212345, false), 'October · profit ₱212,345'],
    ['zero, finished month', L('August', 0, false), 'August · break-even'],
    ['under half a peso is zero', L('August', 0.4, false), 'August · break-even'],
    ['negative, month to date', L('November', -52776, true), 'November · loss so far ₱52,776 (month to date)'],
    ['positive, month to date', L('November', 15000, true), 'November · profit so far ₱15,000 (month to date)'],
    ['zero, month to date', L('November', 0, true), 'November · break-even so far (month to date)'],
    ['text "so far -₱53k" reads as a loss', String(P('-₱53k')), '-53000'],
    ['text "₱105k" reads as a profit', String(P('₱105k')), '105000'],
    ['text with a real minus sign', String(P('−₱1.2M')), '-1200000'],
    ['text "₱0"', String(P('₱0')), '0'],
    ['a loss is never called profit', String(/profit/.test(L('November', -1, true))), 'false'],
  ];
  let bad = 0;
  cases.forEach(([w, got, exp]) => { if (got !== exp) { bad++; console.error('profit label · ' + w + ': got "' + got + '", expected "' + exp + '"'); } });
  if (!bad) console.log('Profit label checks passed (' + cases.length + ')');
  return bad;
};
