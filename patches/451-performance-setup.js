// 20 Oct · Performance: Teaching setup as a progress bar + screenshot cards; "not sent yet" names on one line; check-in tiles show a bar.
const fs = require('fs'), path = require('path');
const old = fs.readFileSync(path.join(__dirname, '451-old.txt'), 'utf8'), neu = fs.readFileSync(path.join(__dirname, '451-new.txt'), 'utf8'), inc = fs.readFileSync(path.join(__dirname, '451-performance-setup.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [[old, neu], ["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
