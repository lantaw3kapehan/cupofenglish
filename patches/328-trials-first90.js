// 19 Oct · 328 · Trial results per teacher + first 90 days for new teachers 
const inc = require('fs').readFileSync(require('path').join(__dirname, '328-trials-first90.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
