// 15 Oct · Teacher cards: a teacher with no rank no longer stops the cards from showing; Cases shows ₱0 (not −₱0).
require('../tools/lib.js')(process.argv[2], [
["const k = RK.find(z => z[0].test(String(x.rank || ''))), c = cp(x)", "const k = RK.find(z => z[0].test(String(x.rank || ''))) || RK[RK.length - 1], c = cp(x)"],
["<span class=\"minus\"><b>−${peso2(thisM.reduce((a, x) => a + num(x.amount), 0))}</b>deductions</span>", "<span class=\"minus\"><b>${(d => (d ? '−' : '') + peso2(d))(thisM.reduce((a, x) => a + num(x.amount), 0))}</b>deductions</span>"],
]);
