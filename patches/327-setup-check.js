// 19 Oct · 327 · Teaching setup check 
const inc = require('fs').readFileSync(require('path').join(__dirname, '327-setup-check.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
