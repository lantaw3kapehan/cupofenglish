// 20 Oct · Time-ins bottom as chart cards (office hours bars, class-record rings, visits ring + bars, health gauge, changes per hour); Latest changes with coloured kinds, filters and hour groups.
const inc = require('fs').readFileSync(require('path').join(__dirname, '414-timeins-board.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
