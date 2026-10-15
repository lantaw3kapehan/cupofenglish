// 15 Oct · Schedule class sheet: Student page · Edit details · + Add a class. Code in 176-class-sheet-student.inc.
const inc = require('fs').readFileSync(require('path').join(__dirname,'176-class-sheet-student.inc'),'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
