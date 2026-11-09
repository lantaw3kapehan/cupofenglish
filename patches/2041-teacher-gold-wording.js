// 2041 (follows 2040): with 88+ during the month the teacher card still said "You are at Gold. Keep it to the end of the month."
//   It now reads "Strong month so far. Your level is set when the month closes." (no level is named before the month is final).
const file = process.argv[2];
require('../tools/lib.js')(file, [
 ["if(!nx) return 'You are at Gold.|Keep it to the end of the month.';", "if(!nx) return 'Strong month so far.|Your level is set when the month closes.';   /* 2041 */"]
]);
