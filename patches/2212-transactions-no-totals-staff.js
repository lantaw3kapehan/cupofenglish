// 2212 (14 Nov · Misty: yes): staff who cannot see company totals (Celine) see the Transactions list without the Sales / Expenses /
// Difference totals, without the amounts next to the categories, and without the government-dues note. Adding sales and expenses,
// the filters, search and the list itself are unchanged. The President sees everything as before.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
 ["    const kc = K === 'all' ? 4 : 2; h += '<div class=\"fx-k\"", "    const kc = K === 'all' ? 4 : 2; if(SC()) h += '<div class=\"fx-k\""],
 ["    if(gov) h += '<div class=\"fx-note\">Expenses here include '", "    if(gov && SC()) h += '<div class=\"fx-note\">Expenses here include '"],
 [".map(c => '<option value=\"' + esc(c) + '\"' + (CAT === c ? ' selected' : '') + '>' + esc(c.slice(k.length + 1)) + ' · ' + P0(cats[c]) + '</option>')",
  ".map(c => '<option value=\"' + esc(c) + '\"' + (CAT === c ? ' selected' : '') + '>' + esc(c.slice(k.length + 1)) + (SC() ? ' · ' + P0(cats[c]) : '') + '</option>')"]
]);
