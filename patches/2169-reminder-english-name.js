// 2169 (13 Nov · Misty 18:30 "the chinese translation should still follow the english name"): the Chinese line of the class reminder
// uses the student's English name too (2166 used the Chinese name when known).
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [["const zh = zhName(e) || en,", "const zh = en,"]]);
