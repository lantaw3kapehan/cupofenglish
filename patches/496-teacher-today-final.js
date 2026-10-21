// 21 Oct · Teacher Today final polish: no repeated I'm-in chip, finished classes fold, settings card last, even spacing.
const inc = require('fs').readFileSync(require('path').join(__dirname, '496-teacher-today-final.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
