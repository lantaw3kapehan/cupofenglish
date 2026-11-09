// 2017 (9 Nov 17:23, Teacher Pam could not time in on Edge: "page isn't responding", then the tab crashed, then Time in now did nothing):
//   several releases in a few minutes made her app restart itself to load each new version while she was timing in during her video call.
//   A teacher's app no longer restarts for a new version from 45 minutes before her first class until that class ends (the time-in window),
//   even in its first 15 seconds after opening; it shows the "New version ready" button instead. Classes were already protected
//   (from 20 minutes before each class). Released after the evening's classes.
const file = process.argv[2];
require('../tools/lib.js')(file, [
 [
  "if(typeof D === 'undefined' || !D || D.mgr || performance.now() < 15000) return false;",
  "if(typeof D === 'undefined' || !D || D.mgr) return false;\n  { const n0 = Date.now(), L0 = (D.schedule || []).filter(c => c && !c.cancelled && c.day === D.today).sort((a, b) => a.start.localeCompare(b.start)); if(L0[0] && n0 >= new Date(L0[0].start).getTime() - 45 * 6e4 && n0 <= new Date(L0[0].end).getTime()) return true; }   /* 2017: time-in window, even just after opening */\n  if(performance.now() < 15000) return false;"
 ]
]);
