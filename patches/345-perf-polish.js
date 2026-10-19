// 19 Oct · Performance polished: calm read receipts, "Team check-ins" tiles, slimmer counts; read times in 24-hour.
const inc = require('fs').readFileSync(require('path').join(__dirname, '345-perf-polish.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
["  const when = s => new Date(s).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });",
 "  const when = s => new Date(s).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false });   /* 345: 24-hour */"],
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
