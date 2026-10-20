// 20 Oct · Enquiries: a clickable funnel (logged → trial booked → enrolled · not now) with a 6-month chart; calmer, compact toolkit cards in numbered stages.
const inc = require('fs').readFileSync(require('path').join(__dirname, '431-enquiries-visual.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
