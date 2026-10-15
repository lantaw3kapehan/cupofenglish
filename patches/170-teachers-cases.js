// 15 Oct · Teachers as cards (rank colour, units bar, completion bar, late) and Cases with a month line, counts,
// teacher filter, month groups, colour edges and the full date. Code in 170-teachers-cases.inc.
const inc = require('fs').readFileSync(require('path').join(__dirname,'170-teachers-cases.inc'),'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
