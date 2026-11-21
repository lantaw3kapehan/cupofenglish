// 2560 (Misty 21 Nov 09:42, Una): a Missed lesson says "lesson returned to the student" only when the teacher cancelled within
// 2 hours (that is when the lesson is given back); cancelled earlier → "cancelled ahead · the student keeps the lesson".
// (The notice itself is now counted from when the class was cancelled: coe_missed_mark 2560; the class record replaces the System check: coe-late v6.)
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["' · lesson returned to the student · no automatic decision'",
   "(+x.mins < 120 ? ' · lesson returned to the student' : ' · cancelled ahead · the student keeps the lesson') + ' · no automatic decision'"],
]);
