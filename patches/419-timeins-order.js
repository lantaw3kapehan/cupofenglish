// 20 Oct · Time-ins final order: Today · Checks · Full details (most used first), with small part labels.
const inc = require('fs').readFileSync(require('path').join(__dirname, '419-timeins-order.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
