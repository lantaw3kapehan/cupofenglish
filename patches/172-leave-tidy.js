// 15 Oct · Leave tidied (all-zero counts → one all-clear line, waiting tile coral, flow strip). Code in 172-leave-tidy.inc.
const inc = require('fs').readFileSync(require('path').join(__dirname,'172-leave-tidy.inc'),'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
