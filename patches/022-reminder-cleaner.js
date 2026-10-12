// Class reminders, cleaner: the early (2–3 hours before) / tomorrow / later-day reminder is just the two lines (English + Chinese).
// The meeting ID goes only on the 10-minute and "class started" messages, on one short line. The early reminder opens 3 hours before.
require('../tools/lib.js')(process.argv[2], [
[
"vo = e.meet ? '\\n\\nTencent Meeting ID 腾讯会议号: ' + e.meet + '\\n(Same meeting every class · 每次上课都是同一个会议号，也可以在腾讯会议的历史记录里找到哦)' : '';",
"vo = e.meet ? '\\n腾讯会议号 Meeting ID: ' + e.meet + '（每次同一个会议号 · same every class）' : '';"
],
[
"today! ✊\\n提醒：今天' + t + '上课哦！' + vo;",
"today! ✊\\n提醒：今天' + t + '上课哦！';"
],
[
"tomorrow at ' + t + '! ✊\\n提醒：明天' + t + '上课哦！' + vo;",
"tomorrow at ' + t + '! ✊\\n提醒：明天' + t + '上课哦！';"
],
[
"md + ' ' + t + '上课哦！' + vo;",
"md + ' ' + t + '上课哦！';"
],
[
"return m > 20 && m <= 150 ? '2h'",
"return m > 20 && m <= 180 ? '2h'"
],
[
"'10-minute reminder' : '2-hour reminder'",
"'10-minute reminder' : 'Early reminder · 2–3 hours before'"
]
]);
