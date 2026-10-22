// 22 Oct · Misty: a booked slot is the teacher's schedule "unless student discontinue or stopped lessons".
require('../tools/lib.js')(process.argv[2], [
[`once a student is booked, that lesson is your confirmed schedule; no monthly schedule to submit (2.10).`,
 `once a student is booked, that lesson is your confirmed schedule unless the student cancels or stops, or Operations changes it; no monthly schedule to submit (2.10).`],
]);
