// 2171 (13 Nov · Misty 18:38 "the reminder, especially when the class is near like 10 minutes … keep that short and only the meeting id"):
// within 20 minutes of the start the copied reminder is one short line and the VooV meeting ID, nothing else.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [["      return f(p[0]) + '\\n' + f(p[1]).replace(/\\{T\\}老师/g, T + '老师') + (k === 'on' || k === 'soon' ? vo : '');",
  "      if(k === 'soon') return 'Class at ' + t + ' · ' + t + '上课' + (vo ? vo.replace(/^\\n\\n/, '\\n') : '');   /* 2171: short, the meeting ID only */\n      return f(p[0]) + '\\n' + f(p[1]).replace(/\\{T\\}老师/g, T + '老师') + (k === 'on' || k === 'soon' ? vo : '');"]]);
