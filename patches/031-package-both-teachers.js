// Packages taught by two teachers (Nico OD2/REF = Julia + Mayi): a teacher row without its own package belongs to the package row right above it,
// exactly as the sheet's TOTAL AVAILABLE counts it; the lesson summary and the lessons-left picture of a package include every teacher's lessons.
require('../tools/lib.js')(process.argv[2], [
[
"const ownerOf = x => { if(own(x)) return x; const k = key(x), cands = R.filter(y => own(y) && key(y) === k); if(!cands.length) return x;",
"const RS = R.slice().sort((p, q) => (+p[C.row] || 0) - (+q[C.row] || 0));\nconst blockOf = x => { const i = RS.indexOf(x); for(let j = i - 1; j >= 0; j--){ const y = RS[j]; if(key(y) !== key(x)) return null; if(own(y)) return y; } return null; };   /* as the sheet (AU): a row without its own package belongs to the package row right above it */\nconst ownerOf = x => { if(own(x)) return x; const bo = blockOf(x); if(bo) return bo; const k = key(x), cands = R.filter(y => own(y) && key(y) === k); if(!cands.length) return x;"
],
[
"const extra = R.filter(x => !own(x) && key(x) === k && ownerOf(x) !== owner).reduce((a, x) => a + (+x[C.finished] || 0), 0);",
"let extra = R.filter(x => !own(x) && key(x) === k && ownerOf(x) !== owner).reduce((a, x) => a + (+x[C.finished] || 0), 0);\nif(extra && owner[C.available] !== '' && owner[C.available] != null){ const est = (+owner[C.enrolled] || 0) + (+owner[C.carry] || 0) + (C.transfer != null ? +owner[C.transfer] || 0 : 0) - out.filter(x => key(x) === k).reduce((a, x) => a + (+x[C.finished] || 0), 0); if(Math.abs(est - +owner[C.available]) < 0.05) extra = 0; }   /* the sheet already counted only this package's rows */"
],
[
"const rows0 = multi ? [o] : (G.members && G.members.length ? G.members : [o]).filter(x => up(x[C.code]) === up(code));",
"const rows0 = (G.members && G.members.length ? G.members : [o]).filter(x => up(x[C.code]) === up(code));   /* the whole package: every teacher's lessons (Nico OD2/REF = Julia + Mayi) */"
]
]);
