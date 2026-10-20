// 20 Oct · Overview in the Sales & costs look: calm chart colours, coloured tiles that do not cut off, expected net instead of the one-off-inflated pace, empty Levels card left out.
const inc = require('fs').readFileSync(require('path').join(__dirname, '485-overview-restyle.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
