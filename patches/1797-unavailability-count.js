// 1797: the 60-day count left out notices that Operations declined or cancelled (Dezza showed 1, should be 2: 27 Oct and 6 Nov).
//   A notice still means the teacher released booked lessons, so it counts whatever its status; only a notice the teacher
//   withdrew herself (Cancelled by the teacher) is left out.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["&& !/Declined|Cancelled/i.test(r.status || '')",
   "&& !(/Cancelled/i.test(r.status || '') && String(r.decidedBy || '').trim().toLowerCase() === String(r.teacher || '').trim().toLowerCase())"],
]);
