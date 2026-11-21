// 2643 (Misty 21 Nov 18:31, Celine's Overview showed "From the President" many times): the card was looked for only as a direct child of the
// screen; Overview moves cards into its own wrapper, so it was not found and added again on every redraw. Now found anywhere in the screen,
// and any extra copy is removed. Same for "For your decision".
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
function region(id, R){ const a = s.indexOf('<script id="' + id + '">'), b = s.indexOf('</script>', a); if(a < 0 || b < a){ console.error(id); process.exit(1); }
  let seg = s.slice(a, b); for(const [x, y] of R){ const k = seg.split(x).length - 1; if(k !== 1){ console.error(id + ' match ' + k + ': ' + x.slice(0, 60)); process.exit(1); } seg = seg.split(x).join(y); }
  s = s.slice(0, a) + seg + s.slice(b); }
region('b2638', [["function put(v, first, h, force){ if(!v) return; var o = v.querySelector(':scope > #fp2638'); if(!h){ if(o) o.remove(); return; }", "function put(v, first, h, force){ if(!v) return; var A = v.querySelectorAll('#fp2638'), o = A[0] || null; for(var i = 1; i < A.length; i++) A[i].remove();   /* 2643: found wherever the screen moved it; never a second copy */\n    if(!h){ if(o) o.remove(); return; }"]]);
region('b2630', [["function put(v, after, h){ if(!v) return; var o = v.querySelector(':scope > #fy2630');\n    if(!o){ v.querySelectorAll('#fy2630').forEach(function(x){ x.remove(); });", "function put(v, after, h){ if(!v) return; var A = v.querySelectorAll('#fy2630'), o = A[0] || null; for(var i = 1; i < A.length; i++) A[i].remove();   /* 2643 */\n    if(!o){"]]);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
