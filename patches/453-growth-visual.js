// 20 Oct · Growth page (teacher's Growth & timeline, management and teacher views): colours, bars, grouped recognitions, visit summary.
const inc = require('fs').readFileSync(require('path').join(__dirname, '453-growth-visual.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
