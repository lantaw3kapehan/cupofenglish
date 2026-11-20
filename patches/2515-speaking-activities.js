// 2515 (Misty): the side-menu screen is now "Speaking Activities" (Talk of the Day, Free talk and IELTS Speaking inside).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["b.innerHTML = svg() + '<span class=\"nl\">Talk of the Day</span>'; b.title = 'Class openers for YLE, Teens and Adults';", "b.innerHTML = svg() + '<span class=\"nl\">Speaking Activities</span>'; b.title = 'Talk of the Day, Free talk and IELTS Speaking';"],
  ["v.innerHTML = '<iframe id=\"talkFr\" title=\"Talk of the Day\"", "v.innerHTML = '<iframe id=\"talkFr\" title=\"Speaking Activities\""]
]);
