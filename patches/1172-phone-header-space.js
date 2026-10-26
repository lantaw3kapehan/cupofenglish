// 1172: management on a phone — the header grew from one line to two (73 → 112 px) a few seconds after the screen appeared,
//      when the "online" and time-in pills arrived (1102 puts them on a second line), and pushed the whole screen down.
//      The two-line height is now kept from the start for management on phones. Teachers and laptops unchanged.
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
lib(file, [["let MODE = store('get','coe.mode') === 'mgmt' ? 'mgmt' : 'teacher';",
  "let MODE = store('get','coe.mode') === 'mgmt' ? 'mgmt' : 'teacher';\nif(MODE === 'mgmt'){ try{ document.documentElement.classList.add('m1172'); }catch(e){} }"]]);
let s = fs.readFileSync(file, 'utf8'); const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + '<style id="d1172">/* 1172 · management phone header keeps its two-line height from the start */ @media(max-width:640px){html.m1172 header[role=banner]{min-height:112px}}</style>\n' + s.slice(i);
fs.writeFileSync(file, s); lib(file, []);
