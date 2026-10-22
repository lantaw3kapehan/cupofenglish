// 22 Oct · fix: patch 566 named its record cache STU, which hid the app's STU (the open student) inside the payment
// confirmation module, so the email chip (572) never showed. Renamed to STUC.
require('../tools/lib.js')(process.argv[2], [
["\nconst STU = {};\n", "\nconst STUC = {};\n"],
["(STU[code] ? Promise.resolve(STU[code]) : call('stu', { code }).then(r => (STU[code] = r.data)))", "(STUC[code] ? Promise.resolve(STUC[code]) : call('stu', { code }).then(r => (STUC[code] = r.data)))"],
]);
