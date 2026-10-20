// 20 Oct · Overview on one laptop screen: short top band with To do, four small chart cards (donuts, columns, compact bars), Business + Quality side by side.
const inc = require('fs').readFileSync(require('path').join(__dirname, '406-overview-compact.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
