// 19 Oct · progress checks already sent (PR-DATA in the database) clear from the teacher's warnings on any device.
const inc = require('fs').readFileSync(require('path').join(__dirname, '300-progress-check-done-any-device.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
