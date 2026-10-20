// 20 Oct · Overview polish: shorter hero with two-line tiles, number cards in the app card style, calm alert and phone-alert lines, no teal outline, "Live · 15:12".
const inc = require('fs').readFileSync(require('path').join(__dirname, '402-overview-polish.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
  ["lt.innerHTML = '<i></i>Live · ' + PULSE.time + 'H';", "lt.innerHTML = '<i></i>Live · ' + PULSE.time;"],
  ["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
