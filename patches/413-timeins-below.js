// 20 Oct · Time-ins below the timeline: "Needs a look" (problem rows only), "Office" side by side with My time-in, every teacher's details folded under More.
const inc = require('fs').readFileSync(require('path').join(__dirname, '413-timeins-below.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
