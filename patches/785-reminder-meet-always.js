// 785: (Misty) "for class reminders, the meeting IDs dont show" — the early reminders (today / tomorrow / a later day) left the
// VooV meeting ID out; only the last-20-minutes reminder had it. Now every reminder ends with "#腾讯会议：xxx-xxx-xxx" when the class has one.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["return f(p[0]) + '\\n' + f(p[1]) + (k === 'on' || k === 'soon' ? vo : '');", "return f(p[0]) + '\\n' + f(p[1]) + vo;"]
]);
