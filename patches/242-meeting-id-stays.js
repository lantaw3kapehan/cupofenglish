// 16 Oct · a saved meeting ID stays on the screen until Google has written it.
const inc = require('fs').readFileSync(require('path').join(__dirname, '242-meeting-id-stays.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
