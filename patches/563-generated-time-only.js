// 22 Oct · Misty: "Generated 生成时间" shows only the time (24-hour, Manila); the date is already above.
require('../tools/lib.js')(process.argv[2], [
["  return d === String(inv && inv.day || '').slice(0, 10) ? hm : hm + ' · ' + dmy(d); };", "  return hm; };"],
]);
