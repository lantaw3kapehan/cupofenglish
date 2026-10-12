// Class reminders, minimal wording (English line, Chinese line, meeting ID on its own line only near class time), e.g.
// "Class starts soon · 17:30 ✊ / 马上上课啦 · 17:30 / (blank) / 会议号 Meeting ID: 385-0345-7444".
require('../tools/lib.js')(process.argv[2], [
[
"vo = e.meet ? '\\n腾讯会议号 Meeting ID: ' + e.meet + '（每次同一个会议号 · same every class）' : '';",
"vo = e.meet ? '\\n\\n会议号 Meeting ID: ' + e.meet : '';"
],
[
"if(today && mins <= 0) return 'Class has started (' + t + '). ' + tName(e.teacher || '') + ' is waiting for you! 🙂\\n已经开始上课啦（' + t + '），老师在等你哦！' + vo;",
"if(today && mins <= 0) return 'Class has started · ' + t + ' 🙂\\n已经开始上课啦 · ' + t + vo;"
],
[
"if(today && mins <= 20) return 'Class starts in ' + mins + ' minute' + (mins === 1 ? '' : 's') + ' (' + t + ')! Please get ready ✊\\n还有' + mins + '分钟上课（' + t + '），请准备好哦！' + vo;",
"if(today && mins <= 20) return 'Class starts soon · ' + t + ' ✊\\n马上上课啦 · ' + t + vo;"
],
[
"if(today) return 'Heads up! Class starts at ' + t + ' today! ✊\\n提醒：今天' + t + '上课哦！';",
"if(today) return 'Class today · ' + t + ' ✊\\n今天' + t + '上课哦';"
],
[
"if(tmw) return 'Reminder: class tomorrow at ' + t + '! ✊\\n提醒：明天' + t + '上课哦！';",
"if(tmw) return 'Class tomorrow · ' + t + ' ✊\\n明天' + t + '上课哦';"
],
[
"return 'Reminder: class on ' + s.toLocaleDateString('en-GB', { weekday:'short', day:'numeric', month:'short' }) + ' at ' + t + '! ✊\\n提醒：' + md + ' ' + t + '上课哦！';",
"return 'Class on ' + s.toLocaleDateString('en-GB', { weekday:'short', day:'numeric', month:'short' }) + ' · ' + t + ' ✊\\n' + md + ' ' + t + '上课哦';"
]
]);
