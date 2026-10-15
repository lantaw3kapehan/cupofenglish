// 15 Oct · New class for a student: name in the title, Quick pick (next 14 days), live clash / past-time check;
// Enquiries: "All" becomes "Open" (enrolled and not-now leave the list; they keep their own tabs).
const inc = require('fs').readFileSync(require('path').join(__dirname,'177-class-form-quick.inc'),'utf8');
require('../tools/lib.js')(process.argv[2], [
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
["not: L.filter(e => e.st === 'Not now'), all: L };", "not: L.filter(e => e.st === 'Not now'), all: L.filter(e => e.st !== 'Enrolled' && e.st !== 'Not now') };"],
["['not', 'Not now'], ['all', 'All'], ['results', 'Results']];", "['not', 'Not now'], ['all', 'Open'], ['results', 'Results']];"],
["(ENQ_F === 'follow' ? 'No one to follow up. Nice work.' : 'None here.')", "(ENQ_F === 'follow' ? 'No one to follow up. Nice work.' : ENQ_F === 'all' ? '✓ All clear · every enquiry is enrolled or set to Not now' : 'None here.')"],
]);
