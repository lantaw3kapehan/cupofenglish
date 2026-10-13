// CEFR journey: lessons (units, S-MONTHLY › Total Hours) at each level and by book, plus the total with us.
// Needs the server to send r.monthly (paste file Step 3b). Without it the section looks exactly as before.
require('../tools/lib.js')(process.argv[2], [
[
"if(!T.length) return '';\n",
"if(!T.length) return '';\n" +
"const MO = (r.monthly || []).filter(x => x && x.m), U = x => Number(x.u) || Number(x.n) || 0, rd = v => Math.round(v * 10) / 10, tot = rd(MO.reduce((a, x) => a + U(x), 0));\n" +
"const DT = T.filter(x => x.d && !/^Trial/.test(x.en)).sort((a, b) => a.d.localeCompare(b.d)); DT.forEach((x, k) => { const a = x.d.slice(0, 7), b = k + 1 < DT.length ? DT[k + 1].d.slice(0, 7) : '9999-99'; x.u = MO.length ? rd(MO.filter(y => y.m >= a && y.m < b).reduce((s, y) => s + U(y), 0)) : null; });\n" +
"const BK = {}; MO.forEach(x => { const c = String(x.c || '').trim() || 'Other'; BK[c] = (BK[c] || 0) + U(x); });\n"
],
[
"<span>' + x.en + ' · ' + x.zh + '</span></div>'",
"<span>' + x.en + ' · ' + x.zh + (x.u != null ? ' · <b>' + x.u + '</b> lesson' + (x.u === 1 ? '' : 's') + ' at this level · 本级别 ' + x.u + ' 课时' : '') + '</span></div>'"
],
[
"+ '</div></section>';\n}catch(e){ return ''; } }",
"+ '</div>' + (MO.length ? '<div class=\"small\" style=\"margin-top:10px\"><b>' + tot + ' lessons with us</b> · 共 ' + tot + ' 课时<div class=\"mute\" style=\"margin-top:2px\">By book 按教材: ' + Object.keys(BK).sort((a, b) => BK[b] - BK[a]).map(c => esc(c) + ' ' + rd(BK[c])).join(' · ') + '</div></div>' : '') + '</section>';\n}catch(e){ return ''; } }"
]
]);
