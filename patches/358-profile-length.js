// 20 Oct · Student page: repeated profile fields shown once (Renewal cycle), "With us … · since …" chip at the top.
const inc = require('fs').readFileSync(require('path').join(__dirname, '358-profile-length.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
