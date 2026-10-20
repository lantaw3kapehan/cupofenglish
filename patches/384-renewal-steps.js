// 20 Oct · Student page: Renewal step by step (answer → paid → picture → schedule → notice → agreement), like the trial sheet.
const inc = require('fs').readFileSync(require('path').join(__dirname, '384-renewal-steps.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
