// 1114: (Misty 16:31) side-menu Excellence link fully readable: two lines, no ellipsis — "Bronze · 74.3" / "#5 · Oct so far"
// (not ranked: "Not ranked yet" / "Oct · needs 20 h to rank"); the coin keeps the level colour. The native hover tooltip
// ("Teacher Excellence · tap for details") is removed so nothing covers the menu; the full text is the aria-label. Display only.
const fs = require('fs'), file = process.argv[2];
require('../tools/lib.js')(file, [
  ["<span class=\"kx12t\"><b>Excellence · ' + (me.rank ? E(me.level) : 'Not ranked yet') + '</b><small>'\n    + (me.rank ? '#' + me.rank + ' · ' : '') + E(mon.slice(0, 3)) + (m.final ? ' · final' : ' · so far') + '</small></span>",
   "<span class=\"kx12t\"><b>' + (me.rank ? E(me.level) + (t >= 0 ? ' · ' + E(t) : '') : 'Not ranked yet') + '</b><small>'\n    + (me.rank ? '#' + me.rank + ' · ' + E(mon.slice(0, 3)) + (m.final ? ' final' : ' so far') : E(mon.slice(0, 3)) + ' · needs 20\u00a0h to rank') + '</small></span>"],
  ["(me.rank && t >= 0 ? E(t) : '—')", "(me.rank ? '' : '—')"],
  ["if(k){ var lab = 'Teacher Excellence · '", "if(k && k.hasAttribute('title')) k.removeAttribute('title'); if(k){ var lab = 'Teacher Excellence · '"],
]);
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + '<style id="d1114">#kxSide .kx12t b,#kxSide .kx12t small{white-space:normal!important;overflow:visible!important;text-overflow:clip!important;overflow-wrap:anywhere}#kxSide .kx12t small{line-height:1.3}#kxSide .kx12m{font-size:12px!important}</style>\n' + s.slice(i);
fs.writeFileSync(file, s);
