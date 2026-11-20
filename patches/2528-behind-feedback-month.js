// 2528 (Misty 15:51 "not December, it's for November"): Behind · monthly feedback now uses the Reports screen's own cycle:
//   the classes month (the month before RP.month, "November 2026") and the real due date (RP.due, e.g. "Dec 9"), not "the 25th".
//   It only shows from 3 days before it is due, so teachers are not "behind" on something not due yet.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["if(m){ const y = +m[1], mo = +m[2]; const py = mo === 1 ? y - 1 : y, pm = mo === 1 ? 12 : mo - 1; due = py + '-' + String(pm).padStart(2, '0') + '-25'; }",
   "let lab2528 = RP.label || '';\n        if(m){ const y = +m[1], mo = +m[2]; const py = mo === 1 ? y - 1 : y, pm = mo === 1 ? 12 : mo - 1; due = py + '-' + String(pm).padStart(2, '0') + '-25';\n          lab2528 = ['January','February','March','April','May','June','July','August','September','October','November','December'][pm - 1] + ' ' + py + ' classes';\n          const dm = /^([A-Za-z]{3})\\w*\\s+(\\d{1,2})$/.exec(String(RP.due || '').trim()); if(dm){ const k = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].indexOf(dm[1].toLowerCase()); if(k > -1){ const dy = k + 1 < pm ? py + 1 : py; due = dy + '-' + String(k + 1).padStart(2, '0') + '-' + String(+dm[2]).padStart(2, '0'); } } }\n        if(due && days(due) < -3) throw 0;   /* 2528: not due within 3 days · not behind */"],
  ["add(t, { w: 'Monthly feedback · ' + by[t] + ' student' + (by[t] === 1 ? '' : 's') + (RP.label ? ' · ' + RP.label : ''),",
   "add(t, { w: 'Monthly feedback · ' + by[t] + ' student' + (by[t] === 1 ? '' : 's') + (lab2528 ? ' · ' + lab2528 : ''),"]
]);
