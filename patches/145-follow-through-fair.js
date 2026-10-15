// 15 Oct · Fairer follow-through warnings (Misty saw Kat's first list: every unread visit on its own line, the same
// follow-up 3 times, and a Final warning on day one). Now: late is counted from 15 Oct noon; unread visits are one line;
// "Not fixed"/"Same issue" count only if the teacher had read the earlier visit before the next one; repeats count once.
// Code in 145-follow-through-fair.inc.
const inc = require('fs').readFileSync(require('path').join(__dirname, '145-follow-through-fair.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
["'</div><ul>' + R.items.map(x => '<li class=\"small\"><b>'", "'</div><ul>' + R.items.slice(0, 6).map(x => '<li class=\"small\"><b>'"],
["(x.overdue && x.days >= 2 ? ' · ' + x.days + ' days' : '') + '</li>').join('') + '</ul>'", "(x.overdue && x.days >= 2 ? ' · ' + x.days + ' days' : '') + '</li>').join('') + (R.items.length > 6 ? '<li class=\"small\">+' + (R.items.length - 6) + ' more</li>' : '') + '</ul>'"],
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
