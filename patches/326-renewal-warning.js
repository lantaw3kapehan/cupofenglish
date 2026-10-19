// 19 Oct · 326 · Renewal early warning 
const inc = require('fs').readFileSync(require('path').join(__dirname, '326-renewal-warning.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
