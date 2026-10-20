// 20 Oct · Student page final polish: line icons, quiet header chips, one action card, no repeated "Active".
const inc = require('fs').readFileSync(require('path').join(__dirname, '394-student-final-polish.inc'), 'utf8');
const CAL = '<svg class="lic" width="14" height="14" style="display:inline-block;width:14px;height:14px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>';
require('../tools/lib.js')(process.argv[2], [
  ["'<span class=\"lb\">🗓 Every week</span>' + S.map", "'<span class=\"lb\">" + CAL + "Every week</span>' + S.map"],
  ["'<span class=\"lb\">🗓 Every week</span><span class=\"mt\">No weekly", "'<span class=\"lb\">" + CAL + "Every week</span><span class=\"mt\">No weekly"],["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
