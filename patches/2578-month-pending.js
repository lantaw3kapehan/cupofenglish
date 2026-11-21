// 2578 (audit QA-12, verified 21 Nov): Fri 20 Nov was 52 in the week strip and 51 in Month. The difference is Vanessa's 17:00 class with
// Pam, still a pending booking (the calendar write of 14 Nov never confirmed). Month leaves pending bookings out of the count, as pay and
// packages do; it now shows them beside the count so the two views can be read together.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["'<span class=\"ch\">' + (x && x.cx ? '<span class=\"cx\">' + x.cx + ' cancelled</span>' : '')",
   "'<span class=\"ch\">' + (x && x.cx ? '<span class=\"cx\">' + x.cx + ' cancelled</span>' : '') + (x && x.pend ? '<span class=\"cx\" style=\"background:#FFF4E0;color:#8A5A12\" title=\"Booked in the app but not confirmed in the calendar · not in the count, pay or package until confirmed\">+' + x.pend + ' not confirmed</span>' : '')   /* 2578 */"],
]);
