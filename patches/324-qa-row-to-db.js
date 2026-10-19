// 19 Oct · A QA sent from the app is written into the database copy of QA-DATA at once (Teacher Excellence, QA history, Performance count it within seconds).
const inc = require('fs').readFileSync(require('path').join(__dirname, '324-qa-row-to-db.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
