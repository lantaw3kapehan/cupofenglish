// 2272 (Misty 16 Nov 18:10 "you have the freedom to name or label videos under BOOKS"): the database now gives course-book videos
// teacher-friendly names ("Unit 3 · Letter Gg · sound & words", "Unit 1 · -am words", "Unit 2 · Reflect · no voice (students describe it)",
// "Unit 4 · Robotic Hands") and clear groups ("Videos", "Videos · Listening & Speaking"). Book lists kept on devices are dropped once more
// so every teacher sees the new names at once. The names also let the class card find "this unit's video".
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [["if(!localStorage.getItem('coe.bkpurge2270')){", "if(!localStorage.getItem('coe.bkpurge2272')){"],
  ["localStorage.setItem('coe.bkpurge2270', '1');", "localStorage.setItem('coe.bkpurge2272', '1');"]]);
