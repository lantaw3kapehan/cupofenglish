// 15 Oct · Packages are database-first: "✏️ Fix this package" on a package (ACTIVE screen) for management.
const inc = require('fs').readFileSync(require('path').join(__dirname,'189-fix-package.inc'),'utf8');
require('../tools/lib.js')(process.argv[2], [
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
