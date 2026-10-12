// Price picture: the "None" option (no package highlighted) also shows when it is opened from a trial report.
require('../tools/lib.js')(process.argv[2], [
[
"(PP.o.student ? '' : '<button class=\"' + (PP.rec === '' ? 'on' : '') + '\" onclick=\"ppRec(\\'\\')\">None</button>')",
"'<button class=\"' + (PP.rec === '' ? 'on' : '') + '\" onclick=\"ppRec(\\'\\')\">None</button>'"
]
]);
