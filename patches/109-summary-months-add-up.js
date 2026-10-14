// 14 Oct pm · Lesson summary: the month history adds up to "Lessons Completed" (Misty: "the logic in computing numbers is not
// logical" — Mandy: completed 13, but October 3 + September 9 = 12). "Completed" already counts today's classes that have
// ended (the sheet counts them a little later); now this month's row in the history counts them too, so 4 + 9 = 13.
require('../tools/lib.js')(process.argv[2], [
["let hist = mm.filter(x => x.ym && (!start || x.ym >= start)); { const live = o[C.active]",
 "{ const tdy = n1(rows0.reduce((a, x) => a + ((C.today != null && +x[C.today]) || 0), 0)), d0 = new Date(), cym = d0.getFullYear() + '-' + ('0' + (d0.getMonth() + 1)).slice(-2), cm = mm.find(x => x.ym === cym); if(tdy && cm) months[cm.i] = n1((months[cm.i] || 0) + tdy); }   /* 14 Oct pm: today's ended classes in this month's row too */\n" +
 "let hist = mm.filter(x => x.ym && (!start || x.ym >= start)); { const live = o[C.active]"],
]);
