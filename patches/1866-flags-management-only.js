// 1866: (Misty 7 Nov "show the management only") The system's "I'm in" / time-in warnings (e.g. "125.7 km from time-in place") are
//   shown to management only: not on the teacher's class card, not in her "saved" message, not in her timeline. (coe-cin v4 also sends
//   no flag to a teacher.)
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  [": ci.flag ? `<span class=\"chip coral\" style=\"margin:8px 0 0 6px\">${esc(ci.flag)}</span>` : '');", ": (ci.flag && D.mgr) ? `<span class=\"chip coral\" style=\"margin:8px 0 0 6px\">${esc(ci.flag)}</span>` : '');"],
  ["(r.classIn.flag ? ' · ' + r.classIn.flag : '')", "(r.classIn.flag && D.mgr ? ' · ' + r.classIn.flag : '')"],
  ["+ (x.flag ? ' · ' + esc(x.flag) : '')", "+ (x.flag && D.mgr ? ' · ' + esc(x.flag) : '')"],
  ["basis + (x.flag ? ' ' + esc(x.flag) : '')", "basis + (x.flag && mgr ? ' ' + esc(x.flag) : '')"],
  ["(ti.status ? ti.status : '') + (ti.flag ? ' · ' + ti.flag : '')", "(ti.status ? ti.status : '') + (ti.flag && mgr ? ' · ' + ti.flag : '')"],
  ["E(ti.status || 'Saved') + (ti.flag ? ' · ' + E(ti.flag) : ''))", "E(ti.status || 'Saved') + (ti.flag && D.mgr ? ' · ' + E(ti.flag) : ''))"],
  ["(r.timeIn.flag ? ' · ' + r.timeIn.flag : ''));", "(r.timeIn.flag && D.mgr ? ' · ' + r.timeIn.flag : ''));"]]);
