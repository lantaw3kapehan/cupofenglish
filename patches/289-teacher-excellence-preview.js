// 19 Oct · Teacher Excellence preview (President only) on the Performance screen.
const inc = require('fs').readFileSync(require('path').join(__dirname, '289-teacher-excellence-preview.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
  ["${isPres() ? '<button class=\"btn sm teal\" onclick=\"qaSheet()\">+ QA evaluation</button>' : ''}</div><div id=\"peerBox\">",
   "${isPres() ? '<button class=\"btn sm ghost\" onclick=\"kpiSheet()\">🏆 Teacher Excellence</button> <button class=\"btn sm teal\" onclick=\"qaSheet()\">+ QA evaluation</button>' : ''}</div><div id=\"peerBox\">"],
  ["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
