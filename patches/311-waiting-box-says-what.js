// 19 Oct · the waiting box's title names what management is waiting for.
const inc = require('fs').readFileSync(require('path').join(__dirname, '311-waiting-box-says-what.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
