// 843 (optional, parent-facing): the lesson summary picture said "Validity ended October 1, 2026 · extended 12 days ·
// 有效期已于…结束 · 已延长12天". The 12 is days since the deadline date, not an approved extension (see 842).
// New line: "Validity ended October 1, 2026 · 12 days ago · lessons continue · 有效期已于…结束 · 已过12天 · 课程继续".
// Same rule (shown only when the deadline has passed and lessons are left). Skip this patch if Misty wants parents to keep
// reading "extended".
require('../tools/lib.js')(process.argv[2], [
  ["Validity ended ' + en + ' · extended ' + n + ' day' + (n === 1 ? '' : 's') + ' · 有效期已于' + zh + '结束 · 已延长' + n + '天</span><br>'",
   "Validity ended ' + en + ' · ' + n + ' day' + (n === 1 ? '' : 's') + ' ago · lessons continue · 有效期已于' + zh + '结束 · 已过' + n + '天 · 课程继续</span><br>'"]
]);
