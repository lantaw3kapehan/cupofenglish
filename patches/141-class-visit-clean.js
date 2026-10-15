// 15 Oct · Class visit (teacher's view) looks calmer (Misty: "improve the visual … while maintaining minimalism").
// The checks are a quiet two-column list (area · status), with what needs work first and only the status coloured;
// "watched under 5 min" moves to the line under the title; the follow-up from the last visit is its own small card.
// Code in 141-class-visit-clean.inc.
const inc = require('fs').readFileSync(require('path').join(__dirname, '141-class-visit-clean.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
