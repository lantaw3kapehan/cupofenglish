// 21 Oct · To do › Paused or not renewing: one quiet line each, no renewal chips, "Still ticked in ACTIVE · Untick" when the untick did not go through.
const inc = require('fs').readFileSync(require('path').join(__dirname, '491-todo-not-renewing.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
