// 20 Oct · To do calmer (outlined tags, one button style) · Time-ins: today first, the rest in closed rows at the bottom · no "H" after times.
const inc = require('fs').readFileSync(require('path').join(__dirname, '405-todo-timeins-calm.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
  ["${upd ? 'Updated ' + esc(upd) + ' · ' : ''}${TD && TD.db ? 'worked out live by the database' : 'from the TODAY tab'}", "${upd ? 'Updated ' + esc(String(upd).replace(/(\\d{1,2}:\\d{2})H\\b/, '$1')) : ''}"],
  ["${PULSE.time ? 'updated ' + PULSE.time + 'H' : ''}", "${PULSE.time ? 'updated ' + PULSE.time : ''}"],
  ["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
