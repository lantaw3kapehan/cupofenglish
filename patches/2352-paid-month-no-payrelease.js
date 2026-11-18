// 2352 (Misty 18 Nov, Kat again): the "N to finish before your <month> pay is released" line also stays hidden once that month is paid (2349 hid only the red Reminder, so it fell through to this line).
const file = process.argv[2];
require('../tools/lib.js')(file, [
["else if(MYR && MYR.me && rdyCount(MYR.me)) todo.push(", "else if(MYR && MYR.me && rdyCount(MYR.me) && !payPaid(MYR.month)) todo.push("]
]);
