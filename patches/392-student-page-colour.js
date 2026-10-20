// 20 Oct · Student page colour with meaning (teal send · navy manage · green / amber / coral state), status pill, shorter labels, tab icons, "Next" class.
const inc = require('fs').readFileSync(require('path').join(__dirname, '392-student-page-colour.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
