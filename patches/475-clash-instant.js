// 20 Oct · Add class / move: instant clash check from the class table (coe-clash); Google's check merges in behind it.
const inc = require('fs').readFileSync(require('path').join(__dirname, '475-clash-instant.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
