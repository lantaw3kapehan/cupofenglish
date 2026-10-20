// 20 Oct · Trials: tighter spacing everywhere (Misty: "the spaces are too big from each other").
const inc = require('fs').readFileSync(require('path').join(__dirname, '436-trials-tight.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
