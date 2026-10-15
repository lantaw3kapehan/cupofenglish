// 15 Oct · Teachers · To do that gets done (Misty: teachers saw the progress check request but did not act).
// Things management is waiting for (progress check, message, QA visit, trial report, fixes, homework…) now show
//  · at the top of Today in an orange box, each with its own button ("Fill it in now", "Read · tap Got it"…),
//  · in a "Before you start" pop-up when the app opens on laptop or phone (never during a class; "Remind me in 2 hours"),
//  · as a number on the browser tab / app icon, and as a phone notification once a day per item.
// Each item leaves once it is done. Code in 137-todo-must-act.inc.
const inc = require('fs').readFileSync(require('path').join(__dirname, '137-todo-must-act.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
