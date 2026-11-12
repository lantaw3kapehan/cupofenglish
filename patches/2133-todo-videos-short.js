// 2133 (12 Nov audit · repeats): To do › Class videos repeated "· tap for the videos" on every teacher's line (the line itself opens them).
// Now: "November so far: 0 missing · 1 late upload".
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [["' late upload' + (x.monthLate === 1 ? '' : 's') + ' · tap for the videos</div>'", "' late upload' + (x.monthLate === 1 ? '' : 's') + '</div>'"]]);
