// 2611: the "Validity to review" card (2609) showed the code twice and no name: MS is a script-level variable, not window.MS.
// Read MS directly; when a student is not in the list (finished students), show the code once.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["var nm = ((window.MS || []).find(function(m){ return String(m.code).toUpperCase() === x.code; }) || {}).name || '';",
   "var nm = (((typeof MS !== 'undefined' && Array.isArray(MS)) ? MS : []).find(function(m){ return String(m.code).toUpperCase() === x.code; }) || {}).name || '';"],
  ["E(nm || x.code) + '</b> <span class=\"small mute\">' + E(x.code) + ' · validity ended '",
   "E(nm || x.code) + '</b> <span class=\"small mute\">' + (nm ? E(x.code) + ' · ' : '') + 'validity ended '"],
]);
