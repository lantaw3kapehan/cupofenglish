// Student page CEFR journey: until the server sends the monthly lessons (paste file Step 3b), show this package's numbers from ACTIVE:
// "N lessons taken 本期已上 · M left 剩余 · this package 本期课时包". Once Step 3b is in, the all-time total replaces it automatically.
require('../tools/lib.js')(process.argv[2], [
["(MO.length ? '<div class=\"small\" style=\"margin-top:10px\"><b>' + tot + ' lessons with us</b>",
 "(!MO.length && S.s && (+S.s.done > 0 || (S.s.left != null && !S.s.shared)) ? '<div class=\"small\" style=\"margin-top:10px\"><b>' + (+S.s.done || 0) + ' lessons taken · 本期已上</b>' + (S.s.left != null && !S.s.shared ? ' · <b>' + S.s.left + ' left · 剩余</b>' : '') + ' <span class=\"mute\">· this package 本期课时包</span></div>' : '') + (MO.length ? '<div class=\"small\" style=\"margin-top:10px\"><b>' + tot + ' lessons with us</b>"]
]);
