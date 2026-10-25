// 994: (Misty, 25 Oct 19:40) "why there's panel on the left side corner?" — the small "PANEL" tag that 892 put next to
// Contracts and Notices of breach (they open over the page instead of as a page) confused more than it helped and made
// "Notices of breach" wrap onto two lines. The tag is hidden; the hover tip "Opens as a panel over this page" and the
// screen-reader hint (aria-haspopup) stay.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + '<style id="s994">/* 994 */ .g892-p{display:none!important}</style>\n' + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
