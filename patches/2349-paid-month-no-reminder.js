// 2349 (Misty 18 Nov, Kat): the "From management · N to finish for your <month> pay" reminder stays hidden once that month is paid (Pay already hid it; To do did not).
const file = process.argv[2];
require('../tools/lib.js')(file, [
["if(MYR && MYR.nudge && MYR.me && rdyCount(MYR.me)){", "if(MYR && MYR.nudge && MYR.me && rdyCount(MYR.me) && !payPaid(MYR.month)){"]
]);
