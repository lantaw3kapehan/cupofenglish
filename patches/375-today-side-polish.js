// 20 Oct · Teacher Today: To do and Messages tidied (tag above title, two-line titles; three message rows, "See all ›" in the heading, compact buttons).
const inc = require('fs').readFileSync(require('path').join(__dirname, '375-today-side-polish.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
