// 20 Oct · Price picture (Enquiries): Adults · "Xiaolan's students" — Xiaolan's institution's own adult prices for her students (¥1800 / ¥3000 / ¥5400).
require('../tools/lib.js')(process.argv[2], [
["const PARTNERS = { 'Dr. Spring': { k: 20, a: 20 }, 'Xiaolan': { k: 15, a: 15 } },",
 "const PARTNERS = { 'Dr. Spring': { k: 20, a: 20 }, 'Xiaolan': { k: 15, a: 15 } },\n" +
 "  /* 20 Oct · 480 · Misty: Xiaolan's institution sends our adult price list to its own students at its own prices. Student-facing (the normal\n" +
 "     adult picture, savings worked out the same way: against the 15-lesson price per lesson), only the three prices change. */\n" +
 "  XLS = { 'Xiaolan students': [1800, 3000, 5400] }, xlP = L => { const pr = XLS[PP.partner], base = Math.round(pr[0] / L[0].n);\n" +
 "    return L.map((p, i) => { const price = pr[i] || p.price, sv = (p.n + p.bonus) * base - price; return Object.assign({}, p, { price, save: i && sv > 0 ? sv : 0, saveT: i && sv > 0 ? '节省 ¥' + (Math.floor(sv / 100) * 100).toLocaleString('en-US') + '+' : '' }); }); },"],
["const ppL = () => PP.partner && PARTNERS[PP.partner]",
 "const ppL = () => PP.ad === true && XLS[PP.partner] ? xlP(PKA) : PP.partner && PARTNERS[PP.partner]"],
["['', 'Dr. Spring', 'Xiaolan'].map(n => '<button class=\"' + ((PP.partner || '') === n ? 'on' : '') + '\" onclick=\"ppPartner(\\'' + n + '\\')\">' + (n ? n + ' · −¥'",
 "(PP.ad === true ? ['', 'Dr. Spring', 'Xiaolan', 'Xiaolan students'] : ['', 'Dr. Spring', 'Xiaolan']).map(n => '<button class=\"' + ((PP.partner || '') === n ? 'on' : '') + '\" onclick=\"ppPartner(\\'' + n + '\\')\">' + (n && XLS[n] ? 'Xiaolan\\'s students · ¥' + XLS[n].join(' / ') : n ? n + ' · −¥'"],
["PP.ad ? (PP.ad === true && PP.partner ? 'Partner price list",
 "PP.ad ? (PP.ad === true && PP.partner && !XLS[PP.partner] ? 'Partner price list"]
]);
