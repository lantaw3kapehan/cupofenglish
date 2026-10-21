// 21 Oct · Teacher Students: summary bars (lessons left, feedback), calm student cards with book colour, lessons left and one feedback pill.
const inc = require('fs').readFileSync(require('path').join(__dirname, '504-teacher-students.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
