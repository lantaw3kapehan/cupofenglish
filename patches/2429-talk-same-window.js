// 2429 (Misty 19 Nov 15:09: "it should still be in same browser, it opens in a separate app?") · Talk of the Day opens in the same window
//   (menu, Today card, To do box); the page has "‹ Back to the app".
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["window.open('talk/', '_blank', 'noopener')", "location.href = 'talk/'"],
  ["'\" target=\"_blank\" rel=\"noopener\" style=\"text-decoration:none\">Open · share with student</a>'", "'\" style=\"text-decoration:none\">Open · share with student</a>'"],
  ["href=\"talk/\" target=\"_blank\" rel=\"noopener\" style=\"text-decoration:none\">Talk library", "href=\"talk/\" style=\"text-decoration:none\">Talk library"],
  ["href=\"talk/\" target=\"_blank\" rel=\"noopener\" style=\"margin-left:auto", "href=\"talk/\" style=\"margin-left:auto"]
]);
