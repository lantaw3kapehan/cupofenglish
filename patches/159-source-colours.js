// 15 Oct · Student source as colour labels: indigo partner · green referral · teal CupOfEnglish · coral not set, soft
// background + coloured edge + icon; a colour key with counts above the list filters by source. Code in the .inc.
const inc = require('fs').readFileSync(require('path').join(__dirname, '159-source-colours.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
