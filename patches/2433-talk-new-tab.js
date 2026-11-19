// 2433 (Misty 19 Nov 15:44: "I want it to open as a new tab, same with teachers") · Talk of the Day opens in a new tab
//   (menu, Today card, To do box), so the app stays open behind it.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["location.href = 'talk/'", "window.open('talk/', '_blank')"],
  ["href=\"talk/?t=' + t.id + '\" style=\"text-decoration:none\"", "href=\"talk/?t=' + t.id + '\" target=\"_blank\" style=\"text-decoration:none\""],
  ["href=\"talk/\" style=\"text-decoration:none\"", "href=\"talk/\" target=\"_blank\" style=\"text-decoration:none\""],
  ["href=\"talk/\" style=\"margin-left:auto;text-decoration", "href=\"talk/\" target=\"_blank\" style=\"margin-left:auto;text-decoration"]
]);
