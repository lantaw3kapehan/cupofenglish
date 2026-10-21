// 21 Oct · No flicker: screens not redrawn when the fresh copy equals the saved one; teacher Today redraws merged, scroll and opened parts kept.
const inc = require('fs').readFileSync(require('path').join(__dirname, '497-no-flicker-today.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
