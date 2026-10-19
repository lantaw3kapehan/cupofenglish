// 19 Oct · Change teacher / schedule: stop the old weekly days (whole series, via Google), add any number of new weekly days with the new teacher and book.
const inc = require('fs').readFileSync(require('path').join(__dirname, '352-change-schedule.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
