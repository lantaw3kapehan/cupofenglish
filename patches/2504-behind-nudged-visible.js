// 2504: nudged teachers always show as one folded line at the bottom (not hidden past "Show all"); notice titles cut at a whole word.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["const R = R0.filter(r => !NG[r.t]).concat(R0.filter(r => NG[r.t])); const od = R.filter(r => r.top === 'r' && !NG[r.t]).length, N = OPEN ? R : R.slice(0, 6);",
   "const U = R0.filter(r => !NG[r.t]), R = U.concat(R0.filter(r => NG[r.t])); const od = U.filter(r => r.top === 'r').length, N = (OPEN ? U : U.slice(0, 6)).concat(R0.filter(r => NG[r.t]));"],
  ["      + (R.length > 6 ? '<span class=\"more\" data-more=\"1\">' + (OPEN ? 'Show fewer' : 'Show all ' + R.length + ' teachers') + '</span>' : ''); }",
   "      + (U.length > 6 ? '<span class=\"more\" data-more=\"1\">' + (OPEN ? 'Show fewer' : 'Show all ' + U.length + ' to nudge') + '</span>' : ''); }"],
  [".replace(/^./, c => c.toUpperCase()).slice(0, 56), k = nm(t.teacher)",
   ".replace(/^./, c => c.toUpperCase()).replace(/^(.{0,58})(\\s.*)?$/s, (a, b, c) => c ? b.replace(/\\s+\\S*$/, '').replace(/[\\s(,.:;-]+$/, '') + '…' : b), k = nm(t.teacher)"]
]);
