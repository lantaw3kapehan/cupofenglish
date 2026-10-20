// 20 Oct · From the trial screen the trial's name wins over a wrong ACTIVE name (Elsa shown as Eric) · no N/A / REF book chips.
const inc = require('fs').readFileSync(require('path').join(__dirname, '386-trial-name-wins.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
