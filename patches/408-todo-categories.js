// 20 Oct · To do categories: one colour + icon per kind of work (renewals amber, follow-ups purple, reports teal, data slate), coloured row numbers, meaningful tag colours, first button filled.
const inc = require('fs').readFileSync(require('path').join(__dirname, '408-todo-categories.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
