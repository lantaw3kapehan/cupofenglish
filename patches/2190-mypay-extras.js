// 2190 (13 Nov · Misty: yes): Total earned also counts her 13th month pay (from Transactions) and her salary advance (coe_pay_extra),
// and says so in the line under the total.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [["' to today. ' + esc(peso(+a.net || 0)) + ' paid over ' + (+a.months) + ' month' + (+a.months === 1 ? '' : 's') + (so ?",
  "' to today. ' + esc(peso(+(a.paidNet != null ? a.paidNet : a.net) || 0)) + ' paid over ' + (+a.months) + ' month' + (+a.months === 1 ? '' : 's') + (a.extras || []).map(x => ', ' + esc(peso(+x.amount || 0)) + ' ' + esc(/13th/i.test(x.kind) ? '13th month pay (' + x.m.slice(0, 4) + ')' : String(x.kind).toLowerCase() + ' (' + mo(x.m) + ' ' + x.m.slice(0, 4) + ')')).join('') + (so ?"]]);
