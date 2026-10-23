// 743: (Misty) class notice — shorter and calmer: lessons counted in 25-min classes (what parents count), one bilingual line each,
// ISO dates both languages read, a one-line cancellation note.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const a = s.indexOf('function cnText(){'), b = s.indexOf('\nfunction cnPaint(){', a);
if (a < 0 || b < 0) { console.error('cnText not found'); process.exit(1); }
s = s.slice(0, a) + String.raw`function cnText(){
const x = CN, u = +x.units || 0, c = +x.carry || 0, f = +x.free || 0, fm = n => String(Math.round(n * 10) / 10), tot = u + c, ext = (f > 0 && f < u) || c > 0;
const sch = String(x.sch || '').trim().replace(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/g, '$1–$2');
const parts = ['Paid 购买 ' + fm((u - (f > 0 && f < u ? f : 0)) * 2)].concat(f > 0 && f < u ? ['Free 赠送 ' + fm(f * 2)] : []).concat(c > 0 ? ['Carried 结转 ' + fm(c * 2)] : []);
return '📢 Class Notice 课程通知 · ' + (x.ren ? 'Renewal 续费' : 'New 新报名') +
'\n\n🪪 ' + x.name + (x.cn ? ' ' + x.cn : '') + ' · ' + x.code +
(String(x.book || '').trim() ? '\n📘 ' + String(x.book).trim() : '') +
'\n\n📦 Lessons 课时' + (ext ? '\n' + parts.join(' + ') + '\n= ' : ' ') + fm(tot * 2) + ' classes 节 × 25 min（' + fm(tot) + (tot === 1 ? ' unit' : ' units') + '）' +
(x.until ? '\n⏳ Valid until 有效期至 ' + x.until : '') +
'\n\n🗓️ ' + (sch || 'Teacher …') +
(x.date ? '\n\n💳 Purchased 购买 ' + x.date : '') +
'\n\n🔔 Please tell us 2 hours before class if ' + (x.kid ? 'your child' : 'you') + ' can’t attend; a late cancellation counts as a class.\n请至少提前 2 小时请假，临时取消视为已上课。' +
'\n\n❤️ Thank you! 感谢您的支持！';
}` + s.slice(b);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
