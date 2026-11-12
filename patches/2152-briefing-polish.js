// 2152 (12 Nov): Briefing polish after checking 2151 at laptop size.
//   · the cash instruction said "send ¥14,400 by Fri 13 Nov" twice: the second sentence now only gives the peso amount and the reason
//   · Coming up no longer adds "Plan a transfer from the yuan wallets before …" when For you already says exactly what to send and by when
//   · "How the month is going" moves to the left column (under Coming up), so the two columns are about the same length
//   · a missing full stop after "A reminder is the quickest way to firm up this income"
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["    t += 'That is <b>' + (yuan ? '¥' + yuan.toLocaleString('en-US') + '</b> (about ' + about(short) + ' at ' + rate + ')' : about(short) + '</b>') + (by ? ' to the peso bank <b>by ' + E(dL(by)) + '</b>, before ' + E(first.l) + ' (' + about(+first.a) + ') on ' + E(dL(first.d)) : '') + '.';",
   "    t += 'That is about ' + about(short) + (yuan && rate ? ' at ' + rate : '') + (first ? ', needed before ' + E(first.l) + ' (' + about(+first.a) + ') on ' + E(dL(first.d)) : '') + '.';"],
  ["'A reminder is the quickest way to firm up this income' : ''", "'A reminder is the quickest way to firm up this income.' : ''"],
  ["    if(!covered && o.miss.some(function(x){ return /remit/i.test(x.t || ''); }))", "    if(false && !covered && o.miss.some(function(x){ return /remit/i.test(x.t || ''); }))"],
  ["'<div class=\"bz-cols\"><div>' + actions(o) + ahead(o) + '</div><div>' + renew2151(o) + month2149(o) + grow(o) + more() + '</div></div>'",
   "'<div class=\"bz-cols\"><div>' + actions(o) + ahead(o) + month2149(o) + '</div><div>' + renew2151(o) + grow(o) + more() + '</div></div>'"],
]);
