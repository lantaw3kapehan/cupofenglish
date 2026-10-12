// Parent pictures: the student line shows the name (Anna), not the whole calendar title (ST-2026-090-Anna-OD2-April),
// takes the code from the title when needed, and long names shrink to fit the card.
require('../tools/lib.js')(process.argv[2], [
[
"const P = CXP; if(!P) return; const e = P.e, s = new Date(e.start);",
"const P = CXP; if(!P) return; const e = P.e, s = new Date(e.start);\n{ const m = String(e.title || '').match(/^(ST-\\d{4}-\\d{3})-([^-]+)/i); if(m){ if(!e.student || /^ST-\\d{4}/i.test(e.student)) e.student = m[2].replace(/\\s+X$/i, ''); if(!e.code) e.code = m[1].toUpperCase(); if(!P.cn) P.cn = cxCnOf(e.code); } }"
],
[
"c.fillStyle = '#2B2253'; c.font = '400 54px ' + B; c.fillText(String(e.student || e.title || '').replace(/\\s+X$/i, ''), 80, y + 82);",
"c.fillStyle = '#2B2253'; { const nm = String(e.student || e.title || '').replace(/\\s+X$/i, ''); let fs = 54; c.font = '400 54px ' + B; while(fs > 26 && c.measureText(nm).width > W - 160){ fs -= 2; c.font = '400 ' + fs + 'px ' + B; } c.fillText(nm, 80, y + 82); }"
]
]);
