// 1688: (Misty, 1 Nov 10:53) "Nico and Lemon cancelled their lessons yesterday, but Celine saw it late at night; when she cancels
//   it's under 2 h, so now it's counting as a successful lesson. How would we cancel it so it won't count with the teacher?"
//   Under 2 h (or after the class started) the cancel form only offered teacher reasons (Teacher unavailable / Internet problem /
//   Power outage), so a parent who told us in time could only be cancelled by blaming the teacher (Lemon 31 Oct: "The teacher
//   asked for leave"). New reason: "Parent told us in time · seen late by CupOfEnglish". It passes the under-2-h check (a
//   CupOfEnglish reason), so the class is cancelled: not a completed lesson, the package keeps the lesson (make-up box as before),
//   and the teacher sees it was the parent, not her.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["(late2 ? ['Teacher unavailable','Internet problem','Power outage'] :",
   "(late2 ? ['Parent told us in time · seen late by CupOfEnglish','Teacher unavailable','Internet problem','Power outage'] :"]
]);
