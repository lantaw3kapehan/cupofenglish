// 20 Oct · Students list polish: filters on one row, shorter rows (code on the name line, chips on one line), validity in the Valid until column.
const inc = require('fs').readFileSync(require('path').join(__dirname, '427-students-list.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
