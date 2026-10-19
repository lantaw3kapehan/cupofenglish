// 19 Oct · QA form: her earlier QA months, team average and this month's visits on top; empty answers filled from her last QA (marked); a marker on each score; a word-for-word check before sending.
const inc = require('fs').readFileSync(require('path').join(__dirname, '316-qa-from-last-month.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
