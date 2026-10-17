// 17 Oct · Performance screen from the database (Google only as a fallback).
const inc = require('fs').readFileSync(require('path').join(__dirname, '271-performance-from-database.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
