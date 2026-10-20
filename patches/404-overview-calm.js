// 20 Oct · A calm Overview: light welcome, one To do line, four pictures (source, packages, levels, students per teacher).
const inc = require('fs').readFileSync(require('path').join(__dirname, '404-overview-calm.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
