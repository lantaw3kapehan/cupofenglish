// 20 Oct · Monthly parent report made in the app at once (from the teacher's feedback via coe-fb), same look as the trial report;
// "PDF being made" reports can be opened and sent. The trial report's styles and PDF loader are shared (coeTrialCss, coeJsPdf).
const inc = require('fs').readFileSync(require('path').join(__dirname, '379-monthly-report.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
  ["  window.coeTrialPages = (t, r) => {", "  window.coeTrialCss = () => CSS; window.coeJsPdf = jspdf;   /* 379: shared with the monthly report */\n  window.coeTrialPages = (t, r) => {"],
  ["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]
]);
