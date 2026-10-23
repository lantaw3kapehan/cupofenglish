// 742: (Misty) Class notice, redone — bilingual labels, the whole package (paid + free + carried over = total), valid-until date,
// clean times (18:30–18:55), and a shorter, clearer cancellation note.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
const a = s.indexOf('function cnText(){'), b = s.indexOf('\nfunction cnPaint(){', a);
if (a < 0 || b < 0) { console.error('cnText not found'); process.exit(1); }
s = s.slice(0, a) + String.raw`function cnText(){
const x = CN, u = +x.units || 0, c = +x.carry || 0, f = +x.free || 0, fm = n => String(Math.round(n * 10) / 10), un = n => fm(n) + (n === 1 ? ' unit' : ' units'), tot = u + c;
const cdz = d => { const y = new Date(String(d || '') + 'T00:00:00'); return isNaN(y) ? '' : cnDate(d) + ' · ' + y.getFullYear() + '年' + (y.getMonth() + 1) + '月' + y.getDate() + '日'; };
const sch = String(x.sch || '').trim().replace(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/g, '$1–$2');
return '📢 CLASS NOTICE 课程通知' + (x.ren ? ' · Renewal 续费' : ' · New 新报名') +
'\n\n🪪 ' + x.name + (x.cn ? ' (' + x.cn + ')' : '') + ' · ' + x.code +
'\n\n📘 Course 课程: ' + (String(x.book || '').trim() || 'Courseware') +
'\n🎫 Package 课程包: ' + (f > 0 && f < u ? fm(u - f) + ' paid 购买 + ' + fm(f) + ' free 赠送 = ' : '') + un(u) +
(c ? '\n➕ Carried over 上期结转: ' + un(c) : '') +
'\n✅ Total 共计: ' + un(tot) + ' (50 min each) = ' + fm(tot * 2) + ' classes × 25 min（共 ' + fm(tot * 2) + ' 节）' +
(x.until ? '\n⏳ Valid until 有效期至: ' + cdz(x.until) : '') +
'\n\n🗓️ Schedule 上课时间\n' + (sch || 'Teacher …') +
(x.date ? '\n\n💳 Purchased 购买日期: ' + cdz(x.date) : '') +
'\n\n🔔 Cancellation 请假须知\n• Please tell us at least 2 hours before class if ' + (x.kid ? 'your child' : 'you') + ' can’t attend.\n• A late cancellation counts as a completed class.\n若无法上课，请至少提前 2 小时告知；临时取消视为已上课。' +
'\n\n❤️ Thank you for your support! 感谢您的理解与支持！';
}` + s.slice(b);
rep("left: r[C.available] })) };", "left: r[C.available], dl: C.deadline != null ? String(r[C.deadline] || '').slice(0, 10) : '' })) };");
rep("free: fr && Math.abs(+fr[1] + +fr[2] - +p.en) < 0.01 ? +fr[2] : '', carry: p.carry || '',", "free: fr && Math.abs(+fr[1] + +fr[2] - +p.en) < 0.01 ? +fr[2] : '', until: /^\\d{4}-\\d{2}-\\d{2}$/.test(p.dl || '') ? p.dl : '', carry: p.carry || '',");
rep("${inp('date', 'Purchased online', 'date')}", "<div class=\"row\" style=\"gap:8px\"><div class=\"grow\">${inp('date', 'Purchased online', 'date')}</div><div class=\"grow\">${inp('until', 'Valid until', 'date')}</div></div>");
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
