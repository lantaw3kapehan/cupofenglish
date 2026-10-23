// 744: (Misty) class notice icons — a restrained, business-style set: 📌 notice · 👤 student · 📘 course · 🕒 lessons · 📅 valid until
// · 🗓️ schedule · 🧾 purchased · ℹ️ cancellation. No party/heart emojis.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
rep("return '📢 Class Notice 课程通知 · '", "return '📌 Class Notice 课程通知 · '");
rep("'\\n\\n🪪 ' + x.name + (x.cn ? ' ' + x.cn : '') + ' · ' + x.code +", "'\\n\\n👤 ' + x.name + (x.cn ? ' ' + x.cn : '') + ' · ' + x.code +");
rep("'\\n\\n📦 Lessons 课时'", "'\\n\\n🕒 Lessons 课时'");
rep("(x.until ? '\\n⏳ Valid until 有效期至 ' + x.until : '') +", "(x.until ? '\\n📅 Valid until 有效期至 ' + x.until : '') +");
rep("(x.date ? '\\n\\n💳 Purchased 购买 ' + x.date : '') +", "(x.date ? '\\n\\n🧾 Purchased 购买 ' + x.date : '') +");
rep("'\\n\\n🔔 Please tell us 2 hours before class", "'\\n\\nℹ️ Please tell us 2 hours before class");
rep("'\\n\\n❤️ Thank you! 感谢您的支持！';", "'\\n\\nThank you for your support. 感谢您的支持！';");
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
