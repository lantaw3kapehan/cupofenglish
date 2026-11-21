// 2641: For your decision lists the President's own follow-ups to Operations (not tied to an item), with Celine's reply and Done.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const a = s.indexOf('<script id="b2630">'), b = s.indexOf('</script>', a); if(a < 0 || b < a){ console.error('b2630'); process.exit(1); }
let seg = s.slice(a, b); const R = [["    var M = (PD && PD.marks) || {}; L.forEach(function(x){ x.sig = x.n + '|' + x.s; var m = M[x.k]; x.m = m && m.sig === x.sig ? m : null; });", "    var M = (PD && PD.marks) || {}; L.forEach(function(x){ x.sig = x.n + '|' + x.s; var m = M[x.k]; x.m = m && m.sig === x.sig ? m : null; });\n    /* 2641: follow-ups that are not one of the items above (tasks sent to Operations, e.g. the 36 package start dates) show as their own rows */\n    Object.keys(M).forEach(function(k){ var m = M[k]; if(!m || m.st !== 'followed' || L.some(function(x){ return x.k === k; })) return; L.push({ k: k, n: '\\u2192', t: m.t || k, s: m.s || '', sig: m.sig, m: m, go: \"go('mtoday')\", b: 'Open' }); });"]];
for(const [x, y] of R){ const k = seg.split(x).length - 1; if(k !== 1){ console.error('match ' + k + ': ' + x.slice(0, 60)); process.exit(1); } seg = seg.split(x).join(y); }
fs.writeFileSync(file, s.slice(0, a) + seg + s.slice(b));
require('../tools/lib.js')(file, []);
