// 2024 (9 Nov 18:10, URGENT · teachers' apps froze on opening: Pam, Rose, Dezza and others). Cause found and reproduced on Teacher Pam's
//   Today at 1366 px: 2002 put the Christmas card right after the next class when "Needs your action" was empty (hidden); the arranger
//   then put "Needs your action" back right after the next class, which moved the card, which moved the actions box back… forever
//   (each move wakes the arranger again). Teachers with the Christmas card and no action items froze. The card now always goes after
//   the actions box, hidden or not, so nothing is moved twice.
const file = process.argv[2];
require('../tools/lib.js')(file, [
 [
  "var tail2002 = (!cols && day && day.previousElementSibling === td) ? day : (td.style.display === 'none' ? anchorTd : td), xm2002 = q('#x21c');",
  "var tail2002 = (!cols && day && day.previousElementSibling === td) ? day : td, xm2002 = q('#x21c');   /* 2024: after td even when it is hidden (anchorTd made td and the card swap places forever) */"
 ]
]);
