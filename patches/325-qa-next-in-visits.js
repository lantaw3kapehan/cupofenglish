// 19 Oct · 325 · QA next actions checked in Celine's class visits 
const inc = require('fs').readFileSync(require('path').join(__dirname, '325-qa-next-in-visits.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
