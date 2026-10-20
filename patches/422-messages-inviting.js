// 20 Oct · Messages inviting to read: pill tabs, folded "Not acting on feedback", chat-style inbox with coloured avatars, day headers, quiet status; header "Live · 16:08" without H.
const inc = require('fs').readFileSync(require('path').join(__dirname, '422-messages-inviting.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
  ["Live${PULSE.time?' · '+PULSE.time+'H':''}", "Live${PULSE.time?' · '+PULSE.time:''}"],
  ["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
