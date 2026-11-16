// 2263 (Misty 16 Nov 17:13): "class starts at" message keeps a blank line before the Tencent Meeting ID, for readability:
//   Luna's class starts at 17:30.
//   Luna的课17:30开始。
//
//   #腾讯会议：385-0345-7444
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [["(vo ? vo.replace(/^\\n\\n/, '\\n') : '');   /* 2174 */", "(vo || '');   /* 2174 · 2263: blank line before the meeting ID */"]]);
