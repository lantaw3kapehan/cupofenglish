// 1819: final QA · Teachers › Team showed "275 students" while Students shows 220 active: the number adds each teacher's students, so a
//   student with two teachers counts twice. The tile now reads "student–teacher pairs" so the two numbers are not confused.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [["+ st + '</b><span>students</span></div></div>'", "+ st + '</b><span>student–teacher pairs</span></div></div>'"]]);
