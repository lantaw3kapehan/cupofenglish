// 2397 (Misty 19 Nov 10:58, "to avoid easy mistake"): the welcome message's "Purchased online" starts on today's date (Manila),
//   not the package's first class date. It can still be changed.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["carry: p.carry || '', date: p.st, ren:",
   "carry: p.carry || '', date: new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10), ren:"]
]);
