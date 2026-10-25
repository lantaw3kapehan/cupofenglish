// 1003: live check after 1002 (Misty's laptop pane, 800 px wide): Overview's "things need you" strip squeezed its detail
// text into a narrow column (1000 let it wrap instead of cutting it off, but the strip is one row). Now the details move
// under the headline when there is no room beside it.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + '<style id="d1003">/* 1003 */ #v-home .x-todo{display:flex!important;flex-wrap:wrap!important;align-items:center;column-gap:10px;row-gap:2px}#v-home .x-todo>b{flex:0 1 auto}#v-home .x-todo>span{flex:1 1 280px!important;min-width:0!important}#v-home .x-todo>em{margin-left:auto}</style>\n' + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
