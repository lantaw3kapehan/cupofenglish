// 2174 (13 Nov · Misty 18:48 "can this be improved? Class at 21:30 · 21:30上课"): the near-class reminder stays short but reads as a full
// sentence with the student's name: child "Arthur's class starts at 21:30. / Arthur的课21:30开始。", adult "Mr. Jun, your class starts at
// 21:30. / Jun先生，您的课21:30开始。", then the VooV meeting ID.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [["if(k === 'soon') return 'Class at ' + t + ' · ' + t + '上课' + (vo ? vo.replace(/^\\n\\n/, '\\n') : '');",
  "if(k === 'soon') return (ad ? nE + ', your class starts at ' + t + '.\\n' + z + '，您的课' + t + '开始。' : n0 + '\\'s class starts at ' + t + '.\\n' + n0 + '的课' + t + '开始。') + (vo ? vo.replace(/^\\n\\n/, '\\n') : '');   /* 2174 */"]]);
