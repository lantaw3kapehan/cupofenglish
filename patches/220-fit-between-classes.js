// 16 Oct · Best fit also inside the teacher's working span that day (first class → last class): a free time between her
// classes is time she is working anyway (Pam: 18:00 free between Annie 17:50 and Lily 18:30, though not in her saved hours).
require('../tools/lib.js')(process.argv[2], [
["    const now = Date.now() + 30 * 6e4, ok = t =>",
 "    if(day.length) blocks.push([day[0].s, Math.max(...day.map(c => c.e))]);   /* between her first and last class */\n    const now = Date.now() + 30 * 6e4, ok = t =>"],
]);
