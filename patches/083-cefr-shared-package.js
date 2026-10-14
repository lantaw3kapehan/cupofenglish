// 14 Oct · CEFR journey (Misty, Andy ST-2026-018): a package shared with a sibling has one shared total in DATABASE
// (ENROLLMENT › TOTAL), so for shared students the journey counts only the child's own classes from the -DAILY records,
// and says the package is shared (student page and the picture to send).
require('../tools/lib.js')(process.argv[2], [
["tot0 = rd(MO.reduce((a, x) => a + U(x), 0)), tot = Math.max(tot0, ",
 "tot0 = rd(MO.reduce((a, x) => a + U(x), 0)), tot = (S && S.s && S.s.shared) ? tot0 : Math.max(tot0, "],
["tkAll: tot > 0, left:",
 "tkAll: tot > 0, shN: (S.s && S.s.shared && (S.s.sharedName || 'a sibling')) || '', left:"],
["J.tkAll ? 'with us so far · 累计' : 'this package · 本期课时包'] : null",
 "J.tkAll ? (J.shN ? 'own lessons · 本人课时 (package shared with ' + J.shN + ')' : 'with us so far · 累计') : 'this package · 本期课时包'] : null"],
["'<div class=\"small\" style=\"margin-top:10px\"><b>' + tot + ' lessons with us</b> · 共 ' + tot + ' 课时",
 "'<div class=\"small\" style=\"margin-top:10px\"><b>' + tot + ' lessons with us</b> · 共 ' + tot + ' 课时' + (S.s && S.s.shared ? ' <span class=\"mute\">· own lessons 本人课时 · package shared with ' + esc(S.s.sharedName || 'a sibling') + ' 与' + esc(S.s.sharedName || '兄弟姐妹') + '共享课时包</span>' : '') + '"],
]);
