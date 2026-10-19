// 19 Oct · Teacher Today: waiting box says "N things" + a short what-line, shows 3 rows then "Show all"; items already in it are not repeated in the red warning box.
const inc = require('fs').readFileSync(require('path').join(__dirname, '315-today-boxes-tidy.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
