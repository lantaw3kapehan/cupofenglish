// 2199 (14 Nov): Timeline polish after the first look on a real day. Its class names now start with "t7" (short names such as
// .hd and .r are used elsewhere in the app and pulled the hour labels out of line), each hour is 110 px wide so a 25-minute
// class shows the student's name (the timeline scrolls sideways, teacher names stay in view), and the name column is 160 px.
const fs = require("fs"), lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [[fs.readFileSync(__dirname + "/2199-old.txt", "utf8"), fs.readFileSync(__dirname + "/2199-new.txt", "utf8")]]);
