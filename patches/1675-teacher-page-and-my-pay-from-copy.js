// 1675: (Misty, 31 Oct 14:25, after the 30 Oct App health) the two management waits left:
//   · Teacher page (mgmtTeacher): 15 s on Google, 18 taps in 2 days. The database copy is used at once only if it is under 3 days
//     old; teachers opened less often (Martin, Rose, Virgo, Cy: copies from 25 Oct) waited for Google every time. Now any saved copy up
//     to 30 days old opens at once and Google's fresh page replaces it a few seconds later (same as student pages).
//   · My pay (mgmtMyPay): the screen already showed this device's last copy, but every open still asked Google (8 s, 59 times in 2
//     days, there is no database copy of a person's own pay). Now a copy under 30 minutes old is used as it is, unless you saved
//     something in the last 2 minutes; older copies are shown and refreshed behind, as before.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["const SB_UIAGE = { getBootstrap: 1, ", "const SB_UIAGE = { mgmtTeacher: 30 * 864e5, getBootstrap: 1, "],
  ["_c1300 = quiet && kept('mypay') && Date.now() - _t1300 < 30 * 6e4;",
   "_c1300 = kept('mypay') && Date.now() - _t1300 < 30 * 6e4 && (quiet || typeof SB_LASTW === 'undefined' || !SB_LASTW || Date.now() - SB_LASTW > 120000);   /* 1675: not only when quiet */"]
]);
