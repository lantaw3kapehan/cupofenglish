// 16 Oct · Booked trial classes: teacher name capitalised (Teacher Julia, not julia).
require('../tools/lib.js')(process.argv[2], [
["Teacher ${esc(tName ? String(tName(x.teacher)).replace(/^Teacher\\s+/, '') : x.teacher)}", "Teacher ${esc(String(x.teacher).charAt(0).toUpperCase() + String(x.teacher).slice(1))}"],
]);
