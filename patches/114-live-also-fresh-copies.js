// 14 Oct night · For the screens the database works out (patch 110/113), a copy under 3 minutes old is also used as it is
// (today's schedule, a student's class list), the same rule patch 112 gave every other screen.
require('../tools/lib.js')(process.argv[2], [
["  if(SB_LIVE.test(fn)){ const d = await sbDoc(key); if(d && d.live && age(d) < 90 * 6e4) return d.data;",
 "  if(SB_LIVE.test(fn)){ const d = await sbDoc(key); if(d && ((d.live && age(d) < 90 * 6e4) || age(d) < 180000)) return d.data;"],
]);
