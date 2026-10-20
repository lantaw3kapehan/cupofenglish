// 20 Oct · Time-ins Full details: no repeated titles or totals; Management hours as a day-by-day chart per person.
const inc = require('fs').readFileSync(require('path').join(__dirname, '415-details-charts.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
