// 20 Oct · Student header: the usual weekly schedule (Sat 15:30 · Sun 11:00 · length · teacher · next class).
const inc = require('fs').readFileSync(require('path').join(__dirname, '393-hero-weekly.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
