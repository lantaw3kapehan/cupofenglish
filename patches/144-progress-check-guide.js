// 15 Oct · Progress check: guided scoring (Misty: teachers are not guided which number to tap, too high or too low?).
//  · Under every 1–4 a short description of what that score looks like for that skill (e.g. Fluency 3 = "Full sentences,
//    a few pauses").
//  · Above each skill: "Last time: 3 (last check) · start from there…", the last-check button framed in blue with LAST;
//    with no earlier check, the trial, else a guide from the monthly feedback ("about 3.5").
//  · After tapping: green "✓ Same as last check", amber "▲ One above · give a real example", red "▲ 2 above · check again",
//    or "Higher than the October feedback suggests". Code in 144-progress-check-guide.inc.
const inc = require('fs').readFileSync(require('path').join(__dirname, '144-progress-check-guide.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
