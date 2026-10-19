// 19 Oct · Phone notifications even when the app is closed (teachers): the phone is registered once reminders are allowed; iPhone gets a short "Add to Home Screen" card.
const inc = require('fs').readFileSync(require('path').join(__dirname, '331-phone-push.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
