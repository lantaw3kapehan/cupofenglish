// 750: (Misty) Annie showed "Trial" though she is a regular student: she studies on a shared package (Vanessa's ACTIVE row holds the
// lessons; Annie's own ACTIVE rows have no "enrolled" number). The status now counts any active ACTIVE row of the student, and ACTIVE's
// "shared" column links siblings automatically for the WeChat family group when no manual link exists.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
rep("const R = AT.rows.filter(x => up(x[C.code]) === code && x[C.enrolled] !== '');\n      if(R.some(x => x[C.active] === true || x[C.active] === 'TRUE')) return 'active';",
    "const R = AT.rows.filter(x => up(x[C.code]) === code && x[C.enrolled] !== ''), A0 = AT.rows.filter(x => up(x[C.code]) === code);\n      if(A0.some(x => x[C.active] === true || x[C.active] === 'TRUE' || x[C.active] === 'true')) return 'active';   /* 750: shared package rows count */");
rep("function fam(code){ code = up(code); const main = (WXF[code] && WXF[code].to) || code, M = [main].concat(Object.keys(WXF).filter(k => WXF[k] && WXF[k].to === main && k !== main)); return M.length > 1 ? { main, M } : null; }",
    "function fam(code){ code = up(code); const main = (WXF[code] && WXF[code].to) || code, M = [main].concat(Object.keys(WXF).filter(k => WXF[k] && WXF[k].to === main && k !== main)); if(M.length > 1) return { main, M };\n    /* 750: no manual link → ACTIVE's \"shared\" column (the package holder's row names the sibling who shares it) */\n    try{ if(typeof AT !== 'undefined' && AT && AT.cols && AT.cols.indexOf('shared') > -1){ const C = {}; AT.cols.forEach((c, i) => C[c] = i); const S = new Set();\n      AT.rows.forEach(r => { const a = up(r[C.code]), b = up(r[C.shared]); if(!b || a === b || r[C.enrolled] === '') return; if(a === code || b === code){ S.add(a + '>' + b); } });\n      if(S.size){ const [p] = [...S], [hold, sib] = p.split('>'); const L = [hold].concat([...S].map(x => x.split('>')[1]).filter((v, i, a) => a.indexOf(v) === i)); return { main: hold, M: L }; } } }catch(e){}\n    return null; }");
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
