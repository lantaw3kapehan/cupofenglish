// 16 Oct · To do made cleaner (only things to act on) · Trials & enrolment moved to Overview.
const inc = require('fs').readFileSync(require('path').join(__dirname, '226-todo-cleaner.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
["<div class=\"tdsum\">${sum}</div>${pulse}${repH}${renH}${folH}${fixH}${refH}${numH}", "<div class=\"tdsum\">${sum}</div>${repH}${renH}${folH}${fixH}${refH}"],
["<span class=\"chip\" style=\"opacity:.7\" title=\"Package end date passed\">Package expired ${tdDate(x.dl)}</span>",
 "<span class=\"chip vend\" title=\"Package end date passed · classes continue\">Validity ended ${tdDate(x.dl)} · extended ${-x.dlN} day${x.dlN === -1 ? '' : 's'} · 已延长${-x.dlN}天</span>"],
["x.pm ? ' <span class=\"mute\">· ' + esc(x.pm) + ' a month</span>' : ''", "x.pm ? ' <span class=\"mute\">· ' + esc(x.pm) + ' lessons a month</span>' : ''"],
["if(el.closest('.cls')) return; const m = (el.getAttribute('onclick')", "if(el.closest('.cls') || el.closest('#v-mtoday')) return; const m = (el.getAttribute('onclick')"],
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
