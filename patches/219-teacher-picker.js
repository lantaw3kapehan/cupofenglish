// 16 Oct · Schedule: the teacher chips (running off the screen) become one Teacher picker next to By time / By teacher.
const inc = require('fs').readFileSync(require('path').join(__dirname, '219-teacher-picker.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
