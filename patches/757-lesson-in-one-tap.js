// 757: (Misty) the "In · 14:55" chip on each lesson stays, and now works like the header button: on the class laptop one tap opens
// the share window (Entire screen → Share) and ends with the same ✓ saved / ✕ not saved card. On a phone or tablet it explains to use the laptop (756).
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const a = "  window.OUT_ARM_GO = () => {";
if (s.split(a).length !== 2) { console.error('anchor'); process.exit(1); }
s = s.replace(a, `  /* 757 · the lesson chip uses the same one tap */
  const _ci = window.classIn; if(_ci && !_ci.__757){ const w = function(id){ if(isLap() && !BUSY) return tapClassIn(id); return _ci.apply(this, arguments); }; w.__757 = 1; window.classIn = w; }
  window.tapClassIn = (orig => function(id){ if(!isLap()) return _ci(id); return orig(id); })(window.tapClassIn);
` + a);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
