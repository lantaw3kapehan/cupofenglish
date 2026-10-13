// Class scheduled picture: the Schedule line ran off the right edge ("… · last clas").
// Now "Last class …" / "最后一节课 …" goes on its own line, and every line wraps to the card width.
require('../tools/lib.js')(process.argv[2], [
[
"if(cl && P.pkg) rows.push(['Schedule', '课程安排', [P.pkg.en], [P.pkg.zh]]);",
"if(cl && P.pkg){ const sl = (t, sep, f) => [].concat(...String(t || '').split(sep).map((s, i) => wrap((i ? sep.replace(/^ · /, '').replace(/^l/, 'L') : '') + s, f, 740)));\nrows.push(['Schedule', '课程安排', sl(P.pkg.en, ' · last class', '400 30px ' + F), sl(P.pkg.zh, ' · 最后一节课', '400 24px ' + F)]); }"
]
]);
