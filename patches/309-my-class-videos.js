// 19 Oct · Teacher Today: "My class videos" (yesterday + today, found / not found yet, last check) from the video check log.
const inc = require('fs').readFileSync(require('path').join(__dirname, '309-my-class-videos.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
