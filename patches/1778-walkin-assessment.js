// 1778: (Misty 5 Nov 12:54–12:56 "integrate on the app like on management ... a walk-in for her communication skill and academic writing skill ...
//   aligned with IELTS and IELTS scoring ... instant and real time"; "when she performs later, I can easily send to her and explain to her";
//   "ensure our logo is also there and align with the copy picture template we use now in the app")
//   Management › More › Walk-in assessment: Speaking (3 parts, questions, cue card, timers, notes) and Academic Writing Task 2 (her own writing link,
//   seen live, 40-minute clock, word count), IELTS criteria 0–9, bands / Speaking + Writing / CEFR counted by the database (coe_assessments trigger),
//   final record, a result link for her (assess/?r=…) and a picture in the calendar/payslip picture design with the logo.
//   Readable source: patches/src/1778-walkin-assessment.client.js · edge function coe-assess.
const lib = require("../tools/lib.js"), fs = require("fs"), path = require("path"), file = process.argv[2];
const CODE = fs.readFileSync(path.join(__dirname, "src/1778-walkin-assessment.client.js"), "utf8");
lib(file, [["</body>\n</html>", CODE + "</body>\n</html>"]]);
