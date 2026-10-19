// 19 Oct · Messages: a reply counts as acting on it; seen-only stays a warning.
const inc = require('fs').readFileSync(require('path').join(__dirname, '279-messages-replied-counts.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
