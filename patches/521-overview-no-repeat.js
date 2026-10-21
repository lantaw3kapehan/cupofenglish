// 21 Oct · Management Overview: no repeated numbers (glance sentence, greeting sentence, timeline counts) and lanes that fit the card.
const inc = require('fs').readFileSync(require('path').join(__dirname, '521-overview-no-repeat.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
