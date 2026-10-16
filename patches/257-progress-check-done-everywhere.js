// 16 Oct · a progress check sent on one device no longer shows "Fill it in now" on the teacher's other devices.
const inc = require('fs').readFileSync(require('path').join(__dirname, '257-progress-check-done-everywhere.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
