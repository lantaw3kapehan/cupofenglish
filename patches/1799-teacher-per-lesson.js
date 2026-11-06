// 1799: (Misty 6 Nov 15:25, April's form) the teacher's notice form also lists each booked lesson with its own notice and charge
//   (under 4 h charged · 4 h or more no charge for an emergency with proof · planned under 7 days at the excused rate), as the management card does.
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
lib(file, [[fs.readFileSync(__dirname + '/1799-teacher-per-lesson.old.txt', 'utf8'), fs.readFileSync(__dirname + '/1799-teacher-per-lesson.new.txt', 'utf8')]]);
