// 2030 (9 Nov 20:47, Misty: "if not excused like Penny, should it still appear here?" → "yes go ahead"):
//   Excuse a system issue lists first the lates that still count (not decided yet, or waived: a waive removes the deduction but
//   the late still counts for awards and Excellence). Lates already decided with a deduction (Excused / Unexcused · ₱) move into a
//   folded "Already decided · penalty applied" section; their confirm screen says the deduction is cancelled too.
const file = process.argv[2];
require('../tools/lib.js')(file, [
 [
  "return '<h3 class=\"x27-h\">Late time-ins · ' + T.filter(x => !x.done).length + '</h3>' + (T.length ? T.map(tiRow).join('') : '<div class=\"small mute\">None in the last 14 days.</div>')",
  "const pen = x => !x.done && /^(Excused|Unexcused) · ₱/.test(String(x.dec || '')), T1 = T.filter(x => !pen(x)), T2 = T.filter(pen);   /* 2030 */\n    return '<h3 class=\"x27-h\">Late time-ins · ' + T1.filter(x => !x.done).length + '</h3>' + (T1.length ? T1.map(tiRow).join('') : '<div class=\"small mute\">None waiting in the last 14 days.</div>')\n      + (T2.length ? '<details class=\"x27-d\"><summary class=\"small\"><b>Already decided · penalty applied · ' + T2.length + '</b> <span class=\"mute\">· only if a system issue is found later</span></summary>' + T2.map(tiRow).join('') + '</details>' : '')"
 ],
 [
  "' Growth, Perfect Attendance awards and ranks are updated.",
  "(kind === 'timein' && /^(Excused|Unexcused) · ₱/.test(String(x.dec || '')) ? ' <b style=\"color:#B03A2E\">This also cancels the ' + esc((String(x.dec).match(/₱[\\d,]+/) || ['deduction'])[0]) + ' deduction.</b>' : '') + ' Growth, Perfect Attendance awards and ranks are updated."
 ],
 [
  ".lqm a.x27-l{color:#00636B;font-weight:600;cursor:pointer;font-size:14px}",
  ".lqm a.x27-l{color:#00636B;font-weight:600;cursor:pointer;font-size:14px}.x27-d{margin-top:14px;border-top:1px solid #F1EFF5;padding-top:10px}.x27-d>summary{cursor:pointer;color:#4C4868;padding:4px 0}"
 ]
]);
