// 619: class reminders rotate their wording (English + Chinese) so parents don't see the same line every day.
// The choice is fixed per student + day + stage (copying twice gives the same text); it moves on by one each day, and
// students on the same day get different lines.
require('../tools/lib.js')(process.argv[2], [
["if(today && mins <= 0) return 'Class has started · ' + t + ' 🙂\\n已经开始上课啦 · ' + t + vo;\nif(today && mins <= 20) return 'Class starts soon · ' + t + ' ✊\\n马上上课啦 · ' + t + vo;\nif(today) return 'Class today · ' + t + ' ✊\\n今天' + t + '上课哦';\nif(tmw) return 'Class tomorrow · ' + t + ' ✊\\n明天' + t + '上课哦';\nreturn 'Class on ' + s.toLocaleDateString('en-GB', { weekday:'short', day:'numeric', month:'short' }) + ' · ' + t + ' ✊\\n' + md + ' ' + t + '上课哦';",
`const D = s.toLocaleDateString('en-GB', { weekday:'short', day:'numeric', month:'short' });
const V = {
  on: [['Class has started · {t} 🙂', '已经开始上课啦 · {t}'], ['Teacher is waiting in class · {t} 🙂', '老师已经在课堂等你啦 · {t}'], ['Class is on now · {t} · please join 🙂', '正在上课，请尽快进入课堂 · {t}']],
  soon: [['Class starts soon · {t} ✊', '马上上课啦 · {t}'], ['Almost time for class · {t} ⏰', '快上课啦 · {t}'], ['Class in a few minutes · {t} 😊', '还有几分钟就上课啦 · {t}'], ['Headphones ready? Class at {t} 🎧', '准备好耳机，{t}上课哦']],
  today: [['Class today · {t} ✊', '今天{t}上课哦'], ['See you in class today at {t} 😊', '今天{t}见哦～'], ["Today's English class · {t} 📚", '今天{t}有英语课哦'], ['Friendly reminder: class today at {t} 🌟', '温馨提醒：今天{t}上课'], ['Ready for class today? {t} 🙌', '今天{t}上课，准备好了吗？'], ['Class at {t} today · your teacher is looking forward to it 😊', '今天{t}上课，老师期待见到你哦']],
  tmw: [['Class tomorrow · {t} ✊', '明天{t}上课哦'], ['See you tomorrow at {t} 😊', '明天{t}见～'], ['Reminder: class tomorrow at {t} 📚', '提醒：明天{t}有课哦'], ["Don't forget tomorrow's class · {t} 🌟", '明天{t}的课别忘了哦']],
  day: [['Class on {D} · {t} ✊', '{md} {t}上课哦'], ['Next class: {D} · {t} 📚', '下次课：{md} {t}'], ['See you on {D} at {t} 😊', '{md} {t}见哦']]
};
const k = today && mins <= 0 ? 'on' : today && mins <= 20 ? 'soon' : today ? 'today' : tmw ? 'tmw' : 'day', L = V[k];
let h = 0; String(e.code || e.student || e.title || '').toLowerCase().split('').forEach(c => { h = (h * 31 + c.charCodeAt(0)) % 9973; });
const p = L[(h + Math.floor(s.getTime() / 864e5)) % L.length], f = x => x.split('{t}').join(t).split('{D}').join(D).split('{md}').join(md);
return f(p[0]) + '\\n' + f(p[1]) + (k === 'on' || k === 'soon' ? vo : '');`]
]);
