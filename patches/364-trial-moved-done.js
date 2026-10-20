// 20 Oct · "Write report" cleared for a trial moved to another day once the teacher has sent its report (edge function coe-trials).
const inc = require('fs').readFileSync(require('path').join(__dirname, '364-trial-moved-done.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
