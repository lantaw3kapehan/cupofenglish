// 20 Oct · Weekly package: each day its own time (Sat 15:30 + Sun 11:00), two classes on a day, one booking per time.
const inc = require('fs').readFileSync(require('path').join(__dirname, '383-multi-slot-weekly.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
  ["<div class=\"small mute\">Same time on the chosen days every week</div>", "<div class=\"small mute\">Tap the days · each day can have its own time</div>"],
  ["' · every ' + dd.map(d => W[d]).join(' & ')", "' · every ' + (window._mxLbl ? window._mxLbl.en : dd.map(d => W[d]).join(' & '))"],
  ["' · 每周' + dd.map(d => WZ[d]).join('、')", "' · ' + (window._mxLbl ? window._mxLbl.zh : '每周' + dd.map(d => WZ[d]).join('、'))"],
  ["Tap the days (e.g. Tue + Fri), the time and the length", "Tap the days (e.g. Sat + Sun), then each day’s time (e.g. Sat 15:30, Sun 11:00), the length"],
  ["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
