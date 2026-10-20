// 20 Oct · The child's age on the student page (chip next to the code) and on the trial report sheet; name from DATABASE when only the code is known.
const inc = require('fs').readFileSync(require('path').join(__dirname, '356-age-everywhere.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
